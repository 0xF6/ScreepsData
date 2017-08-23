import { XObject } from "./XObject";
import { MathUtil } from "./MathUtil";
import { STATUS_CODE } from "./StatusCode";


export class XCreep extends XObject
{
    public static UPDATER = "updater";
    public static PROVIDER = "provider";
    public static BUILDER = "builder";

    public Creep : Creep;

    constructor(creep : Creep)
    {
        super();
        this.Creep = creep;
    }
    public get getRole()
    {
        return this.Creep.memory.Role;
    }
    public Transfer(target): void
    {
        let result = this.Creep.transfer(target, RESOURCE_ENERGY);
        if(result == ERR_NOT_IN_RANGE)
            this.Move(target);
        else if(result == OK) {}
        else this.UpgradeController();
    }

    public Fill(): void
    {
        let target : Storage = this.Creep.pos.findClosestByPath(FIND_MY_STRUCTURES,
            {
                filter: (x) =>
                x.structureType == STRUCTURE_STORAGE &&
                x.energy != x.storeCapacity
            });
        if(target == undefined)
        {
            this.Harvest();
            return;
        }

        let result = target.transfer(this.Creep, RESOURCE_ENERGY);
        if(result == ERR_NOT_IN_RANGE)
            this.Move(target);
        else if(result == ERR_NOT_ENOUGH_RESOURCES)
            this.Harvest();
    }

    public Work(): void
    {
        if(this.Creep.carry.energy == 0)
            this.Creep.memory.isWork = true;
        else if(this.Creep.carry.energy == this.Creep.carryCapacity)
            this.Creep.memory.isWork = false;

        switch(this.getRole)
        {
            case XCreep.UPDATER:
                this.UpgradeController();
                break;
            case XCreep.PROVIDER:
                this.Provide();
                break;
            case XCreep.BUILDER:
                this.Build();
                break;
            default:
                this.UpgradeController();
                break;
        }
    }
    public Provide(): void
    {
        let target = this.Creep.pos.findClosestByPath(FIND_MY_STRUCTURES,
            {
                filter: (x) =>
                x.structureType == STRUCTURE_EXTENSION && x.energy != 50 ||
                x.structureType == STRUCTURE_SPAWN && x.energy != 300
            });
        if(target != null)
        {
            if(!this.Creep.memory.isWork)
                this.Transfer(target);
            else
                this.Fill();
        }
        else
        {
            let targetStorage = this.Creep.pos.findClosestByPath(FIND_MY_STRUCTURES,
                {
                    filter: (x) =>
                    x.structureType == STRUCTURE_STORAGE &&
                    x.energy != x.storeCapacity
                });
            if(!this.Creep.memory.isWork)
                this.Transfer(targetStorage);
            else
                this.Harvest();
        }
    }
    public Move(target: Structure | Source | ConstructionSite | Resource): void
    {
        if(this.Creep.moveTo(target, {visualizePathStyle: this.getVisualStyle() }) == ERR_INVALID_TARGET)
        {
            this.Creep.say('=ERROR=');
            console.log(`found ${this} creep status at ERR_INVALID_TARGET`);
        }
    }
    public Build()
    {
        let target : ConstructionSite = this.Creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);


        if(target != undefined)
        {
            if(!this.Creep.memory.isWork)
            {
                let breakedStrcuture = this.Creep.pos.findClosestByPath(FIND_STRUCTURES,
                {
                    filter: (x) => x.hits < x.hitsMax && x.structureType != STRUCTURE_WALL
                });

                if(breakedStrcuture)
                {
                    let result = this.Creep.repair(breakedStrcuture[0]);
                    if(result == ERR_NOT_IN_RANGE)
                        this.Move(target);
                    else if(result == OK) {}
                    else console.log(`[repair] found ${this} creep status at ${STATUS_CODE[result]}`);
                    return;
                }

                let result = this.Creep.build(target);
                if(result == ERR_NOT_IN_RANGE)
                    this.Move(target);
                else if(result == OK) {}
                else console.log(`[Build] found ${this} creep status at ${STATUS_CODE[result]}`);
            }
            else this.Harvest();

        }
        else this.UpgradeController();
    }
    public UpgradeController(): void
    {
        let target = this.Creep.room.controller;
        let result = this.Creep.upgradeController(target);

        if(this.Creep.memory.isWork)
        {
            this.Harvest();
            return;
        }

        if(result == ERR_NOT_IN_RANGE)
            this.Move(target);
        else if(result == OK) { }
        else
            console.log(`[Upd] found ${this} creep status at ${STATUS_CODE[result]}`);
    }
    public Harvest(): void
    {
        let energy: Array<Resource> = this.Creep.pos.findInRange(FIND_DROPPED_RESOURCES, 5);
        if (energy.length)
        {
            let res = this.Creep.pickup(energy[0]);
            if(res == ERR_NOT_IN_RANGE)
                res = this.Move(energy[0]);
            console.log(`[${STATUS_CODE[res]}] found ${energy[0].amount} energy at ${energy[0].pos}`);
            return;
        }


        let source: Source = this.Creep.pos.findClosestByPath(FIND_SOURCES);

        if(this.Creep.memory.sourceIndex == undefined)
        {
            let sources: Array<Source> = this.Creep.room.find(FIND_SOURCES);
            let indexRandom = MathUtil.getRandom(0, sources.length - 1);
            this.Creep.memory.sourceIndex = indexRandom;
            source = sources[indexRandom];
        }
        else
            source = <Source>this.Creep.room.find(FIND_SOURCES)[this.Creep.memory.sourceIndex];



        let result: STATUS_CODE = this.Creep.harvest(source);
        if(result == ERR_NOT_IN_RANGE)
            this.Move(source);
        else if(result == OK) { }
        else
            console.log(`[Harv] found ${this} creep status at ${STATUS_CODE[result]}`);
    }
    public toString(): string
    {
        return `(${this.getRole})[${this.getID().ToString()}]`;
    }

    public getVisualStyle(): object
    {
        return {
            fill: 'transparent',
            stroke: '#ecebff',
            lineStyle: 'dashed',
            strokeWidth: .15,
            opacity: .4
        };
    }
}