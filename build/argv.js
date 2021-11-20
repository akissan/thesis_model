"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initArgs = void 0;
const yargs_1 = __importDefault(require("yargs"));
const initArgs = (options) => {
    const argv = (0, yargs_1.default)(process.argv.slice(2)).options(options).parseSync();
    return argv;
};
exports.initArgs = initArgs;
