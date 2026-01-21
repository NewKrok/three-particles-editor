# Three Particles Editor - Project Documentation

## Project Purpose

This is a **particle system editor** for ThreeJS, implemented in Unity style. The editor is specifically designed for the [@newkrok/three-particles](https://github.com/NewKrok/three-particles) npm package, which expects a complex configuration file as a parameter. Since the particle system configuration file is difficult to edit manually, this editor was developed to facilitate visual editing.

**Key Features:**

- Visual particle effect editor for ThreeJS
- Built on Unity particle system concepts and behavior
- JSON-based configuration export/import
- Real-time preview and editing
- Designed for game developers

## Technology Stack

### Core Technologies

- **ThreeJS** (v0.175.0) - 3D rendering and particle system
- **Svelte** (v4.2.12) - UI framework
- **TypeScript** (v5.8.3) - Typed JavaScript
- **Rollup** (v2.79.1) - Bundle tool

### Main Dependencies

- `@newkrok/three-particles` (v2.0.3) - The particle system engine
- `@newkrok/three-utils` - Utility functions
- `lil-gui` - GUI panel for parameter editing
- `prismjs` - Syntax highlighting (for configuration display)

### UI Libraries

- **SMUI** (Svelte Material UI) components:
  - Button, Card, Dialog, TextField, Tab, List, Snackbar
- **Material Theme** (@material/theme)
- **svrollbar** - Custom scrollbar

### Dev Tools

- ESLint + Prettier - Code formatting
- Husky + lint-staged - Pre-commit hooks
- Jest + ts-jest - Testing
- Semantic-release - Automatic versioning

## Project Structure

```
three-particles-editor/
├── src/
│   ├── js/
│   │   ├── three-particles-editor/        # Core editor logic
│   │   │   ├── entries/                   # Configuration sections
│   │   │   │   ├── general-entries.ts     # General settings
│   │   │   │   ├── emission-entries.ts    # Emission parameters
│   │   │   │   ├── shape-entries.ts       # Emitter shapes
│   │   │   │   ├── velocity-over-lifetime-entries.ts
│   │   │   │   ├── color-over-lifetime-entries.ts
│   │   │   │   ├── opacity-over-lifetime-entries.ts
│   │   │   │   ├── size-over-lifetime-entries.ts
│   │   │   │   ├── rotation-over-lifetime-entries.ts
│   │   │   │   ├── noise-entries.ts       # Noise-based animation
│   │   │   │   ├── texture-sheet-animation-entries.ts
│   │   │   │   ├── renderer-entries.ts    # Rendering settings
│   │   │   │   ├── transform-entries.ts   # Position, rotation, scale
│   │   │   │   └── helper-entries.ts      # Debug and helper tools
│   │   │   ├── curve-editor/              # Bezier curve editor
│   │   │   │   ├── curve-editor.ts
│   │   │   │   └── predefined-bezier-curve-config.ts
│   │   │   ├── world.ts                   # ThreeJS scene setup
│   │   │   ├── assets.ts                  # Texture and asset management
│   │   │   ├── texture-config.ts          # Texture configurations
│   │   │   ├── config-converter.ts        # Legacy config conversion
│   │   │   ├── config-util.ts             # Config utilities
│   │   │   ├── save-and-load.ts           # Save/load logic
│   │   │   └── showLegacyConfigModal.ts   # Legacy config handling
│   │   ├── stores/                        # Svelte stores
│   │   │   └── snackbar-store.ts          # Snackbar state
│   │   ├── utils/                         # Utility functions
│   │   │   └── name-utils.ts              # Filename generation
│   │   └── three-particles-editor.ts      # Main editor entry point
│   ├── components/                        # Svelte components
│   │   ├── header/                        # Top navigation
│   │   ├── content/                       # Main content area
│   │   │   ├── control-panel/             # Control buttons
│   │   │   ├── left-side/                 # Left panel
│   │   │   ├── library/                   # Texture library
│   │   │   └── examples/                  # Example configurations
│   │   ├── config-card/                   # Configuration card
│   │   ├── save-dialog/                   # Save dialog
│   │   ├── load-dialog/                   # Load dialog
│   │   ├── legacy-config-modal/           # Legacy config modal
│   │   ├── about-modal/                   # About modal
│   │   └── snackbar/                      # Notifications
│   ├── theme/                             # SMUI theme files
│   └── App.svelte                         # Main app component
├── public/
│   ├── assets/                            # Static assets
│   ├── examples/                          # Example JSON configs
│   ├── favicon/                           # Favicon files
│   ├── lib/                               # External libraries
│   ├── global.css                         # Global styles
│   └── index.html                         # HTML entry point
└── scripts/
    └── compile-theme.js                   # SMUI theme compiler
```

## Architecture

### Editor Initialization Flow

1. **App.svelte** loads and calls `createParticleSystemEditor('#three-particles-editor')`
2. **ThreeJS scene** creation ([world.ts](src/js/three-particles-editor/world.ts))
   - WebGL renderer setup
   - Orbit controls
   - Stats panel
   - Ground plane mesh
3. **Asset loading** ([assets.ts](src/js/three-particles-editor/assets.ts))
   - Built-in textures
   - Custom textures from LocalStorage
4. **GUI panel creation** (lil-gui)
   - Registration of all configuration sections (entries)
5. **Particle system creation**
6. **Animation loop** start

### Configuration System

The particle system configuration is a large JavaScript object that contains:

```typescript
{
  transform: { position, rotation, scale },
  general: { duration, looping, maxParticles, ... },
  emission: { rateOverTime, bursts, ... },
  shape: { type, radius, angle, ... },
  velocityOverLifetime: { ... },
  colorOverLifetime: { ... },
  opacityOverLifetime: { ... },
  sizeOverLifetime: { ... },
  rotationOverLifetime: { ... },
  noise: { ... },
  textureSheetAnimation: { ... },
  renderer: { material, texture, blending, ... },
  _editorData: {
    textureId: string,
    simulation: { movements, rotation, speeds },
    showLocalAxes: boolean,
    showWorldAxes: boolean,
    frustumCulled: boolean,
    terrain: { textureId, ... },
    metadata: {
      name: string,
      createdAt: number,
      modifiedAt: number,
      editorVersion: string
    }
  }
}
```

### Entry System

Each configuration section ([entries/](src/js/three-particles-editor/entries)) returns a `ConfigEntry` object:

```typescript
type ConfigEntry = {
  onReset?: () => void; // When creating a new configuration
  onParticleSystemChange?: (ps) => void; // When particle system is recreated
  onAssetUpdate?: () => void; // On asset update
  onUpdate?: (cycleData) => void; // Every frame
};
```

### Particle System Lifecycle

1. **Creation**: `createParticleSystem(config)` - Based on @newkrok/three-particles
2. **Update**: `updateParticleSystems(cycleData)` - Every frame
3. **Recreation**: Complete dispose + recreation on configuration change
4. **Dispose**: Memory cleanup and GPU object cleanup

### Save/Load

- **LocalStorage**: Local configuration storage
- **Clipboard**: JSON configuration copy/paste
- **File export/import**: JSON file download/upload
- **Metadata tracking**:
  - Configuration name
  - Creation/modification timestamps
  - Editor version

### Legacy Configuration Conversion

The [config-converter.ts](src/js/three-particles-editor/config-converter.ts) handles automatic updates of older format configurations to the new format.

## Key Concepts

### 1. Unity-like Modules

The editor's modularity is built on the Unity particle system:

- **General**: Basic settings (duration, looping, max particles)
- **Emission**: Particle emission (rate, bursts)
- **Shape**: Emitter shapes (cone, sphere, box, circle, edge)
- **Velocity Over Lifetime**: Velocity animation
- **Color/Opacity/Size/Rotation Over Lifetime**: Property animations
- **Noise**: Turbulence effects
- **Texture Sheet Animation**: Sprite sheet animation
- **Renderer**: Rendering settings (material, blending)

### 2. Curve Editor

Editing Bezier curves for animation values (e.g., opacity/size over lifetime). With predefined presets.

### 3. Simulation Modes

Helper functions for testing:

- **Movement simulations**: Emitter movement (circular, pendulum, etc.)
- **Rotation simulations**: Emitter rotation
- **Axes**: Local/world axes display

### 4. Custom Textures

Users can upload their own textures, which are stored in LocalStorage and can be reused.

## Development Workflow

### Commands

```bash
npm run dev              # Development mode (watch + hot reload)
npm run build            # Production build
npm start                # Serve production build
npm run lint             # ESLint check
npm run format           # Prettier formatting
npm test                 # Run Jest tests
npm run release          # Semantic release (CI)
```

### Build Process

1. **SMUI theme compilation**: Generate light and dark themes
2. **Rollup build**: TypeScript → JavaScript, Svelte → JavaScript
3. **Output**: `public/build/` folder

### Git Hooks

- **Pre-commit**: lint-staged → ESLint + Prettier automatic fixes

### Versioning

Semantic-release automatically versions and generates CHANGELOG based on conventional commits.

## API (window.editor)

The editor provides a global API through the `window.editor` object:

```typescript
window.editor = {
  createNew: () => void,                              // Create new config
  load: (config) => void,                             // Load config
  loadFromClipboard: () => void,                      // Load from clipboard
  copyToClipboard: () => void,                        // Copy to clipboard
  reset: () => void,                                  // Restart particle system
  play: () => void,                                   // Resume playback
  pause: () => void,                                  // Pause playback
  updateAssets: () => void,                           // Update assets
  getCurrentParticleSystemConfig: () => config,       // Get current config
  updateConfigMetadata: (name?) => metadata,          // Update metadata
  getConfigMetadata: () => metadata                   // Get metadata
};
```

## Related Projects

- **[@newkrok/three-particles](https://github.com/NewKrok/three-particles)**: The particle system engine
- **Unity Particle System**: Inspiration and reference

## Live Demo

[https://newkrok.com/three-particles-editor/index.html](https://newkrok.com/three-particles-editor/index.html)

## Repository

[https://github.com/NewKrok/three-particles-editor](https://github.com/NewKrok/three-particles-editor)

---

## Development Notes

### Common Tasks

1. **Adding a new configuration property**:
   - Update the appropriate `entries/*.ts` file
   - Add to `getDefaultParticleSystemConfig()` default values
   - Test particle system behavior

2. **Adding a new texture**:
   - `texture-config.ts`: New TextureId enum value
   - `assets.ts`: Texture loading logic
   - `public/assets/`: Texture file

3. **Modifying UI component**:
   - Svelte components: `src/components/`
   - Use SMUI components
   - Consider responsive design

4. **Legacy configuration conversion**:
   - `config-converter.ts`: Conversion logic
   - Maintain backward compatibility

### Things to Watch Out For

- **Performance**: FPS drops with high particle counts
- **Memory leaks**: Proper particle system dispose handling
- **Browser compatibility**: Check WebGL support
- **LocalStorage limit**: Quota exceeded with large textures

### Testing

- Unit tests: Jest (`src/**/__tests__/*.test.ts`)
- Manual tests: Different browsers and devices
- Performance profiling: ThreeJS stats panel

---

**Last updated:** 2026-01-21
**Editor version:** 2.3.0
**@newkrok/three-particles version:** 2.0.3
