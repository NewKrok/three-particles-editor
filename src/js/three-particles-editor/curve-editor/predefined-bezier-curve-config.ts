export type BezierPoint = {
  x: number;
  y: number;
  percentage?: number;
};

export type BezierCurvePreset = {
  name: string;
  bezierPoints: BezierPoint[];
  preview?: string;
};

export const defaultBezierCurves: BezierCurvePreset[] = [
  {
    name: 'Linear',
    bezierPoints: [
      { x: 0, y: 0, percentage: 0 },
      { x: 0.1666, y: 0.1666 },
      { x: 0.3333, y: 0.3333 },
      { x: 0.5, y: 0.5, percentage: 0.5 },
      { x: 0.6666, y: 0.6666 },
      { x: 0.8333, y: 0.8333 },
      { x: 1, y: 1, percentage: 1 },
    ],
  },
  {
    name: 'Ease In',
    bezierPoints: [
      { x: 0, y: 0, percentage: 0 },
      { x: 0.42, y: 0 },
      { x: 0.58, y: 0.42 },
      { x: 0.5, y: 0.75, percentage: 0.5 },
      { x: 0.75, y: 0.875 },
      { x: 0.875, y: 0.9375 },
      { x: 1, y: 1, percentage: 1 },
    ],
  },
  {
    name: 'Ease Out',
    bezierPoints: [
      { x: 0, y: 0, percentage: 0 },
      { x: 0.125, y: 0.0625 },
      { x: 0.25, y: 0.125 },
      { x: 0.5, y: 0.25, percentage: 0.5 },
      { x: 0.42, y: 0.58 },
      { x: 0.58, y: 1 },
      { x: 1, y: 1, percentage: 1 },
    ],
  },
  {
    name: 'Ease In Out',
    bezierPoints: [
      { x: 0, y: 0, percentage: 0 },
      { x: 0.42, y: 0 },
      { x: 0.21, y: 0.21 },
      { x: 0.5, y: 0.5, percentage: 0.5 },
      { x: 0.79, y: 0.79 },
      { x: 0.58, y: 1 },
      { x: 1, y: 1, percentage: 1 },
    ],
  },
  {
    name: 'Sine In',
    bezierPoints: [
      { x: 0, y: 0, percentage: 0 },
      { x: 0.12, y: 0.015 },
      { x: 0.24, y: 0.06 },
      { x: 0.5, y: 0.293, percentage: 0.5 },
      { x: 0.76, y: 0.707 },
      { x: 0.88, y: 0.915 },
      { x: 1, y: 1, percentage: 1 },
    ],
  },
  {
    name: 'Sine Out',
    bezierPoints: [
      { x: 0, y: 0, percentage: 0 },
      { x: 0.12, y: 0.085 },
      { x: 0.24, y: 0.293 },
      { x: 0.5, y: 0.707, percentage: 0.5 },
      { x: 0.76, y: 0.94 },
      { x: 0.88, y: 0.985 },
      { x: 1, y: 1, percentage: 1 },
    ],
  },
  {
    name: 'Sine In Out',
    bezierPoints: [
      { x: 0, y: 0, percentage: 0 },
      { x: 0.215, y: 0.03 },
      { x: 0.285, y: 0.155 },
      { x: 0.5, y: 0.5, percentage: 0.5 },
      { x: 0.715, y: 0.845 },
      { x: 0.785, y: 0.97 },
      { x: 1, y: 1, percentage: 1 },
    ],
  },
  {
    name: 'Quad In',
    bezierPoints: [
      { x: 0, y: 0, percentage: 0 },
      { x: 0.33, y: 0 },
      { x: 0.33, y: 0.11 },
      { x: 0.5, y: 0.25, percentage: 0.5 },
      { x: 0.67, y: 0.45 },
      { x: 0.67, y: 0.67 },
      { x: 1, y: 1, percentage: 1 },
    ],
  },
  {
    name: 'Quad Out',
    bezierPoints: [
      { x: 0, y: 0, percentage: 0 },
      { x: 0.33, y: 0.33 },
      { x: 0.33, y: 0.55 },
      { x: 0.5, y: 0.75, percentage: 0.5 },
      { x: 0.67, y: 0.89 },
      { x: 0.67, y: 1 },
      { x: 1, y: 1, percentage: 1 },
    ],
  },
  {
    name: 'Quad In Out',
    bezierPoints: [
      { x: 0, y: 0, percentage: 0 },
      { x: 0.455, y: 0.03 },
      { x: 0.455, y: 0.455 },
      { x: 0.5, y: 0.5, percentage: 0.5 },
      { x: 0.545, y: 0.545 },
      { x: 0.545, y: 0.97 },
      { x: 1, y: 1, percentage: 1 },
    ],
  },
  {
    name: 'Cubic In',
    bezierPoints: [
      { x: 0, y: 0, percentage: 0 },
      { x: 0.32, y: 0 },
      { x: 0.32, y: 0.032 },
      { x: 0.5, y: 0.125, percentage: 0.5 },
      { x: 0.68, y: 0.315 },
      { x: 0.68, y: 0.68 },
      { x: 1, y: 1, percentage: 1 },
    ],
  },
  {
    name: 'Cubic Out',
    bezierPoints: [
      { x: 0, y: 0, percentage: 0 },
      { x: 0.32, y: 0.32 },
      { x: 0.32, y: 0.685 },
      { x: 0.5, y: 0.875, percentage: 0.5 },
      { x: 0.68, y: 0.968 },
      { x: 0.68, y: 1 },
      { x: 1, y: 1, percentage: 1 },
    ],
  },
  {
    name: 'Cubic In Out',
    bezierPoints: [
      { x: 0, y: 0, percentage: 0 },
      { x: 0.645, y: 0.045 },
      { x: 0.645, y: 0.645 },
      { x: 0.5, y: 0.5, percentage: 0.5 },
      { x: 0.355, y: 0.355 },
      { x: 0.355, y: 0.955 },
      { x: 1, y: 1, percentage: 1 },
    ],
  },
  {
    name: 'Bounce Out',
    bezierPoints: [
      { x: 0, y: 0, percentage: 0 },
      { x: 0.1, y: 0.15 },
      { x: 0.15, y: 0.85 },
      { x: 0.5, y: 0.95, percentage: 0.5 },
      { x: 0.75, y: 1.05 },
      { x: 0.85, y: 0.98 },
      { x: 1, y: 1, percentage: 1 },
    ],
  },
  {
    name: 'Elastic In',
    bezierPoints: [
      { x: 0, y: 0, percentage: 0 },
      { x: 0.2, y: 0.01 },
      { x: 0.3, y: -0.02 },
      { x: 0.5, y: 0.05, percentage: 0.5 },
      { x: 0.7, y: -0.1 },
      { x: 0.9, y: 0.5 },
      { x: 1, y: 1, percentage: 1 },
    ],
  },
  {
    name: 'Elastic Out',
    bezierPoints: [
      { x: 0, y: 0, percentage: 0 },
      { x: 0.1, y: 0.5 },
      { x: 0.3, y: 1.1 },
      { x: 0.5, y: 0.95, percentage: 0.5 },
      { x: 0.7, y: 1.02 },
      { x: 0.8, y: 0.99 },
      { x: 1, y: 1, percentage: 1 },
    ],
  },
  {
    name: 'Step Start',
    bezierPoints: [
      { x: 0, y: 0, percentage: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 1 },
      { x: 0.5, y: 1, percentage: 0.5 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 1, percentage: 1 },
    ],
  },
  {
    name: 'Step Middle',
    bezierPoints: [
      { x: 0, y: 0, percentage: 0 },
      { x: 0.33, y: 0 },
      { x: 0.33, y: 0 },
      { x: 0.5, y: 0.5, percentage: 0.5 },
      { x: 0.67, y: 1 },
      { x: 0.67, y: 1 },
      { x: 1, y: 1, percentage: 1 },
    ],
  },
  {
    name: 'Step End',
    bezierPoints: [
      { x: 0, y: 0, percentage: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0.5, y: 0, percentage: 0.5 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 1, y: 1, percentage: 1 },
    ],
  },
  {
    name: 'Inverse Linear',
    bezierPoints: [
      { x: 0, y: 1, percentage: 0 },
      { x: 0.1666, y: 0.8333 },
      { x: 0.3333, y: 0.6666 },
      { x: 0.5, y: 0.5, percentage: 0.5 },
      { x: 0.6666, y: 0.3333 },
      { x: 0.8333, y: 0.1666 },
      { x: 1, y: 0, percentage: 1 },
    ],
  },
  {
    name: 'Wave Up Down',
    bezierPoints: [
      { x: 0, y: 0, percentage: 0 },
      { x: 0.3333, y: 0 },
      { x: 0.1666, y: 1 },
      { x: 0.5, y: 1, percentage: 0.5 },
      { x: 0.8333, y: 1 },
      { x: 0.6666, y: 0 },
      { x: 1, y: 0, percentage: 1 },
    ],
  },
  {
    name: 'Peak Middle',
    bezierPoints: [
      { x: 0, y: 0, percentage: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 1 },
      { x: 0.5, y: 1, percentage: 0.5 },
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 0, percentage: 1 },
    ],
  },
];
