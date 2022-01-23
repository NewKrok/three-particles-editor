import * as THREE from "three/build/three.module";

import { TextureId } from "../texture-config";
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
    const { map, tiles } = getTexture(textureId);
    particleSystemConfig.map = map;
    particleSystemConfig._editorData.textureId = textureId;
    particleSystemConfig.textureSheetAnimation.tiles.x = tiles?.x || 1;
    particleSystemConfig.textureSheetAnimation.tiles.y = tiles?.y || 1;
  };

  folder
    .add(particleSystemConfig._editorData, "textureId", [
      TextureId.POINT,
      TextureId.GRADIENT_POINT,
      TextureId.CIRCLE,
      TextureId.CLOUD,
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
    .listen()
    .onChange((v) => {
      setConfigByTexture(v);
      recreateParticleSystem();
    });
  setConfigByTexture(particleSystemConfig._editorData.textureId);

  if (typeof particleSystemConfig.renderer.blending === "number")
    particleSystemConfig.renderer.blending = Object.keys(blendingMap).find(
      (entry) => blendingMap[entry] === particleSystemConfig.renderer.blending
    );
  folder
    .add(particleSystemConfig.renderer, "blending", [
      "THREE.NoBlending",
      "THREE.NormalBlending",
      "THREE.AdditiveBlending",
      "THREE.SubtractiveBlending",
      "THREE.MultiplyBlending",
    ])
    .listen()
    .onChange(recreateParticleSystem);

  folder
    .add(particleSystemConfig.renderer, "transparent")
    .onChange(recreateParticleSystem)
    .listen();

  folder
    .add(particleSystemConfig.renderer, "depthTest")
    .onChange(recreateParticleSystem)
    .listen();

  folder
    .add(particleSystemConfig.renderer, "depthWrite")
    .onChange(recreateParticleSystem)
    .listen();

  return {
    onParticleSystemChange: () => {
      // It looks onChange doesn't work on dropdown entry so have to handle it manually
      if (lastUsedTextureId !== particleSystemConfig._editorData.textureId) {
        setConfigByTexture(particleSystemConfig._editorData.textureId);
        recreateParticleSystem();
      }
    },
    onUpdate: () => {},
  };
};
