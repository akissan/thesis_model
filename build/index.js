#!/usr/bin/env node
"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuilderBlock = exports.HandlerBlock = exports.Block = exports.Process = exports.Unit = exports.builderAcceptedResponseStates = exports.handlerAcceptedResponseStates = void 0;
const prettyPrint_1 = require("./prettyPrint");
const argv_1 = require("./util/argv");
const utils_1 = require("./util/utils");
const argv = (0, argv_1.initArgs)(argv_1.argvOptions);
exports.handlerAcceptedResponseStates = [
    "new",
    "connected",
    "parsed",
    "cached",
    "readed",
    "crafted",
    "builded",
];
exports.builderAcceptedResponseStates = [
    "not_cached",
    "api_called",
];
/*
  | "new"
  | "connected"
  | "parsed"
  | "cached"
  | "readed"
  | "crafted"
  | "builded";
*/
class Unit {
    constructor() {
        this.id = (0, utils_1.uid)();
        this.state = "new";
    }
}
exports.Unit = Unit;
class Process {
    constructor({ timeLeft, onFinish, unit, name, }) {
        this.step = () => {
            // if (this.status === "")
            var _b;
            if (this.status === "processing") {
                this.timeLeft--;
                if (this.timeLeft <= 0) {
                    (_b = this.onFinish) === null || _b === void 0 ? void 0 : _b.call(this, this);
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
    constructor({ name, inputQueue, outputQueue }) {
        this.checkQueue = (queue) => {
            const unit = queue.shift();
            if (!unit)
                return;
            console.log(`I've got a ${unit.id} from queue`);
            this.decideProcess(unit);
        };
        this.shouldStay = (unit) => this.allowedOperations.includes(unit.state);
        this.decideProcess = (unit) => {
            if (this.shouldStay(unit)) {
                this.process = this.assignProcess(unit);
            }
            else {
                this.transferSomewhere(unit);
            }
        };
        this.transferSomewhere = (unit) => {
            console.log("where should i transfer " + prettyPrint_1.pp.unit(unit) + "?");
        };
        this.step = () => {
            if (this.status === "idle") {
                this.checkQueue(this.inputQueue);
            }
        };
        this.id = (0, utils_1.uid)();
        this.name = name;
        this.status = "idle";
        this.inputQueue = inputQueue;
        this.outputQueue = outputQueue;
        // if (!Block.blockTable) throw new Error("Block.blockTable is not defined");
        Block.blockTable.set(this.id, this);
    }
}
exports.Block = Block;
_a = Block;
Block.init = ({ blockTable }) => {
    _a.blockTable = blockTable;
};
class HandlerBlock extends Block {
    constructor() {
        super(...arguments);
        this.allowedOperations = [...exports.handlerAcceptedResponseStates];
        this.assignProcess = (unit) => {
            if (unit.state === "new") {
                return new Process({
                    name: "Connection",
                    timeLeft: 4,
                    unit,
                    onFinish: (process) => {
                        process.unit.state = "connected";
                    },
                });
            }
            if (unit.state === "connected") {
                return new Process({
                    name: "Parsing",
                    timeLeft: 5,
                    unit,
                    onFinish: (process) => {
                        process.unit.state = "parsed";
                    },
                });
            }
        };
    }
}
exports.HandlerBlock = HandlerBlock;
class BuilderBlock extends Block {
    constructor() {
        super(...arguments);
        this.allowedOperations = [...exports.builderAcceptedResponseStates];
        this.assignProcess = (unit) => {
            if (unit.state == "not_cached") {
                return new Process({
                    name: "Caching",
                    timeLeft: 2,
                    unit,
                    onFinish: (process) => {
                        process.unit.state = "cached";
                    },
                });
            }
        };
    }
}
exports.BuilderBlock = BuilderBlock;
const main = () => {
    const handlerQueue = [];
    const builderQueue = [];
    const blockTable = new Map();
    Block.init({ blockTable });
    const H1 = new HandlerBlock({
        name: "handler_0",
        inputQueue: handlerQueue,
        outputQueue: { builderQueue },
    });
    const B1 = new BuilderBlock({
        name: "builder_0",
        inputQueue: builderQueue,
        outputQueue: { handlerQueue },
    });
    // blockTable.set(H1.id, H1);
    const U1 = new Unit();
    handlerQueue.push(U1);
    console.log("Blocks");
    for (let t = 0; t < 10; t++) {
        for (const [blockID, block] of Block.blockTable) {
            (0, utils_1.clog)(prettyPrint_1.pp.block(block));
            block.step();
        }
    }
};
main();
