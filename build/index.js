#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const block_1 = __importDefault(require("./components/block"));
const builder_1 = __importDefault(require("./components/blocks/builder"));
const handler_1 = __importDefault(require("./components/blocks/handler"));
const process_1 = __importDefault(require("./components/process"));
const unit_1 = __importDefault(require("./components/unit"));
const argv_1 = require("./tools/argv");
const prettyPrint_1 = require("./tools/prettyPrint");
const utils_1 = require("./tools/utils");
const argv = (0, argv_1.initArgs)(argv_1.argvOptions);
const main = () => {
    const handlerQueue = [];
    const builderQueue = [];
    const finishQueue = [];
    const processTable = new Map();
    const blockTable = new Map();
    const unitTable = new Map();
    const tables = { processTable, blockTable, unitTable };
    const queues = { handlerQueue, builderQueue, finishQueue };
    block_1.default.init({ blockTable });
    process_1.default.init({ processTable });
    unit_1.default.init({ unitTable });
    const U1 = new unit_1.default();
    const H1 = new handler_1.default({
        name: "handler_0",
        inputQueue: handlerQueue,
        outputQueue: { builderQueue, finishQueue },
    });
    const B1 = new builder_1.default({
        name: "builder_0",
        inputQueue: builderQueue,
        outputQueue: { handlerQueue },
    });
    H1.inputQueue.push(U1);
    console.log("Blocks");
    // for (let t = 0; t < 30; t++) {
    while (finishQueue.length !== unit_1.default.unitTable.size) {
        console.log(queues);
        for (const [processID, process] of process_1.default.processTable) {
            // clog(pp.process(process));
            process.step();
        }
        for (const [blockID, block] of block_1.default.blockTable) {
            (0, utils_1.clog)(prettyPrint_1.pp.block(block));
            block.step();
        }
    }
};
main();
