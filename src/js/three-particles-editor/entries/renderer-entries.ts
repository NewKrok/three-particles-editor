import { blendingMap } from '@newkrok/three-particles';
import { getTexture } from '../assets';
import { getDepthTexture } from '../world';
import { openTextureSelectorModal } from '../texture-selector/texture-selector';

type RendererEntriesParams = {
  parentFolder: any;
  particleSystemConfig: any;
  recreateParticleSystem: () => void;
};

type RendererEntriesResult = {
  onReset: () => void;
  onParticleSystemChange: () => void;
  onUpdate: () => void;
  onAssetUpdate: () => void;
};

export const createRendererEntries = ({
  parentFolder,
  particleSystemConfig,
  recreateParticleSystem,
}: RendererEntriesParams): RendererEntriesResult => {
  let lastUsedTextureId = '';

  const folder = parentFolder.addFolder('Renderer');
  folder.close();

  if (!particleSystemConfig.renderer.rendererType) {
    particleSystemConfig.renderer.rendererType = 'POINTS';
  }

  folder
    .add(particleSystemConfig.renderer, 'rendererType', ['POINTS', 'INSTANCED', 'TRAIL', 'MESH'])
    .onChange((value: string) => {
      if (value === 'MESH') {
        particleSystemConfig.renderer.depthWrite = true;
      }
      rebuild();
      recreateParticleSystem();
    })
    .listen();

  const setConfigByTexture = (textureId: string): void => {
    lastUsedTextureId = textureId;
    const texture = getTexture(textureId);
    if (texture) {
      const { map, tiles } = texture;
      particleSystemConfig.map = map;
      particleSystemConfig._editorData.textureId = textureId;
      particleSystemConfig.textureSheetAnimation.tiles.x =
        tiles?.x || particleSystemConfig.textureSheetAnimation.tiles.x;
      particleSystemConfig.textureSheetAnimation.tiles.y =
        tiles?.y || particleSystemConfig.textureSheetAnimation.tiles.y;
    }
  };

  let controllers: any[] = [];

  const rebuild = (): void => {
    controllers.forEach((controller) => controller.destroy());
    controllers = [];

    const isMesh = particleSystemConfig.renderer.rendererType === 'MESH';

    if (isMesh) {
      // Mesh particles use the engine's built-in 1x1 white texture,
      // sprite textures are not applicable — texture UI is hidden
    } else {
      // Add a display field showing current texture
      const displayTextureConfig = {
        selectedTexture: particleSystemConfig._editorData.textureId || 'None',
      };

      controllers.push(
        folder
          .add(displayTextureConfig, 'selectedTexture')
          .name('Selected Texture')
          .listen()
          .disable()
      );

      // Add button to open texture selector
      const textureSelectButton = {
        selectTexture: () => {
          openTextureSelectorModal({
            currentTextureId: particleSystemConfig._editorData.textureId,
            onSelect: (textureId: string) => {
              particleSystemConfig._editorData.textureId = textureId;
              displayTextureConfig.selectedTexture = textureId;
              setConfigByTexture(textureId);
              recreateParticleSystem();
            },
          });
        },
      };

      controllers.push(folder.add(textureSelectButton, 'selectTexture').name('Choose Texture...'));

      setConfigByTexture(particleSystemConfig._editorData.textureId);
    }

    if (!particleSystemConfig.simulationBackend) {
      particleSystemConfig.simulationBackend = 'AUTO';
    }
    controllers.push(
      folder
        .add(particleSystemConfig, 'simulationBackend', ['AUTO', 'CPU', 'GPU'])
        .onChange(recreateParticleSystem)
        .listen()
    );

    controllers.push(
      folder
        .add(particleSystemConfig.renderer, 'discardBackgroundColor')
        .onChange(recreateParticleSystem)
        .listen()
    );

    controllers.push(
      folder
        .add(particleSystemConfig.renderer, 'backgroundColorTolerance', 0.0, 2.0, 0.001)
        .onChange(recreateParticleSystem)
        .listen()
    );

    controllers.push(
      folder
        .addColor(particleSystemConfig.renderer, 'backgroundColor')
        .onChange(recreateParticleSystem)
        .listen()
    );

    if (typeof particleSystemConfig.renderer.blending === 'number')
      particleSystemConfig.renderer.blending = Object.keys(blendingMap).find(
        (entry) =>
          blendingMap[entry as keyof typeof blendingMap] === particleSystemConfig.renderer.blending
      );
    controllers.push(
      folder
        .add(particleSystemConfig.renderer, 'blending', [
          'THREE.NoBlending',
          'THREE.NormalBlending',
          'THREE.AdditiveBlending',
          'THREE.SubtractiveBlending',
          'THREE.MultiplyBlending',
        ])
        .listen()
        .onChange(recreateParticleSystem)
    );

    controllers.push(
      folder
        .add(particleSystemConfig.renderer, 'transparent')
        .onChange(recreateParticleSystem)
        .listen()
    );

    controllers.push(
      folder
        .add(particleSystemConfig.renderer, 'depthTest')
        .onChange(recreateParticleSystem)
        .listen()
    );

    controllers.push(
      folder
        .add(particleSystemConfig.renderer, 'depthWrite')
        .onChange(recreateParticleSystem)
        .listen()
    );

    // Soft Particles
    if (!particleSystemConfig.renderer.softParticles) {
      particleSystemConfig.renderer.softParticles = {
        enabled: false,
        intensity: 1.0,
      };
    }
    const softParticles = particleSystemConfig.renderer.softParticles;

    controllers.push(
      folder
        .add(softParticles, 'enabled')
        .name('Soft Particles')
        .onChange((value: boolean) => {
          if (value) {
            const depthTex = getDepthTexture();
            if (depthTex) {
              softParticles.depthTexture = depthTex;
            }
          } else {
            delete softParticles.depthTexture;
          }
          recreateParticleSystem();
        })
        .listen()
    );

    controllers.push(
      folder
        .add(softParticles, 'intensity', 0.01, 5.0, 0.01)
        .name('Soft Particles Intensity')
        .onChange(recreateParticleSystem)
        .listen()
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
        return;
      }
      // It looks onChange doesn't work on dropdown entry so have to handle it manually
      if (lastUsedTextureId !== particleSystemConfig._editorData.textureId) {
        setConfigByTexture(particleSystemConfig._editorData.textureId);
        recreateParticleSystem();
      }
    },
    onUpdate: (): void => {},
    onAssetUpdate: rebuild,
  };
};
