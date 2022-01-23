import { CurveFunction } from "@newkrok/three-particles/src/js/effects/three-particles/three-particles-curves";

export const createOpacityOverLifeTimeEntries = ({
  parentFolder,
  particleSystemConfig,
  recreateParticleSystem,
}) => {
  const folder = parentFolder.addFolder("Opacity over lifetime");
  folder.close();

  particleSystemConfig.opacityOverLifetime.curveFunction =
    typeof particleSystemConfig.opacityOverLifetime.curveFunction === "function"
      ? CurveFunction.BEZIER
      : particleSystemConfig.opacityOverLifetime.curveFunction ||
        CurveFunction.BEZIER;

  folder
    .add(particleSystemConfig.opacityOverLifetime, "isActive")
    .onChange(recreateParticleSystem)
    .listen();

  folder
    .add(
      particleSystemConfig.opacityOverLifetime,
      "curveFunction",
      Object.keys(CurveFunction)
    )
    .listen()
    .onChange(recreateParticleSystem);

  particleSystemConfig.opacityOverLifetime.bezierPoints = [
    { x: 0, y: 1 - 200 / 200, percentage: 0 },
    { x: 50 / 300, y: 1 - 200 / 200 },
    { x: 100 / 300, y: 1 - 0 },
    { x: 150 / 300, y: 1 - 0, percentage: 150 / 300 },
    { x: 200 / 300, y: 1 - 0 },
    { x: 250 / 300, y: 1 - 200 / 200 },
    { x: 300 / 300, y: 1 - 200 / 200, percentage: 1 },
  ];

  return {
    onParticleSystemChange: () => {},
    onUpdate: () => {},
  };
};
