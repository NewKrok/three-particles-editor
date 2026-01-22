/**
 * Utility functions for particle system configuration
 */

/**
 * Determines if a particle system configuration is from version 2.0.0 or newer
 *
 * @param config The particle system configuration to check
 * @returns True if the configuration is from version 2.0.0 or newer, false otherwise
 */
export const isConfigV2 = (config: any): boolean => {
  if (!config) return false;

  // First, check for explicit version information in metadata
  // If editorVersion is present and >= 2.0.0, it's definitely v2.x
  if (config._editorData?.metadata?.editorVersion) {
    const version = config._editorData.metadata.editorVersion;
    // Parse major version number (e.g., "2.3.0" -> 2)
    const majorVersion = parseInt(version.split('.')[0], 10);
    if (majorVersion >= 2) {
      return true;
    }
  }

  // The key difference between v1.x and v2.x configs is how lifetime curves are handled
  // In v1.x, bezierPoints are directly in sizeOverLifetime/opacityOverLifetime
  // In v2.x, they are inside a lifetimeCurve object with a type property

  // First check for any v1.x specific structures
  // If we find any v1.x structures, we'll consider it a pre-v2.0.0 config for safety

  // Check if sizeOverLifetime has bezierPoints directly (not in lifetimeCurve)
  if (config.sizeOverLifetime?.bezierPoints && !config.sizeOverLifetime?.lifetimeCurve) {
    return false;
  }

  // Check if opacityOverLifetime has bezierPoints directly (not in lifetimeCurve)
  if (config.opacityOverLifetime?.bezierPoints && !config.opacityOverLifetime?.lifetimeCurve) {
    return false;
  }

  // If we have rotationOverLifetime with min/max but no lifetimeCurve, it's v1.x
  if (
    config.rotationOverLifetime &&
    config.rotationOverLifetime.min !== undefined &&
    config.rotationOverLifetime.max !== undefined &&
    !config.rotationOverLifetime.lifetimeCurve
  ) {
    return false;
  }

  // Check for mixed configurations first
  // If we have both v1.x and v2.x features, consider it pre-v2.0.0 for safety
  let hasV1Features = false;
  let hasV2Features = false;

  // Check for v1.x bezierPoints in any component
  if (config.sizeOverLifetime?.bezierPoints || config.opacityOverLifetime?.bezierPoints) {
    hasV1Features = true;
  }

  // Check for v2.x lifetimeCurve in any component
  if (config.sizeOverLifetime?.lifetimeCurve || config.opacityOverLifetime?.lifetimeCurve) {
    hasV2Features = true;
  }

  // If we have both v1.x and v2.x features, consider it pre-v2.0.0 for safety
  if (hasV1Features && hasV2Features) {
    return false;
  }

  // Now check for definitive v2.x structures
  // If sizeOverLifetime or opacityOverLifetime has a lifetimeCurve property, it's v2.x
  if (config.sizeOverLifetime?.lifetimeCurve) {
    return true;
  }

  if (config.opacityOverLifetime?.lifetimeCurve) {
    return true;
  }

  // Check if textureSheetAnimation has startFrame with both min and max properties
  if (
    config.textureSheetAnimation?.startFrame &&
    typeof config.textureSheetAnimation.startFrame === 'object' &&
    'min' in config.textureSheetAnimation.startFrame &&
    'max' in config.textureSheetAnimation.startFrame
  ) {
    return true;
  }

  // Check if velocityOverLifetime has the new structure with linear and orbital objects
  // containing x, y, z objects with min/max properties
  if (
    config.velocityOverLifetime?.linear?.x &&
    typeof config.velocityOverLifetime.linear.x === 'object' &&
    'min' in config.velocityOverLifetime.linear.x &&
    'max' in config.velocityOverLifetime.linear.x
  ) {
    return true;
  }

  // Now check for definitive v1.x structures
  // If sizeOverLifetime or opacityOverLifetime has bezierPoints directly (not in lifetimeCurve), it's v1.x
  if (config.sizeOverLifetime?.bezierPoints && !config.sizeOverLifetime?.lifetimeCurve) {
    return false;
  }

  if (config.opacityOverLifetime?.bezierPoints && !config.opacityOverLifetime?.lifetimeCurve) {
    return false;
  }

  // If we have rotationOverLifetime with min/max but no lifetimeCurve, it's v1.x
  if (
    config.rotationOverLifetime &&
    config.rotationOverLifetime.min !== undefined &&
    config.rotationOverLifetime.max !== undefined &&
    !config.rotationOverLifetime.lifetimeCurve
  ) {
    return false;
  }

  // Check for startLifetime, startSpeed, startSize with min/max properties
  // Both v1.x and v2.x can have these, but in v2.x they should be consistent across all properties
  let hasV2Structure = false;
  let hasV1Structure = false;

  [
    'startLifetime',
    'startSpeed',
    'startSize',
    'startRotation',
    'startOpacity',
    'startDelay',
  ].forEach((prop) => {
    if (config[prop]) {
      if (typeof config[prop] === 'object' && 'min' in config[prop] && 'max' in config[prop]) {
        // This looks like a v2.x RandomBetweenTwoConstants
        hasV2Structure = true;
      } else if (typeof config[prop] === 'object' && Object.keys(config[prop]).length > 2) {
        // v1.x might have additional properties
        hasV1Structure = true;
      }
    }
  });

  if (hasV2Structure && !hasV1Structure) {
    return true;
  }

  // If we couldn't definitively determine the version, check if this is the default config
  // from v2.0.0, which has a specific structure
  if (
    config.startLifetime?.min === 5 &&
    config.startLifetime?.max === 5 &&
    config.velocityOverLifetime?.linear?.x?.min === 0 &&
    config.velocityOverLifetime?.linear?.x?.max === 0
  ) {
    return true;
  }

  // If we still couldn't determine, assume it's v1.x for safety
  return false;
};
