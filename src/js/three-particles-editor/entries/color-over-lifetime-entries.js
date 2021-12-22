import { CurveFunction } from "@newkrok/three-particles/src/js/effects/three-particles/three-particles-curves";

export const createColorOverLifeTimeEntries = ({
  parentFolder,
  particleSystemConfig,
  recreateParticleSystem,
}) => {
  const folder = parentFolder.addFolder("Opacity over lifetime");
  folder.close();

  particleSystemConfig.colorOverLifetime =
    typeof particleSystemConfig.colorOverLifetime === "function"
      ? CurveFunction.LINEAR
      : particleSystemConfig.colorOverLifetime || CurveFunction.LINEAR;

  folder
    .add(particleSystemConfig.colorOverLifetime, "isActive")
    .onChange((v) => {
      particleSystemConfig.looping = v;
      recreateParticleSystem();
    })
    .listen();

  folder
    .add(
      particleSystemConfig.colorOverLifetime,
      "curveFunction",
      Object.keys(CurveFunction)
    )
    .listen()
    .onChange((v) => {
      particleSystemConfig.colorOverLifetime.curveFunction = v;
      recreateParticleSystem();
    });

  return {
    onParticleSystemChange: () => {},
    onUpdate: () => {},
  };
};
