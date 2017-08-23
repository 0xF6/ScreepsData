"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Guid = (function () {
    function Guid(guid) {
        this.guid = guid;
    }
    Guid.newGuid = function () {
        return new Guid(([1e7] + -1e3 + -4e3 + -8e3 + -1e11).toString().replace(/[018]/g, function (a) { return (a ^ Math.random() * 16 >> a / 4).toString(16); }).toString());
    };
    Guid.prototype.ToString = function () { return this.guid; };
    return Guid;
}());
exports.Guid = Guid;
