var core = require('core.framework');

var roleEnergyProvider =
{
    /** @param {Creep} creep **/
    run: function(creep)
    {
        core.ObtainMemory(creep);
        core.ObtainWork(creep);
        if(!creep.memory.isWork)
            core.SafeTransfer(creep, Game.spawns['s1']);
        else
            core.SafeHarvest(creep);
    }
};

module.exports = roleEnergyProvider;