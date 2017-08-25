"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SpawnManger_1 = require("./SpawnManger");
var XCreep_1 = require("./XCreep");
var XTower_1 = require("./XTower");
var xInput = (function () {
    function xInput() {
    }
    xInput.Main = function () {
        for (var name_1 in Memory.creeps)
            if (Game.creeps[name_1] == undefined)
                delete Memory.creeps[name_1];
        SpawnManger_1.SpawnManager.Update();
        for (var name_2 in Game.creeps) {
            var creep = Game.creeps[name_2];
            var xcreep = new XCreep_1.XCreep(creep);
            xcreep.Work();
        }
        for (var x in Game.structures) {
            var str = Game.structures[x];
            if (str.structureType != "tower")
                continue;
            var tow = new XTower_1.XTower(str);
            tow.Work();
        }
    };
    return xInput;
}());
exports.xInput = xInput;
