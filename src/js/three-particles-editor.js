import * as THREE from "three/build/three.module";

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
import { deepMerge } from "@newkrok/three-particles/src/js/effects/three-particles-utils";
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

export const getObjectDiff = (
  objectA,
  objectB,
  config = { skippedProperties: [] }
) => {
  const result = {};
  Object.keys(objectA).forEach((key) => {
    if (!config.skippedProperties || !config.skippedProperties.includes(key)) {
      if (typeof objectA[key] === "object" && objectA[key] && objectB[key]) {
        const objectDiff = getObjectDiff(objectA[key], objectB[key], config);
        if (Object.keys(objectDiff).length > 0) result[key] = objectDiff;
      } else {
        const mergedValue =
          objectB[key] === 0 ? 0 : objectB[key] || objectA[key];
        if (mergedValue !== objectA[key]) result[key] = mergedValue;
      }
    }
  });
  return result;
};

const copyToClipboard = () => {
  const type = "text/plain";
  const blob = new Blob(
    [
      JSON.stringify(
        getObjectDiff(getDefaultParticleSystemConfig(), particleSystemConfig, {
          skippedProperties: ["map"],
        })
      ),
    ],
    {
      type: "text/plain",
    }
  );
  const data = [new ClipboardItem({ [type]: blob })];

  navigator.clipboard.write(data);
};

const loadFromClipboard = () => {
  navigator.clipboard
    .readText()
    .then((text) => {
      const externalObject = JSON.parse(text);
      deepMerge(particleSystemConfig, externalObject, {
        skippedProperties: ["map"],
        applyToFirstObject: true,
      });
      console.log("Loaded particle system config:");
      console.log(particleSystemConfig);
      recreateParticleSystem();
    })
    .catch((err) => {
      console.error("Failed to read clipboard contents: ", err);
    });
};

const createPanel = () => {
  const panel = new GUI({ width: 310, title: "Particle System Editor" });

  panel
    .add({ copyToClipboard }, "copyToClipboard")
    .name("Copy config to clipboard");
  panel
    .add({ loadFromClipboard }, "loadFromClipboard")
    .name("Load config from clipboard");

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
