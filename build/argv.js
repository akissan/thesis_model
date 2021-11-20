"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initArgs = exports.argvOptions = void 0;
const yargs_1 = __importDefault(require("yargs"));
const utils_1 = require("./utils");
exports.argvOptions = {
    title: { type: "string", alias: "n" },
    category: { type: "string", alias: "c", default: "" },
    details: { type: "string", alias: "d", default: "" },
    force: { type: "boolean", alias: "f", default: false },
    filepath: { type: "string", alias: "p" },
    list: { type: "string", alias: "l" },
    id: { type: "string", alias: "i" },
    newCategory: { type: "string", alias: "C" },
};
const initArgs = (options) => {
    const args = (0, yargs_1.default)(process.argv.slice(2)).options(options).parseSync();
    (0, utils_1.log)("ARGS: ", args);
    return args;
};
exports.initArgs = initArgs;
