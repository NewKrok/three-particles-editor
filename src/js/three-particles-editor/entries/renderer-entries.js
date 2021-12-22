import { TextureId } from "../texture-config";
import { getTexture } from "../assets";

export const createRendererEntries = ({
  parentFolder,
  particleSystemConfig,
  recreateParticleSystem,
}) => {
  let lastUsedTextureId = "";

  const folder = parentFolder.addFolder("Renderer");
  folder.close();

  particleSystemConfig._editorData.textureId =
    particleSystemConfig._editorData.textureId || TextureId.POINT;

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
