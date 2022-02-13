const resolveProperty = (rootObject, property) =>
  property !== ""
    ? property.split(".").reduce((prev, current) => prev[current], rootObject)
    : rootObject;

export const createMinMaxFloatFolderEntry = ({
  particleSystemConfig,
  recreateParticleSystem,
  parentFolder,
  rootPropertyName = "",
  propertyName,
  min,
  max,
  step,
}) => {
  const folder = parentFolder.addFolder(propertyName);
  const propertyReference = resolveProperty(
    particleSystemConfig,
    rootPropertyName
  )[propertyName];

  folder
    .add(propertyReference, "min", min, max, step)
    .onChange((v) => {
      propertyReference.min = Math.min(v, propertyReference.max);
      recreateParticleSystem();
    })
    .listen();
  folder
    .add(propertyReference, "max", min, max, step)
    .onChange((v) => {
      propertyReference.max = Math.max(v, propertyReference.min);
      recreateParticleSystem();
    })
    .listen();

  return folder;
};

export const createMinMaxColorFolderEntry = ({
  particleSystemConfig,
  recreateParticleSystem,
  parentFolder,
  rootPropertyName = "",
  propertyName,
}) => {
  const folder = parentFolder.addFolder(propertyName);
  const propertyReference = resolveProperty(
    particleSystemConfig,
    rootPropertyName
  )[propertyName];

  folder
    .addColor(propertyReference, "min")
    .onChange((v) => {
      propertyReference.min = v;
      recreateParticleSystem();
    })
    .listen();
  folder
    .addColor(propertyReference, "max")
    .onChange((v) => {
      propertyReference.max = v;
      recreateParticleSystem();
    })
    .listen();

  return folder;
};

export const createVector2FolderEntry = ({
  particleSystemConfig,
  recreateParticleSystem,
  parentFolder,
  rootPropertyName = "",
  propertyName,
  min,
  max,
  step,
}) => {
  const folder = parentFolder.addFolder(propertyName);
  const propertyReference = resolveProperty(
    particleSystemConfig,
    rootPropertyName
  )[propertyName];

  folder
    .add(propertyReference, "x", min, max, step)
    .onChange(() => recreateParticleSystem())
    .listen();
  folder
    .add(propertyReference, "y", min, max, step)
    .onChange(() => recreateParticleSystem())
    .listen();

  return folder;
};

export const createVector3FolderEntry = ({
  particleSystemConfig,
  recreateParticleSystem,
  parentFolder,
  rootPropertyName = "",
  propertyName,
  min,
  max,
  step,
}) => {
  const folder = parentFolder.addFolder(propertyName);
  const propertyReference = resolveProperty(
    particleSystemConfig,
    rootPropertyName
  )[propertyName];

  folder
    .add(propertyReference, "x", min, max, step)
    .onChange((v) => {
      propertyReference.x = v;
      recreateParticleSystem();
    })
    .listen();
  folder
    .add(propertyReference, "y", min, max, step)
    .onChange((v) => {
      propertyReference.y = v;
      recreateParticleSystem();
    })
    .listen();
  folder
    .add(propertyReference, "z", min, max, step)
    .onChange((v) => {
      propertyReference.z = v;
      recreateParticleSystem();
    })
    .listen();

  return folder;
};

/* export const createMinMaxVector3FolderEntry = ({
  parentFolder,
  rootPropertyName,
  propertyName,
  defaultMin,
  min,
  defaultMax,
  max,
  step,
}) => {
  const folder = parentFolder.addFolder(propertyName);

  createMinMaxFloatFolderEntry({
    parentFolder: folder,
    rootPropertyName,
    propertyName: "x",
    defaultMin,
    min,
    defaultMax,
    max,
    step,
  });
  createMinMaxFloatFolderEntry({
    parentFolder: folder,
    rootPropertyName,
    propertyName: "y",
    defaultMin,
    min,
    defaultMax,
    max,
    step,
  });
  createMinMaxFloatFolderEntry({
    parentFolder: folder,
    rootPropertyName,
    propertyName: "z",
    defaultMin,
    min,
    defaultMax,
    max,
    step,
  });

  return folder;
}; */

/*const createMinMaxVector4FolderEntry = ({
    parentFolder,
    rootPropertyName,
    subPropertyNames,
    defaultMin,
    min,
    defaultMax,
    max,
    step,
  }) => {
    const folder = parentFolder.addFolder(rootPropertyName)
  
    createMinMaxFloatFolderEntry({
      parentFolder: folder,
      rootPropertyName,
      propertyName: subPropertyNames ? subPropertyNames[0] : "x",
      defaultMin,
      min,
      defaultMax,
      max,
      step,
    })
    createMinMaxFloatFolderEntry({
      parentFolder: folder,
      rootPropertyName,
      propertyName: subPropertyNames ? subPropertyNames[1] : "y",
      defaultMin,
      min,
      defaultMax,
      max,
      step,
    })
    createMinMaxFloatFolderEntry({
      parentFolder: folder,
      rootPropertyName,
      propertyName: subPropertyNames ? subPropertyNames[2] : "z",
      defaultMin,
      min,
      defaultMax,
      max,
      step,
    })
    createMinMaxFloatFolderEntry({
      parentFolder: folder,
      rootPropertyName,
      propertyName: subPropertyNames ? subPropertyNames[3] : "w",
      defaultMin,
      min,
      defaultMax,
      max,
      step,
    })
  }*/
