import { Guid } from "./Guid";

export class xInput
{
    public static randomInteger(min: number, max: number): number
    {
        let rand = min - 0.5 + Math.random() * (max - min + 1);
        rand = Math.round(rand);
        return rand;
    }
    public static SafeMove(creep, target): void
    {
        if(creep.moveTo(target, {visualizePathStyle: {
                fill: 'transparent',
                stroke: '#fff',
                lineStyle: 'dashed',
                strokeWidth: .15,
                opacity: .1
            }}) == ERR_INVALID_TARGET)
        {
            creep.say('ERROR');
            console.log(`found ${creep.energy} creep status at ERR_INVALID_TARGET`);
        }
    }
    public static SafeHarvest(creep): void
    {
        let energy = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1);
        if (energy.length)
        {
            console.log('found ' + energy[0].energy + ' energy at ', energy[0].pos);
            creep.pickup(energy[0]);
            creep.say("Собираю..");
            return;
        }


        let source = creep.pos.findClosestByPath(FIND_SOURCES);

        if(creep.memory.sourceIndex == undefined)
        {
            let sources = creep.room.find(FIND_SOURCES);
            let indexRandom = xInput.randomInteger(0, sources.length - 1);
            creep.memory.sourceIndex = indexRandom;
            source = sources[indexRandom];
        }
        else
            source = creep.room.find(FIND_SOURCES)[creep.memory.sourceIndex];



        let result = creep.harvest(source);
        if(result == ERR_NOT_IN_RANGE)
            this.SafeMove(creep, source);
        else if(result == OK)
            creep.say("Maining.");
        else if(result == ERR_INVALID_TARGET)
            creep.say("INVALID_TARGET");
    }
    public static Main(): void
    {
        let body = [MOVE, CARRY, WORK, CARRY, CARRY];

        if(Game.spawns['Spawn'].canCreateCreep(body) == OK)
            Game.spawns['Spawn'].createCreep(body, Guid.newGuid().ToString().split('-')[0],{role: "worker"});
        for (let name in Memory.creeps)
            if (Game.creeps[name] == undefined)
                delete Memory.creeps[name];

        for(let name in Game.creeps)
        {
            let creep = Game.creeps[name];


            if(creep.carry.energy == 0)
                creep.memory.isWork = true;
            else if(creep.carry.energy == creep.carryCapacity)
                creep.memory.isWork = false;


            if(!creep.memory.isWork)
            {
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE)
                    xInput.SafeMove(creep, creep.room.controller);
                else
                    creep.say("Updating..");
            }
            else
                xInput.SafeHarvest(creep);
        }
    }
    public static TowerUpdate()
    {
        let towers : Array<Tower> = [Game.getObjectById("58211384d5f995fb51705c3b"), Game.getObjectById("581eb8acdb96d10803401ac7")];
        for(let i in towers)
        {
            let tower = towers[i];
            let targets : Structure = tower.pos.findClosestByPath(FIND_STRUCTURES,
                {
                    filter: (x) =>
                    x.hits < x.hitsMax && x.structureType != STRUCTURE_RAMPART && x.structureType != STRUCTURE_WALL
                });
            let enemyCreeps : Array<Creep> = _.filter(Game.spawns['s1'].room.find(FIND_CREEPS), (creep) => !creep.my);

            if(enemyCreeps.length != 0)
            {
                tower.attack(enemyCreeps[0]);
                return;
            }
            if(targets != undefined || targets != null)
                tower.repair(targets);
            else
            {
                targets = tower.pos.findClosestByPath(FIND_STRUCTURES,
                    {
                        filter: (x) => x.structureType == STRUCTURE_RAMPART && x.hits <= (x.hitsMax / 100)
                    });
                if(targets != undefined || targets != null)
                    tower.repair(targets);
                else
                {
                    targets = tower.pos.findClosestByPath(FIND_STRUCTURES,
                        {
                            filter: (x) => x.structureType == STRUCTURE_WALL && x.hits <= (x.hitsMax / 6000)
                        });
                    if(targets != undefined || targets != null)
                        tower.repair(targets);
                    else
                    {
                        console.log("tower [" + tower + "] is not found work");
                    }
                }
            }
        }

    }
}