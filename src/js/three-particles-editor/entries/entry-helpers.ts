const resolveProperty = (rootObject: any, property: string): any =>
  property !== ""
    ? property.split(".").reduce((prev, current) => prev[current], rootObject)
    : rootObject;

type MinMaxFloatFolderEntryParams = {
  particleSystemConfig: any;
  recreateParticleSystem: () => void;
  parentFolder: any;
  rootPropertyName?: string;
  propertyName: string;
  min?: number;
  max?: number;
  step?: number;
};

export const createMinMaxFloatFolderEntry = ({
  particleSystemConfig,
  recreateParticleSystem,
  parentFolder,
  rootPropertyName = "",
  propertyName,
  min,
  max,
  step,
}: MinMaxFloatFolderEntryParams): any => {
  const folder = parentFolder.addFolder(propertyName);
  const propertyReference = resolveProperty(
    particleSystemConfig,
    rootPropertyName
  )[propertyName];

  folder
    .add(propertyReference, "min", min, max, step)
    .onChange((v: number) => {
      propertyReference.min = Math.min(v, propertyReference.max);
      recreateParticleSystem();
    })
    .listen();
  folder
    .add(propertyReference, "max", min, max, step)
    .onChange((v: number) => {
      propertyReference.max = Math.max(v, propertyReference.min);
      recreateParticleSystem();
    })
    .listen();

  return folder;
};

type MinMaxColorFolderEntryParams = {
  particleSystemConfig: any;
  recreateParticleSystem: () => void;
  parentFolder: any;
  rootPropertyName?: string;
  propertyName: string;
};

export const createMinMaxColorFolderEntry = ({
  particleSystemConfig,
  recreateParticleSystem,
  parentFolder,
  rootPropertyName = "",
  propertyName,
}: MinMaxColorFolderEntryParams): any => {
  const folder = parentFolder.addFolder(propertyName);
  const propertyReference = resolveProperty(
    particleSystemConfig,
    rootPropertyName
  )[propertyName];

  folder
    .addColor(propertyReference, "min")
    .onChange((v: any) => {
      propertyReference.min = v;
      recreateParticleSystem();
    })
    .listen();
  folder
    .addColor(propertyReference, "max")
    .onChange((v: any) => {
      propertyReference.max = v;
      recreateParticleSystem();
    })
    .listen();

  return folder;
};

type Vector2FolderEntryParams = {
  particleSystemConfig: any;
  recreateParticleSystem: () => void;
  parentFolder: any;
  rootPropertyName?: string;
  propertyName: string;
  min?: number;
  max?: number;
  step?: number;
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
}: Vector2FolderEntryParams): any => {
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

type Vector3FolderEntryParams = {
  particleSystemConfig: any;
  recreateParticleSystem: () => void;
  parentFolder: any;
  rootPropertyName?: string;
  propertyName: string;
  min?: number;
  max?: number;
  step?: number;
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
}: Vector3FolderEntryParams): any => {
  const folder = parentFolder.addFolder(propertyName);
  const propertyReference = resolveProperty(
    particleSystemConfig,
    rootPropertyName
  )[propertyName];

  folder
    .add(propertyReference, "x", min, max, step)
    .onChange((v: number) => {
      propertyReference.x = v;
      recreateParticleSystem();
    })
    .listen();
  folder
    .add(propertyReference, "y", min, max, step)
    .onChange((v: number) => {
      propertyReference.y = v;
      recreateParticleSystem();
    })
    .listen();
  folder
    .add(propertyReference, "z", min, max, step)
    .onChange((v: number) => {
      propertyReference.z = v;
      recreateParticleSystem();
    })
    .listen();

  return folder;
};

/* Commented out code from original file
export const createMinMaxVector3FolderEntry = ({
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
};

const createMinMaxVector4FolderEntry = ({
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
  }
*/
