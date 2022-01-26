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
        _particleSystem.position.x = 0;
        _particleSystem.position.y = 0;
        _particleSystem.position.z = 0;
      }
      if (v === MovementSimulations.RANDOM_MOVEMENT) {
        _particleSystem.position.x = 0;
        _particleSystem.position.y = 0;
        _particleSystem.position.z = 0;
        const endPoint = { x: Math.random() * 2 - 4, z: Math.random() * 2 - 4 };
        randomMovement = {
          speedX: (endPoint.x - _particleSystem.position.x) / 300,
          speedZ: (endPoint.z - _particleSystem.position.z) / 300,
          time: 300,
        };
      }
    });

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
    },
    onUpdate: ({ elapsed }) => {
      if (_particleSystem) {
        let percentage, speed;
        switch (particleSystemConfig._editorData.simulation.movements) {
          case MovementSimulations.PROJECTILE_STRAIGHT:
            speed = 2;
            percentage =
              (elapsed - Math.floor(elapsed / speed) * speed) / speed;
            _particleSystem.position.x = percentage * 5;
            _particleSystem.position.y = 1;
            _particleSystem.position.z = 0;
            break;

          case MovementSimulations.PROJECTILE_ARC:
            speed = 2;
            percentage =
              (elapsed - Math.floor(elapsed / speed) * speed) / speed;
            _particleSystem.position.x = percentage * 5;
            _particleSystem.position.y = 1 + Math.sin(percentage * Math.PI);
            _particleSystem.position.z = 0;
            break;

          case MovementSimulations.CIRCLE:
            _particleSystem.position.x = Math.cos(elapsed * 0.5) * 2;
            _particleSystem.position.y = 0;
            _particleSystem.position.z = Math.sin(elapsed * 0.5) * 2;
            break;

          case MovementSimulations.CIRCLE_WITH_WAVE:
            _particleSystem.position.x = Math.cos(elapsed * 0.5) * 2;
            _particleSystem.position.y =
              Math.cos(elapsed) * Math.sin(elapsed) * 0.5;
            _particleSystem.position.z = Math.sin(elapsed * 0.5) * 2;
            break;

          case MovementSimulations.RANDOM_MOVEMENT:
            if (randomMovement.time-- <= 0) {
              const endPoint = {
                x: _particleSystem.position.x + Math.random() * 2 - 4,
                z: _particleSystem.position.z + Math.random() * 2 - 4,
              };
              randomMovement = {
                speedX: (endPoint.x - _particleSystem.position.x) / 300,
                speedZ: (endPoint.z - _particleSystem.position.z) / 300,
                time: 300 + Math.random() * 300,
              };
            }

            _particleSystem.position.x += randomMovement.speedX;
            _particleSystem.position.y = 0;
            _particleSystem.position.z += randomMovement.speedZ;
            break;

          default:
            break;
        }
      }
    },
    onReset: () => {
      updateWorldAxesHelper();
    },
  };
};
