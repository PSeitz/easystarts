"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
* A simple Node that represents a single tile on the grid.
* @param {Object} parent The parent node.
* @param {Number} x The x position on the grid.
* @param {Number} y The y position on the grid.
* @param {Number} costSoFar How far this node is in moves*cost from the start.
* @param {Number} simpleDistanceToTarget Manhatten distance to the end point.
**/
class Node {
    constructor(parent, x, y, costSoFar, simpleDistanceToTarget, list) {
        this.parent = parent;
        this.x = x;
        this.y = y;
        this.costSoFar = costSoFar;
        this.simpleDistanceToTarget = simpleDistanceToTarget;
        this.list = list;
    }
    /**
    * @return {Number} Best guess distance of a cost using this node.
    **/
    bestGuessDistance() {
        return this.costSoFar + this.simpleDistanceToTarget;
    }
}
exports.default = Node;
//# sourceMappingURL=node.js.map