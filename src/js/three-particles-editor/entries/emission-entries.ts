import type { Burst, Constant, RandomBetweenTwoConstants } from '@newkrok/three-particles';

type EmissionEntriesParams = {
  parentFolder: any;
  particleSystemConfig: any;
  recreateParticleSystem: () => void;
};

type BurstFolderData = {
  folder: any;
  controllers: any[];
};

// Keep track of burst folders for cleanup
let burstFolders: BurstFolderData[] = [];
let burstsFolder: any = null;

const isRandomBetweenTwoConstants = (
  value: Constant | RandomBetweenTwoConstants
): value is RandomBetweenTwoConstants => {
  return typeof value === 'object' && value !== null && 'min' in value;
};

const createBurstFolder = (
  parentFolder: any,
  burst: Burst,
  index: number,
  recreateParticleSystem: () => void,
  onRemove: () => void
): BurstFolderData => {
  const folder = parentFolder.addFolder(`Burst ${index + 1}`);
  const controllers: any[] = [];

  // Time field
  controllers.push(
    folder
      .add(burst, 'time', 0.0, 30.0, 0.01)
      .name('Time')
      .onChange(recreateParticleSystem)
      .listen()
  );

  // Count type selector (Constant vs Random)
  const countTypeObj = {
    type: isRandomBetweenTwoConstants(burst.count) ? 'Random' : 'Constant',
  };

  // Temporary object for constant count value
  const constantCountObj = {
    value: isRandomBetweenTwoConstants(burst.count)
      ? (burst.count.min ?? 10)
      : (burst.count as number),
  };

  // Ensure count is in the right format
  if (!isRandomBetweenTwoConstants(burst.count)) {
    // It's a constant, keep as is for now
  } else {
    // It's RandomBetweenTwoConstants
    if (burst.count.min === undefined) burst.count.min = 10;
    if (burst.count.max === undefined) burst.count.max = 10;
  }

  let countControllers: any[] = [];

  const createCountControls = () => {
    // Remove existing count controllers
    countControllers.forEach((c) => c.destroy());
    countControllers = [];

    if (countTypeObj.type === 'Constant') {
      // Convert to constant if needed
      if (isRandomBetweenTwoConstants(burst.count)) {
        constantCountObj.value = burst.count.min ?? 10;
        burst.count = constantCountObj.value;
      }

      const countController = folder
        .add(constantCountObj, 'value', 1, 1000, 1)
        .name('Count')
        .onChange((v: number) => {
          burst.count = Math.round(v);
          recreateParticleSystem();
        })
        .listen();
      countControllers.push(countController);
    } else {
      // Convert to RandomBetweenTwoConstants if needed
      if (!isRandomBetweenTwoConstants(burst.count)) {
        const currentValue = burst.count as number;
        burst.count = { min: currentValue, max: currentValue };
      }

      const countRef = burst.count as RandomBetweenTwoConstants;
      if (countRef.min === undefined) countRef.min = 10;
      if (countRef.max === undefined) countRef.max = 10;

      const minController = folder
        .add(countRef, 'min', 1, 1000, 1)
        .name('Count Min')
        .onChange((v: number) => {
          countRef.min = Math.round(Math.min(v, countRef.max ?? v));
          recreateParticleSystem();
        })
        .listen();
      countControllers.push(minController);

      const maxController = folder
        .add(countRef, 'max', 1, 1000, 1)
        .name('Count Max')
        .onChange((v: number) => {
          countRef.max = Math.round(Math.max(v, countRef.min ?? v));
          recreateParticleSystem();
        })
        .listen();
      countControllers.push(maxController);
    }
  };

  controllers.push(
    folder
      .add(countTypeObj, 'type', ['Constant', 'Random'])
      .name('Count Type')
      .onChange(() => {
        createCountControls();
        recreateParticleSystem();
      })
  );

  createCountControls();

  // Cycles field
  if (burst.cycles === undefined) burst.cycles = 1;
  controllers.push(
    folder.add(burst, 'cycles', 1, 100, 1).name('Cycles').onChange(recreateParticleSystem).listen()
  );

  // Interval field
  if (burst.interval === undefined) burst.interval = 0;
  controllers.push(
    folder
      .add(burst, 'interval', 0.0, 10.0, 0.01)
      .name('Interval')
      .onChange(recreateParticleSystem)
      .listen()
  );

  // Probability field
  if (burst.probability === undefined) burst.probability = 1;
  controllers.push(
    folder
      .add(burst, 'probability', 0.0, 1.0, 0.01)
      .name('Probability')
      .onChange(recreateParticleSystem)
      .listen()
  );

  // Remove button
  const removeObj = {
    remove: onRemove,
  };
  controllers.push(folder.add(removeObj, 'remove').name('Remove Burst'));

  return { folder, controllers: [...controllers, ...countControllers] };
};

const rebuildBurstFolders = (
  particleSystemConfig: any,
  recreateParticleSystem: () => void
): void => {
  // Clean up existing burst folders
  burstFolders.forEach(({ folder, controllers }) => {
    controllers.forEach((c) => {
      try {
        c.destroy();
      } catch {
        // Controller might already be destroyed
      }
    });
    try {
      folder.destroy();
    } catch {
      // Folder might already be destroyed
    }
  });
  burstFolders = [];

  if (!burstsFolder) return;

  // Ensure bursts array exists
  if (!particleSystemConfig.emission.bursts) {
    particleSystemConfig.emission.bursts = [];
  }

  // Create folder for each burst
  particleSystemConfig.emission.bursts.forEach((burst: Burst, index: number) => {
    const burstFolderData = createBurstFolder(
      burstsFolder,
      burst,
      index,
      recreateParticleSystem,
      () => {
        // Remove this burst
        particleSystemConfig.emission.bursts.splice(index, 1);
        rebuildBurstFolders(particleSystemConfig, recreateParticleSystem);
        recreateParticleSystem();
      }
    );
    burstFolders.push(burstFolderData);
  });
};

export const createEmissionEntries = ({
  parentFolder,
  particleSystemConfig,
  recreateParticleSystem,
}: EmissionEntriesParams): { onReset?: () => void } => {
  const folder = parentFolder.addFolder('Emission');
  folder.close();

  folder
    .add(particleSystemConfig.emission, 'rateOverTime', 0.0, 500, 1.0)
    .onChange(recreateParticleSystem)
    .listen();

  folder
    .add(particleSystemConfig.emission, 'rateOverDistance', 0.0, 500, 1.0)
    .onChange(recreateParticleSystem)
    .listen();

  // Bursts section
  burstsFolder = folder.addFolder('Bursts');
  burstsFolder.close();

  // Ensure bursts array exists
  if (!particleSystemConfig.emission.bursts) {
    particleSystemConfig.emission.bursts = [];
  }

  // Add Burst button
  const addBurstObj = {
    addBurst: () => {
      const newBurst: Burst = {
        time: 0,
        count: 10,
        cycles: 1,
        interval: 0,
        probability: 1,
      };
      particleSystemConfig.emission.bursts.push(newBurst);
      rebuildBurstFolders(particleSystemConfig, recreateParticleSystem);
      recreateParticleSystem();
    },
  };
  burstsFolder.add(addBurstObj, 'addBurst').name('+ Add Burst');

  // Initial build of burst folders
  rebuildBurstFolders(particleSystemConfig, recreateParticleSystem);

  return {
    onReset: () => {
      rebuildBurstFolders(particleSystemConfig, recreateParticleSystem);
    },
  };
};
