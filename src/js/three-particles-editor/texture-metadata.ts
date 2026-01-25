import { TextureId } from './texture-config';

/**
 * Texture metadata with creation dates
 * Used for sorting textures by date (newest first)
 */
export const textureMetadata: Record<string, { addedDate: string }> = {
  // 2026-01-25 - Latest additions
  [TextureId.VORTEX]: { addedDate: '2026-01-25' },
  [TextureId.BUBBLES]: { addedDate: '2026-01-25' },

  // 2026-01-24
  [TextureId.SOFT_SMOKE]: { addedDate: '2026-01-24' },
  [TextureId.STARBURST]: { addedDate: '2026-01-24' },
  [TextureId.RADIAL_BURST]: { addedDate: '2026-01-24' },
  [TextureId.LIGHT_STREAK]: { addedDate: '2026-01-24' },

  // 2022-04-28
  [TextureId.ROCKS]: { addedDate: '2022-04-28' },
  [TextureId.SQUARE]: { addedDate: '2022-04-28' },

  // 2022-02-17
  [TextureId.HEART]: { addedDate: '2022-02-17' },
  [TextureId.SKULL]: { addedDate: '2022-02-17' },
  [TextureId.FEATHER]: { addedDate: '2022-02-17' },

  // 2022-02-10 - Initial textures
  [TextureId.MAGIC_EXPLOSION]: { addedDate: '2022-02-10' },
  [TextureId.CONFETTI_TOON]: { addedDate: '2022-02-10' },
  [TextureId.CONFETTI]: { addedDate: '2022-02-10' },
  [TextureId.NUMBERS_TOON]: { addedDate: '2022-02-10' },
  [TextureId.NUMBERS]: { addedDate: '2022-02-10' },
  [TextureId.SNOWFLAKE]: { addedDate: '2022-02-10' },
  [TextureId.LEAF_TOON]: { addedDate: '2022-02-10' },
  [TextureId.RAINDROP]: { addedDate: '2022-02-10' },
  [TextureId.MOON]: { addedDate: '2022-02-10' },
  [TextureId.PLUS_TOON]: { addedDate: '2022-02-10' },
  [TextureId.PLUS]: { addedDate: '2022-02-10' },
  [TextureId.STAR_TOON]: { addedDate: '2022-02-10' },
  [TextureId.STAR]: { addedDate: '2022-02-10' },
  [TextureId.FLARE]: { addedDate: '2022-02-10' },
  [TextureId.FLAME]: { addedDate: '2022-02-10' },
  [TextureId.CLOUD]: { addedDate: '2022-02-10' },
  [TextureId.CIRCLE]: { addedDate: '2022-02-10' },
  [TextureId.GRADIENT_POINT]: { addedDate: '2022-02-10' },
  [TextureId.POINT]: { addedDate: '2022-02-10' },
};

/**
 * Get the added date for a texture
 * Returns a default date for custom textures or unknown textures
 */
export const getTextureAddedDate = (textureId: string): string => {
  return textureMetadata[textureId]?.addedDate || '2099-01-01'; // Custom textures get a future date to appear first
};
