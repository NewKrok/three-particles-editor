import * as THREE from 'three';

const INACTIVE_COLOR = 0x666666;
const PLANE_SIZE = 3;
const GRID_DIVISIONS = 6;

type CollisionPlaneConfigPlain = {
  isActive?: boolean;
  position?: { x: number; y: number; z: number };
  normal?: { x: number; y: number; z: number };
  mode?: string;
};

let collisionPlaneHelpers: THREE.Object3D[] = [];
let collisionPlaneCenterMeshes: THREE.Mesh[] = [];

const MODE_COLORS: Record<string, number> = {
  KILL: 0xff4444,
  CLAMP: 0xffaa22,
  BOUNCE: 0x44cc88,
};

const createPlaneHelper = (
  config: CollisionPlaneConfigPlain,
  index: number
): { group: THREE.Object3D; centerMesh: THREE.Mesh } => {
  const group = new THREE.Group();
  const isActive = config.isActive !== false;
  const mode = config.mode || 'KILL';
  const color = isActive ? (MODE_COLORS[mode] ?? 0x44cc88) : INACTIVE_COLOR;
  const pos = config.position || { x: 0, y: 0, z: 0 };
  const normal = config.normal || { x: 0, y: 1, z: 0 };
  const normalVec = new THREE.Vector3(normal.x, normal.y, normal.z).normalize();

  // Grid plane
  const gridHelper = new THREE.GridHelper(PLANE_SIZE, GRID_DIVISIONS, color, color);
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = 0.35;

  // Rotate grid so its "up" aligns with the plane normal
  const up = new THREE.Vector3(0, 1, 0);
  if (Math.abs(normalVec.dot(up)) < 0.9999) {
    const quaternion = new THREE.Quaternion().setFromUnitVectors(up, normalVec);
    gridHelper.quaternion.copy(quaternion);
  } else if (normalVec.y < 0) {
    gridHelper.rotation.z = Math.PI;
  }

  group.add(gridHelper);

  // Semi-transparent fill plane
  const planeGeom = new THREE.PlaneGeometry(PLANE_SIZE, PLANE_SIZE);
  const planeMat = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.08,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const planeMesh = new THREE.Mesh(planeGeom, planeMat);

  // PlaneGeometry faces +Z by default, rotate to face along normal
  const planeUp = new THREE.Vector3(0, 0, 1);
  if (Math.abs(normalVec.dot(planeUp)) < 0.9999) {
    const quaternion = new THREE.Quaternion().setFromUnitVectors(planeUp, normalVec);
    planeMesh.quaternion.copy(quaternion);
  } else if (normalVec.z < 0) {
    planeMesh.rotation.y = Math.PI;
  }

  group.add(planeMesh);

  // Normal arrow
  const arrowHelper = new THREE.ArrowHelper(
    normalVec,
    new THREE.Vector3(0, 0, 0),
    1.2,
    color,
    0.25,
    0.12
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
  centerMesh.userData.collisionPlaneIndex = index;
  group.add(centerMesh);

  // Mode-specific indicators
  if (mode === 'BOUNCE') {
    // Bounce indicator: a second arrow pointing back
    const bounceDir = normalVec.clone().negate();
    const bounceArrow = new THREE.ArrowHelper(
      bounceDir,
      normalVec.clone().multiplyScalar(0.6),
      0.5,
      color,
      0.15,
      0.08
    );
    group.add(bounceArrow);
  } else if (mode === 'CLAMP') {
    // Small ring on the plane surface
    const ringGeom = new THREE.RingGeometry(0.2, 0.25, 16);
    const ringMat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const ring = new THREE.Mesh(ringGeom, ringMat);
    const ringUp = new THREE.Vector3(0, 0, 1);
    if (Math.abs(normalVec.dot(ringUp)) < 0.9999) {
      const quaternion = new THREE.Quaternion().setFromUnitVectors(ringUp, normalVec);
      ring.quaternion.copy(quaternion);
    }
    group.add(ring);
  }

  group.position.set(pos.x, pos.y, pos.z);
  return { group, centerMesh };
};

export const createCollisionPlaneHelpers = (
  scene: THREE.Scene,
  collisionPlanes: CollisionPlaneConfigPlain[]
): void => {
  disposeCollisionPlaneHelpers(scene);

  collisionPlanes.forEach((config, index) => {
    const { group, centerMesh } = createPlaneHelper(config, index);
    scene.add(group);
    collisionPlaneHelpers.push(group);
    collisionPlaneCenterMeshes.push(centerMesh);
  });
};

export const disposeCollisionPlaneHelpers = (scene: THREE.Scene): void => {
  collisionPlaneHelpers.forEach((helper) => {
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
  collisionPlaneHelpers = [];
  collisionPlaneCenterMeshes = [];
};

export const getCollisionPlaneCenterMeshes = (): THREE.Mesh[] => collisionPlaneCenterMeshes;
export const getCollisionPlaneHelpers = (): THREE.Object3D[] => collisionPlaneHelpers;
