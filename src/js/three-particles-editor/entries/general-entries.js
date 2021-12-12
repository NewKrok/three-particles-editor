import {
  createMinMaxColorFolderEntry,
  createMinMaxFloatFolderEntry,
} from "./entry-helpers";

import { SimulationSpace } from "@newkrok/three-particles/src/js/effects/three-particles";

export const createGeneralEntries = ({
  parentFolder,
  particleSystemConfig,
  recreateParticleSystem,
}) => {
  const folder = parentFolder.addFolder("General");

  folder.add({ duration: 5.0 }, "duration", 0.0, 30, 0.01).onChange((v) => {
    particleSystemConfig.duration = v;
    recreateParticleSystem();
  });

  folder.add({ looping: true }, "looping").onChange((v) => {
    particleSystemConfig.looping = v;
    recreateParticleSystem();
  });

  createMinMaxFloatFolderEntry({
    particleSystemConfig,
    recreateParticleSystem,
    parentFolder: folder,
    propertyName: "startDelay",
    defaultMin: 0.0,
    min: 0.0,
    defaultMax: 0.0,
    max: 30.0,
    step: 0.01,
  });

  createMinMaxFloatFolderEntry({
    particleSystemConfig,
    recreateParticleSystem,
    parentFolder: folder,
    propertyName: "startLifeTime",
    defaultMin: 5.0,
    min: 0.01,
    defaultMax: 5.0,
    max: 30.0,
    step: 0.01,
  });

  createMinMaxFloatFolderEntry({
    particleSystemConfig,
    recreateParticleSystem,
    parentFolder: folder,
    propertyName: "startSpeed",
    defaultMin: 5.0,
    min: 0.0,
    defaultMax: 5.0,
    max: 30.0,
    step: 0.01,
  });

  createMinMaxFloatFolderEntry({
    particleSystemConfig,
    recreateParticleSystem,
    parentFolder: folder,
    propertyName: "startSize",
    defaultMin: 1.0,
    min: 0.0,
    defaultMax: 1.0,
    max: 100.0,
    step: 0.01,
  });

  createMinMaxFloatFolderEntry({
    particleSystemConfig,
    recreateParticleSystem,
    parentFolder: folder,
    propertyName: "startRotation",
    defaultMin: 1.0,
    min: 0.0,
    defaultMax: 1.0,
    max: 360.0,
    step: 0.01,
  });

  createMinMaxColorFolderEntry({
    particleSystemConfig,
    recreateParticleSystem,
    parentFolder: folder,
    propertyName: "startColor",
    defaultColorA: { r: 1, g: 1, b: 1 },
    defaultColorB: { r: 1, g: 1, b: 1 },
  });

  createMinMaxFloatFolderEntry({
    particleSystemConfig,
    recreateParticleSystem,
    parentFolder: folder,
    propertyName: "startOpacity",
    defaultMin: 1.0,
    min: 0.0,
    defaultMax: 1.0,
    max: 1.0,
    step: 0.001,
  });

  folder.add({ gravity: 0.0 }, "gravity", 0.0, 1, 0.001).onChange((v) => {
    particleSystemConfig.gravity = v;
    recreateParticleSystem();
  });

  folder
    .add({ simulationSpace: SimulationSpace.LOCAL }, "simulationSpace", [
      SimulationSpace.LOCAL,
      SimulationSpace.WORLD,
    ])
    .onChange((v) => {
      particleSystemConfig.simulationSpace = v;
      recreateParticleSystem();
    });

  folder
    .add({ maxParticles: 100.0 }, "maxParticles", 1.0, 1000, 1.0)
    .onChange((v) => {
      particleSystemConfig.maxParticles = v;
      recreateParticleSystem();
    });

  return {
    onParticleSystemChange: () => {},
    onUpdate: () => {},
  };
};
