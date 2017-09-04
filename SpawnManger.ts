import { XCreep } from "./XCreep";
import { Guid } from "./Guid";
import { List } from "./LinqTS";

export class SpawnManager
{
    public static Update(): void
    {
        let providers = _.sum(Game.creeps, (x) => x.memory.Role == XCreep.PROVIDER);
        let builders = _.sum(Game.creeps, (x) => x.memory.Role == XCreep.BUILDER);
        let updaters = _.sum(Game.creeps, (x) => x.memory.Role == XCreep.UPDATER);
        let filler = _.sum(Game.creeps, x => x.memory.Role == XCreep.FILLER);

        let body = [MOVE, CARRY, WORK, CARRY, CARRY];

        let sources = _.sum(Game.creeps, x => x.memory.Role == XCreep.SOURCES);
        let lenSources = JSON.parse(RawMemory.segments[0]).lenSources;

        if(sources < lenSources)
        {
            if(Game.spawns['Spawn1'].canCreateCreep([MOVE,MOVE, WORK, WORK, WORK,WORK,WORK, CARRY,CARRY]) == OK)
            {
                Game.spawns['Spawn1'].createCreep([MOVE,MOVE, WORK, WORK, WORK,WORK,WORK, CARRY,CARRY], "@" + Guid.newGuid()
                    .ToString()
                    .split('-')[0], { Role: XCreep.SOURCES });
                return;
            }
            return;
        }
        if(filler < 2)
        {
            if(Game.spawns['Spawn1'].canCreateCreep([MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, WORK]) == OK)
            {
                Game.spawns['Spawn1'].createCreep([MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, WORK], "&" + Guid.newGuid()
                        .ToString()
                        .split('-')[0], { Role: XCreep.FILLER });
                return;
            }
            return;
        }
        if(providers < 3)
        {
            if(Game.spawns['Spawn1'].canCreateCreep([MOVE, MOVE, MOVE, WORK, CARRY, CARRY]) == OK)
            {
                Game.spawns['Spawn1'].createCreep([MOVE, MOVE, MOVE, WORK, CARRY, CARRY], "p-" + Guid.newGuid()
                    .ToString()
                    .split('-')[0], { Role: XCreep.PROVIDER });
                return;
            }
            return;
        }
        if(builders < 5)
        {
            if(Game.spawns['Spawn1'].canCreateCreep([MOVE, CARRY, WORK, WORK, CARRY]) == OK)
            {
                Game.spawns['Spawn1'].createCreep([MOVE, CARRY, WORK, WORK, CARRY],`b-${Guid.newGuid().ToString().split('-')[0]}`,{Role: XCreep.BUILDER});
                return;
            }
            return;
        }
        if(updaters < 4)
        {
            if(Game.spawns['Spawn1'].canCreateCreep([MOVE,MOVE,MOVE,WORK,WORK,WORK,CARRY,CARRY,CARRY]) == OK)
            {
                Game.spawns['Spawn1'].createCreep([MOVE,MOVE,MOVE,WORK,WORK,WORK,CARRY,CARRY,CARRY], `u-${Guid.newGuid().ToString().split('-')[0]}`,{Role: XCreep.UPDATER});
                return;
            }
            return;
        }
    }
}