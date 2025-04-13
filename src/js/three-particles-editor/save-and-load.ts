import { getDefaultParticleSystemConfig } from "@newkrok/three-particles";
import { patchObject } from "@newkrok/three-utils/src/js/newkrok/three-utils/object-utils.js";
import { setTerrain } from "./world";

const getObjectDiff = (
  objectA,
  objectB,
  config = { skippedProperties: [] }
) => {
  const result = {};
  Object.keys(objectA).forEach((key) => {
    if (!config.skippedProperties || !config.skippedProperties.includes(key)) {
      if (
        typeof objectA[key] === "object" &&
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
  const type = "text/plain";
  const blob = new Blob(
    [
      JSON.stringify({
        ...getObjectDiff(
          getDefaultParticleSystemConfig(),
          particleSystemConfig,
          {
            skippedProperties: ["map"],
          }
        ),
        _editorData: { ...particleSystemConfig._editorData },
      }),
    ],
    {
      type: "text/plain",
    }
  );
  const data = [new ClipboardItem({ [type]: blob })];

  navigator.clipboard.write(data);
};

export const loadFromClipboard = ({
  particleSystemConfig,
  recreateParticleSystem,
}) => {
  navigator.clipboard
    .readText()
    .then((text) => {
      loadParticleSystem({
        config: JSON.parse(text),
        particleSystemConfig,
        recreateParticleSystem,
      });
    })
    .catch((err) => {
      console.error("Failed to read clipboard contents: ", err);
    });
};

export const loadParticleSystem = ({
  config,
  particleSystemConfig,
  recreateParticleSystem,
}) => {
  patchObject(particleSystemConfig, getDefaultParticleSystemConfig(), {
    skippedProperties: [],
    applyToFirstObject: true,
  });
  patchObject(particleSystemConfig, config, {
    skippedProperties: ["map"],
    applyToFirstObject: true,
  });
  setTerrain(particleSystemConfig._editorData.terrain?.textureId);

  recreateParticleSystem();
};
