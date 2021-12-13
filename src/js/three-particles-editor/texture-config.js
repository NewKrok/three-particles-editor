import * as THREE from "three/build/three.module";

export const TextureId = {
  POINT: "POINT",
  GRADIENT_POINT: "GRADIENT_POINT",
  CLOUD: "CLOUD",
  STAR: "STAR",
  PLUS: "PLUS",
};

export const textureConfigs = [
  {
    id: TextureId.POINT,
    url: "./assets/textures/point.webp",
  },
  {
    id: TextureId.GRADIENT_POINT,
    url: "./assets/textures/gradient-point.webp",
  },
  {
    id: TextureId.CLOUD,
    url: "./assets/textures/cloud.webp",
  },
  {
    id: TextureId.STAR,
    url: "./assets/textures/star.webp",
  },
  {
    id: TextureId.PLUS,
    url: "./assets/textures/plus.webp",
  },
  /* ,
  {
    id: TextureId.Tile,
    url: "/assets/textures/tile.png",
    tiles: new THREE.Vector2(7.0, 7.0),
  }, */
];
