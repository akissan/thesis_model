"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventTimings = exports.SIM_TIME = exports.HANLDERS_COUNT = exports.BUILDER_COUNT = void 0;
const SIM_TIME = 50;
exports.SIM_TIME = SIM_TIME;
const BUILDER_COUNT = 2;
exports.BUILDER_COUNT = BUILDER_COUNT;
const HANLDERS_COUNT = 4;
exports.HANLDERS_COUNT = HANLDERS_COUNT;
const eventTimings = {
    connection_time: {
        time: 4,
    },
    request_handling: {
        time: 3,
    },
    build_time: {
        time: 12,
    },
    api_calls: {
        time: 2,
    },
    read_from_cache: {
        time: 1,
    },
    response_crafting: {
        time: 2,
    },
    response_receiving: {
        time: 4,
    },
};
exports.eventTimings = eventTimings;
