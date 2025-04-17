import { setCurveEditorPositions, setCurveEditorTarget } from '../curve-editor/curve-editor';
import { createLifetimeCurveFolderEntry } from './entry-helpers-v2';
import { LifeTimeCurve, ParticleSystemConfig } from '@newkrok/three-particles';
// Use direct import instead of @types
import type { GUI } from 'three/examples/jsm/libs/lil-gui.module.min';

type OpacityOverLifeTimeEntriesParams = {
  parentFolder: GUI;
  particleSystemConfig: ParticleSystemConfig;
  recreateParticleSystem: () => void;
};

export const createOpacityOverLifeTimeEntries = ({
  parentFolder,
  particleSystemConfig,
  recreateParticleSystem,
}: OpacityOverLifeTimeEntriesParams): Record<string, unknown> => {
  const folder = parentFolder.addFolder('Opacity over lifetime');
  folder.close();

  // Ensure the opacityOverLifetime object exists and has the correct structure for v2.0.2
  if (!particleSystemConfig.opacityOverLifetime) {
    particleSystemConfig.opacityOverLifetime = {
      isActive: false,
      lifetimeCurve: {
        type: LifeTimeCurve.BEZIER,
        bezierPoints: [
          { x: 0, y: 0, percentage: 0 },
          { x: 1, y: 1, percentage: 1 },
        ],
      },
    };
  }

  folder
    .add(particleSystemConfig.opacityOverLifetime, 'isActive')
    .onChange(recreateParticleSystem)
    .listen();

  // Use the createLifetimeCurveFolderEntry helper to create UI for the lifetimeCurve
  createLifetimeCurveFolderEntry({
    particleSystemConfig,
    recreateParticleSystem,
    parentFolder: folder,
    rootPropertyName: 'opacityOverLifetime',
    propertyName: 'lifetimeCurve',
  });

  folder
    .add(
      {
        editCurve: (): void => {
          // Update to use lifetimeCurve instead of curveFunction
          setCurveEditorTarget(particleSystemConfig.opacityOverLifetime.lifetimeCurve);
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
          const lifetimeCurve = particleSystemConfig.opacityOverLifetime.lifetimeCurve;
          if (lifetimeCurve.type === LifeTimeCurve.BEZIER && 'bezierPoints' in lifetimeCurve) {
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
