"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var XCreep_1 = require("./XCreep");
var Guid_1 = require("./Guid");
var SpawnManager = (function () {
    function SpawnManager() {
    }
    SpawnManager.Update = function () {
        var providers = _.sum(Game.creeps, function (x) { return x.memory.Role == XCreep_1.XCreep.PROVIDER; });
        var builders = _.sum(Game.creeps, function (x) { return x.memory.Role == XCreep_1.XCreep.BUILDER; });
        var updaters = _.sum(Game.creeps, function (x) { return x.memory.Role == XCreep_1.XCreep.UPDATER; });
        var body = [MOVE, CARRY, WORK, CARRY, CARRY];
        if (providers > 1 && ((providers + builders + updaters) > 4)) {
            body = [MOVE, CARRY, WORK, CARRY, CARRY, CARRY, WORK, WORK];
        }
        if (providers < 3) {
            if (Game.spawns['Spawn'].canCreateCreep(body) == OK) {
                Game.spawns['Spawn'].createCreep(body, Guid_1.Guid.newGuid()
                    .ToString()
                    .split('-')[0], { Role: XCreep_1.XCreep.PROVIDER });
                return;
            }
            return;
        }
        if (builders < 5) {
            if (Game.spawns['Spawn'].canCreateCreep(body) == OK) {
                Game.spawns['Spawn'].createCreep(body, Guid_1.Guid.newGuid().ToString().split('-')[0], { Role: XCreep_1.XCreep.BUILDER });
                return;
            }
            return;
        }
        if (updaters < 2) {
            if (Game.spawns['Spawn'].canCreateCreep(body) == OK) {
                Game.spawns['Spawn'].createCreep(body, Guid_1.Guid.newGuid().ToString().split('-')[0], { Role: XCreep_1.XCreep.UPDATER });
                return;
            }
            return;
        }
    };
    return SpawnManager;
}());
exports.SpawnManager = SpawnManager;
