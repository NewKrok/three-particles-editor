# Curve Editor Integration

The bezier curve editor allows visual editing of `LifetimeCurve` values — used for properties like opacity over lifetime, size over lifetime, trail width over trail, etc.

## LifetimeCurve Type

```typescript
// From @newkrok/three-particles
type LifetimeCurve = BezierCurve | EasingCurve;

// BezierCurve (the only type supported in the editor)
{
  type: 'BEZIER',
  scale: number,       // Multiplier applied to the curve output
  bezierPoints: [
    { x: 0, y: 0, percentage: 0 },   // Start point (percentage = anchor)
    { x: 0.3, y: 0.5 },              // Control points (no percentage)
    { x: 1, y: 1, percentage: 1 },   // End point (percentage = anchor)
  ],
}
```

**Limitation**: EASING curves (`{ type: 'EASING', curveFunction: (t) => ... }`) are NOT supported because functions cannot be serialized to JSON. The editor always forces curves to BEZIER type.

## How to Add a Curve Editor to an Entry

### 1. Import Dependencies

```typescript
import { openBezierEditorModal } from '../curve-editor/curve-editor';
import { createLifetimeCurveFolderEntry } from './entry-helpers-v2';
```

### 2. Ensure Default Curve Exists

Before creating the UI, make sure the curve property has a valid value:

```typescript
if (!particleSystemConfig.myFeature.lifetimeCurve) {
  particleSystemConfig.myFeature.lifetimeCurve = {
    type: 'BEZIER',
    scale: 1,
    bezierPoints: [
      { x: 0, y: 1, percentage: 0 },
      { x: 1, y: 0, percentage: 1 },
    ],
  };
}
```

Common default curves:

- **Fade out** (1 -> 0): `[{x:0, y:1, percentage:0}, {x:1, y:0, percentage:1}]`
- **Constant** (1 -> 1): `[{x:0, y:1, percentage:0}, {x:1, y:1, percentage:1}]`
- **Fade in** (0 -> 1): `[{x:0, y:0, percentage:0}, {x:1, y:1, percentage:1}]`

### 3. Create the Scale Control

`createLifetimeCurveFolderEntry` creates a subfolder with the `scale` slider:

```typescript
const curveFolder = parentFolder.addFolder('My Curve');

createLifetimeCurveFolderEntry({
  particleSystemConfig,
  recreateParticleSystem,
  parentFolder: curveFolder,
  rootPropertyName: 'myFeature', // Dot notation for nested access
  propertyName: 'lifetimeCurve',
});
```

The `rootPropertyName` supports deep nesting: `'renderer.trail.colorOverTrail'`.

### 4. Add the "Edit Curve" Button

```typescript
curveFolder
  .add(
    {
      editCurve: (): void => {
        openBezierEditorModal(particleSystemConfig.myFeature.lifetimeCurve, () =>
          recreateParticleSystem()
        );
      },
    },
    'editCurve'
  )
  .name('Edit Curve');
```

`openBezierEditorModal` opens a visual bezier editor with:

- Draggable control points
- Predefined curve presets (linear, ease-in, ease-out, etc.)
- Real-time preview
- The curve object is mutated in-place, and the callback is called on change

## Per-Channel Color Curves (RGB)

For RGB color modulation (like `colorOverLifetime` or `colorOverTrail`), create separate curve editors per channel:

```typescript
const colorFolder = parentFolder.addFolder('Color Over Trail');

// isActive toggle
colorFolder.add(trail.colorOverTrail, 'isActive').onChange(recreateParticleSystem).listen();

// Per-channel curves
['r', 'g', 'b'].forEach((channel, i) => {
  const names = ['Red channel', 'Green channel', 'Blue channel'];
  const channelFolder = colorFolder.addFolder(names[i]);
  channelFolder.close();

  createLifetimeCurveFolderEntry({
    particleSystemConfig,
    recreateParticleSystem,
    parentFolder: channelFolder,
    rootPropertyName: 'renderer.trail.colorOverTrail',
    propertyName: channel,
  });

  channelFolder
    .add(
      {
        editCurve: () => {
          openBezierEditorModal(trail.colorOverTrail[channel], () => {
            recreateParticleSystem();
          });
        },
      },
      'editCurve'
    )
    .name('Edit Curve');
});
```

## Predefined Curve Presets

Available in `src/js/three-particles-editor/curve-editor/predefined-bezier-curve-config.ts`. The editor modal shows these as quick-select options.
