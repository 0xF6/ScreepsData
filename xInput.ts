import { Guid } from "./Guid";
import { SpawnManager } from "./SpawnManger";
import { XCreep } from "./XCreep";
import { XTower } from "./XTower";
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
        for(let x in Game.structures)
        {
            let str = Game.structures[x];
            if(str.structureType != "tower") continue;
            let tow = new XTower(<Tower>str);
            tow.Work();
        }
    }
}