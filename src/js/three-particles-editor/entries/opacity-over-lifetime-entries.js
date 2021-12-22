import { CurveFunction } from "@newkrok/three-particles/src/js/effects/three-particles/three-particles-curves";

export const createOpacityOverLifeTimeEntries = ({
  parentFolder,
  particleSystemConfig,
  recreateParticleSystem,
}) => {
  const folder = parentFolder.addFolder("Opacity over lifetime");
  folder.close();

  particleSystemConfig.opacityOverLifetime =
    typeof particleSystemConfig.opacityOverLifetime === "function"
      ? CurveFunction.LINEAR
      : particleSystemConfig.opacityOverLifetime || CurveFunction.LINEAR;

  folder
    .add(particleSystemConfig.opacityOverLifetime, "isActive")
    .onChange((v) => {
      particleSystemConfig.looping = v;
      recreateParticleSystem();
    })
    .listen();

  folder
    .add(
      particleSystemConfig.opacityOverLifetime,
      "curveFunction",
      Object.keys(CurveFunction)
    )
    .listen()
    .onChange((v) => {
      particleSystemConfig.opacityOverLifetime.curveFunction = v;
      recreateParticleSystem();
    });

  return {
    onParticleSystemChange: () => {},
    onUpdate: () => {},
  };
};
