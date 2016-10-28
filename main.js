var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleEnergyProvider = require('role.energyProvider');
var roleRepair = require('role.repairer');

var core = require('core.framework');
var spawnManager = require('core.spawn');


module.exports.loop = function () 
{
    spawnManager.ManageSpawn();

    for(var name in Game.creeps) 
    {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'repairer')
            roleRepair.run(creep);
        else if(creep.memory.role == 'builder')
            roleBuilder.run(creep);
        else if(creep.memory.role == 'provider')
            roleEnergyProvider.run(creep);
        else if(creep.memory.role == 'updater')
            roleUpgrader.run(creep);
        else
            core.ObtainMemory(creep);
    }
}