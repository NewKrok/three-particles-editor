import { createMinMaxFloatFolderEntry } from "./entry-helpers";

type RotationOverLifeTimeEntriesParams = {
  parentFolder: any;
  particleSystemConfig: any;
  recreateParticleSystem: () => void;
};

export const createRotationOverLifeTimeEntries = ({
  parentFolder,
  particleSystemConfig,
  recreateParticleSystem,
}: RotationOverLifeTimeEntriesParams): Record<string, unknown> => {
  const folder = parentFolder.addFolder("Rotation over lifetime");
  folder.close();

  folder
    .add(particleSystemConfig.rotationOverLifetime, "isActive")
    .onChange(recreateParticleSystem)
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

  return {};
};
