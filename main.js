var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleEnergyProvider = require('role.energyProvider');
var roleRepair = require('role.repairer');

var roleRtxUpdater = require('rtx.updater');
var roleRtxProvider = require('rtx.provider');

var core = require('core.framework');
var spawnManager = require('core.spawn');

module.exports.loop = function () 
{
    
    //var ctrl = Game.creeps['H-1'].room.find(FIND_STRUCTURES, { filter: function(structure) { if(structure.structureType == STRUCTURE_CONTROLLER) { return true; }  return false; } } );
    //Game.creeps['H-1'].moveTo(ctrl[0]);
    //var result = Game.creeps['H-1'].claimController(ctrl[0]);
    //console.log(result);
    spawnManager.ManageSpawn();
    core.Collect();
    core.Safe(Game.spawns['s1'].room);
    for(var name in Game.creeps) 
    {
        var creep = Game.creeps[name];

        core.ObtainIndex(creep);

        if(creep.memory.role == 'repairer')
            roleRepair.run(creep);
        else if(creep.memory.role == 'builder')
            roleBuilder.run(creep);
        else if(creep.memory.role == 'provider')
            if(creep.memory.isFiller)
            roleRtxProvider.run(creep, true);
            else
            roleRtxProvider.run(creep, false);
        else if(creep.memory.role == 'updater')
            roleRtxUpdater.run(creep);
        else
            core.ObtainMemory(creep);
    }
}