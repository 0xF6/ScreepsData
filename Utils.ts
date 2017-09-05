import { List } from "./LinqTS";
export class Utils
{
    public checkForRampart(coords : RoomPosition)
    {
        let pos = new RoomPosition(coords.x, coords.y, coords.roomName);
        let structures = pos.lookFor('structure');
        return _.find(structures, (s) => s.structureType === STRUCTURE_RAMPART);
    }
    public getClosestSource(filter)
    {
        let source = this.findClosestByPath(FIND_SOURCES_ACTIVE, { filter });
        if (source === null) source = this.findClosestByRange(FIND_SOURCES_ACTIVE);
        if (source === null) source = this.findClosestByRange(FIND_SOURCES);
        return source;
    }
    public findInRangeStructures(objects, range, structureTypes)
    {
        return this.findInRangePropertyFilter(objects, range, 'structureType', structureTypes);
    }
    public findClosestStructure(structures: List<Structure>, structureType: string)
    {
        return this.findClosestByPathPropertyFilter(structures, 'structureType', [structureType]);
    }
    public getAdjacentPosition(roomPos: RoomPosition, direction: number)
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
    public hasNonObstacleAdjacentPosition()
    {
        for (let pos of this.getAllPositionsInRange(1))
        if (!pos.checkForWall() && !pos.checkForObstacleStructure() && !pos.checkForCreep())
            return true;
        return false;
    }
    public checkForCreep(roomPos: RoomPosition)
    {
        return roomPos.lookFor(LOOK_CREEPS).length > 0;
    }
}