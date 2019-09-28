import Node from "./node";
import { IPoint } from "./index";

export default class Instance {
    pointsToAvoid: any = {};
    nodeHash:any = {};
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