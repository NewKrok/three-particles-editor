export const createEmissionEntries = ({
  parentFolder,
  particleSystemConfig,
  recreateParticleSystem,
}) => {
  const folder = parentFolder.addFolder("Emission");
  folder.close();

  folder
    .add(particleSystemConfig.emission, "rateOverTime", 0.0, 500, 1.0)
    .onChange(recreateParticleSystem)
    .listen();

  folder
    .add(particleSystemConfig.emission, "rateOverDistance", 0.0, 500, 1.0)
    .onChange(recreateParticleSystem)
    .listen();

  return {};
};
