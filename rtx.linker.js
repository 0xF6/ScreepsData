var core = require('core.framework');
var rtxLinker = {

    /** @param {Creep} creep **/
    ToLink: function(creep)
    {
        core.ObtainMemory(creep);
        core.ObtainWork(creep);

        var targets = Game.getObjectById("581e5cc423523a280350ac83");
        if(!creep.memory.isWork)
            core.SafeTransfer(creep, targets);
        else
            core.SafeHarvestByID(creep, "579fa9100700be0674d2ebc8");
    },
    /** @param {Creep} creep **/
    AtLinkToStorage : function (creep)
    {
        core.ObtainMemory(creep);
        core.ObtainWork(creep);

        var linkUp = Game.getObjectById("581e804ed9070db934ed1c83");
        var storage = Game.getObjectById("5818077e5e7bc24b156eb578");
        if(!creep.memory.isWork)
            core.SafeTransfer(creep, storage);
        else
        {
            var result = linkUp.transferEnergy(creep, creep.carry.carryCapacity);
            if(result == -9)
            {
                creep.moveTo(linkUp);
                return;
            }
            if(result == ERR_TIRED)
                console.log("ERR_TIRED");
            else if(result == ERR_NOT_ENOUGH_RESOURCES)
                creep.say('wait..')
        }
    },
    LinkUpdate : function ()
    {
        var linkDown = Game.getObjectById("581e5cc423523a280350ac83");
        var linkUp = Game.getObjectById("581e804ed9070db934ed1c83");
        if(linkDown.energy >= linkDown.energyCapacity / 2)
            linkDown.transferEnergy(linkUp);
    }
};

module.exports = rtxLinker;