import * as THREE from 'three';

import {
  MovementSimulations,
  RotationSimulations,
  createHelperEntries,
} from './three-particles-editor/entries/helper-entries';
import {
  copyToClipboard,
  loadFromClipboard,
  loadParticleSystem,
} from './three-particles-editor/save-and-load';
import {
  createParticleSystem,
  getDefaultParticleSystemConfig,
  updateParticleSystems,
} from '@newkrok/three-particles';
import { convertToNewFormat } from './three-particles-editor/config-converter';
import {
  createWorld,
  setTerrain,
  updateWorld,
  captureScreenshot,
} from './three-particles-editor/world';
import { initAssets, loadCustomAssets } from './three-particles-editor/assets';

import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { Object3D } from 'three';
import { TextureId } from './three-particles-editor/texture-config';
import { createCurveEditor } from './three-particles-editor/curve-editor/curve-editor';
import { createGradientEditorEntries } from './three-particles-editor/entries/gradient-editor-entries';
import { createEmissionEntries } from './three-particles-editor/entries/emission-entries';
import { createGeneralEntries } from './three-particles-editor/entries/general-entries';
import { createNoiseEntries } from './three-particles-editor/entries/noise-entries';
import { createRendererEntries } from './three-particles-editor/entries/renderer-entries';
import { createRotationOverLifeTimeEntries } from './three-particles-editor/entries/rotation-over-lifetime-entries';
import { createShapeEntries } from './three-particles-editor/entries/shape-entries';
import { createSizeOverLifeTimeEntries } from './three-particles-editor/entries/size-over-lifetime-entries';
import { createTextureSheetAnimationEntries } from './three-particles-editor/entries/texture-sheet-animation-entries';
import { createTransformEntries } from './three-particles-editor/entries/transform-entries';
import { createVelocityOverLifeTimeEntries } from './three-particles-editor/entries/velocity-over-lifetime-entries';
import { ObjectUtils } from '@newkrok/three-utils';
import { generateDefaultName } from './utils/name-utils';

const { patchObject } = ObjectUtils;

type ConfigMetadata = {
  name: string;
  createdAt: number;
  modifiedAt: number;
  editorVersion: string;
};

type GradientStop = {
  position: number;
  color: {
    r: number;
    g: number;
    b: number;
    a: number;
  };
};

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
  showShape: boolean;
  frustumCulled: boolean;
  terrain: {
    textureId: string;
    movements?: string;
    movementSpeed?: number;
    rotation?: string;
    rotationSpeed?: number;
  };
  gradientStops?: GradientStop[];
  metadata?: ConfigMetadata;
};

type CycleData = {
  pauseStartTime: number;
  totalPauseTime: number;
  now: number;
  delta: number;
  elapsed: number;
};

// Type for particle system
type ParticleSystem = {
  instance: THREE.Object3D;
  dispose: () => void;
};

type ConfigEntry = {
  onReset?: () => void;

  onParticleSystemChange?: (particleSystem: ParticleSystem) => void;
  onAssetUpdate?: () => void;

  onUpdate?: (cycleData: CycleData) => void;
};

// Current editor version - replaced during build process
const EDITOR_VERSION = '__APP_VERSION__';

// Using the generateDefaultName utility function from name-utils.ts

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
  showShape: false,
  frustumCulled: true,
  terrain: {
    textureId: TextureId.WIREFRAME,
  },
  gradientStops: [
    { position: 0, color: { r: 255, g: 255, b: 255, a: 255 } },
    { position: 1, color: { r: 255, g: 255, b: 255, a: 0 } },
  ],
  metadata: {
    name: 'Untitled-1', // Default name, will be updated in createNew()
    createdAt: Date.now(),
    modifiedAt: Date.now(),
    editorVersion: EDITOR_VERSION,
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
let particleSystem: ParticleSystem | null = null;
let clock: THREE.Clock;
let isPaused = false;
const configEntries: ConfigEntry[] = [];

export const createNew = (): void => {
  // Create new metadata with current timestamp and generated name
  const newMetadata = {
    name: generateDefaultName(),
    createdAt: Date.now(),
    modifiedAt: Date.now(),
    editorVersion: EDITOR_VERSION,
  };

  patchObject(particleSystemConfig._editorData, defaultEditorData, {
    skippedProperties: [],
    applyToFirstObject: true,
  });
  patchObject(particleSystemConfig, getDefaultParticleSystemConfig(), {
    skippedProperties: [],
    applyToFirstObject: true,
  });

  // Update metadata
  particleSystemConfig._editorData.metadata = newMetadata;

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

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pauseTime();
    else if (!isPaused) resumeTime();
  });

  // Screenshot hotkey: Shift + S
  document.addEventListener('keydown', (event) => {
    if (event.shiftKey && event.key.toLowerCase() === 's') {
      event.preventDefault();
      captureScreenshot();
    }
  });

  initAssets(() => {
    const customTextures =
      JSON.parse(localStorage.getItem('particle-system-editor/library') || '[]') || [];
    loadCustomAssets({
      textures: customTextures.map(({ name, url }: { name: string; url: string }) => ({
        id: name,
        url,
      })),
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

  // Convert old configuration format to new format before creating particle system
  const convertedConfig = convertToNewFormat(particleSystemConfig);
  particleSystem = createParticleSystem(convertedConfig);

  particleSystemContainer.add(particleSystem.instance);
  configEntries.forEach(
    ({ onParticleSystemChange }) => onParticleSystemChange && onParticleSystemChange(particleSystem)
  );
};

const createPanel = (): void => {
  const panel = new GUI({
    width: 310,
    title: 'Particle System Editor',
    container: document.querySelector('.right-panel'),
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
  configEntries.push(
    createGradientEditorEntries({
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
  /* Other components temporarily disabled for debugging */
  recreateParticleSystem();
};

// Type for particle system configuration
type ParticleSystemConfig = Record<string, unknown> & {
  _editorData: EditorData;
};

interface EditorInterface {
  createNew: () => void;
  load: (config: ParticleSystemConfig) => void;
  loadFromClipboard: () => void;
  copyToClipboard: () => void;
  reset: () => void;
  play: () => void;
  pause: () => void;
  updateAssets: () => void;
  getCurrentParticleSystemConfig: () => ParticleSystemConfig;
  updateConfigMetadata: (name?: string) => ConfigMetadata;
  getConfigMetadata: () => ConfigMetadata;
  captureScreenshot: () => void;
}

declare global {
  interface Window {
    editor: EditorInterface;
  }
}

window.editor = {
  createNew,
  load: (config: ParticleSystemConfig) => {
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
    configEntries.forEach(({ onAssetUpdate }) => onAssetUpdate && onAssetUpdate()),
  getCurrentParticleSystemConfig: () => particleSystemConfig,
  updateConfigMetadata: (name?: string) => {
    // Ensure metadata exists
    if (!particleSystemConfig._editorData.metadata) {
      particleSystemConfig._editorData.metadata = {
        name: generateDefaultName(),
        createdAt: Date.now(),
        modifiedAt: Date.now(),
        editorVersion: EDITOR_VERSION,
      };
    }

    // Update modification time and name if provided
    particleSystemConfig._editorData.metadata.modifiedAt = Date.now();
    if (name) {
      particleSystemConfig._editorData.metadata.name = name;
    }

    return particleSystemConfig._editorData.metadata;
  },
  getConfigMetadata: () => {
    // Ensure metadata exists
    if (!particleSystemConfig._editorData.metadata) {
      particleSystemConfig._editorData.metadata = {
        name: 'Untitled',
        createdAt: Date.now(),
        modifiedAt: Date.now(),
        editorVersion: EDITOR_VERSION,
      };
    }

    return particleSystemConfig._editorData.metadata;
  },
  captureScreenshot,
};
