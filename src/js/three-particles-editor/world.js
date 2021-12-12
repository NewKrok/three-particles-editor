import * as THREE from "three/build/three.module";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";

let scene, renderer, camera, stats;

export const createWorld = (targetQuery) => {
  const container = document.querySelector(targetQuery);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50, 50, 50),
    new THREE.MeshBasicMaterial({
      color: 0x111111,
      depthWrite: false,
      wireframe: true,
    })
  );
  mesh.rotation.x = -Math.PI / 2;
  scene.add(mesh);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
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

  stats = new Stats();
  container.appendChild(stats.dom);

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
