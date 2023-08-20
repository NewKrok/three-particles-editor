import {
  createMinMaxFloatFolderEntry,
  createVector2FolderEntry,
} from "./entry-helpers";

import { TimeMode } from "@newkrok/three-particles/src/js/effects/three-particles/three-particles-enums.js";

let timeModeControllers = [];
let lastInitedTimeMode = null;

export const createTextureSheetAnimationEntries = ({
  parentFolder,
  particleSystemConfig,
  recreateParticleSystem,
}) => {
  const folder = parentFolder.addFolder("Texture sheet animation");
  folder.close();

  createVector2FolderEntry({
    particleSystemConfig,
    recreateParticleSystem,
    parentFolder: folder,
    rootPropertyName: "textureSheetAnimation",
    propertyName: "tiles",
    min: 1.0,
    max: 10.0,
    step: 1.0,
  });

  createMinMaxFloatFolderEntry({
    particleSystemConfig,
    recreateParticleSystem,
    parentFolder: folder,
    rootPropertyName: "textureSheetAnimation",
    propertyName: "startFrame",
    min: 0.0,
    max: 100.0,
    step: 1.0,
  });

  folder
    .add(particleSystemConfig.textureSheetAnimation, "timeMode", [
      TimeMode.LIFETIME,
      TimeMode.FPS,
    ])
    .onChange(() => {
      createEntriesByTimeMode({
        folder,
        particleSystemConfig,
        recreateParticleSystem,
      });
    })
    .listen();

  return {
    onParticleSystemChange: () => {
      if (
        lastInitedTimeMode !==
        particleSystemConfig.textureSheetAnimation.timeMode
      )
        createEntriesByTimeMode({
          folder,
          particleSystemConfig,
          recreateParticleSystem,
        });
    },
  };
};

const destroyTimeModeControllers = () => {
  timeModeControllers.forEach((controller) => controller.destroy());
  timeModeControllers = [];
};

const createEntriesByTimeMode = ({
  folder,
  particleSystemConfig,
  recreateParticleSystem,
}) => {
  lastInitedTimeMode = particleSystemConfig.textureSheetAnimation.timeMode;
  destroyTimeModeControllers();
  switch (particleSystemConfig.textureSheetAnimation.timeMode) {
    case TimeMode.FPS:
      timeModeControllers.push(
        folder
          .add(particleSystemConfig.textureSheetAnimation, "fps", 0, 60, 1)
          .listen()
          .onChange(recreateParticleSystem)
      );
      break;
  }
  recreateParticleSystem();
};
