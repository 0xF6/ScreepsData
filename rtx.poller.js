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
        if(target !== null)
            creep.rangedAttack(target);
        else
        creep.moveTo(creep.pos.findClosestByPath(FIND_EXIT_BOTTOM));

        return;
        //If there's not a target near by, let's go search for a target if need be
        if(target === null)
            return this.rest();

        this.kite(target);
        creep.rangedAttack(target);

    },
    /**
     * All credit goes to Djinni
     * @url https://bitbucket.org/Djinni/screeps/
     */
    rest: function(civilian)
    {
        var creep = this.creep;

        var distance = 4;
        var restTarget = Game.spawns['s1'];

        if(!civilian) {
            var flags = Game.flags;
            for (var i in flags) {
                var flag = flags[i];
                if (creep.pos.inRangeTo(flag, distance) || creep.pos.findPathTo(flag).length > 0) {
                    restTarget = flag;
                    break;
                }
            }
        }

//		var flag = Game.flags['Flag1'];
//		if(flag !== undefined && civilian !== true)
//			restTarget = flag;
//
//		var flag2 = Game.flags['Flag2'];
//		if(flag !== undefined && civilian !== true && !creep.pos.inRangeTo(flag, distance) && !creep.pos.findPathTo(flag).length)
//			restTarget = flag2;

        if (creep.getActiveBodyparts(HEAL)) {
//			distance = distance - 1;
        }
        else if (creep.getActiveBodyparts(RANGED_ATTACK)) {
//			distance = distance - 1;
        }
        if (creep.pos.findPathTo(restTarget).length > distance) {
            creep.moveTo(restTarget);
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

        return creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES);
    },
    /**
     * All credit goes to Djinni
     * @url https://bitbucket.org/Djinni/screeps/
     */
    rangedAttack: function(target) {
        var creep = this.creep;

        if(!target)
            target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);

        if(target) {
            if (target.pos.inRangeTo(creep.pos, 3) ) {
                creep.rangedAttack(target);
                return target;
            }
        }
        return null;
    },
    kite : function(target)
    {
        var creep = this.creep;

        if (target.pos.inRangeTo(creep.pos, 2))
        {
            creep.moveTo(creep.pos.x + creep.pos.x - target.pos.x, creep.pos.y + creep.pos.y - target.pos.y );
            return true;
        }
        else if (target.pos.inRangeTo(creep.pos, 3))
        {
            return true;
        }
        else
            {
            creep.moveTo(target);
            return true;
        }

        return false;
    }
};

module.exports = poller;