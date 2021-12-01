"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Process = void 0;
const utils_1 = require("./util/utils");
class Process {
    constructor({ processTime, name, unit, tables, block, id, processData, options, onFinish, }) {
        this.state = "processing";
        this.prefinish = () => {
            var _a, _b, _c, _d, _e, _f;
            this.state = "finished";
            this.tables.units[this.unit].status = "waiting";
            this.tables.units[this.unit].process = null;
            if ((_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.onFinish) === null || _b === void 0 ? void 0 : _b.unitRequestState) {
                this.tables.units[this.unit].requestState =
                    this.options.onFinish.unitRequestState;
            }
            if ((_d = (_c = this.options) === null || _c === void 0 ? void 0 : _c.onFinish) === null || _d === void 0 ? void 0 : _d.unitStatus) {
                this.tables.units[this.unit].status = this.options.onFinish.unitStatus;
            }
            if (this.block) {
                this.tables.blocks[this.block].free();
                if ((_f = (_e = this.options) === null || _e === void 0 ? void 0 : _e.onFinish) === null || _f === void 0 ? void 0 : _f.occupeOnFinish) {
                    this.tables.queues[this.tables.blocks[this.block].inputQueue].unshift(this.unit);
                    // this.tables.queues[this.inputQueue].unshift(this.unit);
                    // const newProcess = this.tables.blocks[this.block].assignProcess?.(
                    //   this.tables.blocks[this.block],
                    //   this.unit
                    // )();
                    // if (newProcess) console.log(this.tables.processes[newProcess.id].name);
                }
            }
        };
        this.step = () => {
            if (this.state === "processing") {
                this.timeLeft -= 1;
                if (this.timeLeft <= 0) {
                    this.prefinish();
                    if (this.onFinish)
                        this.onFinish(this);
                }
            }
            return this.state;
        };
        this.id = id !== null && id !== void 0 ? id : (0, utils_1.uid)();
        this.timeLeft = processTime;
        this.name = name;
        this.unit = unit;
        this.tables = tables;
        this.block = block;
        this.processData = processData;
        this.options = options;
        this.onFinish = onFinish;
        tables.units[unit].status = "processing";
        tables.units[unit].process = this.id;
        tables.processes[this.id] = this;
        // if (this.block) {
        //   tables.blocks[this.block].occupe(this.id);
        // }
    }
}
exports.Process = Process;
