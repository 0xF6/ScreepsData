import { NObject } from  "./mscorlib"
import { Guid } from "./Guid";
export class XObject extends NObject
{
    constructor()
    {
        super();
        this.uid = Guid.newGuid();
    }

    private uid: Guid;

    public getID(): Guid { return this.uid; }
}