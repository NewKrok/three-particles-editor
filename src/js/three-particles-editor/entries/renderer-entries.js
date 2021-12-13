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

  folder
    .add({ textureId: defaultTetxureId }, "textureId", [
      TextureId.POINT,
      TextureId.GRADIENT_POINT,
      TextureId.CLOUD,
      TextureId.STAR,
      TextureId.PLUS,
    ])
    .onChange((v) => {
      const { texture, tiles } = getTexture(v);
      particleSystemConfig.map = texture;
      particleSystemConfig.textureSheetAnimation.tiles = tiles;

      recreateParticleSystem();
    });

  const { texture, tiles } = getTexture(defaultTetxureId);
  particleSystemConfig.map = texture;
  particleSystemConfig.textureSheetAnimation.tiles = tiles;

  return {
    onParticleSystemChange: () => {},
    onUpdate: () => {},
  };
};
