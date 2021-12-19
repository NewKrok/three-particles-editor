import * as THREE from "three/build/three.module";

import {
  copyToClipboard,
  loadFromClipboard,
} from "./three-particles-editor/save-and-load.js";
import {
  createParticleSystem,
  destroyParticleSystem,
  getDefaultParticleSystemConfig,
  updateParticleSystems,
} from "@newkrok/three-particles/src/js/effects/three-particles.js";
import { createWorld, updateWorld } from "./three-particles-editor/world.js";

import { GUI } from "three/examples/jsm/libs/lil-gui.module.min";
import { createEmissionEntries } from "./three-particles-editor/entries/emission-entries.js";
import { createGeneralEntries } from "./three-particles-editor/entries/general-entries.js";
import { createHelperEntries } from "./three-particles-editor/entries/helper-entries.js";
import { createRendererEntries } from "./three-particles-editor/entries/renderer-entries.js";
import { createShapeEntries } from "./three-particles-editor/entries/shape-entries.js";
import { createTextureSheetAnimationEntries } from "./three-particles-editor/entries/texture-sheet-animation-entries.js";
import { createTransformEntries } from "./three-particles-editor/entries/transform-entries.js";
import { initAssets } from "./three-particles-editor/assets.js";

const particleSystemConfig = getDefaultParticleSystemConfig();
const cycleData = { pauseStartTime: 0, totalPauseTime: 0 };

let scene, particleSystem, clock;

export const createParticleSystemEditor = (targetQuery) => {
  clock = new THREE.Clock();
  scene = createWorld(targetQuery);
  initAssets(() => {
    createPanel();
    animate();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cycleData.pauseStartTime = Date.now();
    } else {
      cycleData.totalPauseTime += Date.now() - cycleData.pauseStartTime;
    }
  });
};

const animate = () => {
  const rawDelta = clock.getDelta();
  cycleData.now = Date.now() - cycleData.totalPauseTime;
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
    cycleData.totalPauseTime = 0;
  }

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

  panel
    .add(
      { copyToClipboard: () => copyToClipboard(particleSystemConfig) },
      "copyToClipboard"
    )
    .name("Copy config to clipboard");
  panel
    .add(
      {
        loadFromClipboard: () =>
          loadFromClipboard({ particleSystemConfig, recreateParticleSystem }),
      },
      "loadFromClipboard"
    )
    .name("Load config from clipboard");

  configEntries.push(createHelperEntries({ parentFolder: panel, scene }));
  configEntries.push(
    createTransformEntries({
      parentFolder: panel,
      particleSystemConfig,
      recreateParticleSystem: () => {
        // Transform change not requires a real re creation
        particleSystem.position.copy(particleSystemConfig.transform.position);
        particleSystem.rotation.x = THREE.Math.degToRad(
          particleSystemConfig.transform.rotation.x
        );
        particleSystem.rotation.y = THREE.Math.degToRad(
          particleSystemConfig.transform.rotation.y
        );
        particleSystem.rotation.z = THREE.Math.degToRad(
          particleSystemConfig.transform.rotation.z
        );
        particleSystem.scale.copy(particleSystemConfig.transform.scale);
      },
    })
  );
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
  configEntries.push(
    createTextureSheetAnimationEntries({
      parentFolder: panel,
      particleSystemConfig,
      recreateParticleSystem,
    })
  );
  configEntries.push(
    createRendererEntries({
      parentFolder: panel,
      particleSystemConfig,
      recreateParticleSystem,
    })
  );
  recreateParticleSystem();
};

createParticleSystemEditor("#three-particles-editor");
