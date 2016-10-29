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
        if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
            creep.moveTo(target);
        else
            creep.say("Переношу..");
    },
    /** @param {Creep} creep **/
    SafeHarvest : function (creep)
    {
        var source = creep.pos.findClosestByPath(FIND_SOURCES);

        if(creep.memory.sourceIndex != undefined)
        {
            var sources = creep.room.find(FIND_SOURCES);
            source = sources[creep.memory.sourceIndex];
        }

        var result = creep.harvest(source);
        if(result == ERR_NOT_IN_RANGE)
            creep.moveTo(source);
        else if(result == OK)
            creep.say("Добываю..");
        else if(result == ERR_INVALID_TARGET)
            creep.say("INVALID_TARGET");

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
    /** @param {Spawn|Structure} target
     *  @param {Creep} creep
     * **/
    SafeRepair : function (creep, target)
    {
        if(creep.repair(target) == ERR_NOT_IN_RANGE)
            creep.moveTo(target);
        else
            creep.say("Чиню..");
    },
    /** @param {Creep} creep **/
    ObtainMemory : function(creep)
    {
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
        if(creep.carry.energy == 0)
            creep.memory.isWork = true;
        else if(creep.carry.energy == 50)
            creep.memory.isWork = false;
    },
    /** @param {Creep} creep **/
    ObtainIndex : function (creep)
    {
        if(creep.memory.sourceIndex != undefined) return;

        var sources = Game.spawns['s1'].room.find(FIND_SOURCES);
        creep.memory.sourceIndex = Math.floor(Math.random()*sources.length);
    }
};

module.exports = coreFrame;