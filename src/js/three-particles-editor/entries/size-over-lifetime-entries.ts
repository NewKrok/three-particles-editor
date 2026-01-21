import { setCurveEditorPositions, setCurveEditorTarget } from '../curve-editor/curve-editor';

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          // Update to use lifetimeCurve instead of curveFunction
          setCurveEditorTarget(particleSystemConfig.sizeOverLifetime.lifetimeCurve);
          recreateParticleSystem();
        },
      },
      'editCurve'
    )
    .name('Apply curve');

  folder
    .add(
      {
        loadCurve: (): void => {
          // Ensure bezierPoints is available for setCurveEditorPositions
          // Type assertion is necessary because LifetimeCurve can be either BezierCurve or EasingCurve
          const lifetimeCurve = particleSystemConfig.sizeOverLifetime.lifetimeCurve;
          if (lifetimeCurve.type === 'BEZIER' && 'bezierPoints' in lifetimeCurve) {
            setCurveEditorPositions({
              bezierPoints: lifetimeCurve.bezierPoints,
            });
          }
        },
      },
      'loadCurve'
    )
    .name('Edit curve');

  return {};
};
