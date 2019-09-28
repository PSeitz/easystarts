/**
*   EasyStar.js
*   github.com/prettymuchbryce/EasyStarJS
*   Licensed under the MIT license.
*
*   Implementation By Bryce Neal (@prettymuchbryce)
**/
export declare class EasyStar {
    STRAIGHT_COST: number;
    DIAGONAL_COST: number;
    pointsToAvoid: any;
    collisionGrid: number[][];
    costMap: any;
    pointsToCost: any;
    directionalConditions: any;
    allowCornerCutting: boolean;
    iterationsSoFar: any;
    instances: any;
    instanceQueue: number[];
    iterationsPerCalculation: number;
    acceptableTiles: number[];
    diagonalsEnabled: boolean;
    constructor();
    /**
    * Sets the collision grid that EasyStar uses.
    *
    * @param {Array|Number} tiles An array of numbers that represent
    * which tiles in your grid should be considered
    * acceptable, or "walkable".
    **/
    setAcceptableTiles(tiles: any): void;
    /**
     * Enable diagonal pathfinding.
     */
    enableDiagonals(): void;
    /**
     * Disable diagonal pathfinding.
     */
    disableDiagonals(): void;
    /**
    * Sets the collision grid that EasyStar uses.
    *
    * @param {Array} grid The collision grid that this EasyStar instance will read from.
    * This should be a 2D Array of Numbers.
    **/
    setGrid(grid: any): void;
    /**
    * Sets the tile cost for a particular tile type.
    *
    * @param {Number} The tile type to set the cost for.
    * @param {Number} The multiplicative cost associated with the given tile.
    **/
    setTileCost(tileType: any, cost: any): void;
    /**
    * Sets the an additional cost for a particular point.
    * Overrides the cost from setTileCost.
    *
    * @param {Number} x The x value of the point to cost.
    * @param {Number} y The y value of the point to cost.
    * @param {Number} The multiplicative cost associated with the given point.
    **/
    setAdditionalPointCost(x: number, y: number, cost: number): void;
    /**
    * Remove the additional cost for a particular point.
    *
    * @param {Number} x The x value of the point to stop costing.
    * @param {Number} y The y value of the point to stop costing.
    **/
    removeAdditionalPointCost(x: number, y: number): void;
    /**
    * Remove all additional point costs.
    **/
    removeAllAdditionalPointCosts(): void;
    /**
    * Sets a directional condition on a tile
    *
    * @param {Number} x The x value of the point.
    * @param {Number} y The y value of the point.
    * @param {Array.<String>} allowedDirections A list of all the allowed directions that can access
    * the tile.
    **/
    setDirectionalCondition(x: number, y: number, allowedDirections: any): void;
    /**
    * Remove all directional conditions
    **/
    removeAllDirectionalConditions(): void;
    /**
    * Sets the number of search iterations per calculation.
    * A lower number provides a slower result, but more practical if you
    * have a large tile-map and don't want to block your thread while
    * finding a path.
    *
    * @param {Number} iterations The number of searches to prefrom per calculate() call.
    **/
    setIterationsPerCalculation(iterations: number): void;
    /**
    * Avoid a particular point on the grid,
    * regardless of whether or not it is an acceptable tile.
    *
    * @param {Number} x The x value of the point to avoid.
    * @param {Number} y The y value of the point to avoid.
    **/
    avoidAdditionalPoint(x: number, y: number): void;
    /**
    * Stop avoiding a particular point on the grid.
    *
    * @param {Number} x The x value of the point to stop avoiding.
    * @param {Number} y The y value of the point to stop avoiding.
    **/
    stopAvoidingAdditionalPoint(x: number, y: number): void;
    /**
    * Enables corner cutting in diagonal movement.
    **/
    enableCornerCutting(): void;
    /**
    * Disables corner cutting in diagonal movement.
    **/
    disableCornerCutting(): void;
    /**
    * Stop avoiding all additional points on the grid.
    **/
    stopAvoidingAllAdditionalPoints(): void;
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
    findPathSync(startX: number, startY: number, endX: number, endY: any): undefined;
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
    findPath(startX: number, startY: number, endX: number, endY: number, callback: {
        (arg0: never[]): void;
        (arg0: null): void;
    }): number | undefined;
    /**
     * Cancel a path calculation.
     *
     * @param {Number} instanceId The instance ID of the path being calculated
     * @return {Boolean} True if an instance was found and cancelled.
     *
     **/
    cancelPath(instanceId: number): boolean;
    /**
    * This method steps through the A* Algorithm in an attempt to
    * find your path(s). It will search 4-8 tiles (depending on diagonals) for every calculation.
    * You can change the number of calculations done in a call by using
    * easystar.setIteratonsPerCalculation().
    **/
    calculate(sync?: boolean): void;
    private checkAdjacentNode;
    private isTileWalkable;
    /**
     * -1, -1 | 0, -1  | 1, -1
     * -1,  0 | SOURCE | 1,  0
     * -1,  1 | 0,  1  | 1,  1
     */
    private calculateDirection;
    private getTileCost;
    private coordinateToNode;
    private getDistance;
}
export declare const TOP = "TOP";
export declare const TOP_RIGHT = "TOP_RIGHT";
export declare const RIGHT = "RIGHT";
export declare const BOTTOM_RIGHT = "BOTTOM_RIGHT";
export declare const BOTTOM = "BOTTOM";
export declare const BOTTOM_LEFT = "BOTTOM_LEFT";
export declare const LEFT = "LEFT";
export declare const TOP_LEFT = "TOP_LEFT";
