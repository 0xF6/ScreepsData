var core = require('core.framework');

var roleEnergyProvider =
{
    /** @param {Creep} creep **/
    run: function(creep)
    {
        core.ObtainMemory(creep);
        core.ObtainWork(creep);
        if(!creep.memory.isWork)
            core.SafeTransfer(creep, creep.pos.findClosestByPath(FIND_MY_STRUCTURES, { filter: (x) => x.structureType ==  STRUCTURE_EXTENSION && x.energy != 50 })); //{ structureType: STRUCTURE_EXTENSION, energy: 0 }
        else
            core.SafeHarvest(creep);
    }
};

module.exports = roleEnergyProvider;