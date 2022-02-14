import { TextureId, textureConfigs } from "../texture-config";

import { blendingMap } from "@newkrok/three-particles/src/js/effects/three-particles";
import { getTexture } from "../assets";

export const createRendererEntries = ({
  parentFolder,
  particleSystemConfig,
  recreateParticleSystem,
}) => {
  let lastUsedTextureId = "";

  const folder = parentFolder.addFolder("Renderer");
  folder.close();

  const setConfigByTexture = (textureId) => {
    lastUsedTextureId = textureId;
    const texture = getTexture(textureId);
    if (texture) {
      const { map, tiles } = texture;
      particleSystemConfig.map = map;
      particleSystemConfig._editorData.textureId = textureId;
      particleSystemConfig.textureSheetAnimation.tiles.x =
        tiles?.x || particleSystemConfig.textureSheetAnimation.tiles.x;
      particleSystemConfig.textureSheetAnimation.tiles.y =
        tiles?.y || particleSystemConfig.textureSheetAnimation.tiles.y;
    }
  };

  let controllers = [];

  const rebuild = () => {
    controllers.forEach((controller) => controller.destroy());
    controllers = [];

    let customAssetList =
      JSON.parse(localStorage.getItem("particle-system-editor/library")) || [];

    controllers.push(
      folder
        .add(
          particleSystemConfig._editorData,
          "textureId",
          customAssetList
            .map(({ name }) => name)
            .concat([
              TextureId.POINT,
              TextureId.GRADIENT_POINT,
              TextureId.CIRCLE,
              TextureId.CLOUD,
              TextureId.FLAME,
              TextureId.FLARE,
              TextureId.STAR,
              TextureId.STAR_TOON,
              TextureId.PLUS,
              TextureId.PLUS_TOON,
              TextureId.MOON,
              TextureId.RAINDROP,
              TextureId.LEAF_TOON,
              TextureId.SNOWFLAKE,
              TextureId.NUMBERS,
              TextureId.NUMBERS_TOON,
              TextureId.CONFETTI,
              TextureId.CONFETTI_TOON,
              TextureId.MAGIC_EXPLOSION,
            ])
        )
        .listen()
        .onChange((v) => {
          setConfigByTexture(v);
          recreateParticleSystem();
        })
    );
    setConfigByTexture(particleSystemConfig._editorData.textureId);

    controllers.push(
      folder
        .add(particleSystemConfig.renderer, "discardBackgroundColor")
        .onChange(recreateParticleSystem)
        .listen()
    );

    controllers.push(
      folder
        .add(
          particleSystemConfig.renderer,
          "backgroundColorTolerance",
          0.0,
          2.0,
          0.001
        )
        .onChange(recreateParticleSystem)
        .listen()
    );

    controllers.push(
      folder
        .addColor(particleSystemConfig.renderer, "backgroundColor")
        .onChange(recreateParticleSystem)
        .listen()
    );

    if (typeof particleSystemConfig.renderer.blending === "number")
      particleSystemConfig.renderer.blending = Object.keys(blendingMap).find(
        (entry) => blendingMap[entry] === particleSystemConfig.renderer.blending
      );
    controllers.push(
      folder
        .add(particleSystemConfig.renderer, "blending", [
          "THREE.NoBlending",
          "THREE.NormalBlending",
          "THREE.AdditiveBlending",
          "THREE.SubtractiveBlending",
          "THREE.MultiplyBlending",
        ])
        .listen()
        .onChange(recreateParticleSystem)
    );

    controllers.push(
      folder
        .add(particleSystemConfig.renderer, "transparent")
        .onChange(recreateParticleSystem)
        .listen()
    );

    controllers.push(
      folder
        .add(particleSystemConfig.renderer, "depthTest")
        .onChange(recreateParticleSystem)
        .listen()
    );

    controllers.push(
      folder
        .add(particleSystemConfig.renderer, "depthWrite")
        .onChange(recreateParticleSystem)
        .listen()
    );
  };

  rebuild();

  return {
    onParticleSystemChange: () => {
      // It looks onChange doesn't work on dropdown entry so have to handle it manually
      if (lastUsedTextureId !== particleSystemConfig._editorData.textureId) {
        setConfigByTexture(particleSystemConfig._editorData.textureId);
        recreateParticleSystem();
      }
    },
    onUpdate: () => {},
    onAssetUpdate: rebuild,
  };
};
