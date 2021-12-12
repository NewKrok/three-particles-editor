export const createMinMaxFloatFolderEntry = ({
  particleSystemConfig,
  recreateParticleSystem,
  parentFolder,
  propertyName,
  rootPropertyName,
  defaultMin,
  min,
  defaultMax,
  max,
  step,
}) => {
  const folder = parentFolder.addFolder(propertyName);
  const folderConfig = { min: defaultMin, max: defaultMax };
  folder
    .add(folderConfig, "min", min, max, step)
    .onChange((v) => {
      const propRef = rootPropertyName
        ? particleSystemConfig[rootPropertyName][propertyName]
        : particleSystemConfig[propertyName];
      propRef.min = Math.min(v, propRef.max);
      folderConfig.min = propRef.min;
      recreateParticleSystem();
    })
    .listen();
  folder
    .add(folderConfig, "max", min, max, step)
    .onChange((v) => {
      const propRef = rootPropertyName
        ? particleSystemConfig[rootPropertyName][propertyName]
        : particleSystemConfig[propertyName];
      propRef.max = Math.max(v, propRef.min);
      folderConfig.max = propRef.max;
      recreateParticleSystem();
    })
    .listen();
};

export const createMinMaxColorFolderEntry = ({
  particleSystemConfig,
  recreateParticleSystem,
  parentFolder,
  propertyName,
  defaultColorA,
  defaultColorB,
}) => {
  const folder = parentFolder.addFolder(propertyName);
  const folderConfig = {
    defaultColorA: { from: { ...defaultColorA } },
    defaultColorB: { to: { ...defaultColorB } },
  };
  folder
    .addColor(folderConfig.defaultColorA, "from")
    .onChange((v) => {
      particleSystemConfig[propertyName].min = v;
      recreateParticleSystem();
    })
    .listen();
  folder
    .addColor(folderConfig.defaultColorB, "to")
    .onChange((v) => {
      particleSystemConfig[propertyName].max = v;
      recreateParticleSystem();
    })
    .listen();
};

/*const createMinMaxVector3FolderEntry = ({
    parentFolder,
    rootPropertyName,
    propertyName,
    defaultMin,
    min,
    defaultMax,
    max,
    step,
  }) => {
    const folder = parentFolder.addFolder(propertyName)
  
    createMinMaxFloatFolderEntry({
      parentFolder: folder,
      rootPropertyName,
      propertyName: "x",
      defaultMin,
      min,
      defaultMax,
      max,
      step,
    })
    createMinMaxFloatFolderEntry({
      parentFolder: folder,
      rootPropertyName,
      propertyName: "y",
      defaultMin,
      min,
      defaultMax,
      max,
      step,
    })
    createMinMaxFloatFolderEntry({
      parentFolder: folder,
      rootPropertyName,
      propertyName: "z",
      defaultMin,
      min,
      defaultMax,
      max,
      step,
    })
  }
  */
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
