export class Guid
{
    constructor(guid: string)
    {
        this.guid = guid;
    }

    guid: string;

    public static newGuid() : Guid
    {
        //no error
        return new Guid(([1e7] + -1e3 + -4e3 + -8e3 + -1e11).toString().replace(/[018]/g, a => (a ^ Math.random() * 16 >> a / 4).toString(16)).toString());
    }
    public ToString(): string { return this.guid; }
}