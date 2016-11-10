var core = require('core.framework');

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        core.ObtainMemory(creep);
        core.ObtainWork(creep);

        if(creep.memory.RoomWork == "W32N54")
        {
            core.SafeMoveRoom(creep);

            if(creep.room.name == "W32N54")
            {
                if(!creep.memory.isWork)
                    core.SafeUpgradeController(creep, creep.room.controller);
                else
                    core.SafeHarvestByID(creep, "579fa9100700be0674d2ebca");
            }
            return;
        }

        if(!creep.memory.isWork)
            core.SafeUpgradeController(creep, creep.room.controller);
        else
            core.SafeFill(creep);
    }
};

module.exports = roleUpgrader;