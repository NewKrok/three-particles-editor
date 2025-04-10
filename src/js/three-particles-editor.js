import * as THREE from "three";

import {
  MovementSimulations,
  RotationSimulations,
  createHelperEntries,
} from "./three-particles-editor/entries/helper-entries.js";
import {
  copyToClipboard,
  loadFromClipboard,
  loadParticleSystem,
} from "./three-particles-editor/save-and-load";
import {
  createParticleSystem,
  getDefaultParticleSystemConfig,
  updateParticleSystems,
} from "@newkrok/three-particles/src/js/effects/three-particles.js";
import {
  createWorld,
  setTerrain,
  updateWorld,
} from "./three-particles-editor/world";
import {
  initAssets,
  loadCustomAssets,
} from "./three-particles-editor/assets";

import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { Object3D } from "three";
import { TextureId } from "./three-particles-editor/texture-config";
import { createCurveEditor } from "./three-particles-editor/curve-editor/curve-editor";
import { createEmissionEntries } from "./three-particles-editor/entries/emission-entries";
import { createGeneralEntries } from "./three-particles-editor/entries/general-entries";
import { createNoiseEntries } from "./three-particles-editor/entries/noise-entries";
import { createOpacityOverLifeTimeEntries } from "./three-particles-editor/entries/opacity-over-lifetime-entries";
import { createRendererEntries } from "./three-particles-editor/entries/renderer-entries";
import { createRotationOverLifeTimeEntries } from "./three-particles-editor/entries/rotation-over-lifetime-entries";
import { createShapeEntries } from "./three-particles-editor/entries/shape-entries";
import { createSizeOverLifeTimeEntries } from "./three-particles-editor/entries/size-over-lifetime-entries";
import { createTextureSheetAnimationEntries } from "./three-particles-editor/entries/texture-sheet-animation-entries";
import { createTransformEntries } from "./three-particles-editor/entries/transform-entries";
import { createVelocityOverLifeTimeEntries } from "./three-particles-editor/entries/velocity-over-lifetime-entries";
import { patchObject } from "@newkrok/three-utils/src/js/newkrok/three-utils/object-utils.js";

const defaultEditorData = {
  textureId: TextureId.POINT,
  simulation: {
    movements: MovementSimulations.DISABLED,
    movementSpeed: 1,
    rotation: RotationSimulations.DISABLED,
    rotationSpeed: 1,
  },
  showLocalAxes: false,
  showWorldAxes: false,
  frustumCulled: true,
  terrain: {
    textureId: TextureId.WIREFRAME,
  },
};

const particleSystemConfig = {
  ...getDefaultParticleSystemConfig(),
  _editorData: {
    ...defaultEditorData,
    terrain: { ...defaultEditorData.terrain, ...defaultEditorData.simulation },
    simulation: { ...defaultEditorData.simulation },
  },
};
const cycleData = { pauseStartTime: 0, totalPauseTime: 0 };

let scene, particleSystemContainer, particleSystem, clock;
let isPaused = false;
const configEntries = [];

export const createNew = () => {
  patchObject(particleSystemConfig._editorData, defaultEditorData, {
    applyToFirstObject: true,
  });
  patchObject(particleSystemConfig, getDefaultParticleSystemConfig(), {
    applyToFirstObject: true,
  });
  setTerrain();
  recreateParticleSystem();
  configEntries.forEach(({ onReset }) => onReset && onReset());
};

const resumeTime = () => {
  if (isPaused) {
    isPaused = false;
    cycleData.totalPauseTime += Date.now() - cycleData.pauseStartTime;
  }
};

const pauseTime = () => {
  if (!isPaused) {
    isPaused = true;
    cycleData.pauseStartTime = Date.now();
  }
};

export const createParticleSystemEditor = (targetQuery) => {
  clock = new THREE.Clock();
  scene = createWorld(targetQuery);

  particleSystemContainer = new Object3D();
  scene.add(particleSystemContainer);

  initAssets(() => {
    let customTextures =
      JSON.parse(localStorage.getItem("particle-system-editor/library")) || [];
    loadCustomAssets({
      textures: customTextures.map(({ name, url }) => ({ id: name, url })),
      onComplete: () => {
        createPanel();
        createCurveEditor();
        animate();
      },
    });
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pauseTime();
    else if (!isPaused) resumeTime();
  });
};

const animate = () => {
  if (!isPaused) {
    const rawDelta = clock.getDelta();
    cycleData.now = Date.now() - cycleData.totalPauseTime;
    cycleData.delta = rawDelta > 0.1 ? 0.1 : rawDelta;
    cycleData.elapsed = clock.getElapsedTime();

    configEntries.forEach(({ onUpdate }) => onUpdate && onUpdate(cycleData));
    updateParticleSystems(cycleData);
  }
  updateWorld();
  requestAnimationFrame(animate);
};

const recreateParticleSystem = () => {
  resumeTime();
  if (particleSystem) {
    particleSystem.dispose();
    particleSystem = null;
    cycleData.totalPauseTime = 0;
  }

  particleSystem = createParticleSystem(particleSystemConfig);

  particleSystemContainer.add(particleSystem.instance);
  configEntries.forEach(
    ({ onParticleSystemChange }) =>
      onParticleSystemChange && onParticleSystemChange(particleSystem)
  );
};

const createPanel = () => {
  const panel = new GUI({
    width: 310,
    title: "Particle System Editor",
    container: document.querySelector(".right-panel"),
  });

  configEntries.push(
    createHelperEntries({
      parentFolder: panel,
      particleSystemConfig,
      scene,
      particleSystemContainer,
    })
  );

  configEntries.push(
    createTransformEntries({
      parentFolder: panel,
      particleSystemConfig,
      recreateParticleSystem: () => {
        // Transform change not requires a real re creation
        particleSystem.instance.position.copy(particleSystemConfig.transform.position);
        particleSystem.instance.rotation.x = THREE.MathUtils.degToRad(
          particleSystemConfig.transform.rotation.x
        );
        particleSystem.instance.rotation.y = THREE.MathUtils.degToRad(
          particleSystemConfig.transform.rotation.y
        );
        particleSystem.instance.rotation.z = THREE.MathUtils.degToRad(
          particleSystemConfig.transform.rotation.z
        );
        particleSystem.instance.scale.copy(particleSystemConfig.transform.scale);
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
    createVelocityOverLifeTimeEntries({
      parentFolder: panel,
      particleSystemConfig,
      recreateParticleSystem,
    })
  );
  /* configEntries.push(
    createColorOverLifeTimeEntries({
      parentFolder: panel,
      particleSystemConfig,
      recreateParticleSystem,
    })
  ); */
  configEntries.push(
    createOpacityOverLifeTimeEntries({
      parentFolder: panel,
      particleSystemConfig,
      recreateParticleSystem,
    })
  );
  configEntries.push(
    createSizeOverLifeTimeEntries({
      parentFolder: panel,
      particleSystemConfig,
      recreateParticleSystem,
    })
  );
  configEntries.push(
    createRotationOverLifeTimeEntries({
      parentFolder: panel,
      particleSystemConfig,
      recreateParticleSystem,
    })
  );
  configEntries.push(
    createNoiseEntries({
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

window.editor = {
  createNew,
  load: (config) => {
    createNew();
    loadParticleSystem({
      config,
      particleSystemConfig,
      recreateParticleSystem,
    });
  },
  loadFromClipboard: () => {
    createNew();
    loadFromClipboard({
      particleSystemConfig,
      recreateParticleSystem,
    });
  },
  copyToClipboard: () => copyToClipboard(particleSystemConfig),
  reset: recreateParticleSystem,
  play: resumeTime,
  pause: pauseTime,
  updateAssets: () =>
    configEntries.forEach(
      ({ onAssetUpdate }) => onAssetUpdate && onAssetUpdate()
    ),
  getCurrentParticleSystemConfig: () => particleSystemConfig,
};
