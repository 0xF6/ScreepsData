import { List } from "./LinqTS";

export class XGame
{
    public static get creeps() : List<Creep>
    {
        let lst = new List<Creep>();
        for(let nx in Game.creeps)
            lst.Add(Game.creeps[nx]);
        return lst;
    }

    public static get spawns() : List<Spawn>
    {
        let lst = new List<Spawn>();
        for(let nx in Game.spawns)
            lst.Add(Game.spawns[nx]);
        return lst;
    }
    public static get flags() : List<Flag>
    {
        let lst = new List<Flag>();
        for(let nx in Game.flags)
            lst.Add(Game.flags[nx]);
        return lst;
    }
}