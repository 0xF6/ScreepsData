import { XObject } from "./XObject";


export class XTower extends XObject
{
    private _tower : Tower;
    constructor(tower : Tower)
    {
        super();
        this._tower = tower;
    }
    public Work() : void
    {
        let targets : Structure = this._tower.pos.findClosestByPath(FIND_STRUCTURES,
        {
            filter: (x) =>
            x.hits < x.hitsMax && x.structureType != STRUCTURE_RAMPART && x.structureType != STRUCTURE_WALL
        });
        let enemyCreeps : Array<Creep> = _.filter(this._tower.room.find(FIND_CREEPS), (creep : Creep) => !creep.my);

        let myCreeps : Array<Creep> = _.filter(this._tower.room.find(FIND_CREEPS), (creep : Creep) => creep.my && creep.hits != creep.hitsMax);

        if(myCreeps.length != 0)
        {
            this._tower.heal(myCreeps[0]);
            return;
        }

        if(enemyCreeps.length != 0)
        {
            this._tower.attack(enemyCreeps[0]);
            return;
        }
        if(targets != undefined || targets != null)
            this._tower.repair(targets);
        else
        {
            targets = this._tower.pos.findClosestByPath(FIND_STRUCTURES,
                {
                    filter: (x) => x.structureType == STRUCTURE_RAMPART && x.hits <= (x.hitsMax / 100)
                });
            if(targets != undefined || targets != null)
                this._tower.repair(targets);
            else
            {
                targets = this._tower.pos.findClosestByPath(FIND_STRUCTURES,
                    {
                        filter: (x) => x.structureType == STRUCTURE_WALL && x.hits <= (x.hitsMax / 2000)
                    });
                if(targets != undefined || targets != null)
                    this._tower.repair(targets);
            }
        }
    }
}