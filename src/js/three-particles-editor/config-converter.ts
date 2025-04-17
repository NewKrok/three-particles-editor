import {
  CurveFunctionId,
  getCurveFunction,
  LifeTimeCurve,
  TimeMode,
} from '@newkrok/three-particles';
import {
  Constant,
  ParticleSystemConfig,
  RandomBetweenTwoConstants,
} from '@newkrok/three-particles';
import * as THREE from 'three';

/**
 * Converts a value from the old MinMaxNumber format to the new format
 * (Constant | RandomBetweenTwoConstants | LifetimeCurve)
 */
const convertMinMaxValue = (
  value: number | { min?: number; max?: number },
  preserveRange = false,
  preserveStructure = false
): Constant | RandomBetweenTwoConstants => {
  // Use type assertions where necessary to handle optional properties
  if (typeof value === 'number') {
    // If it's just a number, return it as a Constant
    return value;
  } else if (value.min !== undefined && value.max !== undefined && value.min === value.max) {
    // If min and max are the same, return as a Constant or preserve the structure
    return preserveStructure ? { min: value.min, max: value.min } : value.min;
  } else if (value.min !== undefined && value.max === undefined) {
    // If only min is defined, use it as a constant or preserve the structure
    return preserveStructure ? { min: value.min } : value.min;
  } else if (value.min === undefined && value.max !== undefined) {
    // If only max is defined
    if (preserveRange) {
      // For orbital velocity, preserve the range from 0 to max
      return {
        min: 0,
        max: value.max,
      };
    } else {
      // For other properties, use max as a constant or preserve the structure
      return preserveStructure ? { max: value.max } : value.max;
    }
  } else {
    // Otherwise return as RandomBetweenTwoConstants with the original values
    return {
      min: value.min,
      max: value.max,
    };
  }
};

/**
 * Updates the startLifetime value to the new default (5.0 instead of 2.0)
 * Also preserves the exact min/max values when they are the same
 */
const updateStartLifetime = (
  value: number | { min?: number; max?: number }
): Constant | RandomBetweenTwoConstants => {
  if (typeof value === 'number' && value === 2.0) {
    return 5.0;
  } else if (typeof value === 'object' && value.min === 2.0 && value.max === 2.0) {
    return 5.0;
  } else if (
    typeof value === 'object' &&
    value.min !== undefined &&
    value.max !== undefined &&
    value.min === value.max
  ) {
    // When min and max are the same, preserve the exact value as a min/max object to maintain the structure
    return { min: value.min, max: value.min };
  } else {
    return convertMinMaxValue(value);
  }
};

/**
 * Converts an old particle system configuration to the new format
 * compatible with @newkrok/three-particles 2.0.2
 */
/**
 * Legacy configuration type (pre-2.0.0)
 * This interface defines the structure of legacy particle system configurations
 * with properties that may be present in old configurations.
 */
interface LegacyParticleSystemConfig {
  // Basic properties
  startLifetime?: number | { min?: number; max?: number };
  startDelay?: number | { min?: number; max?: number };
  startSpeed?: number | { min?: number; max?: number };
  startSize?: number | { min?: number; max?: number };
  startRotation?: number | { min?: number; max?: number };
  startOpacity?: number | { min?: number; max?: number };

  // Lifetime properties
  sizeOverLifetime?: {
    isActive?: boolean;
    curveFunction?: CurveFunctionId;
    bezierPoints?: Array<{ x: number; y: number; percentage?: number }>;
  };

  opacityOverLifetime?: {
    isActive?: boolean;
    curveFunction?: CurveFunctionId;
    bezierPoints?: Array<{ x: number; y: number; percentage?: number }>;
  };

  rotationOverLifetime?: {
    isActive?: boolean;
    min?: number;
    max?: number;
  };

  // Velocity properties
  velocityOverLifetime?: {
    isActive?: boolean;
    linear?: {
      x?: { min?: number; max?: number };
      y?: { min?: number; max?: number };
      z?: { min?: number; max?: number };
    };
    orbital?: {
      x?: { min?: number; max?: number };
      y?: { min?: number; max?: number };
      z?: { min?: number; max?: number };
    };
  };

  // Texture sheet animation properties
  textureSheetAnimation?: {
    tiles?: { x: number; y: number };
    timeMode?: string;
    fps?: number;
    startFrame?: number | { min?: number; max?: number };
  };

  // Other properties
  [key: string]: unknown;
}

export const convertToNewFormat = (oldConfig: LegacyParticleSystemConfig): ParticleSystemConfig => {
  // Use type assertion to handle the conversion from legacy config to new format
  // This is necessary because the structure of legacy configs can vary
  const newConfig = { ...oldConfig } as unknown as ParticleSystemConfig;

  // Convert MinMaxNumber properties to Constant | RandomBetweenTwoConstants | LifetimeCurve
  if (oldConfig.startDelay !== undefined) {
    newConfig.startDelay = convertMinMaxValue(
      oldConfig.startDelay as number | { min: number; max: number },
      false,
      false
    );
  }

  if (oldConfig.startLifetime !== undefined) {
    newConfig.startLifetime = updateStartLifetime(
      oldConfig.startLifetime as number | { min: number; max: number }
    );
  }

  if (oldConfig.startSpeed !== undefined) {
    // For startSpeed, we need to preserve the structure when only max is defined
    // This ensures that {max: 2.2} is converted to {max: 2.2} and not to a constant
    newConfig.startSpeed = convertMinMaxValue(
      oldConfig.startSpeed as number | { min: number; max: number },
      false,
      true // Preserve structure for startSpeed to maintain max value when only max is defined
    );
  }

  if (oldConfig.startSize !== undefined) {
    newConfig.startSize = convertMinMaxValue(
      oldConfig.startSize as number | { min: number; max: number },
      false,
      true // Preserve structure for startSize to maintain min/max format
    );
  }

  if (oldConfig.startRotation !== undefined) {
    newConfig.startRotation = convertMinMaxValue(
      oldConfig.startRotation as number | { min: number; max: number },
      false,
      false
    );
  }

  // Only add startOpacity if it was present in the original config
  // This prevents adding default values to configs that didn't have this property
  if (oldConfig.startOpacity !== undefined) {
    newConfig.startOpacity = convertMinMaxValue(
      oldConfig.startOpacity as number | { min: number; max: number },
      false,
      true // Preserve structure for startOpacity to maintain min/max format
    );
  } else {
    // If startOpacity was not in the original config, make sure it's not in the new config either
    delete newConfig.startOpacity;
  }

  // Handle velocityOverLifetime if it exists
  if (oldConfig.velocityOverLifetime) {
    // Make sure the structure is properly initialized
    if (!newConfig.velocityOverLifetime) {
      newConfig.velocityOverLifetime = {
        isActive: oldConfig.velocityOverLifetime.isActive ?? true,
        linear: {},
        orbital: {},
      };
    }

    // Handle linear property
    if (oldConfig.velocityOverLifetime.linear) {
      if (!newConfig.velocityOverLifetime.linear) {
        newConfig.velocityOverLifetime.linear = {};
      }

      // Handle x, y, z components
      ['x', 'y', 'z'].forEach((axis) => {
        if (oldConfig.velocityOverLifetime.linear?.[axis]) {
          // For linear velocity, also preserve the structure to maintain exact min/max values
          newConfig.velocityOverLifetime.linear[axis] = convertMinMaxValue(
            oldConfig.velocityOverLifetime.linear[axis] as number | { min: number; max: number },
            false,
            true // Preserve structure to maintain exact min/max values
          );
        }
      });
    }

    // Handle orbital property
    if (oldConfig.velocityOverLifetime.orbital) {
      if (!newConfig.velocityOverLifetime.orbital) {
        newConfig.velocityOverLifetime.orbital = {};
      }

      // Handle x, y, z components
      ['x', 'y', 'z'].forEach((axis) => {
        if (oldConfig.velocityOverLifetime.orbital?.[axis]) {
          // For orbital velocity, preserve the range when only max is provided
          // Also preserve the structure to maintain exact min/max values
          newConfig.velocityOverLifetime.orbital[axis] = convertMinMaxValue(
            oldConfig.velocityOverLifetime.orbital[axis] as number | { min: number; max: number },
            true,
            true // Preserve structure to maintain exact min/max values
          );
        }
      });
    }
  }

  // Handle sizeOverLifetime, opacityOverLifetime, rotationOverLifetime if they exist
  // For sizeOverLifetime, handle both with and without isActive property
  if (oldConfig.sizeOverLifetime) {
    // Convert to the new format with LifetimeCurve
    if (oldConfig.sizeOverLifetime?.bezierPoints && !oldConfig.sizeOverLifetime?.curveFunction) {
      // Take the bezier points directly from the original configuration
      // Don't calculate new percentage values
      const processedBezierPoints = oldConfig.sizeOverLifetime.bezierPoints.map((point) => {
        return { ...point };
      });

      newConfig.sizeOverLifetime = {
        // Only set isActive to true if it was explicitly set to true in the original config
        // or if it wasn't specified at all (default to false in old API)
        isActive: oldConfig.sizeOverLifetime.isActive ?? false,
        lifetimeCurve: {
          type: LifeTimeCurve.BEZIER,
          bezierPoints: processedBezierPoints,
        },
      };
    } else if (oldConfig.sizeOverLifetime?.curveFunction) {
      newConfig.sizeOverLifetime = {
        // Only set isActive to true if it was explicitly set to true in the original config
        // or if it wasn't specified at all (default to false in old API)
        isActive: oldConfig.sizeOverLifetime.isActive ?? false,
        lifetimeCurve: {
          type: LifeTimeCurve.EASING,
          curveFunction: getCurveFunction(oldConfig.sizeOverLifetime.curveFunction),
        },
      };
    } else if (!newConfig.sizeOverLifetime?.lifetimeCurve) {
      // If no bezierPoints and no lifetimeCurve, create default
      newConfig.sizeOverLifetime = {
        // Only set isActive to true if it was explicitly set to true in the original config
        // or if it wasn't specified at all (default to false in old API)
        isActive: oldConfig.sizeOverLifetime.isActive ?? false,
        lifetimeCurve: {
          type: LifeTimeCurve.BEZIER,
          // Default curve that matches the old API behavior
          bezierPoints: [
            { x: 0, y: 0, percentage: 0 },
            { x: 1, y: 1, percentage: 1 },
          ],
        },
      };
    }
  }

  if (oldConfig.opacityOverLifetime) {
    // Convert to the new format with LifetimeCurve
    if (
      oldConfig.opacityOverLifetime?.bezierPoints &&
      !oldConfig.opacityOverLifetime?.curveFunction
    ) {
      // Take the bezier points directly from the original configuration
      // Don't calculate new percentage values
      const processedBezierPoints = oldConfig.opacityOverLifetime.bezierPoints.map((point) => {
        return { ...point };
      });

      newConfig.opacityOverLifetime = {
        // Only set isActive to true if it was explicitly set to true in the original config
        // or if it wasn't specified at all (default to false in old API)
        isActive: oldConfig.opacityOverLifetime.isActive ?? false,
        lifetimeCurve: {
          type: LifeTimeCurve.BEZIER,
          bezierPoints: processedBezierPoints,
        },
      };
    } else if (oldConfig.opacityOverLifetime?.curveFunction) {
      newConfig.opacityOverLifetime = {
        // Only set isActive to true if it was explicitly set to true in the original config
        // or if it wasn't specified at all (default to false in old API)
        isActive: oldConfig.opacityOverLifetime.isActive ?? false,
        lifetimeCurve: {
          type: LifeTimeCurve.EASING,
          curveFunction: getCurveFunction(oldConfig.opacityOverLifetime.curveFunction),
        },
      };
    } else if (!newConfig.opacityOverLifetime?.lifetimeCurve) {
      // If no bezierPoints and no lifetimeCurve, create default
      newConfig.opacityOverLifetime = {
        // Only set isActive to true if it was explicitly set to true in the original config
        // or if it wasn't specified at all (default to false in old API)
        isActive: oldConfig.opacityOverLifetime.isActive ?? false,
        lifetimeCurve: {
          type: LifeTimeCurve.BEZIER,
          // Default curve that matches the old API behavior
          bezierPoints: [
            { x: 0, y: 0, percentage: 0 },
            { x: 1, y: 1, percentage: 1 },
          ],
        },
      };
    }
  }

  if (oldConfig.rotationOverLifetime) {
    // Convert to the new format with RandomBetweenTwoConstants
    if (!newConfig.rotationOverLifetime) {
      newConfig.rotationOverLifetime = {
        // Preserve isActive property, default to true if not specified
        isActive: oldConfig.rotationOverLifetime.isActive ?? true,
        // Preserve exact min/max values
        min:
          oldConfig.rotationOverLifetime.min !== undefined ? oldConfig.rotationOverLifetime.min : 0,
        max:
          oldConfig.rotationOverLifetime.max !== undefined ? oldConfig.rotationOverLifetime.max : 0,
      };
    }
  }
  // Handle textureSheetAnimation if it exists
  if (oldConfig.textureSheetAnimation) {
    // Create a new textureSheetAnimation object with proper type casting
    const oldTextureSheetAnimation = oldConfig.textureSheetAnimation as {
      tiles?: { x: number; y: number };
      timeMode?: string;
      fps?: number;
      startFrame?: number | { min?: number; max?: number };
    };

    if (!newConfig.textureSheetAnimation) {
      // Create a new object with explicit type casting for each property
      // Use a specific type instead of 'any' to satisfy ESLint rules
      newConfig.textureSheetAnimation = {} as {
        tiles?: THREE.Vector2;
        timeMode?: TimeMode;
        fps?: number;
        startFrame?: number | { min: number; max: number };
      };

      // Copy tiles with proper type conversion if it exists
      if (oldTextureSheetAnimation.tiles) {
        // Create a THREE.Vector2 object with the appropriate x and y values
        newConfig.textureSheetAnimation.tiles = new THREE.Vector2(
          oldTextureSheetAnimation.tiles.x,
          oldTextureSheetAnimation.tiles.y
        );
      }

      // Copy timeMode with proper type conversion if it exists
      if (oldTextureSheetAnimation.timeMode) {
        // Convert string to TimeMode enum if possible, or use as is with type assertion
        newConfig.textureSheetAnimation.timeMode = oldTextureSheetAnimation.timeMode as TimeMode;
      }

      // Copy fps with proper type conversion if it exists
      if (oldTextureSheetAnimation.fps !== undefined) {
        newConfig.textureSheetAnimation.fps = oldTextureSheetAnimation.fps;
      }
    }

    // Handle startFrame property which can be a number or an object with min/max
    if (oldTextureSheetAnimation.startFrame !== undefined) {
      // Ensure startFrame is always a number or a proper RandomBetweenTwoConstants object
      // with both min and max properties defined
      const value = oldTextureSheetAnimation.startFrame;
      if (typeof value === 'number') {
        newConfig.textureSheetAnimation.startFrame = value;
      } else if (value.min !== undefined && value.max !== undefined) {
        newConfig.textureSheetAnimation.startFrame = { min: value.min, max: value.max };
      } else if (value.min !== undefined && value.max === undefined) {
        newConfig.textureSheetAnimation.startFrame = { min: value.min, max: value.min };
      } else if (value.min === undefined && value.max !== undefined) {
        // When only max is defined, set min to 0
        newConfig.textureSheetAnimation.startFrame = { min: 0, max: value.max };
      } else {
        // Default case, should not happen with valid input
        newConfig.textureSheetAnimation.startFrame = 0;
      }
    }
  }
  return newConfig;
};
