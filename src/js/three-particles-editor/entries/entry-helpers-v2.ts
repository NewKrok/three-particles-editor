import { Constant, LifetimeCurve, RandomBetweenTwoConstants } from '@newkrok/three-particles';
import { LifeTimeCurve } from '@newkrok/three-particles';

const resolveProperty = (rootObject: any, property: string): any =>
  property !== ""
    ? property.split(".").reduce((prev, current) => prev[current], rootObject)
    : rootObject;

type ValueType = Constant | RandomBetweenTwoConstants | LifetimeCurve;

// Helper function to determine if a value is a RandomBetweenTwoConstants
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isRandomBetweenTwoConstants = (value: ValueType): value is RandomBetweenTwoConstants => {
  return typeof value === 'object' && 'min' in value && 'max' in value;
};

// Helper function to determine if a value is a LifetimeCurve
const isLifetimeCurve = (value: ValueType): value is LifetimeCurve => {
  return typeof value === 'object' && 'type' in value;
};

// Helper function to convert value to RandomBetweenTwoConstants if it's not already
// Note: This function is not currently used, but may be needed later
/* 
const ensureRandomBetweenTwoConstants = (value: ValueType): RandomBetweenTwoConstants => {
  if (isRandomBetweenTwoConstants(value)) {
    return value;
  } else if (isLifetimeCurve(value)) {
    // Convert LifetimeCurve to RandomBetweenTwoConstants (simplified)
    return { min: 0, max: 1 };
  } else {
    // Convert Constant to RandomBetweenTwoConstants
    return { min: value, max: value };
  }
};
*/

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
  const propertyContainer = resolveProperty(
    particleSystemConfig,
    rootPropertyName
  );
  
  // Handle the case where the property might be a Constant, RandomBetweenTwoConstants, or LifetimeCurve
  let propertyValue = propertyContainer[propertyName];
  
  // If the property is a Constant (number), convert it to RandomBetweenTwoConstants
  if (typeof propertyValue === 'number') {
    propertyContainer[propertyName] = { min: propertyValue, max: propertyValue };
    propertyValue = propertyContainer[propertyName];
  }
  
  // If the property is a LifetimeCurve, we need to handle it differently
  // For now, we'll just convert it to RandomBetweenTwoConstants for UI purposes
  if (isLifetimeCurve(propertyValue)) {
    propertyContainer[propertyName] = { min: 0, max: 1 }; // Default values
    propertyValue = propertyContainer[propertyName];
  }

  folder
    .add(propertyValue, "min", min, max, step)
    .onChange((v: number) => {
      propertyValue.min = Math.min(v, propertyValue.max);
      recreateParticleSystem();
    })
    .listen();
    
  folder
    .add(propertyValue, "max", min, max, step)
    .onChange((v: number) => {
      propertyValue.max = Math.max(v, propertyValue.min);
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
    .onChange(() => recreateParticleSystem())
    .listen();
    
  folder
    .add(propertyReference, "y", min, max, step)
    .onChange(() => recreateParticleSystem())
    .listen();
    
  folder
    .add(propertyReference, "z", min, max, step)
    .onChange(() => recreateParticleSystem())
    .listen();

  return folder;
};

type LifetimeCurveFolderEntryParams = {
  particleSystemConfig: any;
  recreateParticleSystem: () => void;
  parentFolder: any;
  rootPropertyName?: string;
  propertyName: string;
};

export const createLifetimeCurveFolderEntry = ({
  particleSystemConfig,
  recreateParticleSystem,
  parentFolder,
  rootPropertyName = "",
  propertyName,
}: LifetimeCurveFolderEntryParams): any => {
  const folder = parentFolder.addFolder(propertyName);
  const propertyContainer = resolveProperty(
    particleSystemConfig,
    rootPropertyName
  );
  
  // If the property doesn't exist or isn't a LifetimeCurve, create a default one
  if (!propertyContainer[propertyName] || !isLifetimeCurve(propertyContainer[propertyName])) {
    propertyContainer[propertyName] = {
      type: LifeTimeCurve.BEZIER,
      bezierPoints: [
        { x: 0, y: 0, percentage: 0 },
        { x: 1, y: 1, percentage: 1 },
      ],
    };
  }
  
  const propertyReference = propertyContainer[propertyName];
  
  // Add UI controls for the curve type
  // Use string literals instead of enum values to avoid 'const' enum issues
  folder
    .add(propertyReference, "type", [
      "BEZIER",
      "EASING"
    ])
    .onChange(() => recreateParticleSystem())
    .listen();
  
  // Add scale control if it exists
  if ('scale' in propertyReference) {
    folder
      .add(propertyReference, "scale", 0, 10, 0.1)
      .onChange(() => recreateParticleSystem())
      .listen();
  }
  
  // For bezier curves, we could add controls for the points, but that's complex
  // and might be better handled by a dedicated curve editor component
  
  return folder;
};
