"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pp = void 0;
const chalk_1 = __importDefault(require("chalk"));
const randomColors = [
    // chalk.greenBright,
    chalk_1.default.yellow,
    // chalk.black,
    // chalk.blueBright,
    chalk_1.default.cyan,
    chalk_1.default.green,
    chalk_1.default.white,
    chalk_1.default.blue,
];
const colorTable = {};
const rndClr = (str = "") => {
    if (!colorTable[str]) {
        let ri = Math.floor(Math.random() * randomColors.length);
        colorTable[str] = randomColors[ri];
    }
    return chalk_1.default.bgBlackBright(colorTable[str](str));
};
const block = ({ id, name, process, status }) => {
    var _a;
    const info = [chalk_1.default.greenBright("Block  ")];
    info.push(rndClr(id).padStart(6));
    info.push(chalk_1.default.green(name).padStart(8));
    info.push(chalk_1.default.blue((_a = process === null || process === void 0 ? void 0 : process.name) !== null && _a !== void 0 ? _a : " ").padStart(20));
    info.push((status === "idle" ? chalk_1.default.gray : chalk_1.default.greenBright)(status));
    return info.join(" ");
};
const unit = ({ id, state }) => {
    const info = [chalk_1.default.magenta("Unit  ")];
    info.push(rndClr(id));
    info.push(chalk_1.default.greenBright(state));
    return info.join(" ");
};
const process = ({ id, name, status, timeLeft, unit }) => {
    const info = [chalk_1.default.blue("Process")];
    info.push(rndClr(id));
    info.push(chalk_1.default.blue(name !== null && name !== void 0 ? name : " ").padStart(20));
    info.push(chalk_1.default.yellowBright(timeLeft).padStart(3));
    return info.join(" ");
};
exports.pp = { block, unit, process };
