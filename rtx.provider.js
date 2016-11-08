var core = require('core.framework');

var RtxEnergyProvider =
{
    /** @param {Creep} creep
     *  @param {Boolean} isFiller
     * **/
    run: function(creep, isFiller)
    {
        core.ObtainMemory(creep);
        core.ObtainWork(creep);

        if(isFiller)
            this.Fill(creep);
        else
            this.Provide(creep);

    },
    /** @param {Creep} creep **/
    runTower : function (creep)
    {
        core.ObtainMemory(creep);
        core.ObtainWork(creep);
        var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES,
            {
                filter: (x) => x.structureType == STRUCTURE_TOWER && x.energy != 1000
            });
        if(target != null)
            this.TransfAndFill(creep, target);
        else
            this.Fill(creep);
    },
    /** @param {Creep} creep **/
    Provide : function (creep)
    {
        var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES,
            {
                filter: (x) =>
                x.structureType == STRUCTURE_EXTENSION && x.energy != 50 ||
                x.structureType == STRUCTURE_SPAWN && x.energy != 300
            });
        if(target != null)
            this.TransfAndFill(creep, target);
        else
            this.Fill(creep);
    },
    /** @param {Creep} creep **/
    Fill : function (creep)
    {
        var targetStorage = creep.pos.findClosestByPath(FIND_MY_STRUCTURES,
            {
                filter: (x) =>
                x.structureType == STRUCTURE_STORAGE &&
                x.energy != x.storeCapacity
            });
        this.TransfAndHarv(creep, targetStorage);
    },
    TransfAndFill : function(creep, target)
    {
        if(!creep.memory.isWork)
            core.SafeTransfer(creep, target);
        else
            core.SafeFill(creep);
    },
    /** @param {Creep} creep **/
    TransfAndHarv : function (creep, target)
    {
        if(!creep.memory.isWork)
            core.SafeTransfer(creep, target);
        else
            core.SafeHarvest(creep);
    }
};

module.exports = RtxEnergyProvider;