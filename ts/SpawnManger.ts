import { XCreep } from "./XCreep";
import { Guid } from "./Guid";

export class SpawnManager
{
    public static Update(): void
    {
        let providers = _.sum(Game.creeps, (x) => x.memory.Role == XCreep.PROVIDER);
        let builders = _.sum(Game.creeps, (x) => x.memory.Role == XCreep.BUILDER);
        let updaters = _.sum(Game.creeps, (x) => x.memory.Role == XCreep.UPDATER);

        let body = [MOVE, CARRY, WORK, CARRY, CARRY];

        if(providers > 1 && ((providers + builders + updaters) > 4))
        {
            body = [MOVE, CARRY, WORK, CARRY, CARRY, CARRY, WORK, WORK];
        }

        if(providers < 3)
        {
            if(Game.spawns['Spawn'].canCreateCreep(body) == OK)
            {
                Game.spawns['Spawn'].createCreep(body, Guid.newGuid()
                    .ToString()
                    .split('-')[0], { Role: XCreep.PROVIDER });
                return;
            }
            return;
        }
        if(builders < 5)
        {
            if(Game.spawns['Spawn'].canCreateCreep(body) == OK)
            {
                Game.spawns['Spawn'].createCreep(body, Guid.newGuid().ToString().split('-')[0],{Role: XCreep.BUILDER});
                return;
            }
            return;
        }
        if(updaters < 2)
        {
            if(Game.spawns['Spawn'].canCreateCreep(body) == OK)
            {
                Game.spawns['Spawn'].createCreep(body, Guid.newGuid().ToString().split('-')[0],{Role: XCreep.UPDATER});
                return;
            }
            return;
        }
    }
}