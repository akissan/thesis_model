"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyState = exports.initState = void 0;
const parameters_1 = require("./parameters");
const process_1 = require("./process");
const request_queue = [];
const build_queue = [];
exports.initState = {
    cache: {},
    build_queue,
    request_queue,
    builders: Array(parameters_1.BUILDER_COUNT).fill(new process_1.ProcessingBlock({
        processTime: parameters_1.eventTimings.build_time,
        queue: request_queue,
    })),
    handlers: Array(parameters_1.HANLDERS_COUNT).fill(new process_1.ProcessingBlock({
        processTime: parameters_1.eventTimings.request_handling,
        queue: request_queue,
    })),
};
const copyState = (state) => (Object.assign({}, state));
exports.copyState = copyState;
// export { Queue, ProcessingBlock };
