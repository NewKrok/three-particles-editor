/**
 * Default Gradient Presets
 *
 * Collection of commonly used gradient presets for particle systems
 */

import type { GradientStop } from './gradient-to-bezier';

export type GradientPreset = {
  name: string;
  stops: GradientStop[];
  preview?: string; // Base64 or URL to preview image
};

export const defaultGradients: GradientPreset[] = [
  {
    name: 'White Fade',
    stops: [
      { position: 0, color: { r: 255, g: 255, b: 255, a: 255 } },
      { position: 1, color: { r: 255, g: 255, b: 255, a: 0 } },
    ],
  },
  {
    name: 'Fire',
    stops: [
      { position: 0, color: { r: 255, g: 255, b: 255, a: 255 } },
      { position: 0.25, color: { r: 255, g: 255, b: 100, a: 255 } },
      { position: 0.5, color: { r: 255, g: 150, b: 0, a: 255 } },
      { position: 0.75, color: { r: 255, g: 50, b: 0, a: 128 } },
      { position: 1, color: { r: 100, g: 0, b: 0, a: 0 } },
    ],
  },
  {
    name: 'Smoke',
    stops: [
      { position: 0, color: { r: 200, g: 200, b: 200, a: 0 } },
      { position: 0.2, color: { r: 180, g: 180, b: 180, a: 200 } },
      { position: 0.5, color: { r: 150, g: 150, b: 150, a: 255 } },
      { position: 0.8, color: { r: 120, g: 120, b: 120, a: 200 } },
      { position: 1, color: { r: 100, g: 100, b: 100, a: 0 } },
    ],
  },
  {
    name: 'Electric Blue',
    stops: [
      { position: 0, color: { r: 255, g: 255, b: 255, a: 255 } },
      { position: 0.3, color: { r: 100, g: 200, b: 255, a: 255 } },
      { position: 0.7, color: { r: 0, g: 100, b: 255, a: 200 } },
      { position: 1, color: { r: 0, g: 50, b: 150, a: 0 } },
    ],
  },
  {
    name: 'Rainbow',
    stops: [
      { position: 0, color: { r: 255, g: 0, b: 0, a: 255 } },
      { position: 0.17, color: { r: 255, g: 127, b: 0, a: 255 } },
      { position: 0.33, color: { r: 255, g: 255, b: 0, a: 255 } },
      { position: 0.5, color: { r: 0, g: 255, b: 0, a: 255 } },
      { position: 0.67, color: { r: 0, g: 0, b: 255, a: 255 } },
      { position: 0.83, color: { r: 75, g: 0, b: 130, a: 255 } },
      { position: 1, color: { r: 148, g: 0, b: 211, a: 0 } },
    ],
  },
  {
    name: 'Explosion',
    stops: [
      { position: 0, color: { r: 255, g: 255, b: 255, a: 255 } },
      { position: 0.1, color: { r: 255, g: 200, b: 0, a: 255 } },
      { position: 0.3, color: { r: 255, g: 100, b: 0, a: 255 } },
      { position: 0.6, color: { r: 200, g: 0, b: 0, a: 150 } },
      { position: 1, color: { r: 50, g: 50, b: 50, a: 0 } },
    ],
  },
  {
    name: 'Magic Sparkle',
    stops: [
      { position: 0, color: { r: 255, g: 255, b: 255, a: 255 } },
      { position: 0.3, color: { r: 255, g: 100, b: 255, a: 255 } },
      { position: 0.6, color: { r: 100, g: 100, b: 255, a: 200 } },
      { position: 1, color: { r: 50, g: 0, b: 100, a: 0 } },
    ],
  },
  {
    name: 'Poison Cloud',
    stops: [
      { position: 0, color: { r: 200, g: 255, b: 100, a: 0 } },
      { position: 0.2, color: { r: 150, g: 255, b: 50, a: 200 } },
      { position: 0.5, color: { r: 100, g: 200, b: 0, a: 255 } },
      { position: 0.8, color: { r: 50, g: 150, b: 0, a: 150 } },
      { position: 1, color: { r: 0, g: 100, b: 0, a: 0 } },
    ],
  },
  {
    name: 'Ice Crystals',
    stops: [
      { position: 0, color: { r: 255, g: 255, b: 255, a: 255 } },
      { position: 0.3, color: { r: 200, g: 240, b: 255, a: 255 } },
      { position: 0.7, color: { r: 100, g: 200, b: 255, a: 200 } },
      { position: 1, color: { r: 50, g: 150, b: 200, a: 0 } },
    ],
  },
  {
    name: 'Blood',
    stops: [
      { position: 0, color: { r: 255, g: 100, b: 100, a: 255 } },
      { position: 0.4, color: { r: 200, g: 0, b: 0, a: 255 } },
      { position: 0.7, color: { r: 150, g: 0, b: 0, a: 200 } },
      { position: 1, color: { r: 100, g: 0, b: 0, a: 0 } },
    ],
  },
];
