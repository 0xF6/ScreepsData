var core = require('core.framework');
var claimer =
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

        if(creep.room.name == "W32N55")
            creep.moveTo(creep.pos.findClosestByPath(FIND_EXIT_BOTTOM));
        else if(creep.room.name == "W32N54")
        {
            var result = creep.claimController(creep.room.controller);
            if(result == ERR_NOT_IN_RANGE)
                creep.moveTo(creep.room.controller);
            else if(result == OK)
                creep.say("claiming..", true);
            else
                console.log(result);
        }
    }
};

module.exports = claimer;