import * as THREE from 'three';

import {
  MovementSimulations,
  RotationSimulations,
  createHelperEntries,
} from './three-particles-editor/entries/helper-entries';
import {
  copyToClipboard,
  getObjectDiff,
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
  getDepthTexture,
} from './three-particles-editor/world';
import { getTexture, initAssets, loadCustomAssets } from './three-particles-editor/assets';

import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { Object3D } from 'three';
import { TextureId } from './three-particles-editor/texture-config';
import { createCurveEditor } from './three-particles-editor/curve-editor/curve-editor';
import { createGradientEditorEntries } from './three-particles-editor/entries/gradient-editor-entries';
import {
  createEmissionEntries,
  updateAllBurstCountMax,
} from './three-particles-editor/entries/emission-entries';
import { createGeneralEntries } from './three-particles-editor/entries/general-entries';
import { createNoiseEntries } from './three-particles-editor/entries/noise-entries';
import { createRendererEntries } from './three-particles-editor/entries/renderer-entries';
import { createRotationOverLifeTimeEntries } from './three-particles-editor/entries/rotation-over-lifetime-entries';
import { createShapeEntries } from './three-particles-editor/entries/shape-entries';
import { createSizeOverLifeTimeEntries } from './three-particles-editor/entries/size-over-lifetime-entries';
import { createTextureSheetAnimationEntries } from './three-particles-editor/entries/texture-sheet-animation-entries';
import { createTransformEntries } from './three-particles-editor/entries/transform-entries';
import { createVelocityOverLifeTimeEntries } from './three-particles-editor/entries/velocity-over-lifetime-entries';
import { createSubEmitterEntries } from './three-particles-editor/entries/sub-emitter-entries';
import { createForceFieldEntries } from './three-particles-editor/entries/force-field-entries';
import { createTrailEntries } from './three-particles-editor/entries/trail-entries';
import { createMeshEntries, createGeometry } from './three-particles-editor/entries/mesh-entries';
import { generateDefaultName } from './utils/name-utils';

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
  showForceFields: boolean;
  frustumCulled: boolean;
  useIndividualUpdate: boolean;
  useLiveUpdate: boolean;
  enableBigNumbers: boolean;
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
  update: (cycleData: CycleData) => void;
  updateConfig: (config: Partial<Record<string, unknown>>) => void;
};

type ConfigEntry = {
  onReset?: () => void;

  onParticleSystemChange?: (particleSystem: ParticleSystem) => void;
  onAssetUpdate?: () => void;

  onUpdate?: (cycleData: CycleData) => void;
};

type EditorContextStackEntry = {
  subEmitterIndex: number;
  parentConfig: any;
  expandedConfig: any;
};

type EditorContext = {
  type: 'root' | 'subEmitter';
  subEmitterIndex: number | null;
  parentConfig: any | null;
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
  showForceFields: false,
  frustumCulled: true,
  useIndividualUpdate: false,
  useLiveUpdate: false,
  enableBigNumbers: false,
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
let configDirty = false;
let isInitializing = false;
const configEntries: ConfigEntry[] = [];
let currentPanel: GUI | null = null;
let editorContext: EditorContext = {
  type: 'root',
  subEmitterIndex: null,
  parentConfig: null,
};
const editorContextStack: EditorContextStackEntry[] = [];

const resetToRoot = (): void => {
  if (editorContext.type === 'subEmitter') {
    // Collapse all levels back — walk the stack from top to bottom
    while (editorContextStack.length > 0) {
      const entry = editorContextStack[editorContextStack.length - 1];
      if (expandedSubEmitterConfig) {
        entry.parentConfig.subEmitters[entry.subEmitterIndex].config =
          collapseSubEmitterConfig(expandedSubEmitterConfig);
      }
      expandedSubEmitterConfig = entry.expandedConfig;
      editorContextStack.pop();
    }
    expandedSubEmitterConfig = null;
    editorContext = { type: 'root', subEmitterIndex: null, parentConfig: null };
    destroyPanel();
    configEntries.length = 0;
  }
};

export const createNew = (): void => {
  // Switch back to root context if editing a sub-emitter
  resetToRoot();

  // Create new metadata with current timestamp and generated name
  const newMetadata = {
    name: generateDefaultName(),
    createdAt: Date.now(),
    modifiedAt: Date.now(),
    editorVersion: EDITOR_VERSION,
  };

  const defaultConfig = getDefaultParticleSystemConfig();

  // Clear all existing properties from particleSystemConfig (except _editorData)
  // This is necessary because patchObject doesn't handle type changes properly
  // (e.g., when startLifetime changes from {min, max} object to a number)
  Object.keys(particleSystemConfig).forEach((key) => {
    if (key !== '_editorData') {
      delete particleSystemConfig[key];
    }
  });

  // Deep clone the default config and assign to particleSystemConfig
  Object.keys(defaultConfig).forEach((key) => {
    if (key !== '_editorData') {
      particleSystemConfig[key] = JSON.parse(JSON.stringify(defaultConfig[key]));
    }
  });

  // Reset _editorData to defaults
  const editorDataKeys = Object.keys(defaultEditorData);
  editorDataKeys.forEach((key) => {
    if (key === 'metadata') return; // Handle metadata separately
    particleSystemConfig._editorData[key] = JSON.parse(JSON.stringify(defaultEditorData[key]));
  });

  // Update metadata
  particleSystemConfig._editorData.metadata = newMetadata;

  setTerrain();
  isInitializing = true;
  // Rebuild the panel so controllers bind to the new config object references
  destroyPanel();
  configEntries.length = 0;
  createPanel();
  configEntries.forEach(({ onReset }) => onReset && onReset());
  isInitializing = false;
  configDirty = false;
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
        isInitializing = true;
        createPanel();
        createCurveEditor();
        recreateParticleSystem(false);
        isInitializing = false;
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
    if (particleSystemConfig._editorData.useIndividualUpdate && particleSystem) {
      particleSystem.update(cycleData);
    } else {
      updateParticleSystems(cycleData);
    }
  }
  const activeConfig = getActiveConfig();
  const softParticlesEnabled = !!activeConfig?.renderer?.softParticles?.enabled;
  updateWorld(softParticlesEnabled);
  requestAnimationFrame(animate);
};

const getActiveConfig = (): any => {
  if (editorContext.type === 'subEmitter' && expandedSubEmitterConfig) {
    return expandedSubEmitterConfig;
  }
  return particleSystemConfig;
};

const resolveSubEmitterTextures = (config: any): void => {
  if (!config.subEmitters) return;
  config.subEmitters.forEach((subEmitter: any) => {
    const subConfig = subEmitter.config;
    if (subConfig?._editorData?.textureId) {
      const texture = getTexture(subConfig._editorData.textureId);
      if (texture) {
        subConfig.map = texture.map;
      }
    }
    // Recursively resolve nested sub-emitters
    if (subConfig) resolveSubEmitterTextures(subConfig);
  });
};

const resolveMeshGeometry = (config: any): void => {
  if (config.renderer?.rendererType === 'MESH' && config.renderer?.mesh?.geometryType) {
    config.renderer.mesh.geometry = createGeometry(config.renderer.mesh.geometryType);
  }
  // Recursively resolve for sub-emitters
  if (config.subEmitters) {
    config.subEmitters.forEach((subEmitter: any) => {
      if (subEmitter.config) resolveMeshGeometry(subEmitter.config);
    });
  }
};

/**
 * Recreates the particle system from scratch, or — when live update is enabled and
 * liveUpdateKeys are provided — applies a partial config update via the engine's
 * updateConfig API without disposing the system.
 *
 * @param markAsDirty  When false the config-dirty flag is not set (used during init/load).
 * @param liveUpdateKeys  Top-level config keys that are safe to hot-update.
 *   When useLiveUpdate is ON and these keys are provided, only those properties are
 *   sent to updateConfig(). When useLiveUpdate is OFF (or keys are not provided),
 *   a full dispose + recreate happens.
 */
const recreateParticleSystem = (markAsDirty = true, liveUpdateKeys?: string[]): void => {
  const activeConfig = getActiveConfig();

  // Live-update path
  if (markAsDirty && liveUpdateKeys && particleSystem && activeConfig._editorData?.useLiveUpdate) {
    const partial: Record<string, unknown> = {};
    for (const key of liveUpdateKeys) {
      if (activeConfig[key] !== undefined) {
        partial[key] = activeConfig[key];
      }
    }
    particleSystem.updateConfig(partial);
    if (!isInitializing) {
      configDirty = true;
    }
    return;
  }

  // Full recreate path
  resumeTime();
  if (particleSystem) {
    particleSystem.dispose();
    particleSystem = null;
    cycleData.totalPauseTime = 0;
  }

  // Resolve textures for sub-emitters (map is not serialized, only textureId is)
  resolveSubEmitterTextures(activeConfig);

  // Resolve mesh geometries (geometry is not serialized, only geometryType is)
  resolveMeshGeometry(activeConfig);

  // Mesh particles use the engine's built-in default texture, not sprite textures
  if (activeConfig.renderer?.rendererType === 'MESH') {
    delete activeConfig.map;
  }

  // Inject depth texture for soft particles
  if (activeConfig.renderer?.softParticles?.enabled) {
    const depthTex = getDepthTexture();
    if (depthTex) {
      activeConfig.renderer.softParticles.depthTexture = depthTex;
    }
  }

  // Convert old configuration format to new format before creating particle system
  const convertedConfig = convertToNewFormat(activeConfig);
  particleSystem = createParticleSystem(convertedConfig);

  particleSystemContainer.add(particleSystem.instance);
  configEntries.forEach(
    ({ onParticleSystemChange }) => onParticleSystemChange && onParticleSystemChange(particleSystem)
  );

  // Only mark as dirty if not initializing and markAsDirty is true
  if (markAsDirty && !isInitializing) {
    configDirty = true;
  }
};

// Expanded sub-emitter config used while editing (full config for the panel)
let expandedSubEmitterConfig: any = null;

const subEditorDefaults = {
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
  showForceFields: false,
  frustumCulled: true,
  useIndividualUpdate: false,
  useLiveUpdate: false,
  enableBigNumbers: false,
  terrain: { textureId: TextureId.WIREFRAME },
  gradientStops: [
    { position: 0, color: { r: 255, g: 255, b: 255, a: 255 } },
    { position: 1, color: { r: 255, g: 255, b: 255, a: 0 } },
  ],
};

const deepMerge = (target: any, source: any): any => {
  Object.keys(source).forEach((key) => {
    if (
      typeof source[key] === 'object' &&
      source[key] !== null &&
      !Array.isArray(source[key]) &&
      typeof target[key] === 'object' &&
      target[key] !== null &&
      !Array.isArray(target[key])
    ) {
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  });
  return target;
};

const expandSubEmitterConfig = (minimalConfig: any): any => {
  // Start with a full default config (JSON clone — no THREE objects)
  const fullConfig = JSON.parse(JSON.stringify(getDefaultParticleSystemConfig()));
  // Deep merge the minimal (diff) config on top
  Object.keys(minimalConfig).forEach((key) => {
    if (key === '_editorData') return; // handled separately
    if (
      typeof minimalConfig[key] === 'object' &&
      minimalConfig[key] !== null &&
      !Array.isArray(minimalConfig[key]) &&
      typeof fullConfig[key] === 'object' &&
      fullConfig[key] !== null
    ) {
      deepMerge(fullConfig[key], minimalConfig[key]);
    } else {
      fullConfig[key] = minimalConfig[key];
    }
  });
  // Ensure _editorData
  const editorData = { ...subEditorDefaults };
  if (minimalConfig._editorData) {
    Object.keys(minimalConfig._editorData).forEach((key) => {
      if (minimalConfig._editorData[key] !== undefined) {
        editorData[key] = minimalConfig._editorData[key];
      }
    });
  }
  fullConfig._editorData = editorData;
  return fullConfig;
};

const collapseSubEmitterConfig = (fullConfig: any): any => {
  // Convert expanded config back to minimal diff form
  const defaultConfig = JSON.parse(JSON.stringify(getDefaultParticleSystemConfig()));
  const diff = getObjectDiff(defaultConfig, fullConfig, {
    skippedProperties: ['map', 'geometry', 'depthTexture'],
  });
  // Always keep _editorData
  if (fullConfig._editorData) {
    diff._editorData = { ...fullConfig._editorData };
  }
  return diff;
};

const switchToSubEmitter = (index: number): void => {
  const activeConfig = getActiveConfig();
  if (!activeConfig.subEmitters || !activeConfig.subEmitters[index]) return;

  // Push current level onto the stack (save the live config object for this level)
  editorContextStack.push({
    subEmitterIndex: index,
    parentConfig: activeConfig,
    expandedConfig: activeConfig,
  });

  editorContext = {
    type: 'subEmitter',
    subEmitterIndex: index,
    parentConfig: activeConfig,
  };

  // Expand the minimal sub-emitter config to a full config for the editor panel
  const minimalConfig = activeConfig.subEmitters[index].config;
  expandedSubEmitterConfig = expandSubEmitterConfig(minimalConfig);

  // Rebuild the panel with expanded sub-emitter config
  destroyPanel();
  configEntries.length = 0;
  createPanel(expandedSubEmitterConfig);
  recreateParticleSystem(false);
};

const switchToParent = (): void => {
  if (editorContext.type === 'root' || editorContextStack.length === 0) return;

  // Collapse the expanded config back to minimal diff and save it on the parent
  const currentEntry = editorContextStack[editorContextStack.length - 1];
  if (expandedSubEmitterConfig && currentEntry) {
    currentEntry.parentConfig.subEmitters[currentEntry.subEmitterIndex].config =
      collapseSubEmitterConfig(expandedSubEmitterConfig);
  }

  // Pop from stack and restore previous level
  const poppedEntry = editorContextStack.pop()!;

  if (editorContextStack.length === 0) {
    // Back at root
    expandedSubEmitterConfig = null;
    editorContext = {
      type: 'root',
      subEmitterIndex: null,
      parentConfig: null,
    };
  } else {
    // Back to a parent sub-emitter level — restore the saved expanded config
    const parentEntry = editorContextStack[editorContextStack.length - 1];
    expandedSubEmitterConfig = poppedEntry.expandedConfig;
    editorContext = {
      type: 'subEmitter',
      subEmitterIndex: parentEntry.subEmitterIndex,
      parentConfig: parentEntry.parentConfig,
    };
  }

  // Rebuild the panel with the restored config
  destroyPanel();
  configEntries.length = 0;
  const configToShow =
    editorContextStack.length === 0 ? particleSystemConfig : expandedSubEmitterConfig;

  createPanel(configToShow);
  recreateParticleSystem(false);
};

const destroyPanel = (): void => {
  if (currentPanel) {
    currentPanel.destroy();
    currentPanel = null;
  }
};

const createPanel = (config: any = particleSystemConfig): void => {
  const isSubEmitter = editorContext.type === 'subEmitter';
  const depth = editorContextStack.length;
  const panelTitle = isSubEmitter
    ? `Sub-Emitter ${(editorContext.subEmitterIndex ?? 0) + 1}${depth > 1 ? ` (Level ${depth})` : ''}`
    : 'Particle System Editor';

  const panel = new GUI({
    width: 310,
    title: panelTitle,
    container: document.querySelector('.right-panel'),
  });
  currentPanel = panel;

  // Add "Back to Parent" button when editing a sub-emitter
  if (isSubEmitter) {
    const navObj = { backToParent: switchToParent };
    panel.add(navObj, 'backToParent').name('<< Back to Parent');
  }

  // Mutable controller references for big numbers toggle
  let maxParticlesCtrl: any = null;
  let rateOverTimeCtrl: any = null;
  let rateOverDistanceCtrl: any = null;

  const handleBigNumbersToggle = (enabled: boolean): void => {
    const maxParticles = enabled ? 100000 : 1000;
    const rateMax = enabled ? 10000 : 500;
    const burstMax = enabled ? 10000 : 1000;

    if (maxParticlesCtrl) maxParticlesCtrl.max(maxParticles);
    if (rateOverTimeCtrl) rateOverTimeCtrl.max(rateMax);
    if (rateOverDistanceCtrl) rateOverDistanceCtrl.max(rateMax);
    updateAllBurstCountMax(burstMax);
  };

  configEntries.push(
    createHelperEntries({
      parentFolder: panel,
      particleSystemConfig: config,
      scene,
      particleSystemContainer,
      onBigNumbersToggle: handleBigNumbersToggle,
    })
  );

  // Sub-Emitters section (available at all levels for nested sub-emitters)
  configEntries.push(
    createSubEmitterEntries({
      parentFolder: panel,
      particleSystemConfig: config,
      recreateParticleSystem,
      onEditSubEmitter: switchToSubEmitter,
    })
  );

  configEntries.push(
    createTransformEntries({
      parentFolder: panel,
      particleSystemConfig: config,
      recreateParticleSystem: () => {
        // Transform change not requires a real re creation
        particleSystem.instance.position.copy(config.transform.position);
        particleSystem.instance.rotation.x = THREE.MathUtils.degToRad(config.transform.rotation.x);
        particleSystem.instance.rotation.y = THREE.MathUtils.degToRad(config.transform.rotation.y);
        particleSystem.instance.rotation.z = THREE.MathUtils.degToRad(config.transform.rotation.z);
        particleSystem.instance.scale.copy(config.transform.scale);
      },
    })
  );

  // Live-updatable entries pass liveUpdateKeys so that when useLiveUpdate is enabled,
  // only those top-level config keys are sent to engine.updateConfig().
  // Non-updatable entries (shape, renderer, texture sheet, trail, mesh, sub-emitter)
  // call recreateParticleSystem() without liveUpdateKeys → always full recreate.

  const generalKeys = [
    'duration',
    'looping',
    'startDelay',
    'startLifetime',
    'startSpeed',
    'startSize',
    'startRotation',
    'startColor',
    'startOpacity',
    'gravity',
    'simulationSpace',
  ];
  const generalResult = createGeneralEntries({
    parentFolder: panel,
    particleSystemConfig: config,
    recreateParticleSystem: () => recreateParticleSystem(true, generalKeys),
    forceRecreateParticleSystem: recreateParticleSystem,
  });
  configEntries.push(generalResult);
  maxParticlesCtrl = generalResult.maxParticlesController;

  const emissionResult = createEmissionEntries({
    parentFolder: panel,
    particleSystemConfig: config,
    recreateParticleSystem: () => recreateParticleSystem(true, ['emission']),
  });
  configEntries.push(emissionResult);
  rateOverTimeCtrl = emissionResult.rateOverTimeController;
  rateOverDistanceCtrl = emissionResult.rateOverDistanceController;

  // Apply initial big numbers state if loading a config that had it enabled
  if (config._editorData?.enableBigNumbers) {
    handleBigNumbersToggle(true);
  }
  configEntries.push(
    createShapeEntries({
      parentFolder: panel,
      particleSystemConfig: config,
      recreateParticleSystem,
    })
  );
  configEntries.push(
    createVelocityOverLifeTimeEntries({
      parentFolder: panel,
      particleSystemConfig: config,
      recreateParticleSystem: () => recreateParticleSystem(true, ['velocityOverLifetime']),
    })
  );
  configEntries.push(
    createGradientEditorEntries({
      parentFolder: panel,
      particleSystemConfig: config,
      recreateParticleSystem: () =>
        recreateParticleSystem(true, ['colorOverLifetime', 'opacityOverLifetime']),
    })
  );
  configEntries.push(
    createSizeOverLifeTimeEntries({
      parentFolder: panel,
      particleSystemConfig: config,
      recreateParticleSystem: () => recreateParticleSystem(true, ['sizeOverLifetime']),
    })
  );
  configEntries.push(
    createRotationOverLifeTimeEntries({
      parentFolder: panel,
      particleSystemConfig: config,
      recreateParticleSystem: () => recreateParticleSystem(true, ['rotationOverLifetime']),
    })
  );
  configEntries.push(
    createNoiseEntries({
      parentFolder: panel,
      particleSystemConfig: config,
      recreateParticleSystem: () => recreateParticleSystem(true, ['noise']),
    })
  );
  configEntries.push(
    createForceFieldEntries({
      parentFolder: panel,
      particleSystemConfig: config,
      recreateParticleSystem, // Force fields: always full recreate (engine updateConfig bug with axes)
      scene,
    })
  );
  configEntries.push(
    createTextureSheetAnimationEntries({
      parentFolder: panel,
      particleSystemConfig: config,
      recreateParticleSystem,
    })
  );
  configEntries.push(
    createRendererEntries({
      parentFolder: panel,
      particleSystemConfig: config,
      recreateParticleSystem,
    })
  );
  configEntries.push(
    createTrailEntries({
      parentFolder: panel,
      particleSystemConfig: config,
      recreateParticleSystem,
    })
  );
  configEntries.push(
    createMeshEntries({
      parentFolder: panel,
      particleSystemConfig: config,
      recreateParticleSystem,
    })
  );

  recreateParticleSystem(false);
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
  isDirty: () => boolean;
  markDirty: () => void;
  switchToSubEmitter: (index: number) => void;
  switchToParent: () => void;
  getEditorContext: () => EditorContext;
}

declare global {
  interface Window {
    editor: EditorInterface;
  }
}

window.editor = {
  createNew,
  load: (config: ParticleSystemConfig) => {
    // Switch back to root context if editing a sub-emitter
    resetToRoot();
    isInitializing = true;
    loadParticleSystem({
      config,
      particleSystemConfig,
      recreateParticleSystem,
      onLoad: () => {
        // Rebuild the panel so controllers bind to the new config object references
        destroyPanel();
        configEntries.length = 0;
        createPanel();
        configEntries.forEach(({ onReset }) => onReset && onReset());
      },
    });
    isInitializing = false;
    configDirty = false;
  },
  loadFromClipboard: () => {
    // Switch back to root context if editing a sub-emitter
    resetToRoot();
    isInitializing = true;
    loadFromClipboard({
      particleSystemConfig,
      recreateParticleSystem,
      onLoad: () => {
        // Rebuild the panel so controllers bind to the new config object references
        destroyPanel();
        configEntries.length = 0;
        createPanel();
        configEntries.forEach(({ onReset }) => onReset && onReset());
        isInitializing = false;
        configDirty = false;
      },
    });
  },
  copyToClipboard: () => copyToClipboard(particleSystemConfig),
  reset: () => recreateParticleSystem(false),
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
  isDirty: () => configDirty,
  markDirty: () => {
    configDirty = true;
  },
  switchToSubEmitter,
  switchToParent,
  getEditorContext: () => ({ ...editorContext }),
};
