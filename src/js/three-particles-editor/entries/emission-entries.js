export const createEmissionEntries = ({
  parentFolder,
  particleSystemConfig,
  recreateParticleSystem,
}) => {
  const folder = parentFolder.addFolder("Emission");
  folder.close();

  folder
    .add({ rateOverTime: 10.0 }, "rateOverTime", 0.0, 100, 1.0)
    .onChange((v) => {
      particleSystemConfig.emission.rateOverTime = v;
      recreateParticleSystem();
    });

  folder
    .add({ rateOverDistance: 0.0 }, "rateOverDistance", 0.0, 100, 1.0)
    .onChange((v) => {
      particleSystemConfig.emission.rateOverDistance = v;
      recreateParticleSystem();
    });

  return {
    onParticleSystemChange: () => {},
    onUpdate: () => {},
  };
};
