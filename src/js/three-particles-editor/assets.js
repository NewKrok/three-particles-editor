import * as THREE from "three";

import { textureConfigs } from "./texture-config";

const textureLoader = new THREE.TextureLoader();

export const getTexture = (id) =>
  textureConfigs.find(({ id: configId }) => configId === id);

const loadTextures = ({ textureConfigs, onComplete }) => {
  const { id, url } = textureConfigs[0];
  textureLoader.load(url, (texture) => {
    texture.flipX = false;
    texture.flipY = false;
    getTexture(id).map = texture;
    if (textureConfigs.length > 1)
      loadTextures({ textureConfigs: textureConfigs.slice(1), onComplete });
    else onComplete();
  });
};

export const loadCustomAssets = ({ textures, onComplete }) => {
  textures.forEach(({ id, url }) => textureConfigs.push({ id, url }));
  loadTextures({
    textureConfigs: [...textures],
    onComplete,
  });
};

export const initAssets = (onComplete) =>
  loadTextures({ textureConfigs: [...textureConfigs], onComplete });
