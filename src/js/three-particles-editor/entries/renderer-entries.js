import { TextureId } from "../texture-config";
import { getTexture } from "../assets";

export const createRendererEntries = ({
  parentFolder,
  particleSystemConfig,
  recreateParticleSystem,
}) => {
  const folder = parentFolder.addFolder("Renderer");
  folder.close();

  const defaultTetxureId = TextureId.POINT;
  const setConfigByTexture = ({ map, tiles, fps, startFrame }) => {
    particleSystemConfig.map = map;
    particleSystemConfig.textureSheetAnimation.tiles.x = tiles?.x || 1;
    particleSystemConfig.textureSheetAnimation.tiles.y = tiles?.y || 1;
  };

  folder
    .add({ textureId: defaultTetxureId }, "textureId", [
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
      TextureId.NUMBERS,
      TextureId.NUMBERS_TOON,
      TextureId.CONFETTI,
      TextureId.CONFETTI_TOON,
      TextureId.MAGIC_EXPLOSION,
    ])
    .listen()
    .onChange((v) => {
      setConfigByTexture(getTexture(v));
      recreateParticleSystem();
    });

  setConfigByTexture(getTexture(defaultTetxureId));

  return {
    onParticleSystemChange: () => {},
    onUpdate: () => {},
  };
};
