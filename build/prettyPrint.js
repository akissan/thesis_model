"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pp = void 0;
const chalk_1 = __importDefault(require("chalk"));
const randomColors = [
    chalk_1.default.greenBright,
    chalk_1.default.yellowBright,
    chalk_1.default.magentaBright,
    chalk_1.default.blueBright,
    chalk_1.default.cyanBright,
];
const colorTable = {};
const rndClr = (str = "") => {
    if (!colorTable[str]) {
        let ri = Math.floor(Math.random() * randomColors.length);
        colorTable[str] = randomColors[ri];
    }
    return colorTable[str](str);
};
const block = (block) => {
    var _a, _b;
    const info = [];
    info.push(chalk_1.default.yellow(block.id).padStart(6));
    info.push(chalk_1.default.green(block.name).padStart(8));
    info.push(chalk_1.default.redBright((_b = (_a = block.process) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : " ").padStart(20));
    info.push((block.status === "idle" ? chalk_1.default.gray : chalk_1.default.greenBright)(block.status));
    return info.join(" ");
};
const unit = (unit) => {
    const info = [];
    info.push(chalk_1.default.yellowBright(unit.id));
    info.push(chalk_1.default.greenBright(unit.state));
    return info.join(" ");
};
exports.pp = { block, unit };
