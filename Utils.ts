import { List } from "./LinqTS";
import { ControllerLevel } from "./SpawnManger";
import { ArgumentException } from "./mscorlib";
export class Utils
{
    public static checkForRampart(coords : RoomPosition) : List<Rampart>
    {
        let pos = new RoomPosition(coords.x, coords.y, coords.roomName);
        let structures = pos.lookFor('structure');
        return new List(_.find(structures, (s) => s.structureType === STRUCTURE_RAMPART));
    }
    public static getClosestSource(filter)
    {
        //let source = this.findClosestByPath(FIND_SOURCES_ACTIVE, { filter });
        //if (source === null) source = this.findClosestByRange(FIND_SOURCES_ACTIVE);
        //if (source === null) source = this.findClosestByRange(FIND_SOURCES);
        //return source;
    }
    public static findInRangeStructures(objects, range, structureTypes)
    {
        //return this.findInRangePropertyFilter(objects, range, 'structureType', structureTypes);
    }
    public static findClosestStructure(structures: List<Structure>, structureType: string)
    {
        //return this.findClosestByPathPropertyFilter(structures, 'structureType', [structureType]);
    }
    public static getAdjacentPosition(roomPos: RoomPosition, direction: number)
    {
        const adjacentPos = [
            [0, 0],
            [0, -1],
            [1, -1],
            [1, 0],
            [1, 1],
            [0, 1],
            [-1, 1],
            [-1, 0],
            [-1, -1]
        ];
        if (direction > 8) direction = (direction - 1) % 8 + 1;
        return new RoomPosition(roomPos.x + adjacentPos[direction][0], roomPos.y + adjacentPos[direction][1], roomPos.roomName);
    }
    public static hasNonObstacleAdjacentPosition()
    {
        //for (let pos of this.getAllPositionsInRange(1))
        //if (!pos.checkForWall() && !pos.checkForObstacleStructure() && !pos.checkForCreep())
        //    return true;
        return false;
    }
    public static checkForCreep(roomPos: RoomPosition)
    {
        return roomPos.lookFor(LOOK_CREEPS).length > 0;
    }

    public static getLevelRampact()
    {
        switch(Utils.getRCL())
        {
            case ControllerLevel.RCL1:
                return null;    // DISABLED
            case ControllerLevel.RCL2:
            case ControllerLevel.RCL3:
                return 10000;    // 10K
            case ControllerLevel.RCL4:
            case ControllerLevel.RCL5:
                return 50000;    // 50K
            case ControllerLevel.RCL6:
            case ControllerLevel.RCL7:
                return 150000;   // 150K
            case ControllerLevel.RCL8:
                return 10000000; // 10M
        }
    }
    public static getLevelWall()
    {
        switch(Utils.getRCL())
        {
            case ControllerLevel.RCL1:
                return null;     // DISABLED
            case ControllerLevel.RCL2:
            case ControllerLevel.RCL3:
                return 1000;     // 1K
            case ControllerLevel.RCL4:
            case ControllerLevel.RCL5:
                return 5000;     // 5K
            case ControllerLevel.RCL6:
            case ControllerLevel.RCL7:
                return 150000;   // 150K
            case ControllerLevel.RCL8:
                return 10000000; // 10M
        }
    }
    public static isAllowRepairWall(store: StructureStorage)
    {
        if(store == null)
            return false;
        try
        {
            return store.store.energy >= store.storeCapacity / 2;
        }
        catch(e)
        {
            return false;
        }
    }
    public static isAllowRepairRampact(store: StructureStorage)
    {
        if(store == null)
            return false;
        try
        {
            return store.store.energy >= store.storeCapacity / 4;
        }
        catch(e)
        {
            return false;
        }
    }
    public static getStorage(sx: Structure)
    {
        try
        {
            let target : Storage = sx.pos.findClosestByPath(FIND_MY_STRUCTURES,
                {
                    filter: (x) =>
                    x.structureType == STRUCTURE_STORAGE
                });
            return target;
        }
        catch(e)
        {
            return null;
        }
    }

    public static getRCL(): ControllerLevel
    {
        return Game.spawns["Spawn1"].memory.RCL;
    }

    /**
     * @param type - Creep Type
     * @param room - current search room
     * @return List of Creep
     * @throws ArgumentException
     */
    public static getAllCreep(type: CreepType, room : Room) : List<Creep>
    {
        switch(type)
        {
            case CreepType.Enemy:
                return new List(_.filter(room.find(FIND_CREEPS), (creep : Creep) => !creep.my));
            case CreepType.My:
                return new List( _.filter(room.find(FIND_CREEPS), (creep : Creep) => creep.my));
            case CreepType.Wounded:
                return new List(_.filter(room.find(FIND_CREEPS), (creep : Creep) => creep.my && creep.hits != creep.hitsMax));
            default:
                throw new ArgumentException("type: CreepType");
        }
    }
}

export enum CreepType
{
    Enemy,
    My,
    Wounded
}