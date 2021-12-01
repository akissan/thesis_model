"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = exports.logError = exports.uid = void 0;
const chalk_1 = __importDefault(require("chalk"));
const crypto_1 = __importDefault(require("crypto"));
const util_1 = require("util");
const uid = () => {
    return crypto_1.default.randomBytes(3).toString("hex");
};
exports.uid = uid;
const logError = (err) => {
    if (global.VERBOSE) {
        const inspection = (0, util_1.inspect)(err, { colors: true, compact: false }).split("\n");
        console.error(chalk_1.default.bold.red(inspection[0]));
        console.error(inspection.slice(1, -1).join("\n"));
    }
    else {
        console.error(chalk_1.default.bold.red(err));
    }
};
exports.logError = logError;
exports.log = console.log;
