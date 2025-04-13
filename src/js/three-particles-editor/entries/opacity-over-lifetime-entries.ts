import { setCurveEditorPositions, setCurveEditorTarget } from '../curve-editor/curve-editor';

import { LifeTimeCurve } from '@newkrok/three-particles';
import { createLifetimeCurveFolderEntry } from './entry-helpers-v2';

type OpacityOverLifeTimeEntriesParams = {
  parentFolder: any;
  particleSystemConfig: any;
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
    particleSystemConfig.opacityOverLifetime = {};
  }

  if (!particleSystemConfig.opacityOverLifetime.lifetimeCurve) {
    particleSystemConfig.opacityOverLifetime.lifetimeCurve = {
      type: LifeTimeCurve.BEZIER,
      bezierPoints: [
        { x: 0, y: 0, percentage: 0 },
        { x: 1, y: 1, percentage: 1 },
      ],
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
        loadCurve: (): void => setCurveEditorPositions(particleSystemConfig.opacityOverLifetime),
      },
      'loadCurve'
    )
    .name('Edit curve');

  return {};
};
