"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
