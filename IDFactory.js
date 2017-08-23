"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IDFactoryError_1 = require("./IDFactoryError");
var LinqTS_1 = require("./LinqTS");
var IDFactory = (function () {
    function IDFactory() {
        this.nextMinId = 0;
        this.idList = new LinqTS_1.List();
        this.LockIDs(0);
        console.log("IDFactory: " + this.getUsedCount() + " id's used.");
    }
    IDFactory.getInstance = function () {
        if (IDFactory.instance == undefined || IDFactory.instance == null)
            return (IDFactory.instance = new IDFactory());
        return IDFactory.instance;
    };
    IDFactory.prototype.NextID = function () {
        try {
            var id = this.nextMinId;
            if (id == -2147483648)
                throw new IDFactoryError_1.IDFactoryError("All id's are used, please clear your database");
            this.idList.Add(id);
            this.nextMinId = id++;
            return id;
        }
        finally {
        }
    };
    IDFactory.prototype.LockIDs = function () {
        var ids = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            ids[_i] = arguments[_i];
        }
        try {
            for (var idx in ids) {
                var id = ids[idx];
                var status_1 = this.idList.Contains(id);
                if (status_1)
                    throw new IDFactoryError_1.IDFactoryError("ID '" + id + "' is already taken, fatal error!!!");
                this.idList.Add(id);
            }
        }
        finally {
        }
    };
    IDFactory.prototype.ReleaseID = function (id) {
        try {
            var status_2 = this.idList[id];
            if (!status_2)
                throw new IDFactoryError_1.IDFactoryError("ID '" + id + "' is not taken, can't release it.");
            this.idList.Remove(id);
            if (id < this.nextMinId || this.nextMinId == -2147483648)
                this.nextMinId = id;
        }
        finally { }
    };
    IDFactory.prototype.getUsedCount = function () {
        try {
            return this.idList.Count();
        }
        finally {
        }
    };
    return IDFactory;
}());
exports.IDFactory = IDFactory;
