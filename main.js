var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var core = require('core.framework');
var roleEnergyProvider = require('role.energyProvider');


module.exports.loop = function () 
{
    for(var name in Game.creeps) 
    {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester')
            roleHarvester.run(creep);
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