"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newUnit = void 0;
const utils_1 = require("./util/utils");
const newUnit = (id) => ({
    id: id !== null && id !== void 0 ? id : (0, utils_1.uid)(),
    status: "init",
    process: null,
    timeInSystem: 0,
    data: {},
    requestState: "init",
});
exports.newUnit = newUnit;
