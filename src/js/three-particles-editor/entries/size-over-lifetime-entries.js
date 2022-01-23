import { CurveFunction } from "@newkrok/three-particles/src/js/effects/three-particles/three-particles-curves";

export const createSizeOverLifeTimeEntries = ({
  parentFolder,
  particleSystemConfig,
  recreateParticleSystem,
}) => {
  const folder = parentFolder.addFolder("Size over lifetime");
  folder.close();

  particleSystemConfig.sizeOverLifetime.curveFunction =
    typeof particleSystemConfig.sizeOverLifetime.curveFunction === "function"
      ? CurveFunction.BEZIER
      : particleSystemConfig.sizeOverLifetime.curveFunction ||
        CurveFunction.BEZIER;

  folder
    .add(particleSystemConfig.sizeOverLifetime, "isActive")
    .onChange(recreateParticleSystem)
    .listen();

  folder
    .add(
      particleSystemConfig.sizeOverLifetime,
      "curveFunction",
      Object.keys(CurveFunction)
    )
    .listen()
    .onChange(recreateParticleSystem);

  particleSystemConfig.sizeOverLifetime.bezierPoints = [
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
