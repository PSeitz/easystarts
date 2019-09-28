/**
 * Represents a single instance of EasyStar.
 * A path that is in the queue to eventually be found.
 */
export default class Instance {
    constructor(startX, startY, endX, endY) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.pointsToAvoid = {};
        this.nodeHash = {};
    }
}
//# sourceMappingURL=instance.js.map