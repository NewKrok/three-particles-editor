import { createMinMaxFloatFolderEntry } from "./entry-helpers";

export const createRotationOverLifeTimeEntries = ({
  parentFolder,
  particleSystemConfig,
  recreateParticleSystem,
}) => {
  const folder = parentFolder.addFolder("Rotation over lifetime");
  folder.close();

  folder
    .add(particleSystemConfig.rotationOverLifetime, "isActive")
    .onChange((v) => {
      particleSystemConfig.rotationOverLifetime.isActive = v;
      recreateParticleSystem();
    })
    .listen();

  const linearVelocityFolder = folder.addFolder("Angular velocity");
  createMinMaxFloatFolderEntry({
    particleSystemConfig,
    recreateParticleSystem,
    parentFolder: linearVelocityFolder,
    propertyName: "rotationOverLifetime",
    min: -500.0,
    max: 500.0,
    step: 0.1,
  });

  return {
    onParticleSystemChange: () => {},
    onUpdate: () => {},
  };
};
