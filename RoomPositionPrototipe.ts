import { List } from "./LinqTS";
import { CreepType, Utils } from "./Utils";


RoomPosition.prototype.getAllEnemyCreep = function() : List<Creep>
{
    return Utils.getAllCreep(CreepType.Enemy, this);
};
RoomPosition.prototype.getAllMyCreep = function() : List<Creep>
{
    return Utils.getAllCreep(CreepType.My, this);
};
RoomPosition.prototype.getAllWoundedCreep = function() : List<Creep>
{
    return Utils.getAllCreep(CreepType.Wounded, this);
};
RoomPosition.prototype.getAdjacentPosition = function(direction: number) : RoomPosition
{
    return Utils.getAdjacentPosition(this, direction);
};
RoomPosition.prototype.checkForRampart = function(): List<Rampart>
{
    return Utils.checkForRampart(this);
};