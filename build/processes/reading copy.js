"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadingProcess = void 0;
const parameters_1 = require("../parameters");
const process_1 = require("../process");
class ReadingProcess extends process_1.Process {
    constructor({ id, unit, tables, block }) {
        super({
            name: "reading",
            processTime: parameters_1.eventTimings.read_from_cache.time,
            unit,
            tables,
            block,
            id,
        });
        this.onFinish = () => {
            this.tables.units[this.unit].requestState = "readed";
            if (this.block)
                this.tables.blocks[this.block].occupe(this.unit);
        };
    }
}
exports.ReadingProcess = ReadingProcess;
