"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const chai_1 = require("chai");
require("mocha");
describe("EasyStar", function () {
    beforeEach(function () { });
    it("It should find a path successfully with corner cutting enabled.", function (done) {
        var easyStar = new index_1.EasyStar();
        easyStar.enableDiagonals();
        var map = [[1, 0, 0, 0, 0],
            [0, 1, 0, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 0, 1, 0],
            [0, 0, 0, 0, 1]];
        easyStar.setGrid(map);
        easyStar.enableCornerCutting();
        easyStar.setAcceptableTiles([1]);
        easyStar.findPath(0, 0, 4, 4, onPathFound);
        easyStar.calculate();
        function onPathFound(path) {
            chai_1.expect(path).not.to.be.null;
            chai_1.expect(path.length).to.equal(5);
            chai_1.expect(path[0].x).to.equal(0);
            chai_1.expect(path[0].y).to.equal(0);
            chai_1.expect(path[3].x).to.equal(3);
            chai_1.expect(path[3].y).to.equal(3);
            done();
        }
    });
    it("sync - It should find a path successfully with corner cutting enabled.", function () {
        var easyStar = new index_1.EasyStar();
        easyStar.enableDiagonals();
        var map = [[1, 0, 0, 0, 0],
            [0, 1, 0, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 0, 1, 0],
            [0, 0, 0, 0, 1]];
        easyStar.setGrid(map);
        easyStar.enableCornerCutting();
        easyStar.setAcceptableTiles([1]);
        const path = easyStar.findPathSync(0, 0, 4, 4);
        chai_1.expect(path).not.to.be.null;
        chai_1.expect(path.length).to.equal(5);
        chai_1.expect(path[0].x).to.equal(0);
        chai_1.expect(path[0].y).to.equal(0);
        chai_1.expect(path[3].x).to.equal(3);
        chai_1.expect(path[3].y).to.equal(3);
        easyStar.calculate();
    });
    it("It should fail to find a path successfully with corner cutting disabled.", function (done) {
        var easyStar = new index_1.EasyStar();
        easyStar.enableDiagonals();
        var map = [[1, 0, 0, 0, 0],
            [0, 1, 0, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 0, 1, 0],
            [0, 0, 0, 0, 1]];
        easyStar.setGrid(map);
        easyStar.disableCornerCutting();
        easyStar.setAcceptableTiles([1]);
        easyStar.findPath(0, 0, 4, 4, onPathFound);
        easyStar.calculate();
        function onPathFound(path) {
            chai_1.expect(path).to.be.null;
            done();
        }
    });
    it("It should find a path successfully.", function (done) {
        var easyStar = new index_1.EasyStar();
        var map = [[1, 1, 0, 1, 1],
            [1, 1, 0, 1, 1],
            [1, 1, 0, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1]];
        easyStar.setGrid(map);
        easyStar.setAcceptableTiles([1]);
        easyStar.findPath(1, 2, 3, 2, onPathFound);
        easyStar.calculate();
        function onPathFound(path) {
            chai_1.expect(path).not.to.be.null;
            chai_1.expect(path.length).to.equal(5);
            chai_1.expect(path[0].x).to.equal(1);
            chai_1.expect(path[0].y).to.equal(2);
            chai_1.expect(path[2].x).to.equal(2);
            chai_1.expect(path[2].y).to.equal(3);
            done();
        }
    });
    it("It should be able to cancel a path.", function (done) {
        var easyStar = new index_1.EasyStar();
        var map = [[1, 1, 0, 1, 1],
            [1, 1, 0, 1, 1],
            [1, 1, 0, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1]];
        easyStar.setGrid(map);
        easyStar.setAcceptableTiles([1]);
        var id = easyStar.findPath(1, 2, 3, 2, onPathFound);
        easyStar.cancelPath(id);
        easyStar.calculate();
        function onPathFound(path) {
            throw new Error("path wasn't cancelled");
        }
        setTimeout(done, 0);
    });
    it("Paths should have different IDs.", function () {
        var easyStar = new index_1.EasyStar();
        var map = [[1, 1, 0, 1, 1],
            [1, 1, 0, 1, 1],
            [1, 1, 0, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1]];
        easyStar.setGrid(map);
        easyStar.setAcceptableTiles([1]);
        var id1 = easyStar.findPath(1, 2, 3, 2, onPathFound);
        var id2 = easyStar.findPath(3, 2, 1, 2, onPathFound);
        chai_1.expect(id1).to.be.greaterThan(0);
        chai_1.expect(id2).to.be.greaterThan(0);
        chai_1.expect(id1).not.to.equal(id2);
        function onPathFound(path) {
        }
    });
    it("It should be able to avoid a separate point successfully.", function (done) {
        var easyStar = new index_1.EasyStar();
        var map = [[1, 1, 0, 1, 1],
            [1, 1, 0, 1, 1],
            [1, 1, 0, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1]];
        easyStar.setGrid(map);
        easyStar.avoidAdditionalPoint(2, 3);
        easyStar.setAcceptableTiles([1]);
        easyStar.findPath(1, 2, 3, 2, onPathFound);
        easyStar.calculate();
        function onPathFound(path) {
            chai_1.expect(path).not.to.be.null;
            chai_1.expect(path.length).to.equal(7);
            chai_1.expect(path[0].x).to.equal(1);
            chai_1.expect(path[0].y).to.equal(2);
            chai_1.expect(path[2].x).to.equal(1);
            chai_1.expect(path[2].y).to.equal(4);
            done();
        }
    });
    it("It should work with diagonals", function (done) {
        var easyStar = new index_1.EasyStar();
        easyStar.enableDiagonals();
        var map = [[1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1]];
        easyStar.setGrid(map);
        easyStar.setAcceptableTiles([1]);
        easyStar.findPath(0, 0, 4, 4, onPathFound);
        easyStar.calculate();
        function onPathFound(path) {
            chai_1.expect(path).not.to.be.null;
            chai_1.expect(path.length).to.equal(5);
            chai_1.expect(path[0].x).to.equal(0);
            chai_1.expect(path[0].y).to.equal(0);
            chai_1.expect(path[1].x).to.equal(1);
            chai_1.expect(path[1].y).to.equal(1);
            chai_1.expect(path[2].x).to.equal(2);
            chai_1.expect(path[2].y).to.equal(2);
            chai_1.expect(path[3].x).to.equal(3);
            chai_1.expect(path[3].y).to.equal(3);
            chai_1.expect(path[4].x).to.equal(4);
            chai_1.expect(path[4].y).to.equal(4);
            done();
        }
    });
    it("It should move in a straight line with diagonals", function (done) {
        var easyStar = new index_1.EasyStar();
        easyStar.enableDiagonals();
        var map = [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 0, 1, 1, 1, 1, 0, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];
        easyStar.setGrid(map);
        easyStar.enableDiagonals();
        easyStar.setAcceptableTiles([1]);
        easyStar.findPath(0, 0, 9, 0, onPathFound);
        easyStar.calculate();
        function onPathFound(path) {
            chai_1.expect(path).not.to.be.null;
            for (var i = 0; i < path.length; i++) {
                chai_1.expect(path[i].y).to.equal(0);
            }
            done();
        }
    });
    it("It should return empty path when start and end are the same tile.", function (done) {
        var easyStar = new index_1.EasyStar();
        var map = [[1, 1, 0, 1, 1],
            [1, 1, 0, 1, 1],
            [1, 1, 0, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1]];
        easyStar.setGrid(map);
        easyStar.setAcceptableTiles([1]);
        easyStar.findPath(1, 2, 1, 2, onPathFound);
        easyStar.calculate();
        function onPathFound(path) {
            chai_1.expect(path).not.to.be.null;
            chai_1.expect(path.length).to.equal(0);
            done();
        }
    });
    it("It should prefer straight paths when possible", function (done) {
        var easyStar = new index_1.EasyStar();
        easyStar.setAcceptableTiles([0]);
        easyStar.enableDiagonals();
        easyStar.setGrid([
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ]);
        easyStar.findPath(0, 1, 2, 1, function (path) {
            chai_1.expect(path).not.to.be.null;
            chai_1.expect(path[1].x).to.equal(1);
            chai_1.expect(path[1].y).to.equal(1);
            done();
        });
        easyStar.calculate();
    });
    it("It should prefer diagonal paths when they are faster", function (done) {
        var easyStar = new index_1.EasyStar();
        var grid = [];
        for (var i = 0; i < 20; i++) {
            grid[i] = [];
            for (var j = 0; j < 20; j++) {
                grid[i][j] = 0;
            }
        }
        easyStar.setGrid(grid);
        easyStar.setAcceptableTiles([0]);
        easyStar.enableDiagonals();
        easyStar.findPath(4, 4, 2, 2, function (path) {
            chai_1.expect(path).not.to.be.null;
            chai_1.expect(path.length).to.equal(3);
            chai_1.expect(path[1]).to.deep.equal({ x: 3, y: 3 });
            done();
        });
        easyStar.calculate();
    });
    it("It should handle tiles with a directional condition and no corner cutting", function (done) {
        var easyStar = new index_1.EasyStar();
        easyStar.disableCornerCutting();
        var grid = [
            [0, 1, 0],
            [0, 0, 0],
            [0, 0, 0],
        ];
        easyStar.setGrid(grid);
        easyStar.enableDiagonals();
        easyStar.setAcceptableTiles([0]);
        easyStar.setDirectionalCondition(2, 1, [index_1.Directions.TOP]);
        easyStar.setDirectionalCondition(1, 1, [index_1.Directions.RIGHT]);
        easyStar.setDirectionalCondition(0, 1, [index_1.Directions.RIGHT]);
        easyStar.setDirectionalCondition(0, 0, [index_1.Directions.BOTTOM]);
        easyStar.findPath(2, 0, 0, 0, function (path) {
            chai_1.expect(path).not.to.be.null;
            chai_1.expect(path.length).to.equal(5);
            chai_1.expect(path[2]).to.deep.equal({ x: 1, y: 1 });
            done();
        });
        easyStar.calculate();
    });
    it("It should handle tiles with a directional condition", function (done) {
        var easyStar = new index_1.EasyStar();
        var grid = [
            [0, 1, 0],
            [0, 0, 0],
            [0, 0, 0],
        ];
        easyStar.setGrid(grid);
        easyStar.enableDiagonals();
        easyStar.setAcceptableTiles([0]);
        easyStar.setDirectionalCondition(2, 1, [index_1.Directions.TOP]);
        easyStar.setDirectionalCondition(1, 2, [index_1.Directions.TOP_RIGHT]);
        easyStar.setDirectionalCondition(2, 2, [index_1.Directions.LEFT]);
        easyStar.setDirectionalCondition(1, 1, [index_1.Directions.BOTTOM_RIGHT]);
        easyStar.setDirectionalCondition(0, 1, [index_1.Directions.RIGHT]);
        easyStar.setDirectionalCondition(0, 0, [index_1.Directions.BOTTOM]);
        easyStar.findPath(2, 0, 0, 0, function (path) {
            chai_1.expect(path).not.to.be.null;
            chai_1.expect(path.length).to.equal(7);
            chai_1.expect(path[3].x).to.equal(2);
            chai_1.expect(path[3].y).to.equal(2);
            done();
        });
        easyStar.calculate();
    });
});
//# sourceMappingURL=easystartest.spec.js.map