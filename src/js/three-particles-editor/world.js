import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
import { TextureId } from "./texture-config";
import { getTexture } from "./assets";

let scene, renderer, camera, stats, mesh;

export const createWorld = (targetQuery) => {
  const container = document.querySelector(targetQuery);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  mesh = new THREE.Mesh(new THREE.PlaneGeometry(50, 50, 50, 50));
  mesh.rotation.x = -Math.PI / 2;
  scene.add(mesh);
  setTerrain();

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.physicallyCorrectLights = false;
  renderer.toneMapping = 0;
  renderer.toneMappingExposure = 1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = true;
  container.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    100
  );
  camera.position.set(0, 0, 6);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = true;
  controls.enableZoom = true;
  controls.target.set(0, 0, 0);
  controls.update();

  const statsContainer = document.querySelector(".stats");
  stats = new Stats();
  statsContainer.appendChild(stats.dom);

  window.addEventListener("resize", onWindowResize);

  return scene;
};

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

export const updateWorld = () => {
  renderer.render(scene, camera);
  stats.update();
};

export const setTerrain = (textureId = null) => {
  if (TextureId[textureId]) {
    const map = getTexture(textureId).map;
    map.wrapS = THREE.MirroredRepeatWrapping;
    map.wrapT = THREE.MirroredRepeatWrapping;
    map.repeat.x = 50;
    map.repeat.y = 50;
    map.encoding = THREE.sRGBEncoding;
    mesh.material = new THREE.MeshBasicMaterial({
      map,
    });
  } else {
    mesh.material = new THREE.MeshBasicMaterial({
      color: 0x111111,
      depthWrite: false,
      wireframe: true,
    });
  }
};
