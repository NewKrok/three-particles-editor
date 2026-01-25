import * as THREE from 'three';

type ShapeConfig = {
  shape: string;
  sphere?: {
    radius: number;
    radiusThickness: number;
    arc: number;
  };
  cone?: {
    angle: number;
    radius: number;
    radiusThickness: number;
    arc: number;
  };
  box?: {
    emitFrom: string;
    scale: { x: number; y: number; z: number };
  };
  circle?: {
    radius: number;
    radiusThickness: number;
    arc: number;
  };
  rectangle?: {
    rotation: { x: number; y: number };
    scale: { x: number; y: number };
  };
};

const HELPER_COLOR = 0x00ff00;
const HELPER_COLOR_INNER = 0x00aa00;
const SEGMENTS = 64;

let currentShapeHelper: THREE.Object3D | null = null;

/**
 * Creates arc geometry in XY plane (matching three-particles emission)
 * Arc starts at X+ axis and goes counter-clockwise
 */
const createArcGeometryXY = (
  radius: number,
  arc: number,
  segments: number
): THREE.BufferGeometry => {
  const points: THREE.Vector3[] = [];
  const arcRad = THREE.MathUtils.degToRad(arc);
  const segmentCount = Math.max(Math.ceil((Math.abs(arc) / 360) * segments), 2);

  for (let i = 0; i <= segmentCount; i++) {
    const theta = (i / segmentCount) * arcRad;
    // XY plane: x = cos(theta), y = sin(theta), z = 0
    points.push(new THREE.Vector3(Math.cos(theta) * radius, Math.sin(theta) * radius, 0));
  }

  return new THREE.BufferGeometry().setFromPoints(points);
};

/**
 * Sphere shape helper
 * - Particles emit from XY plane spherical coordinates
 * - Arc controls azimuthal angle (around Y-like rotation but in spherical coords)
 * - radiusThickness: 0 = shell only, 1 = full volume
 */
const createSphereHelper = (config: ShapeConfig['sphere']): THREE.Object3D => {
  const group = new THREE.Group();
  const { radius, radiusThickness, arc } = config!;

  const material = new THREE.LineBasicMaterial({ color: HELPER_COLOR });
  const materialInner = new THREE.LineBasicMaterial({ color: HELPER_COLOR_INNER });

  // Outer sphere wireframe
  // Equator circle (XY plane)
  const equatorGeom = createArcGeometryXY(radius, arc, SEGMENTS);
  group.add(new THREE.Line(equatorGeom, material));

  // Vertical circles for better visualization
  const arcRad = THREE.MathUtils.degToRad(arc);

  // Create vertical half-circles at start and end of arc
  const createVerticalArc = (angle: number): THREE.BufferGeometry => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= SEGMENTS / 2; i++) {
      const phi = (i / (SEGMENTS / 2)) * Math.PI;
      const x = Math.cos(angle) * Math.sin(phi) * radius;
      const y = Math.sin(angle) * Math.sin(phi) * radius;
      const z = Math.cos(phi) * radius;
      points.push(new THREE.Vector3(x, y, z));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  };

  // Vertical arc at theta = 0
  group.add(new THREE.Line(createVerticalArc(0), material));

  // Vertical arc at theta = arc (if not full sphere)
  if (Math.abs(arc) < 360 && Math.abs(arc) > 0) {
    group.add(new THREE.Line(createVerticalArc(arcRad), material));
  }

  // Add XZ plane circle for reference
  const xzCirclePoints: THREE.Vector3[] = [];
  for (let i = 0; i <= SEGMENTS; i++) {
    const angle = (i / SEGMENTS) * Math.PI * 2;
    xzCirclePoints.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
  }
  const xzCircleGeom = new THREE.BufferGeometry().setFromPoints(xzCirclePoints);
  group.add(new THREE.Line(xzCircleGeom, material));

  // Inner sphere (if radiusThickness < 1)
  if (radiusThickness < 1) {
    const innerRadius = radius * (1 - radiusThickness);

    // Inner equator
    const innerEquatorGeom = createArcGeometryXY(innerRadius, arc, SEGMENTS);
    group.add(new THREE.Line(innerEquatorGeom, materialInner));

    // Inner vertical arc
    const createInnerVerticalArc = (angle: number): THREE.BufferGeometry => {
      const points: THREE.Vector3[] = [];
      for (let i = 0; i <= SEGMENTS / 2; i++) {
        const phi = (i / (SEGMENTS / 2)) * Math.PI;
        const x = Math.cos(angle) * Math.sin(phi) * innerRadius;
        const y = Math.sin(angle) * Math.sin(phi) * innerRadius;
        const z = Math.cos(phi) * innerRadius;
        points.push(new THREE.Vector3(x, y, z));
      }
      return new THREE.BufferGeometry().setFromPoints(points);
    };

    group.add(new THREE.Line(createInnerVerticalArc(0), materialInner));

    // Inner XZ plane circle
    const innerXzCirclePoints: THREE.Vector3[] = [];
    for (let i = 0; i <= SEGMENTS; i++) {
      const angle = (i / SEGMENTS) * Math.PI * 2;
      innerXzCirclePoints.push(
        new THREE.Vector3(Math.cos(angle) * innerRadius, 0, Math.sin(angle) * innerRadius)
      );
    }
    const innerXzCircleGeom = new THREE.BufferGeometry().setFromPoints(innerXzCirclePoints);
    group.add(new THREE.Line(innerXzCircleGeom, materialInner));
  }

  return group;
};

/**
 * Cone shape helper
 * - Base circle in XY plane (z = 0)
 * - Particles emit upward along Z axis
 * - angle controls the spread angle
 * - arc controls how much of the circle is used
 */
const createConeHelper = (config: ShapeConfig['cone']): THREE.Object3D => {
  const group = new THREE.Group();
  const { angle, radius, radiusThickness, arc } = config!;
  const material = new THREE.LineBasicMaterial({ color: HELPER_COLOR });
  const materialInner = new THREE.LineBasicMaterial({ color: HELPER_COLOR_INNER });

  // Base circle in XY plane
  const baseGeom = createArcGeometryXY(radius, arc, SEGMENTS);
  group.add(new THREE.Line(baseGeom, material));

  // Cone visualization height
  const coneHeight = 1;
  // Calculate top radius based on angle
  const topRadius = radius + Math.tan(THREE.MathUtils.degToRad(angle)) * coneHeight;

  // Top circle at z = coneHeight
  const topPoints: THREE.Vector3[] = [];
  const arcRad = THREE.MathUtils.degToRad(arc);
  const segmentCount = Math.max(Math.ceil((Math.abs(arc) / 360) * SEGMENTS), 2);

  for (let i = 0; i <= segmentCount; i++) {
    const theta = (i / segmentCount) * arcRad;
    topPoints.push(
      new THREE.Vector3(Math.cos(theta) * topRadius, Math.sin(theta) * topRadius, coneHeight)
    );
  }
  const topGeom = new THREE.BufferGeometry().setFromPoints(topPoints);
  group.add(new THREE.Line(topGeom, material));

  // Connecting lines from base to top
  const lineCount = Math.abs(arc) >= 360 ? 8 : Math.max(2, Math.ceil(Math.abs(arc) / 45) + 1);

  for (let i = 0; i < lineCount; i++) {
    const t = Math.abs(arc) >= 360 ? i / lineCount : i / (lineCount - 1);
    const currentAngle = t * arcRad;

    const linePoints = [
      new THREE.Vector3(Math.cos(currentAngle) * radius, Math.sin(currentAngle) * radius, 0),
      new THREE.Vector3(
        Math.cos(currentAngle) * topRadius,
        Math.sin(currentAngle) * topRadius,
        coneHeight
      ),
    ];
    const lineGeom = new THREE.BufferGeometry().setFromPoints(linePoints);
    group.add(new THREE.Line(lineGeom, material));
  }

  // Central direction arrow
  const arrowPoints = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, coneHeight * 1.3)];
  const arrowGeom = new THREE.BufferGeometry().setFromPoints(arrowPoints);
  group.add(new THREE.Line(arrowGeom, material));

  // Inner radius visualization (if radiusThickness < 1)
  if (radiusThickness < 1) {
    const innerRadius = radius * (1 - radiusThickness);
    const innerTopRadius = innerRadius + Math.tan(THREE.MathUtils.degToRad(angle)) * coneHeight;

    // Inner base circle
    const innerBaseGeom = createArcGeometryXY(innerRadius, arc, SEGMENTS);
    group.add(new THREE.Line(innerBaseGeom, materialInner));

    // Inner top circle
    const innerTopPoints: THREE.Vector3[] = [];
    for (let i = 0; i <= segmentCount; i++) {
      const theta = (i / segmentCount) * arcRad;
      innerTopPoints.push(
        new THREE.Vector3(
          Math.cos(theta) * innerTopRadius,
          Math.sin(theta) * innerTopRadius,
          coneHeight
        )
      );
    }
    const innerTopGeom = new THREE.BufferGeometry().setFromPoints(innerTopPoints);
    group.add(new THREE.Line(innerTopGeom, materialInner));
  }

  return group;
};

/**
 * Box shape helper
 * - Centered at origin
 * - Particles emit along +Z axis
 */
const createBoxHelper = (config: ShapeConfig['box']): THREE.Object3D => {
  const group = new THREE.Group();
  const { scale } = config!;
  const material = new THREE.LineBasicMaterial({ color: HELPER_COLOR });

  const halfX = scale.x / 2;
  const halfY = scale.y / 2;
  const halfZ = scale.z / 2;

  // Bottom face (z = -halfZ)
  const bottomPoints = [
    new THREE.Vector3(-halfX, -halfY, -halfZ),
    new THREE.Vector3(halfX, -halfY, -halfZ),
    new THREE.Vector3(halfX, halfY, -halfZ),
    new THREE.Vector3(-halfX, halfY, -halfZ),
    new THREE.Vector3(-halfX, -halfY, -halfZ),
  ];
  const bottomGeom = new THREE.BufferGeometry().setFromPoints(bottomPoints);
  group.add(new THREE.Line(bottomGeom, material));

  // Top face (z = +halfZ)
  const topPoints = [
    new THREE.Vector3(-halfX, -halfY, halfZ),
    new THREE.Vector3(halfX, -halfY, halfZ),
    new THREE.Vector3(halfX, halfY, halfZ),
    new THREE.Vector3(-halfX, halfY, halfZ),
    new THREE.Vector3(-halfX, -halfY, halfZ),
  ];
  const topGeom = new THREE.BufferGeometry().setFromPoints(topPoints);
  group.add(new THREE.Line(topGeom, material));

  // Vertical edges
  const edges = [
    [new THREE.Vector3(-halfX, -halfY, -halfZ), new THREE.Vector3(-halfX, -halfY, halfZ)],
    [new THREE.Vector3(halfX, -halfY, -halfZ), new THREE.Vector3(halfX, -halfY, halfZ)],
    [new THREE.Vector3(halfX, halfY, -halfZ), new THREE.Vector3(halfX, halfY, halfZ)],
    [new THREE.Vector3(-halfX, halfY, -halfZ), new THREE.Vector3(-halfX, halfY, halfZ)],
  ];

  edges.forEach(([start, end]) => {
    const edgeGeom = new THREE.BufferGeometry().setFromPoints([start, end]);
    group.add(new THREE.Line(edgeGeom, material));
  });

  return group;
};

/**
 * Circle shape helper
 * - Circle in XY plane (z = 0)
 * - Particles emit radially outward in XY plane
 * - arc controls how much of the circle is used
 */
const createCircleHelper = (config: ShapeConfig['circle']): THREE.Object3D => {
  const group = new THREE.Group();
  const { radius, radiusThickness, arc } = config!;
  const material = new THREE.LineBasicMaterial({ color: HELPER_COLOR });
  const materialInner = new THREE.LineBasicMaterial({ color: HELPER_COLOR_INNER });

  // Outer circle in XY plane
  const circleGeom = createArcGeometryXY(radius, arc, SEGMENTS);
  group.add(new THREE.Line(circleGeom, material));

  // Arc boundary lines if not full circle
  if (Math.abs(arc) < 360 && Math.abs(arc) > 0) {
    const arcRad = THREE.MathUtils.degToRad(arc);

    // Line from center to start (theta = 0)
    const startLinePoints = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(radius, 0, 0)];
    const startLineGeom = new THREE.BufferGeometry().setFromPoints(startLinePoints);
    group.add(new THREE.Line(startLineGeom, material));

    // Line from center to end (theta = arc)
    const endLinePoints = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(Math.cos(arcRad) * radius, Math.sin(arcRad) * radius, 0),
    ];
    const endLineGeom = new THREE.BufferGeometry().setFromPoints(endLinePoints);
    group.add(new THREE.Line(endLineGeom, material));
  }

  // Inner circle (if radiusThickness < 1)
  if (radiusThickness < 1) {
    const innerRadius = radius * (1 - radiusThickness);
    const innerCircleGeom = createArcGeometryXY(innerRadius, arc, SEGMENTS);
    group.add(new THREE.Line(innerCircleGeom, materialInner));

    // Inner arc boundary lines
    if (Math.abs(arc) < 360 && Math.abs(arc) > 0) {
      const arcRad = THREE.MathUtils.degToRad(arc);

      const innerStartLinePoints = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(innerRadius, 0, 0),
      ];
      const innerStartLineGeom = new THREE.BufferGeometry().setFromPoints(innerStartLinePoints);
      group.add(new THREE.Line(innerStartLineGeom, materialInner));

      const innerEndLinePoints = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(Math.cos(arcRad) * innerRadius, Math.sin(arcRad) * innerRadius, 0),
      ];
      const innerEndLineGeom = new THREE.BufferGeometry().setFromPoints(innerEndLinePoints);
      group.add(new THREE.Line(innerEndLineGeom, materialInner));
    }
  }

  return group;
};

/**
 * Rectangle shape helper
 * - Rectangle in XY plane (z = 0) before rotation
 * - rotation.x rotates around X axis
 * - rotation.y rotates around Y axis
 * - Particles emit along +Z axis
 */
const createRectangleHelper = (config: ShapeConfig['rectangle']): THREE.Object3D => {
  const group = new THREE.Group();
  const { scale, rotation } = config!;
  const material = new THREE.LineBasicMaterial({ color: HELPER_COLOR });

  const halfX = scale.x / 2;
  const halfY = scale.y / 2;

  // Rectangle corners in local XY plane
  const corners = [
    new THREE.Vector3(-halfX, -halfY, 0),
    new THREE.Vector3(halfX, -halfY, 0),
    new THREE.Vector3(halfX, halfY, 0),
    new THREE.Vector3(-halfX, halfY, 0),
  ];

  // Apply rotation as per three-particles:
  // position.x = xOffset * cos(rotationY)
  // position.y = yOffset * cos(rotationX)
  // position.z = xOffset * sin(rotationY) - yOffset * sin(rotationX)
  const rotationX = THREE.MathUtils.degToRad(rotation.x);
  const rotationY = THREE.MathUtils.degToRad(rotation.y);

  const transformedCorners = corners.map((corner) => {
    const xOffset = corner.x;
    const yOffset = corner.y;
    return new THREE.Vector3(
      xOffset * Math.cos(rotationY),
      yOffset * Math.cos(rotationX),
      xOffset * Math.sin(rotationY) - yOffset * Math.sin(rotationX)
    );
  });

  // Close the rectangle
  const rectPoints = [...transformedCorners, transformedCorners[0]];
  const rectGeom = new THREE.BufferGeometry().setFromPoints(rectPoints);
  group.add(new THREE.Line(rectGeom, material));

  return group;
};

export const createShapeHelper = (shapeConfig: ShapeConfig): THREE.Object3D | null => {
  switch (shapeConfig.shape) {
    case 'SPHERE':
      return createSphereHelper(shapeConfig.sphere);
    case 'CONE':
      return createConeHelper(shapeConfig.cone);
    case 'BOX':
      return createBoxHelper(shapeConfig.box);
    case 'CIRCLE':
      return createCircleHelper(shapeConfig.circle);
    case 'RECTANGLE':
      return createRectangleHelper(shapeConfig.rectangle);
    default:
      return null;
  }
};

export const updateShapeHelper = (
  container: THREE.Object3D,
  shapeConfig: ShapeConfig,
  visible: boolean
): void => {
  // Remove existing helper
  if (currentShapeHelper) {
    container.remove(currentShapeHelper);
    disposeObject(currentShapeHelper);
    currentShapeHelper = null;
  }

  if (!visible) return;

  // Create new helper
  currentShapeHelper = createShapeHelper(shapeConfig);
  if (currentShapeHelper) {
    container.add(currentShapeHelper);
  }
};

export const disposeShapeHelper = (container: THREE.Object3D): void => {
  if (currentShapeHelper) {
    container.remove(currentShapeHelper);
    disposeObject(currentShapeHelper);
    currentShapeHelper = null;
  }
};

const disposeObject = (obj: THREE.Object3D): void => {
  obj.traverse((child) => {
    if (child instanceof THREE.Line) {
      child.geometry.dispose();
      if (child.material instanceof THREE.Material) {
        child.material.dispose();
      }
    }
  });
};
