"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const prettyPrint_1 = require("../tools/prettyPrint");
const utils_1 = require("../tools/utils");
class Block {
    constructor({ name, inputQueue, outputQueue }) {
        this.step = () => {
            if (this.status === "idle") {
                this.checkQueue(this.inputQueue);
            }
        };
        this.checkQueue = (queue) => {
            const unit = queue.shift();
            if (!unit)
                return;
            console.log(`I've got a ${unit.id} from queue`);
            this.decideProcess(unit);
        };
        this.onProcessFinish = (process) => {
            this.decideProcess(process.unit);
        };
        this.shouldStay = (unit) => this.allowedOperations.includes(unit.state);
        this.decideProcess = (unit) => {
            if (this.shouldStay(unit)) {
                this.process = this.assignProcess(unit);
            }
            else {
                this.process = undefined;
                this.transferSomewhere(unit);
            }
        };
        this.transferSomewhere = (unit) => {
            var _b;
            console.log("where should i transfer " + prettyPrint_1.pp.unit(unit) + "?");
            (_b = this.decideTransfer(unit)) === null || _b === void 0 ? void 0 : _b.push(unit);
        };
        this.id = (0, utils_1.uid)();
        this.name = name;
        this.status = "idle";
        this.inputQueue = inputQueue;
        this.outputQueue = outputQueue;
        Block.blockTable.set(this.id, this);
    }
    get process() {
        return this._process;
    }
    set process(p) {
        this._process = p;
        this.status = p === undefined ? "idle" : "processing";
    }
}
exports.default = Block;
_a = Block;
Block.init = ({ blockTable }) => {
    _a.blockTable = blockTable;
};
