import * as THREE from 'three';

import {
  createCollisionPlaneHelpers,
  disposeCollisionPlaneHelpers,
} from '../collision-plane-helper';
import {
  initCollisionPlaneInteraction,
  deselectCollisionPlane,
  isCollisionPlaneDragging,
  getActiveCollisionPlaneIndex,
} from '../collision-plane-interaction';

type CollisionPlaneEntriesParams = {
  parentFolder: any;
  particleSystemConfig: any;
  recreateParticleSystem: () => void;
  scene: THREE.Scene;
};

type CollisionPlaneFolderData = {
  folder: any;
  controllers: any[];
};

let collisionPlaneFolders: CollisionPlaneFolderData[] = [];
let collisionPlanesFolder: any = null;
let currentScene: THREE.Scene | null = null;
let currentConfig: any = null;

const ensureCollisionPlaneDefaults = (cp: any): void => {
  if (cp.isActive === undefined) cp.isActive = true;
  if (!cp.position) cp.position = { x: 0, y: 0, z: 0 };
  if (!cp.normal) cp.normal = { x: 0, y: 1, z: 0 };
  if (cp.mode === undefined) cp.mode = 'KILL';
  if (cp.dampen === undefined) cp.dampen = 0.5;
  if (cp.lifetimeLoss === undefined) cp.lifetimeLoss = 0;
};

const recreateAndUpdateHelpers = (): void => {
  if (currentScene && currentConfig?._editorData?.showCollisionPlanes) {
    deselectCollisionPlane();
    createCollisionPlaneHelpers(currentScene, currentConfig.collisionPlanes || []);
  }
  if (currentConfig?._recreateCollisionPlanePS) {
    currentConfig._recreateCollisionPlanePS();
  }
};

let recreateThrottleTimer: ReturnType<typeof setTimeout> | null = null;

const onPositionChange = (index: number, position: THREE.Vector3): void => {
  if (!currentConfig) return;
  const collisionPlanes = currentConfig.collisionPlanes;
  if (!collisionPlanes || index >= collisionPlanes.length) return;

  collisionPlanes[index].position.x = Math.round(position.x * 100) / 100;
  collisionPlanes[index].position.y = Math.round(position.y * 100) / 100;
  collisionPlanes[index].position.z = Math.round(position.z * 100) / 100;

  if (currentConfig?._recreateCollisionPlanePS && !recreateThrottleTimer) {
    recreateThrottleTimer = setTimeout(() => {
      recreateThrottleTimer = null;
      if (currentConfig?._recreateCollisionPlanePS) {
        currentConfig._recreateCollisionPlanePS();
      }
    }, 100);
  }
};

const createCollisionPlaneFolder = (
  parentFolder: any,
  cp: any,
  index: number,
  recreateParticleSystem: () => void,
  onRemove: () => void
): CollisionPlaneFolderData => {
  const folder = parentFolder.addFolder(`Collision Plane ${index + 1}`);
  const controllers: any[] = [];

  ensureCollisionPlaneDefaults(cp);

  controllers.push(
    folder
      .add(cp, 'isActive')
      .name('Active')
      .onChange(() => recreateAndUpdateHelpers())
      .listen()
  );

  controllers.push(
    folder
      .add(cp, 'mode', ['KILL', 'CLAMP', 'BOUNCE'])
      .name('Mode')
      .onChange(() => recreateAndUpdateHelpers())
      .listen()
  );

  // Position
  const posFolder = folder.addFolder('Position');
  controllers.push(posFolder);
  posFolder
    .add(cp.position, 'x', -20, 20, 0.1)
    .onChange(() => recreateAndUpdateHelpers())
    .listen();
  posFolder
    .add(cp.position, 'y', -20, 20, 0.1)
    .onChange(() => recreateAndUpdateHelpers())
    .listen();
  posFolder
    .add(cp.position, 'z', -20, 20, 0.1)
    .onChange(() => recreateAndUpdateHelpers())
    .listen();

  // Normal
  const normalFolder = folder.addFolder('Normal');
  controllers.push(normalFolder);
  normalFolder
    .add(cp.normal, 'x', -1, 1, 0.01)
    .onChange(() => recreateAndUpdateHelpers())
    .listen();
  normalFolder
    .add(cp.normal, 'y', -1, 1, 0.01)
    .onChange(() => recreateAndUpdateHelpers())
    .listen();
  normalFolder
    .add(cp.normal, 'z', -1, 1, 0.01)
    .onChange(() => recreateAndUpdateHelpers())
    .listen();

  // Dampen
  controllers.push(
    folder
      .add(cp, 'dampen', 0, 1, 0.01)
      .name('Dampen')
      .onChange(() => recreateAndUpdateHelpers())
      .listen()
  );

  // Lifetime Loss
  controllers.push(
    folder
      .add(cp, 'lifetimeLoss', 0, 1, 0.01)
      .name('Lifetime Loss')
      .onChange(() => recreateAndUpdateHelpers())
      .listen()
  );

  // Remove button
  const removeObj = { remove: onRemove };
  controllers.push(folder.add(removeObj, 'remove').name('Remove Collision Plane'));

  return { folder, controllers };
};

const rebuildCollisionPlaneFolders = (
  particleSystemConfig: any,
  recreateParticleSystem: () => void
): void => {
  // Clean up existing folders
  collisionPlaneFolders.forEach(({ folder, controllers }) => {
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
  collisionPlaneFolders = [];

  if (!collisionPlanesFolder?.domElement?.parentNode) {
    collisionPlanesFolder = null;
    return;
  }

  if (!collisionPlanesFolder) return;

  if (!particleSystemConfig.collisionPlanes) {
    particleSystemConfig.collisionPlanes = [];
  }

  particleSystemConfig.collisionPlanes.forEach((cp: any, index: number) => {
    const folderData = createCollisionPlaneFolder(
      collisionPlanesFolder,
      cp,
      index,
      recreateParticleSystem,
      () => {
        particleSystemConfig.collisionPlanes.splice(index, 1);
        rebuildCollisionPlaneFolders(particleSystemConfig, recreateParticleSystem);
        recreateAndUpdateHelpers();
      }
    );
    collisionPlaneFolders.push(folderData);
  });
};

export const updateCollisionPlaneHelperVisibility = (
  scene: THREE.Scene,
  particleSystemConfig: any
): void => {
  if (particleSystemConfig._editorData?.showCollisionPlanes) {
    createCollisionPlaneHelpers(scene, particleSystemConfig.collisionPlanes || []);
    initCollisionPlaneInteraction(scene, onPositionChange);
  } else {
    deselectCollisionPlane();
    disposeCollisionPlaneHelpers(scene);
  }
};

export const createCollisionPlaneEntries = ({
  parentFolder,
  particleSystemConfig,
  recreateParticleSystem,
  scene,
}: CollisionPlaneEntriesParams): {
  onReset?: () => void;
  onParticleSystemChange?: () => void;
} => {
  currentScene = scene;
  currentConfig = particleSystemConfig;
  currentConfig._recreateCollisionPlanePS = recreateParticleSystem;

  const folder = parentFolder.addFolder('Collision Planes');
  folder.close();

  if (!particleSystemConfig.collisionPlanes) {
    particleSystemConfig.collisionPlanes = [];
  }

  collisionPlanesFolder = folder;

  // Add Collision Plane button
  const addObj = {
    addCollisionPlane: () => {
      const newCP: any = {
        isActive: true,
        position: { x: 0, y: 0, z: 0 },
        normal: { x: 0, y: 1, z: 0 },
        mode: 'KILL',
        dampen: 0.5,
        lifetimeLoss: 0,
      };
      particleSystemConfig.collisionPlanes.push(newCP);
      rebuildCollisionPlaneFolders(particleSystemConfig, recreateParticleSystem);
      recreateAndUpdateHelpers();
    },
  };
  folder.add(addObj, 'addCollisionPlane').name('+ Add Collision Plane');

  // Build initial folders
  rebuildCollisionPlaneFolders(particleSystemConfig, recreateParticleSystem);

  // Show helpers if enabled
  if (particleSystemConfig._editorData?.showCollisionPlanes) {
    createCollisionPlaneHelpers(scene, particleSystemConfig.collisionPlanes);
    initCollisionPlaneInteraction(scene, onPositionChange);
  }

  return {
    onReset: () => {
      deselectCollisionPlane();
      disposeCollisionPlaneHelpers(scene);
      rebuildCollisionPlaneFolders(particleSystemConfig, recreateParticleSystem);
      if (particleSystemConfig._editorData?.showCollisionPlanes) {
        createCollisionPlaneHelpers(scene, particleSystemConfig.collisionPlanes || []);
      }
    },
    onParticleSystemChange: () => {
      if (
        particleSystemConfig._editorData?.showCollisionPlanes &&
        !isCollisionPlaneDragging() &&
        getActiveCollisionPlaneIndex() === null
      ) {
        createCollisionPlaneHelpers(scene, particleSystemConfig.collisionPlanes || []);
      }
    },
  };
};
