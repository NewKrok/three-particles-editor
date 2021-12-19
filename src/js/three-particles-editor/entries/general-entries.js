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

  folder
    .add(particleSystemConfig, "duration", 0.0, 30, 0.01)
    .onChange((v) => {
      particleSystemConfig.duration = v;
      recreateParticleSystem();
    })
    .listen();

  folder
    .add(particleSystemConfig, "looping")
    .onChange((v) => {
      particleSystemConfig.looping = v;
      recreateParticleSystem();
    })
    .listen();

  createMinMaxFloatFolderEntry({
    particleSystemConfig,
    recreateParticleSystem,
    parentFolder: folder,
    propertyName: "startDelay",
    min: 0.0,
    max: 30.0,
    step: 0.01,
  });

  createMinMaxFloatFolderEntry({
    particleSystemConfig,
    recreateParticleSystem,
    parentFolder: folder,
    propertyName: "startLifetime",
    min: 0.01,
    max: 30.0,
    step: 0.01,
  });

  createMinMaxFloatFolderEntry({
    particleSystemConfig,
    recreateParticleSystem,
    parentFolder: folder,
    propertyName: "startSpeed",
    min: 0.0,
    max: 30.0,
    step: 0.01,
  });

  createMinMaxFloatFolderEntry({
    particleSystemConfig,
    recreateParticleSystem,
    parentFolder: folder,
    propertyName: "startSize",
    min: 0.0,
    max: 100.0,
    step: 0.01,
  });

  createMinMaxFloatFolderEntry({
    particleSystemConfig,
    recreateParticleSystem,
    parentFolder: folder,
    propertyName: "startRotation",
    min: -360.0,
    max: 360.0,
    step: 0.001,
  });

  createMinMaxColorFolderEntry({
    particleSystemConfig,
    recreateParticleSystem,
    parentFolder: folder,
    propertyName: "startColor",
  });

  createMinMaxFloatFolderEntry({
    particleSystemConfig,
    recreateParticleSystem,
    parentFolder: folder,
    propertyName: "startOpacity",
    min: 0.0,
    max: 1.0,
    step: 0.001,
  });

  folder
    .add(particleSystemConfig, "gravity", 0.0, 1, 0.001)
    .onChange((v) => {
      particleSystemConfig.gravity = v;
      recreateParticleSystem();
    })
    .listen();

  folder
    .add(particleSystemConfig, "simulationSpace", [
      SimulationSpace.LOCAL,
      SimulationSpace.WORLD,
    ])
    .onChange((v) => {
      particleSystemConfig.simulationSpace = v;
      recreateParticleSystem();
    })
    .listen();

  folder
    .add(particleSystemConfig, "maxParticles", 1.0, 1000, 1.0)
    .onChange((v) => {
      particleSystemConfig.maxParticles = v;
      recreateParticleSystem();
    })
    .listen();

  return {
    onParticleSystemChange: () => {},
    onUpdate: () => {},
  };
};
