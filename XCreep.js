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
var StatusCode_1 = require("./StatusCode");
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
    };
    XCreep.prototype.Provide = function () {
        var target = this.Creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: function (x) {
                return x.structureType == STRUCTURE_EXTENSION && x.energy != 50 ||
                    x.structureType == STRUCTURE_SPAWN && x.energy != 300 ||
                    x.structureType == STRUCTURE_TOWER && x.energy != 1000;
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
    XCreep.prototype.AutoRepair = function () {
        var breakedStrcuture = this.Creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: function (x) { return x.hits < x.hitsMax && x.structureType != STRUCTURE_WALL && x.structureType != STRUCTURE_RAMPART; }
        });
        if (breakedStrcuture != undefined) {
            if (!this.Creep.memory.isWork) {
                var result = this.Creep.repair(breakedStrcuture);
                if (result == ERR_NOT_IN_RANGE)
                    this.Move(breakedStrcuture);
                else if (result == OK) { }
                else
                    console.log("[repair] found " + this + " creep status at " + StatusCode_1.STATUS_CODE[result]);
                return true;
            }
            else {
                this.Harvest();
                return true;
            }
        }
        return false;
    };
    XCreep.prototype.Build = function () {
        if (this.AutoRepair())
            return;
        var target = this.Creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if (target != undefined) {
            if (!this.Creep.memory.isWork) {
                var result = this.Creep.build(target);
                if (result == ERR_NOT_IN_RANGE)
                    this.Move(target);
                else if (result == OK) { }
                else
                    console.log("[Build] found " + this + " creep status at " + StatusCode_1.STATUS_CODE[result]);
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
        if (this.Creep.memory.isWork) {
            this.Harvest();
            return;
        }
        if (result == ERR_NOT_IN_RANGE)
            this.Move(target);
        else if (result == OK) { }
        else
            console.log("[Upd] found " + this + " creep status at " + StatusCode_1.STATUS_CODE[result]);
    };
    XCreep.prototype.MoveToRoom = function (roomPos) {
    };
    XCreep.prototype.Harvest = function () {
        var energy = this.Creep.pos.findInRange(FIND_DROPPED_RESOURCES, 5);
        if (energy.length) {
            var res = this.Creep.pickup(energy[0]);
            if (res == ERR_NOT_IN_RANGE) {
                this.Move(energy[0]);
                res = OK;
            }
            console.log("[" + StatusCode_1.STATUS_CODE[res] + "] found " + energy[0].amount + " energy at " + energy[0].pos);
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
        else if (result == ERR_BUSY) {
            this.Creep.say("Not Aviable");
        }
        else
            console.log("[Harv] found " + this + " creep status at " + StatusCode_1.STATUS_CODE[result]);
    };
    XCreep.prototype.toString = function () {
        return "(" + this.getRole + ")[" + this.getID().ToString().split('-')[0] + "]";
    };
    XCreep.prototype.getVisualStyle = function () {
        return {
            fill: 'transparent',
            stroke: '#ecebff',
            lineStyle: 'dashed',
            strokeWidth: .15,
            opacity: .4
        };
    };
    XCreep.UPDATER = "updater";
    XCreep.PROVIDER = "provider";
    XCreep.BUILDER = "builder";
    return XCreep;
}(XObject_1.XObject));
exports.XCreep = XCreep;
