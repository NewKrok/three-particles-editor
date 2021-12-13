import {
  createVector2FolderEntry,
  createVector3FolderEntry,
} from "./entry-helpers";

import { Shape } from "@newkrok/three-particles/src/js/effects/three-particles";

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
      .add(
        { radius: particleSystemConfig.shape.sphere.radius },
        "radius",
        0.0001,
        10,
        0.0001
      )
      .onChange((v) => {
        particleSystemConfig.shape.sphere.radius = v;
        recreateParticleSystem();
      })
  );

  shapeControllers.push(
    folder
      .add(
        { radiusThickness: particleSystemConfig.shape.sphere.radiusThickness },
        "radiusThickness",
        0.0,
        1,
        0.01
      )
      .onChange((v) => {
        particleSystemConfig.shape.sphere.radiusThickness = v;
        recreateParticleSystem();
      })
  );

  shapeControllers.push(
    folder
      .add(
        { arc: particleSystemConfig.shape.sphere.arc },
        "arc",
        0.0,
        360,
        0.01
      )
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
      .add(
        { angle: particleSystemConfig.shape.cone.angle },
        "angle",
        0,
        90,
        0.0001
      )
      .onChange((v) => {
        particleSystemConfig.shape.cone.angle = v;
        recreateParticleSystem();
      })
  );

  shapeControllers.push(
    folder
      .add(
        { radius: particleSystemConfig.shape.cone.radius },
        "radius",
        0.0001,
        10,
        0.0001
      )
      .onChange((v) => {
        particleSystemConfig.shape.cone.radius = v;
        recreateParticleSystem();
      })
  );

  shapeControllers.push(
    folder
      .add(
        { radiusThickness: particleSystemConfig.shape.cone.radiusThickness },
        "radiusThickness",
        0.0,
        1,
        0.01
      )
      .onChange((v) => {
        particleSystemConfig.shape.cone.radiusThickness = v;
        recreateParticleSystem();
      })
  );

  shapeControllers.push(
    folder
      .add({ arc: particleSystemConfig.shape.cone.arc }, "arc", 0.0, 360, 0.01)
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
      .add(
        { radius: particleSystemConfig.shape.circle.radius },
        "radius",
        0.0001,
        10,
        0.0001
      )
      .onChange((v) => {
        particleSystemConfig.shape.circle.radius = v;
        recreateParticleSystem();
      })
  );

  shapeControllers.push(
    folder
      .add(
        { radiusThickness: particleSystemConfig.shape.circle.radiusThickness },
        "radiusThickness",
        0.0,
        1,
        0.01
      )
      .onChange((v) => {
        particleSystemConfig.shape.circle.radiusThickness = v;
        recreateParticleSystem();
      })
  );

  shapeControllers.push(
    folder
      .add(
        { arc: particleSystemConfig.shape.circle.arc },
        "arc",
        0.0,
        360,
        0.01
      )
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
      min: 0.0,
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
