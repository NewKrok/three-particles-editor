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
  {
    name: 'Lava',
    stops: [
      { position: 0, color: { r: 255, g: 255, b: 100, a: 255 } },
      { position: 0.2, color: { r: 255, g: 150, b: 0, a: 255 } },
      { position: 0.5, color: { r: 200, g: 50, b: 0, a: 255 } },
      { position: 0.8, color: { r: 100, g: 0, b: 0, a: 200 } },
      { position: 1, color: { r: 50, g: 0, b: 0, a: 0 } },
    ],
  },
  {
    name: 'Aurora Borealis',
    stops: [
      { position: 0, color: { r: 0, g: 255, b: 150, a: 0 } },
      { position: 0.25, color: { r: 50, g: 255, b: 200, a: 200 } },
      { position: 0.5, color: { r: 100, g: 200, b: 255, a: 255 } },
      { position: 0.75, color: { r: 150, g: 100, b: 255, a: 200 } },
      { position: 1, color: { r: 100, g: 50, b: 200, a: 0 } },
    ],
  },
  {
    name: 'Neon Glow',
    stops: [
      { position: 0, color: { r: 255, g: 0, b: 255, a: 255 } },
      { position: 0.3, color: { r: 255, g: 50, b: 200, a: 255 } },
      { position: 0.7, color: { r: 200, g: 0, b: 255, a: 200 } },
      { position: 1, color: { r: 150, g: 0, b: 200, a: 0 } },
    ],
  },
  {
    name: 'Gold',
    stops: [
      { position: 0, color: { r: 255, g: 255, b: 200, a: 255 } },
      { position: 0.3, color: { r: 255, g: 215, b: 0, a: 255 } },
      { position: 0.6, color: { r: 218, g: 165, b: 32, a: 255 } },
      { position: 0.8, color: { r: 184, g: 134, b: 11, a: 200 } },
      { position: 1, color: { r: 150, g: 100, b: 0, a: 0 } },
    ],
  },
  {
    name: 'Silver',
    stops: [
      { position: 0, color: { r: 255, g: 255, b: 255, a: 255 } },
      { position: 0.3, color: { r: 220, g: 220, b: 220, a: 255 } },
      { position: 0.6, color: { r: 192, g: 192, b: 192, a: 255 } },
      { position: 0.8, color: { r: 150, g: 150, b: 150, a: 200 } },
      { position: 1, color: { r: 100, g: 100, b: 100, a: 0 } },
    ],
  },
  {
    name: 'Sunset',
    stops: [
      { position: 0, color: { r: 255, g: 255, b: 150, a: 255 } },
      { position: 0.3, color: { r: 255, g: 180, b: 100, a: 255 } },
      { position: 0.6, color: { r: 255, g: 100, b: 100, a: 255 } },
      { position: 0.8, color: { r: 200, g: 50, b: 150, a: 200 } },
      { position: 1, color: { r: 100, g: 0, b: 100, a: 0 } },
    ],
  },
  {
    name: 'Ocean Waves',
    stops: [
      { position: 0, color: { r: 200, g: 240, b: 255, a: 0 } },
      { position: 0.3, color: { r: 100, g: 200, b: 255, a: 200 } },
      { position: 0.6, color: { r: 0, g: 150, b: 200, a: 255 } },
      { position: 0.8, color: { r: 0, g: 100, b: 150, a: 200 } },
      { position: 1, color: { r: 0, g: 50, b: 100, a: 0 } },
    ],
  },
  {
    name: 'Ember Fade',
    stops: [
      { position: 0, color: { r: 255, g: 150, b: 0, a: 255 } },
      { position: 0.3, color: { r: 255, g: 100, b: 0, a: 255 } },
      { position: 0.6, color: { r: 200, g: 50, b: 0, a: 200 } },
      { position: 0.8, color: { r: 150, g: 0, b: 0, a: 100 } },
      { position: 1, color: { r: 50, g: 0, b: 0, a: 0 } },
    ],
  },
  {
    name: 'Holy Light',
    stops: [
      { position: 0, color: { r: 255, g: 255, b: 255, a: 255 } },
      { position: 0.3, color: { r: 255, g: 255, b: 200, a: 255 } },
      { position: 0.6, color: { r: 255, g: 240, b: 150, a: 200 } },
      { position: 0.8, color: { r: 255, g: 220, b: 100, a: 100 } },
      { position: 1, color: { r: 255, g: 200, b: 50, a: 0 } },
    ],
  },
  {
    name: 'Dark Energy',
    stops: [
      { position: 0, color: { r: 150, g: 0, b: 150, a: 255 } },
      { position: 0.3, color: { r: 100, g: 0, b: 100, a: 255 } },
      { position: 0.6, color: { r: 50, g: 0, b: 80, a: 200 } },
      { position: 0.8, color: { r: 30, g: 0, b: 50, a: 150 } },
      { position: 1, color: { r: 0, g: 0, b: 0, a: 0 } },
    ],
  },
  {
    name: 'Plasma',
    stops: [
      { position: 0, color: { r: 255, g: 100, b: 255, a: 255 } },
      { position: 0.25, color: { r: 200, g: 50, b: 255, a: 255 } },
      { position: 0.5, color: { r: 100, g: 100, b: 255, a: 255 } },
      { position: 0.75, color: { r: 50, g: 150, b: 255, a: 200 } },
      { position: 1, color: { r: 0, g: 100, b: 200, a: 0 } },
    ],
  },
  // Scientific / matplotlib colormaps
  {
    name: 'Turbo',
    stops: [
      { position: 0, color: { r: 48, g: 18, b: 59, a: 255 } },
      { position: 0.15, color: { r: 65, g: 68, b: 225, a: 255 } },
      { position: 0.3, color: { r: 35, g: 152, b: 251, a: 255 } },
      { position: 0.45, color: { r: 18, g: 222, b: 163, a: 255 } },
      { position: 0.55, color: { r: 144, g: 249, b: 64, a: 255 } },
      { position: 0.7, color: { r: 238, g: 219, b: 30, a: 255 } },
      { position: 0.85, color: { r: 249, g: 131, b: 14, a: 255 } },
      { position: 1, color: { r: 122, g: 4, b: 3, a: 255 } },
    ],
  },
  {
    name: 'Cividis',
    stops: [
      { position: 0, color: { r: 0, g: 32, b: 77, a: 255 } },
      { position: 0.25, color: { r: 60, g: 77, b: 110, a: 255 } },
      { position: 0.5, color: { r: 122, g: 122, b: 122, a: 255 } },
      { position: 0.75, color: { r: 186, g: 173, b: 108, a: 255 } },
      { position: 1, color: { r: 253, g: 232, b: 96, a: 255 } },
    ],
  },
  {
    name: 'Spectral',
    stops: [
      { position: 0, color: { r: 158, g: 1, b: 66, a: 255 } },
      { position: 0.2, color: { r: 237, g: 102, b: 60, a: 255 } },
      { position: 0.4, color: { r: 254, g: 224, b: 118, a: 255 } },
      { position: 0.5, color: { r: 255, g: 255, b: 191, a: 255 } },
      { position: 0.6, color: { r: 171, g: 221, b: 164, a: 255 } },
      { position: 0.8, color: { r: 69, g: 155, b: 201, a: 255 } },
      { position: 1, color: { r: 94, g: 79, b: 162, a: 255 } },
    ],
  },
  {
    name: 'Viridis',
    stops: [
      { position: 0, color: { r: 68, g: 1, b: 84, a: 255 } },
      { position: 0.25, color: { r: 59, g: 82, b: 139, a: 255 } },
      { position: 0.5, color: { r: 33, g: 145, b: 140, a: 255 } },
      { position: 0.75, color: { r: 94, g: 201, b: 98, a: 255 } },
      { position: 1, color: { r: 253, g: 231, b: 37, a: 255 } },
    ],
  },
  {
    name: 'Inferno',
    stops: [
      { position: 0, color: { r: 0, g: 0, b: 4, a: 255 } },
      { position: 0.25, color: { r: 87, g: 16, b: 110, a: 255 } },
      { position: 0.5, color: { r: 188, g: 55, b: 84, a: 255 } },
      { position: 0.75, color: { r: 249, g: 142, b: 9, a: 255 } },
      { position: 1, color: { r: 252, g: 255, b: 164, a: 255 } },
    ],
  },
  {
    name: 'Magma',
    stops: [
      { position: 0, color: { r: 0, g: 0, b: 4, a: 255 } },
      { position: 0.25, color: { r: 82, g: 22, b: 120, a: 255 } },
      { position: 0.5, color: { r: 183, g: 55, b: 121, a: 255 } },
      { position: 0.75, color: { r: 254, g: 159, b: 109, a: 255 } },
      { position: 1, color: { r: 252, g: 253, b: 191, a: 255 } },
    ],
  },
  {
    name: 'Plasma (Scientific)',
    stops: [
      { position: 0, color: { r: 13, g: 8, b: 135, a: 255 } },
      { position: 0.25, color: { r: 126, g: 3, b: 168, a: 255 } },
      { position: 0.5, color: { r: 204, g: 71, b: 120, a: 255 } },
      { position: 0.75, color: { r: 248, g: 149, b: 64, a: 255 } },
      { position: 1, color: { r: 240, g: 249, b: 33, a: 255 } },
    ],
  },
  {
    name: 'Rocket',
    stops: [
      { position: 0, color: { r: 3, g: 5, b: 18, a: 255 } },
      { position: 0.25, color: { r: 73, g: 28, b: 72, a: 255 } },
      { position: 0.5, color: { r: 171, g: 51, b: 54, a: 255 } },
      { position: 0.75, color: { r: 239, g: 138, b: 91, a: 255 } },
      { position: 1, color: { r: 255, g: 245, b: 235, a: 255 } },
    ],
  },
  {
    name: 'Mako',
    stops: [
      { position: 0, color: { r: 11, g: 4, b: 5, a: 255 } },
      { position: 0.25, color: { r: 34, g: 47, b: 103, a: 255 } },
      { position: 0.5, color: { r: 29, g: 114, b: 143, a: 255 } },
      { position: 0.75, color: { r: 99, g: 194, b: 189, a: 255 } },
      { position: 1, color: { r: 222, g: 244, b: 237, a: 255 } },
    ],
  },
  {
    name: 'Vlag',
    stops: [
      { position: 0, color: { r: 34, g: 102, b: 175, a: 255 } },
      { position: 0.25, color: { r: 140, g: 180, b: 219, a: 255 } },
      { position: 0.5, color: { r: 234, g: 232, b: 230, a: 255 } },
      { position: 0.75, color: { r: 207, g: 145, b: 151, a: 255 } },
      { position: 1, color: { r: 149, g: 25, b: 53, a: 255 } },
    ],
  },
  {
    name: 'Icefire',
    stops: [
      { position: 0, color: { r: 0, g: 172, b: 199, a: 255 } },
      { position: 0.25, color: { r: 41, g: 68, b: 105, a: 255 } },
      { position: 0.5, color: { r: 17, g: 11, b: 14, a: 255 } },
      { position: 0.75, color: { r: 115, g: 54, b: 28, a: 255 } },
      { position: 1, color: { r: 222, g: 168, b: 72, a: 255 } },
    ],
  },
  {
    name: 'Flare',
    stops: [
      { position: 0, color: { r: 232, g: 111, b: 49, a: 255 } },
      { position: 0.25, color: { r: 189, g: 73, b: 73, a: 255 } },
      { position: 0.5, color: { r: 128, g: 57, b: 92, a: 255 } },
      { position: 0.75, color: { r: 68, g: 56, b: 86, a: 255 } },
      { position: 1, color: { r: 24, g: 32, b: 48, a: 255 } },
    ],
  },
  {
    name: 'Crest',
    stops: [
      { position: 0, color: { r: 42, g: 111, b: 99, a: 255 } },
      { position: 0.25, color: { r: 54, g: 143, b: 115, a: 255 } },
      { position: 0.5, color: { r: 109, g: 185, b: 131, a: 255 } },
      { position: 0.75, color: { r: 186, g: 216, b: 163, a: 255 } },
      { position: 1, color: { r: 241, g: 237, b: 201, a: 255 } },
    ],
  },
];
