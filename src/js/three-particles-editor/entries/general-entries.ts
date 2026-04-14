import { createMinMaxColorFolderEntry, createMinMaxFloatFolderEntry } from './entry-helpers-v2';

type GeneralEntriesParams = {
  parentFolder: any;
  particleSystemConfig: any;
  recreateParticleSystem: () => void;
  forceRecreateParticleSystem?: () => void;
};

export const createGeneralEntries = ({
  parentFolder,
  particleSystemConfig,
  recreateParticleSystem,
  forceRecreateParticleSystem,
}: GeneralEntriesParams): Record<string, unknown> => {
  const folder = parentFolder.addFolder('General');
  const forceRecreate = forceRecreateParticleSystem ?? recreateParticleSystem;

  folder
    .add(particleSystemConfig, 'duration', 0.0, 30, 0.01)
    .onChange(recreateParticleSystem)
    .listen();

  folder.add(particleSystemConfig, 'looping').onChange(recreateParticleSystem).listen();

  createMinMaxFloatFolderEntry({
    particleSystemConfig,
    recreateParticleSystem,
    parentFolder: folder,
    propertyName: 'startDelay',
    min: 0.0,
    max: 30.0,
    step: 0.01,
  });

  createMinMaxFloatFolderEntry({
    particleSystemConfig,
    recreateParticleSystem,
    parentFolder: folder,
    propertyName: 'startLifetime',
    min: 0.01,
    max: 30.0,
    step: 0.01,
  });

  createMinMaxFloatFolderEntry({
    particleSystemConfig,
    recreateParticleSystem,
    parentFolder: folder,
    propertyName: 'startSpeed',
    min: 0.0,
    max: 30.0,
    step: 0.01,
  });

  createMinMaxFloatFolderEntry({
    particleSystemConfig,
    recreateParticleSystem,
    parentFolder: folder,
    propertyName: 'startSize',
    min: 0.0,
    max: 100.0,
    step: 0.01,
  });

  createMinMaxFloatFolderEntry({
    particleSystemConfig,
    recreateParticleSystem,
    parentFolder: folder,
    propertyName: 'startRotation',
    min: -360.0,
    max: 360.0,
    step: 0.001,
  });

  createMinMaxColorFolderEntry({
    particleSystemConfig,
    recreateParticleSystem,
    parentFolder: folder,
    propertyName: 'startColor',
  });

  createMinMaxFloatFolderEntry({
    particleSystemConfig,
    recreateParticleSystem,
    parentFolder: folder,
    propertyName: 'startOpacity',
    min: 0.0,
    max: 1.0,
    step: 0.001,
  });

  folder
    .add(particleSystemConfig, 'gravity', -20, 20, 0.01)
    .onChange(recreateParticleSystem)
    .listen();

  folder
    .add(particleSystemConfig, 'simulationSpace', ['LOCAL', 'WORLD'])
    .onChange(recreateParticleSystem)
    .listen();

  const maxParticlesController = folder
    .add(particleSystemConfig, 'maxParticles', 1.0, 1000, 1.0)
    .onChange(forceRecreate)
    .listen();

  return { maxParticlesController };
};
