var core = require('core.framework');
var roleUpgrader = require('role.upgrader');
var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep)
	{
        var targets = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if(targets != undefined)
        {
            core.ObtainMemory(creep);
            core.ObtainWork(creep);
            if(!creep.memory.isWork)
                core.SafeBuild(creep, targets);
            else
                core.SafeHarvest(creep);
        }
        else
            roleUpgrader.run(creep);
	}
};

module.exports = roleBuilder;