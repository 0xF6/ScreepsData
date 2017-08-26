'use strict';

global.brain = {
  stats: {}
};
global.roles = {};
global.cache = {
  rooms: { }
};

try {
  global.friends = require('friends');
} catch (e) {
  global.friends = [];
}

global.config = {
  profiler: {
    enabled: false
  },
  visualizer: {
    enabled: true,
    showRoomPaths: true,
    showCreepPaths: true,
    showPathSearches: true,
    showStructures: true,
    showCreeps: true,
    showBlockers: true,
    showCostMatrixes: false
  },

  quests: {
    enabled: true,
    signControllerPercentage: 0.1
  },

  info: {
    signController: true,
    signText: 'Go to hell...',
    resignInterval: 500
  },

  // Due to newly introduces via global variable caching this can be removed
  performance: {
    serializePath: true,
    costMatrixMemoryMaxGCL: 55
  },

  // use username `tooangels` and password `tooSecretPassword` at https://screepspl.us/grafana
  stats: {
    screepsPlusEnabled: true,
    screepsPlusToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRvb2FuZ2VscyIsImlhdCI6MTUwMDg1ODkwNSwiYXVkIjoic2NyZWVwc3BsLnVzIiwiaXNzIjoic2NyZWVwc3BsLnVzIn0.o2IrarAxJKdEQieOVsEOl4aoBDEfjhoO0JzHjDpOWWo',
    enabled: true,
    summary: true
  },

  debug: {
    getPartsConfLogs: false,
    queue: false,
    spawn: false
  },

  tower: {
    healMyCreeps: true,
    repairStructures: true
  },
  autoattack: {
    disabled: false,
    notify: true
  },

  revive: {
    disabled: false,
    reviverMaxQueue: 4,
    reviverMinEnergy: 1300
  },

  nextRoom: {
    boostToControllerLevel: 4,
    scoutMinControllerLevel: 4,
    ttlPerRoomForScout: 500,
    numberOfNextroomers: 10,
    nextroomerInterval: 500,
    maxRooms: 20,
    revive: true,
    maxDistance: 27,
    minNewRoomDistance: 4,
    minEnergyForActive: 1000,
    minDowngradPercent: 90,
    notify: true
  },

  carryHelpers: {
    ticksUntilHelpCheck: 100,
    maxHelpersAmount: 3,
    helpTreshold: 1500,
    needTreshold: 750,
    maxDistance: 7,
    factor: 0.2
  },

  power: {
    disabled: false,
    energyForCreeps: 800000,
    energyForSpawn: 250000
  },

  buildRoad: {
    maxConstructionSitesTotal: 80,
    maxConstructionSitesRoom: 10,
    buildToOtherMyRoom: true
  },

  constructionSite: {
    maxIdleTime: 5000
  },

  hostile: {
    remeberInRoom: 1500
  },

  path: {
    refresh: 2000000,
    allowRoutingThroughFriendRooms: true,
    pathfindIncomplete: true
  },

  external: {
    distance: 3
  },

  carry: {
    sizes: {
      0: [3, 3], // RCL 1
      550: [4, 4], // RCL 2
      800: [6, 6], // RCL 3
      1300: [6, 11], // RCL 4
      1800: [8, 15], // RCL 5
      2300: [11, 21], // RCL 6
    },
    minSpawnRate: 50,
    // Percentage should increase from base to target room. Decrease may cause stack on border
    carryPercentageBase: 0.1,
    carryPercentageHighway: 0.2,
    carryPercentageExtern: 0.5,
    callHarvesterPerResources: 1000
  },

  creep: {
    renewOffset: 0,
    queueTtl: 100,
    structurer: true,
    structurerInterval: 1500,
    structurerMinEnergy: 1300,
    reserverDefender: true,
    energyFromStorageThreshold: 2000,
    sortParts: true,
    swarmSourceHarvestingMaxParts: 10
  },

  room: {
    reservedRCL: {
      0: 1,
      1: 1,
      2: 1,
      3: 1,
      4: 1,
      5: 1,
      6: 1,
      7: 1,
      8: 1
    },
    revive: true,
    rebuildLayout: 7654,
    handleNukeAttackInterval: 132,
    reviveEnergyCapacity: 1000,
    reviveEnergyAvailable: 1000,
    reviveStorageAvailable: 3000,
    scoutInterval: 1499,
    scoutSkipWhenStuck: true, // Useful for novice areas.
    scout: true, // TODO somehow broken ?? Is it broken ??
    upgraderMinStorage: 0,
    upgraderStorageFactor: 2,
    lastSeenThreshold: 1000000,
    notify: false
  },

  layout: {
    plainCost: 5,
    swampCost: 8,
    borderAvoid: 20,
    skLairAvoidRadius: 5,
    skLairAvoid: 30,
    wallAvoid: 10,
    sourceAvoid: 20,
    pathAvoid: 1,
    structureAvoid: 0xFF,
    creepAvoid: 0xFF,
    wallThickness: 1,
    version: 19,
  },

  terminal: {
    energyAmount: 100000,
    storageMinEnergyAmount: 20000
  },

  mineral: {
    enabled: true,
    storage: 100000,
    minAmount: 5000
  },

  market: {
    minAmount: 100,
    energyCreditEquivalent: 1,
    trySellOrders: true,
    sellOrderMaxAmount: 100,
    sellOrderReserve: 2000,
    sellOrderPriceMultiplicator: 5
  },

  priorityQueue: {
    sameRoom: {
      harvester: 1,
      sourcer: 2,
      storagefiller: 3,
      defendranged: 4,
      carry: 5
    },
    otherRoom: {
      harvester: 11,
      defender: 12,
      defendranged: 13,
      nextroomer: 15,
      carry: 17,
      sourcer: 18,
      reserver: 19
    }
  }
};

try {
  require('config_local');
} catch (e) {}
