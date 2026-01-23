import { openBezierEditorModal } from '../curve-editor/curve-editor';
import { createLifetimeCurveFolderEntry } from './entry-helpers-v2';
import type { ParticleSystemConfig } from '@newkrok/three-particles';
import type { GUI } from 'three/examples/jsm/libs/lil-gui.module.min';

type ColorOverLifetimeEntriesParams = {
  parentFolder: GUI;
  particleSystemConfig: ParticleSystemConfig;
  recreateParticleSystem: () => void;
};

export const createColorOverLifeTimeEntries = ({
  parentFolder,
  particleSystemConfig,
  recreateParticleSystem,
}: ColorOverLifetimeEntriesParams): Record<string, unknown> => {
  const folder = parentFolder.addFolder('Color over lifetime');
  folder.close();

  // Ensure the colorOverLifetime object exists and has the correct structure
  if (!particleSystemConfig.colorOverLifetime) {
    const defaultBezierCurve: any = {
      type: 'BEZIER',
      scale: 1,
      bezierPoints: [
        { x: 0, y: 1, percentage: 0 },
        { x: 1, y: 1, percentage: 1 },
      ],
    };

    particleSystemConfig.colorOverLifetime = {
      isActive: false,
      r: defaultBezierCurve,
      g: { ...defaultBezierCurve },
      b: { ...defaultBezierCurve },
    };
  }

  folder
    .add(particleSystemConfig.colorOverLifetime, 'isActive')
    .onChange(recreateParticleSystem)
    .listen();

  // Helper function to create curve UI for a color channel
  const createChannelCurveUI = (channelName: 'r' | 'g' | 'b', displayName: string) => {
    const channelFolder = folder.addFolder(displayName);
    channelFolder.close();

    // Use the createLifetimeCurveFolderEntry helper to create UI for the lifetimeCurve
    createLifetimeCurveFolderEntry({
      particleSystemConfig,
      recreateParticleSystem,
      parentFolder: channelFolder,
      rootPropertyName: 'colorOverLifetime',
      propertyName: channelName,
    });

    channelFolder
      .add(
        {
          editCurve: (): void => {
            const lifetimeCurve = particleSystemConfig.colorOverLifetime[channelName];
            openBezierEditorModal(lifetimeCurve, () => {
              recreateParticleSystem();
            });
          },
        },
        'editCurve'
      )
      .name('Edit Curve');
  };

  // Create UI for each color channel
  createChannelCurveUI('r', 'Red channel');
  createChannelCurveUI('g', 'Green channel');
  createChannelCurveUI('b', 'Blue channel');

  return {};
};
