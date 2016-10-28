var core = require('core.framework');
var builder = require('role.builder');
var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep)
    {
        var targets = creep.pos.findClosestByPath(FIND_STRUCTURES,
            {
                filter: (x) => x.hits < x.hitsMax && x.structureType != STRUCTURE_WALL
            });

        if(targets != undefined)
        {
            core.ObtainMemory(creep);
            core.ObtainWork(creep);
            if(!creep.memory.isWork)
                core.SafeRepair(creep, targets);
            else
                core.SafeHarvest(creep);
        }
        else
            builder.run(creep);
	}
};

module.exports = roleRepairer;