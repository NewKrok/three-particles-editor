export const createNoiseEntries = ({
  parentFolder,
  particleSystemConfig,
  recreateParticleSystem,
}) => {
  const folder = parentFolder.addFolder("Noise");
  folder.close();

  folder
    .add(particleSystemConfig.noise, "isActive")
    .onChange(recreateParticleSystem)
    .listen();

  folder
    .add(particleSystemConfig.noise, "useRandomOffset")
    .onChange(recreateParticleSystem)
    .listen();

  folder
    .add(particleSystemConfig.noise, "strength", 0.0, 2.0, 0.01)
    .onChange(recreateParticleSystem)
    .listen();

  folder
    .add(particleSystemConfig.noise, "frequency", 0.0001, 3.0, 0.001)
    .onChange(recreateParticleSystem)
    .listen();

  folder
    .add(particleSystemConfig.noise, "octaves", 1, 4, 1)
    .onChange(recreateParticleSystem)
    .listen();

  folder
    .add(particleSystemConfig.noise, "positionAmount", -5.0, 5.0, 0.001)
    .onChange(recreateParticleSystem)
    .listen();

  folder
    .add(particleSystemConfig.noise, "rotationAmount", -5.0, 5.0, 0.001)
    .onChange(recreateParticleSystem)
    .listen();

  folder
    .add(particleSystemConfig.noise, "sizeAmount", -5.0, 5.0, 0.001)
    .onChange(recreateParticleSystem)
    .listen();

  return {};
};
