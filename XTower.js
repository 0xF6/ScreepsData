"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var XObject_1 = require("./XObject");
var LinqTS_1 = require("./LinqTS");
var MathUtil_1 = require("./MathUtil");
var XTower = (function (_super) {
    __extends(XTower, _super);
    function XTower(tower) {
        var _this = _super.call(this) || this;
        _this._tower = tower;
        return _this;
    }
    XTower.prototype.Work = function () {
        var targets = this._tower.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: function (x) {
                return x.hits < x.hitsMax && x.structureType != STRUCTURE_RAMPART && x.structureType != STRUCTURE_WALL;
            }
        });
        var enemyCreeps = _.filter(this._tower.room.find(FIND_CREEPS), function (creep) { return !creep.my; });
        var myCreeps = _.filter(this._tower.room.find(FIND_CREEPS), function (creep) { return creep.my && creep.hits != creep.hitsMax; });
        if (myCreeps.length != 0) {
            this._tower.heal(myCreeps[0]);
            return;
        }
        if (enemyCreeps.length != 0) {
            this._tower.attack(enemyCreeps[0]);
            return;
        }
        if (targets != undefined || targets != null)
            this._tower.repair(targets);
        else {
            var lstStructures = new LinqTS_1.List(_.filter(this._tower.room.find(FIND_STRUCTURES), function (x) { return x.structureType == STRUCTURE_RAMPART && x.hits <= (x.hitsMax / 100); }));
            if (lstStructures.Count() != 0)
                targets = lstStructures.ElementAtOrDefault(MathUtil_1.MathUtil.getRandom(0, lstStructures.Count() - 1));
            else
                targets = null;
            if (targets != undefined || targets != null)
                this._tower.repair(targets);
            else {
                var lstStructures_1 = new LinqTS_1.List(_.filter(this._tower.room.find(FIND_STRUCTURES), function (x) { return x.structureType == STRUCTURE_WALL && x.hits <= 100000; }));
                if (lstStructures_1.Count() != 0)
                    targets = lstStructures_1.ElementAtOrDefault(MathUtil_1.MathUtil.getRandom(0, lstStructures_1.Count() - 1));
                else
                    targets = null;
                if (targets != undefined || targets != null)
                    this._tower.repair(targets);
            }
        }
    };
    return XTower;
}(XObject_1.XObject));
exports.XTower = XTower;
