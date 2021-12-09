import * as THREE from "three/build/three.module";

import {
  Shape,
  SimulationSpace,
  createParticleSystem,
  destroyParticleSystem,
  updateParticleSystems,
} from "@newkrok/three-particles/src/js/effects/three-particles.js";
import { getTexture, initAssets } from "./three-particles-editor/assets.js";

import { GUI } from "three/examples/jsm/libs/lil-gui.module.min";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
import { TextureId } from "./three-particles-editor/texture-config.js";

let scene, renderer, camera, stats, particleSystem, clock;
let simulateMovements = false;
let showLocalAxes = false;
const worldAxesHelper = new THREE.AxesHelper(5);
const localAxesHelper = new THREE.AxesHelper(1);

export const createParticleSystemEditor = (targetQuery) => {
  const container = document.querySelector(targetQuery);

  clock = new THREE.Clock();

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
  hemiLight.position.set(0, 20, 0);
  scene.add(hemiLight);

  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50, 50, 50),
    new THREE.MeshPhongMaterial({
      color: 0x111111,
      depthWrite: false,
      wireframe: true,
    })
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.receiveShadow = true;
  scene.add(mesh);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    100
  );
  camera.position.set(0, 0, 6);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.target.set(0, 0, 0);
  controls.update();

  stats = new Stats();
  container.appendChild(stats.dom);

  window.addEventListener("resize", onWindowResize);

  initAssets(() => {
    createPanel();
    animate();
  });
};

let particleSystemSetting = {
  duration: 5.0,
  looping: true,
  startDelay: { min: 0.0, max: 0.0 },
  startLifeTime: { min: 5.0, max: 5.0 },
  startSpeed: { min: 1.0, max: 1.0 },
  startSize: { min: 1.0, max: 1.0 },
  startRotation: { min: 0.0, max: 0.0 },
  startColor: {
    min: { r: 1.0, g: 1.0, b: 1.0 },
    max: { r: 1.0, g: 1.0, b: 1.0 },
  },
  startOpacity: { min: 1.0, max: 1.0 },
  gravity: 0,
  maxParticles: 100.0,
  emission: {
    rateOverTime: 10.0,
    rateOverDistance: 0.0,
  },
  shape: {
    shape: Shape.SPHERE,
    radius: 1,
    radiusThickness: 1,
    arc: 360,
  },
  map: null,
  textureSheetAnimation: { tiles: null },
};

const createMinMaxFloatFolderEntry = ({
  parentFolder,
  propertyName,
  rootPropertyName,
  defaultMin,
  min,
  defaultMax,
  max,
  step,
}) => {
  const folder = parentFolder.addFolder(propertyName);
  const folderConfig = { min: defaultMin, max: defaultMax };
  folder
    .add(folderConfig, "min", min, max, step)
    .onChange((v) => {
      const propRef = rootPropertyName
        ? particleSystemSetting[rootPropertyName][propertyName]
        : particleSystemSetting[propertyName];
      propRef.min = Math.min(v, propRef.max);
      folderConfig.min = propRef.min;
      recreateParticleSystem();
    })
    .listen();
  folder
    .add(folderConfig, "max", min, max, step)
    .onChange((v) => {
      const propRef = rootPropertyName
        ? particleSystemSetting[rootPropertyName][propertyName]
        : particleSystemSetting[propertyName];
      propRef.max = Math.max(v, propRef.min);
      folderConfig.max = propRef.max;
      recreateParticleSystem();
    })
    .listen();
};

const createMinMaxColorFolderEntry = ({
  parentFolder,
  propertyName,
  defaultColorA,
  defaultColorB,
}) => {
  const folder = parentFolder.addFolder(propertyName);
  const folderConfig = {
    defaultColorA: { from: { ...defaultColorA } },
    defaultColorB: { to: { ...defaultColorB } },
  };
  folder
    .addColor(folderConfig.defaultColorA, "from")
    .onChange((v) => {
      particleSystemSetting[propertyName].min = v;
      recreateParticleSystem();
    })
    .listen();
  folder
    .addColor(folderConfig.defaultColorB, "to")
    .onChange((v) => {
      particleSystemSetting[propertyName].max = v;
      recreateParticleSystem();
    })
    .listen();
};

/*const createMinMaxVector3FolderEntry = ({
  parentFolder,
  rootPropertyName,
  propertyName,
  defaultMin,
  min,
  defaultMax,
  max,
  step,
}) => {
  const folder = parentFolder.addFolder(propertyName)

  createMinMaxFloatFolderEntry({
    parentFolder: folder,
    rootPropertyName,
    propertyName: "x",
    defaultMin,
    min,
    defaultMax,
    max,
    step,
  })
  createMinMaxFloatFolderEntry({
    parentFolder: folder,
    rootPropertyName,
    propertyName: "y",
    defaultMin,
    min,
    defaultMax,
    max,
    step,
  })
  createMinMaxFloatFolderEntry({
    parentFolder: folder,
    rootPropertyName,
    propertyName: "z",
    defaultMin,
    min,
    defaultMax,
    max,
    step,
  })
}
*/
/*const createMinMaxVector4FolderEntry = ({
  parentFolder,
  rootPropertyName,
  subPropertyNames,
  defaultMin,
  min,
  defaultMax,
  max,
  step,
}) => {
  const folder = parentFolder.addFolder(rootPropertyName)

  createMinMaxFloatFolderEntry({
    parentFolder: folder,
    rootPropertyName,
    propertyName: subPropertyNames ? subPropertyNames[0] : "x",
    defaultMin,
    min,
    defaultMax,
    max,
    step,
  })
  createMinMaxFloatFolderEntry({
    parentFolder: folder,
    rootPropertyName,
    propertyName: subPropertyNames ? subPropertyNames[1] : "y",
    defaultMin,
    min,
    defaultMax,
    max,
    step,
  })
  createMinMaxFloatFolderEntry({
    parentFolder: folder,
    rootPropertyName,
    propertyName: subPropertyNames ? subPropertyNames[2] : "z",
    defaultMin,
    min,
    defaultMax,
    max,
    step,
  })
  createMinMaxFloatFolderEntry({
    parentFolder: folder,
    rootPropertyName,
    propertyName: subPropertyNames ? subPropertyNames[3] : "w",
    defaultMin,
    min,
    defaultMax,
    max,
    step,
  })
}*/

const updateLocalAxesHelper = () => {
  if (showLocalAxes) {
    particleSystem.add(localAxesHelper);
  } else {
    particleSystem.remove(localAxesHelper);
  }
};

const recreateParticleSystem = () => {
  if (particleSystem) {
    destroyParticleSystem(particleSystem);
    particleSystem = null;
  }

  const { texture, tiles } = getTexture(TextureId.Point);
  particleSystemSetting.map = texture;
  particleSystemSetting.textureSheetAnimation.tiles = tiles;

  particleSystem = createParticleSystem(particleSystemSetting);
  scene.add(particleSystem);
  updateLocalAxesHelper();
};

const createPanel = () => {
  const panel = new GUI({ width: 310, title: "Particle System Editor" });

  const helperFolder = panel.addFolder("Helper");
  helperFolder.close();
  createHelperEntries(helperFolder);

  const generalFolder = panel.addFolder("General");
  generalFolder.close();
  createGeneralEntries(generalFolder);

  const emissionFolder = panel.addFolder("Emission");
  emissionFolder.close();
  createEmissionEntries(emissionFolder);

  const shapeFolder = panel.addFolder("Shape");
  //shapeFolder.close()
  createShapeEntries(shapeFolder);
  particleSystemSetting.map = getTexture(TextureId.Point).texture;
  recreateParticleSystem();
};

const createHelperEntries = (folder) => {
  folder
    .add({ simulateMovements: false }, "simulateMovements")
    .onChange((v) => {
      simulateMovements = v;
      if (!v) {
        particleSystem.position.x = 0;
        particleSystem.position.y = 0;
        particleSystem.position.z = 0;
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
};

const createGeneralEntries = (folder) => {
  folder.add({ duration: 5.0 }, "duration", 0.0, 30, 0.01).onChange((v) => {
    particleSystemSetting.duration = v;
    recreateParticleSystem();
  });

  folder.add({ looping: true }, "looping").onChange((v) => {
    particleSystemSetting.looping = v;
    recreateParticleSystem();
  });

  createMinMaxFloatFolderEntry({
    parentFolder: folder,
    propertyName: "startDelay",
    defaultMin: 0.0,
    min: 0.0,
    defaultMax: 0.0,
    max: 30.0,
    step: 0.01,
  });

  createMinMaxFloatFolderEntry({
    parentFolder: folder,
    propertyName: "startLifeTime",
    defaultMin: 5.0,
    min: 0.01,
    defaultMax: 5.0,
    max: 30.0,
    step: 0.01,
  });

  createMinMaxFloatFolderEntry({
    parentFolder: folder,
    propertyName: "startSpeed",
    defaultMin: 5.0,
    min: 0.0,
    defaultMax: 5.0,
    max: 30.0,
    step: 0.01,
  });

  createMinMaxFloatFolderEntry({
    parentFolder: folder,
    propertyName: "startSize",
    defaultMin: 1.0,
    min: 0.0,
    defaultMax: 1.0,
    max: 100.0,
    step: 0.01,
  });

  createMinMaxFloatFolderEntry({
    parentFolder: folder,
    propertyName: "startRotation",
    defaultMin: 1.0,
    min: 0.0,
    defaultMax: 1.0,
    max: 360.0,
    step: 0.01,
  });

  createMinMaxColorFolderEntry({
    parentFolder: folder,
    propertyName: "startColor",
    defaultColorA: { r: 1, g: 1, b: 1 },
    defaultColorB: { r: 1, g: 1, b: 1 },
  });

  createMinMaxFloatFolderEntry({
    parentFolder: folder,
    propertyName: "startOpacity",
    defaultMin: 1.0,
    min: 0.0,
    defaultMax: 1.0,
    max: 1.0,
    step: 0.001,
  });

  folder.add({ gravity: 0.0 }, "gravity", 0.0, 1, 0.001).onChange((v) => {
    particleSystemSetting.gravity = v;
    recreateParticleSystem();
  });

  folder
    .add({ simulationSpace: SimulationSpace.LOCAL }, "simulationSpace", [
      SimulationSpace.LOCAL,
      SimulationSpace.WORLD,
    ])
    .onChange((v) => {
      particleSystemSetting.simulationSpace = v;
      recreateParticleSystem();
    });

  folder
    .add({ maxParticles: 100.0 }, "maxParticles", 1.0, 1000, 1.0)
    .onChange((v) => {
      particleSystemSetting.maxParticles = v;
      recreateParticleSystem();
    });
};

const createEmissionEntries = (folder) => {
  folder
    .add({ rateOverTime: 10.0 }, "rateOverTime", 0.0, 100, 1.0)
    .onChange((v) => {
      particleSystemSetting.emission.rateOverTime = v;
      recreateParticleSystem();
    });

  folder
    .add({ rateOverDistance: 0.0 }, "rateOverDistance", 0.0, 100, 1.0)
    .onChange((v) => {
      particleSystemSetting.emission.rateOverDistance = v;
      recreateParticleSystem();
    });
};

let shapeControllers = [];

const destroyShapeControllers = () => {
  shapeControllers.forEach((controller) => controller.destroy());
  shapeControllers = [];
};

const createShapeSphereEntries = (folder) => {
  shapeControllers.push(
    folder.add({ radius: 1 }, "radius", 0.0001, 10, 0.0001).onChange((v) => {
      particleSystemSetting.shape.radius = v;
      recreateParticleSystem();
    })
  );

  shapeControllers.push(
    folder
      .add({ radiusThickness: 1 }, "radiusThickness", 0.0, 1, 0.01)
      .onChange((v) => {
        particleSystemSetting.shape.radiusThickness = v;
        recreateParticleSystem();
      })
  );
};

const createShapeEntries = (folder) => {
  folder
    .add({ shape: Shape.SPHERE }, "shape", [
      Shape.SPHERE,
      Shape.CONE,
      Shape.BOX,
      Shape.CIRCLE,
      Shape.RECTANGLE,
    ])
    .onChange((v) => {
      particleSystemSetting.shape.shape = v;
      destroyShapeControllers();
      switch (v) {
        case Shape.SPHERE:
          createShapeSphereEntries(folder);
      }
      recreateParticleSystem();
    });

  createShapeSphereEntries(folder);
};

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

const cycleData = {};
const animate = () => {
  const rawDelta = clock.getDelta();

  cycleData.now = Date.now();
  cycleData.delta = rawDelta > 0.1 ? 0.1 : rawDelta;
  cycleData.elapsed = clock.getElapsedTime();

  if (simulateMovements) {
    particleSystem.position.x = Math.cos(cycleData.elapsed * 0.5) * 1;
    particleSystem.position.y =
      Math.cos(cycleData.elapsed) * Math.sin(cycleData.elapsed) * 0.5;
    particleSystem.position.z = Math.sin(cycleData.elapsed * 0.5) * 1;
  }

  requestAnimationFrame(animate);
  stats.update();

  updateParticleSystems(cycleData);

  renderer.render(scene, camera);
};

createParticleSystemEditor("#three-particles-editor");
