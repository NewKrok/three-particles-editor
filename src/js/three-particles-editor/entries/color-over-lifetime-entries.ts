import { createMinMaxColorFolderEntry } from './entry-helpers';
import { Color } from 'three';

type ColorOverLifetimeEntriesParams = {
  parentFolder: any;
  particleSystemConfig: any;
  recreateParticleSystem: () => void;
};

export const createColorOverLifeTimeEntries = ({
  parentFolder,
  particleSystemConfig,
  recreateParticleSystem,
}: ColorOverLifetimeEntriesParams): Record<string, unknown> => {
  const folder = parentFolder.addFolder('Color over lifetime');
  folder.close();

  // Ensure the colorOverLifetime object exists and has the correct structure for v2.0.2
  if (!particleSystemConfig.colorOverLifetime) {
    particleSystemConfig.colorOverLifetime = {
      isActive: false,
    };
  }

  // Ensure gradient is properly initialized
  if (!particleSystemConfig.colorOverLifetime.gradient) {
    particleSystemConfig.colorOverLifetime.gradient = {
      min: new Color(1, 1, 1),
      max: new Color(1, 1, 1),
    };
  }

  folder
    .add(particleSystemConfig.colorOverLifetime, 'isActive')
    .onChange((v: boolean) => {
      particleSystemConfig.looping = v;
      recreateParticleSystem();
    })
    .listen();

  createMinMaxColorFolderEntry({
    particleSystemConfig,
    recreateParticleSystem,
    parentFolder: folder,
    rootPropertyName: 'colorOverLifetime',
    propertyName: 'gradient',
  });

  return {};
};
