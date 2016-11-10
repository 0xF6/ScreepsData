var roleBuilder = require('role.builder');

var roleRtxUpdater = require('rtx.updater');
var roleRtxProvider = require('rtx.provider');
var roleRtxRepairer = require('rtx.repairer');

var rtxLinker = require('rtx.linker');
var rtxPoller = require('rtx.poller');
var rtxClaimer = require('rtx.claimer');

var core = require('core.framework');
var FrameCreep = require('rtx.creeps');
var spawnManager = require('core.spawn');

module.exports.loop = function () 
{
    // Game.spawns['s1'].createCreep([MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK], "p-1", {role: "poller"})
    spawnManager.ManageSpawn();
    core.Collect();
    core.TowerUpdate();
    for(var name in Game.creeps) 
    {
        var creep = Game.creeps[name];
        core.ObtainIndex(creep);
        rtxLinker.LinkUpdate();

        if(creep.memory.RoomWork == "W32N54")
        {
            if(creep.memory.role == 'builder')
                FrameCreep.Builder(creep);
            else if(creep.memory.role == 'updater')
                FrameCreep.UpDater(creep);
            else if(creep.memory.role == "provider")
                FrameCreep.Provider(creep);
            else
                core.ObtainMemory(creep);
        }
        else
        if(creep.memory.RoomWork == "W32N56")
        {
            if(creep.memory.role == "provider")
                FrameCreep.Provider(creep);
            else
                core.ObtainMemory(creep);
        }
        else
        {
            if(creep.memory.role == 'repairer')
                roleRtxRepairer.run(creep);
            else if(creep.memory.role == 'builder')
                roleBuilder.run(creep);
            else if(creep.memory.role == 'claimer')
                rtxClaimer.run(creep);
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
}