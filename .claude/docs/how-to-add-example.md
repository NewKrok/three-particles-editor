# How to Add a New Example Configuration

Examples are preset particle effects that users can load from the Examples tab in the left panel.

## File Structure

Each example is a folder in `public/examples/` containing:

```
public/examples/my-cool-effect/
  config.json    # Particle system configuration (required)
  preview.webp   # Preview image (required)
```

## Step-by-Step

### 1. Create the Effect in the Editor

Design and tweak your particle effect in the editor until you're happy with it.

### 2. Export the Configuration

Use "Copy to clipboard" in the editor to get the JSON config. Save it as `config.json` in your example folder.

The JSON should include `_editorData` with metadata:

```json
{
  "duration": 0.5,
  "startLifetime": { "min": 1, "max": 2 },
  "emission": { "rateOverTime": 100 },
  "renderer": { "blending": "THREE.AdditiveBlending" },
  "_editorData": {
    "textureId": "SOFT_SMOKE",
    "simulation": {
      "movements": "DISABLED",
      "movementSpeed": 1,
      "rotation": "DISABLED",
      "rotationSpeed": 1
    },
    "showLocalAxes": false,
    "showWorldAxes": false,
    "frustumCulled": true,
    "terrain": { "textureId": "WIREFRAME" },
    "metadata": {
      "name": "My Cool Effect",
      "createdAt": 1711094400000,
      "modifiedAt": 1711094400000,
      "editorVersion": "2.9.0"
    }
  }
}
```

The config is in **diff format** — only non-default values are included.

### 3. Create a Preview Image

Take a screenshot of your effect and save it as `preview.webp`. Recommended: 16:9 aspect ratio (e.g., 640x360px).

### 4. Register the Example

Add an entry to `src/examples-config.js` in the `particleExamples` array:

```javascript
export const particleExamples = [
  // ... existing examples
  {
    name: 'My Cool Effect',
  },
];
```

**Important**: The `name` is automatically converted to a URL-friendly folder name using `toUrlFriendlyString()`:

- `"My Cool Effect"` -> `"my-cool-effect"` -> fetches `./examples/my-cool-effect/config.json`

So the folder name **must match** the URL-friendly version of the display name.

### Name Conversion Rules

From `src/js/utils/name-utils.ts`:

- Lowercase everything
- Replace non-alphanumeric characters with hyphens
- Collapse multiple hyphens
- Trim leading/trailing hyphens

Examples:

- `"Floating Hearts"` -> `floating-hearts`
- `"Fire Blast"` -> `fire-blast`
- `"Supernova Burst"` -> `supernova-burst`

## Inline Examples (Alternative)

For small configs, you can store them inline in `examples-config.js` as JSON strings:

```javascript
const myEffect = '{"duration":0.5,"startSpeed":{"min":2,"max":5},...}';

export const particleExamples = [
  {
    name: 'My Effect',
    config: myEffect, // Inline JSON string
  },
];
```

When `config` is provided, the system uses it directly instead of fetching from `public/examples/`.

## Loading Flow

1. User clicks example card in the UI
2. If config is dirty, confirmation dialog shown
3. If `config` prop exists (inline): `JSON.parse(config)` used directly
4. If no `config` prop (folder-based): fetches `./examples/{url-friendly-name}/config.json`
5. Calls `window.editor.load(data)` which runs through the full load pipeline (version check, expand sub-emitters, merge with defaults)

## No Build Required

Examples are static files served at runtime. After adding files and updating `examples-config.js`, changes are immediately available (with hot reload in dev mode).
