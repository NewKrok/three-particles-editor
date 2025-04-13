import {
  setCurveEditorPositions,
  setCurveEditorTarget,
} from "../curve-editor/curve-editor";

import { LifeTimeCurve } from "@newkrok/three-particles";
import { createLifetimeCurveFolderEntry } from "./entry-helpers-v2";

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

  // Ensure the sizeOverLifetime object has the correct structure for v2.0.2
  if (!particleSystemConfig.sizeOverLifetime.lifetimeCurve) {
    particleSystemConfig.sizeOverLifetime.lifetimeCurve = {
      type: LifeTimeCurve.BEZIER,
      bezierPoints: [
        { x: 0, y: 0, percentage: 0 },
        { x: 1, y: 1, percentage: 1 },
      ],
    };
  }

  folder
    .add(particleSystemConfig.sizeOverLifetime, "isActive")
    .onChange(recreateParticleSystem)
    .listen();

  // Use the createLifetimeCurveFolderEntry helper to create UI for the lifetimeCurve
  createLifetimeCurveFolderEntry({
    particleSystemConfig,
    recreateParticleSystem,
    parentFolder: folder,
    rootPropertyName: "sizeOverLifetime",
    propertyName: "lifetimeCurve",
  });

  folder
    .add(
      {
        editCurve: (): void => {
          // Update to use lifetimeCurve instead of curveFunction
          setCurveEditorTarget(particleSystemConfig.sizeOverLifetime.lifetimeCurve);
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
