"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Instance {
    constructor(startX, startY, endX, endY, openList, callback) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.openList = openList;
        this.callback = callback;
        this.pointsToAvoid = {};
        this.nodeHash = {};
    }
}
exports.default = Instance;
//# sourceMappingURL=instance.js.map