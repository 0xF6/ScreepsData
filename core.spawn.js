/**
 * @constant
 * @type {string}
 */
const BUILDER = 1;
/**
 * @constant
 * @type {string}
 */
const REPAIRER = 1;
/**
 * @constant
 * @type {string}
 */
const UPGRADER = 1;
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
        var cBuilder = _.sum(Game.creeps, (x)=> x.memory.role == 'builder');
        var cRepairer = _.sum(Game.creeps, (x)=> x.memory.role == 'repairer');
        var cUpgrader = _.sum(Game.creeps, (x)=> x.memory.role == 'updater');
        var cProvider = _.sum(Game.creeps, (x)=> x.memory.role == 'provider' && x.memory.isFiller == false);
        var cProviderFiller = _.sum(Game.creeps, (x)=> x.memory.role == 'provider' && x.memory.isFiller == true);
        
        
        var body = [
            //TOUGH, TOUGH,   // 20
            //TOUGH, TOUGH,   // 20
            //TOUGH,          // 10
            MOVE,           // 50
            CARRY, CARRY,   // 100
            //WORK ,WORK,//WORK,// 300
            WORK ,WORK];    // 200
            // 700
            
            
        if(cProvider == 0)
        {
            Game.spawns['s1'].createCreep([TOUGH, TOUGH, MOVE, CARRY, WORK], 'px-' + Game.spawns['s1'].memory.index.provider++, {role: 'provider', isWork: false});
        }
        if(cRepairer == 0)
        {
             Game.spawns['s1'].createCreep([TOUGH, TOUGH, MOVE, CARRY, WORK], 'rx-' + Game.spawns['s1'].memory.index.repairer++, {role: 'repairer', isWork: false});
        }
        
        if(cProvider < PROVIDER)
            if(Game.spawns['s1'].canCreateCreep(body) == OK)
                Game.spawns['s1'].createCreep(body, 'PX-' + Game.spawns['s1'].memory.index.provider++, {role: 'provider', isWork: false});
        if(cProviderFiller < PROVIDER_FILLER)
            if(Game.spawns['s1'].canCreateCreep(body) == OK)
                Game.spawns['s1'].createCreep(body, 'PF-' + Game.spawns['s1'].memory.index.provider++, {role: 'provider', isWork: false});
        if(cBuilder < BUILDER)
            if(Game.spawns['s1'].canCreateCreep(body) == OK)
                Game.spawns['s1'].createCreep(body, 'BX-' + Game.spawns['s1'].memory.index.builder++, {role: 'builder', isWork: false});
        if(cRepairer < REPAIRER)
            if(Game.spawns['s1'].canCreateCreep(body) == OK)
                Game.spawns['s1'].createCreep(body, 'RX-' + Game.spawns['s1'].memory.index.repairer++, {role: 'repairer', isWork: false});
        if(cUpgrader < UPGRADER)
            if(Game.spawns['s1'].canCreateCreep(body) == OK)
                Game.spawns['s1'].createCreep(body, 'UX-' + Game.spawns['s1'].memory.index.updater++, {role: 'updater', isWork: false});
       


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