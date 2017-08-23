"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Guid_1 = require("./Guid");
var xInput = (function () {
    function xInput() {
    }
    xInput.randomInteger = function (min, max) {
        var rand = min - 0.5 + Math.random() * (max - min + 1);
        rand = Math.round(rand);
        return rand;
    };
    xInput.SafeMove = function (creep, target) {
        if (creep.moveTo(target, { visualizePathStyle: {
                fill: 'transparent',
                stroke: '#fff',
                lineStyle: 'dashed',
                strokeWidth: .15,
                opacity: .1
            } }) == ERR_INVALID_TARGET) {
            creep.say('ERROR');
            console.log("found " + creep.energy + " creep status at ERR_INVALID_TARGET");
        }
    };
    xInput.SafeHarvest = function (creep) {
        var energy = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1);
        if (energy.length) {
            console.log('found ' + energy[0].energy + ' energy at ', energy[0].pos);
            creep.pickup(energy[0]);
            creep.say("Собираю..");
            return;
        }
        var source = creep.pos.findClosestByPath(FIND_SOURCES);
        if (creep.memory.sourceIndex == undefined) {
            var sources = creep.room.find(FIND_SOURCES);
            var indexRandom = xInput.randomInteger(0, sources.length - 1);
            creep.memory.sourceIndex = indexRandom;
            source = sources[indexRandom];
        }
        else
            source = creep.room.find(FIND_SOURCES)[creep.memory.sourceIndex];
        var result = creep.harvest(source);
        if (result == ERR_NOT_IN_RANGE)
            this.SafeMove(creep, source);
        else if (result == OK)
            creep.say("Maining.");
        else if (result == ERR_INVALID_TARGET)
            creep.say("INVALID_TARGET");
    };
    xInput.Main = function () {
        var body = [MOVE, CARRY, WORK, CARRY, CARRY];
        if (Game.spawns['Spawn'].canCreateCreep(body) == OK)
            Game.spawns['Spawn'].createCreep(body, Guid_1.Guid.newGuid().ToString().split('-')[0], { role: "worker" });
        for (var name_1 in Memory.creeps)
            if (Game.creeps[name_1] == undefined)
                delete Memory.creeps[name_1];
        for (var name_2 in Game.creeps) {
            var creep = Game.creeps[name_2];
            if (creep.carry.energy == 0)
                creep.memory.isWork = true;
            else if (creep.carry.energy == creep.carryCapacity)
                creep.memory.isWork = false;
            if (!creep.memory.isWork) {
                if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE)
                    xInput.SafeMove(creep, creep.room.controller);
                else
                    creep.say("Updating..");
            }
            else
                xInput.SafeHarvest(creep);
        }
    };
    xInput.TowerUpdate = function () {
        var towers = [Game.getObjectById("58211384d5f995fb51705c3b"), Game.getObjectById("581eb8acdb96d10803401ac7")];
        for (var i in towers) {
            var tower = towers[i];
            var targets = tower.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: function (x) {
                    return x.hits < x.hitsMax && x.structureType != STRUCTURE_RAMPART && x.structureType != STRUCTURE_WALL;
                }
            });
            var enemyCreeps = _.filter(Game.spawns['s1'].room.find(FIND_CREEPS), function (creep) { return !creep.my; });
            if (enemyCreeps.length != 0) {
                tower.attack(enemyCreeps[0]);
                return;
            }
            if (targets != undefined || targets != null)
                tower.repair(targets);
            else {
                targets = tower.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: function (x) { return x.structureType == STRUCTURE_RAMPART && x.hits <= (x.hitsMax / 100); }
                });
                if (targets != undefined || targets != null)
                    tower.repair(targets);
                else {
                    targets = tower.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: function (x) { return x.structureType == STRUCTURE_WALL && x.hits <= (x.hitsMax / 6000); }
                    });
                    if (targets != undefined || targets != null)
                        tower.repair(targets);
                    else {
                        console.log("tower [" + tower + "] is not found work");
                    }
                }
            }
        }
    };
    return xInput;
}());
exports.xInput = xInput;
