import * as THREE from "three";

export const TextureId = {
  TERRAIN_CHESS_BOARD: "TERRAIN_CHESS_BOARD",
  TERRAIN_CHESS_BOARD_COLORFUL: "TERRAIN_CHESS_BOARD_COLORFUL",
  TERRAIN_DIRT: "TERRAIN_DIRT",
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
  FLAME: "FLAME",
  FEATHER: "FEATHER",
  SKULL: "SKULL",
  HEART: "HEART",
  ROCKS: "ROCKS",
  SQUARE: "SQUARE",
  WIREFRAME: "WIREFRAME",
};


type TextureConfig = {
  id: string;
  url: string;
  isParticleTexture?: boolean;
  tiles?: THREE.Vector2;
  map?: THREE.Texture;
};


export const textureConfigs: TextureConfig[] = [
  {
    id: TextureId.TERRAIN_CHESS_BOARD,
    url: "./assets/textures/terrain/chess-board.webp",
  },
  {
    id: TextureId.TERRAIN_CHESS_BOARD_COLORFUL,
    url: "./assets/textures/terrain/chess-board-colorful.webp",
  },
  {
    id: TextureId.TERRAIN_DIRT,
    url: "./assets/textures/terrain/dirt.webp",
  },
  {
    id: TextureId.POINT,
    url: "./assets/textures/point.webp",
    isParticleTexture: true,
  },
  {
    id: TextureId.GRADIENT_POINT,
    url: "./assets/textures/gradient-point.webp",
    isParticleTexture: true,
  },
  {
    id: TextureId.CIRCLE,
    url: "./assets/textures/circle.webp",
    isParticleTexture: true,
  },
  {
    id: TextureId.CLOUD,
    url: "./assets/textures/cloud.webp",
    isParticleTexture: true,
  },
  {
    id: TextureId.FLAME,
    url: "./assets/textures/flame.webp",
    isParticleTexture: true,
  },
  {
    id: TextureId.FLARE,
    url: "./assets/textures/flare.webp",
    isParticleTexture: true,
  },
  {
    id: TextureId.STAR,
    url: "./assets/textures/star.webp",
    isParticleTexture: true,
  },
  {
    id: TextureId.STAR_TOON,
    url: "./assets/textures/star-toon.webp",
    isParticleTexture: true,
  },
  {
    id: TextureId.PLUS,
    url: "./assets/textures/plus.webp",
    isParticleTexture: true,
  },
  {
    id: TextureId.PLUS_TOON,
    url: "./assets/textures/plus-toon.webp",
    isParticleTexture: true,
  },
  {
    id: TextureId.MOON,
    url: "./assets/textures/moon.webp",
    isParticleTexture: true,
  },
  {
    id: TextureId.RAINDROP,
    url: "./assets/textures/raindrop.webp",
    isParticleTexture: true,
  },
  {
    id: TextureId.LEAF_TOON,
    url: "./assets/textures/leaf-toon.webp",
    isParticleTexture: true,
  },
  {
    id: TextureId.SNOWFLAKE,
    url: "./assets/textures/snowflake.webp",
    isParticleTexture: true,
  },
  {
    id: TextureId.NUMBERS,
    url: "./assets/textures/numbers.webp",
    tiles: new THREE.Vector2(5.0, 2.0),
    isParticleTexture: true,
  },
  {
    id: TextureId.NUMBERS_TOON,
    url: "./assets/textures/numbers-toon.webp",
    tiles: new THREE.Vector2(5.0, 2.0),
    isParticleTexture: true,
  },
  {
    id: TextureId.CONFETTI,
    url: "./assets/textures/confetti.webp",
    tiles: new THREE.Vector2(5.0, 2.0),
    isParticleTexture: true,
  },
  {
    id: TextureId.CONFETTI_TOON,
    url: "./assets/textures/confetti-toon.webp",
    tiles: new THREE.Vector2(5.0, 2.0),
    isParticleTexture: true,
  },
  {
    id: TextureId.MAGIC_EXPLOSION,
    url: "./assets/textures/magic-explosion.webp",
    tiles: new THREE.Vector2(5.0, 2.0),
    isParticleTexture: true,
  },
  {
    id: TextureId.FEATHER,
    url: "./assets/textures/feather.webp",
    isParticleTexture: true,
  },
  {
    id: TextureId.SKULL,
    url: "./assets/textures/skull.webp",
    isParticleTexture: true,
  },
  {
    id: TextureId.HEART,
    url: "./assets/textures/heart.webp",
    isParticleTexture: true,
  },
  {
    id: TextureId.SQUARE,
    url: "./assets/textures/square.webp",
    isParticleTexture: true,
  },
  {
    id: TextureId.ROCKS,
    url: "./assets/textures/rocks.webp",
    tiles: new THREE.Vector2(5.0, 2.0),
    isParticleTexture: true,
  },
];
