"use strict";
/**
*   EasyStar.js
*   github.com/prettymuchbryce/EasyStarJS
*   Licensed under the MIT license.
*
*   Implementation By Bryce Neal (@prettymuchbryce)
**/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const instance_1 = __importDefault(require("./instance"));
const node_1 = __importDefault(require("./node"));
const heap_1 = __importDefault(require("heap"));
const CLOSED_LIST = 0;
const OPEN_LIST = 1;
let nextInstanceId = 1;
class EasyStar {
    constructor() {
        this.STRAIGHT_COST = 1.0;
        this.DIAGONAL_COST = 1.4;
        this.pointsToAvoid = {};
        this.collisionGrid = [];
        this.costMap = {};
        this.pointsToCost = {};
        this.directionalConditions = {};
        this.allowCornerCutting = true;
        this.iterationsSoFar = 0;
        this.instances = {};
        this.instanceQueue = [];
        this.iterationsPerCalculation = Number.MAX_VALUE;
        this.acceptableTiles = [];
        this.diagonalsEnabled = false;
    }
    /**
    * Sets the collision grid that EasyStar uses.
    *
    * @param {Array|Number} tiles An array of numbers that represent
    * which tiles in your grid should be considered
    * acceptable, or "walkable".
    **/
    setAcceptableTiles(tiles) {
        let setTile = (tiles) => {
            if (!isNaN(tiles) && isFinite(tiles)) {
                this.acceptableTiles = [tiles];
            }
            else {
                throw new Error("invalid number " + tiles);
            }
        };
        if (tiles instanceof Array) {
            // Array
            this.acceptableTiles = tiles;
        }
        else if (typeof tiles === "string") {
            setTile(parseFloat(tiles));
        }
        else {
            setTile(tiles);
        }
    }
    ;
    /**
     * Enable diagonal pathfinding.
     */
    enableDiagonals() {
        this.diagonalsEnabled = true;
    }
    /**
     * Disable diagonal pathfinding.
     */
    disableDiagonals() {
        this.diagonalsEnabled = false;
    }
    /**
    * Sets the collision grid that EasyStar uses.
    *
    * @param {Array} grid The collision grid that this EasyStar instance will read from.
    * This should be a 2D Array of Numbers.
    **/
    setGrid(grid) {
        this.collisionGrid = grid;
        //Setup cost map
        for (var y = 0; y < this.collisionGrid.length; y++) {
            for (var x = 0; x < this.collisionGrid[0].length; x++) {
                if (!this.costMap[this.collisionGrid[y][x]]) {
                    this.costMap[this.collisionGrid[y][x]] = 1;
                }
            }
        }
    }
    ;
    /**
    * Sets the tile cost for a particular tile type.
    *
    * @param {Number} The tile type to set the cost for.
    * @param {Number} The multiplicative cost associated with the given tile.
    **/
    setTileCost(tileType, cost) {
        this.costMap[tileType] = cost;
    }
    ;
    /**
    * Sets the an additional cost for a particular point.
    * Overrides the cost from setTileCost.
    *
    * @param {Number} x The x value of the point to cost.
    * @param {Number} y The y value of the point to cost.
    * @param {Number} The multiplicative cost associated with the given point.
    **/
    setAdditionalPointCost(x, y, cost) {
        if (this.pointsToCost[y] === undefined) {
            this.pointsToCost[y] = {};
        }
        this.pointsToCost[y][x] = cost;
    }
    ;
    /**
    * Remove the additional cost for a particular point.
    *
    * @param {Number} x The x value of the point to stop costing.
    * @param {Number} y The y value of the point to stop costing.
    **/
    removeAdditionalPointCost(x, y) {
        if (this.pointsToCost[y] !== undefined) {
            delete this.pointsToCost[y][x];
        }
    }
    /**
    * Remove all additional point costs.
    **/
    removeAllAdditionalPointCosts() {
        this.pointsToCost = {};
    }
    /**
    * Sets a directional condition on a tile
    *
    * @param {Number} x The x value of the point.
    * @param {Number} y The y value of the point.
    * @param {Array.<String>} allowedDirections A list of all the allowed directions that can access
    * the tile.
    **/
    setDirectionalCondition(x, y, allowedDirections) {
        if (this.directionalConditions[y] === undefined) {
            this.directionalConditions[y] = {};
        }
        this.directionalConditions[y][x] = allowedDirections;
    }
    ;
    /**
    * Remove all directional conditions
    **/
    removeAllDirectionalConditions() {
        this.directionalConditions = {};
    }
    ;
    /**
    * Sets the number of search iterations per calculation.
    * A lower number provides a slower result, but more practical if you
    * have a large tile-map and don't want to block your thread while
    * finding a path.
    *
    * @param {Number} iterations The number of searches to prefrom per calculate() call.
    **/
    setIterationsPerCalculation(iterations) {
        this.iterationsPerCalculation = iterations;
    }
    ;
    /**
    * Avoid a particular point on the grid,
    * regardless of whether or not it is an acceptable tile.
    *
    * @param {Number} x The x value of the point to avoid.
    * @param {Number} y The y value of the point to avoid.
    **/
    avoidAdditionalPoint(x, y) {
        if (this.pointsToAvoid[y] === undefined) {
            this.pointsToAvoid[y] = {};
        }
        this.pointsToAvoid[y][x] = 1;
    }
    ;
    /**
    * Stop avoiding a particular point on the grid.
    *
    * @param {Number} x The x value of the point to stop avoiding.
    * @param {Number} y The y value of the point to stop avoiding.
    **/
    stopAvoidingAdditionalPoint(x, y) {
        if (this.pointsToAvoid[y] !== undefined) {
            delete this.pointsToAvoid[y][x];
        }
    }
    ;
    /**
    * Enables corner cutting in diagonal movement.
    **/
    enableCornerCutting() {
        this.allowCornerCutting = true;
    }
    ;
    /**
    * Disables corner cutting in diagonal movement.
    **/
    disableCornerCutting() {
        this.allowCornerCutting = false;
    }
    ;
    /**
    * Stop avoiding all additional points on the grid.
    **/
    stopAvoidingAllAdditionalPoints() {
        this.pointsToAvoid = {};
    }
    ;
    /**
    * Find a path.
    *
    * @param {Number} startX The X position of the starting point.
    * @param {Number} startY The Y position of the starting point.
    * @param {Number} endX The X position of the ending point.
    * @param {Number} endY The Y position of the ending point.
    * @return {Array} The path
    *
    **/
    findPathSync(startX, startY, endX, endY) {
        let val = null;
        this.findPath(startX, startY, endX, endY, (result) => {
            val = result;
        });
        this.calculate();
        return val;
    }
    /**
    * Find a path.
    *
    * @param {Number} startX The X position of the starting point.
    * @param {Number} startY The Y position of the starting point.
    * @param {Number} endX The X position of the ending point.
    * @param {Number} endY The Y position of the ending point.
    * @param {Function} callback A function that is called when your path
    * is found, or no path is found.
    * @return {Number} A numeric, non-zero value which identifies the created instance. This value can be passed to cancelPath to cancel the path calculation.
    *
    **/
    findPath(startX, startY, endX, endY, callback) {
        // No acceptable tiles were set
        if (this.acceptableTiles === undefined) {
            throw new Error("You can't set a path without first calling setAcceptableTiles() on EasyStar.");
        }
        // No grid was set
        if (this.collisionGrid === undefined) {
            throw new Error("You can't set a path without first calling setGrid() on EasyStar.");
        }
        // Start or endpoint outside of scope.
        if (startX < 0 || startY < 0 || endX < 0 || endY < 0 ||
            startX > this.collisionGrid[0].length - 1 || startY > this.collisionGrid.length - 1 ||
            endX > this.collisionGrid[0].length - 1 || endY > this.collisionGrid.length - 1) {
            throw new Error("Your start or end point is outside the scope of your grid.");
        }
        // Start and end are the same tile.
        if (startX === endX && startY === endY) {
            callback([]);
            return;
        }
        // End point is not an acceptable tile.
        var endTile = this.collisionGrid[endY][endX];
        var isAcceptable = false;
        for (var i = 0; i < this.acceptableTiles.length; i++) {
            if (endTile === this.acceptableTiles[i]) {
                isAcceptable = true;
                break;
            }
        }
        if (isAcceptable === false) {
            callback(null);
            return;
        }
        // Create the instance
        let heap = new heap_1.default(function (nodeA, nodeB) {
            return nodeA.bestGuessDistance() - nodeB.bestGuessDistance();
        });
        var instance = new instance_1.default(startX, startY, endX, endY, heap, callback);
        instance.isDoneCalculating = false;
        instance.nodeHash = {};
        instance.openList.push(this.coordinateToNode(instance, instance.startX, instance.startY, null, this.STRAIGHT_COST));
        var instanceId = nextInstanceId++;
        this.instances[instanceId] = instance;
        this.instanceQueue.push(instanceId);
        return instanceId;
    }
    ;
    /**
     * Cancel a path calculation.
     *
     * @param {Number} instanceId The instance ID of the path being calculated
     * @return {Boolean} True if an instance was found and cancelled.
     *
     **/
    cancelPath(instanceId) {
        if (instanceId in this.instances) {
            delete this.instances[instanceId];
            // No need to remove it from instanceQueue
            return true;
        }
        return false;
    }
    ;
    /**
    * This method steps through the A* Algorithm in an attempt to
    * find your path(s). It will search 4-8 tiles (depending on diagonals) for every calculation.
    * You can change the number of calculations done in a call by using
    * easystar.setIteratonsPerCalculation().
    **/
    calculate(sync = false) {
        if (this.instanceQueue.length === 0 || this.collisionGrid === undefined || this.acceptableTiles === undefined) {
            return;
        }
        for (this.iterationsSoFar = 0; this.iterationsSoFar < this.iterationsPerCalculation; this.iterationsSoFar++) {
            if (this.instanceQueue.length === 0) {
                return;
            }
            if (sync) {
                this.iterationsSoFar = 0;
            }
            var instanceId = this.instanceQueue[0];
            var instance = this.instances[instanceId];
            if (typeof instance == 'undefined') {
                // This instance was cancelled
                this.instanceQueue.shift();
                continue;
            }
            // Couldn't find a path.
            if (instance.openList.size() === 0) {
                instance.callback(null);
                delete this.instances[instanceId];
                this.instanceQueue.shift();
                continue;
            }
            var searchNode = instance.openList.pop();
            // Handles the case where we have found the destination
            if (instance.endX === searchNode.x && instance.endY === searchNode.y) {
                var path = [];
                path.push({ x: searchNode.x, y: searchNode.y });
                var parent = searchNode.parent;
                while (parent != null) {
                    path.push({ x: parent.x, y: parent.y });
                    parent = parent.parent;
                }
                path.reverse();
                instance.callback(path);
                delete this.instances[instanceId];
                this.instanceQueue.shift();
                continue;
            }
            searchNode.list = CLOSED_LIST;
            if (searchNode.y > 0) {
                this.checkAdjacentNode(instance, searchNode, 0, -1, this.STRAIGHT_COST * this.getTileCost(searchNode.x, searchNode.y - 1));
            }
            if (searchNode.x < this.collisionGrid[0].length - 1) {
                this.checkAdjacentNode(instance, searchNode, 1, 0, this.STRAIGHT_COST * this.getTileCost(searchNode.x + 1, searchNode.y));
            }
            if (searchNode.y < this.collisionGrid.length - 1) {
                this.checkAdjacentNode(instance, searchNode, 0, 1, this.STRAIGHT_COST * this.getTileCost(searchNode.x, searchNode.y + 1));
            }
            if (searchNode.x > 0) {
                this.checkAdjacentNode(instance, searchNode, -1, 0, this.STRAIGHT_COST * this.getTileCost(searchNode.x - 1, searchNode.y));
            }
            if (this.diagonalsEnabled) {
                if (searchNode.x > 0 && searchNode.y > 0) {
                    if (this.allowCornerCutting ||
                        (this.isTileWalkable(this.collisionGrid, this.acceptableTiles, searchNode.x, searchNode.y - 1, searchNode) &&
                            this.isTileWalkable(this.collisionGrid, this.acceptableTiles, searchNode.x - 1, searchNode.y, searchNode))) {
                        this.checkAdjacentNode(instance, searchNode, -1, -1, this.DIAGONAL_COST * this.getTileCost(searchNode.x - 1, searchNode.y - 1));
                    }
                }
                if (searchNode.x < this.collisionGrid[0].length - 1 && searchNode.y < this.collisionGrid.length - 1) {
                    if (this.allowCornerCutting ||
                        (this.isTileWalkable(this.collisionGrid, this.acceptableTiles, searchNode.x, searchNode.y + 1, searchNode) &&
                            this.isTileWalkable(this.collisionGrid, this.acceptableTiles, searchNode.x + 1, searchNode.y, searchNode))) {
                        this.checkAdjacentNode(instance, searchNode, 1, 1, this.DIAGONAL_COST * this.getTileCost(searchNode.x + 1, searchNode.y + 1));
                    }
                }
                if (searchNode.x < this.collisionGrid[0].length - 1 && searchNode.y > 0) {
                    if (this.allowCornerCutting ||
                        (this.isTileWalkable(this.collisionGrid, this.acceptableTiles, searchNode.x, searchNode.y - 1, searchNode) &&
                            this.isTileWalkable(this.collisionGrid, this.acceptableTiles, searchNode.x + 1, searchNode.y, searchNode))) {
                        this.checkAdjacentNode(instance, searchNode, 1, -1, this.DIAGONAL_COST * this.getTileCost(searchNode.x + 1, searchNode.y - 1));
                    }
                }
                if (searchNode.x > 0 && searchNode.y < this.collisionGrid.length - 1) {
                    if (this.allowCornerCutting ||
                        (this.isTileWalkable(this.collisionGrid, this.acceptableTiles, searchNode.x, searchNode.y + 1, searchNode) &&
                            this.isTileWalkable(this.collisionGrid, this.acceptableTiles, searchNode.x - 1, searchNode.y, searchNode))) {
                        this.checkAdjacentNode(instance, searchNode, -1, 1, this.DIAGONAL_COST * this.getTileCost(searchNode.x - 1, searchNode.y + 1));
                    }
                }
            }
        }
    }
    ;
    // Private methods follow
    checkAdjacentNode(instance, searchNode, x, y, cost) {
        var adjacentCoordinateX = searchNode.x + x;
        var adjacentCoordinateY = searchNode.y + y;
        if ((this.pointsToAvoid[adjacentCoordinateY] === undefined ||
            this.pointsToAvoid[adjacentCoordinateY][adjacentCoordinateX] === undefined) &&
            this.isTileWalkable(this.collisionGrid, this.acceptableTiles, adjacentCoordinateX, adjacentCoordinateY, searchNode)) {
            var node = this.coordinateToNode(instance, adjacentCoordinateX, adjacentCoordinateY, searchNode, cost);
            if (node.list === undefined) {
                node.list = OPEN_LIST;
                instance.openList.push(node);
            }
            else if (searchNode.costSoFar + cost < node.costSoFar) {
                node.costSoFar = searchNode.costSoFar + cost;
                node.parent = searchNode;
                instance.openList.updateItem(node);
            }
        }
    }
    ;
    // Helpers
    isTileWalkable(collisionGrid, acceptableTiles, x, y, sourceNode) {
        var directionalCondition = this.directionalConditions[y] && this.directionalConditions[y][x];
        if (directionalCondition) {
            var direction = this.calculateDirection(sourceNode.x - x, sourceNode.y - y);
            var directionIncluded = function () {
                for (var i = 0; i < directionalCondition.length; i++) {
                    if (directionalCondition[i] === direction)
                        return true;
                }
                return false;
            };
            if (!directionIncluded())
                return false;
        }
        for (var i = 0; i < acceptableTiles.length; i++) {
            if (collisionGrid[y][x] === acceptableTiles[i]) {
                return true;
            }
        }
        return false;
    }
    ;
    /**
     * -1, -1 | 0, -1  | 1, -1
     * -1,  0 | SOURCE | 1,  0
     * -1,  1 | 0,  1  | 1,  1
     */
    calculateDirection(diffX, diffY) {
        if (diffX === 0 && diffY === -1)
            return Directions.TOP;
        else if (diffX === 1 && diffY === -1)
            return Directions.TOP_RIGHT;
        else if (diffX === 1 && diffY === 0)
            return Directions.RIGHT;
        else if (diffX === 1 && diffY === 1)
            return Directions.BOTTOM_RIGHT;
        else if (diffX === 0 && diffY === 1)
            return Directions.BOTTOM;
        else if (diffX === -1 && diffY === 1)
            return Directions.BOTTOM_LEFT;
        else if (diffX === -1 && diffY === 0)
            return Directions.LEFT;
        else if (diffX === -1 && diffY === -1)
            return Directions.TOP_LEFT;
        throw new Error('These differences are not valid: ' + diffX + ', ' + diffY);
    }
    ;
    getTileCost(x, y) {
        return (this.pointsToCost[y] && this.pointsToCost[y][x]) || this.costMap[this.collisionGrid[y][x]];
    }
    ;
    coordinateToNode(instance, x, y, parent, cost) {
        if (instance.nodeHash[y] !== undefined) {
            if (instance.nodeHash[y][x] !== undefined) {
                return instance.nodeHash[y][x];
            }
        }
        else {
            instance.nodeHash[y] = {};
        }
        var simpleDistanceToTarget = this.getDistance(x, y, instance.endX, instance.endY);
        if (parent !== null) {
            var costSoFar = parent.costSoFar + cost;
        }
        else {
            costSoFar = 0;
        }
        var node = new node_1.default(parent, x, y, costSoFar, simpleDistanceToTarget);
        instance.nodeHash[y][x] = node;
        return node;
    }
    ;
    getDistance(x1, y1, x2, y2) {
        if (this.diagonalsEnabled) {
            // Octile distance
            var dx = Math.abs(x1 - x2);
            var dy = Math.abs(y1 - y2);
            if (dx < dy) {
                return this.DIAGONAL_COST * dx + dy;
            }
            else {
                return this.DIAGONAL_COST * dy + dx;
            }
        }
        else {
            // Manhattan distance
            var dx = Math.abs(x1 - x2);
            var dy = Math.abs(y1 - y2);
            return (dx + dy);
        }
    }
    ;
}
exports.EasyStar = EasyStar;
var Directions;
(function (Directions) {
    Directions["TOP"] = "TOP";
    Directions["TOP_RIGHT"] = "TOP_RIGHT";
    Directions["RIGHT"] = "RIGHT";
    Directions["BOTTOM_RIGHT"] = "BOTTOM_RIGHT";
    Directions["BOTTOM"] = "BOTTOM";
    Directions["BOTTOM_LEFT"] = "BOTTOM_LEFT";
    Directions["LEFT"] = "LEFT";
    Directions["TOP_LEFT"] = "TOP_LEFT";
})(Directions = exports.Directions || (exports.Directions = {}));
//# sourceMappingURL=index.js.map