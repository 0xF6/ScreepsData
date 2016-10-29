/**
 * @constant
 * @type {string}
 */
const BUILDER = 2;
/**
 * @constant
 * @type {string}
 */
const REPAIRER = 3;
/**
 * @constant
 * @type {string}
 */
const UPGRADER = 5;
/**
 * @constant
 * @type {string}
 */
const PROVIDER = 3;


var spawn =
{
    ManageSpawn : function()
    {
        var cBuilder = _.sum(Game.creeps, (x)=> x.memory.role == 'builder');
        var cRepairer = _.sum(Game.creeps, (x)=> x.memory.role == 'repairer');
        var cUpgrader = _.sum(Game.creeps, (x)=> x.memory.role == 'updater');
        var cProvider = _.sum(Game.creeps, (x)=> x.memory.role == 'provider');

        if(cBuilder < BUILDER)
            if(Game.spawns['s1'].canCreateCreep([MOVE, WORK, CARRY, WORK]) == 0)
            Game.spawns['s1'].createCreep([MOVE, WORK, CARRY, WORK], 'bx-' + Game.spawns['s1'].memory.index.builder++, {role: 'builder', isWork: false});
        if(cRepairer < REPAIRER)
            if(Game.spawns['s1'].canCreateCreep([MOVE, WORK, CARRY, WORK]) == 0)
            Game.spawns['s1'].createCreep([MOVE, WORK, CARRY, WORK], 'rx-' + Game.spawns['s1'].memory.index.repairer++, {role: 'repairer', isWork: false});
        if(cUpgrader < UPGRADER)
            if(Game.spawns['s1'].canCreateCreep([MOVE, WORK, CARRY, CARRY]) == 0)
            Game.spawns['s1'].createCreep([MOVE, WORK, CARRY, CARRY], 'ux-' + Game.spawns['s1'].memory.index.updater++, {role: 'updater', isWork: false});
        if(cProvider < PROVIDER)
            if(Game.spawns['s1'].canCreateCreep([MOVE, WORK, CARRY, WORK]) == 0)
            Game.spawns['s1'].createCreep([MOVE, WORK, CARRY, WORK], 'px-' + Game.spawns['s1'].memory.index.provider++, {role: 'provider', isWork: false})
    }
};

module.exports = spawn;