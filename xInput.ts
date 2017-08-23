import { Guid } from "./Guid";
import { SpawnManager } from "./SpawnManger";
import { XCreep } from "./XCreep";

export class xInput
{
    public static Main(): void
    {
        for (let name in Memory.creeps)
            if (Game.creeps[name] == undefined)
                delete Memory.creeps[name];

        SpawnManager.Update();


        for(let name in Game.creeps)
        {
            let creep = Game.creeps[name];
            let xcreep = new XCreep(creep);
            xcreep.Work();
        }
    }
}