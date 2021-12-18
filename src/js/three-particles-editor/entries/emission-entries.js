export const createEmissionEntries = ({
  parentFolder,
  particleSystemConfig,
  recreateParticleSystem,
}) => {
  const folder = parentFolder.addFolder("Emission");
  folder.close();

  folder
    .add(particleSystemConfig.emission, "rateOverTime", 0.0, 100, 1.0)
    .onChange((v) => {
      particleSystemConfig.emission.rateOverTime = v;
      recreateParticleSystem();
    })
    .listen();

  folder
    .add(particleSystemConfig.emission, "rateOverDistance", 0.0, 100, 1.0)
    .onChange((v) => {
      particleSystemConfig.emission.rateOverDistance = v;
      recreateParticleSystem();
    })
    .listen();

  return {
    onParticleSystemChange: () => {},
    onUpdate: () => {},
  };
};
