import { CurveFunction } from "@newkrok/three-particles/src/js/effects/three-particles/three-particles-curves";

export const createSizeOverLifeTimeEntries = ({
  parentFolder,
  particleSystemConfig,
  recreateParticleSystem,
}) => {
  const folder = parentFolder.addFolder("Size over lifetime");
  folder.close();

  particleSystemConfig.sizeOverLifetime =
    typeof particleSystemConfig.sizeOverLifetime === "function"
      ? CurveFunction.LINEAR
      : particleSystemConfig.sizeOverLifetime || CurveFunction.LINEAR;

  folder
    .add(particleSystemConfig.sizeOverLifetime, "isActive")
    .onChange((v) => {
      particleSystemConfig.looping = v;
      recreateParticleSystem();
    })
    .listen();

  folder
    .add(
      particleSystemConfig.sizeOverLifetime,
      "curveFunction",
      Object.keys(CurveFunction)
    )
    .listen()
    .onChange((v) => {
      particleSystemConfig.sizeOverLifetime.curveFunction = v;
      recreateParticleSystem();
    });

  return {
    onParticleSystemChange: () => {},
    onUpdate: () => {},
  };
};
