# Configuration Serialization

The editor uses **differential storage**: configs are serialized as diffs from the default config, not full copies. This keeps JSON files small and makes version upgrades easier.

## Save Flow (Config -> JSON)

### Clipboard / JSON Export

```
Full config (in memory)
    -> getObjectDiff(defaults, config)   // Extract only non-default values
    -> Always include _editorData        // Editor metadata preserved fully
    -> Serialize force fields            // With default filtering
    -> Serialize sub-emitters            // Recursively as diffs
    -> JSON.stringify()
    -> navigator.clipboard.write()
```

**Key function**: `getObjectDiff()` in `save-and-load.ts`

- Compares config against `getDefaultParticleSystemConfig()`
- Returns only properties that differ
- Recursively handles nested objects
- Skips arrays and the `map` property (THREE.Texture is not serializable)

### LocalStorage

LocalStorage stores **full configs** (not diffs). This is different from clipboard export.

```typescript
// localStorage key: 'three-particles-saved-configs'
// Value: JSON array of SavedConfig objects
type SavedConfig = {
  id: string; // 'config-<timestamp>'
  name: string;
  config: any; // FULL config (not diff)
  createdAt: number;
  updatedAt: number;
  editorVersion: string;
};
```

## Load Flow (JSON -> Config)

```
JSON input (diff or full)
    -> JSON.parse()
    -> isConfigV2()                     // Version detection
    -> If v1.x: convertToNewFormat()    // Legacy conversion
    -> Expand sub-emitter configs       // diff -> full via deepMerge
    -> patchObject(config, defaults)    // Reset target to defaults
    -> Delete arrays (subEmitters, forceFields)  // Arrays need special handling
    -> deepMerge(config, loadedData)    // Apply loaded values on top
    -> Resolve textures                 // textureId -> THREE.Texture
    -> recreateParticleSystem()
```

**Key function**: `loadParticleSystem()` in `save-and-load.ts`

### Why Arrays Are Deleted Before Merge

`deepMerge` doesn't replace arrays — it merges them. So `subEmitters` and `forceFields` arrays must be explicitly deleted from the target before merging to avoid stale entries from the previous config.

## Special Properties

### `map` (THREE.Texture)

- **Always skipped** during serialization (non-serializable WebGL object)
- Only `_editorData.textureId` is stored (string reference)
- Resolved at load time via `getTexture(textureId).map`

### `_editorData`

- **Always preserved fully** — never diffed against defaults
- Contains: textureId, simulation settings, axes visibility, terrain config, metadata
- The `metadata` sub-object tracks name, timestamps, and editor version

### Force Fields

- Serialized as array with selective property filtering
- Default values omitted: `isActive` (if true), default position/direction

### Sub-Emitters

- Each sub-emitter's `config` is stored as a diff (same as top-level)
- Structure: `{ trigger, inheritVelocity, maxInstances, config }`
- Defaults omitted: `trigger` (if 'DEATH'), `inheritVelocity` (if 0), `maxInstances` (if 32)
- Supports recursive nesting (sub-emitters within sub-emitters)
- On load: each sub-emitter's diff config is expanded to full via `deepMerge` with defaults

## Version Detection & Legacy Conversion

### `isConfigV2()` in `config-util.ts`

Detects v1.x vs v2.x by checking structure differences:

- **v2.x**: `sizeOverLifetime.lifetimeCurve` exists, `opacityOverLifetime.lifetimeCurve` exists
- **v1.x**: `sizeOverLifetime.bezierPoints` directly (no wrapper), `rotationOverLifetime` has raw `min`/`max`

### `convertToNewFormat()` in `config-converter.ts`

Transforms v1.x properties to v2.x format:

- Wraps bezier curves in `{ lifetimeCurve: { type: 'BEZIER', bezierPoints: [...] } }`
- Converts min/max structures
- Updates default values that changed between versions

## Utility Functions

All from `@newkrok/three-utils` `ObjectUtils`:

| Function                                  | Purpose                                                |
| ----------------------------------------- | ------------------------------------------------------ |
| `getObjectDiff(baseline, actual, config)` | Returns only properties differing from baseline        |
| `deepMerge(target, source, config)`       | Recursively merges source into target (mutates target) |
| `patchObject(target, source, config)`     | Resets target to match source structure                |

Config options: `{ skippedProperties: string[], applyToFirstObject: boolean }`

## Adding New Serializable Properties

When adding new config properties (e.g., a new entry section):

1. **No serialization code needed** — `getObjectDiff()` automatically includes any non-default properties
2. Make sure the `@newkrok/three-particles` package's `getDefaultParticleSystemConfig()` has correct defaults for your new properties
3. If your property is an **array** (like force fields), you may need to add explicit handling in `copyToClipboard()` for default filtering, and add a `delete` statement in `loadParticleSystem()` before the merge
4. If your property contains **non-serializable objects** (THREE.Texture, functions), add it to `skippedProperties`
