var core = require('core.framework');
var poller =
{
    /**
     * The creep for this role
     *
     * @type Creep
     */
    creep: null,
    /** @param {Creep} creeps **/
    run: function(creeps)
    {
        this.creep = creeps;
        var creep = this.creep;

        core.ObtainMemory(creep);
        core.ObtainWork(creep);

        var target = this.getRangedTarget();
        if(target != null && target.structureType != STRUCTURE_CONTROLLER)
        {
            if(creep.rangedAttack(target) == ERR_NOT_IN_RANGE)
                creep.moveTo(target);
        }
        else if(creep.room.name == "W32N55")
        creep.moveTo(creep.pos.findClosestByPath(FIND_EXIT_BOTTOM));
        else if(creep.room.name == "W32N54")
        {
            var targetWall = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (x) => x.structureType == STRUCTURE_WALL});
            if(targetWall != undefined || targetWall != null)
                if(creep.attackController(targetWall) == ERR_NOT_IN_RANGE)
                    creep.moveTo(targetWall);
        }
    },
    getRangedTarget: function()
    {
        var creep = this.creep;

        var closeArchers = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, {
            filter: function(enemy)
            {
                return enemy.getActiveBodyparts(RANGED_ATTACK) > 0
                    && creep.pos.inRangeTo(enemy, 3);
            }
        });

        if(closeArchers != null)
            return closeArchers;

        var closeMobileMelee = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, {
            filter: function(enemy)
            {
                return enemy.getActiveBodyparts(ATTACK) > 0
                    && enemy.getActiveBodyparts(MOVE) > 0
                    && creep.pos.inRangeTo(enemy, 3);
            }
        });

        if(closeMobileMelee != null)
            return closeMobileMelee;

        var closeHealer = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, {
            filter: function(enemy)
            {
                return enemy.getActiveBodyparts(HEAL) > 0
                    && enemy.getActiveBodyparts(MOVE) > 0
                    && creep.pos.inRangeTo(enemy, 3);
            }
        });

        if(closeHealer != null)
            return closeHealer;

        var workCreep = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);

        if(workCreep != null)
            return workCreep;

        return creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES);
    }
};

module.exports = poller;