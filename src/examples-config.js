const SMOKE_2 =
  '{"duration":0.36,"startLifetime":{"min":0.94,"max":5.88},"startSpeed":{"min":0,"max":0},"startSize":{"min":34.19,"max":42.42},"startRotation":{"min":-360,"max":360},"simulationSpace":"WORLD","maxParticles":150,"emission":{"rateOverTime":0,"rateOverDistance":8},"shape":{"shape":"CONE","cone":{"angle":16.8097,"radius":0.1},"rectangle":{"scale":{"x":0.5,"y":1.8}}},"renderer":{"blending":"THREE.AdditiveBlending"},"sizeOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":0.245,"percentage":0},{"x":0.1666,"y":0.4116},{"x":0.3766,"y":0.2182},{"x":0.5433,"y":0.385,"percentage":0.5433},{"x":0.7099,"y":0.5516},{"x":0.8333,"y":0.8333},{"x":1,"y":1,"percentage":1}]},"opacityOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":1,"percentage":0},{"x":0.1666,"y":0.8333},{"x":0.3333,"y":0.6666},{"x":0.5,"y":0.5,"percentage":0.5},{"x":0.6666,"y":0.3332},{"x":0.8333,"y":0.1665},{"x":1,"y":0,"percentage":1}]},"rotationOverLifetime":{"isActive":true,"min":-17,"max":11.7},"noise":{"isActive":true,"strength":0.3,"positionAmount":0.103},"_editorData":{"textureId":"CLOUD","simulation":{"movements":"INFINITE_SYMBOL","movementSpeed":3.9,"rotation":"FOLLOW_THE_MOVEMENT","rotationSpeed":0},"showLocalAxes":true,"showWorldAxes":false,"frustumCulled":true,"terrain":{"textureId":"WIREFRAME","movements":"DISABLED","movementSpeed":1,"rotation":"DISABLED","rotationSpeed":1}}}';

const COLLECT_ITEM =
  '{"transform":{"rotation":{"x":-90}},"duration":0.2,"looping":false,"startLifetime":{"min":0.3,"max":0.8},"startSpeed":{"min":0.5},"startSize":{"min":0.1,"max":1.5},"startColor":{"min":{"r":0.596078431372549,"g":0.08235294117647059,"b":0.9372549019607843},"max":{"g":0,"b":0.8666666666666667}},"maxParticles":30,"emission":{"rateOverTime":200},"shape":{"sphere":{"radius":0.4},"cone":{"angle":17.5967,"radius":0.1}},"renderer":{"blending":"THREE.NormalBlending"},"velocityOverLifetime":{"isActive":true,"orbital":{"y":{"max":5}}},"sizeOverLifetime":{"bezierPoints":[{"x":0,"y":0,"percentage":0},{"x":0.3333,"y":0},{"x":0.1666,"y":1},{"x":0.5,"y":1,"percentage":0.5},{"x":0.8333,"y":1},{"x":0.6666,"y":0},{"x":1,"y":0,"percentage":1}]},"opacityOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":0,"percentage":0},{"x":0,"y":1},{"x":0,"y":1},{"x":0.5,"y":1,"percentage":0.5},{"x":1,"y":1},{"x":1,"y":1},{"x":1,"y":0,"percentage":1}]},"_editorData":{"textureId":"POINT","simulation":{"movements":"DISABLED","movementSpeed":1,"rotation":"DISABLED","rotationSpeed":1},"showLocalAxes":false,"showWorldAxes":false,"frustumCulled":true,"terrain":{"textureId":"WIREFRAME","movements":"DISABLED","movementSpeed":1,"rotation":"DISABLED","rotationSpeed":1}}}';

const ITEM_APPEAR =
  '{"transform":{"rotation":{"x":-90}},"duration":0.4,"looping":false,"startLifetime":{"min":0.2,"max":0.6},"startSpeed":{"min":0.8,"max":1.5},"startSize":{"min":0.1,"max":2},"startColor":{"min":{"r":0.596078431372549,"g":0.08235294117647059,"b":0.9372549019607843},"max":{"g":0,"b":0.8666666666666667}},"gravity":-2,"maxParticles":30,"emission":{"rateOverTime":100},"shape":{"sphere":{"radius":0.05,"radiusThickness":0.5},"cone":{"angle":17.5967,"radius":0.1}},"renderer":{"blending":"THREE.NormalBlending"},"velocityOverLifetime":{"isActive":true,"orbital":{"x":{"min":-25,"max":25},"y":{"min":-25,"max":25},"z":{"min":-5,"max":5}}},"sizeOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":0,"percentage":0},{"x":0.3333,"y":0},{"x":0.1666,"y":1},{"x":0.5,"y":1,"percentage":0.5},{"x":0.8333,"y":1},{"x":0.6666,"y":0},{"x":1,"y":0,"percentage":1}]},"opacityOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":0,"percentage":0},{"x":0,"y":1},{"x":0,"y":1},{"x":0.5,"y":1,"percentage":0.5},{"x":1,"y":1},{"x":1,"y":1},{"x":1,"y":0,"percentage":1}]},"_editorData":{"textureId":"POINT","simulation":{"movements":"DISABLED","movementSpeed":1,"rotation":"DISABLED","rotationSpeed":1},"showLocalAxes":false,"showWorldAxes":false,"frustumCulled":true,"terrain":{"textureId":"WIREFRAME","movements":"DISABLED","movementSpeed":1,"rotation":"DISABLED","rotationSpeed":1}}}';

const TELEPORT =
  '{"transform":{"rotation":{"x":-90}},"duration":1,"looping":false,"startLifetime":{"min":0.8,"max":0.8},"startSpeed":{"min":0,"max":0},"startSize":{"max":2},"startColor":{"min":{"r":0.47843137254901963,"g":0.5647058823529412},"max":{"r":0.43137254901960786,"g":0.7137254901960784,"b":0.8862745098039215}},"gravity":-10,"maxParticles":50,"emission":{"rateOverTime":80},"shape":{"shape":"CIRCLE","circle":{"radiusThickness":0}},"velocityOverLifetime":{"isActive":true,"orbital":{"x":{"min":-1,"max":1},"y":{"min":-5,"max":2}}},"sizeOverLifetime":{"bezierPoints":[{"x":0,"y":0,"percentage":0},{"x":1,"y":1,"percentage":1}]},"opacityOverLifetime":{"bezierPoints":[{"x":0,"y":0,"percentage":0},{"x":1,"y":1,"percentage":1}]},"_editorData":{"textureId":"GRADIENT_POINT","simulation":{"movements":"DISABLED","movementSpeed":1,"rotation":"DISABLED","rotationSpeed":1},"showLocalAxes":false,"showWorldAxes":false,"frustumCulled":true,"terrain":{"textureId":"WIREFRAME","movements":"DISABLED","movementSpeed":1,"rotation":"DISABLED","rotationSpeed":1}}}';

const FLYING_LEAVES =
  '{"transform":{"rotation":{"x":-90}},"startLifetime":{"min":4,"max":4},"startSpeed":{"min":0,"max":0},"startSize":{"min":1.29,"max":4.94},"startRotation":{"min":-360,"max":360},"gravity":-0.99,"maxParticles":22,"emission":{"rateOverTime":5},"shape":{"cone":{"radius":0.2939,"radiusThickness":0}},"velocityOverLifetime":{"isActive":true,"orbital":{"z":{"min":2,"max":4}}},"sizeOverLifetime":{"bezierPoints":[{"x":0,"y":0,"percentage":0},{"x":1,"y":1,"percentage":1}]},"opacityOverLifetime":{"bezierPoints":[{"x":0,"y":0,"percentage":0},{"x":1,"y":1,"percentage":1}]},"noise":{"isActive":true,"positionAmount":0,"rotationAmount":2},"_editorData":{"textureId":"LEAF_TOON","simulation":{"movements":"DISABLED","movementSpeed":1,"rotation":"DISABLED","rotationSpeed":1},"showLocalAxes":false,"showWorldAxes":false,"frustumCulled":true,"terrain":{"textureId":"WIREFRAME","movements":"DISABLED","movementSpeed":1,"rotation":"DISABLED","rotationSpeed":1}}}';

const UNDERWATER_BUBBLES =
  '{"transform":{"rotation":{"x":-90}},"startLifetime":{"min":1.77,"max":3.96},"startSpeed":{"min":0.39,"max":0.93},"startSize":{"min":0.5,"max":1.5},"maxParticles":20,"emission":{"rateOverTime":5},"shape":{"shape":"CONE","cone":{"angle":14.4487,"radius":0.1}},"velocityOverLifetime":{"isActive":true,"orbital":{"x":{"min":-1,"max":1},"y":{"min":-3,"max":3},"z":{"min":-3,"max":3}}},"sizeOverLifetime":{"bezierPoints":[{"x":0,"y":0,"percentage":0},{"x":1,"y":1,"percentage":1}]},"opacityOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":0,"percentage":0},{"x":0.0166,"y":0.675},{"x":-0.0134,"y":0.7633},{"x":0.1533,"y":0.93,"percentage":0.1533},{"x":0.3199,"y":1.0966},{"x":0.8333,"y":0.8333},{"x":1,"y":1,"percentage":1}]},"_editorData":{"textureId":"CIRCLE","simulation":{"movements":"DISABLED","movementSpeed":1,"rotation":"DISABLED","rotationSpeed":1},"showLocalAxes":false,"showWorldAxes":false,"frustumCulled":true,"terrain":{"textureId":"WIREFRAME","movements":"DISABLED","movementSpeed":1,"rotation":"DISABLED","rotationSpeed":1}}}';

const POISON_SPHERE =
  '{"startLifetime":{"min":4.51,"max":6.97},"startSpeed":{"min":0,"max":0},"startSize":{"min":1.5,"max":3},"startColor":{"min":{"r":0.5764705882352941,"g":0.49019607843137253,"b":0.06274509803921569},"max":{"r":0.34901960784313724,"g":0.5058823529411764,"b":0.1568627450980392}},"maxParticles":6,"shape":{"sphere":{"radius":0.5,"radiusThickness":0}},"renderer":{"blending":"THREE.NormalBlending"},"velocityOverLifetime":{"isActive":true,"orbital":{"x":{"min":-2,"max":2},"y":{"min":-2,"max":2},"z":{"min":-2,"max":2}}},"sizeOverLifetime":{"bezierPoints":[{"x":0,"y":0,"percentage":0},{"x":0.1666,"y":0.1665},{"x":0.3333,"y":0.3332},{"x":0.5,"y":0.5,"percentage":0.5},{"x":0.6666,"y":0.6666},{"x":0.8333,"y":0.8333},{"x":1,"y":1,"percentage":1}]},"opacityOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":1,"percentage":0},{"x":0.1666,"y":0.8333},{"x":0.6533,"y":0.9566},{"x":0.82,"y":0.79,"percentage":0.82},{"x":0.9866,"y":0.6233},{"x":0.8333,"y":0.1665},{"x":1,"y":0,"percentage":1}]},"noise":{"strength":0.97,"positionAmount":0.191},"textureSheetAnimation":{"timeMode":"FPS","fps":0},"_editorData":{"textureId":"SKULL","simulation":{"movements":"DISABLED","movementSpeed":1,"rotation":"DISABLED","rotationSpeed":1},"showLocalAxes":true,"showWorldAxes":true,"frustumCulled":true,"terrain":{"textureId":"WIREFRAME","movements":"DISABLED","movementSpeed":1,"rotation":"DISABLED","rotationSpeed":1}}}';

const DRIFT =
  '{"duration":0.36,"startLifetime":{"min":0.94,"max":1.77},"startSpeed":{"min":0.93,"max":1.76},"startSize":{"min":34.19,"max":42.42},"gravity":-0.64,"simulationSpace":"WORLD","maxParticles":40,"emission":{"rateOverTime":0,"rateOverDistance":10},"shape":{"shape":"CONE","cone":{"angle":16.8097,"radius":0.1},"rectangle":{"scale":{"x":0.5,"y":1.8}}},"renderer":{"blending":"THREE.AdditiveBlending"},"sizeOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":0.245,"percentage":0},{"x":0.1666,"y":0.4116},{"x":0.3766,"y":0.2182},{"x":0.5433,"y":0.385,"percentage":0.5433},{"x":0.7099,"y":0.5516},{"x":0.8333,"y":0.8333},{"x":1,"y":1,"percentage":1}]},"opacityOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":1,"percentage":0},{"x":0.1666,"y":0.8333},{"x":0.3333,"y":0.6666},{"x":0.5,"y":0.5,"percentage":0.5},{"x":0.6666,"y":0.3332},{"x":0.8333,"y":0.1665},{"x":1,"y":0,"percentage":1}]},"noise":{"isActive":true,"strength":0.3,"positionAmount":0.278},"_editorData":{"textureId":"CLOUD","simulation":{"movements":"CIRCLE","movementSpeed":3.9,"rotation":"FOLLOW_THE_MOVEMENT","rotationSpeed":0},"showLocalAxes":true,"showWorldAxes":false,"terrain":{"textureId":"WIREFRAME","movements":"DISABLED","movementSpeed":1,"rotation":"DISABLED","rotationSpeed":1}}}';

const TORNADO =
  '{"transform":{"rotation":{"x":-90}},"startLifetime":{"min":1.22,"max":2.31},"startSpeed":{"min":1.6,"max":2},"startSize":{"min":36.93,"max":44.24},"startRotation":{"min":-360,"max":360},"startOpacity":{"min":0.799},"maxParticles":200,"emission":{"rateOverTime":200},"shape":{"shape":"CONE","cone":{"angle":14.4487,"radius":0.2939,"radiusThickness":0}},"renderer":{"blending":"THREE.NormalBlending"},"sizeOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":0.17,"percentage":0},{"x":0.1666,"y":0.3366},{"x":0.4966,"y":0.0932},{"x":0.6633,"y":0.26,"percentage":0.6633},{"x":0.8299,"y":0.4266},{"x":0.8333,"y":0.8333},{"x":1,"y":1,"percentage":1}]},"opacityOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":1,"percentage":0},{"x":0.1666,"y":0.8333},{"x":0.5166,"y":0.9216},{"x":0.6833,"y":0.755,"percentage":0.6833},{"x":0.8499,"y":0.5883},{"x":0.8333,"y":0.1665},{"x":1,"y":0,"percentage":1}]},"rotationOverLifetime":{"isActive":true,"min":2.2,"max":88.3},"noise":{"isActive":true,"useRandomOffset":true,"positionAmount":0.1,"sizeAmount":5},"_editorData":{"textureId":"CLOUD","simulation":{"movements":"RANDOM_MOVEMENT","movementSpeed":1,"rotation":"Y","rotationSpeed":6.7},"showLocalAxes":false,"showWorldAxes":false,"terrain":{"textureId":"TERRAIN_DIRT","movements":"DISABLED","movementSpeed":1,"rotation":"DISABLED","rotationSpeed":1}}}';

const PIXEL_FIRE =
  '{"transform":{"rotation":{"x":-90}},"duration":0.5,"startLifetime":{"min":0.5,"max":0.8},"startSpeed":{"min":0.4,"max":1.5},"startSize":{"min":4,"max":5},"startColor":{"min":{"r":0.9725490196078431,"g":0.050980392156862744,"b":0.050980392156862744},"max":{"r":0.9921568627450981,"g":0.7803921568627451,"b":0.03137254901960784}},"maxParticles":15,"emission":{"rateOverTime":200},"shape":{"shape":"CONE","sphere":{"radius":0.4,"arc":180},"cone":{"angle":0,"radius":0.1}},"renderer":{"blending":"THREE.NormalBlending"},"sizeOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":1,"percentage":0},{"x":0.1666,"y":0.8333},{"x":0.3666,"y":0.8566},{"x":0.5333,"y":0.6899,"percentage":0.5333},{"x":0.6999,"y":0.5232},{"x":0.8333,"y":0.5914},{"x":1,"y":0.425,"percentage":1}]},"opacityOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":1,"percentage":0},{"x":0.1666,"y":0.8333},{"x":0.3333,"y":0.6666},{"x":0.5,"y":0.5,"percentage":0.5},{"x":0.6666,"y":0.3332},{"x":0.8333,"y":0.1665},{"x":1,"y":0,"percentage":1}]},"rotationOverLifetime":{"min":-22.4,"max":24.3},"noise":{"strength":0.09,"positionAmount":0.191},"_editorData":{"textureId":"SQUARE","simulation":{"movements":"DISABLED","movementSpeed":1,"rotation":"DISABLED","rotationSpeed":1},"showLocalAxes":false,"showWorldAxes":false,"terrain":{"textureId":"WIREFRAME","movements":"DISABLED","movementSpeed":1,"rotation":"DISABLED","rotationSpeed":1}}}';

const ROCK_EXPLOSION =
  '{"transform":{"rotation":{"x":-90}},"duration":0.3,"looping":false,"startLifetime":{"min":0.67,"max":1.77},"startSpeed":{"min":1.21,"max":2.85},"startSize":{"min":1.29,"max":2.2},"startRotation":{"min":-360,"max":360},"startColor":{"min":{"r":0.8,"g":0.8,"b":0.8},"max":{"r":0.5333333333333333,"g":0.5333333333333333,"b":0.5333333333333333}},"gravity":5.5,"maxParticles":10,"emission":{"rateOverTime":30},"shape":{"shape":"CONE","cone":{"angle":47.5024,"radius":0.5562}},"sizeOverLifetime":{"bezierPoints":[{"x":0,"y":0,"percentage":0},{"x":1,"y":1,"percentage":1}]},"opacityOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":1,"percentage":0},{"x":0.1666,"y":0.8333},{"x":0.6366,"y":1.0466},{"x":0.8033,"y":0.88,"percentage":0.8033},{"x":0.9699,"y":0.7133},{"x":0.8333,"y":0.1665},{"x":1,"y":0,"percentage":1}]},"rotationOverLifetime":{"isActive":true,"min":-342.5,"max":299},"textureSheetAnimation":{"tiles":{"x":5,"y":2},"timeMode":"FPS","fps":0,"startFrame":{"max":10}},"_editorData":{"textureId":"ROCKS","simulation":{"movements":"DISABLED","movementSpeed":1,"rotation":"DISABLED","rotationSpeed":1},"showLocalAxes":false,"showWorldAxes":false,"terrain":{"textureId":"WIREFRAME","movements":"DISABLED","movementSpeed":1,"rotation":"DISABLED","rotationSpeed":1}}}';

const MAGIC_CIRCLE =
  '{"startLifetime":{"min":0.2,"max":0.4},"startSpeed":{"min":0.05,"max":0.08},"startSize":{"min":0.37,"max":3.11},"startColor":{"min":{"r":0.4823529411764706,"g":0.5058823529411764,"b":0.8588235294117647},"max":{"r":0.3843137254901961,"g":0.10980392156862745,"b":0.5098039215686274}},"simulationSpace":"WORLD","emission":{"rateOverTime":500},"shape":{"shape":"CIRCLE","circle":{"radius":0.7311,"radiusThickness":0}},"sizeOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":1,"percentage":0},{"x":0.1666,"y":0.8333},{"x":0.3333,"y":0.6666},{"x":0.5,"y":0.5,"percentage":0.5},{"x":0.6666,"y":0.3332},{"x":0.8333,"y":0.1665},{"x":1,"y":0,"percentage":1}]},"opacityOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":0,"percentage":0},{"x":0,"y":1},{"x":0,"y":1},{"x":0.5,"y":1,"percentage":0.5},{"x":1,"y":1},{"x":1,"y":1},{"x":1,"y":0,"percentage":1}]},"noise":{"isActive":true,"useRandomOffset":true,"strength":0.11,"positionAmount":0.453},"_editorData":{"textureId":"STAR","simulation":{"movements":"DISABLED","movementSpeed":1,"rotation":"MIXED","rotationSpeed":2.9},"showLocalAxes":false,"showWorldAxes":false,"terrain":{"textureId":"WIREFRAME","movements":"DISABLED","movementSpeed":1,"rotation":"DISABLED","rotationSpeed":1}}}';

const FIRE =
  '{"transform":{"rotation":{"x":-90}},"duration":0.5,"startLifetime":{"min":0.2,"max":1},"startSpeed":{"max":2.2},"startSize":{"min":9.51,"max":19.57},"startRotation":{"min":-360,"max":360},"startColor":{"min":{"r":0.9725490196078431,"g":0.050980392156862744,"b":0.050980392156862744},"max":{"r":0.9921568627450981,"g":0.7803921568627451,"b":0.03137254901960784}},"gravity":-4,"emission":{"rateOverTime":200},"shape":{"shape":"CONE","sphere":{"radius":0.4,"arc":180},"cone":{"angle":0,"radius":0.3813}},"renderer":{"blending":"THREE.NormalBlending"},"sizeOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":0,"percentage":0},{"x":0,"y":1},{"x":0,"y":1},{"x":0.5,"y":1,"percentage":0.5},{"x":1,"y":1},{"x":1,"y":1},{"x":1,"y":0,"percentage":1}]},"opacityOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":1,"percentage":0},{"x":0.1666,"y":0.8333},{"x":0.3333,"y":0.6666},{"x":0.5,"y":0.5,"percentage":0.5},{"x":0.6666,"y":0.3332},{"x":0.8333,"y":0.1665},{"x":1,"y":0,"percentage":1}]},"rotationOverLifetime":{"isActive":true,"min":-22.4,"max":24.3},"noise":{"isActive":true,"useRandomOffset":true,"strength":0.09,"positionAmount":0.191,"rotationAmount":1.677},"_editorData":{"textureId":"FLAME","simulation":{"movements":"DISABLED","movementSpeed":1},"showLocalAxes":false,"showWorldAxes":false,"terrain":{"textureId":"WIREFRAME","movements":"DISABLED","movementSpeed":1}}}';

const EXPLOSION_SMOKE =
  '{"duration":1,"looping":false,"startLifetime":{"min":0.67,"max":2.86},"startSpeed":{"max":2.2},"startSize":{"min":35,"max":60},"startRotation":{"min":-360,"max":360},"startColor":{"min":{"r":0.1,"g":0.1,"b":0.1},"max":{"r":0.2,"g":0.2,"b":0.2}},"gravity":-0.5,"emission":{"rateOverTime":500},"shape":{"sphere":{"radius":0.4,"arc":180}},"renderer":{"blending":"THREE.NormalBlending"},"sizeOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":0,"percentage":0},{"x":0,"y":1},{"x":0,"y":1},{"x":0.5,"y":1,"percentage":0.5},{"x":1,"y":1},{"x":1,"y":1},{"x":1,"y":0,"percentage":1}]},"opacityOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":1,"percentage":0},{"x":0.1666,"y":0.8333},{"x":0.3333,"y":0.6666},{"x":0.5,"y":0.5,"percentage":0.5},{"x":0.6666,"y":0.3332},{"x":0.8333,"y":0.1665},{"x":1,"y":0,"percentage":1}]},"rotationOverLifetime":{"isActive":true,"min":-22.4,"max":24.3},"noise":{"isActive":true,"useRandomOffset":true,"strength":0.09,"positionAmount":0.191,"rotationAmount":1.677},"_editorData":{"textureId":"CLOUD","simulation":{"movements":"DISABLED","movementSpeed":1},"showLocalAxes":false,"showWorldAxes":false,"terrain":{"textureId":"TERRAIN_DIRT","movements":"DISABLED","movementSpeed":1}}}';

const FIREFLIES =
  '{"transform":{"position":{"y":2}},"startLifetime":{"min":1,"max":4},"startSpeed":{"min":0,"max":0},"startSize":{"min":0.5,"max":0.9},"startRotation":{"min":-360,"max":360},"startColor":{"min":{"r":0.6274509803921569,"g":0.7568627450980392,"b":0.2784313725490196},"max":{"r":0.4392156862745098,"g":0.5176470588235295,"b":0.1803921568627451}},"maxParticles":200,"emission":{"rateOverTime":50},"shape":{"shape":"BOX","sphere":{"radius":2.9127},"rectangle":{"scale":{"x":7.682,"y":7.504}},"box":{"scale":{"x":10,"y":4,"z":10}}},"renderer":{"blending":"THREE.NormalBlending"},"sizeOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":0,"percentage":0},{"x":0,"y":1},{"x":0,"y":1},{"x":0.5,"y":1,"percentage":0.5},{"x":1,"y":1},{"x":1,"y":1},{"x":1,"y":0,"percentage":1}]},"opacityOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":0,"percentage":0},{"x":0.3333,"y":0},{"x":0.1666,"y":1},{"x":0.5,"y":1,"percentage":0.5},{"x":0.8333,"y":1},{"x":0.6666,"y":0},{"x":1,"y":0,"percentage":1}]},"rotationOverLifetime":{"isActive":true,"min":-170.2,"max":231.9},"noise":{"isActive":true,"useRandomOffset":true,"strength":0.13,"frequency":0.206,"positionAmount":-0.072},"_editorData":{"textureId":"GRADIENT_POINT","simulation":{"movements":"DISABLED","movementSpeed":1},"showLocalAxes":false,"showWorldAxes":false,"terrain":{"textureId":"WIREFRAME","movements":"DISABLED","movementSpeed":1}}}';

const FIRE_PROJECTILE =
  '{"startLifetime":{"min":0.4,"max":0.8},"startSpeed":{"min":0,"max":0},"startSize":{"min":3,"max":4},"startColor":{"min":{"r":0.9725490196078431,"g":0.050980392156862744,"b":0.050980392156862744},"max":{"r":0.9921568627450981,"g":0.7803921568627451,"b":0.03137254901960784}},"simulationSpace":"WORLD","emission":{"rateOverTime":0,"rateOverDistance":27},"shape":{"sphere":{"radius":0.1}},"renderer":{"blending":"THREE.AdditiveBlending"},"sizeOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":1,"percentage":0},{"x":0.1666,"y":0.8333},{"x":0.3333,"y":0.6666},{"x":0.5,"y":0.5,"percentage":0.5},{"x":0.6666,"y":0.3332},{"x":0.8333,"y":0.1665},{"x":1,"y":0,"percentage":1}]},"opacityOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":1,"percentage":0},{"x":0.1666,"y":0.8333},{"x":0.3333,"y":0.6666},{"x":0.5,"y":0.5,"percentage":0.5},{"x":0.6666,"y":0.3332},{"x":0.8333,"y":0.1665},{"x":1,"y":0,"percentage":1}]},"noise":{"isActive":true,"useRandomOffset":true,"strength":0.27,"frequency":0.114,"positionAmount":0.278},"_editorData":{"textureId":"GRADIENT_POINT","simulation":{"movements":"PROJECTILE_STRAIGHT"},"showLocalAxes":false,"showWorldAxes":false,"terrain":{"textureId":"WIREFRAME","movements":"DISABLED"}}}';

const LEAF_PROJECTILE =
  '{"startLifetime":{"min":0.3,"max":0.5},"startSpeed":{"min":0.1},"startSize":{"min":4,"max":8},"startRotation":{"min":-360,"max":360},"gravity":0.5,"simulationSpace":"WORLD","emission":{"rateOverTime":26},"shape":{"sphere":{"radius":0.1}},"renderer":{"blending":"THREE.NormalBlending"},"sizeOverLifetime":{"bezierPoints":[{"x":0,"y":0,"percentage":0},{"x":1,"y":1,"percentage":1}]},"opacityOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":1,"percentage":0},{"x":0.1666,"y":0.8333},{"x":0.3333,"y":0.6666},{"x":0.5,"y":0.5,"percentage":0.5},{"x":0.6666,"y":0.3332},{"x":0.8333,"y":0.1665},{"x":1,"y":0,"percentage":1}]},"rotationOverLifetime":{"isActive":true,"min":-151,"max":164.9},"_editorData":{"textureId":"LEAF_TOON","simulation":{"movements":"PROJECTILE_STRAIGHT"},"showLocalAxes":false,"showWorldAxes":false,"terrain":{"textureId":"WIREFRAME","movements":"DISABLED"}}}';

const STAR_PROJECTILE =
  '{"startLifetime":{"min":0.4,"max":0.9},"startSpeed":{"min":0,"max":0},"startSize":{"min":2,"max":3},"startRotation":{"min":-360,"max":360},"simulationSpace":"WORLD","emission":{"rateOverTime":0,"rateOverDistance":19},"shape":{"sphere":{"radius":0.0001}},"renderer":{"blending":"THREE.NormalBlending"},"sizeOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":1,"percentage":0},{"x":0.1666,"y":0.8333},{"x":0.3333,"y":0.6666},{"x":0.5,"y":0.5,"percentage":0.5},{"x":0.6666,"y":0.3332},{"x":0.8333,"y":0.1665},{"x":1,"y":0,"percentage":1}]},"opacityOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":0,"percentage":0},{"x":0,"y":1},{"x":0,"y":1},{"x":0.5,"y":1,"percentage":0.5},{"x":1,"y":1},{"x":1,"y":1},{"x":1,"y":0,"percentage":1}]},"noise":{"isActive":true,"useRandomOffset":true,"strength":0.18,"positionAmount":0.278,"rotationAmount":5},"_editorData":{"textureId":"STAR_TOON","simulation":{"movements":"PROJECTILE_ARC"},"showLocalAxes":false,"showWorldAxes":false,"terrain":{"textureId":"WIREFRAME","movements":"DISABLED"}}}';

const FALLING_LEAVES =
  '{"transform":{"position":{"y":1.5},"rotation":{"x":90}},"startLifetime":{"min":5,"max":7},"startSpeed":{"min":0,"max":0.1},"startSize":{"min":3.11,"max":5.86},"startRotation":{"min":-360,"max":360},"gravity":0.1,"maxParticles":10,"emission":{"rateOverTime":2},"shape":{"shape":"CONE","cone":{"angle":0,"radius":0.4687}},"renderer":{"blending":"THREE.NormalBlending"},"sizeOverLifetime":{"bezierPoints":[{"x":0,"y":0,"percentage":0},{"x":1,"y":1,"percentage":1}]},"opacityOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":0,"percentage":0},{"x":0.0033,"y":1.01},{"x":0.0492,"y":0.9818},{"x":0.2133,"y":0.985,"percentage":0.2133},{"x":0.99,"y":1},{"x":0.9933,"y":0.985},{"x":1,"y":0,"percentage":1}]},"noise":{"isActive":true,"useRandomOffset":true,"strength":0.11,"frequency":0.246,"positionAmount":0.628,"rotationAmount":2.989},"_editorData":{"textureId":"LEAF_TOON","simulation":{"movements":"DISABLED"},"showLocalAxes":false,"showWorldAxes":false,"terrain":{"textureId":"WIREFRAME","movements":"DISABLED"}}}';

const HEALING =
  '{"startLifetime":{"min":1,"max":1.2},"startSpeed":{"min":0.1,"max":0.3},"startSize":{"min":1.29,"max":5.86},"startRotation":{"min":-15,"max":15},"gravity":-0.8,"maxParticles":10,"emission":{"rateOverTime":6},"shape":{"sphere":{"radius":0.2939},"cone":{"angle":21.6024,"radius":0.4687}},"sizeOverLifetime":{"isActive":true,"curveFunction":"ELASTIC_OUT","bezierPoints":[{"x":0,"y":0,"percentage":0},{"x":1,"y":1,"percentage":1}]},"opacityOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":0,"percentage":0},{"x":0.3333,"y":0},{"x":0.1666,"y":1},{"x":0.5,"y":1,"percentage":0.5},{"x":0.8333,"y":1},{"x":0.6666,"y":0},{"x":1,"y":0,"percentage":1}]},"noise":{"isActive":true,"useRandomOffset":true,"strength":0.11,"positionAmount":0.453,"sizeAmount":5},"_editorData":{"textureId":"PLUS_TOON","simulation":{"movements":"DISABLED"},"showLocalAxes":false,"showWorldAxes":false,"terrain":{"textureId":"WIREFRAME","movements":"DISABLED"}}}';

const SNOWFALL =
  '{"transform":{"position":{"y":4},"rotation":{"x":90}},"startLifetime":{"min":1.49,"max":2.86},"startSize":{"min":1.03,"max":1.92},"startRotation":{"min":-360,"max":360},"startColor":{"min":{"r":0.803921568627451,"g":0.8156862745098039,"b":0.9764705882352941}},"gravity":0.5,"maxParticles":200,"emission":{"rateOverTime":50},"shape":{"shape":"RECTANGLE","sphere":{"radius":2.9127},"rectangle":{"scale":{"x":7.682,"y":7.504}}},"renderer":{"blending":"THREE.NormalBlending"},"sizeOverLifetime":{"bezierPoints":[{"x":0,"y":0,"percentage":0},{"x":1,"y":1,"percentage":1}]},"opacityOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":0.41,"percentage":0},{"x":0.0566,"y":1.01},{"x":0.05,"y":0.985},{"x":0.62,"y":0.99,"percentage":0.62},{"x":1.0499,"y":0.9937},{"x":0.9866,"y":0.95},{"x":1,"y":0,"percentage":1}]},"rotationOverLifetime":{"isActive":true,"min":-170.2,"max":231.9},"noise":{"isActive":true,"useRandomOffset":true,"strength":0.27,"frequency":0.206},"_editorData":{"textureId":"SNOWFLAKE","simulation":{"movements":"DISABLED"},"showLocalAxes":false,"showWorldAxes":false,"terrain":{"textureId":"WIREFRAME","movements":"DISABLED"}}}';

const SMOKE =
  '{"transform":{"rotation":{"x":-90}},"startLifetime":{"min":4.23,"max":7.25},"startSpeed":{"min":0.31,"max":0.58},"startSize":{"min":28.71,"max":36.02},"startRotation":{"min":-360,"max":360},"startOpacity":{"min":0.141,"max":0.296},"shape":{"shape":"CONE","sphere":{"radius":0.4687},"cone":{"angle":0,"radius":0.3813}},"renderer":{"blending":"THREE.NormalBlending"},"sizeOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":0.625,"percentage":0},{"x":0.2666,"y":0.845},{"x":0.3596,"y":0.4551},{"x":0.5066,"y":0.49,"percentage":0.5066},{"x":0.6966,"y":0.5349},{"x":0.6366,"y":0.99},{"x":1,"y":1,"percentage":1}]},"opacityOverLifetime":{"isActive":true,"bezierPoints":[{"x":0,"y":0.0799,"percentage":0},{"x":0.0666,"y":0.85},{"x":0.1674,"y":1.0337},{"x":0.5,"y":1,"percentage":0.5},{"x":0.9933,"y":0.95},{"x":0.9966,"y":0.96},{"x":1,"y":0,"percentage":1}]},"rotationOverLifetime":{"isActive":true,"min":-22.4,"max":24.3},"noise":{"isActive":true,"useRandomOffset":true,"strength":0.09,"positionAmount":0.191,"rotationAmount":1.677},"_editorData":{"textureId":"CLOUD","simulation":{"movements":"DISABLED"},"showLocalAxes":false,"showWorldAxes":false,"terrain":{"textureId":"WIREFRAME","movements":"DISABLED"}}}';

export const particleExamples = [
  {
    name: 'Smoke 2',
    preview: './assets/examples/effects/smoke-2.webp',
    config: SMOKE_2,
  },
  {
    name: 'Collect Item',
    preview: './assets/examples/effects/collect-item.webp',
    config: COLLECT_ITEM,
  },
  {
    name: 'Item appear',
    preview: './assets/examples/effects/item-appear.webp',
    config: ITEM_APPEAR,
  },
  {
    name: 'Teleport',
    preview: './assets/examples/effects/teleport.webp',
    config: TELEPORT,
  },
  {
    name: 'Flying Leaves',
    preview: './assets/examples/effects/flying-leaves.webp',
    config: FLYING_LEAVES,
  },
  {
    name: 'Underwater Bubbles',
    preview: './assets/examples/effects/underwater-bubbles.webp',
    config: UNDERWATER_BUBBLES,
  },
  {
    name: 'Poison Sphere',
    preview: './assets/examples/effects/poison-sphere.webp',
    config: POISON_SPHERE,
  },
  {
    name: 'Drift',
    preview: './assets/examples/effects/drift.webp',
    config: DRIFT,
  },
  {
    name: 'Tornado',
    preview: './assets/examples/effects/tornado.webp',
    config: TORNADO,
  },
  {
    name: 'Pixel Fire',
    preview: './assets/examples/effects/pixel-fire.webp',
    config: PIXEL_FIRE,
  },
  {
    name: 'Rock Explosion',
    preview: './assets/examples/effects/rock-explosion.webp',
    config: ROCK_EXPLOSION,
  },
  {
    name: 'Magic circle',
    preview: './assets/examples/effects/magic-circle.webp',
    config: MAGIC_CIRCLE,
  },
  {
    name: 'Fire',
    preview: './assets/examples/effects/fire.webp',
    config: FIRE,
  },
  {
    name: 'Explosion smoke',
    preview: './assets/examples/effects/explosion-smoke.webp',
    config: EXPLOSION_SMOKE,
  },
  {
    name: 'Fireflies',
    preview: './assets/examples/effects/fireflies.webp',
    config: FIREFLIES,
  },
  {
    name: 'Fire projectile',
    preview: './assets/examples/effects/fire-projectile.webp',
    config: FIRE_PROJECTILE,
  },
  {
    name: 'Leaf projectile',
    preview: './assets/examples/effects/leaf-projectile.webp',
    config: LEAF_PROJECTILE,
  },
  {
    name: 'Star projectile',
    preview: './assets/examples/effects/star-projectile.webp',
    config: STAR_PROJECTILE,
  },
  {
    name: 'Falling leaves',
    preview: './assets/examples/effects/falling-leaves.webp',
    config: FALLING_LEAVES,
  },
  {
    name: 'Healing',
    preview: './assets/examples/effects/healing.webp',
    config: HEALING,
  },
  {
    name: 'Snowfall',
    preview: './assets/examples/effects/snowfall.webp',
    config: SNOWFALL,
  },
  {
    name: 'Smoke',
    preview: './assets/examples/effects/smoke.webp',
    config: SMOKE,
  },
];
