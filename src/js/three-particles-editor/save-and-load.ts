import { getDefaultParticleSystemConfig } from '@newkrok/three-particles';
import { isConfigV2 } from './config-util';
import { convertToNewFormat } from './config-converter';
import { showLegacyConfigModal } from './showLegacyConfigModal';
import { ObjectUtils } from '@newkrok/three-utils';
import { setTerrain } from './world';

const { deepMerge, patchObject } = ObjectUtils;
import { showSuccessSnackbar } from '../stores/snackbar-store';

export const getObjectDiff = (objectA, objectB, config = { skippedProperties: [] }) => {
  const result = {};
  Object.keys(objectA).forEach((key) => {
    if (!config.skippedProperties || !config.skippedProperties.includes(key)) {
      if (
        typeof objectA[key] === 'object' &&
        objectA[key] &&
        objectB[key] &&
        !Array.isArray(objectA[key])
      ) {
        const objectDiff = getObjectDiff(objectA[key], objectB[key], config);
        if (Object.keys(objectDiff).length > 0) result[key] = objectDiff;
      } else {
        const mergedValue = objectB[key] ?? objectA[key];
        if (mergedValue !== objectA[key]) result[key] = mergedValue;
      }
    }
  });
  return result;
};

const serializeSubEmitters = (subEmitters: any[] | undefined): any[] | undefined => {
  if (!subEmitters || subEmitters.length === 0) return undefined;

  const defaultConfig = getDefaultParticleSystemConfig();

  return subEmitters.map((subEmitter) => {
    const serialized: any = {
      ...getObjectDiff(defaultConfig, subEmitter.config, {
        skippedProperties: ['map'],
      }),
    };

    // Preserve sub-emitter _editorData if present
    if (subEmitter.config._editorData) {
      serialized._editorData = { ...subEmitter.config._editorData };
    }

    // Recursively serialize nested sub-emitters
    if (subEmitter.config.subEmitters && subEmitter.config.subEmitters.length > 0) {
      serialized.subEmitters = serializeSubEmitters(subEmitter.config.subEmitters);
    }

    const result: any = { config: serialized };

    // Only include non-default values
    if (subEmitter.trigger !== undefined && subEmitter.trigger !== 'DEATH') {
      result.trigger = subEmitter.trigger;
    }
    if (subEmitter.inheritVelocity !== undefined && subEmitter.inheritVelocity !== 0) {
      result.inheritVelocity = subEmitter.inheritVelocity;
    }
    if (subEmitter.maxInstances !== undefined && subEmitter.maxInstances !== 32) {
      result.maxInstances = subEmitter.maxInstances;
    }

    return result;
  });
};

export const copyToClipboard = (particleSystemConfig) => {
  const type = 'text/plain';

  const serialized: any = {
    ...getObjectDiff(getDefaultParticleSystemConfig(), particleSystemConfig, {
      skippedProperties: ['map'],
    }),
    _editorData: { ...particleSystemConfig._editorData },
  };

  // Include sub-emitters if present
  const subEmitters = serializeSubEmitters(particleSystemConfig.subEmitters);
  if (subEmitters) {
    serialized.subEmitters = subEmitters;
  }

  const blob = new Blob([JSON.stringify(serialized)], { type: 'text/plain' });
  const data = [new ClipboardItem({ [type]: blob })];

  navigator.clipboard.write(data);
};

export const loadFromClipboard = ({
  particleSystemConfig,
  recreateParticleSystem,
  onLoad,
}: {
  particleSystemConfig: any;
  recreateParticleSystem: (markAsDirty?: boolean) => void;
  onLoad?: () => void;
}) => {
  navigator.clipboard
    .readText()
    .then((text) => {
      loadParticleSystem({
        config: JSON.parse(text),
        particleSystemConfig,
        recreateParticleSystem,
        onLoad,
      });
    })
    .catch(() => {
      // Handle clipboard read error silently
      // In a production app, we might want to show a notification to the user
    });
};

export const loadParticleSystem = ({
  config,
  particleSystemConfig,
  recreateParticleSystem,
  onLoad,
}: {
  config: any;
  particleSystemConfig: any;
  recreateParticleSystem: (markAsDirty?: boolean) => void;
  onLoad?: () => void;
}) => {
  // Check if the loaded configuration is from version 2.0.0 or newer
  const isV2Config = isConfigV2(config);

  if (!isV2Config) {
    // Show the legacy config modal to notify the user
    showLegacyConfigModal.set(true);

    // Convert the old configuration to the new format
    const convertedConfig = convertToNewFormat(config);

    // Use the converted config instead of the original
    config = convertedConfig;
  }

  // Expand sub-emitter configs from diff form to full configs before merging
  if (config.subEmitters && Array.isArray(config.subEmitters)) {
    config.subEmitters = config.subEmitters.map((subEmitter: any) => {
      const fullSubConfig = { ...getDefaultParticleSystemConfig() };
      // Remove map (THREE.Texture) to avoid circular references during deepMerge
      delete fullSubConfig.map;
      deepMerge(fullSubConfig, subEmitter.config || {}, {
        skippedProperties: ['map'],
        applyToFirstObject: true,
      });
      return {
        ...subEmitter,
        config: fullSubConfig,
      };
    });
  }

  patchObject(particleSystemConfig, getDefaultParticleSystemConfig(), {
    skippedProperties: [],
    applyToFirstObject: true,
  });

  // Remove existing subEmitters before merge (deepMerge doesn't handle array replacement well)
  delete particleSystemConfig.subEmitters;

  deepMerge(particleSystemConfig, config, {
    skippedProperties: ['map'],
    applyToFirstObject: true,
  });
  setTerrain(particleSystemConfig._editorData.terrain?.textureId);
  recreateParticleSystem(false);

  // Call onLoad callback to notify entries about the loaded config
  if (onLoad) {
    onLoad();
  }

  // Show success notification
  showSuccessSnackbar('Particle system successfully loaded');
};
