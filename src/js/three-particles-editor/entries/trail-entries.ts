import { openBezierEditorModal } from '../curve-editor/curve-editor';
import { createLifetimeCurveFolderEntry } from './entry-helpers-v2';
import type { GUI } from 'three/examples/jsm/libs/lil-gui.module.min';
import {
  createGradientEditor,
  setGradientStops,
  setOnChangeCallback,
} from '../gradient-editor/gradient-editor';
import {
  gradientToBezierCurves,
  bezierCurvesToGradient,
  getDefaultGradientStops,
  type GradientStop,
  type BezierCurve,
} from '../gradient-editor/gradient-to-bezier';

type TrailEntriesParams = {
  parentFolder: GUI;
  particleSystemConfig: any;
  recreateParticleSystem: () => void;
};

type TrailEntriesResult = {
  onReset: () => void;
  onParticleSystemChange: () => void;
  onUpdate: () => void;
};

const DEFAULT_FADE_CURVE = {
  type: 'BEZIER' as const,
  scale: 1,
  bezierPoints: [
    { x: 0, y: 1, percentage: 0 },
    { x: 1, y: 0, percentage: 1 },
  ],
};

const DEFAULT_CONSTANT_CURVE = {
  type: 'BEZIER' as const,
  scale: 1,
  bezierPoints: [
    { x: 0, y: 1, percentage: 0 },
    { x: 1, y: 1, percentage: 1 },
  ],
};

const deepCopyCurve = (curve: typeof DEFAULT_FADE_CURVE) => ({
  ...curve,
  bezierPoints: curve.bezierPoints.map((p) => ({ ...p })),
});

const ensureTrailConfig = (particleSystemConfig: any): void => {
  if (!particleSystemConfig.renderer.trail) {
    particleSystemConfig.renderer.trail = {};
  }

  const trail = particleSystemConfig.renderer.trail;
  if (trail.length == null) trail.length = 20;
  if (trail.width == null) trail.width = 1.0;
  if (trail.minVertexDistance == null) trail.minVertexDistance = 0;
  if (trail.maxTime == null) trail.maxTime = 0;
  if (trail.smoothing == null) trail.smoothing = false;
  if (trail.smoothingSubdivisions == null) trail.smoothingSubdivisions = 3;
  if (trail.twistPrevention == null) trail.twistPrevention = false;
  if (!trail.widthOverTrail) trail.widthOverTrail = deepCopyCurve(DEFAULT_FADE_CURVE);
  if (!trail.opacityOverTrail) trail.opacityOverTrail = deepCopyCurve(DEFAULT_FADE_CURVE);
  if (!trail.colorOverTrail) {
    trail.colorOverTrail = {
      isActive: false,
      r: deepCopyCurve(DEFAULT_CONSTANT_CURVE),
      g: deepCopyCurve(DEFAULT_CONSTANT_CURVE),
      b: deepCopyCurve(DEFAULT_CONSTANT_CURVE),
    };
  }
};

export const createTrailEntries = ({
  parentFolder,
  particleSystemConfig,
  recreateParticleSystem,
}: TrailEntriesParams): TrailEntriesResult => {
  const folder = parentFolder.addFolder('Trail');
  folder.close();

  let controllers: any[] = [];
  let subFolders: GUI[] = [];
  let trailGradientInitialized = false;

  const rebuild = (): void => {
    controllers.forEach((controller) => controller.destroy());
    controllers = [];
    subFolders.forEach((f) => f.destroy());
    subFolders = [];
    trailGradientInitialized = false;

    const isTrail = particleSystemConfig.renderer.rendererType === 'TRAIL';

    if (!isTrail) {
      controllers.push(
        folder
          .add({ info: 'Set Renderer Type to TRAIL to configure' }, 'info')
          .name('Info')
          .disable()
      );
      return;
    }

    ensureTrailConfig(particleSystemConfig);
    const trail = particleSystemConfig.renderer.trail;

    controllers.push(
      folder.add(trail, 'length', 2, 500, 1).onChange(recreateParticleSystem).listen()
    );

    controllers.push(
      folder.add(trail, 'width', 0.01, 10, 0.01).onChange(recreateParticleSystem).listen()
    );

    controllers.push(
      folder
        .add(trail, 'minVertexDistance', 0, 2, 0.01)
        .name('Min Vertex Distance')
        .onChange(recreateParticleSystem)
        .listen()
    );

    controllers.push(
      folder
        .add(trail, 'maxTime', 0, 10, 0.1)
        .name('Max Time (s)')
        .onChange(recreateParticleSystem)
        .listen()
    );

    controllers.push(
      folder.add(trail, 'smoothing').name('Smoothing').onChange(recreateParticleSystem).listen()
    );

    controllers.push(
      folder
        .add(trail, 'smoothingSubdivisions', 1, 10, 1)
        .name('Smoothing Subdivisions')
        .onChange(recreateParticleSystem)
        .listen()
    );

    controllers.push(
      folder
        .add(trail, 'twistPrevention')
        .name('Twist Prevention')
        .onChange(recreateParticleSystem)
        .listen()
    );

    // Width over trail
    const widthOverTrailFolder = folder.addFolder('Width Over Trail');
    subFolders.push(widthOverTrailFolder);
    createLifetimeCurveFolderEntry({
      particleSystemConfig,
      recreateParticleSystem,
      parentFolder: widthOverTrailFolder,
      rootPropertyName: 'renderer.trail',
      propertyName: 'widthOverTrail',
    });
    controllers.push(
      widthOverTrailFolder
        .add(
          {
            editCurve: (): void => {
              openBezierEditorModal(trail.widthOverTrail, () => {
                recreateParticleSystem();
              });
            },
          },
          'editCurve'
        )
        .name('Edit Curve')
    );

    // Color Over Trail (gradient editor for color + opacity)
    const colorOverTrailFolder = folder.addFolder('Color Over Trail');
    subFolders.push(colorOverTrailFolder);

    // Ensure trailGradientStops exists in _editorData
    if (!particleSystemConfig._editorData) {
      particleSystemConfig._editorData = {};
    }
    const editorData = particleSystemConfig._editorData;

    if (!editorData.trailGradientStops) {
      if (
        trail.colorOverTrail?.r &&
        trail.colorOverTrail?.g &&
        trail.colorOverTrail?.b &&
        trail.opacityOverTrail
      ) {
        editorData.trailGradientStops = bezierCurvesToGradient(
          trail.colorOverTrail.r as BezierCurve,
          trail.colorOverTrail.g as BezierCurve,
          trail.colorOverTrail.b as BezierCurve,
          trail.opacityOverTrail as BezierCurve,
          5
        );
      } else {
        editorData.trailGradientStops = getDefaultGradientStops();
      }
    }

    controllers.push(
      colorOverTrailFolder
        .add(
          {
            openEditor: (): void => {
              const modal = document.querySelector('.gradient-editor-modal') as HTMLElement;
              if (modal) {
                modal.style.display = 'block';

                const onChange = (stops: GradientStop[]) => {
                  editorData.trailGradientStops = stops;

                  const curves = gradientToBezierCurves(stops);

                  trail.colorOverTrail.r = curves.r;
                  trail.colorOverTrail.g = curves.g;
                  trail.colorOverTrail.b = curves.b;
                  trail.colorOverTrail.isActive = true;

                  trail.opacityOverTrail = curves.alpha;

                  recreateParticleSystem();
                };

                if (!trailGradientInitialized) {
                  createGradientEditor(editorData.trailGradientStops, onChange);
                  trailGradientInitialized = true;
                } else {
                  setOnChangeCallback(onChange);
                  setGradientStops(editorData.trailGradientStops);
                }
              }
            },
          },
          'openEditor'
        )
        .name('Edit Gradient')
    );

    controllers.push(
      colorOverTrailFolder
        .add(
          {
            reset: (): void => {
              const defaultStops = getDefaultGradientStops();
              editorData.trailGradientStops = defaultStops;
              setGradientStops(defaultStops);

              const curves = gradientToBezierCurves(defaultStops);
              trail.colorOverTrail.r = curves.r;
              trail.colorOverTrail.g = curves.g;
              trail.colorOverTrail.b = curves.b;
              trail.opacityOverTrail = curves.alpha;

              recreateParticleSystem();
            },
          },
          'reset'
        )
        .name('Reset to Default')
    );
  };

  rebuild();

  let lastRendererType = particleSystemConfig.renderer.rendererType || 'POINTS';

  return {
    onReset: rebuild,
    onParticleSystemChange: (): void => {
      const currentRendererType = particleSystemConfig.renderer.rendererType || 'POINTS';
      if (lastRendererType !== currentRendererType) {
        lastRendererType = currentRendererType;
        rebuild();
      }
    },
    onUpdate: (): void => {},
  };
};
