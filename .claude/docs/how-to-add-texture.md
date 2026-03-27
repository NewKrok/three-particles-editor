# How to Add a New Built-in Texture

Textures are used as particle sprites and terrain backgrounds. The system supports both built-in textures and user-uploaded custom textures (stored in LocalStorage).

## Step-by-Step

### 1. Add Texture ID

In `src/js/three-particles-editor/texture-config.ts`, add a new entry to the `TextureId` object:

```typescript
export const TextureId = {
  // ... existing entries
  MY_TEXTURE: 'MY_TEXTURE',
};
```

### 2. Add Texture Configuration

In the same file, add a config object to the `textureConfigs` array:

```typescript
// Simple particle texture
{
  id: TextureId.MY_TEXTURE,
  url: './assets/textures/my-texture.webp',
  isParticleTexture: true,
}

// Tiled/sprite sheet texture (for TextureSheetAnimation)
{
  id: TextureId.MY_SPRITESHEET,
  url: './assets/textures/my-spritesheet.webp',
  isParticleTexture: true,
  tiles: new THREE.Vector2(4, 2),  // 4 columns, 2 rows = 8 frames
}

// Terrain texture (not a particle texture)
{
  id: TextureId.MY_TERRAIN,
  url: './assets/textures/terrain/my-terrain.webp',
  // isParticleTexture is NOT set (defaults to falsy)
}
```

**TextureConfig type**:

```typescript
{
  id: string;                    // Must match TextureId
  url: string;                   // Path relative to public/
  isParticleTexture?: boolean;   // true = appears in particle texture selector
  tiles?: THREE.Vector2;         // For sprite sheets: (columns, rows)
  map?: THREE.Texture;           // Populated at runtime by TextureLoader
}
```

### 3. Add Metadata

In `src/js/three-particles-editor/texture-metadata.ts`, add an entry with today's date:

```typescript
export const textureMetadata: Record<string, { addedDate: string }> = {
  [TextureId.MY_TEXTURE]: { addedDate: '2026-03-28' },
  // ... existing entries
};
```

The date controls sort order in the texture selector — newest textures appear first.

### 4. Place the Image File

Put your texture image in `public/assets/textures/`:

- Use **WebP** format for best compression
- Particle textures should have **transparency** (alpha channel)
- Terrain textures go in `public/assets/textures/terrain/`

### 5. Register in Texture Selector

**For particle textures only**: add the ID to the `builtInTextures` array in `src/js/three-particles-editor/texture-selector/texture-selector.ts`:

```typescript
const builtInTextures = [
  TextureId.POINT,
  TextureId.GRADIENT_POINT,
  // ... existing entries
  TextureId.MY_TEXTURE,
];
```

**For terrain textures**: add to the terrain dropdown in `src/js/three-particles-editor/entries/helper-entries.ts` (the terrain textureId dropdown list).

## Special Cases

### WIREFRAME Terrain

`TextureId.WIREFRAME` has no texture config entry — it's special-cased in `world.ts` to render as a wireframe mesh material.

### Custom User Textures

Users can upload textures via the texture selector. These are stored in LocalStorage and loaded via `loadCustomAssets()` in `assets.ts`. They are appended to `textureConfigs` at runtime.

## How Textures Are Loaded

1. `initAssets()` in `assets.ts` is called at startup
2. Iterates all `textureConfigs` and loads each via `THREE.TextureLoader`
3. Sets `flipY = false` on each loaded texture
4. Stores the `THREE.Texture` object in `textureConfig.map`
5. `getTexture(textureId)` returns the full config including the loaded `map`

## How Textures Are Used

In `renderer-entries.ts`, when a texture is selected:

```typescript
const texture = getTexture(textureId);
particleSystemConfig.map = texture.map; // THREE.Texture applied to particles
particleSystemConfig._editorData.textureId = id; // String ID stored for serialization
```

Only `_editorData.textureId` is serialized — the actual `THREE.Texture` (`map`) is resolved at load time.
