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
exports.SendingProcess = void 0;
const parameters_1 = require("../parameters");
const process_1 = require("../process");
const SendingProcess = (_a) => {
    var { additionalData } = _a, baseProps = __rest(_a, ["additionalData"]);
    return new process_1.Process(Object.assign(Object.assign({}, baseProps), { name: "sending", processTime: parameters_1.eventTimings.response_receiving.time, processData: additionalData, options: {
            onFinish: {
                unitRequestState: "received",
                unitStatus: "finished",
            },
        }, onFinish: (process) => {
            process.processData.terminatedUnits.push(process.unit);
        } }));
};
exports.SendingProcess = SendingProcess;
