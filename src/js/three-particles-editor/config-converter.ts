import { LifeTimeCurve } from '@newkrok/three-particles';
import {
  Constant,
  ParticleSystemConfig,
  RandomBetweenTwoConstants,
} from '@newkrok/three-particles';

/**
 * Converts a value from the old MinMaxNumber format to the new format
 * (Constant | RandomBetweenTwoConstants | LifetimeCurve)
 */
const convertMinMaxValue = (
  value: number | { min?: number; max?: number },
  preserveRange = false
): Constant | RandomBetweenTwoConstants => {
  // Use type assertions where necessary to handle optional properties
  if (typeof value === 'number') {
    // If it's just a number, return it as a Constant
    return value;
  } else if (value.min !== undefined && value.max !== undefined && value.min === value.max) {
    // If min and max are the same, return as a Constant
    return value.min;
  } else if (value.min !== undefined && value.max === undefined) {
    // If only min is defined, use it as both min and max
    return value.min;
  } else if (value.min === undefined && value.max !== undefined) {
    // If only max is defined
    if (preserveRange) {
      // For orbital velocity, preserve the range from 0 to max
      return {
        min: 0,
        max: value.max,
      };
    } else {
      // For other properties, use max as a constant
      return value.max;
    }
  } else {
    // Otherwise return as RandomBetweenTwoConstants
    return {
      min: value.min ?? 0,
      max: value.max ?? 0,
    };
  }
};

/**
 * Updates the startLifetime value to the new default (5.0 instead of 2.0)
 */
const updateStartLifetime = (
  value: number | { min: number; max: number }
): Constant | RandomBetweenTwoConstants => {
  if (typeof value === 'number' && value === 2.0) {
    return 5.0;
  } else if (typeof value === 'object' && value.min === 2.0 && value.max === 2.0) {
    return 5.0;
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
    bezierPoints?: Array<{ x: number; y: number; percentage?: number }>;
  };

  opacityOverLifetime?: {
    isActive?: boolean;
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
      oldConfig.startDelay as number | { min: number; max: number }
    );
  }

  if (oldConfig.startLifetime !== undefined) {
    newConfig.startLifetime = updateStartLifetime(
      oldConfig.startLifetime as number | { min: number; max: number }
    );
  }

  if (oldConfig.startSpeed !== undefined) {
    newConfig.startSpeed = convertMinMaxValue(
      oldConfig.startSpeed as number | { min: number; max: number }
    );
  }

  if (oldConfig.startSize !== undefined) {
    newConfig.startSize = convertMinMaxValue(
      oldConfig.startSize as number | { min: number; max: number }
    );
  }

  if (oldConfig.startRotation !== undefined) {
    newConfig.startRotation = convertMinMaxValue(
      oldConfig.startRotation as number | { min: number; max: number }
    );
  }

  if (oldConfig.startOpacity !== undefined) {
    newConfig.startOpacity = convertMinMaxValue(
      oldConfig.startOpacity as number | { min: number; max: number }
    );
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
          newConfig.velocityOverLifetime.linear[axis] = convertMinMaxValue(
            oldConfig.velocityOverLifetime.linear[axis] as number | { min: number; max: number }
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
          newConfig.velocityOverLifetime.orbital[axis] = convertMinMaxValue(
            oldConfig.velocityOverLifetime.orbital[axis] as number | { min: number; max: number },
            true
          );
        }
      });
    }
  }

  // Handle sizeOverLifetime, opacityOverLifetime, rotationOverLifetime if they exist
  // For sizeOverLifetime, handle both with and without isActive property
  if (oldConfig.sizeOverLifetime) {
    // Convert to the new format with LifetimeCurve
    if (oldConfig.sizeOverLifetime.bezierPoints) {
      newConfig.sizeOverLifetime = {
        isActive: true, // Always set isActive to true if bezierPoints exist
        lifetimeCurve: {
          type: LifeTimeCurve.BEZIER,
          bezierPoints: [...oldConfig.sizeOverLifetime.bezierPoints],
        },
      };
    } else if (!newConfig.sizeOverLifetime?.lifetimeCurve) {
      // If no bezierPoints and no lifetimeCurve, create default
      newConfig.sizeOverLifetime = {
        isActive: oldConfig.sizeOverLifetime.isActive ?? true,
        lifetimeCurve: {
          type: LifeTimeCurve.BEZIER,
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
    if (oldConfig.opacityOverLifetime.bezierPoints) {
      newConfig.opacityOverLifetime = {
        isActive: true, // Always set isActive to true if bezierPoints exist
        lifetimeCurve: {
          type: LifeTimeCurve.BEZIER,
          bezierPoints: [...oldConfig.opacityOverLifetime.bezierPoints],
        },
      };
    } else if (!newConfig.opacityOverLifetime?.lifetimeCurve) {
      // If no bezierPoints and no lifetimeCurve, create default
      newConfig.opacityOverLifetime = {
        isActive: oldConfig.opacityOverLifetime.isActive ?? true,
        lifetimeCurve: {
          type: LifeTimeCurve.BEZIER,
          bezierPoints: [
            { x: 0, y: 0, percentage: 0 },
            { x: 1, y: 1, percentage: 1 },
          ],
        },
      };
    }
  }

  if (oldConfig.rotationOverLifetime && oldConfig.rotationOverLifetime.isActive) {
    // Convert to the new format with RandomBetweenTwoConstants
    if (!newConfig.rotationOverLifetime) {
      newConfig.rotationOverLifetime = {
        isActive: true,
        min: oldConfig.rotationOverLifetime.min || 0,
        max: oldConfig.rotationOverLifetime.max || 0,
      };
    }
  }

  return newConfig;
};
