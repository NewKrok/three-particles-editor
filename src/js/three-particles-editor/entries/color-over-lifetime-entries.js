import { createMinMaxColorFolderEntry } from "./entry-helpers";

export const createColorOverLifeTimeEntries = ({
  parentFolder,
  particleSystemConfig,
  recreateParticleSystem,
}) => {
  const folder = parentFolder.addFolder("Color over lifetime");
  folder.close();

  folder
    .add(particleSystemConfig.colorOverLifetime, "isActive")
    .onChange((v) => {
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

  return {
    onParticleSystemChange: () => {},
    onUpdate: () => {},
  };
};
