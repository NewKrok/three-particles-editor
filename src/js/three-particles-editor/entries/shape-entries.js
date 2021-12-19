import { Shape } from "@newkrok/three-particles/src/js/effects/three-particles";
import { createVector2FolderEntry } from "./entry-helpers";

let shapeControllers = [];

export const createShapeEntries = ({
  parentFolder,
  particleSystemConfig,
  recreateParticleSystem,
}) => {
  const folder = parentFolder.addFolder("Shape");
  folder.close();

  folder
    .add(particleSystemConfig.shape, "shape", [
      Shape.SPHERE,
      Shape.CONE,
      // Shape.BOX,
      Shape.CIRCLE,
      Shape.RECTANGLE,
    ])
    .listen()
    .onChange((v) => {
      particleSystemConfig.shape.shape = v;
      createEntriesByShape({
        folder,
        particleSystemConfig,
        recreateParticleSystem,
      });
    });

  createEntriesByShape({
    folder,
    particleSystemConfig,
    recreateParticleSystem,
  });

  return {
    onParticleSystemChange: () => {},
    onUpdate: () => {},
  };
};

const createEntriesByShape = ({
  folder,
  particleSystemConfig,
  recreateParticleSystem,
}) => {
  destroyShapeControllers();
  switch (particleSystemConfig.shape.shape) {
    case Shape.SPHERE:
      createShapeSphereEntries({
        folder,
        particleSystemConfig,
        recreateParticleSystem,
      });
      break;

    case Shape.CONE:
      createShapeConeEntries({
        folder,
        particleSystemConfig,
        recreateParticleSystem,
      });
      break;

    case Shape.CIRCLE:
      createShapeCircleEntries({
        folder,
        particleSystemConfig,
        recreateParticleSystem,
      });
      break;

    case Shape.RECTANGLE:
      createShapeRectangleEntries({
        folder,
        particleSystemConfig,
        recreateParticleSystem,
      });
      break;
  }
  recreateParticleSystem();
};

const destroyShapeControllers = () => {
  shapeControllers.forEach((controller) => controller.destroy());
  shapeControllers = [];
};

const createShapeSphereEntries = ({
  folder,
  particleSystemConfig,
  recreateParticleSystem,
}) => {
  shapeControllers.push(
    folder
      .add(particleSystemConfig.shape.sphere, "radius", 0.0001, 10, 0.0001)
      .onChange((v) => {
        particleSystemConfig.shape.sphere.radius = v;
        recreateParticleSystem();
      })
  );

  shapeControllers.push(
    folder
      .add(particleSystemConfig.shape.sphere, "radiusThickness", 0.0, 1, 0.01)
      .onChange((v) => {
        particleSystemConfig.shape.sphere.radiusThickness = v;
        recreateParticleSystem();
      })
  );

  shapeControllers.push(
    folder
      .add(particleSystemConfig.shape.sphere, "arc", -360.0, 360, 0.001)
      .onChange((v) => {
        particleSystemConfig.shape.sphere.arc = v;
        recreateParticleSystem();
      })
  );
};

const createShapeConeEntries = ({
  folder,
  particleSystemConfig,
  recreateParticleSystem,
}) => {
  shapeControllers.push(
    folder
      .add(particleSystemConfig.shape.cone, "angle", 0, 90, 0.0001)
      .onChange((v) => {
        particleSystemConfig.shape.cone.angle = v;
        recreateParticleSystem();
      })
  );

  shapeControllers.push(
    folder
      .add(particleSystemConfig.shape.cone, "radius", 0.0001, 10, 0.0001)
      .onChange((v) => {
        particleSystemConfig.shape.cone.radius = v;
        recreateParticleSystem();
      })
  );

  shapeControllers.push(
    folder
      .add(particleSystemConfig.shape.cone, "radiusThickness", 0.0, 1, 0.01)
      .onChange((v) => {
        particleSystemConfig.shape.cone.radiusThickness = v;
        recreateParticleSystem();
      })
  );

  shapeControllers.push(
    folder
      .add(particleSystemConfig.shape.cone, "arc", -360.0, 360, 0.001)
      .onChange((v) => {
        particleSystemConfig.shape.cone.arc = v;
        recreateParticleSystem();
      })
  );
};

const createShapeCircleEntries = ({
  folder,
  particleSystemConfig,
  recreateParticleSystem,
}) => {
  shapeControllers.push(
    folder
      .add(particleSystemConfig.shape.circle, "radius", 0.0001, 10, 0.0001)
      .onChange((v) => {
        particleSystemConfig.shape.circle.radius = v;
        recreateParticleSystem();
      })
  );

  shapeControllers.push(
    folder
      .add(particleSystemConfig.shape.circle, "radiusThickness", 0.0, 1, 0.01)
      .onChange((v) => {
        particleSystemConfig.shape.circle.radiusThickness = v;
        recreateParticleSystem();
      })
  );

  shapeControllers.push(
    folder
      .add(particleSystemConfig.shape.circle, "arc", -360.0, 360, 0.001)
      .onChange((v) => {
        particleSystemConfig.shape.circle.arc = v;
        recreateParticleSystem();
      })
  );
};

const createShapeRectangleEntries = ({
  folder,
  particleSystemConfig,
  recreateParticleSystem,
}) => {
  shapeControllers.push(
    createVector2FolderEntry({
      particleSystemConfig,
      recreateParticleSystem,
      parentFolder: folder,
      rootPropertyName: "shape.rectangle",
      propertyName: "rotation",
      min: -360.0,
      max: 360.0,
      step: 0.001,
    })
  );

  shapeControllers.push(
    createVector2FolderEntry({
      particleSystemConfig,
      recreateParticleSystem,
      parentFolder: folder,
      rootPropertyName: "shape.rectangle",
      propertyName: "scale",
      min: 0.001,
      max: 10.0,
      step: 0.001,
    })
  );
};
