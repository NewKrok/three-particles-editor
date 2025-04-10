import {
  setCurveEditorPositions,
  setCurveEditorTarget,
} from "../curve-editor/curve-editor";

import { CurveFunction } from "@newkrok/three-particles/src/js/effects/three-particles/three-particles-curves";

type OpacityOverLifeTimeEntriesParams = {
  parentFolder: any;
  particleSystemConfig: any;
  recreateParticleSystem: () => void;
};

export const createOpacityOverLifeTimeEntries = ({
  parentFolder,
  particleSystemConfig,
  recreateParticleSystem,
}: OpacityOverLifeTimeEntriesParams): Record<string, unknown> => {
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

  folder
    .add(
      {
        editCurve: (): void => {
          setCurveEditorTarget(particleSystemConfig.opacityOverLifetime);
          recreateParticleSystem();
        },
      },
      "editCurve"
    )
    .name("Apply curve");

  folder
    .add(
      {
        loadCurve: (): void =>
          setCurveEditorPositions(particleSystemConfig.opacityOverLifetime),
      },
      "loadCurve"
    )
    .name("Edit curve");

  return {};
};
