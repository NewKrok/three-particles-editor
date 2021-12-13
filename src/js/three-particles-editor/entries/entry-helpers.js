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
  const currentValue = resolveProperty(particleSystemConfig, rootPropertyName)[
    propertyName
  ];

  folder
    .add(currentValue, "min", min, max, step)
    .onChange((v) => {
      const currentValue = resolveProperty(
        particleSystemConfig,
        rootPropertyName
      )[propertyName];
      currentValue.min = Math.min(v, currentValue.max);
      recreateParticleSystem();
    })
    .listen();
  folder
    .add(currentValue, "max", min, max, step)
    .onChange((v) => {
      const currentValue = resolveProperty(
        particleSystemConfig,
        rootPropertyName
      )[propertyName];
      currentValue.max = Math.max(v, currentValue.min);
      recreateParticleSystem();
    })
    .listen();

  return folder;
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
  const currentValue = resolveProperty(particleSystemConfig, rootPropertyName)[
    propertyName
  ];

  folder.add({ x: currentValue.x }, "x", min, max, step).onChange((v) => {
    resolveProperty(particleSystemConfig, rootPropertyName)[propertyName].x = v;
    recreateParticleSystem();
  });
  folder.add({ y: currentValue.y }, "y", min, max, step).onChange((v) => {
    resolveProperty(particleSystemConfig, rootPropertyName)[propertyName].y = v;
    recreateParticleSystem();
  });

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
  const currentValue = resolveProperty(particleSystemConfig, rootPropertyName)[
    propertyName
  ];

  folder.add({ x: currentValue.x }, "x", min, max, step).onChange((v) => {
    resolveProperty(particleSystemConfig, rootPropertyName)[propertyName].x = v;
    recreateParticleSystem();
  });
  folder.add({ y: currentValue.y }, "y", min, max, step).onChange((v) => {
    resolveProperty(particleSystemConfig, rootPropertyName)[propertyName].y = v;
    recreateParticleSystem();
  });
  folder.add({ z: currentValue.z }, "z", min, max, step).onChange((v) => {
    resolveProperty(particleSystemConfig, rootPropertyName)[propertyName].z = v;
    recreateParticleSystem();
  });

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
