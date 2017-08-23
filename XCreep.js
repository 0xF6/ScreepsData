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
var MathUtil_1 = require("./MathUtil");
var XCreep = (function (_super) {
    __extends(XCreep, _super);
    function XCreep(creep) {
        var _this = _super.call(this) || this;
        _this.Creep = creep;
        return _this;
    }
    Object.defineProperty(XCreep.prototype, "getRole", {
        get: function () {
            return this.Creep.memory.Role;
        },
        enumerable: true,
        configurable: true
    });
    XCreep.prototype.Transfer = function (target) {
        var result = this.Creep.transfer(target, RESOURCE_ENERGY);
        if (result == ERR_NOT_IN_RANGE)
            this.Move(target);
        else if (result == OK) { }
        else
            this.UpgradeController();
    };
    XCreep.prototype.Fill = function () {
        var target = this.Creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: function (x) {
                return x.structureType == STRUCTURE_STORAGE &&
                    x.energy != x.storeCapacity;
            }
        });
        if (target == undefined) {
            this.Harvest();
            return;
        }
        var result = target.transfer(this.Creep, RESOURCE_ENERGY);
        if (result == ERR_NOT_IN_RANGE)
            this.Move(target);
        else if (result == ERR_NOT_ENOUGH_RESOURCES)
            this.Harvest();
    };
    XCreep.prototype.Work = function () {
        if (this.Creep.carry.energy == 0)
            this.Creep.memory.isWork = true;
        else if (this.Creep.carry.energy == this.Creep.carryCapacity)
            this.Creep.memory.isWork = false;
        switch (this.getRole) {
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
    };
    XCreep.prototype.Provide = function () {
        var target = this.Creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: function (x) {
                return x.structureType == STRUCTURE_EXTENSION && x.energy != 50 ||
                    x.structureType == STRUCTURE_SPAWN && x.energy != 300;
            }
        });
        if (target != null) {
            if (!this.Creep.memory.isWork)
                this.Transfer(target);
            else
                this.Fill();
        }
        else {
            var targetStorage = this.Creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: function (x) {
                    return x.structureType == STRUCTURE_STORAGE &&
                        x.energy != x.storeCapacity;
                }
            });
            if (!this.Creep.memory.isWork)
                this.Transfer(targetStorage);
            else
                this.Harvest();
        }
    };
    XCreep.prototype.Move = function (target) {
        if (this.Creep.moveTo(target, { visualizePathStyle: this.getVisualStyle() }) == ERR_INVALID_TARGET) {
            this.Creep.say('=ERROR=');
            console.log("found " + this + " creep status at ERR_INVALID_TARGET");
        }
    };
    XCreep.prototype.Build = function () {
        var target = this.Creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if (target != undefined) {
            if (!this.Creep.memory.isWork) {
                var result = this.Creep.build(target);
                if (result == ERR_NOT_IN_RANGE)
                    this.Move(target);
                else if (result == OK) { }
                else
                    console.error("found " + this + " creep status at " + result);
            }
            else
                this.Harvest();
        }
        else
            this.UpgradeController();
    };
    XCreep.prototype.UpgradeController = function () {
        var target = this.Creep.room.controller;
        var result = this.Creep.upgradeController(target);
        if (result == ERR_NOT_IN_RANGE)
            this.Move(target);
        else
            console.error("found " + this + " creep status at " + result);
    };
    XCreep.prototype.Harvest = function () {
        var energy = this.Creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1);
        if (energy.length) {
            console.log("found " + energy[0].amount + " energy at " + energy[0].pos);
            this.Creep.pickup(energy[0]);
            return;
        }
        var source = this.Creep.pos.findClosestByPath(FIND_SOURCES);
        if (this.Creep.memory.sourceIndex == undefined) {
            var sources = this.Creep.room.find(FIND_SOURCES);
            var indexRandom = MathUtil_1.MathUtil.getRandom(0, sources.length - 1);
            this.Creep.memory.sourceIndex = indexRandom;
            source = sources[indexRandom];
        }
        else
            source = this.Creep.room.find(FIND_SOURCES)[this.Creep.memory.sourceIndex];
        var result = this.Creep.harvest(source);
        if (result == ERR_NOT_IN_RANGE)
            this.Move(source);
        else if (result == OK) { }
        else
            console.error("found " + this + " creep status at " + result);
    };
    XCreep.prototype.getVisualStyle = function () {
        return {
            fill: 'transparent',
            stroke: '#fff',
            lineStyle: 'dashed',
            strokeWidth: .15,
            opacity: .1
        };
    };
    return XCreep;
}(XObject_1.XObject));
exports.XCreep = XCreep;
