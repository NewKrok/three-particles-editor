# How to Add a New Entry (Configuration Section)

An "entry" is a configuration section in the editor's left panel (e.g., General, Emission, Shape, Trail). Each entry manages its own GUI folder, controllers, and lifecycle callbacks.

## Entry File Structure

Create a new file in `src/js/three-particles-editor/entries/`. Follow the naming convention: `<feature>-entries.ts`.

### Minimal Template

```typescript
import type { GUI } from 'three/examples/jsm/libs/lil-gui.module.min';

type MyFeatureEntriesParams = {
  parentFolder: GUI;
  particleSystemConfig: any;
  recreateParticleSystem: () => void;
};

type MyFeatureEntriesResult = {
  onReset: () => void;
  onParticleSystemChange: () => void;
  onUpdate: () => void;
};

export const createMyFeatureEntries = ({
  parentFolder,
  particleSystemConfig,
  recreateParticleSystem,
}: MyFeatureEntriesParams): MyFeatureEntriesResult => {
  const folder = parentFolder.addFolder('My Feature');
  folder.close();

  let controllers: any[] = [];

  const rebuild = (): void => {
    controllers.forEach((controller) => controller.destroy());
    controllers = [];

    // Add controllers here
    controllers.push(
      folder
        .add(particleSystemConfig.myFeature, 'someProperty', 0, 10, 0.1)
        .onChange(recreateParticleSystem)
        .listen()
    );
  };

  rebuild();

  return {
    onReset: rebuild,
    onParticleSystemChange: (): void => {},
    onUpdate: (): void => {},
  };
};
```

## ConfigEntry Lifecycle Callbacks

| Callback                 | When Called                              | Typical Use                                                             |
| ------------------------ | ---------------------------------------- | ----------------------------------------------------------------------- |
| `onReset`                | New config created or config loaded      | Rebuild all controllers to reflect new values                           |
| `onParticleSystemChange` | After particle system is recreated       | React to external changes (e.g., rendererType changed in another entry) |
| `onUpdate`               | Every animation frame (with `cycleData`) | Update per-frame logic (e.g., simulation movement)                      |
| `onAssetUpdate`          | When textures/assets change              | Rebuild texture-related controllers                                     |

## Registering the Entry

In `src/js/three-particles-editor.ts`:

1. Add the import at the top:

```typescript
import { createMyFeatureEntries } from './three-particles-editor/entries/my-feature-entries';
```

2. Add to `createPanel()` function (around line 690+), before `recreateParticleSystem(false)`:

```typescript
configEntries.push(
  createMyFeatureEntries({
    parentFolder: panel,
    particleSystemConfig: config,
    recreateParticleSystem,
  })
);
```

The order of registration determines the order in the GUI panel.

## Available lil-gui Controller Types

```typescript
// Number slider
folder.add(obj, 'prop', min, max, step).onChange(recreateParticleSystem).listen();

// Checkbox (boolean)
folder.add(obj, 'boolProp').onChange(recreateParticleSystem).listen();

// Dropdown
folder.add(obj, 'type', ['OPTION_A', 'OPTION_B']).onChange(recreateParticleSystem).listen();

// Color picker
folder.addColor(obj, 'color').onChange(recreateParticleSystem).listen();

// Button
folder
  .add(
    {
      myAction: () => {
        /* do something */
      },
    },
    'myAction'
  )
  .name('Button Label');

// Disabled display field
folder.add(obj, 'readOnlyProp').disable().listen();

// Subfolder
const subFolder = folder.addFolder('Sub Section');
```

Always chain `.listen()` for two-way binding and `.onChange(recreateParticleSystem)` to trigger particle system recreation.

## Available Helper Functions

From `entries/entry-helpers-v2.ts`:

```typescript
// Min/Max number pair (e.g., startLifetime: { min: 1, max: 5 })
createMinMaxFloatFolderEntry({
  particleSystemConfig,
  recreateParticleSystem,
  parentFolder,
  rootPropertyName: 'myFeature', // optional, for nested access
  propertyName: 'speed',
  min: 0,
  max: 100,
  step: 0.1,
});

// Min/Max color pair
createMinMaxColorFolderEntry({
  particleSystemConfig,
  recreateParticleSystem,
  parentFolder,
  propertyName: 'startColor',
});

// Vector2 (x, y)
createVector2FolderEntry({
  particleSystemConfig,
  recreateParticleSystem,
  parentFolder,
  propertyName: 'tiles',
  min: 1,
  max: 16,
  step: 1,
});

// Vector3 (x, y, z)
createVector3FolderEntry({
  particleSystemConfig,
  recreateParticleSystem,
  parentFolder,
  propertyName: 'position',
  min: -50,
  max: 50,
  step: 0.01,
});

// Bezier curve (LifetimeCurve)
createLifetimeCurveFolderEntry({
  particleSystemConfig,
  recreateParticleSystem,
  parentFolder,
  rootPropertyName: 'myFeature',
  propertyName: 'lifetimeCurve',
});
```

The `rootPropertyName` uses dot notation for nested access (e.g., `'renderer.trail.colorOverTrail'`).

## Dynamic UI Pattern (Conditional Controllers)

When controllers should appear/disappear based on a config value (see `trail-entries.ts` or `renderer-entries.ts` for full examples):

```typescript
let lastType = particleSystemConfig.someType || 'DEFAULT';

return {
  onParticleSystemChange: (): void => {
    const currentType = particleSystemConfig.someType || 'DEFAULT';
    if (lastType !== currentType) {
      lastType = currentType;
      rebuild(); // Destroys old controllers, creates new ones
    }
  },
};
```

## Bezier Curve Editor Integration

For properties that use `LifetimeCurve` (bezier curves), combine the helper with the modal editor:

```typescript
import { openBezierEditorModal } from '../curve-editor/curve-editor';
import { createLifetimeCurveFolderEntry } from './entry-helpers-v2';

// Create scale control
createLifetimeCurveFolderEntry({
  particleSystemConfig,
  recreateParticleSystem,
  parentFolder: myFolder,
  rootPropertyName: 'myFeature',
  propertyName: 'lifetimeCurve',
});

// Add "Edit Curve" button
myFolder
  .add(
    {
      editCurve: (): void => {
        openBezierEditorModal(particleSystemConfig.myFeature.lifetimeCurve, () => {
          recreateParticleSystem();
        });
      },
    },
    'editCurve'
  )
  .name('Edit Curve');
```

**Limitation**: Only BEZIER curves are supported. EASING curves cannot be serialized to JSON.

## Subfolder Cleanup

When using dynamic subfolders, track them separately and destroy in rebuild:

```typescript
let controllers: any[] = [];
let subFolders: GUI[] = [];

const rebuild = (): void => {
  controllers.forEach((c) => c.destroy());
  controllers = [];
  subFolders.forEach((f) => f.destroy());
  subFolders = [];

  const mySubFolder = folder.addFolder('Dynamic Section');
  subFolders.push(mySubFolder);
  // ... add controllers to mySubFolder
};
```

## Serialization

No special action needed. The `getObjectDiff()` function in `save-and-load.ts` automatically serializes any new properties that differ from defaults. Just make sure the `@newkrok/three-particles` package's `getDefaultParticleSystemConfig()` includes the correct defaults for your new properties.
