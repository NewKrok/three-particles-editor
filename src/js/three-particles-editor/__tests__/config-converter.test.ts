import { convertToNewFormat } from '../config-converter';
import { LifeTimeCurve } from '@newkrok/three-particles';

describe('config-converter', () => {
  describe('convertToNewFormat', () => {
    test('should convert simple number values to Constant format', () => {
      const oldConfig = {
        startDelay: 1.0,
        startSpeed: 2.0,
        startSize: 1.0,
        startRotation: 0,
        startOpacity: 1.0,
      };

      const newConfig = convertToNewFormat(oldConfig);

      // In the new format, simple numbers remain as Constant values
      expect(newConfig.startDelay).toBe(1.0);
      expect(newConfig.startSpeed).toBe(2.0);
      expect(newConfig.startSize).toBe(1.0);
      expect(newConfig.startRotation).toBe(0);
      expect(newConfig.startOpacity).toBe(1.0);
    });

    test('should convert min-max objects to RandomBetweenTwoConstants format', () => {
      const oldConfig = {
        startDelay: { min: 1.0, max: 2.0 },
        startSpeed: { min: 2.0, max: 3.0 },
        startSize: { min: 0.5, max: 1.5 },
        startRotation: { min: 0, max: 360 },
        startOpacity: { min: 0.5, max: 1.0 },
      };

      const newConfig = convertToNewFormat(oldConfig);

      // In the new format, min-max objects become RandomBetweenTwoConstants
      expect(newConfig.startDelay).toEqual({ min: 1.0, max: 2.0 });
      expect(newConfig.startSpeed).toEqual({ min: 2.0, max: 3.0 });
      expect(newConfig.startSize).toEqual({ min: 0.5, max: 1.5 });
      expect(newConfig.startRotation).toEqual({ min: 0, max: 360 });
      expect(newConfig.startOpacity).toEqual({ min: 0.5, max: 1.0 });
    });

    test('should handle objects with only min property', () => {
      const oldConfig = {
        startSpeed: { min: 0.5 },
        startSize: { min: 0.1 },
      };

      const newConfig = convertToNewFormat(oldConfig);

      // When only min is provided, it should be used as a constant
      expect(newConfig.startSpeed).toBe(0.5);
      expect(newConfig.startSize).toBe(0.1);
    });

    test('should handle objects with only max property', () => {
      const oldConfig = {
        startSpeed: { max: 3.0 },
        startSize: { max: 1.5 },
      };

      const newConfig = convertToNewFormat(oldConfig);

      // When only max is provided, it should be used as a constant
      expect(newConfig.startSpeed).toBe(3.0);
      expect(newConfig.startSize).toBe(1.5);
    });

    test('should handle velocityOverLifetime with only max property', () => {
      const oldConfig = {
        velocityOverLifetime: {
          isActive: true,
          orbital: {
            y: { max: 5 },
          },
        },
      };

      const newConfig = convertToNewFormat(oldConfig);

      // For orbital velocity, when only max is provided, it should preserve the range from 0 to max
      expect(newConfig.velocityOverLifetime.isActive).toBe(true);
      expect(newConfig.velocityOverLifetime.orbital.y).toEqual({ min: 0, max: 5 });
    });

    test('should update startLifetime from 2.0 to 5.0', () => {
      const oldConfig = {
        startLifetime: 2.0,
      };

      const newConfig = convertToNewFormat(oldConfig);

      // The default startLifetime changed from 2.0 to 5.0 in v2.0.0
      expect(newConfig.startLifetime).toBe(5.0);
    });

    test('should update startLifetime with min=max=2.0 to 5.0', () => {
      const oldConfig = {
        startLifetime: { min: 2.0, max: 2.0 },
      };

      const newConfig = convertToNewFormat(oldConfig);

      // The default startLifetime changed from 2.0 to 5.0 in v2.0.0
      expect(newConfig.startLifetime).toBe(5.0);
    });

    test('should not update custom startLifetime values', () => {
      const oldConfig = {
        startLifetime: 3.0,
      };

      const newConfig = convertToNewFormat(oldConfig);

      // Custom startLifetime values should remain unchanged
      expect(newConfig.startLifetime).toBe(3.0);
    });

    test('should convert sizeOverLifetime with bezierPoints to lifetimeCurve format', () => {
      const oldConfig = {
        sizeOverLifetime: {
          isActive: true,
          bezierPoints: [
            { x: 0, y: 0, percentage: 0 },
            { x: 0.5, y: 0.8, percentage: 0.5 },
            { x: 1, y: 1, percentage: 1 },
          ],
        },
      };

      const newConfig = convertToNewFormat(oldConfig);

      // In the new format, bezierPoints are inside a lifetimeCurve object
      expect(newConfig.sizeOverLifetime).toEqual({
        isActive: true,
        lifetimeCurve: {
          type: LifeTimeCurve.BEZIER,
          bezierPoints: [
            { x: 0, y: 0, percentage: 0 },
            { x: 0.5, y: 0.8, percentage: 0.5 },
            { x: 1, y: 1, percentage: 1 },
          ],
        },
      });
    });

    test('should handle sizeOverLifetime without isActive property', () => {
      const oldConfig = {
        sizeOverLifetime: {
          bezierPoints: [
            { x: 0, y: 0, percentage: 0 },
            { x: 0.5, y: 0.8, percentage: 0.5 },
            { x: 1, y: 1, percentage: 1 },
          ],
        },
      };

      const newConfig = convertToNewFormat(oldConfig);

      // Should set isActive to true if bezierPoints exist
      expect(newConfig.sizeOverLifetime).toEqual({
        isActive: true,
        lifetimeCurve: {
          type: LifeTimeCurve.BEZIER,
          bezierPoints: [
            { x: 0, y: 0, percentage: 0 },
            { x: 0.5, y: 0.8, percentage: 0.5 },
            { x: 1, y: 1, percentage: 1 },
          ],
        },
      });
    });

    test('should convert opacityOverLifetime with bezierPoints to lifetimeCurve format', () => {
      const oldConfig = {
        opacityOverLifetime: {
          isActive: true,
          bezierPoints: [
            { x: 0, y: 0, percentage: 0 },
            { x: 0.5, y: 0.8, percentage: 0.5 },
            { x: 1, y: 1, percentage: 1 },
          ],
        },
      };

      const newConfig = convertToNewFormat(oldConfig);

      // In the new format, bezierPoints are inside a lifetimeCurve object
      expect(newConfig.opacityOverLifetime).toEqual({
        isActive: true,
        lifetimeCurve: {
          type: LifeTimeCurve.BEZIER,
          bezierPoints: [
            { x: 0, y: 0, percentage: 0 },
            { x: 0.5, y: 0.8, percentage: 0.5 },
            { x: 1, y: 1, percentage: 1 },
          ],
        },
      });
    });

    test('should handle opacityOverLifetime without isActive property', () => {
      const oldConfig = {
        opacityOverLifetime: {
          bezierPoints: [
            { x: 0, y: 0, percentage: 0 },
            { x: 0.5, y: 0.8, percentage: 0.5 },
            { x: 1, y: 1, percentage: 1 },
          ],
        },
      };

      const newConfig = convertToNewFormat(oldConfig);

      // Should set isActive to true if bezierPoints exist
      expect(newConfig.opacityOverLifetime).toEqual({
        isActive: true,
        lifetimeCurve: {
          type: LifeTimeCurve.BEZIER,
          bezierPoints: [
            { x: 0, y: 0, percentage: 0 },
            { x: 0.5, y: 0.8, percentage: 0.5 },
            { x: 1, y: 1, percentage: 1 },
          ],
        },
      });
    });

    test('should convert rotationOverLifetime with min/max to the new format', () => {
      const oldConfig = {
        rotationOverLifetime: {
          isActive: true,
          min: -180,
          max: 180,
        },
      };

      const newConfig = convertToNewFormat(oldConfig);

      // rotationOverLifetime should maintain its structure
      expect(newConfig.rotationOverLifetime).toEqual({
        isActive: true,
        min: -180,
        max: 180,
      });
    });

    test('should handle complex configuration with multiple properties', () => {
      const oldConfig = {
        startLifetime: 2.0,
        startSpeed: { min: 1.0, max: 3.0 },
        startSize: 1.0,
        sizeOverLifetime: {
          isActive: true,
          bezierPoints: [
            { x: 0, y: 0, percentage: 0 },
            { x: 1, y: 1, percentage: 1 },
          ],
        },
        opacityOverLifetime: {
          isActive: true,
          bezierPoints: [
            { x: 0, y: 0, percentage: 0 },
            { x: 1, y: 1, percentage: 1 },
          ],
        },
      };

      const newConfig = convertToNewFormat(oldConfig);

      // Check all converted properties
      expect(newConfig.startLifetime).toBe(5.0);
      expect(newConfig.startSpeed).toEqual({ min: 1.0, max: 3.0 });
      expect(newConfig.startSize).toBe(1.0);
      expect(newConfig.sizeOverLifetime).toEqual({
        isActive: true,
        lifetimeCurve: {
          type: LifeTimeCurve.BEZIER,
          bezierPoints: [
            { x: 0, y: 0, percentage: 0 },
            { x: 1, y: 1, percentage: 1 },
          ],
        },
      });
      expect(newConfig.opacityOverLifetime).toEqual({
        isActive: true,
        lifetimeCurve: {
          type: LifeTimeCurve.BEZIER,
          bezierPoints: [
            { x: 0, y: 0, percentage: 0 },
            { x: 1, y: 1, percentage: 1 },
          ],
        },
      });
    });
  });
});
