import { XObject } from "./XObject";
import { MathUtil } from "./MathUtil";
import { STATUS_CODE } from "./StatusCode";
import { List } from "./LinqTS";
import { XGame } from "./XGame";


export class XCreep extends XObject
{
    public static UPDATER = "updater";
    public static PROVIDER = "provider";
    public static BUILDER = "builder";
    public static SOURCES = "sources";
    public static FILLER = "filler";

    public static LANCER = "lancer";
    public static RAIDER = "raider";

    public Creep: Creep;

    constructor(creep: Creep)
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
        else if(result == OK)
        {
        }
        else this.UpgradeController();
    }


    public getRandomSay(): string
    {
        let lst: List<string> = new List();

        lst.Add("Ni!");
        lst.Add("Kiya!");
        lst.Add("Ko!");
        lst.Add("Ni!");

        return lst.ElementAt(MathUtil.getRandom(0, lst.Count() - 1));
    }


    public RangeAttack()
    {
        let enemyCreeps : Array<Creep> = _.filter(this.Creep.room.find(FIND_CREEPS), (x : Creep) => !x.my);
        if(enemyCreeps.length != 0)
        {
            this.Creep.say(this.getRandomSay(), true);
            this.Creep.heal(this.Creep);
            if(this.Creep.rangedAttack(enemyCreeps[0]) == ERR_NOT_IN_RANGE)
                this.Move(enemyCreeps[0]);
            return;
        }
        this.Move(Game.flags["1"]);
        this.Creep.heal(this.Creep);
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

        let result = this.Creep.withdraw(target, RESOURCE_ENERGY);
        if(result == ERR_NOT_IN_RANGE)
            this.Move(target);
        else if(result == ERR_NOT_ENOUGH_RESOURCES)
            this.Harvest();
    }

    public Work(): void
    {
        if(RawMemory.segments[0].indexOf("lenSources") == -1)
        RawMemory.segments[0] = JSON.stringify({lenSources: new List<Source>(this.Creep.room.find(FIND_SOURCES)).Count()});
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
            case XCreep.SOURCES:
                this.SourcesWork();
                break;
            case XCreep.FILLER:
                this.FillerStorageWork();
                break;
            case XCreep.LANCER:
                this.RangeAttack();
                break;
            default:
                this.UpgradeController();
                break;
        }
    }
    public SourcesWork()
    {
        let source: Source = this.Creep.pos.findClosestByPath(FIND_SOURCES);

        if(this.Creep.memory.source == undefined)
        {
            if(this.Creep.memory.isLive === undefined)
                this.Creep.memory.isLive = true;

            let creeps : List<Creep> = new List();

            for(let xcrp in Game.creeps)
                creeps.Add(Game.creeps[xcrp]);

            let csx = creeps.FirstOrDefault(x => x.memory.isLive !== undefined && x.memory.Role == XCreep.SOURCES && x.memory.source !== undefined);
            let sources: List<Source> = new List<Source>(this.Creep.room.find(FIND_SOURCES));
            if(csx == undefined)
                this.Creep.memory.source = sources.First().id;
            else
            {
                while(true)
                {
                    csx = creeps.FirstOrDefault(x =>
                    x.memory.isLive !== undefined &&
                    x.memory.Role === XCreep.SOURCES &&
                    x.memory.source !== undefined);

                    if(csx == undefined)
                    {
                        console.log("Error: Лишний крип роли (Sources)");
                        return;
                    }
                    this.Creep.memory.source = sources.FirstOrDefault(x => x.id != csx.memory.source).id;
                }
            }
            source = <Source>Game.getObjectById(this.Creep.memory.source);
        }
        else
            source = <Source>Game.getObjectById(this.Creep.memory.source);


        let result: STATUS_CODE = this.Creep.harvest(source);
        if(result == ERR_NOT_IN_RANGE)
            this.Move(source);
        else if(result == OK)
        {
            if(this.Creep.carry.energy == this.Creep.carryCapacity)
            {
                this.Creep.drop(RESOURCE_ENERGY);
            }
        }
        else if(result == ERR_BUSY) { this.Creep.say("Not Aviable"); }
        else
            console.log(`[Harv] found ${this} creep status at ${STATUS_CODE[result]}`);
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
            return;
        }

        let target2 = this.Creep.pos.findClosestByPath(FIND_MY_STRUCTURES,
            {
                filter: (x) =>
                x.structureType == STRUCTURE_TOWER && x.energy != 1000
            });
        if(target2 != null)
        {
            if(!this.Creep.memory.isWork)
                this.Transfer(target2);
            else
                this.Fill();
        }
        else
            this.UpgradeController();
    }
    public Move(target: Structure | Source | ConstructionSite | Resource | Creep | Flag): void
    {
        if(this.Creep.moveTo(target, {visualizePathStyle: this.getVisualStyle() }) == ERR_INVALID_TARGET)
        {
            this.Creep.say('=ERROR=');
            console.log(`found ${this} creep status at ERR_INVALID_TARGET`);
        }
    }
    public AutoRepair() : bool
    {
        let breakedStrcuture : Structure = this.Creep.pos.findClosestByPath(FIND_STRUCTURES,
            {
                filter: (x) => x.hits < x.hitsMax && x.structureType != STRUCTURE_WALL && x.structureType != STRUCTURE_RAMPART
            });

        if(breakedStrcuture != undefined)
        {
            if(!this.Creep.memory.isWork)
            {
                let result = this.Creep.repair(breakedStrcuture);
                if(result == ERR_NOT_IN_RANGE)
                    this.Move(breakedStrcuture);
                else if(result == OK) {}
                else console.log(`[repair] found ${this} creep status at ${STATUS_CODE[result]}`);
                return true;
            }
            else
            {
                this.Harvest();
                return true;
            }
        }
        return false;
    }
    public Build()
    {
        if(this.AutoRepair()) return;

        let target : ConstructionSite = this.Creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);


        if(target != undefined)
        {
            if(!this.Creep.memory.isWork)
            {
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
    public FillerStorageWork()
    {
        if(this.isWork())
        {
            let energy: Array<Resource> = this.Creep.pos.findInRange(FIND_DROPPED_RESOURCES, 5);
            if (energy.length)
            {
                let res = this.Creep.pickup(energy[0]);
                if(res == ERR_NOT_IN_RANGE)
                {
                    this.Move(energy[0]);
                    res = OK;
                }
            }
            let container = new List<Container>(this.Creep.pos.findInRange(FIND_STRUCTURES, 100, {filter:{ structureType: STRUCTURE_CONTAINER }}));

            if(container.Count() != 0)
            {
                let xContainer = container.OrderBy(x => x.store.energy).FirstOrDefault(
                    x => x.store != undefined &&
                    x.store.energy != undefined && x.store.energy >= this.Creep.carryCapacity);
                if(xContainer == undefined || xContainer.store == undefined || xContainer.store.energy == undefined )
                {
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
                    else if(result == OK){ }
                    else if(result == ERR_BUSY) { this.Creep.say("Not Aviable"); }
                    else
                        console.log(`[Harv] found ${this} creep status at ${STATUS_CODE[result]}`);
                    return;
                }
                else
                {
                    let res = this.Creep.withdraw(xContainer, RESOURCE_ENERGY);
                    if(res == ERR_NOT_IN_RANGE)
                    {
                        this.Move(xContainer);
                        return;
                    }
                    else if(res == OK)
                        return;
                }
            }
        }
        else
        {
            let storage = new List<Container>(this.Creep.pos.findInRange(FIND_STRUCTURES, 150, {filter:{ structureType: STRUCTURE_STORAGE }})).FirstOrDefault();
            if(storage == undefined)
            {
                this.Creep.say("ERROR");
                Game.notify("ERROR: STORAGE NOT FOUND!");
                return;
            }
            this.Transfer(storage);
        }
    }

    public isWork() : boolean
    {
        return this.Creep.memory.isWork;
    }
    public MoveToRoom(roomPos: RoomPosition): void
    {

    }

    public Harvest(): void
    {


        let storage = new List<StructureStorage>(this.Creep.pos.findInRange(FIND_STRUCTURES, 500, {filter:{ structureType: STRUCTURE_STORAGE }})).FirstOrDefault();


        if(storage != undefined && storage.store != undefined && storage.store.energy != undefined && storage.store.energy > 5000)
        {
            let a = this.Creep.withdraw(storage, RESOURCE_ENERGY);
            if(a == ERR_NOT_IN_RANGE)
            {
                this.Move(storage);
                return;
            }
        }

        let energy: Array<Resource> = this.Creep.pos.findInRange(FIND_DROPPED_RESOURCES, 5);
        if (energy.length)
        {
            let res = this.Creep.pickup(energy[0]);
            if(res == ERR_NOT_IN_RANGE)
            {
                this.Move(energy[0]);
                res = OK;
            }
            return;
        }
        else
        {
            let container = new List<Container>(this.Creep.pos.findInRange(FIND_STRUCTURES, 5, {filter:{ structureType: STRUCTURE_CONTAINER }}));

            if(container.Count() != 0)
            {
                let xContainer = container.FirstOrDefault(
                    x => x.store != undefined &&
                    x.store.energy != undefined &&
                    x.store.energy != 0);
                if(xContainer == undefined || xContainer.store == undefined || xContainer.store.energy == undefined || xContainer.store.energy < this.Creep.carryCapacity)
                {
                    this.RandomMove();
                    return;
                }
                else
                {
                    let res = this.Creep.withdraw(xContainer, RESOURCE_ENERGY);
                    if(res == ERR_NOT_IN_RANGE)
                    {
                        this.Move(xContainer);
                        return;
                    }
                    else if(res == OK)
                        return;
                }
            }
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
        else if(result == OK)
        {
            //if(this.getRole == XCreep.BUILDER)
            //{
            //    let target : ConstructionSite = this.Creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            //    const res = this.Creep.build(target);
            //}
        }
        else if(result == ERR_BUSY) { this.Creep.say("Not Aviable"); }
        else
            console.log(`[Harv] found ${this} creep status at ${STATUS_CODE[result]}`);
    }
    public RandomMove()
    {
        this.Creep.move(MathUtil.getRandom(1, 8));
    }

    public toString(): string
    {
        return `(${this.getRole})[${this.getID().ToString().split('-')[0]}]`;
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