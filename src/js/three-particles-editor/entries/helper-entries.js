import * as THREE from "three/build/three.module";

const worldAxesHelper = new THREE.AxesHelper(5);
const localAxesHelper = new THREE.AxesHelper(1);

let simulateMovements = false;
let showLocalAxes = false;
let _particleSystem = null;

export const createHelperEntries = ({ parentFolder, scene }) => {
  const folder = parentFolder.addFolder("Helper");
  folder.close();

  folder
    .add({ simulateMovements: false }, "simulateMovements")
    .onChange((v) => {
      simulateMovements = v;
      if (!v) {
        _particleSystem.position.x = 0;
        _particleSystem.position.y = 0;
        _particleSystem.position.z = 0;
      }
    });

  folder.add({ showLocalAxes: false }, "showLocalAxes").onChange((v) => {
    showLocalAxes = v;
    updateLocalAxesHelper();
  });

  folder.add({ showWorldAxes: false }, "showWorldAxes").onChange((v) => {
    if (v) {
      scene.add(worldAxesHelper);
    } else {
      scene.remove(worldAxesHelper);
    }
  });

  return {
    onParticleSystemChange: (particleSystem) => {
      _particleSystem = particleSystem;
      updateLocalAxesHelper();
    },
    onUpdate: ({ elapsed }) => {
      if (simulateMovements && _particleSystem) {
        _particleSystem.position.x = Math.cos(elapsed * 0.5) * 1;
        _particleSystem.position.y =
          Math.cos(elapsed) * Math.sin(elapsed) * 0.5;
        _particleSystem.position.z = Math.sin(elapsed * 0.5) * 1;
      }
    },
  };
};

const updateLocalAxesHelper = () => {
  if (_particleSystem)
    if (showLocalAxes) {
      _particleSystem.add(localAxesHelper);
    } else {
      _particleSystem.remove(localAxesHelper);
    }
};
