import { LifeTimeCurve } from '@newkrok/three-particles';
import { Constant, ParticleSystemConfig, RandomBetweenTwoConstants } from '@newkrok/three-particles';

/**
 * Converts a value from the old MinMaxNumber format to the new format
 * (Constant | RandomBetweenTwoConstants | LifetimeCurve)
 */
const convertMinMaxValue = (
  value: number | { min: number; max: number }
): Constant | RandomBetweenTwoConstants => {
  if (typeof value === 'number') {
    // If it's just a number, return it as a Constant
    return value;
  } else if (value.min === value.max) {
    // If min and max are the same, return as a Constant
    return value.min;
  } else {
    // Otherwise return as RandomBetweenTwoConstants
    return {
      min: value.min,
      max: value.max,
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
export const convertToNewFormat = (oldConfig: any): ParticleSystemConfig => {
  const newConfig: ParticleSystemConfig = { ...oldConfig };

  // Convert MinMaxNumber properties to Constant | RandomBetweenTwoConstants | LifetimeCurve
  if (oldConfig.startDelay !== undefined) {
    newConfig.startDelay = convertMinMaxValue(oldConfig.startDelay);
  }

  if (oldConfig.startLifetime !== undefined) {
    newConfig.startLifetime = updateStartLifetime(oldConfig.startLifetime);
  }

  if (oldConfig.startSpeed !== undefined) {
    newConfig.startSpeed = convertMinMaxValue(oldConfig.startSpeed);
  }

  if (oldConfig.startSize !== undefined) {
    newConfig.startSize = convertMinMaxValue(oldConfig.startSize);
  }

  if (oldConfig.startRotation !== undefined) {
    newConfig.startRotation = convertMinMaxValue(oldConfig.startRotation);
  }

  if (oldConfig.startOpacity !== undefined) {
    newConfig.startOpacity = convertMinMaxValue(oldConfig.startOpacity);
  }

  // Handle sizeOverLifetime, opacityOverLifetime, rotationOverLifetime if they exist
  if (oldConfig.sizeOverLifetime && oldConfig.sizeOverLifetime.isActive) {
    // Convert to the new format with LifetimeCurve
    if (!newConfig.sizeOverLifetime) {
      newConfig.sizeOverLifetime = {
        isActive: true,
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

  if (oldConfig.opacityOverLifetime && oldConfig.opacityOverLifetime.isActive) {
    // Convert to the new format with LifetimeCurve
    if (!newConfig.opacityOverLifetime) {
      newConfig.opacityOverLifetime = {
        isActive: true,
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
