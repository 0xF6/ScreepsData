import { XCreep } from "./XCreep";
import { Guid } from "./Guid";
import { List } from "./LinqTS";


export enum ControllerLevel
{
    RCL1,
    RCL2,
    RCL3,
    RCL4,
    RCL5,
    RCL6,
    RCL7,
    RCL8
}
export class SpawnConfig
{
    public CtlLevel: ControllerLevel;
    public Body;
    public Role: string;
    public Prefix: string;
    public MinimalLen : int;


    constructor(lvl: ControllerLevel, bd, rol: string, pref: string, len: int)
    {
        this.MinimalLen = len;
        this.Body = bd;
        this.CtlLevel = lvl;
        this.Prefix = pref;
        this.Role = rol;
    }

    public static getConfigProvider(lvl : ControllerLevel) : SpawnConfig
    {
        switch(lvl)
        {
            case ControllerLevel.RCL1:
                return null; // Disable this role in 1 level
            case ControllerLevel.RCL2:
                return new SpawnConfig(lvl, [MOVE, CARRY, WORK], XCreep.PROVIDER, "p-", 2);
            case ControllerLevel.RCL3:
                return new SpawnConfig(lvl, [MOVE, CARRY, CARRY, WORK], XCreep.PROVIDER, "p-", 2);
            case ControllerLevel.RCL4:
                return new SpawnConfig(lvl, [MOVE, CARRY, WORK, CARRY, CARRY], XCreep.PROVIDER, "p-", 3);
            case ControllerLevel.RCL5:
                return new SpawnConfig(lvl, [MOVE, MOVE, MOVE, WORK, CARRY, CARRY, CARRY, CARRY], XCreep.PROVIDER, "p-", 3);
            case ControllerLevel.RCL6:
            case ControllerLevel.RCL7:
            case ControllerLevel.RCL8:
                return new SpawnConfig(lvl, [MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, WORK, HEAL], XCreep.PROVIDER, "p-", 3);
        }
    }
    public static getConfigSources(lvl : ControllerLevel) : SpawnConfig
    {
        switch(lvl)
        {
            case ControllerLevel.RCL1:
            case ControllerLevel.RCL2:
                return null; // Disable this role in 1 and 2 level
            case ControllerLevel.RCL3:
                return new SpawnConfig(lvl, [MOVE, CARRY, CARRY, WORK], XCreep.SOURCES, "@", JSON.parse(RawMemory.segments[0]).lenSources);
            case ControllerLevel.RCL4:
                return new SpawnConfig(lvl, [MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY], XCreep.SOURCES, "@", JSON.parse(RawMemory.segments[0]).lenSources);
            case ControllerLevel.RCL5:
                return new SpawnConfig(lvl, [MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY], XCreep.SOURCES, "@",JSON.parse(RawMemory.segments[0]).lenSources);
            case ControllerLevel.RCL6:
            case ControllerLevel.RCL7:
            case ControllerLevel.RCL8:
                return new SpawnConfig(lvl, [MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, HEAL, HEAL], XCreep.SOURCES, "@", JSON.parse(RawMemory.segments[0]).lenSources);
        }
    }
    public static getConfigFillers(lvl : ControllerLevel) : SpawnConfig
    {
        switch(lvl)
        {
            case ControllerLevel.RCL1:
            case ControllerLevel.RCL2:
            case ControllerLevel.RCL3:
                return null; // Disable this role in 1, 2 and 3 level
            case ControllerLevel.RCL4:
                return new SpawnConfig(lvl, [MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, WORK], XCreep.FILLER, "&", 3);
            case ControllerLevel.RCL5:
                return new SpawnConfig(lvl, [
                    MOVE, MOVE, MOVE, MOVE,
                    CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                    WORK
                ], XCreep.FILLER, "&",3);
            case ControllerLevel.RCL6:
            case ControllerLevel.RCL7:
            case ControllerLevel.RCL8:
                return new SpawnConfig(lvl, [MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, WORK, HEAL, HEAL], XCreep.FILLER, "&", 4);
        }
    }
    public static getConfigBuilders(lvl : ControllerLevel) : SpawnConfig
    {
        switch(lvl)
        {
            case ControllerLevel.RCL1:
                return new SpawnConfig(lvl, [MOVE, CARRY, WORK], XCreep.BUILDER, "b-", 2);
            case ControllerLevel.RCL2:
                return new SpawnConfig(lvl, [MOVE, CARRY, CARRY, WORK], XCreep.BUILDER, "b-", 2);
            case ControllerLevel.RCL3:
                return new SpawnConfig(lvl, [MOVE, MOVE, CARRY, CARRY, CARRY, WORK, WORK, WORK], XCreep.BUILDER, "b-", 2);
            case ControllerLevel.RCL4:
                return new SpawnConfig(lvl, [MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, WORK], XCreep.BUILDER, "b-", 3);
            case ControllerLevel.RCL5:
                return new SpawnConfig(lvl, [
                    MOVE, MOVE, MOVE, MOVE,
                    CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                    WORK, WORK, WORK, WORK, WORK, WORK
                ], XCreep.BUILDER, "b-",4);
            case ControllerLevel.RCL6:
            case ControllerLevel.RCL7:
            case ControllerLevel.RCL8:
                return new SpawnConfig(lvl, [MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, HEAL, HEAL], XCreep.BUILDER, "b-", 4);
        }
    }

    public static getConfigLancer(lvl : ControllerLevel) : SpawnConfig
    {
        switch(lvl)
        {
            case ControllerLevel.RCL1:
            case ControllerLevel.RCL2:
            case ControllerLevel.RCL3:
            case ControllerLevel.RCL4:
                return null;
            case ControllerLevel.RCL5:
                return new SpawnConfig(lvl, [
                    TOUGH, TOUGH, TOUGH, TOUGH,  TOUGH,
                    RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
                    MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                    HEAL, HEAL, HEAL
                ], XCreep.LANCER, "lancer",1);
            case ControllerLevel.RCL6:
            case ControllerLevel.RCL7:
            case ControllerLevel.RCL8:
                return new SpawnConfig(lvl, [
                    TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
                    RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
                    MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                    HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL
                ], XCreep.LANCER, "lancer",2);
        }
    }
}
export class SpawnManager
{
    public static UpdateRCL()
    {
        switch(Game.spawns["Spawn1"].room.controller.level)
        {
            case 1:
                Game.spawns["Spawn1"].memory.RCL = ControllerLevel.RCL1;
                break;
            case 2:
                Game.spawns["Spawn1"].memory.RCL = ControllerLevel.RCL2;
                break;
            case 3:
                Game.spawns["Spawn1"].memory.RCL = ControllerLevel.RCL3;
                break;
            case 4:
                Game.spawns["Spawn1"].memory.RCL = ControllerLevel.RCL4;
                break;
            case 5:
                Game.spawns["Spawn1"].memory.RCL = ControllerLevel.RCL5;
                break;
            case 6:
                Game.spawns["Spawn1"].memory.RCL = ControllerLevel.RCL6;
                break;
            case 7:
                Game.spawns["Spawn1"].memory.RCL = ControllerLevel.RCL7;
                break;
            case 8:
                Game.spawns["Spawn1"].memory.RCL = ControllerLevel.RCL8;
                break;
        }
    }


    public static getMemory(): Memory
    {
        return Game.spawns["Spawn1"].memory;
    }

    public static Update(): void
    {
        SpawnManager.UpdateRCL();


        let configLancer   = SpawnConfig.getConfigLancer(SpawnManager.getMemory().RCL);
        let configBuilder  = SpawnConfig.getConfigBuilders(SpawnManager.getMemory().RCL);
        let configFiller   = SpawnConfig.getConfigFillers(SpawnManager.getMemory().RCL);
        let configProvider = SpawnConfig.getConfigProvider(SpawnManager.getMemory().RCL);
        let configSources  = SpawnConfig.getConfigSources(SpawnManager.getMemory().RCL);


        let providers = _.sum(Game.creeps, (x) => x.memory.Role == XCreep.PROVIDER);
        let builders = _.sum(Game.creeps, (x) => x.memory.Role == XCreep.BUILDER);
        let updaters = _.sum(Game.creeps, (x) => x.memory.Role == XCreep.UPDATER);
        let filler = _.sum(Game.creeps, x => x.memory.Role == XCreep.FILLER);
        let sources = _.sum(Game.creeps, x => x.memory.Role == XCreep.SOURCES);
        let lancer = _.sum(Game.creeps, x => x.memory.Rile == XCreep.LANCER);

        if(configSources != null)
        if(sources < configSources.MinimalLen)
        {
            if(Game.spawns['Spawn1'].canCreateCreep(configSources.Body) == OK)
            {
                Game.spawns['Spawn1'].createCreep(configSources.Body, configSources.Prefix + Guid.newGuid()
                    .ToString()
                    .split('-')[0], { Role: configSources.Role });
                return;
            }
            return;
        }
        if(configFiller != null)
        if(filler < configFiller.MinimalLen)
        {
            if(Game.spawns['Spawn1'].canCreateCreep(configFiller.Body) == OK)
            {
                Game.spawns['Spawn1'].createCreep(configFiller.Body, configFiller.Prefix + Guid.newGuid()
                        .ToString()
                        .split('-')[0], { Role: configFiller.Role });
                return;
            }
            return;
        }
        if(configProvider != null)
        if(providers < configProvider.MinimalLen)
        {
            if(Game.spawns['Spawn1'].canCreateCreep(configProvider.Body) == OK)
            {
                Game.spawns['Spawn1'].createCreep(configProvider.Body, configProvider.Prefix + Guid.newGuid()
                    .ToString()
                    .split('-')[0], { Role: configProvider.Role });
                return;
            }
            return;
        }
        if(configBuilder != null)
        if(builders < configBuilder.MinimalLen)
        {
            if(Game.spawns['Spawn1'].canCreateCreep(configBuilder.Body) == OK)
            {
                Game.spawns['Spawn1'].createCreep(configBuilder.Body,`${configBuilder.Prefix}${Guid.newGuid().ToString().split('-')[0]}`,{Role: configBuilder.Role });
                return;
            }
            return;
        }
        if(updaters < 4)
        {
            if(Game.spawns['Spawn1'].canCreateCreep([MOVE,MOVE,MOVE,WORK,WORK,WORK,CARRY,CARRY,CARRY]) == OK)
            {
                Game.spawns['Spawn1'].createCreep([MOVE,MOVE,MOVE,WORK,WORK,WORK,CARRY,CARRY,CARRY], `u-${Guid.newGuid().ToString().split('-')[0]}`,{Role: XCreep.UPDATER});
                return;
            }
            return;
        }
        if(configLancer != null && lancer < configLancer.MinimalLen)
        {
            if(Game.spawns['Spawn1'].canCreateCreep(configLancer.Body) == OK)
            {
                Game.spawns['Spawn1'].createCreep(configLancer.Body,`${configLancer.Prefix}`,{ Role: configLancer.Role });
                return;
            }
            return;
        }
    }
}