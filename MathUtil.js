"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MathUtil = (function () {
    function MathUtil() {
    }
    MathUtil.getDistance = function (x1, y1, x2, y2) {
        var dx = x2 - x1;
        var dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    };
    MathUtil.getRandom = function (min, max) {
        var rand = min - 0.5 + Math.random() * (max - min + 1);
        rand = Math.round(rand);
        return rand;
    };
    return MathUtil;
}());
exports.MathUtil = MathUtil;
