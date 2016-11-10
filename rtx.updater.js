var core = require('core.framework');

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        core.ObtainMemory(creep);
        core.ObtainWork(creep);
        if(!creep.memory.isWork)
            core.SafeUpgradeController(creep, creep.room.controller);
        else
            core.SafeFill(creep);
    }
};

module.exports = roleUpgrader;