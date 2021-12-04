"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParsingProcess = void 0;
const parameters_1 = require("../parameters");
const process_1 = require("../process");
const pageInCache = (unit) => {
    return false;
};
const ParsingProcess = (_a) => {
    var { additionalData } = _a, baseProps = __rest(_a, ["additionalData"]);
    return new process_1.Process(Object.assign(Object.assign({}, baseProps), { name: "parsing", processTime: parameters_1.eventTimings.request_handling.time, options: {
            onFinish: {
                // occupeOnFinish: true,
                unitRequestState: "parsed",
            },
        }, processData: additionalData, onFinish: (process) => {
            if (pageInCache(process.unit)) {
                process.tables.units[process.unit].status = "waiting";
                process.tables.queues[process.processData.handler_queue].push(process.unit);
            }
            else {
                process.tables.units[process.unit].status = "waiting";
                process.tables.queues[process.processData.builder_queue].push(process.unit);
            }
        } }));
};
exports.ParsingProcess = ParsingProcess;
