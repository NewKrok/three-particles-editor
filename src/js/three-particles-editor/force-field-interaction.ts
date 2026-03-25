import * as THREE from 'three';

import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { getCamera, getRendererDomElement, getOrbitControls } from './world';
import { getForceFieldCenterMeshes, getForceFieldHelpers } from './force-field-helper';

let transformControls: TransformControls | null = null;
let activeForceFieldIndex: number | null = null;
let onPositionChangeCallback: ((index: number, position: THREE.Vector3) => void) | null = null;
let isInitialized = false;
let isDragging = false;
let scene: THREE.Scene | null = null;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const hitsTransformControls = (event: PointerEvent): boolean => {
  if (!transformControls || activeForceFieldIndex === null || !scene) return false;

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

  // If clicking on the TransformControls gizmo, don't deselect
  if (hitsTransformControls(event)) return;

  const domElement = getRendererDomElement();
  const rect = domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  const camera = getCamera();
  raycaster.setFromCamera(mouse, camera);

  const centerMeshes = getForceFieldCenterMeshes();
  if (centerMeshes.length === 0) return;

  const intersects = raycaster.intersectObjects(centerMeshes, false);

  if (intersects.length > 0) {
    const mesh = intersects[0].object as THREE.Mesh;
    const index = mesh.userData.forceFieldIndex;
    if (index !== undefined) {
      selectForceField(index);
      event.stopPropagation();
    }
  } else {
    // Click on empty space — deselect
    deselectForceField();
  }
};

const selectForceField = (index: number): void => {
  if (!transformControls || !scene) return;

  const helpers = getForceFieldHelpers();
  if (index < 0 || index >= helpers.length) return;

  activeForceFieldIndex = index;
  const helper = helpers[index];

  transformControls.attach(helper);
  scene.add(transformControls.getHelper());
};

export const deselectForceField = (): void => {
  if (!transformControls) return;
  if (activeForceFieldIndex === null) return;

  transformControls.detach();
  activeForceFieldIndex = null;

  if (scene) {
    scene.remove(transformControls.getHelper());
  }
};

export const initForceFieldInteraction = (
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

  // Disable orbit controls while dragging
  transformControls.addEventListener('dragging-changed', (event) => {
    isDragging = event.value;
    orbitControls.enabled = !event.value;
  });

  // Sync position on every drag movement — realtime update
  transformControls.addEventListener('change', () => {
    if (!isDragging) return;
    if (activeForceFieldIndex === null || !transformControls) return;

    const helpers = getForceFieldHelpers();
    if (activeForceFieldIndex >= helpers.length) return;

    const helper = helpers[activeForceFieldIndex];
    if (onPositionChangeCallback) {
      onPositionChangeCallback(activeForceFieldIndex, helper.position);
    }
  });

  domElement.addEventListener('pointerdown', onPointerDown);

  isInitialized = true;
};

export const disposeForceFieldInteraction = (): void => {
  if (!isInitialized) return;

  deselectForceField();

  const domElement = getRendererDomElement();
  domElement.removeEventListener('pointerdown', onPointerDown);

  if (transformControls) {
    transformControls.dispose();
    transformControls = null;
  }

  scene = null;
  onPositionChangeCallback = null;
  activeForceFieldIndex = null;
  isInitialized = false;
};

export const getActiveForceFieldIndex = (): number | null => activeForceFieldIndex;
export const isForceFieldDragging = (): boolean => isDragging;
