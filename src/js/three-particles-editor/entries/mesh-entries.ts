import * as THREE from 'three';
import type { GUI } from 'three/examples/jsm/libs/lil-gui.module.min';

type MeshEntriesParams = {
  parentFolder: GUI;
  particleSystemConfig: any;
  recreateParticleSystem: () => void;
};

type MeshEntriesResult = {
  onReset: () => void;
  onParticleSystemChange: () => void;
  onUpdate: () => void;
};

export const MeshGeometryType = {
  BOX: 'BOX',
  SPHERE: 'SPHERE',
  ICOSAHEDRON: 'ICOSAHEDRON',
  TORUS: 'TORUS',
  TORUS_KNOT: 'TORUS_KNOT',
  CYLINDER: 'CYLINDER',
  CONE: 'CONE',
  DODECAHEDRON: 'DODECAHEDRON',
  OCTAHEDRON: 'OCTAHEDRON',
  TETRAHEDRON: 'TETRAHEDRON',
} as const;

type MeshGeometryTypeValue = (typeof MeshGeometryType)[keyof typeof MeshGeometryType];

export const createGeometry = (type: MeshGeometryTypeValue): THREE.BufferGeometry => {
  switch (type) {
    case MeshGeometryType.BOX:
      return new THREE.BoxGeometry(1, 1, 1);
    case MeshGeometryType.SPHERE:
      return new THREE.SphereGeometry(0.5, 16, 12);
    case MeshGeometryType.ICOSAHEDRON:
      return new THREE.IcosahedronGeometry(0.5, 0);
    case MeshGeometryType.TORUS:
      return new THREE.TorusGeometry(0.4, 0.15, 12, 24);
    case MeshGeometryType.TORUS_KNOT:
      return new THREE.TorusKnotGeometry(0.35, 0.1, 48, 8);
    case MeshGeometryType.CYLINDER:
      return new THREE.CylinderGeometry(0.5, 0.5, 1, 16);
    case MeshGeometryType.CONE:
      return new THREE.ConeGeometry(0.5, 1, 16);
    case MeshGeometryType.DODECAHEDRON:
      return new THREE.DodecahedronGeometry(0.5, 0);
    case MeshGeometryType.OCTAHEDRON:
      return new THREE.OctahedronGeometry(0.5, 0);
    case MeshGeometryType.TETRAHEDRON:
      return new THREE.TetrahedronGeometry(0.5, 0);
    default:
      return new THREE.BoxGeometry(1, 1, 1);
  }
};

const ensureMeshConfig = (particleSystemConfig: any): void => {
  if (!particleSystemConfig.renderer.mesh) {
    particleSystemConfig.renderer.mesh = {};
  }

  const mesh = particleSystemConfig.renderer.mesh;
  if (!mesh.geometryType) mesh.geometryType = MeshGeometryType.BOX;
  mesh.geometry = createGeometry(mesh.geometryType);
};

export const createMeshEntries = ({
  parentFolder,
  particleSystemConfig,
  recreateParticleSystem,
}: MeshEntriesParams): MeshEntriesResult => {
  const folder = parentFolder.addFolder('Mesh');
  folder.close();

  let controllers: any[] = [];

  const rebuild = (): void => {
    controllers.forEach((controller) => controller.destroy());
    controllers = [];

    const isMesh = particleSystemConfig.renderer.rendererType === 'MESH';

    if (!isMesh) {
      controllers.push(
        folder
          .add({ info: 'Set Renderer Type to MESH to configure' }, 'info')
          .name('Info')
          .disable()
      );
      return;
    }

    ensureMeshConfig(particleSystemConfig);
    const mesh = particleSystemConfig.renderer.mesh;

    controllers.push(
      folder
        .add(mesh, 'geometryType', Object.values(MeshGeometryType))
        .name('Geometry')
        .onChange((value: MeshGeometryTypeValue) => {
          mesh.geometry = createGeometry(value);
          recreateParticleSystem();
        })
        .listen()
    );
  };

  rebuild();

  let lastRendererType = particleSystemConfig.renderer.rendererType || 'POINTS';

  return {
    onReset: rebuild,
    onParticleSystemChange: (): void => {
      const currentRendererType = particleSystemConfig.renderer.rendererType || 'POINTS';
      if (lastRendererType !== currentRendererType) {
        lastRendererType = currentRendererType;
        rebuild();
      }
    },
    onUpdate: (): void => {},
  };
};
