import * as THREE from 'three';

import { TextureId } from '../texture-config';
import { setTerrain } from '../world';
import type { ParticleSystem, ParticleSystemConfig } from '@newkrok/three-particles';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { updateShapeHelper } from '../shape-helper';

const worldAxesHelper = new THREE.AxesHelper(5);
const localAxesHelper = new THREE.AxesHelper(1);

let randomMovement: { delay?: number; speedX: number; speedZ: number; time?: number } = {
  delay: 0,
  speedX: 0,
  speedZ: 0,
  time: 0,
};
const currentPosition = new THREE.Vector3();
const movementVector = new THREE.Vector3();

export const MovementSimulations = {
  DISABLED: 'DISABLED',
  PROJECTILE_STRAIGHT: 'PROJECTILE_STRAIGHT',
  PROJECTILE_ARC: 'PROJECTILE_ARC',
  CIRCLE: 'CIRCLE',
  CIRCLE_WITH_WAVE: 'CIRCLE_WITH_WAVE',
  INFINITE_SYMBOL: 'INFINITE_SYMBOL',
  RANDOM_MOVEMENT: 'RANDOM_MOVEMENT',
} as const;

export type MovementSimulationType = (typeof MovementSimulations)[keyof typeof MovementSimulations];

export const RotationSimulations = {
  DISABLED: 'DISABLED',
  FOLLOW_THE_MOVEMENT: 'FOLLOW_THE_MOVEMENT',
  X: 'X',
  Y: 'Y',
  Z: 'Z',
  MIXED: 'MIXED',
} as const;

export type RotationSimulationType = (typeof RotationSimulations)[keyof typeof RotationSimulations];

type HelperEntriesParams = {
  parentFolder: GUI;
  particleSystemConfig: ParticleSystemConfig;
  scene: THREE.Scene;
  particleSystemContainer: THREE.Object3D;
};

type HelperEntriesResult = {
  onParticleSystemChange: (particleSystem: ParticleSystem) => void;
  onUpdate: (params: { elapsed: number }) => void;
  onReset: () => void;
};

export const createHelperEntries = ({
  parentFolder,
  particleSystemConfig,
  scene,
  particleSystemContainer,
}: HelperEntriesParams): HelperEntriesResult => {
  const folder = parentFolder.addFolder('Helper');
  folder.close();

  const calculateRandomMovement = (): void => {
    const endPoint = { x: Math.random() * 2 - 1, z: Math.random() * 2 - 1 };
    randomMovement = {
      speedX: (endPoint.x - particleSystemContainer.position.x) / 200,
      speedZ: (endPoint.z - particleSystemContainer.position.z) / 200,
      time: 100 * (1 / particleSystemConfig._editorData.simulation.movementSpeed),
    };
  };
  calculateRandomMovement();
  folder
    .add(particleSystemConfig._editorData.simulation, 'movements', [
      MovementSimulations.DISABLED,
      MovementSimulations.PROJECTILE_STRAIGHT,
      MovementSimulations.PROJECTILE_ARC,
      MovementSimulations.CIRCLE,
      MovementSimulations.CIRCLE_WITH_WAVE,
      MovementSimulations.INFINITE_SYMBOL,
      MovementSimulations.RANDOM_MOVEMENT,
    ])
    .listen()
    .name('Simulate movements')
    .onChange((v: MovementSimulationType) => {
      movementVector.set(0, 0, 0);
      if (v === MovementSimulations.DISABLED) {
        particleSystemContainer.position.x = 0;
        particleSystemContainer.position.y = 0;
        particleSystemContainer.position.z = 0;
      }
      if (v === MovementSimulations.RANDOM_MOVEMENT) {
        particleSystemContainer.position.x = 0;
        particleSystemContainer.position.y = 0;
        particleSystemContainer.position.z = 0;
        calculateRandomMovement();
      }
    });

  folder
    .add(particleSystemConfig._editorData.simulation, 'movementSpeed', 0.1, 10, 0.1)
    .name('Movement speed')
    .listen();

  folder
    .add(particleSystemConfig._editorData.simulation, 'rotation', [
      RotationSimulations.DISABLED,
      RotationSimulations.FOLLOW_THE_MOVEMENT,
      RotationSimulations.X,
      RotationSimulations.Y,
      RotationSimulations.Z,
      RotationSimulations.MIXED,
    ])
    .listen()
    .name('Simulate rotation')
    .onChange(() => {
      particleSystemContainer.rotation.x = 0;
      particleSystemContainer.rotation.y = 0;
      particleSystemContainer.rotation.z = 0;
    });

  folder
    .add(particleSystemConfig._editorData.simulation, 'rotationSpeed', -10, 10, 0.1)
    .name('Rotation speed')
    .listen();

  const updateLocalAxesHelper = (): void => {
    if (particleSystemContainer)
      if (particleSystemConfig._editorData.showLocalAxes) {
        particleSystemContainer.add(localAxesHelper);
      } else {
        particleSystemContainer.remove(localAxesHelper);
      }
  };
  folder
    .add(particleSystemConfig._editorData, 'showLocalAxes')
    .name('Show local axes')
    .onChange(updateLocalAxesHelper)
    .listen();

  const updateWorldAxesHelper = (): void => {
    if (particleSystemConfig._editorData.showWorldAxes) {
      scene.add(worldAxesHelper);
    } else {
      scene.remove(worldAxesHelper);
    }
  };
  folder
    .add(particleSystemConfig._editorData, 'showWorldAxes')
    .name('Show world axes')
    .onChange(updateWorldAxesHelper)
    .listen();

  const updateShapeHelperVisibility = (): void => {
    updateShapeHelper(
      particleSystemContainer,
      particleSystemConfig.shape,
      particleSystemConfig._editorData.showShape
    );
  };
  folder
    .add(particleSystemConfig._editorData, 'showShape')
    .name('Show shape')
    .onChange(updateShapeHelperVisibility)
    .listen();

  folder
    .add(particleSystemConfig._editorData.terrain, 'textureId', [
      TextureId.WIREFRAME,
      TextureId.TERRAIN_CHESS_BOARD,
      TextureId.TERRAIN_CHESS_BOARD_COLORFUL,
      TextureId.TERRAIN_DIRT,
    ])
    .name('Terrain')
    .onChange((v: string) => {
      setTerrain(v);
    })
    .listen();

  updateLocalAxesHelper();
  updateWorldAxesHelper();
  updateShapeHelperVisibility();

  return {
    onParticleSystemChange: (): void => {
      updateLocalAxesHelper();
      updateWorldAxesHelper();
      updateShapeHelperVisibility();
    },
    onUpdate: ({ elapsed }: { elapsed: number }): void => {
      if (particleSystemContainer) {
        const speed = 2;
        const percentage = (elapsed - Math.floor(elapsed / speed) * speed) / speed;
        currentPosition.copy(particleSystemContainer.position);
        const movementMultiplier = particleSystemConfig._editorData.simulation.movementSpeed;
        switch (particleSystemConfig._editorData.simulation.movements) {
          case MovementSimulations.PROJECTILE_STRAIGHT:
            particleSystemContainer.position.x = percentage * 5 * movementMultiplier;
            particleSystemContainer.position.y = 1;
            particleSystemContainer.position.z = 0;
            break;

          case MovementSimulations.PROJECTILE_ARC:
            particleSystemContainer.position.x = percentage * 5 * movementMultiplier;
            particleSystemContainer.position.y = 1 + Math.sin(percentage * Math.PI);
            particleSystemContainer.position.z = 0;
            break;

          case MovementSimulations.CIRCLE:
            particleSystemContainer.position.x = Math.cos(elapsed * 0.5 * movementMultiplier) * 2;
            particleSystemContainer.position.y = 0;
            particleSystemContainer.position.z = Math.sin(elapsed * 0.5 * movementMultiplier) * 2;
            break;

          case MovementSimulations.CIRCLE_WITH_WAVE:
            particleSystemContainer.position.x = Math.cos(elapsed * 0.5 * movementMultiplier) * 2;
            particleSystemContainer.position.y =
              Math.cos(elapsed * movementMultiplier) * Math.sin(elapsed * movementMultiplier) * 0.5;
            particleSystemContainer.position.z = Math.sin(elapsed * 0.5 * movementMultiplier) * 2;
            break;

          case MovementSimulations.INFINITE_SYMBOL:
            particleSystemContainer.position.x = Math.cos(elapsed * 0.5 * movementMultiplier) * 4;
            particleSystemContainer.position.y = 0;
            particleSystemContainer.position.z = Math.sin(elapsed * 1 * movementMultiplier) * 2;
            break;

          case MovementSimulations.RANDOM_MOVEMENT:
            if (randomMovement.time && randomMovement.time-- <= 0) {
              const endPoint = {
                x: particleSystemContainer.position.x + Math.random() * 2 - 1,
                z: particleSystemContainer.position.z + Math.random() * 2 - 1,
              };
              randomMovement = {
                speedX: (endPoint.x - particleSystemContainer.position.x) / 200,
                speedZ: (endPoint.z - particleSystemContainer.position.z) / 200,
                time:
                  300 +
                  Math.random() *
                    200 *
                    (1 / particleSystemConfig._editorData.simulation.movementSpeed),
              };
            }

            particleSystemContainer.position.x += randomMovement.speedX * movementMultiplier;
            particleSystemContainer.position.y = 0;
            particleSystemContainer.position.z += randomMovement.speedZ * movementMultiplier;
            break;

          default:
            break;
        }
        movementVector.copy(currentPosition).sub(particleSystemContainer.position);
        const rotationMultiplier = particleSystemConfig._editorData.simulation.rotationSpeed;
        switch (particleSystemConfig._editorData.simulation.rotation) {
          case RotationSimulations.FOLLOW_THE_MOVEMENT:
            particleSystemContainer.rotation.y =
              Math.PI * 2 - Math.atan2(movementVector.z, movementVector.x);
            break;
          case RotationSimulations.X:
            particleSystemContainer.rotation.x = rotationMultiplier * elapsed;
            break;
          case RotationSimulations.Y:
            particleSystemContainer.rotation.y = rotationMultiplier * elapsed;
            break;
          case RotationSimulations.Z:
            particleSystemContainer.rotation.z = rotationMultiplier * elapsed;
            break;
          case RotationSimulations.MIXED:
            particleSystemContainer.rotation.x = rotationMultiplier * Math.cos(elapsed);
            particleSystemContainer.rotation.y = rotationMultiplier * Math.sin(elapsed);
            particleSystemContainer.rotation.z =
              rotationMultiplier * Math.sin(elapsed) * Math.sin(elapsed);
            break;
        }
      }
    },
    onReset: (): void => {
      updateWorldAxesHelper();
      updateShapeHelperVisibility();
      particleSystemContainer.position.x = 0;
      particleSystemContainer.position.y = 0;
      particleSystemContainer.position.z = 0;
      particleSystemContainer.rotation.x = 0;
      particleSystemContainer.rotation.y = 0;
      particleSystemContainer.rotation.z = 0;
    },
  };
};
