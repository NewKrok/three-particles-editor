import { isConfigV2 } from '../config-util';

describe('isConfigV2', () => {
  // Test cases for v2.0.0+ configurations
  describe('v2.0.0+ configurations', () => {
    test('should identify config with lifetimeCurve in sizeOverLifetime as v2.0.0+', () => {
      const config = {
        sizeOverLifetime: {
          lifetimeCurve: {
            bezierPoints: [
              { x: 0, y: 0, percentage: 0 },
              { x: 1, y: 1, percentage: 1 },
            ],
          },
        },
      };
      expect(isConfigV2(config)).toBe(true);
    });

    test('should identify config with lifetimeCurve in opacityOverLifetime as v2.0.0+', () => {
      const config = {
        opacityOverLifetime: {
          lifetimeCurve: {
            bezierPoints: [
              { x: 0, y: 0, percentage: 0 },
              { x: 1, y: 1, percentage: 1 },
            ],
          },
        },
      };
      expect(isConfigV2(config)).toBe(true);
    });

    test('should identify config with textureSheetAnimation.startFrame containing min/max as v2.0.0+', () => {
      const config = {
        textureSheetAnimation: {
          startFrame: {
            min: 0,
            max: 10,
          },
        },
      };
      expect(isConfigV2(config)).toBe(true);
    });

    test('should identify config with velocityOverLifetime.linear.x containing min/max as v2.0.0+', () => {
      const config = {
        velocityOverLifetime: {
          linear: {
            x: { min: 0, max: 0 },
            y: { min: 0, max: 0 },
            z: { min: 0, max: 0 },
          },
        },
      };
      expect(isConfigV2(config)).toBe(true);
    });

    test('should identify default v2.0.0 config as v2.0.0+', () => {
      const config = {
        startLifetime: { min: 5, max: 5 },
        velocityOverLifetime: {
          linear: {
            x: { min: 0, max: 0 },
            y: { min: 0, max: 0 },
            z: { min: 0, max: 0 },
          },
        },
      };
      expect(isConfigV2(config)).toBe(true);
    });

    test('should identify config with consistent RandomBetweenTwoConstants structure as v2.0.0+', () => {
      const config = {
        startLifetime: { min: 2, max: 5 },
        startSpeed: { min: 1, max: 2 },
        startSize: { min: 1, max: 3 },
        startRotation: { min: 0, max: 360 },
      };
      expect(isConfigV2(config)).toBe(true);
    });
  });

  // Test cases for pre-v2.0.0 configurations
  describe('pre-v2.0.0 configurations', () => {
    test('should identify config with bezierPoints directly in sizeOverLifetime as pre-v2.0.0', () => {
      const config = {
        sizeOverLifetime: {
          isActive: true,
          bezierPoints: [
            { x: 0, y: 0, percentage: 0 },
            { x: 1, y: 1, percentage: 1 },
          ],
        },
      };
      expect(isConfigV2(config)).toBe(false);
    });

    test('should identify config with bezierPoints directly in opacityOverLifetime as pre-v2.0.0', () => {
      const config = {
        opacityOverLifetime: {
          isActive: true,
          bezierPoints: [
            { x: 0, y: 0, percentage: 0 },
            { x: 1, y: 1, percentage: 1 },
          ],
        },
      };
      expect(isConfigV2(config)).toBe(false);
    });

    test('should identify config with rotationOverLifetime having min/max but no lifetimeCurve as pre-v2.0.0', () => {
      const config = {
        rotationOverLifetime: {
          isActive: true,
          min: -17,
          max: 11.7,
        },
      };
      expect(isConfigV2(config)).toBe(false);
    });

    test('should identify config with textureSheetAnimation.startFrame missing min property as pre-v2.0.0', () => {
      const config = {
        textureSheetAnimation: {
          startFrame: {
            max: 10,
          },
        },
      };
      expect(isConfigV2(config)).toBe(false);
    });

    test('should identify SMOKE_2 example config as pre-v2.0.0', () => {
      const config = JSON.parse(
        '{"duration":0.36,"startLifetime":{"min":0.94,"max":5.88},"startSpeed":{"min":0,"max":0},"startSize":{"min":34.19,"max":42.42},"startRotation":{"min":-360,"max":360},"simulationSpace":"WORLD","maxParticles":150,"emission":{"rateOverTime":0,"rateOverDistance":8},"shape":{"shape":"CONE","cone":{"angle":16.8097,"radius":0.1},"rectangle":{"scale":{"x":0.5,"y":1.8}}},"renderer":{"blending":"THREE.AdditiveBlending"},"sizeOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":0.245,"percentage":0},{"x":0.1666,"y":0.4116},{"x":0.3766,"y":0.2182},{"x":0.5433,"y":0.385,"percentage":0.5433},{"x":0.7099,"y":0.5516},{"x":0.8333,"y":0.8333},{"x":1,"y":1,"percentage":1}]},"opacityOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":1,"percentage":0},{"x":0.1666,"y":0.8333},{"x":0.3333,"y":0.6666},{"x":0.5,"y":0.5,"percentage":0.5},{"x":0.6666,"y":0.3332},{"x":0.8333,"y":0.1665},{"x":1,"y":0,"percentage":1}]},"rotationOverLifetime":{"isActive":true,"min":-17,"max":11.7},"noise":{"isActive":true,"strength":0.3,"positionAmount":0.103},"_editorData":{"textureId":"CLOUD","simulation":{"movements":"INFINITE_SYMBOL","movementSpeed":3.9,"rotation":"FOLLOW_THE_MOVEMENT","rotationSpeed":0},"showLocalAxes":true,"showWorldAxes":false,"frustumCulled":true,"terrain":{"textureId":"WIREFRAME","movements":"DISABLED","movementSpeed":1,"rotation":"DISABLED","rotationSpeed":1}}}'
      );
      expect(isConfigV2(config)).toBe(false);
    });

    test('should identify COLLECT_ITEM example config as pre-v2.0.0', () => {
      const config = JSON.parse(
        '{"transform":{"rotation":{"x":-90}},"duration":0.2,"looping":false,"startLifetime":{"min":0.3,"max":0.8},"startSpeed":{"min":0.5},"startSize":{"min":0.1,"max":1.5},"startColor":{"min":{"r":0.596078431372549,"g":0.08235294117647059,"b":0.9372549019607843},"max":{"g":0,"b":0.8666666666666667}},"maxParticles":30,"emission":{"rateOverTime":200},"shape":{"sphere":{"radius":0.4},"cone":{"angle":17.5967,"radius":0.1}},"renderer":{"blending":"THREE.NormalBlending"},"velocityOverLifetime":{"isActive":true,"orbital":{"y":{"max":5}}},"sizeOverLifetime":{"bezierPoints":[{"x":0,"y":0,"percentage":0},{"x":0.3333,"y":0},{"x":0.1666,"y":1},{"x":0.5,"y":1,"percentage":0.5},{"x":0.8333,"y":1},{"x":0.6666,"y":0},{"x":1,"y":0,"percentage":1}]},"opacityOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":0,"percentage":0},{"x":0,"y":1},{"x":0,"y":1},{"x":0.5,"y":1,"percentage":0.5},{"x":1,"y":1},{"x":1,"y":1},{"x":1,"y":0,"percentage":1}]},"_editorData":{"textureId":"POINT","simulation":{"movements":"DISABLED","movementSpeed":1,"rotation":"DISABLED","rotationSpeed":1},"showLocalAxes":false,"showWorldAxes":false,"frustumCulled":true,"terrain":{"textureId":"WIREFRAME","movements":"DISABLED","movementSpeed":1,"rotation":"DISABLED","rotationSpeed":1}}}'
      );
      expect(isConfigV2(config)).toBe(false);
    });
  });

  // Edge cases and mixed configurations
  describe('edge cases and mixed configurations', () => {
    test('should handle empty config', () => {
      const config = {};
      expect(isConfigV2(config)).toBe(false);
    });

    test('should handle null or undefined config', () => {
      expect(isConfigV2(null as any)).toBe(false);
      expect(isConfigV2(undefined as any)).toBe(false);
    });

    test('should identify mixed config with both v1.x and v2.x features as pre-v2.0.0 for safety', () => {
      const config = {
        sizeOverLifetime: {
          lifetimeCurve: {
            bezierPoints: [
              { x: 0, y: 0, percentage: 0 },
              { x: 1, y: 1, percentage: 1 },
            ],
          },
        },
        opacityOverLifetime: {
          isActive: true,
          bezierPoints: [
            { x: 0, y: 0, percentage: 0 },
            { x: 1, y: 1, percentage: 1 },
          ],
        },
      };
      // This is a mixed config, but we should identify it as pre-v2.0.0 for safety
      expect(isConfigV2(config)).toBe(false);
    });
  });
});
