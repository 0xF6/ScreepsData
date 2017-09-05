
import { XCreep } from "./XCreep";
import { List } from "./LinqTS";
import { XGame } from "./XGame";


export class AdvancedCreep extends XCreep
{
    public Died()
    {
        if(XGame.creeps.FirstOrDefault(x => x.name == this.Creep.name) == undefined)
        {
            console.log('DIED', this.Creep.name, 'Creep is not found');
            return true;
        }
        return false;
    }


}
