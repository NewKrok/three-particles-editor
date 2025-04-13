import { EmitFrom, Shape } from "@newkrok/three-particles";
import {
  createVector2FolderEntry,
  createVector3FolderEntry,
} from "./entry-helpers";

let shapeControllers: any[] = [];
let lastInitedShape: string | null = null;

type ShapeEntriesParams = {
  folder?: any;
  parentFolder?: any;
  particleSystemConfig: any;
  recreateParticleSystem: () => void;
};

type ShapeEntriesResult = {
  onParticleSystemChange: () => void;
  onUpdate: () => void;
};

export const createShapeEntries = ({
  parentFolder,
  particleSystemConfig,
  recreateParticleSystem,
}: ShapeEntriesParams): ShapeEntriesResult => {
  const folder = parentFolder.addFolder("Shape");
  folder.close();

  folder
    .add(particleSystemConfig.shape, "shape", [
      Shape.SPHERE,
      Shape.CONE,
      Shape.BOX,
      Shape.CIRCLE,
      Shape.RECTANGLE,
    ])
    .listen()
    .onChange(() =>
      createEntriesByShape({
        folder,
        particleSystemConfig,
        recreateParticleSystem,
      })
    );

  createEntriesByShape({
    folder,
    particleSystemConfig,
    recreateParticleSystem,
  });

  return {
    onParticleSystemChange: (): void => {
      if (lastInitedShape !== particleSystemConfig.shape.shape)
        createEntriesByShape({
          folder,
          particleSystemConfig,
          recreateParticleSystem,
        });
    },
    onUpdate: (): void => {},
  };
};

const createEntriesByShape = ({
  folder,
  particleSystemConfig,
  recreateParticleSystem,
}: ShapeEntriesParams): void => {
  lastInitedShape = particleSystemConfig.shape.shape;
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

    case Shape.BOX:
      createShapeBoxEntries({
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

const destroyShapeControllers = (): void => {
  shapeControllers.forEach((controller) => controller.destroy());
  shapeControllers = [];
};

const createShapeSphereEntries = ({
  folder,
  particleSystemConfig,
  recreateParticleSystem,
}: ShapeEntriesParams): void => {
  shapeControllers.push(
    folder
      .add(particleSystemConfig.shape.sphere, "radius", 0.0001, 10, 0.0001)
      .onChange(recreateParticleSystem)
  );

  shapeControllers.push(
    folder
      .add(particleSystemConfig.shape.sphere, "radiusThickness", 0.0, 1, 0.01)
      .onChange(recreateParticleSystem)
  );

  shapeControllers.push(
    folder
      .add(particleSystemConfig.shape.sphere, "arc", -360.0, 360, 0.001)
      .onChange(recreateParticleSystem)
  );
};

const createShapeConeEntries = ({
  folder,
  particleSystemConfig,
  recreateParticleSystem,
}: ShapeEntriesParams): void => {
  shapeControllers.push(
    folder
      .add(particleSystemConfig.shape.cone, "angle", 0, 90, 0.0001)
      .onChange(recreateParticleSystem)
  );

  shapeControllers.push(
    folder
      .add(particleSystemConfig.shape.cone, "radius", 0.0001, 10, 0.0001)
      .onChange(recreateParticleSystem)
  );

  shapeControllers.push(
    folder
      .add(particleSystemConfig.shape.cone, "radiusThickness", 0.0, 1, 0.01)
      .onChange(recreateParticleSystem)
  );

  shapeControllers.push(
    folder
      .add(particleSystemConfig.shape.cone, "arc", -360.0, 360, 0.001)
      .onChange(recreateParticleSystem)
  );
};

const createShapeBoxEntries = ({
  folder,
  particleSystemConfig,
  recreateParticleSystem,
}: ShapeEntriesParams): void => {
  shapeControllers.push(
    folder
      .add(particleSystemConfig.shape.box, "emitFrom", [
        EmitFrom.VOLUME,
        EmitFrom.SHELL,
        EmitFrom.EDGE,
      ])
      .onChange(recreateParticleSystem)
      .listen()
  );

  shapeControllers.push(
    createVector3FolderEntry({
      particleSystemConfig,
      recreateParticleSystem,
      parentFolder: folder,
      rootPropertyName: "shape.box",
      propertyName: "scale",
      min: 0.001,
      max: 10.0,
      step: 0.001,
    })
  );
};

const createShapeCircleEntries = ({
  folder,
  particleSystemConfig,
  recreateParticleSystem,
}: ShapeEntriesParams): void => {
  shapeControllers.push(
    folder
      .add(particleSystemConfig.shape.circle, "radius", 0.0001, 10, 0.0001)
      .onChange(recreateParticleSystem)
  );

  shapeControllers.push(
    folder
      .add(particleSystemConfig.shape.circle, "radiusThickness", 0.0, 1, 0.01)
      .onChange(recreateParticleSystem)
  );

  shapeControllers.push(
    folder
      .add(particleSystemConfig.shape.circle, "arc", -360.0, 360, 0.001)
      .onChange(recreateParticleSystem)
  );
};

const createShapeRectangleEntries = ({
  folder,
  particleSystemConfig,
  recreateParticleSystem,
}: ShapeEntriesParams): void => {
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
