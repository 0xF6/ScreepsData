var roleBuilder = require('role.builder');

var roleRtxUpdater = require('rtx.updater');
var roleRtxProvider = require('rtx.provider');
var roleRtxRepairer = require('rtx.repairer');

var rtxLinker = require('rtx.linker');
var rtxPoller = require('rtx.poller');

var core = require('core.framework');
var spawnManager = require('core.spawn');

module.exports.loop = function () 
{
    spawnManager.ManageSpawn();
    core.Collect();
    core.TowerUpdate();
    for(var name in Game.creeps) 
    {
        var creep = Game.creeps[name];
        core.ObtainIndex(creep);
        rtxLinker.LinkUpdate();
        if(creep.memory.role == 'repairer')
            roleRtxRepairer.run(creep);
        else if(creep.memory.role == 'builder')
            roleBuilder.run(creep);
        else if(creep.memory.role == 'linker_in')
            rtxLinker.ToLink(creep);
        else if(creep.memory.role == 'linker_out')
            rtxLinker.AtLinkToStorage(creep);
        else if(creep.memory.role == 'poller')
            rtxPoller.run(creep);
        else if(creep.memory.role == 'provider')
            roleRtxProvider.run(creep, creep.memory.isFiller);
        else if(creep.memory.role == 'provider_tower')
            roleRtxProvider.runTower(creep);
        else if(creep.memory.role == 'updater')
            roleRtxUpdater.run(creep);
        else
            core.ObtainMemory(creep);
    }
}