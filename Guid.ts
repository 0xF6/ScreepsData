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
        return new Guid(("10000000-1000-4000-8000-100000000000").replace(/[018]/g,
            (a: string) => { return (parseInt(a) ^ Math.random() * 16 >> parseInt(a) / 4).toString(16);})
            .toString());
    }
    public ToString(): string { return this.guid; }
}