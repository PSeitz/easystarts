import Node from "./node";
import { IPoint } from "./index";

export default class Instance {
    pointsToAvoid: {[key: number]: {[key: number]: number} } = {};
    nodeHash:  { [x: string]: { [x: string]: Node; }; } = {};
    isDoneCalculating?: boolean;
    constructor(
        public startX: number,
        public  startY: number,
        public  endX: number,
        public  endY: number,
        public  openList: Heap<Node>,
        public  callback: (data: IPoint[] | null) => void,
    ){}
}