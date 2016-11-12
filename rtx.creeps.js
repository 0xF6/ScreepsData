var core = require('core.framework');

var coreCreeps =
{
    /** @param {Creep} creep **/
    UpDater : function(creep)
    {
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
        }
    },
    /** @param {Creep} creep **/
    Builder : function(creep)
    {
        core.ObtainMemory(creep);
        core.ObtainWork(creep);

        if(creep.memory.RoomWork == "W32N54")
        {
            core.SafeMoveRoom(creep);

            if(creep.room.name == "W32N54")
            {
                var targets = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                if(targets != undefined)
                {
                    core.ObtainMemory(creep);
                    core.ObtainWork(creep);
                    if(!creep.memory.isWork)
                        core.SafeBuild(creep, targets);
                    else
                        core.SafeHarvestByID(creep, "579fa9100700be0674d2ebca");
                }
                else
                    this.UpDater(creep);
            }
        }
    },
    /** @param {Creep} creep **/
    Provider : function (creep)
    {
        core.ObtainMemory(creep);
        core.ObtainWork(creep);

        if(creep.memory.RoomWork == "W32N56")
        {
            
            if(creep.room.name == "W32N55" && !creep.memory.isWork)
            {
                var targetStorage = creep.pos.findClosestByPath(FIND_MY_STRUCTURES,
                    {
                        filter: (x) =>
                        x.structureType == STRUCTURE_STORAGE &&
                        x.energy != x.storeCapacity
                    });

                core.SafeTransfer(creep, targetStorage);
            }
            
            if(creep.room.name == "W32N55" && creep.memory.isWork)
            {
                creep.moveTo(creep.pos.findClosestByPath(FIND_EXIT_TOP));
            }
            else
            if(creep.room.name == "W32N56")
            {
                if(!creep.memory.isWork)
                {
                    if(creep.room.name == "W32N56")
                    {
                        var c = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

                        if(c)
                        {
                            core.SafeBuild(creep, c);
                            return;
                        }

                        creep.moveTo(creep.pos.findClosestByPath(FIND_EXIT_BOTTOM));
                    }
                }
                else
                    core.SafeHarvestByID(creep, "579fa9100700be0674d2ebc4");
            }

        }
    }
};

module.exports = coreCreeps;