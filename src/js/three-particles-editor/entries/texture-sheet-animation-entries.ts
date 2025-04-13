import {
  createMinMaxFloatFolderEntry,
  createVector2FolderEntry,
} from "./entry-helpers";

import { TimeMode } from "@newkrok/three-particles";

let timeModeControllers: any[] = [];
let lastInitedTimeMode: string | null = null;

type TextureSheetAnimationEntriesParams = {
  folder?: any;
  parentFolder?: any;
  particleSystemConfig: any;
  recreateParticleSystem: () => void;
};

type TextureSheetAnimationEntriesResult = {
  onParticleSystemChange: () => void;
};

const createEntriesByTimeMode = ({
  folder,
  particleSystemConfig,
  recreateParticleSystem,
}: TextureSheetAnimationEntriesParams): void => {
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

export const createTextureSheetAnimationEntries = ({
  parentFolder,
  particleSystemConfig,
  recreateParticleSystem,
}: TextureSheetAnimationEntriesParams): TextureSheetAnimationEntriesResult => {
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
    onParticleSystemChange: (): void => {
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

const destroyTimeModeControllers = (): void => {
  timeModeControllers.forEach((controller) => controller.destroy());
  timeModeControllers = [];
};
