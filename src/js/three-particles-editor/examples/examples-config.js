const FALLING_LEAVES =
  '{"transform":{"position":{"y":1.5},"rotation":{"x":90}},"startLifetime":{"min":5,"max":7},"startSpeed":{"min":0,"max":0.1},"startSize":{"min":3.11,"max":5.86},"startRotation":{"min":-360,"max":360},"gravity":0.001,"maxParticles":10,"emission":{"rateOverTime":2},"shape":{"shape":"CONE","cone":{"angle":0,"radius":0.4687}},"renderer":{"blending":"THREE.NormalBlending"},"sizeOverLifetime":{"bezierPoints":[{"x":0,"y":0,"percentage":0},{"x":1,"y":1,"percentage":1}]},"opacityOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":0,"percentage":0},{"x":0.10333333333333333,"y":0.995},{"x":0.023333333333333334,"y":0.975},{"x":0.79,"y":0.9299999999999999,"percentage":0.79},{"x":0.9099046666666667,"y":0.9229621},{"x":0.8333333333333334,"y":0.015000000000000013},{"x":1,"y":0,"percentage":1}]},"noise":{"isActive":true,"useRandomOffset":true,"strength":0.11,"frequency":0.246,"positionAmount":0.628,"rotationAmount":2.989},"_editorData":{"textureId":"LEAF_TOON"}}';

const HEALING =
  '{"startLifetime":{"min":1,"max":1.2},"startSpeed":{"min":0.5,"max":0.8},"startSize":{"min":2.81,"max":12.62},"startRotation":{"min":-360,"max":360},"maxParticles":10,"shape":{"sphere":{"radius":0.5218},"cone":{"angle":21.6024,"radius":0.4687}},"sizeOverLifetime":{"isActive":true,"curveFunction":"ELASTIC_OUT"},"opacityOverLifetime":{"isActive":true,"curveFunction":"EXPONENTIAL_OUT"},"_editorData":{"textureId":"PLUS_TOON"}}';

const SNOW =
  '{"transform":{"position":{"y":4},"rotation":{"x":90}},"startLifetime":{"min":1.49,"max":2.86},"startSize":{"min":1.03,"max":1.92},"startRotation":{"min":-360,"max":360},"startColor":{"min":{"r":0.803921568627451,"g":0.8156862745098039,"b":0.9764705882352941}},"gravity":0.009,"maxParticles":198,"emission":{"rateOverTime":42},"shape":{"shape":"RECTANGLE","sphere":{"radius":2.9127},"rectangle":{"scale":{"x":7.682,"y":7.504}}},"renderer":{"blending":"THREE.NormalBlending"},"rotationOverLifetime":{"isActive":true,"min":-170.2,"max":231.9},"noise":{"isActive":true,"useRandomOffset":true,"strength":0.27,"frequency":0.206},"_editorData":{"textureId":"SNOWFLAKE"}}';

const SMOKE =
  '{"transform":{"rotation":{"x":-90}},"startLifetime":{"min":4.23,"max":7.25},"startSpeed":{"min":0.31,"max":0.58},"startSize":{"min":18.86,"max":26.89},"startRotation":{"min":-360,"max":360},"startOpacity":{"min":0.141,"max":0.296},"shape":{"shape":"CONE","sphere":{"radius":0.4687},"cone":{"angle":0,"radius":0.3813}},"renderer":{"blending":"THREE.NormalBlending"},"opacityOverLifetime":{"isActive":true,"curveFunction":"CUBIC_OUT"},"rotationOverLifetime":{"isActive":true,"min":-22.4,"max":24.3},"noise":{"isActive":true,"useRandomOffset":true,"strength":0.09,"positionAmount":0.191,"rotationAmount":2.202,"sizeAmount":1.24},"_editorData":{"textureId":"CLOUD"}}';

export const examples = [
  {
    name: "Falling leaves",
    preview: "https://picsum.photos/640/480",
    config: FALLING_LEAVES,
  },
  {
    name: "Healing",
    preview: "https://picsum.photos/640/480",
    config: HEALING,
  },
  {
    name: "Healing",
    preview: "https://picsum.photos/640/480",
    config: HEALING,
  },
  {
    name: "Snow",
    preview: "https://picsum.photos/640/480",
    config: SNOW,
  },
  {
    name: "Smoke",
    preview: "https://picsum.photos/640/480",
    config: SMOKE,
  },
];
