/**
 * @constant
 * @type {string}
 */
const ROLE_STANDART = "standart";

var coreFrame =
{
    /** @param {Creep|Spawn|Structure} target
     *  @param {Creep} creep
     * **/
    SafeTransfer : function(creep, target)
    {
        creep.say("Переношу..");
        if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
            creep.moveTo(target);
    },
    /** @param {Creep} creep **/
    SafeHarvest : function (creep)
    {
        creep.say("Добываю..");
        var source = creep.pos.findClosestByPath(FIND_SOURCES);

        if(creep.harvest(source) == ERR_NOT_IN_RANGE)
            creep.moveTo(source);
    },
    /** @param {Creep|Spawn|Structure} target
     *  @param {Creep} creep
     * **/
    SafeUpgradeController : function (creep, target)
    {
        if(creep.upgradeController(target) == ERR_NOT_IN_RANGE)
            creep.moveTo(target);
        else
            creep.say("Обновляю..");
    },
    /** @param {ConstructionSite} target
     *  @param {Creep} creep
     * **/
    SafeBuild : function (creep, target)
    {
        if(creep.build(target) == ERR_NOT_IN_RANGE)
            creep.moveTo(target);
        else
            creep.say("Строю..");
    },
    /** @param {Creep} creep **/
    ObtainMemory : function(creep)
    {
        creep.say("|KERNEL UPDATE|");
        if(creep.memory.role == undefined)
            creep.memory.role = ROLE_STANDART;
        if(creep.memory.isWork == undefined)
            creep.memory.isWork = false;
        if(creep.memory.Index == undefined)
            creep.memory.Index = 0;
        if(creep.memory.Link == undefined)
            creep.memory.Link = null;
    },
    /** @param {Creep} creep **/
    ObtainWork : function (creep)
    {
        creep.say("Думаю..");
        if(creep.carry.energy == 0)
            creep.memory.isWork = true;
        else if(creep.carry.energy == 50)
            creep.memory.isWork = false;
    }
};

module.exports = coreFrame;