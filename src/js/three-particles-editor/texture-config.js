import * as THREE from "three/build/three.module";

export const TextureId = {
  POINT: "POINT",
  GRADIENT_POINT: "GRADIENT_POINT",
  CIRCLE: "CIRCLE",
  CLOUD: "CLOUD",
  FLARE: "FLARE",
  STAR: "STAR",
  STAR_TOON: "STAR_TOON",
  PLUS: "PLUS",
  PLUS_TOON: "PLUS_TOON",
  MOON: "MOON",
  RAINDROP: "RAINDROP",
  LEAF_TOON: "LEAF_TOON",
  SNOWFLAKE: "SNOWFLAKE",
  NUMBERS: "NUMBERS",
  NUMBERS_TOON: "NUMBERS_TOON",
  CONFETTI: "CONFETTI",
  CONFETTI_TOON: "CONFETTI_TOON",
  MAGIC_EXPLOSION: "MAGIC_EXPLOSION",
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
    id: TextureId.CIRCLE,
    url: "./assets/textures/circle.webp",
  },
  {
    id: TextureId.CLOUD,
    url: "./assets/textures/cloud.webp",
  },
  {
    id: TextureId.FLARE,
    url: "./assets/textures/flare.webp",
  },
  {
    id: TextureId.STAR,
    url: "./assets/textures/star.webp",
  },
  {
    id: TextureId.STAR_TOON,
    url: "./assets/textures/star-toon.webp",
  },
  {
    id: TextureId.PLUS,
    url: "./assets/textures/plus.webp",
  },
  {
    id: TextureId.PLUS_TOON,
    url: "./assets/textures/plus-toon.webp",
  },
  {
    id: TextureId.MOON,
    url: "./assets/textures/moon.webp",
  },
  {
    id: TextureId.RAINDROP,
    url: "./assets/textures/raindrop.webp",
  },
  {
    id: TextureId.LEAF_TOON,
    url: "./assets/textures/leaf-toon.webp",
  },
  {
    id: TextureId.SNOWFLAKE,
    url: "./assets/textures/snowflake.webp",
  },
  {
    id: TextureId.NUMBERS,
    url: "./assets/textures/numbers.webp",
    tiles: new THREE.Vector2(5.0, 2.0),
  },
  {
    id: TextureId.NUMBERS_TOON,
    url: "./assets/textures/numbers-toon.webp",
    tiles: new THREE.Vector2(5.0, 2.0),
  },
  {
    id: TextureId.CONFETTI,
    url: "./assets/textures/confetti.webp",
    tiles: new THREE.Vector2(5.0, 2.0),
  },
  {
    id: TextureId.CONFETTI_TOON,
    url: "./assets/textures/confetti-toon.webp",
    tiles: new THREE.Vector2(5.0, 2.0),
  },
  {
    id: TextureId.MAGIC_EXPLOSION,
    url: "./assets/textures/magic-explosion.webp",
    tiles: new THREE.Vector2(5.0, 2.0),
  },
];
