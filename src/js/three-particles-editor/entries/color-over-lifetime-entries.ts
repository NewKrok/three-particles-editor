import { createMinMaxColorFolderEntry } from "./entry-helpers";

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
  const folder = parentFolder.addFolder("Color over lifetime");
  folder.close();

  folder
    .add(particleSystemConfig.colorOverLifetime, "isActive")
    .onChange((v: boolean) => {
      particleSystemConfig.looping = v;
      recreateParticleSystem();
    })
    .listen();

  createMinMaxColorFolderEntry({
    particleSystemConfig,
    recreateParticleSystem,
    parentFolder: folder,
    rootPropertyName: "colorOverLifetime",
    propertyName: "gradient",
  });

  return {};
};
