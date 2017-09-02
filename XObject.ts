import { Guid } from "./Guid";
export class XObject
{
    constructor()
    {
        this.uid = Guid.newGuid();
    }

    private uid: Guid;

    public getID(): Guid { return this.uid; }

    public ToString() : String { return `XObject [${this.uid}]`; }
}