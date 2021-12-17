import {
  createMinMaxFloatFolderEntry,
  createVector2FolderEntry,
} from "./entry-helpers";

import { TimeMode } from "@newkrok/three-particles/src/js/effects/three-particles";

let timeModeControllers = [];

export const createTextureSheetAnimationEntries = ({
  parentFolder,
  particleSystemConfig,
  recreateParticleSystem,
}) => {
  const folder = parentFolder.addFolder("Texture Sheet Animation");
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
    useListen: true,
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
    useListen: true,
  });

  folder
    .add(particleSystemConfig.textureSheetAnimation, "timeMode", [
      TimeMode.LIFE_TIME,
      TimeMode.FPS,
    ])
    .onChange((v) => {
      particleSystemConfig.textureSheetAnimation.timeMode = v;
      createEntriesByTimeMode({
        folder,
        particleSystemConfig,
        recreateParticleSystem,
      });
    });

  return {
    onParticleSystemChange: () => {},
    onUpdate: () => {},
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
  destroyTimeModeControllers();
  switch (particleSystemConfig.textureSheetAnimation.timeMode) {
    case TimeMode.FPS:
      timeModeControllers.push(
        folder
          .add(particleSystemConfig.textureSheetAnimation, "fps", 0, 60, 1)
          .listen()
          .onChange((v) => {
            particleSystemConfig.textureSheetAnimation.fps = v;
            recreateParticleSystem();
          })
      );
      break;
  }
  recreateParticleSystem();
};