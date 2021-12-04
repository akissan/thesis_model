"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../tools/utils");
class Process {
    constructor({ timeLeft, onFinish, unit, name, parentBlock, }) {
        this.baseFinish = (process) => { var _b; return (_b = process.parentBlock) === null || _b === void 0 ? void 0 : _b.onProcessFinish(process); };
        this.step = () => {
            // if (this.status === "")
            var _b;
            if (this.status === "processing") {
                this.timeLeft--;
                if (this.timeLeft < 0) {
                    this.status = "finished";
                    (_b = this.onFinish) === null || _b === void 0 ? void 0 : _b.call(this, this);
                    this.baseFinish(this);
                }
            }
        };
        this.id = (0, utils_1.uid)();
        this.status = "processing";
        this.timeLeft = timeLeft;
        this.onFinish = onFinish;
        this.unit = unit;
        this.name = name;
        this.parentBlock = parentBlock;
        Process.processTable.set(this.id, this);
    }
}
exports.default = Process;
_a = Process;
Process.init = ({ processTable, }) => {
    _a.processTable = processTable;
};
