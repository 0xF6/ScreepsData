/**
 * @constant
 * @type {string}
 */
const BUILDER = 1;
/**
 * @constant
 * @type {string}
 */
const REPAIRER = 0;
/**
 * @constant
 * @type {string}
 */
const UPGRADER = 6;
/**
 * @constant
 * @type {string}
 */
const PROVIDER = 2;
/**
 * @constant
 * @type {string}
 */
const PROVIDER_FILLER = 4;
/*
* spawnManager.costs = {};
 spawnManager.costs[Game.MOVE] = 50;
 spawnManager.costs[Game.WORK] = 100;
 spawnManager.costs[Game.CARRY] = 50;
 spawnManager.costs[Game.ATTACK] = 100;
 spawnManager.costs[Game.RANGED_ATTACK] = 150;
 spawnManager.costs[Game.HEAL] = 200;
 spawnManager.costs[Game.TOUGH] = 10;
 // 
 // generate a name for a spawn
 spawnManager.generateName = function (name)
 {
 var result = false;
 var x = 1;
 while (!result)
 {
 var found = false;
 var nameTry = name + '-' + x;
 for (var i in Game.creeps)
 if (Game.creeps[i].name == nameTry)
 found = true;
 if (!found)
 return nameTry;
 x++;
 }
 };
 spawnManager.manageSpawningInit = function ()
 {
 spawnManager.needs = [4];
 spawnManager.needs['builder'] = {'role': 'builder', isWork: false};
 spawnManager.needs['repairer'] = {'job': 'repairer', isWork: false};
 spawnManager.needs['updater'] = {'job': 'updater', isWork: false};
 spawnManager.needs['provider'] = {'job': 'provider', isWork: false};
 };
* */

var spawn =
{
    CreateCustomCreeep : function (roleName, isIgnoreEnergy)
    {

        var energy = Game.spawns['s1'].room.energyCapacityAvailable;

        if(isIgnoreEnergy)
            energy = Game.spawns['s1'].room.energyAvailable;
        var numberOfParts = Math.floor(energy / 200);
        var body = [];
        for (let i = 0; i < numberOfParts; i++) body.push(WORK);
        for (let i = 0; i < numberOfParts; i++) body.push(CARRY);
        for (let i = 0; i < numberOfParts; i++) body.push(MOVE);

        var result = Game.spawns['s1'].canCreateCreep(body);

        if(result == 0)
        return Game.spawns['s1'].createCreep(body, roleName[0] + 'X-' + Game.spawns['s1'].memory.index[roleName]++, {role: roleName, isWork: false});
    },

    ManageSpawn : function()
    {
        var cBuilder = _.sum(Game.creeps, (x)=> x.memory.role == 'builder' && x.memory.RoomWork == "W32N55");
        var cRepairer = _.sum(Game.creeps, (x)=> x.memory.role == 'repairer' && x.memory.RoomWork == "W32N55");
        var cUpgrader = _.sum(Game.creeps, (x)=> x.memory.role == 'updater' && x.memory.RoomWork == "W32N55");
        var cProvider = _.sum(Game.creeps, (x)=> x.memory.role == 'provider' && !x.memory.isFiller && x.memory.RoomWork == "W32N55");
        var cProviderFiller = _.sum(Game.creeps, (x)=> x.memory.role == 'provider' && x.memory.isFiller && x.memory.RoomWork == "W32N55");

        var cLinker_out = _.sum(Game.creeps, (x)=> x.memory.role == 'linker_out' && x.memory.RoomWork == "W32N55");
        var cLinker_int = _.sum(Game.creeps, (x)=> x.memory.role == 'linker_in' && x.memory.RoomWork == "W32N55");

        var cProviderTower = _.sum(Game.creeps, (x)=> x.memory.role == 'provider_tower' && x.memory.RoomWork == "W32N55");

        var cClaimer = _.sum(Game.creeps, (x)=> x.memory.role == 'claimer');



        var cUpgrader56 = _.sum(Game.creeps, (x)=> x.memory.role == 'updater' && x.memory.RoomWork == "W32N54");
        var cBuilder54 = _.sum(Game.creeps, (x)=> x.memory.role == 'builder' && x.memory.RoomWork == "W32N54");

        var cProvider56 = _.sum(Game.creeps, (x)=> x.memory.role == 'provider' && x.memory.RoomWork == "W32N56" && x.memory.isFiller);

        var cRepairer54 = _.sum(Game.creeps, (x)=> x.memory.role == 'repairer' && x.memory.RoomWork == "W32N54");

        var body = [
            //TOUGH, TOUGH,   // 20
            //TOUGH, TOUGH,   // 20
            //TOUGH,          // 10
            MOVE,           // 50
            CARRY, CARRY,   // 100
            //WORK ,WORK,//WORK,// 300
            WORK ,WORK];    // 200
            // 700
        var linkerInBody = [MOVE, CARRY, WORK, WORK, WORK, WORK];
        var linkerOutBody = [MOVE, CARRY, CARRY, CARRY, CARRY];
        var ClaimerBody = [MOVE, CLAIM, MOVE, CLAIM];
        //if(cClaimer < 1)
        //    if(Game.spawns['s1'].canCreateCreep(ClaimerBody) == OK)
        //        Game.spawns['s1'].createCreep(ClaimerBody, 'CL-01', {role: 'claimer', isWork: false});
        if(cLinker_int < 1)
            if(Game.spawns['s1'].canCreateCreep(linkerInBody) == OK)
                Game.spawns['s1'].createCreep(linkerInBody, 'LINKER-IN', {role: 'linker_in', isWork: false});
        if(cLinker_out < 1)
            if(Game.spawns['s1'].canCreateCreep(linkerOutBody) == OK)
                Game.spawns['s1'].createCreep(linkerOutBody, 'LINKER-OUT', {role: 'linker_out', isWork: false});


        if(cRepairer54 < 1)
            if(Game.spawns['s2'].canCreateCreep([CARRY, WORK, MOVE]) == OK)
                Game.spawns['s2'].createCreep([CARRY, WORK, MOVE], 'RX-' + Game.spawns['s1'].memory.index.repairer++, {role: 'repairer', isWork: false, RoomWork: "W32N54"});
            
        if(cProvider == 0) Game.spawns['s1'].createCreep([MOVE, CARRY, WORK], 'px-' + Game.spawns['s1'].memory.index.provider++, {role: 'provider', isWork: false});


        if(cProviderTower < 3) if(Game.spawns['s1'].canCreateCreep(body) == OK)
        Game.spawns['s1'].createCreep(body, 'PT' + Game.spawns['s1'].memory.index.provider++, {role: 'provider_tower', isWork: false, isFiller: false});

        if(cProvider < PROVIDER)
            if(Game.spawns['s1'].canCreateCreep(body) == OK)
                Game.spawns['s1'].createCreep(body, 'PX-' + Game.spawns['s1'].memory.index.provider++, {role: 'provider', isWork: false, isFiller: false});
        if(cProviderFiller < PROVIDER_FILLER)
            if(Game.spawns['s1'].canCreateCreep(body) == OK)
                Game.spawns['s1'].createCreep(body, 'PF-' + Game.spawns['s1'].memory.index.provider++, {role: 'provider', isWork: false, isFiller: true});
        if(cBuilder < BUILDER)
            if(Game.spawns['s1'].canCreateCreep(body) == OK)
                Game.spawns['s1'].createCreep(body, 'BX-' + Game.spawns['s1'].memory.index.builder++, {role: 'builder', isWork: false});
        if(cRepairer < REPAIRER)
            if(Game.spawns['s1'].canCreateCreep(body) == OK)
                Game.spawns['s1'].createCreep(body, 'RX-' + Game.spawns['s1'].memory.index.repairer++, {role: 'repairer', isWork: false});
        if(cUpgrader < UPGRADER)
            if(Game.spawns['s1'].canCreateCreep(body) == OK)
                Game.spawns['s1'].createCreep(body, 'UX-' + Game.spawns['s1'].memory.index.updater++, {role: 'updater', isWork: false});

        if(cUpgrader56 < 6)
            if(Game.spawns['s1'].canCreateCreep(body) == OK)
                Game.spawns['s1'].createCreep(body, 'U54-' + Game.spawns['s1'].memory.index.updater++, {role: 'updater', isWork: false, RoomWork: "W32N54"});
        if(cBuilder54 < 2)
            if(Game.spawns['s1'].canCreateCreep(body) == OK)
                Game.spawns['s1'].createCreep(body, 'B54-' + Game.spawns['s1'].memory.index.builder++, {role: 'builder', isWork: false, RoomWork: "W32N54"});

        if(cProvider56 < 2)
            if(Game.spawns['s1'].canCreateCreep(body) == OK)
                Game.spawns['s1'].createCreep(body, 'F56-' + Game.spawns['s1'].memory.index.provider++, {role: 'provider', isWork: false, isFiller: true, RoomWork: "W32N56"});
        /*for(var r in this.getRoles())
        if(_.sum(Game.creeps, (x)=> x.memory.role == r) == 0)
        this.CreateCustomCreeep(r, true);
        for(var r in this.getRoles())
        for(var c in this.getRolesCount())
        if(_.sum(Game.creeps, (x)=> x.memory.role == r) == c[r])
        this.CreateCustomCreeep(r, false);*/
    }
};

module.exports = spawn;