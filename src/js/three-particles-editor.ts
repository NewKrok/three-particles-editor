import * as THREE from "three";

import {
  MovementSimulations,
  RotationSimulations,
  createHelperEntries,
} from "./three-particles-editor/entries/helper-entries";
import {
  copyToClipboard,
  loadFromClipboard,
  loadParticleSystem,
} from "./three-particles-editor/save-and-load";
import {
  createParticleSystem,
  // @ts-ignore
  getDefaultParticleSystemConfig,
  updateParticleSystems,
} from "@newkrok/three-particles/src/js/effects/three-particles";
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

type EditorData = {
  textureId: string;
  simulation: {
    movements: string;
    movementSpeed: number;
    rotation: string;
    rotationSpeed: number;
  };
  showLocalAxes: boolean;
  showWorldAxes: boolean;
  frustumCulled: boolean;
  terrain: {
    textureId: string;
    movements?: string;
    movementSpeed?: number;
    rotation?: string;
    rotationSpeed?: number;
  };
};

type CycleData = {
  pauseStartTime: number;
  totalPauseTime: number; 
  now: number;
  delta: number;
  elapsed: number;
};

type ConfigEntry = {
  onReset?: () => void;
  onParticleSystemChange?: (particleSystem: any) => void;
  onAssetUpdate?: () => void;
};

const defaultEditorData: EditorData = {
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
const cycleData: CycleData = { pauseStartTime: 0, totalPauseTime: 0, now: 0, delta: 0, elapsed: 0 };

let scene: THREE.Scene;
let particleSystemContainer: Object3D;
let particleSystem: any;
let clock: THREE.Clock;
let isPaused = false;
const configEntries: ConfigEntry[] = [];

export const createNew = (): void => {
  patchObject(particleSystemConfig._editorData, defaultEditorData, {
    skippedProperties: [],
    applyToFirstObject: true,
  });
  patchObject(particleSystemConfig, getDefaultParticleSystemConfig(), {
    skippedProperties: [],
    applyToFirstObject: true,
  });
  setTerrain();
  recreateParticleSystem();
  configEntries.forEach(({ onReset }) => onReset && onReset());
};

const resumeTime = (): void => {
  if (isPaused) {
    isPaused = false;
    cycleData.totalPauseTime += Date.now() - cycleData.pauseStartTime;
  }
};

const pauseTime = (): void => {
  if (!isPaused) {
    isPaused = true;
    cycleData.pauseStartTime = Date.now();
  }
};

export const createParticleSystemEditor = (targetQuery: string): void => {
  clock = new THREE.Clock();
  scene = createWorld(targetQuery);

  particleSystemContainer = new Object3D();
  scene.add(particleSystemContainer);

  initAssets(() => {
    let customTextures =
      JSON.parse(localStorage.getItem("particle-system-editor/library") || "[]") || [];
    loadCustomAssets({
      textures: customTextures.map(({ name, url }: { name: string; url: string }) => ({ id: name, url })),
      onComplete: () => {
        createPanel();
        createCurveEditor();
        recreateParticleSystem();
        animate();
      },
    });
  });
};

const animate = (): void => {
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

const recreateParticleSystem = (): void => {
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

const createPanel = (): void => {
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

interface EditorInterface {
  createNew: () => void;
  load: (config: any) => void;
  loadFromClipboard: () => void;
  copyToClipboard: () => void;
  reset: () => void;
  play: () => void;
  pause: () => void;
  updateAssets: () => void;
  getCurrentParticleSystemConfig: () => any;
}

declare global {
  interface Window {
    editor: EditorInterface;
  }
}

window.editor = {
  createNew,
  load: (config: any) => {
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
