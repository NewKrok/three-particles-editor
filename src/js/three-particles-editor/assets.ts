import * as THREE from "three";

import { textureConfigs } from "./texture-config";

const textureLoader = new THREE.TextureLoader();




export const getTexture = (id: string) =>
  textureConfigs.find(({ id: configId }) => configId === id);


const loadTextures = ({ 
  textureConfigs, 
  onComplete 
}: { 
  textureConfigs: any[]; 
  onComplete: () => void;
}) => {
  const { id, url } = textureConfigs[0];
  textureLoader.load(url, (texture) => {
    // texture.flipX = false; // flipX property doesn't exist on THREE.Texture
    texture.flipY = false;
    const textureConfig = getTexture(id);
    if (textureConfig) {
      (textureConfig as any).map = texture;
    }
    if (textureConfigs.length > 1)
      loadTextures({ textureConfigs: textureConfigs.slice(1), onComplete });
    else onComplete();
  });
};


export const loadCustomAssets = ({ 
  textures, 
  onComplete 
}: { 
  textures: { id: string; url: string; }[]; 
  onComplete: () => void;
}) => {
  if (textures.length === 0) {
    onComplete();
    return;
  }

  textures.forEach(({ id, url }) => textureConfigs.push({ id, url }));
  loadTextures({
    textureConfigs: [...textures],
    onComplete,
  });
};


export const initAssets = (onComplete: () => void) =>
  loadTextures({ textureConfigs: [...textureConfigs], onComplete });
