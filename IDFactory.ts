/// <remarks>
/// This class is responsible for id generation for all Alfheim-Emu objects.
/// This class is Thread-Safe.
/// This class is designed to be very strict with id usage.
///  Any illegal operation will throw IDFactoryError
/// </remarks>
import { IDFactoryError } from "./IDFactoryError";
import { List } from "./LinqTS";

export class IDFactory
{
    private static instance : IDFactory;
    /// <summary>
    /// Bitset that is used for all id's.
    /// </summary>
    public readonly idList: List<number>;
    /// <summary>
    /// Id that will be used as minimal on next id request.
    /// </summary>
    private nextMinId: Int64 = 0;

    constructor()
    {
        this.idList = new List();
        this.LockIDs(0);

        console.log(`IDFactory: ${this.getUsedCount()} id's used.`);
    }

    public static getInstance() : IDFactory
    {
        if (IDFactory.instance == undefined || IDFactory.instance == null)
            return (IDFactory.instance = new IDFactory());
        return IDFactory.instance;
    }
    /// <summary>
    /// Returns next free id.
    /// </summary>
    /// <exception cref="IDFactoryError">
    /// if there is no free id's
    /// </exception>
    public  NextID(): Int64
    {
        try
        {
            let id = this.nextMinId;

            if (id == -2147483648) throw new IDFactoryError("All id's are used, please clear your database");
            this.idList.Add(id);

            this.nextMinId = id++;
            return id;
        }
        finally
        {
        }
    }
    /// <summary>
    /// Locks given ids.
    /// </summary>
    /// <exception cref="IDFactoryError">
    /// if some of the id's were locked before
    /// </exception>
    public LockIDs(... ids: int[]): void
    {
        try
        {

            for (let idx in ids)
            {
                let id: Int32 = ids[idx];
                let status: boolean = this.idList.Contains(id);
                if (status)
                    throw new IDFactoryError(`ID '${id}' is already taken, fatal error!!!`);
                this.idList.Add(id);
            }
        }
        finally
        {
        }
    }

    /// <summary>
    /// Releases given id
    /// </summary>
    /// <exception cref="IDFactoryError">
    /// if id was not taken earlier
    /// </exception>
    public  ReleaseID(id: int): void
    {
        try
        {
            let status : bool = this.idList[id];
            if (!status)
            throw new IDFactoryError(`ID '${id}' is not taken, can't release it.`);
            this.idList.Remove(id);
            if (id < this.nextMinId || this.nextMinId == -2147483648)
                this.nextMinId = id;
        }
        finally { }
    }
    /// <summary>
    /// Returns amount of used ids
    /// </summary>
    public getUsedCount() : int
    {
        try
        {
            return this.idList.Count();
        }
        finally
        {
        }
    }
}