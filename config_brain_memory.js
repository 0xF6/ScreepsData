'use strict';

brain.setMarketOrders = function() {
  Memory.orders = {};
  Memory.orders[ORDER_BUY] = {};
  Memory.orders[ORDER_SELL] = {};
  for (let order of Game.market.getAllOrders()) {
    if (order.resourceType === SUBSCRIPTION_TOKEN || (Memory.myRooms != undefined && Memory.myRooms.includes(order.roomName))) {
      continue;
    }
    let category = Memory.orders[order.type][order.resourceType];
    if (!category) {
      Memory.orders[order.type][order.resourceType] = category = {
        min: order.price,
        max: order.price,
        totalPrice: 0,
        totalAmount: 0,
        orders: []
      };
    }
    category.min = Math.min(category.min, order.price);
    category.max = Math.max(category.max, order.price);
    category.totalPrice += order.price * order.remainingAmount;
    category.totalAmount += order.remainingAmount;
    category.orders.push(order);
  }
};

brain.setConstructionSites = function() {
  if (!Memory.constructionSites) {
    Memory.constructionSites = {};
  }

  if (Game.time % config.constructionSite.maxIdleTime === 0) {
    let constructionSites = {};
    for (let csId in Game.constructionSites) {
      let cs = Game.constructionSites[csId];
      let csMem = Memory.constructionSites[csId];
      if (csMem) {
        if (csMem === cs.progress) {
          console.log(csId + ' constructionSite too old');
          let csObject = Game.getObjectById(csId);
          let returnCode = csObject.remove();
          console.log('Delete constructionSite: ' + returnCode);
          continue;
        }
      }
      constructionSites[csId] = cs.progress;
    }
    Memory.constructionSites = constructionSites;
    console.log('Known constructionSites: ' + Object.keys(constructionSites).length);
  }
};

brain.addToStats = function(name) {
  let role = Memory.creeps[name].role;
  brain.stats.modifyRoleAmount(role, -1);
};

brain.handleUnexpectedDeadCreeps = function(name, creepMemory) {
  console.log(name, 'Not in Game.creeps', Game.time - creepMemory.born, Memory.creeps[name].base);
  if (Game.time - creepMemory.born < 20) {
    return;
  }

  if (!creepMemory.role) {
    delete Memory.creeps[name];
    return;
  }

  let unit = roles[creepMemory.role];
  if (!unit) {
    delete Memory.creeps[name];
    return;
  }
  if (unit.died) {
    if (unit.died(name, creepMemory)) {
      delete Memory.creeps[name];
    }
  } else {
    delete Memory.creeps[name];
  }
};

brain.cleanCreeps = function() {
  // Cleanup memory
  for (let name in Memory.creeps) {
    if (!Game.creeps[name]) {
      brain.addToStats(name);
      if ((name.startsWith('reserver') && Memory.creeps[name].born < (Game.time - CREEP_CLAIM_LIFE_TIME)) || Memory.creeps[name].born < (Game.time - CREEP_LIFE_TIME)) {
        delete Memory.creeps[name];
        continue;
      }

      var creepMemory = Memory.creeps[name];
      if (creepMemory.killed) {
        delete Memory.creeps[name];
        continue;
      }

      brain.handleUnexpectedDeadCreeps(name, creepMemory);
    }
  }
};

brain.cleanSquads = function() {
  if (Game.time % 1500 === 0) {
    for (let squadId in Memory.squads) {
      let squad = Memory.squads[squadId];
      if (Game.time - squad.born > 3000) {
        console.log(`Delete squad ${squadId}`);
        delete Memory.squads[squadId];
      }
    }
  }
};

brain.cleanRooms = function() {
  if (Game.time % 300 === 0) {
    for (let name in Memory.rooms) {
      // Check for reserved rooms
      let memory = Memory.rooms[name];
      if (!Memory.rooms[name].lastSeen) {
        console.log('Deleting ' + name + ' from memory no `last_seen` value');
        delete Memory.rooms[name];
        continue;
      }
      if (Memory.rooms[name].lastSeen < Game.time - config.room.lastSeenThreshold) {
        console.log(`Deleting ${name} from memory older than ${config.room.lastSeenThreshold}`);
        delete Memory.rooms[name];
        continue;
      }
    }
  }
};

brain.getStorageStringForRoom = function(strings, room, interval) {
  let addToString = function(variable, name, value) {
    strings[variable] += name + ':' + value + ' ';
  };

  if (room.storage.store.energy < 200000) {
    addToString('storageLowString', room.name, room.storage.store.energy);
  } else if (room.storage.store.energy > 800000) {
    addToString('storageHighString', room.name, room.storage.store.energy);
  } else {
    addToString('storageMiddleString', room.name, room.storage.store.energy);
  }
  if (room.storage.store.power && room.storage.store.power > 0) {
    addToString('storagePower', room.name, room.storage.store.power);
  }
  // TODO 15 it should be
  if (Math.ceil(room.memory.upgraderUpgrade / interval) < 15) {
    addToString('upgradeLess', room.name, room.memory.upgraderUpgrade / interval);
  }
  room.memory.upgraderUpgrade = 0;
};

brain.printSummary = function() {
  var interval = 100;
  if (Game.time % interval !== 0) {
    return;
  }
  var diff = Game.gcl.progress - Memory.progress;
  Memory.progress = Game.gcl.progress;

  let strings = {
    storageNoString: '',
    storageLowString: '',
    storageMiddleString: '',
    storageHighString: '',
    storagePower: '',
    upgradeLess: ''
  };
  for (var name of Memory.myRooms) {
    let room = Game.rooms[name];
    if (!room || !room.storage) {
      strings.storageNoString += name + ' ';
      continue;
    }
    brain.getStorageStringForRoom(strings, room, interval);
  }

  console.log(`=========================
Progress: ${diff / interval}/${Memory.myRooms.length * 15}
ConstructionSites: ${Object.keys(Memory.constructionSites).length}
-------------------------
No storage: ${strings.storageNoString}
Low storage: ${strings.storageLowString}
Middle storage: ${strings.storageMiddleString}
High storage: ${strings.storageHighString}
-------------------------
Power storage: ${strings.storagePower}
-------------------------
Upgrade less: ${strings.upgradeLess}
=========================`);
};

brain.prepareMemory = function() {
  Memory.username = Memory.username || _.chain(Game.rooms).map('controller').flatten().filter('my').map('owner.username').first().value();
  brain.setMarketOrders();
  brain.setConstructionSites();
  brain.cleanCreeps();
  brain.cleanSquads();
  brain.cleanRooms();
  if (config.stats.summary) {
    brain.printSummary();
  }
};
