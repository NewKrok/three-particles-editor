import { createVector3FolderEntry } from "./entry-helpers";

export const createTransformEntries = ({
  parentFolder,
  particleSystemConfig,
  recreateParticleSystem,
}) => {
  const folder = parentFolder.addFolder("Transform");

  createVector3FolderEntry({
    particleSystemConfig,
    recreateParticleSystem,
    parentFolder: folder,
    rootPropertyName: "transform",
    propertyName: "position",
    min: -10.0,
    max: 10.0,
    step: 0.001,
  });

  createVector3FolderEntry({
    particleSystemConfig,
    recreateParticleSystem,
    parentFolder: folder,
    rootPropertyName: "transform",
    propertyName: "rotation",
    min: -360.0,
    max: 360.0,
    step: 0.001,
  });

  createVector3FolderEntry({
    particleSystemConfig,
    recreateParticleSystem,
    parentFolder: folder,
    rootPropertyName: "transform",
    propertyName: "scale",
    min: 0.001,
    max: 10.0,
    step: 0.001,
  });

  return {
    onParticleSystemChange: () => {},
    onUpdate: () => {},
  };
};
