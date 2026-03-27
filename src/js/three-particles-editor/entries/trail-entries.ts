import { openBezierEditorModal } from '../curve-editor/curve-editor';
import { createLifetimeCurveFolderEntry } from './entry-helpers-v2';
import type { GUI } from 'three/examples/jsm/libs/lil-gui.module.min';

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

  const rebuild = (): void => {
    controllers.forEach((controller) => controller.destroy());
    controllers = [];
    subFolders.forEach((f) => f.destroy());
    subFolders = [];

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
      folder.add(trail, 'length', 2, 100, 1).onChange(recreateParticleSystem).listen()
    );

    controllers.push(
      folder.add(trail, 'width', 0.01, 10, 0.01).onChange(recreateParticleSystem).listen()
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

    // Opacity over trail
    const opacityOverTrailFolder = folder.addFolder('Opacity Over Trail');
    subFolders.push(opacityOverTrailFolder);
    createLifetimeCurveFolderEntry({
      particleSystemConfig,
      recreateParticleSystem,
      parentFolder: opacityOverTrailFolder,
      rootPropertyName: 'renderer.trail',
      propertyName: 'opacityOverTrail',
    });
    controllers.push(
      opacityOverTrailFolder
        .add(
          {
            editCurve: (): void => {
              openBezierEditorModal(trail.opacityOverTrail, () => {
                recreateParticleSystem();
              });
            },
          },
          'editCurve'
        )
        .name('Edit Curve')
    );

    // Color over trail
    const colorOverTrailFolder = folder.addFolder('Color Over Trail');
    subFolders.push(colorOverTrailFolder);
    controllers.push(
      colorOverTrailFolder
        .add(trail.colorOverTrail, 'isActive')
        .onChange(recreateParticleSystem)
        .listen()
    );

    const createChannelCurveUI = (channelName: 'r' | 'g' | 'b', displayName: string): void => {
      const channelFolder = colorOverTrailFolder.addFolder(displayName);
      channelFolder.close();

      createLifetimeCurveFolderEntry({
        particleSystemConfig,
        recreateParticleSystem,
        parentFolder: channelFolder,
        rootPropertyName: 'renderer.trail.colorOverTrail',
        propertyName: channelName,
      });

      controllers.push(
        channelFolder
          .add(
            {
              editCurve: (): void => {
                openBezierEditorModal(trail.colorOverTrail[channelName], () => {
                  recreateParticleSystem();
                });
              },
            },
            'editCurve'
          )
          .name('Edit Curve')
      );
    };

    createChannelCurveUI('r', 'Red channel');
    createChannelCurveUI('g', 'Green channel');
    createChannelCurveUI('b', 'Blue channel');
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
