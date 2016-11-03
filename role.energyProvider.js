var core = require('core.framework');
var upd = require('role.upgrader');
var roleEnergyProvider =
{
    /** @param {Creep} creep **/
    run: function(creep)
    {
        core.ObtainMemory(creep);
        core.ObtainWork(creep);

        var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES,
        {
            filter: (x) =>
            x.structureType == STRUCTURE_EXTENSION && x.energy != 50 ||
            x.structureType == STRUCTURE_SPAWN && x.energy != 300
        });
        if(target == null)
        target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, { filter: (x) => x.structureType == STRUCTURE_STORAGE && x.energy != x.storeCapacity });

        if(!creep.memory.isWork)
            if(target != null)
                core.SafeTransfer(creep, target);
            else
                upd.run(creep);
        else
            core.SafeHarvest(creep);
    }
};

module.exports = roleEnergyProvider;