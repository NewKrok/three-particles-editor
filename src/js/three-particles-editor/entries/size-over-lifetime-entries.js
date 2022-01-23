import {
  setCurveEditorPositions,
  setCurveEditorTarget,
} from "../curve-editor/curve-editor";

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

  folder
    .add(
      {
        editCurve: () => {
          setCurveEditorTarget(particleSystemConfig.sizeOverLifetime);
          recreateParticleSystem();
        },
      },
      "editCurve"
    )
    .name("Apply curve");

  folder
    .add(
      {
        loadCurve: () =>
          setCurveEditorPositions(particleSystemConfig.sizeOverLifetime),
      },
      "loadCurve"
    )
    .name("Edit curve");

  return {
    onParticleSystemChange: () => {},
    onUpdate: () => {},
  };
};
