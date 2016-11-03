/**
 * @constant
 * @type {string}
 */
const ROLE_STANDART = "standart";

var coreFrame =
{
    /** @param {Creep} creep **/
    SafeFill : function(creep)
    {
        var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES,
            {
                filter: (x) =>
                x.structureType == STRUCTURE_STORAGE &&
                x.energy != x.storeCapacity
            });
        var result = target.transfer(creep, RESOURCE_ENERGY);
        if(result == ERR_NOT_IN_RANGE)
            this.SafeMove(creep, target);
        else if(result == ERR_NOT_ENOUGH_RESOURCES)
            this.SafeHarvest(creep);

    },
    /** @param {Spawn|Structure} target
     *  @param {Creep} creep
     * **/
    SafeMove : function(creep, target)
    {
        if(creep.moveTo(target) == ERR_INVALID_TARGET)
            creep.say('ERROR');
    },
    /** @param {Creep|Spawn|Structure} target
     *  @param {Creep} creep
     * **/
    SafeTransfer : function(creep, target)
    {
        if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
            this.SafeMove(creep, target);
        else
            creep.say("Переношу..");
    },
    /** @param {Creep} creep **/
    SafeHarvest : function (creep)
    {
        var source = creep.pos.findClosestByPath(FIND_SOURCES);

        if(creep.memory.sourceIndex != undefined)
        source = creep.room.find(FIND_SOURCES)[creep.memory.sourceIndex];

        var energy = creep.pos.findInRange(FIND_DROPPED_ENERGY, 1);
        if (energy.length)
        {
            console.log('found ' + energy[0].energy + ' energy at ', energy[0].pos);
            creep.pickup(energy[0]);
            creep.say("Собираю..");
            return;
        }

        var result = creep.harvest(source);
        if(result == ERR_NOT_IN_RANGE)
            this.SafeMove(creep, source);
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
            this.SafeMove(creep, target);
        else
            creep.say("Обновляю..");
    },
    /** @param {ConstructionSite} target
     *  @param {Creep} creep
     * **/
    SafeBuild : function (creep, target)
    {
        if(creep.build(target) == ERR_NOT_IN_RANGE)
            this.SafeMove(creep, target);
        else
            creep.say("Строю..");
    },
    /** @param {Spawn|Structure} target
     *  @param {Creep} creep
     * **/
    SafeRepair : function (creep, target)
    {
        if(creep.repair(target) == ERR_NOT_IN_RANGE)
            this.SafeMove(creep, target);
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
        if(creep.memory.role == "provider")
        if(creep.memory.isFiller == undefined)
            creep.memory.isFiller = false;
    },
    /** @param {Creep} creep **/
    ObtainWork : function (creep)
    {
        if(creep.carry.energy == 0)
            creep.memory.isWork = true;
        else if(creep.carry.energy == creep.carryCapacity)
            creep.memory.isWork = false;
    },
    /** @param {Creep} creep **/
    ObtainIndex : function (creep)
    {
        if(creep.memory.sourceIndex != undefined) return;

        var indexS = 0;

        if(Game.spawns['s1'].memory.blockSource == undefined)
            Game.spawns['s1'].memory.blockSource = true;
        if(Game.spawns['s1'].memory.blockSource)
        {
            indexS = 1;
            Game.spawns['s1'].memory.blockSource = false;
        }
        else
        {
            indexS = 0;
            Game.spawns['s1'].memory.blockSource = true;
        }

        creep.memory.sourceIndex = indexS;
    },
    /**
     * check for memory entries of died creeps by iterating over Memory.creeps
     * **/
    Collect : function ()
    {
        for (let name in Memory.creeps)
        if (Game.creeps[name] == undefined)
        delete Memory.creeps[name];
    },
    /** @param {Room} room **/
    Safe : function (room)
    {
        enemyCreeps = _.filter(room.find(FIND_CREEPS), (creep) => !creep.my);

        // If more than one enemy creeps, activate safe mode
        if (enemyCreeps.length > 2)
            room.activateSafeMode();
    }
};

module.exports = coreFrame;