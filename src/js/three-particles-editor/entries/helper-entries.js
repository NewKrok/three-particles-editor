import * as THREE from "three";

import { TextureId } from "../texture-config";
import { setTerrain } from "../world";

const worldAxesHelper = new THREE.AxesHelper(5);
const localAxesHelper = new THREE.AxesHelper(1);

let _particleSystem = null;
let randomMovement = { delay: 0, speedX: 0, speedZ: 0 };

export const WIREFRAME = "WIREFRAME";

export const MovementSimulations = {
  DISABLED: "DISABLED",
  PROJECTILE_STRAIGHT: "PROJECTILE_STRAIGHT",
  PROJECTILE_ARC: "PROJECTILE_ARC",
  CIRCLE: "CIRCLE",
  CIRCLE_WITH_WAVE: "CIRCLE_WITH_WAVE",
  RANDOM_MOVEMENT: "RANDOM_MOVEMENT",
};

export const createHelperEntries = ({
  parentFolder,
  particleSystemConfig,
  scene,
  particleSystemContainer,
}) => {
  const folder = parentFolder.addFolder("Helper");
  folder.close();

  folder
    .add(particleSystemConfig._editorData.simulation, "movements", [
      MovementSimulations.DISABLED,
      MovementSimulations.PROJECTILE_STRAIGHT,
      MovementSimulations.PROJECTILE_ARC,
      MovementSimulations.CIRCLE,
      MovementSimulations.CIRCLE_WITH_WAVE,
      MovementSimulations.RANDOM_MOVEMENT,
    ])
    .listen()
    .name("Simulate movements")
    .onChange((v) => {
      if (v === MovementSimulations.DISABLED) {
        particleSystemContainer.position.x = 0;
        particleSystemContainer.position.y = 0;
        particleSystemContainer.position.z = 0;
      }
      if (v === MovementSimulations.RANDOM_MOVEMENT) {
        particleSystemContainer.position.x = 0;
        particleSystemContainer.position.y = 0;
        particleSystemContainer.position.z = 0;
        const endPoint = { x: Math.random() * 2 - 1, z: Math.random() * 2 - 1 };
        randomMovement = {
          speedX: (endPoint.x - particleSystemContainer.position.x) / 200,
          speedZ: (endPoint.z - particleSystemContainer.position.z) / 200,
          time:
            100 *
            (1 / particleSystemConfig._editorData.simulation.movementSpeed),
        };
      }
    });

  folder
    .add(
      particleSystemConfig._editorData.simulation,
      "movementSpeed",
      0.1,
      10,
      0.1
    )
    .name("Movement speed")
    .listen();

  const updateLocalAxesHelper = () => {
    if (_particleSystem)
      if (particleSystemConfig._editorData.showLocalAxes) {
        _particleSystem.add(localAxesHelper);
      } else {
        _particleSystem.remove(localAxesHelper);
      }
  };
  folder
    .add(particleSystemConfig._editorData, "showLocalAxes")
    .name("Show local axes")
    .onChange(updateLocalAxesHelper)
    .listen();

  const updateWorldAxesHelper = () => {
    if (particleSystemConfig._editorData.showWorldAxes) {
      scene.add(worldAxesHelper);
    } else {
      scene.remove(worldAxesHelper);
    }
  };
  folder
    .add(particleSystemConfig._editorData, "showWorldAxes")
    .name("Show world axes")
    .onChange(updateWorldAxesHelper)
    .listen();

  folder
    .add(particleSystemConfig._editorData.terrain, "textureId", [
      WIREFRAME,
      TextureId.TERRAIN_CHESS_BOARD,
      TextureId.TERRAIN_CHESS_BOARD_COLORFUL,
      TextureId.TERRAIN_DIRT,
    ])
    .listen()
    .name("Terrain texture")
    .onChange(setTerrain);

  return {
    onParticleSystemChange: (particleSystem) => {
      _particleSystem = particleSystem;
      updateLocalAxesHelper();
      updateWorldAxesHelper();
    },
    onUpdate: ({ elapsed }) => {
      if (particleSystemContainer) {
        let movementMultiplier =
          particleSystemConfig._editorData.simulation.movementSpeed;
        let percentage, speed;
        switch (particleSystemConfig._editorData.simulation.movements) {
          case MovementSimulations.PROJECTILE_STRAIGHT:
            speed = 2;
            percentage =
              (elapsed - Math.floor(elapsed / speed) * speed) / speed;
            particleSystemContainer.position.x =
              percentage * 5 * movementMultiplier;
            particleSystemContainer.position.y = 1;
            particleSystemContainer.position.z = 0;
            break;

          case MovementSimulations.PROJECTILE_ARC:
            speed = 2;
            percentage =
              (elapsed - Math.floor(elapsed / speed) * speed) / speed;
            particleSystemContainer.position.x =
              percentage * 5 * movementMultiplier;
            particleSystemContainer.position.y =
              1 + Math.sin(percentage * Math.PI);
            particleSystemContainer.position.z = 0;
            break;

          case MovementSimulations.CIRCLE:
            particleSystemContainer.position.x =
              Math.cos(elapsed * 0.5 * movementMultiplier) * 2;
            particleSystemContainer.position.y = 0;
            particleSystemContainer.position.z =
              Math.sin(elapsed * 0.5 * movementMultiplier) * 2;
            break;

          case MovementSimulations.CIRCLE_WITH_WAVE:
            particleSystemContainer.position.x =
              Math.cos(elapsed * 0.5 * movementMultiplier) * 2;
            particleSystemContainer.position.y =
              Math.cos(elapsed * movementMultiplier) *
              Math.sin(elapsed * movementMultiplier) *
              0.5;
            particleSystemContainer.position.z =
              Math.sin(elapsed * 0.5 * movementMultiplier) * 2;
            break;

          case MovementSimulations.RANDOM_MOVEMENT:
            if (randomMovement.time-- <= 0) {
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
                    (1 /
                      particleSystemConfig._editorData.simulation
                        .movementSpeed),
              };
            }

            particleSystemContainer.position.x +=
              randomMovement.speedX * movementMultiplier;
            particleSystemContainer.position.y = 0;
            particleSystemContainer.position.z +=
              randomMovement.speedZ * movementMultiplier;
            break;

          default:
            break;
        }
      }
    },
    onReset: () => {
      updateWorldAxesHelper();
      particleSystemContainer.position.x = 0;
      particleSystemContainer.position.y = 0;
      particleSystemContainer.position.z = 0;
    },
  };
};
