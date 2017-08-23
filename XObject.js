"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Guid_1 = require("./Guid");
var XObject = (function () {
    function XObject() {
        this.uid = Guid_1.Guid.newGuid();
    }
    XObject.prototype.getID = function () { return this.uid; };
    XObject.prototype.ToString = function () { return "XObject [" + this.uid + "]"; };
    return XObject;
}());
exports.XObject = XObject;
