import * as THREE from 'three';

const POINT_COLOR = 0xff8800;
const DIRECTIONAL_COLOR = 0x4488ff;
const INACTIVE_COLOR = 0x666666;
const SEGMENTS = 32;

type ForceFieldConfigPlain = {
  isActive?: boolean;
  type?: string;
  position?: { x: number; y: number; z: number };
  direction?: { x: number; y: number; z: number };
  strength?: number | { min?: number; max?: number };
  range?: number;
  falloff?: string;
};

let forceFieldHelpers: THREE.Object3D[] = [];
let forceFieldCenterMeshes: THREE.Mesh[] = [];

const createSphereWireframe = (radius: number, color: number): THREE.Object3D => {
  const group = new THREE.Group();
  const material = new THREE.LineBasicMaterial({ color });

  // XY circle
  const xyPoints: THREE.Vector3[] = [];
  for (let i = 0; i <= SEGMENTS; i++) {
    const angle = (i / SEGMENTS) * Math.PI * 2;
    xyPoints.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0));
  }
  group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(xyPoints), material));

  // XZ circle
  const xzPoints: THREE.Vector3[] = [];
  for (let i = 0; i <= SEGMENTS; i++) {
    const angle = (i / SEGMENTS) * Math.PI * 2;
    xzPoints.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
  }
  group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(xzPoints), material));

  // YZ circle
  const yzPoints: THREE.Vector3[] = [];
  for (let i = 0; i <= SEGMENTS; i++) {
    const angle = (i / SEGMENTS) * Math.PI * 2;
    yzPoints.push(new THREE.Vector3(0, Math.cos(angle) * radius, Math.sin(angle) * radius));
  }
  group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(yzPoints), material));

  return group;
};

const createPointHelper = (
  config: ForceFieldConfigPlain,
  index: number
): { group: THREE.Object3D; centerMesh: THREE.Mesh } => {
  const group = new THREE.Group();
  const isActive = config.isActive !== false;
  const color = isActive ? POINT_COLOR : INACTIVE_COLOR;
  const pos = config.position || { x: 0, y: 0, z: 0 };
  const range = config.range ?? 5;

  // Range wireframe sphere
  if (range !== Infinity && range > 0) {
    group.add(createSphereWireframe(range, color));
  }

  // Center sphere (clickable for dragging)
  const centerGeom = new THREE.SphereGeometry(0.15, 12, 12);
  const centerMat = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.8,
    depthTest: false,
  });
  const centerMesh = new THREE.Mesh(centerGeom, centerMat);
  centerMesh.renderOrder = 999;
  centerMesh.userData.forceFieldIndex = index;
  group.add(centerMesh);

  // Strength indicator arrows (inward for attract, outward for repel)
  const strength =
    typeof config.strength === 'number'
      ? config.strength
      : typeof config.strength === 'object'
        ? ((config.strength.min ?? 1) + (config.strength.max ?? 1)) / 2
        : 1;

  const arrowLength = 0.4;
  const arrowDir = strength >= 0 ? -1 : 1; // inward for positive (attract), outward for negative (repel)
  const arrowMaterial = new THREE.LineBasicMaterial({ color });

  const directions = [
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(-1, 0, 0),
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(0, -1, 0),
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3(0, 0, -1),
  ];

  const indicatorDist = 0.35;
  directions.forEach((dir) => {
    const start = dir.clone().multiplyScalar(indicatorDist);
    const end = start.clone().add(dir.clone().multiplyScalar(arrowLength * arrowDir));
    const points = [start, end];
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), arrowMaterial));
  });

  group.position.set(pos.x, pos.y, pos.z);
  return { group, centerMesh };
};

const createDirectionalHelper = (
  config: ForceFieldConfigPlain,
  index: number
): { group: THREE.Object3D; centerMesh: THREE.Mesh } => {
  const group = new THREE.Group();
  const isActive = config.isActive !== false;
  const color = isActive ? DIRECTIONAL_COLOR : INACTIVE_COLOR;
  const dir = config.direction || { x: 0, y: 1, z: 0 };
  const dirVec = new THREE.Vector3(dir.x, dir.y, dir.z).normalize();

  // Arrow helper
  const arrowHelper = new THREE.ArrowHelper(
    dirVec,
    new THREE.Vector3(0, 0, 0),
    1.5,
    color,
    0.3,
    0.15
  );
  group.add(arrowHelper);

  // Center sphere (clickable for dragging)
  const centerGeom = new THREE.SphereGeometry(0.15, 12, 12);
  const centerMat = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.8,
    depthTest: false,
  });
  const centerMesh = new THREE.Mesh(centerGeom, centerMat);
  centerMesh.renderOrder = 999;
  centerMesh.userData.forceFieldIndex = index;
  group.add(centerMesh);

  // Position the group at origin (directional doesn't have a position in the same sense)
  const pos = config.position || { x: 0, y: 0, z: 0 };
  group.position.set(pos.x, pos.y, pos.z);

  return { group, centerMesh };
};

export const createForceFieldHelpers = (
  scene: THREE.Scene,
  forceFields: ForceFieldConfigPlain[]
): void => {
  disposeForceFieldHelpers(scene);

  forceFields.forEach((config, index) => {
    const type = config.type || 'POINT';
    const { group, centerMesh } =
      type === 'DIRECTIONAL'
        ? createDirectionalHelper(config, index)
        : createPointHelper(config, index);

    scene.add(group);
    forceFieldHelpers.push(group);
    forceFieldCenterMeshes.push(centerMesh);
  });
};

export const updateForceFieldHelpers = (
  scene: THREE.Scene,
  forceFields: ForceFieldConfigPlain[]
): void => {
  createForceFieldHelpers(scene, forceFields);
};

export const disposeForceFieldHelpers = (scene: THREE.Scene): void => {
  forceFieldHelpers.forEach((helper) => {
    scene.remove(helper);
    helper.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (child.material instanceof THREE.Material) {
          child.material.dispose();
        }
      }
      if (child instanceof THREE.Line) {
        child.geometry.dispose();
        if (child.material instanceof THREE.Material) {
          child.material.dispose();
        }
      }
    });
  });
  forceFieldHelpers = [];
  forceFieldCenterMeshes = [];
};

export const getForceFieldCenterMeshes = (): THREE.Mesh[] => forceFieldCenterMeshes;
export const getForceFieldHelpers = (): THREE.Object3D[] => forceFieldHelpers;
