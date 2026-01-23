import { setCurveEditorTarget, openBezierEditorModal } from '../curve-editor/curve-editor';

import { createLifetimeCurveFolderEntry } from './entry-helpers-v2';
import type { ParticleSystemConfig } from '@newkrok/three-particles';
// LifeTimeCurve is a const enum, using string literals directly
// Use direct import instead of @types
import type { GUI } from 'three/examples/jsm/libs/lil-gui.module.min';

type SizeOverLifeTimeEntriesParams = {
  parentFolder: GUI;
  particleSystemConfig: ParticleSystemConfig;
  recreateParticleSystem: () => void;
};

export const createSizeOverLifeTimeEntries = ({
  parentFolder,
  particleSystemConfig,
  recreateParticleSystem,
}: SizeOverLifeTimeEntriesParams): Record<string, unknown> => {
  const folder = parentFolder.addFolder('Size over lifetime');
  folder.close();

  // Ensure the sizeOverLifetime object exists and has the correct structure for v2.0.2
  if (!particleSystemConfig.sizeOverLifetime) {
    particleSystemConfig.sizeOverLifetime = {
      isActive: false,
      lifetimeCurve: {
        type: 'BEZIER',
        bezierPoints: [
          { x: 0, y: 0, percentage: 0 },
          { x: 1, y: 1, percentage: 1 },
        ],
      } as any,
    };
  }

  folder
    .add(particleSystemConfig.sizeOverLifetime, 'isActive')
    .onChange(recreateParticleSystem)
    .listen();

  // Use the createLifetimeCurveFolderEntry helper to create UI for the lifetimeCurve
  createLifetimeCurveFolderEntry({
    particleSystemConfig,
    recreateParticleSystem,
    parentFolder: folder,
    rootPropertyName: 'sizeOverLifetime',
    propertyName: 'lifetimeCurve',
  });

  folder
    .add(
      {
        editCurve: (): void => {
          const lifetimeCurve = particleSystemConfig.sizeOverLifetime.lifetimeCurve;
          openBezierEditorModal(lifetimeCurve);

          // Set up callback to update when modal is used
          const updateInterval = setInterval(() => {
            const modal = document.querySelector('.bezier-editor-modal') as HTMLElement;
            if (!modal || modal.style.display === 'none') {
              clearInterval(updateInterval);
            } else {
              setCurveEditorTarget(lifetimeCurve);
              recreateParticleSystem();
            }
          }, 100);
        },
      },
      'editCurve'
    )
    .name('Edit Curve');

  return {};
};
