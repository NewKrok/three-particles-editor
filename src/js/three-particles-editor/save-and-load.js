import { getDefaultParticleSystemConfig } from "@newkrok/three-particles/src/js/effects/three-particles";
import { patchObject } from "@newkrok/three-particles/src/js/effects/three-particles-utils";

const getObjectDiff = (
  objectA,
  objectB,
  config = { skippedProperties: [] }
) => {
  const result = {};
  Object.keys(objectA).forEach((key) => {
    if (!config.skippedProperties || !config.skippedProperties.includes(key)) {
      if (typeof objectA[key] === "object" && objectA[key] && objectB[key]) {
        const objectDiff = getObjectDiff(objectA[key], objectB[key], config);
        if (Object.keys(objectDiff).length > 0) result[key] = objectDiff;
      } else {
        const mergedValue =
          objectB[key] === 0 ? 0 : objectB[key] || objectA[key];
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
      JSON.stringify(
        getObjectDiff(getDefaultParticleSystemConfig(), particleSystemConfig, {
          skippedProperties: ["map"],
        })
      ),
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
      const externalObject = JSON.parse(text);
      patchObject(particleSystemConfig, externalObject, {
        skippedProperties: ["map"],
        applyToFirstObject: true,
      });
      recreateParticleSystem();
    })
    .catch((err) => {
      console.error("Failed to read clipboard contents: ", err);
    });
};
