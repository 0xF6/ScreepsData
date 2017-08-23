import { XObject } from "./XObject";
import { MathUtil } from "./MathUtil";


export class XCreep extends XObject
{
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
            case "updater":
                this.UpgradeController();
                break;
            case "provider":
                this.Provide();
                break;
            case "builder":
                this.Build();
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
    public Move(target: Structure | Source | ConstructionSite): void
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
                let result = this.Creep.build(target);
                if(result == ERR_NOT_IN_RANGE)
                    this.Move(target);
                else if(result == OK) {}
                else console.error(`found ${this} creep status at ${result}`);
            }
            else this.Harvest();

        }
        else this.UpgradeController();
    }
    public UpgradeController(): void
    {
        let target = this.Creep.room.controller;
        let result = this.Creep.upgradeController(target);
        if(result == ERR_NOT_IN_RANGE)
            this.Move(target);
        else
            console.error(`found ${this} creep status at ${result}`);
    }
    public Harvest(): void
    {
        let energy: Array<Resource> = this.Creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1);
        if (energy.length)
        {
            console.log(`found ${energy[0].amount} energy at ${energy[0].pos}`);
            this.Creep.pickup(energy[0]);
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



        let result = this.Creep.harvest(source);
        if(result == ERR_NOT_IN_RANGE)
            this.Move(source);
        else if(result == OK) { }
        else
            console.error(`found ${this} creep status at ${result}`);
    }


    public getVisualStyle(): object
    {
        return {
            fill: 'transparent',
            stroke: '#fff',
            lineStyle: 'dashed',
            strokeWidth: .15,
            opacity: .1
        };
    }
}