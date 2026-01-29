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

export const copyToClipboard = (particleSystemConfig) => {
  const type = 'text/plain';
  const blob = new Blob(
    [
      JSON.stringify({
        ...getObjectDiff(getDefaultParticleSystemConfig(), particleSystemConfig, {
          skippedProperties: ['map'],
        }),
        _editorData: { ...particleSystemConfig._editorData },
      }),
    ],
    {
      type: 'text/plain',
    }
  );
  const data = [new ClipboardItem({ [type]: blob })];

  navigator.clipboard.write(data);
};

export const loadFromClipboard = ({
  particleSystemConfig,
  recreateParticleSystem,
  onLoad,
}: {
  particleSystemConfig: any;
  recreateParticleSystem: () => void;
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
  recreateParticleSystem: () => void;
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

  patchObject(particleSystemConfig, getDefaultParticleSystemConfig(), {
    skippedProperties: [],
    applyToFirstObject: true,
  });
  deepMerge(particleSystemConfig, config, {
    skippedProperties: ['map'],
    applyToFirstObject: true,
  });
  setTerrain(particleSystemConfig._editorData.terrain?.textureId);
  recreateParticleSystem();

  // Call onLoad callback to notify entries about the loaded config
  if (onLoad) {
    onLoad();
  }

  // Show success notification
  showSuccessSnackbar('Particle system successfully loaded');
};
