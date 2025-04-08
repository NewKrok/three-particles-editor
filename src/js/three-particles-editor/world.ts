import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { TextureId } from "./texture-config";
import { getTexture } from "./assets";

let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;
let camera: THREE.PerspectiveCamera;
let stats: Stats;
let mesh: THREE.Mesh;

export const createWorld = (targetQuery: string): THREE.Scene => {
  const container = document.querySelector(targetQuery);
  if (!container) {
    throw new Error(`Container not found: ${targetQuery}`);
  }

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  mesh = new THREE.Mesh(new THREE.PlaneGeometry(50, 50, 50, 50));
  mesh.rotation.x = -Math.PI / 2;
  scene.add(mesh);
  setTerrain();

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  (renderer as any).useLegacyLights = true; // Previously physicallyCorrectLights = false
  renderer.toneMapping = 0;
  renderer.toneMappingExposure = 1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = true as unknown as THREE.ShadowMapType;
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
  if (!statsContainer) {
    throw new Error("Stats container not found");
  }

  stats = new Stats();
  statsContainer.appendChild(stats.dom);

  window.addEventListener("resize", onWindowResize);

  return scene;
};

const onWindowResize = (): void => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

export const updateWorld = (): void => {
  renderer.render(scene, camera);
  stats.update();
};

interface TerrainConfig {
  textureId?: string;
}

export const setTerrain = (config?: TerrainConfig): void => {
  const textureId = config?.textureId || TextureId.WIREFRAME;

  if (textureId === TextureId.WIREFRAME) {
    const material = new THREE.MeshBasicMaterial({
      wireframe: true,
      depthWrite: false,
      color: 0x111111
    });
    mesh.material = material;
  } else {
    const textureData = getTexture(textureId) as unknown as THREE.Texture;
    const material = new THREE.MeshBasicMaterial({
      map: textureData instanceof THREE.Texture ? textureData : undefined,
      wireframe: false
    });
    mesh.material = material;

  }
};
