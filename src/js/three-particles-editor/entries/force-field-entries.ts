import * as THREE from 'three';

import { createForceFieldHelpers, disposeForceFieldHelpers } from '../force-field-helper';
import {
  initForceFieldInteraction,
  deselectForceField,
  isForceFieldDragging,
  getActiveForceFieldIndex,
} from '../force-field-interaction';

type ForceFieldEntriesParams = {
  parentFolder: any;
  particleSystemConfig: any;
  recreateParticleSystem: () => void;
  scene: THREE.Scene;
};

type ForceFieldFolderData = {
  folder: any;
  controllers: any[];
};

let forceFieldFolders: ForceFieldFolderData[] = [];
let forceFieldsFolder: any = null;
let currentScene: THREE.Scene | null = null;
let currentConfig: any = null;

const ensureForceFieldDefaults = (ff: any): void => {
  if (ff.isActive === undefined) ff.isActive = true;
  if (ff.type === undefined) ff.type = 'POINT';
  if (!ff.position) ff.position = { x: 0, y: 0, z: 0 };
  if (!ff.direction) ff.direction = { x: 0, y: 1, z: 0 };
  if (ff.strength === undefined) ff.strength = 1;
  if (ff.range === undefined) ff.range = 5;
  if (ff.falloff === undefined) ff.falloff = 'LINEAR';
};

const createForceFieldFolder = (
  parentFolder: any,
  ff: any,
  index: number,
  particleSystemConfig: any,
  recreateParticleSystem: () => void,
  onRemove: () => void
): ForceFieldFolderData => {
  const folder = parentFolder.addFolder(`Force Field ${index + 1}`);
  const controllers: any[] = [];
  let typeControllers: any[] = [];

  ensureForceFieldDefaults(ff);

  controllers.push(
    folder
      .add(ff, 'isActive')
      .name('Active')
      .onChange(() => {
        recreateAndUpdateHelpers(particleSystemConfig);
      })
      .listen()
  );

  const createTypeSpecificControls = (): void => {
    typeControllers.forEach((c) => {
      try {
        c.destroy();
      } catch {
        // may already be destroyed
      }
    });
    typeControllers = [];

    if (ff.type === 'POINT') {
      // Position
      const posFolder = folder.addFolder('Position');
      typeControllers.push(posFolder);
      posFolder
        .add(ff.position, 'x', -20, 20, 0.1)
        .onChange(() => recreateAndUpdateHelpers(particleSystemConfig))
        .listen();
      posFolder
        .add(ff.position, 'y', -20, 20, 0.1)
        .onChange(() => recreateAndUpdateHelpers(particleSystemConfig))
        .listen();
      posFolder
        .add(ff.position, 'z', -20, 20, 0.1)
        .onChange(() => recreateAndUpdateHelpers(particleSystemConfig))
        .listen();

      // Range
      typeControllers.push(
        folder
          .add(ff, 'range', 0.1, 50, 0.1)
          .name('Range')
          .onChange(() => recreateAndUpdateHelpers(particleSystemConfig))
          .listen()
      );

      // Falloff
      typeControllers.push(
        folder
          .add(ff, 'falloff', ['NONE', 'LINEAR', 'QUADRATIC'])
          .name('Falloff')
          .onChange(() => {
            recreateParticleSystem();
          })
          .listen()
      );
    } else {
      // DIRECTIONAL
      const dirFolder = folder.addFolder('Direction');
      typeControllers.push(dirFolder);
      dirFolder
        .add(ff.direction, 'x', -1, 1, 0.01)
        .onChange(() => recreateAndUpdateHelpers(particleSystemConfig))
        .listen();
      dirFolder
        .add(ff.direction, 'y', -1, 1, 0.01)
        .onChange(() => recreateAndUpdateHelpers(particleSystemConfig))
        .listen();
      dirFolder
        .add(ff.direction, 'z', -1, 1, 0.01)
        .onChange(() => recreateAndUpdateHelpers(particleSystemConfig))
        .listen();
    }
  };

  controllers.push(
    folder
      .add(ff, 'type', ['POINT', 'DIRECTIONAL'])
      .name('Type')
      .onChange(() => {
        createTypeSpecificControls();
        recreateAndUpdateHelpers(particleSystemConfig);
      })
      .listen()
  );

  // Strength - handle constant or min/max
  const strengthTypeObj = {
    type: typeof ff.strength === 'object' ? 'Random' : 'Constant',
  };
  const constantStrengthObj = {
    value:
      typeof ff.strength === 'number'
        ? ff.strength
        : ((ff.strength?.min ?? 1) + (ff.strength?.max ?? 1)) / 2,
  };

  let strengthControllers: any[] = [];

  const createStrengthControls = (): void => {
    strengthControllers.forEach((c) => {
      try {
        c.destroy();
      } catch {
        // may already be destroyed
      }
    });
    strengthControllers = [];

    if (strengthTypeObj.type === 'Constant') {
      if (typeof ff.strength !== 'number') {
        constantStrengthObj.value = ff.strength?.min ?? 1;
        ff.strength = constantStrengthObj.value;
      }
      strengthControllers.push(
        folder
          .add(constantStrengthObj, 'value', -20, 20, 0.1)
          .name('Strength')
          .onChange((v: number) => {
            ff.strength = v;
            recreateAndUpdateHelpers(particleSystemConfig);
          })
          .listen()
      );
    } else {
      if (typeof ff.strength === 'number') {
        ff.strength = { min: ff.strength, max: ff.strength };
      }
      strengthControllers.push(
        folder
          .add(ff.strength, 'min', -20, 20, 0.1)
          .name('Strength Min')
          .onChange((v: number) => {
            ff.strength.min = Math.min(v, ff.strength.max ?? v);
            recreateParticleSystem();
          })
          .listen()
      );
      strengthControllers.push(
        folder
          .add(ff.strength, 'max', -20, 20, 0.1)
          .name('Strength Max')
          .onChange((v: number) => {
            ff.strength.max = Math.max(v, ff.strength.min ?? v);
            recreateParticleSystem();
          })
          .listen()
      );
    }
  };

  controllers.push(
    folder
      .add(strengthTypeObj, 'type', ['Constant', 'Random'])
      .name('Strength Type')
      .onChange(() => {
        createStrengthControls();
        recreateParticleSystem();
      })
  );

  createStrengthControls();
  createTypeSpecificControls();

  // Remove button
  const removeObj = { remove: onRemove };
  controllers.push(folder.add(removeObj, 'remove').name('Remove Force Field'));

  return { folder, controllers: [...controllers, ...typeControllers, ...strengthControllers] };
};

const recreateAndUpdateHelpers = (particleSystemConfig: any): void => {
  if (currentScene && particleSystemConfig._editorData?.showForceFields) {
    deselectForceField();
    createForceFieldHelpers(currentScene, particleSystemConfig.forceFields || []);
  }
  // Also recreate the particle system with updated force fields
  if (currentConfig?._recreateParticleSystem) {
    currentConfig._recreateParticleSystem();
  }
};

const rebuildForceFieldFolders = (
  particleSystemConfig: any,
  recreateParticleSystem: () => void
): void => {
  // Clean up existing folders
  forceFieldFolders.forEach(({ folder, controllers }) => {
    controllers.forEach((c) => {
      try {
        c.destroy();
      } catch {
        // may already be destroyed
      }
    });
    try {
      folder.destroy();
    } catch {
      // may already be destroyed
    }
  });
  forceFieldFolders = [];

  if (!forceFieldsFolder?.domElement?.parentNode) {
    forceFieldsFolder = null;
    return;
  }

  if (!forceFieldsFolder) return;

  if (!particleSystemConfig.forceFields) {
    particleSystemConfig.forceFields = [];
  }

  particleSystemConfig.forceFields.forEach((ff: any, index: number) => {
    const folderData = createForceFieldFolder(
      forceFieldsFolder,
      ff,
      index,
      particleSystemConfig,
      recreateParticleSystem,
      () => {
        particleSystemConfig.forceFields.splice(index, 1);
        rebuildForceFieldFolders(particleSystemConfig, recreateParticleSystem);
        recreateAndUpdateHelpers(particleSystemConfig);
      }
    );
    forceFieldFolders.push(folderData);
  });
};

let recreateThrottleTimer: ReturnType<typeof setTimeout> | null = null;

const onPositionChange = (index: number, position: THREE.Vector3): void => {
  if (!currentConfig) return;
  const forceFields = currentConfig.forceFields;
  if (!forceFields || index >= forceFields.length) return;

  // Update config from 3D drag position (GUI .listen() controls auto-refresh)
  forceFields[index].position.x = Math.round(position.x * 100) / 100;
  forceFields[index].position.y = Math.round(position.y * 100) / 100;
  forceFields[index].position.z = Math.round(position.z * 100) / 100;

  // Throttled recreate during drag — avoids excessive recreations while keeping it responsive
  if (currentConfig?._recreateParticleSystem && !recreateThrottleTimer) {
    recreateThrottleTimer = setTimeout(() => {
      recreateThrottleTimer = null;
      if (currentConfig?._recreateParticleSystem) {
        currentConfig._recreateParticleSystem();
      }
    }, 100);
  }
};

export const updateForceFieldHelperVisibility = (
  scene: THREE.Scene,
  particleSystemConfig: any
): void => {
  if (particleSystemConfig._editorData?.showForceFields) {
    createForceFieldHelpers(scene, particleSystemConfig.forceFields || []);
    initForceFieldInteraction(scene, onPositionChange);
  } else {
    deselectForceField();
    disposeForceFieldHelpers(scene);
  }
};

export const createForceFieldEntries = ({
  parentFolder,
  particleSystemConfig,
  recreateParticleSystem,
  scene,
}: ForceFieldEntriesParams): {
  onReset?: () => void;
  onParticleSystemChange?: () => void;
} => {
  currentScene = scene;
  currentConfig = particleSystemConfig;
  currentConfig._recreateParticleSystem = recreateParticleSystem;

  const folder = parentFolder.addFolder('Force Fields');
  folder.close();

  if (!particleSystemConfig.forceFields) {
    particleSystemConfig.forceFields = [];
  }

  forceFieldsFolder = folder;

  // Add Force Field button
  const addObj = {
    addForceField: () => {
      const newFF: any = {
        isActive: true,
        type: 'POINT',
        position: { x: 0, y: 0, z: 0 },
        direction: { x: 0, y: 1, z: 0 },
        strength: 1,
        range: 5,
        falloff: 'LINEAR',
      };
      particleSystemConfig.forceFields.push(newFF);
      rebuildForceFieldFolders(particleSystemConfig, recreateParticleSystem);
      recreateAndUpdateHelpers(particleSystemConfig);
    },
  };
  folder.add(addObj, 'addForceField').name('+ Add Force Field');

  // Build initial folders
  rebuildForceFieldFolders(particleSystemConfig, recreateParticleSystem);

  // Show helpers if enabled
  if (particleSystemConfig._editorData?.showForceFields) {
    createForceFieldHelpers(scene, particleSystemConfig.forceFields);
    initForceFieldInteraction(scene, onPositionChange);
  }

  return {
    onReset: () => {
      deselectForceField();
      disposeForceFieldHelpers(scene);
      rebuildForceFieldFolders(particleSystemConfig, recreateParticleSystem);
      if (particleSystemConfig._editorData?.showForceFields) {
        createForceFieldHelpers(scene, particleSystemConfig.forceFields || []);
      }
    },
    onParticleSystemChange: () => {
      // Don't rebuild helpers while dragging or when a force field is selected —
      // the TransformControls is attached to the current helper mesh, and
      // replacing it mid-interaction causes a null reference crash.
      if (
        particleSystemConfig._editorData?.showForceFields &&
        !isForceFieldDragging() &&
        getActiveForceFieldIndex() === null
      ) {
        createForceFieldHelpers(scene, particleSystemConfig.forceFields || []);
      }
    },
  };
};
