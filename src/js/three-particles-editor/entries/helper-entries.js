import * as THREE from "three/build/three.module";

import { TextureId } from "../texture-config";
import { setTerrain } from "../world";

const worldAxesHelper = new THREE.AxesHelper(5);
const localAxesHelper = new THREE.AxesHelper(1);

let _particleSystem = null;

export const WIREFRAME = "WIREFRAME";

export const createHelperEntries = ({
  parentFolder,
  particleSystemConfig,
  scene,
}) => {
  const folder = parentFolder.addFolder("Helper");
  folder.close();

  folder
    .add(particleSystemConfig._editorData, "simulateMovements")
    .name("Simulate movements")
    .onChange((v) => {
      if (!v) {
        _particleSystem.position.x = 0;
        _particleSystem.position.y = 0;
        _particleSystem.position.z = 0;
      }
    })
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
    .name("Terrain texture")
    .listen()
    .onChange(setTerrain);

  return {
    onParticleSystemChange: (particleSystem) => {
      _particleSystem = particleSystem;
      updateLocalAxesHelper();
      updateWorldAxesHelper();
    },
    onUpdate: ({ elapsed }) => {
      if (
        particleSystemConfig._editorData.simulateMovements &&
        _particleSystem
      ) {
        _particleSystem.position.x = Math.cos(elapsed * 0.5) * 1;
        _particleSystem.position.y =
          Math.cos(elapsed) * Math.sin(elapsed) * 0.5;
        _particleSystem.position.z = Math.sin(elapsed * 0.5) * 1;
      }
    },
  };
};
