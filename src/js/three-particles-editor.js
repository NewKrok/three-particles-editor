import * as THREE from "three/build/three.module";

import {
  createParticleSystem,
  destroyParticleSystem,
  getDefaultParticleSystemConfig,
  updateParticleSystems,
} from "@newkrok/three-particles/src/js/effects/three-particles.js";
import { createWorld, updateWorld } from "./three-particles-editor/world.js";
import { getTexture, initAssets } from "./three-particles-editor/assets.js";

import { GUI } from "three/examples/jsm/libs/lil-gui.module.min";
import { TextureId } from "./three-particles-editor/texture-config.js";
import { createEmissionEntries } from "./three-particles-editor/entries/emission-entries.js";
import { createGeneralEntries } from "./three-particles-editor/entries/general-entries.js";
import { createHelperEntries } from "./three-particles-editor/entries/helper-entries.js";
import { createShapeEntries } from "./three-particles-editor/entries/shape-entries.js";

const particleSystemConfig = getDefaultParticleSystemConfig();
const cycleData = {};

let scene, particleSystem, clock;

export const createParticleSystemEditor = (targetQuery) => {
  clock = new THREE.Clock();
  scene = createWorld(targetQuery);
  initAssets(() => {
    createPanel();
    animate();
  });
};

const animate = () => {
  const rawDelta = clock.getDelta();
  cycleData.now = Date.now();
  cycleData.delta = rawDelta > 0.1 ? 0.1 : rawDelta;
  cycleData.elapsed = clock.getElapsedTime();

  configEntries.forEach(({ onUpdate }) => onUpdate && onUpdate(cycleData));
  updateParticleSystems(cycleData);
  updateWorld();

  requestAnimationFrame(animate);
};

const recreateParticleSystem = () => {
  if (particleSystem) {
    destroyParticleSystem(particleSystem);
    particleSystem = null;
  }

  const { texture, tiles } = getTexture(TextureId.Point);
  particleSystemConfig.map = texture;
  particleSystemConfig.textureSheetAnimation.tiles = tiles;
  particleSystem = createParticleSystem(particleSystemConfig);
  scene.add(particleSystem);

  configEntries.forEach(
    ({ onParticleSystemChange }) =>
      onParticleSystemChange && onParticleSystemChange(particleSystem)
  );
};

const configEntries = [];

const createPanel = () => {
  const panel = new GUI({ width: 310, title: "Particle System Editor" });
  configEntries.push(createHelperEntries({ parentFolder: panel, scene }));
  configEntries.push(
    createGeneralEntries({
      parentFolder: panel,
      particleSystemConfig,
      recreateParticleSystem,
    })
  );
  configEntries.push(
    createEmissionEntries({
      parentFolder: panel,
      particleSystemConfig,
      recreateParticleSystem,
    })
  );
  configEntries.push(
    createShapeEntries({
      parentFolder: panel,
      particleSystemConfig,
      recreateParticleSystem,
    })
  );

  particleSystemConfig.map = getTexture(TextureId.Point).texture;
  recreateParticleSystem();
};

createParticleSystemEditor("#three-particles-editor");
