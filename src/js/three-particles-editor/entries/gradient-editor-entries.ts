/**
 * Gradient Editor Entries
 *
 * Unified color and opacity over lifetime editor using a visual gradient interface
 */

import type { ParticleSystemConfig } from '@newkrok/three-particles';
import type { GUI } from 'three/examples/jsm/libs/lil-gui.module.min';
import {
  createGradientEditor,
  setGradientStops,
} from '../gradient-editor/gradient-editor';
import {
  gradientToBezierCurves,
  bezierCurvesToGradient,
  getDefaultGradientStops,
  type GradientStop,
  type BezierCurve,
} from '../gradient-editor/gradient-to-bezier';

type GradientEditorEntriesParams = {
  parentFolder: GUI;
  particleSystemConfig: ParticleSystemConfig;
  recreateParticleSystem: () => void;
};

let isInitialized = false;

/**
 * Initializes gradient editor data in _editorData if not present
 */
const ensureGradientDataExists = (config: ParticleSystemConfig): void => {
  if (!config._editorData) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (config as any)._editorData = {};
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorData = (config as any)._editorData;

  if (!editorData.gradientStops) {
    // Try to convert existing bezier curves to gradient stops
    if (
      config.colorOverLifetime?.r &&
      config.colorOverLifetime?.g &&
      config.colorOverLifetime?.b &&
      config.opacityOverLifetime?.lifetimeCurve
    ) {
      // Convert existing bezier curves to gradient
      editorData.gradientStops = bezierCurvesToGradient(
        config.colorOverLifetime.r as BezierCurve,
        config.colorOverLifetime.g as BezierCurve,
        config.colorOverLifetime.b as BezierCurve,
        config.opacityOverLifetime.lifetimeCurve as BezierCurve,
        5 // Sample 5 stops
      );
    } else {
      // Use default gradient
      editorData.gradientStops = getDefaultGradientStops();
    }
  }
};

/**
 * Ensures colorOverLifetime and opacityOverLifetime structures exist
 */
const ensureConfigStructures = (config: ParticleSystemConfig): void => {
  // Ensure colorOverLifetime exists
  if (!config.colorOverLifetime) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (config as any).colorOverLifetime = {
      isActive: false,
      r: { type: 'BEZIER', scale: 1, bezierPoints: [] },
      g: { type: 'BEZIER', scale: 1, bezierPoints: [] },
      b: { type: 'BEZIER', scale: 1, bezierPoints: [] },
    };
  }

  // Ensure opacityOverLifetime exists
  if (!config.opacityOverLifetime) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (config as any).opacityOverLifetime = {
      isActive: false,
      lifetimeCurve: { type: 'BEZIER', scale: 1, bezierPoints: [] },
    };
  }
};

/**
 * Updates bezier curves from gradient stops
 */
const updateBeziersFromGradient = (
  config: ParticleSystemConfig,
  stops: GradientStop[]
): void => {
  const curves = gradientToBezierCurves(stops);

  // Update color over lifetime
  if (config.colorOverLifetime) {
    config.colorOverLifetime.r = curves.r;
    config.colorOverLifetime.g = curves.g;
    config.colorOverLifetime.b = curves.b;
  }

  // Update opacity over lifetime
  if (config.opacityOverLifetime) {
    config.opacityOverLifetime.lifetimeCurve = curves.alpha;
  }
};

/**
 * Creates the gradient editor UI
 */
export const createGradientEditorEntries = ({
  parentFolder,
  particleSystemConfig,
  recreateParticleSystem,
}: GradientEditorEntriesParams): Record<string, unknown> => {
  const folder = parentFolder.addFolder('Color & Opacity (Gradient)');
  folder.close();

  ensureConfigStructures(particleSystemConfig);
  ensureGradientDataExists(particleSystemConfig);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorData = (particleSystemConfig as any)._editorData;

  // Combined enabled toggle
  const uiState = {
    enabled: particleSystemConfig.colorOverLifetime?.isActive || false,
  };

  folder
    .add(uiState, 'enabled')
    .name('Enable')
    .onChange((value: boolean) => {
      if (particleSystemConfig.colorOverLifetime) {
        particleSystemConfig.colorOverLifetime.isActive = value;
      }
      if (particleSystemConfig.opacityOverLifetime) {
        particleSystemConfig.opacityOverLifetime.isActive = value;
      }
      recreateParticleSystem();
    })
    .listen();

  // Button to open gradient editor
  folder
    .add(
      {
        openEditor: (): void => {
          // Show the gradient editor modal/panel
          const modal = document.querySelector('.gradient-editor-modal') as HTMLElement;
          if (modal) {
            modal.style.display = 'block';

            // Initialize editor if not done yet
            if (!isInitialized) {
              createGradientEditor(editorData.gradientStops, (stops: GradientStop[]) => {
                // Save stops to editor data
                editorData.gradientStops = stops;

                // Update bezier curves
                updateBeziersFromGradient(particleSystemConfig, stops);

                // Recreate particle system
                recreateParticleSystem();
              });
              isInitialized = true;
            } else {
              // Update existing editor
              setGradientStops(editorData.gradientStops);
            }
          }
        },
      },
      'openEditor'
    )
    .name('Edit Gradient');

  // Reset to default gradient
  folder
    .add(
      {
        reset: (): void => {
          const defaultStops = getDefaultGradientStops();
          editorData.gradientStops = defaultStops;
          setGradientStops(defaultStops);
          updateBeziersFromGradient(particleSystemConfig, defaultStops);
          recreateParticleSystem();
        },
      },
      'reset'
    )
    .name('Reset to Default');

  return {
    onReset: () => {
      uiState.enabled = false;
      if (particleSystemConfig.colorOverLifetime) {
        particleSystemConfig.colorOverLifetime.isActive = false;
      }
      if (particleSystemConfig.opacityOverLifetime) {
        particleSystemConfig.opacityOverLifetime.isActive = false;
      }
      editorData.gradientStops = getDefaultGradientStops();
    },
  };
};
