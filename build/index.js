#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Block = exports.Process = exports.Unit = void 0;
const argv_1 = require("./util/argv");
const utils_1 = require("./util/utils");
const argv = (0, argv_1.initArgs)(argv_1.argvOptions);
// "";
class Unit {
    constructor() {
        this.id = (0, utils_1.uid)();
    }
}
exports.Unit = Unit;
class Process {
    constructor({ timeLeft, onFinish, unit, name, }) {
        this.step = () => {
            var _a;
            if (this.status === "processing") {
                this.timeLeft--;
                if (this.timeLeft <= 0) {
                    (_a = this.onFinish) === null || _a === void 0 ? void 0 : _a.call(this, this);
                    // this.parentBlock?.onProcessFinishs
                }
            }
        };
        this.id = (0, utils_1.uid)();
        this.status = "processing";
        this.timeLeft = timeLeft;
        this.onFinish = onFinish;
        this.unit = unit;
        this.name = name;
    }
}
exports.Process = Process;
class Block {
    constructor({ name }) {
        this.id = (0, utils_1.uid)();
        this.name = name;
        this.status = "idle";
    }
}
exports.Block = Block;
const main = () => {
    const handlerQueue = [];
    const builderQueue = [];
    const H1 = new Block({ name: "handler_0" });
    const B1 = new Block({ name: "builder_0" });
    const U1 = new Unit();
    handlerQueue.push(U1);
};
