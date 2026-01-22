/**
 * Gradient Editor - Bezier Conversion Utilities
 *
 * Converts between gradient stops and bezier curves for particle system configuration.
 */

export type GradientStop = {
  position: number; // 0-1 (lifetime percentage)
  color: {
    r: number; // 0-255
    g: number; // 0-255
    b: number; // 0-255
    a: number; // 0-255 (opacity/alpha)
  };
};

export type BezierPoint = {
  x: number; // 0-1 (position in lifetime)
  y: number; // 0-1 (normalized value)
  percentage?: number; // Key point percentage
};

export type BezierCurve = {
  type: 'BEZIER';
  scale: number;
  bezierPoints: BezierPoint[];
};

/**
 * Converts a single channel (r, g, b, or a) from gradient stops to a bezier curve
 *
 * @param stops Array of gradient stops
 * @param channel Which color channel to extract ('r', 'g', 'b', 'a')
 * @returns Bezier curve configuration for the channel
 */
export const gradientChannelToBezier = (
  stops: GradientStop[],
  channel: 'r' | 'g' | 'b' | 'a'
): BezierCurve => {
  // Sort stops by position
  const sortedStops = [...stops].sort((a, b) => a.position - b.position);

  // Ensure we have at least 2 stops
  if (sortedStops.length < 2) {
    throw new Error('Gradient must have at least 2 stops');
  }

  const bezierPoints: BezierPoint[] = [];
  // All channels use 0-255 range in the gradient editor UI,
  // but bezier curves need 0-1 range with scale: 1
  const scale = 255; // Convert from 0-255 to 0-1

  sortedStops.forEach((stop, index) => {
    const value = stop.color[channel];
    const normalizedValue = value / scale; // Normalize to 0-1

    if (index === 0) {
      // First point - no left control point
      bezierPoints.push({
        x: stop.position,
        y: normalizedValue,
        percentage: 0,
      });

      // Add right control point if there's a next stop
      if (sortedStops.length > 1) {
        const nextStop = sortedStops[1];
        const controlDistance = (nextStop.position - stop.position) / 3;
        bezierPoints.push({
          x: stop.position + controlDistance,
          y: normalizedValue,
        });
      }
    } else if (index === sortedStops.length - 1) {
      // Last point - no right control point
      const prevStop = sortedStops[index - 1];
      const controlDistance = (stop.position - prevStop.position) / 3;

      // Add left control point
      bezierPoints.push({
        x: stop.position - controlDistance,
        y: normalizedValue,
      });

      // Add the actual point
      bezierPoints.push({
        x: stop.position,
        y: normalizedValue,
        percentage: 1,
      });
    } else {
      // Middle point - has both left and right control points
      const prevStop = sortedStops[index - 1];
      const nextStop = sortedStops[index + 1];

      const leftControlDistance = (stop.position - prevStop.position) / 3;
      const rightControlDistance = (nextStop.position - stop.position) / 3;

      // Add left control point
      bezierPoints.push({
        x: stop.position - leftControlDistance,
        y: normalizedValue,
      });

      // Add the actual point
      bezierPoints.push({
        x: stop.position,
        y: normalizedValue,
        percentage: stop.position,
      });

      // Add right control point
      bezierPoints.push({
        x: stop.position + rightControlDistance,
        y: normalizedValue,
      });
    }
  });

  return {
    type: 'BEZIER',
    scale: 1, // Always use scale 1 for three-particles
    bezierPoints,
  };
};

/**
 * Converts gradient stops to RGB + Alpha bezier curves
 *
 * @param stops Array of gradient stops
 * @returns Object containing bezier curves for r, g, b, and alpha channels
 */
export const gradientToBezierCurves = (stops: GradientStop[]) => {
  return {
    r: gradientChannelToBezier(stops, 'r'),
    g: gradientChannelToBezier(stops, 'g'),
    b: gradientChannelToBezier(stops, 'b'),
    alpha: gradientChannelToBezier(stops, 'a'),
  };
};

/**
 * Samples a bezier curve at a specific position to get the value
 * Used for converting bezier curves back to gradient stops
 *
 * @param curve Bezier curve to sample
 * @param position Position to sample at (0-1)
 * @returns Sampled value (normalized 0-1)
 */
const sampleBezierCurve = (curve: BezierCurve, position: number): number => {
  const points = curve.bezierPoints;

  // Find the segment this position falls into
  let segmentStart = 0;
  for (let i = 0; i < points.length; i++) {
    if (points[i].percentage !== undefined && points[i].x <= position) {
      segmentStart = i;
    } else if (points[i].percentage !== undefined && points[i].x > position) {
      break;
    }
  }

  // Find the next key point
  let segmentEnd = segmentStart;
  for (let i = segmentStart + 1; i < points.length; i++) {
    if (points[i].percentage !== undefined) {
      segmentEnd = i;
      break;
    }
  }

  if (segmentStart === segmentEnd) {
    // Only one point or position is beyond all points
    return points[segmentStart].y;
  }

  // Get the bezier segment points (4 points for cubic bezier)
  const p0 = points[segmentStart];
  const p1 = points[segmentStart + 1];
  const p2 = points[segmentEnd - 1];
  const p3 = points[segmentEnd];

  // Calculate t (0-1) within this segment
  const t = (position - p0.x) / (p3.x - p0.x);

  // Cubic bezier formula for y value
  const mt = 1 - t;
  const y =
    mt * mt * mt * p0.y +
    3 * mt * mt * t * p1.y +
    3 * mt * t * t * p2.y +
    t * t * t * p3.y;

  return Math.max(0, Math.min(1, y)); // Clamp to 0-1
};

/**
 * Converts bezier curves back to gradient stops
 * Useful for loading legacy configs or editing existing curves
 *
 * @param rCurve Red channel bezier curve
 * @param gCurve Green channel bezier curve
 * @param bCurve Blue channel bezier curve
 * @param alphaCurve Alpha channel bezier curve
 * @param sampleCount Number of stops to generate (default: 5)
 * @returns Array of gradient stops
 */
export const bezierCurvesToGradient = (
  rCurve: BezierCurve,
  gCurve: BezierCurve,
  bCurve: BezierCurve,
  alphaCurve: BezierCurve,
  sampleCount: number = 5
): GradientStop[] => {
  const stops: GradientStop[] = [];

  // Sample the curves at regular intervals
  for (let i = 0; i < sampleCount; i++) {
    const position = i / (sampleCount - 1); // 0 to 1

    // Bezier curves are in 0-1 range, multiply by 255 for gradient editor UI
    const r = sampleBezierCurve(rCurve, position) * 255;
    const g = sampleBezierCurve(gCurve, position) * 255;
    const b = sampleBezierCurve(bCurve, position) * 255;
    const a = sampleBezierCurve(alphaCurve, position) * 255;

    stops.push({
      position,
      color: {
        r: Math.round(r),
        g: Math.round(g),
        b: Math.round(b),
        a: Math.round(a),
      },
    });
  }

  return stops;
};

/**
 * Creates default gradient stops (white to transparent white)
 */
export const getDefaultGradientStops = (): GradientStop[] => {
  return [
    {
      position: 0,
      color: { r: 255, g: 255, b: 255, a: 255 },
    },
    {
      position: 1,
      color: { r: 255, g: 255, b: 255, a: 0 },
    },
  ];
};
