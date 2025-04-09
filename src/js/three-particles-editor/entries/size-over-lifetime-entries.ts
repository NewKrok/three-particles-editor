import {
  setCurveEditorPositions,
  setCurveEditorTarget,
} from "../curve-editor/curve-editor";

import { CurveFunction } from "@newkrok/three-particles/src/js/effects/three-particles/three-particles-curves";

type SizeOverLifeTimeEntriesParams = {
  parentFolder: any;
  particleSystemConfig: any;
  recreateParticleSystem: () => void;
};

export const createSizeOverLifeTimeEntries = ({
  parentFolder,
  particleSystemConfig,
  recreateParticleSystem,
}: SizeOverLifeTimeEntriesParams): Record<string, unknown> => {
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
        editCurve: (): void => {
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
        loadCurve: (): void =>
          setCurveEditorPositions(particleSystemConfig.sizeOverLifetime),
      },
      "loadCurve"
    )
    .name("Edit curve");

  return {};
};
