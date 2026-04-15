import * as THREE from 'three';

import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { getCamera, getRendererDomElement, getOrbitControls } from './world';
import { getCollisionPlaneCenterMeshes, getCollisionPlaneHelpers } from './collision-plane-helper';

let transformControls: TransformControls | null = null;
let activeCollisionPlaneIndex: number | null = null;
let onPositionChangeCallback: ((index: number, position: THREE.Vector3) => void) | null = null;
let isInitialized = false;
let isDragging = false;
let scene: THREE.Scene | null = null;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const hitsTransformControls = (event: PointerEvent): boolean => {
  if (!transformControls || activeCollisionPlaneIndex === null || !scene) return false;

  const domElement = getRendererDomElement();
  const rect = domElement.getBoundingClientRect();
  const mouseVec = new THREE.Vector2(
    ((event.clientX - rect.left) / rect.width) * 2 - 1,
    -((event.clientY - rect.top) / rect.height) * 2 + 1
  );

  const camera = getCamera();
  const tcRaycaster = new THREE.Raycaster();
  tcRaycaster.setFromCamera(mouseVec, camera);

  const gizmo = transformControls.getHelper();
  const intersects = tcRaycaster.intersectObjects(gizmo.children, true);
  return intersects.length > 0;
};

const onPointerDown = (event: PointerEvent): void => {
  if (!scene) return;

  const domElement = getRendererDomElement();
  const rect = domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  const camera = getCamera();
  raycaster.setFromCamera(mouse, camera);

  const centerMeshes = getCollisionPlaneCenterMeshes();
  const intersects = centerMeshes.length > 0 ? raycaster.intersectObjects(centerMeshes, false) : [];

  if (intersects.length > 0) {
    const mesh = intersects[0].object as THREE.Mesh;
    const index = mesh.userData.collisionPlaneIndex;
    if (index !== undefined) {
      selectCollisionPlane(index);
      event.stopPropagation();
    }
  } else if (hitsTransformControls(event)) {
    return;
  } else {
    deselectCollisionPlane();
  }
};

const selectCollisionPlane = (index: number): void => {
  if (!transformControls || !scene) return;

  const helpers = getCollisionPlaneHelpers();
  if (index < 0 || index >= helpers.length) return;

  activeCollisionPlaneIndex = index;
  const helper = helpers[index];

  transformControls.attach(helper);
  scene.add(transformControls.getHelper());
};

export const deselectCollisionPlane = (): void => {
  if (!transformControls) return;
  if (activeCollisionPlaneIndex === null) return;

  transformControls.detach();
  activeCollisionPlaneIndex = null;

  if (scene) {
    scene.remove(transformControls.getHelper());
  }
};

export const initCollisionPlaneInteraction = (
  targetScene: THREE.Scene,
  onPositionChange: (index: number, position: THREE.Vector3) => void
): void => {
  if (isInitialized) return;

  scene = targetScene;
  onPositionChangeCallback = onPositionChange;

  const camera = getCamera();
  const domElement = getRendererDomElement();
  const orbitControls = getOrbitControls();

  transformControls = new TransformControls(camera, domElement);
  transformControls.setMode('translate');
  transformControls.setSize(0.8);

  transformControls.addEventListener('dragging-changed', (event) => {
    isDragging = event.value;
    orbitControls.enabled = !event.value;
  });

  transformControls.addEventListener('change', () => {
    if (!isDragging) return;
    if (activeCollisionPlaneIndex === null || !transformControls) return;

    const helpers = getCollisionPlaneHelpers();
    if (activeCollisionPlaneIndex >= helpers.length) return;

    const helper = helpers[activeCollisionPlaneIndex];
    if (onPositionChangeCallback) {
      onPositionChangeCallback(activeCollisionPlaneIndex, helper.position);
    }
  });

  domElement.addEventListener('pointerdown', onPointerDown);

  isInitialized = true;
};

export const disposeCollisionPlaneInteraction = (): void => {
  if (!isInitialized) return;

  deselectCollisionPlane();

  const domElement = getRendererDomElement();
  domElement.removeEventListener('pointerdown', onPointerDown);

  if (transformControls) {
    transformControls.dispose();
    transformControls = null;
  }

  scene = null;
  onPositionChangeCallback = null;
  activeCollisionPlaneIndex = null;
  isInitialized = false;
};

export const getActiveCollisionPlaneIndex = (): number | null => activeCollisionPlaneIndex;
export const isCollisionPlaneDragging = (): boolean => isDragging;
