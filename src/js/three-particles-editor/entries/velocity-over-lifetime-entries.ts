import { createMinMaxFloatFolderEntry } from './entry-helpers';
import { RandomBetweenTwoConstants } from '@newkrok/three-particles';

type VelocityOverLifeTimeEntriesParams = {
  parentFolder: any;
  particleSystemConfig: any;
  recreateParticleSystem: () => void;
};

export const createVelocityOverLifeTimeEntries = ({
  parentFolder,
  particleSystemConfig,
  recreateParticleSystem,
}: VelocityOverLifeTimeEntriesParams): Record<string, unknown> => {
  const folder = parentFolder.addFolder('Velocity over lifetime');
  folder.close();

  // Ensure the velocityOverLifetime object exists and has the correct structure for v2.0.2
  if (!particleSystemConfig.velocityOverLifetime) {
    particleSystemConfig.velocityOverLifetime = {
      isActive: false,
    };
  }

  // Ensure linear velocity is properly initialized
  if (!particleSystemConfig.velocityOverLifetime.linear) {
    particleSystemConfig.velocityOverLifetime.linear = {};
  }

  // Initialize x, y, z components for linear velocity if they don't exist
  ['x', 'y', 'z'].forEach((axis) => {
    if (!particleSystemConfig.velocityOverLifetime.linear[axis]) {
      particleSystemConfig.velocityOverLifetime.linear[axis] = {
        min: 0,
        max: 0,
      } as RandomBetweenTwoConstants;
    }
  });

  // Ensure orbital velocity is properly initialized
  if (!particleSystemConfig.velocityOverLifetime.orbital) {
    particleSystemConfig.velocityOverLifetime.orbital = {};
  }

  // Initialize x, y, z components for orbital velocity if they don't exist
  ['x', 'y', 'z'].forEach((axis) => {
    if (!particleSystemConfig.velocityOverLifetime.orbital[axis]) {
      particleSystemConfig.velocityOverLifetime.orbital[axis] = {
        min: 0,
        max: 0,
      } as RandomBetweenTwoConstants;
    }
  });

  folder
    .add(particleSystemConfig.velocityOverLifetime, 'isActive')
    .onChange(recreateParticleSystem)
    .listen();

  const linearVelocityFolder = folder.addFolder('Linear velocity');
  createMinMaxFloatFolderEntry({
    particleSystemConfig,
    recreateParticleSystem,
    parentFolder: linearVelocityFolder,
    rootPropertyName: 'velocityOverLifetime.linear',
    propertyName: 'x',
    min: -30.0,
    max: 30.0,
    step: 0.001,
  });
  createMinMaxFloatFolderEntry({
    particleSystemConfig,
    recreateParticleSystem,
    parentFolder: linearVelocityFolder,
    rootPropertyName: 'velocityOverLifetime.linear',
    propertyName: 'y',
    min: -30.0,
    max: 30.0,
    step: 0.001,
  });
  createMinMaxFloatFolderEntry({
    particleSystemConfig,
    recreateParticleSystem,
    parentFolder: linearVelocityFolder,
    rootPropertyName: 'velocityOverLifetime.linear',
    propertyName: 'z',
    min: -30.0,
    max: 30.0,
    step: 0.001,
  });

  const orbitalVelocityFolder = folder.addFolder('Orbital velocity');
  createMinMaxFloatFolderEntry({
    particleSystemConfig,
    recreateParticleSystem,
    parentFolder: orbitalVelocityFolder,
    rootPropertyName: 'velocityOverLifetime.orbital',
    propertyName: 'x',
    min: -45.0,
    max: 45.0,
    step: 0.01,
  });
  createMinMaxFloatFolderEntry({
    particleSystemConfig,
    recreateParticleSystem,
    parentFolder: orbitalVelocityFolder,
    rootPropertyName: 'velocityOverLifetime.orbital',
    propertyName: 'y',
    min: -45.0,
    max: 45.0,
    step: 0.01,
  });
  createMinMaxFloatFolderEntry({
    particleSystemConfig,
    recreateParticleSystem,
    parentFolder: orbitalVelocityFolder,
    rootPropertyName: 'velocityOverLifetime.orbital',
    propertyName: 'z',
    min: -45.0,
    max: 45.0,
    step: 0.01,
  });

  return {};
};
