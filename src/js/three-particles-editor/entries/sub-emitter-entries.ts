type SubEmitterFolderData = {
  folder: any;
  controllers: any[];
};

type SubEmitterEntriesParams = {
  parentFolder: any;
  particleSystemConfig: any;
  recreateParticleSystem: () => void;
  onEditSubEmitter: (index: number) => void;
};

let subEmitterFolders: SubEmitterFolderData[] = [];
let subEmittersFolder: any = null;

const createSubEmitterFolder = (
  parentFolder: any,
  subEmitter: any,
  index: number,
  recreateParticleSystem: () => void,
  onEdit: () => void,
  onRemove: () => void
): SubEmitterFolderData => {
  const folder = parentFolder.addFolder(`Sub-Emitter ${index + 1}`);
  const controllers: any[] = [];

  // Trigger selector
  if (subEmitter.trigger === undefined) subEmitter.trigger = 'DEATH';
  controllers.push(
    folder
      .add(subEmitter, 'trigger', ['BIRTH', 'DEATH'])
      .name('Trigger')
      .onChange(recreateParticleSystem)
      .listen()
  );

  // Inherit velocity
  if (subEmitter.inheritVelocity === undefined) subEmitter.inheritVelocity = 0;
  controllers.push(
    folder
      .add(subEmitter, 'inheritVelocity', 0.0, 1.0, 0.01)
      .name('Inherit Velocity')
      .onChange(recreateParticleSystem)
      .listen()
  );

  // Max instances
  if (subEmitter.maxInstances === undefined) subEmitter.maxInstances = 32;
  controllers.push(
    folder
      .add(subEmitter, 'maxInstances', 1, 128, 1)
      .name('Max Instances')
      .onChange(recreateParticleSystem)
      .listen()
  );

  // Edit Config button
  const editObj = { editConfig: onEdit };
  controllers.push(folder.add(editObj, 'editConfig').name('Edit Config...'));

  // Remove button
  const removeObj = { remove: onRemove };
  controllers.push(folder.add(removeObj, 'remove').name('Remove Sub-Emitter'));

  return { folder, controllers };
};

const rebuildSubEmitterFolders = (
  particleSystemConfig: any,
  recreateParticleSystem: () => void,
  onEditSubEmitter: (index: number) => void
): void => {
  // Clean up existing sub-emitter folders
  subEmitterFolders.forEach(({ folder, controllers }) => {
    controllers.forEach((c) => {
      try {
        c.destroy();
      } catch {
        // Controller might already be destroyed if panel was replaced
      }
    });
    try {
      folder.destroy();
    } catch {
      // Folder might already be destroyed if panel was replaced
    }
  });
  subEmitterFolders = [];

  if (!subEmittersFolder || !subEmittersFolder.domElement?.parentNode) {
    subEmittersFolder = null;
    return;
  }

  // Ensure subEmitters array exists
  if (!particleSystemConfig.subEmitters) {
    particleSystemConfig.subEmitters = [];
  }

  // Create folder for each sub-emitter
  particleSystemConfig.subEmitters.forEach((subEmitter: any, index: number) => {
    const folderData = createSubEmitterFolder(
      subEmittersFolder,
      subEmitter,
      index,
      recreateParticleSystem,
      () => onEditSubEmitter(index),
      () => {
        // Remove this sub-emitter
        particleSystemConfig.subEmitters.splice(index, 1);
        if (particleSystemConfig.subEmitters.length === 0) {
          delete particleSystemConfig.subEmitters;
        }
        rebuildSubEmitterFolders(particleSystemConfig, recreateParticleSystem, onEditSubEmitter);
        recreateParticleSystem();
      }
    );
    subEmitterFolders.push(folderData);
  });
};

export const createSubEmitterEntries = ({
  parentFolder,
  particleSystemConfig,
  recreateParticleSystem,
  onEditSubEmitter,
}: SubEmitterEntriesParams): { onReset?: () => void } => {
  const folder = parentFolder.addFolder('Sub-Emitters');
  folder.close();

  subEmittersFolder = folder;

  // Add Sub-Emitter button
  const addSubEmitterObj = {
    addSubEmitter: () => {
      if (!particleSystemConfig.subEmitters) {
        particleSystemConfig.subEmitters = [];
      }
      // Store sub-emitter config as minimal diff — the library expands it internally.
      // Only _editorData is extra (editor-specific, not sent to the library).
      const newSubEmitter = {
        trigger: 'DEATH',
        config: {
          _editorData: {
            textureId: 'point',
          },
        },
        inheritVelocity: 0,
        maxInstances: 32,
      };
      particleSystemConfig.subEmitters.push(newSubEmitter);
      rebuildSubEmitterFolders(particleSystemConfig, recreateParticleSystem, onEditSubEmitter);
      recreateParticleSystem();
    },
  };
  folder.add(addSubEmitterObj, 'addSubEmitter').name('+ Add Sub-Emitter');

  // Initial build
  rebuildSubEmitterFolders(particleSystemConfig, recreateParticleSystem, onEditSubEmitter);

  return {
    onReset: () => {
      rebuildSubEmitterFolders(particleSystemConfig, recreateParticleSystem, onEditSubEmitter);
    },
  };
};
