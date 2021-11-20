"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = exports.uid = void 0;
const crypto_1 = __importDefault(require("crypto"));
const uid = () => {
    return crypto_1.default.randomBytes(3).toString("hex");
};
exports.uid = uid;
exports.log = console.log;
