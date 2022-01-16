import { createMinMaxFloatFolderEntry } from "./entry-helpers";

export const createVelocityOverLifeTimeEntries = ({
  parentFolder,
  particleSystemConfig,
  recreateParticleSystem,
}) => {
  const folder = parentFolder.addFolder("Velocity over lifetime");
  folder.close();

  folder
    .add(particleSystemConfig.velocityOverLifetime, "isActive")
    .onChange((v) => {
      particleSystemConfig.velocityOverLifetime.isActive = v;
      recreateParticleSystem();
    })
    .listen();

  const linearVelocityFolder = folder.addFolder("Linear velocity");
  createMinMaxFloatFolderEntry({
    particleSystemConfig,
    recreateParticleSystem,
    parentFolder: linearVelocityFolder,
    rootPropertyName: "velocityOverLifetime.linear",
    propertyName: "x",
    min: -30.0,
    max: 30.0,
    step: 0.001,
  });
  createMinMaxFloatFolderEntry({
    particleSystemConfig,
    recreateParticleSystem,
    parentFolder: linearVelocityFolder,
    rootPropertyName: "velocityOverLifetime.linear",
    propertyName: "y",
    min: -30.0,
    max: 30.0,
    step: 0.001,
  });
  createMinMaxFloatFolderEntry({
    particleSystemConfig,
    recreateParticleSystem,
    parentFolder: linearVelocityFolder,
    rootPropertyName: "velocityOverLifetime.linear",
    propertyName: "z",
    min: -30.0,
    max: 30.0,
    step: 0.001,
  });
  /*
  const orbitalVelocityFolder = folder.addFolder("Orbital velocity");
  createMinMaxFloatFolderEntry({
    particleSystemConfig,
    recreateParticleSystem,
    parentFolder: orbitalVelocityFolder,
    rootPropertyName: "velocityOverLifetime.orbital",
    propertyName: "x",
    min: -30.0,
    max: 30.0,
    step: 0.001,
  });
  createMinMaxFloatFolderEntry({
    particleSystemConfig,
    recreateParticleSystem,
    parentFolder: orbitalVelocityFolder,
    rootPropertyName: "velocityOverLifetime.orbital",
    propertyName: "y",
    min: -30.0,
    max: 30.0,
    step: 0.001,
  });
  createMinMaxFloatFolderEntry({
    particleSystemConfig,
    recreateParticleSystem,
    parentFolder: orbitalVelocityFolder,
    rootPropertyName: "velocityOverLifetime.orbital",
    propertyName: "z",
    min: -30.0,
    max: 30.0,
    step: 0.001,
  });
*/
  return {
    onParticleSystemChange: () => {},
    onUpdate: () => {},
  };
};

// https://github.com/WesleyClements/asm-noise
// https://www.npmjs.com/package/@leodeslf/perlin-noise
