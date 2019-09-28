/// <reference types="heap" />
import Node from "./node";
import { IPoint } from "./index";
export default class Instance {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    openList: Heap<Node>;
    callback: (data: IPoint[] | null) => void;
    pointsToAvoid: {
        [key: number]: {
            [key: number]: number;
        };
    };
    nodeHash: {
        [x: string]: {
            [x: string]: Node;
        };
    };
    isDoneCalculating?: boolean;
    constructor(startX: number, startY: number, endX: number, endY: number, openList: Heap<Node>, callback: (data: IPoint[] | null) => void);
}
