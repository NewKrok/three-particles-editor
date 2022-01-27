const FALLING_LEAVES =
  '{"transform":{"position":{"y":1.5},"rotation":{"x":90}},"startLifetime":{"min":5,"max":7},"startSpeed":{"min":0,"max":0.1},"startSize":{"min":3.11,"max":5.86},"startRotation":{"min":-360,"max":360},"gravity":0.001,"maxParticles":10,"emission":{"rateOverTime":2},"shape":{"shape":"CONE","cone":{"angle":0,"radius":0.4687}},"renderer":{"blending":"THREE.NormalBlending"},"sizeOverLifetime":{"bezierPoints":[{"x":0,"y":0,"percentage":0},{"x":1,"y":1,"percentage":1}]},"opacityOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":0,"percentage":0},{"x":0.0033,"y":1.01},{"x":0.0492,"y":0.9818},{"x":0.2133,"y":0.985,"percentage":0.2133},{"x":0.99,"y":1},{"x":0.9933,"y":0.985},{"x":1,"y":0,"percentage":1}]},"noise":{"isActive":true,"useRandomOffset":true,"strength":0.11,"frequency":0.246,"positionAmount":0.628,"rotationAmount":2.989},"_editorData":{"textureId":"LEAF_TOON"}}';

const HEALING =
  '{"startLifetime":{"min":1,"max":1.2},"startSpeed":{"min":0.1,"max":0.3},"startSize":{"min":1.29,"max":5.86},"startRotation":{"min":-15,"max":15},"gravity":-0.008,"maxParticles":10,"emission":{"rateOverTime":6},"shape":{"sphere":{"radius":0.2939},"cone":{"angle":21.6024,"radius":0.4687}},"sizeOverLifetime":{"isActive":true,"curveFunction":"ELASTIC_OUT","bezierPoints":[{"x":0,"y":0,"percentage":0},{"x":1,"y":1,"percentage":1}]},"opacityOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":0,"percentage":0},{"x":0.3333,"y":0},{"x":0.1666,"y":1},{"x":0.5,"y":1,"percentage":0.5},{"x":0.8333,"y":1},{"x":0.6666,"y":0},{"x":1,"y":0,"percentage":1}]},"noise":{"isActive":true,"useRandomOffset":true,"strength":0.11,"positionAmount":0.453,"sizeAmount":5},"_editorData":{"textureId":"PLUS_TOON"}}';

const SNOWFALL =
  '{"transform":{"position":{"y":4},"rotation":{"x":90}},"startLifetime":{"min":1.49,"max":2.86},"startSize":{"min":1.03,"max":1.92},"startRotation":{"min":-360,"max":360},"startColor":{"min":{"r":0.803921568627451,"g":0.8156862745098039,"b":0.9764705882352941}},"gravity":0.009,"maxParticles":200,"emission":{"rateOverTime":50},"shape":{"shape":"RECTANGLE","sphere":{"radius":2.9127},"rectangle":{"scale":{"x":7.682,"y":7.504}}},"renderer":{"blending":"THREE.NormalBlending"},"sizeOverLifetime":{"bezierPoints":[{"x":0,"y":0,"percentage":0},{"x":1,"y":1,"percentage":1}]},"opacityOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":0.41,"percentage":0},{"x":0.0566,"y":1.01},{"x":0.05,"y":0.985},{"x":0.62,"y":0.99,"percentage":0.62},{"x":1.0499,"y":0.9937},{"x":0.9866,"y":0.95},{"x":1,"y":0,"percentage":1}]},"rotationOverLifetime":{"isActive":true,"min":-170.2,"max":231.9},"noise":{"isActive":true,"useRandomOffset":true,"strength":0.27,"frequency":0.206},"_editorData":{"textureId":"SNOWFLAKE"}}';

const SMOKE =
  '{"transform":{"rotation":{"x":-90}},"startLifetime":{"min":4.23,"max":7.25},"startSpeed":{"min":0.31,"max":0.58},"startSize":{"min":28.71,"max":36.02},"startRotation":{"min":-360,"max":360},"startOpacity":{"min":0.141,"max":0.296},"shape":{"shape":"CONE","sphere":{"radius":0.4687},"cone":{"angle":0,"radius":0.3813}},"renderer":{"blending":"THREE.NormalBlending"},"sizeOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":0.625,"percentage":0},{"x":0.2666,"y":0.845},{"x":0.3596,"y":0.4551},{"x":0.5066,"y":0.49,"percentage":0.5066},{"x":0.6966,"y":0.5349},{"x":0.6366,"y":0.99},{"x":1,"y":1,"percentage":1}]},"opacityOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":0.0799,"percentage":0},{"x":0.0666,"y":0.85},{"x":0.1674,"y":1.0337},{"x":0.5,"y":1,"percentage":0.5},{"x":0.9933,"y":0.95},{"x":0.9966,"y":0.96},{"x":1,"y":0,"percentage":1}]},"rotationOverLifetime":{"isActive":true,"min":-22.4,"max":24.3},"noise":{"isActive":true,"useRandomOffset":true,"strength":0.09,"positionAmount":0.191,"rotationAmount":1.677},"_editorData":{"textureId":"CLOUD"}}';

export const examples = [
  {
    name: "Falling leaves",
    preview: "./assets/examples/effects/falling-leaves.webp",
    config: FALLING_LEAVES,
  },
  {
    name: "Healing",
    preview: "./assets/examples/effects/healing.webp",
    config: HEALING,
  },
  {
    name: "Snowfall",
    preview: "./assets/examples/effects/snowfall.webp",
    config: SNOWFALL,
  },
  {
    name: "Smoke",
    preview: "./assets/examples/effects/smoke.webp",
    config: SMOKE,
  },
];
