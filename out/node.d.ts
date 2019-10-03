/**
* A simple Node that represents a single tile on the grid.
* @param {Object} parent The parent node.
* @param {Number} x The x position on the grid.
* @param {Number} y The y position on the grid.
* @param {Number} costSoFar How far this node is in moves*cost from the start.
* @param {Number} simpleDistanceToTarget Manhatten distance to the end point.
**/
export default class Node {
    parent: Node | null;
    x: number;
    y: number;
    costSoFar: number;
    simpleDistanceToTarget: number;
    list?: any;
    constructor(parent: Node | null, x: number, y: number, costSoFar: number, simpleDistanceToTarget: number, list?: any);
    /**
    * @return {Number} Best guess distance of a cost using this node.
    **/
    bestGuessDistance(): number;
}
