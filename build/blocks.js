"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseBlock = void 0;
const utils_1 = require("./util/utils");
class BaseBlock {
    constructor({ tables, id, blockData, assignProcess, onIdle, inputQueue, }) {
        this.status = "idle";
        this.step = () => {
            var _a;
            if (this.status === "idle") {
                (_a = this.onIdle) === null || _a === void 0 ? void 0 : _a.call(this, this);
            }
        };
        this.id = id !== null && id !== void 0 ? id : (0, utils_1.uid)();
        this.tables = tables;
        this.tables.blocks[this.id] = this;
        this.blockData = blockData;
        this.assignProcess = assignProcess;
        this.onIdle = onIdle;
        this.inputQueue = inputQueue;
        // console.log(blockData);
    }
    occupe(processID) {
        this.status = "processing";
        this.process = processID;
    }
    free() {
        this.status = "idle";
        this.process = undefined;
    }
}
exports.BaseBlock = BaseBlock;
