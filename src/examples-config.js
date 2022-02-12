const FIRE =
  '{"transform":{"rotation":{"x":-90}},"duration":0.5,"startLifetime":{"min":0.2,"max":1},"startSpeed":{"max":2.2},"startSize":{"min":9.51,"max":19.57},"startRotation":{"min":-360,"max":360},"startColor":{"min":{"r":0.9725490196078431,"g":0.050980392156862744,"b":0.050980392156862744},"max":{"r":0.9921568627450981,"g":0.7803921568627451,"b":0.03137254901960784}},"gravity":-0.02,"emission":{"rateOverTime":200},"shape":{"shape":"CONE","sphere":{"radius":0.4,"arc":180},"cone":{"angle":0,"radius":0.3813}},"renderer":{"blending":"THREE.NormalBlending"},"sizeOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":0,"percentage":0},{"x":0,"y":1},{"x":0,"y":1},{"x":0.5,"y":1,"percentage":0.5},{"x":1,"y":1},{"x":1,"y":1},{"x":1,"y":0,"percentage":1}]},"opacityOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":1,"percentage":0},{"x":0.1666,"y":0.8333},{"x":0.3333,"y":0.6666},{"x":0.5,"y":0.5,"percentage":0.5},{"x":0.6666,"y":0.3332},{"x":0.8333,"y":0.1665},{"x":1,"y":0,"percentage":1}]},"rotationOverLifetime":{"isActive":true,"min":-22.4,"max":24.3},"noise":{"isActive":true,"useRandomOffset":true,"strength":0.09,"positionAmount":0.191,"rotationAmount":1.677},"_editorData":{"textureId":"FLAME","simulation":{"movements":"DISABLED","movementSpeed":1},"showLocalAxes":false,"showWorldAxes":false,"terrain":{"textureId":"WIREFRAME","movements":"DISABLED","movementSpeed":1}}}';

const EXPLOSION_SMOKE =
  '{"duration":1,"looping":false,"startLifetime":{"min":0.67,"max":2.86},"startSpeed":{"max":2.2},"startSize":{"min":35,"max":60},"startRotation":{"min":-360,"max":360},"startColor":{"min":{"r":0.1,"g":0.1,"b":0.1},"max":{"r":0.2,"g":0.2,"b":0.2}},"gravity":-0.004,"emission":{"rateOverTime":500},"shape":{"sphere":{"radius":0.4,"arc":180}},"renderer":{"blending":"THREE.NormalBlending"},"sizeOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":0,"percentage":0},{"x":0,"y":1},{"x":0,"y":1},{"x":0.5,"y":1,"percentage":0.5},{"x":1,"y":1},{"x":1,"y":1},{"x":1,"y":0,"percentage":1}]},"opacityOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":1,"percentage":0},{"x":0.1666,"y":0.8333},{"x":0.3333,"y":0.6666},{"x":0.5,"y":0.5,"percentage":0.5},{"x":0.6666,"y":0.3332},{"x":0.8333,"y":0.1665},{"x":1,"y":0,"percentage":1}]},"rotationOverLifetime":{"isActive":true,"min":-22.4,"max":24.3},"noise":{"isActive":true,"useRandomOffset":true,"strength":0.09,"positionAmount":0.191,"rotationAmount":1.677},"_editorData":{"textureId":"CLOUD","simulation":{"movements":"DISABLED","movementSpeed":1},"showLocalAxes":false,"showWorldAxes":false,"terrain":{"textureId":"TERRAIN_DIRT","movements":"DISABLED","movementSpeed":1}}}';

const FIREFLIES =
  '{"transform":{"position":{"y":2}},"startLifetime":{"min":1,"max":4},"startSpeed":{"min":0,"max":0},"startSize":{"min":0.5,"max":0.9},"startRotation":{"min":-360,"max":360},"startColor":{"min":{"r":0.6274509803921569,"g":0.7568627450980392,"b":0.2784313725490196},"max":{"r":0.4392156862745098,"g":0.5176470588235295,"b":0.1803921568627451}},"maxParticles":200,"emission":{"rateOverTime":50},"shape":{"shape":"BOX","sphere":{"radius":2.9127},"rectangle":{"scale":{"x":7.682,"y":7.504}},"box":{"scale":{"x":10,"y":4,"z":10}}},"renderer":{"blending":"THREE.NormalBlending"},"sizeOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":0,"percentage":0},{"x":0,"y":1},{"x":0,"y":1},{"x":0.5,"y":1,"percentage":0.5},{"x":1,"y":1},{"x":1,"y":1},{"x":1,"y":0,"percentage":1}]},"opacityOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":0,"percentage":0},{"x":0.3333,"y":0},{"x":0.1666,"y":1},{"x":0.5,"y":1,"percentage":0.5},{"x":0.8333,"y":1},{"x":0.6666,"y":0},{"x":1,"y":0,"percentage":1}]},"rotationOverLifetime":{"isActive":true,"min":-170.2,"max":231.9},"noise":{"isActive":true,"useRandomOffset":true,"strength":0.13,"frequency":0.206,"positionAmount":-0.072},"_editorData":{"textureId":"GRADIENT_POINT","simulation":{"movements":"DISABLED","movementSpeed":1},"showLocalAxes":false,"showWorldAxes":false,"terrain":{"textureId":"WIREFRAME","movements":"DISABLED","movementSpeed":1}}}';

const FIRE_PROJECTILE =
  '{"startLifetime":{"min":0.4,"max":0.8},"startSpeed":{"min":0,"max":0},"startSize":{"min":3,"max":4},"startColor":{"min":{"r":0.9725490196078431,"g":0.050980392156862744,"b":0.050980392156862744},"max":{"r":0.9921568627450981,"g":0.7803921568627451,"b":0.03137254901960784}},"simulationSpace":"WORLD","emission":{"rateOverTime":0,"rateOverDistance":27},"shape":{"sphere":{"radius":0.1}},"renderer":{"blending":"THREE.AdditiveBlending"},"sizeOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":1,"percentage":0},{"x":0.1666,"y":0.8333},{"x":0.3333,"y":0.6666},{"x":0.5,"y":0.5,"percentage":0.5},{"x":0.6666,"y":0.3332},{"x":0.8333,"y":0.1665},{"x":1,"y":0,"percentage":1}]},"opacityOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":1,"percentage":0},{"x":0.1666,"y":0.8333},{"x":0.3333,"y":0.6666},{"x":0.5,"y":0.5,"percentage":0.5},{"x":0.6666,"y":0.3332},{"x":0.8333,"y":0.1665},{"x":1,"y":0,"percentage":1}]},"noise":{"isActive":true,"useRandomOffset":true,"strength":0.27,"frequency":0.114,"positionAmount":0.278},"_editorData":{"textureId":"GRADIENT_POINT","simulation":{"movements":"PROJECTILE_STRAIGHT"},"showLocalAxes":false,"showWorldAxes":false,"terrain":{"textureId":"WIREFRAME","movements":"DISABLED"}}}';

const LEAF_PROJECTILE =
  '{"startLifetime":{"min":0.3,"max":0.5},"startSpeed":{"min":0.1},"startSize":{"min":4,"max":8},"startRotation":{"min":-360,"max":360},"gravity":0.007,"simulationSpace":"WORLD","emission":{"rateOverTime":26},"shape":{"sphere":{"radius":0.1}},"renderer":{"blending":"THREE.NormalBlending"},"sizeOverLifetime":{"bezierPoints":[{"x":0,"y":0,"percentage":0},{"x":1,"y":1,"percentage":1}]},"opacityOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":1,"percentage":0},{"x":0.1666,"y":0.8333},{"x":0.3333,"y":0.6666},{"x":0.5,"y":0.5,"percentage":0.5},{"x":0.6666,"y":0.3332},{"x":0.8333,"y":0.1665},{"x":1,"y":0,"percentage":1}]},"rotationOverLifetime":{"isActive":true,"min":-151,"max":164.9},"_editorData":{"textureId":"LEAF_TOON","simulation":{"movements":"PROJECTILE_STRAIGHT"},"showLocalAxes":false,"showWorldAxes":false,"terrain":{"textureId":"WIREFRAME","movements":"DISABLED"}}}';

const STAR_PROJECTILE =
  '{"startLifetime":{"min":0.4,"max":0.9},"startSpeed":{"min":0,"max":0},"startSize":{"min":2,"max":3},"startRotation":{"min":-360,"max":360},"simulationSpace":"WORLD","emission":{"rateOverTime":0,"rateOverDistance":19},"shape":{"sphere":{"radius":0.0001}},"renderer":{"blending":"THREE.NormalBlending"},"sizeOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":1,"percentage":0},{"x":0.1666,"y":0.8333},{"x":0.3333,"y":0.6666},{"x":0.5,"y":0.5,"percentage":0.5},{"x":0.6666,"y":0.3332},{"x":0.8333,"y":0.1665},{"x":1,"y":0,"percentage":1}]},"opacityOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":0,"percentage":0},{"x":0,"y":1},{"x":0,"y":1},{"x":0.5,"y":1,"percentage":0.5},{"x":1,"y":1},{"x":1,"y":1},{"x":1,"y":0,"percentage":1}]},"noise":{"isActive":true,"useRandomOffset":true,"strength":0.18,"positionAmount":0.278,"rotationAmount":5},"_editorData":{"textureId":"STAR_TOON","simulation":{"movements":"PROJECTILE_ARC"},"showLocalAxes":false,"showWorldAxes":false,"terrain":{"textureId":"WIREFRAME","movements":"DISABLED"}}}';

const FALLING_LEAVES =
  '{"transform":{"position":{"y":1.5},"rotation":{"x":90}},"startLifetime":{"min":5,"max":7},"startSpeed":{"min":0,"max":0.1},"startSize":{"min":3.11,"max":5.86},"startRotation":{"min":-360,"max":360},"gravity":0.001,"maxParticles":10,"emission":{"rateOverTime":2},"shape":{"shape":"CONE","cone":{"angle":0,"radius":0.4687}},"renderer":{"blending":"THREE.NormalBlending"},"sizeOverLifetime":{"bezierPoints":[{"x":0,"y":0,"percentage":0},{"x":1,"y":1,"percentage":1}]},"opacityOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":0,"percentage":0},{"x":0.0033,"y":1.01},{"x":0.0492,"y":0.9818},{"x":0.2133,"y":0.985,"percentage":0.2133},{"x":0.99,"y":1},{"x":0.9933,"y":0.985},{"x":1,"y":0,"percentage":1}]},"noise":{"isActive":true,"useRandomOffset":true,"strength":0.11,"frequency":0.246,"positionAmount":0.628,"rotationAmount":2.989},"_editorData":{"textureId":"LEAF_TOON","simulation":{"movements":"DISABLED"},"showLocalAxes":false,"showWorldAxes":false,"terrain":{"textureId":"WIREFRAME","movements":"DISABLED"}}}';

const HEALING =
  '{"startLifetime":{"min":1,"max":1.2},"startSpeed":{"min":0.1,"max":0.3},"startSize":{"min":1.29,"max":5.86},"startRotation":{"min":-15,"max":15},"gravity":-0.008,"maxParticles":10,"emission":{"rateOverTime":6},"shape":{"sphere":{"radius":0.2939},"cone":{"angle":21.6024,"radius":0.4687}},"sizeOverLifetime":{"isActive":true,"curveFunction":"ELASTIC_OUT","bezierPoints":[{"x":0,"y":0,"percentage":0},{"x":1,"y":1,"percentage":1}]},"opacityOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":0,"percentage":0},{"x":0.3333,"y":0},{"x":0.1666,"y":1},{"x":0.5,"y":1,"percentage":0.5},{"x":0.8333,"y":1},{"x":0.6666,"y":0},{"x":1,"y":0,"percentage":1}]},"noise":{"isActive":true,"useRandomOffset":true,"strength":0.11,"positionAmount":0.453,"sizeAmount":5},"_editorData":{"textureId":"PLUS_TOON","simulation":{"movements":"DISABLED"},"showLocalAxes":false,"showWorldAxes":false,"terrain":{"textureId":"WIREFRAME","movements":"DISABLED"}}}';

const SNOWFALL =
  '{"transform":{"position":{"y":4},"rotation":{"x":90}},"startLifetime":{"min":1.49,"max":2.86},"startSize":{"min":1.03,"max":1.92},"startRotation":{"min":-360,"max":360},"startColor":{"min":{"r":0.803921568627451,"g":0.8156862745098039,"b":0.9764705882352941}},"gravity":0.009,"maxParticles":200,"emission":{"rateOverTime":50},"shape":{"shape":"RECTANGLE","sphere":{"radius":2.9127},"rectangle":{"scale":{"x":7.682,"y":7.504}}},"renderer":{"blending":"THREE.NormalBlending"},"sizeOverLifetime":{"bezierPoints":[{"x":0,"y":0,"percentage":0},{"x":1,"y":1,"percentage":1}]},"opacityOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":0.41,"percentage":0},{"x":0.0566,"y":1.01},{"x":0.05,"y":0.985},{"x":0.62,"y":0.99,"percentage":0.62},{"x":1.0499,"y":0.9937},{"x":0.9866,"y":0.95},{"x":1,"y":0,"percentage":1}]},"rotationOverLifetime":{"isActive":true,"min":-170.2,"max":231.9},"noise":{"isActive":true,"useRandomOffset":true,"strength":0.27,"frequency":0.206},"_editorData":{"textureId":"SNOWFLAKE","simulation":{"movements":"DISABLED"},"showLocalAxes":false,"showWorldAxes":false,"terrain":{"textureId":"WIREFRAME","movements":"DISABLED"}}}';

const SMOKE =
  '{"transform":{"rotation":{"x":-90}},"startLifetime":{"min":4.23,"max":7.25},"startSpeed":{"min":0.31,"max":0.58},"startSize":{"min":28.71,"max":36.02},"startRotation":{"min":-360,"max":360},"startOpacity":{"min":0.141,"max":0.296},"shape":{"shape":"CONE","sphere":{"radius":0.4687},"cone":{"angle":0,"radius":0.3813}},"renderer":{"blending":"THREE.NormalBlending"},"sizeOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":0.625,"percentage":0},{"x":0.2666,"y":0.845},{"x":0.3596,"y":0.4551},{"x":0.5066,"y":0.49,"percentage":0.5066},{"x":0.6966,"y":0.5349},{"x":0.6366,"y":0.99},{"x":1,"y":1,"percentage":1}]},"opacityOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":0.0799,"percentage":0},{"x":0.0666,"y":0.85},{"x":0.1674,"y":1.0337},{"x":0.5,"y":1,"percentage":0.5},{"x":0.9933,"y":0.95},{"x":0.9966,"y":0.96},{"x":1,"y":0,"percentage":1}]},"rotationOverLifetime":{"isActive":true,"min":-22.4,"max":24.3},"noise":{"isActive":true,"useRandomOffset":true,"strength":0.09,"positionAmount":0.191,"rotationAmount":1.677},"_editorData":{"textureId":"CLOUD","simulation":{"movements":"DISABLED"},"showLocalAxes":false,"showWorldAxes":false,"terrain":{"textureId":"WIREFRAME","movements":"DISABLED"}}}';

export const particleExamples = [
  {
    name: "Fire",
    preview: "./assets/examples/effects/fire.webp",
    config: FIRE,
  },
  {
    name: "Explosion smoke",
    preview: "./assets/examples/effects/explosion-smoke.webp",
    config: EXPLOSION_SMOKE,
  },
  {
    name: "Fireflies",
    preview: "./assets/examples/effects/fireflies.webp",
    config: FIREFLIES,
  },
  {
    name: "Fire projectile",
    preview: "./assets/examples/effects/fire-projectile.webp",
    config: FIRE_PROJECTILE,
  },
  {
    name: "Leaf projectile",
    preview: "./assets/examples/effects/leaf-projectile.webp",
    config: LEAF_PROJECTILE,
  },
  {
    name: "Star projectile",
    preview: "./assets/examples/effects/star-projectile.webp",
    config: STAR_PROJECTILE,
  },
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
