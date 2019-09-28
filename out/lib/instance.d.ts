/**
 * Represents a single instance of EasyStar.
 * A path that is in the queue to eventually be found.
 */
export default class Instance {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    pointsToAvoid: {};
    callback: any;
    nodeHash: {};
    openList: any;
    isDoneCalculating?: boolean;
    constructor(startX: number, startY: number, endX: number, endY: number);
}
