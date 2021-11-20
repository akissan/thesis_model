"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.appData = void 0;
const appName = "cli_notes";
const defaultFileName = "notes.json";
const userAppData = (_a = process.env.APPDATA) !== null && _a !== void 0 ? _a : (process.platform == "darwin"
    ? process.env.HOME + "/Library/Preferences"
    : process.env.HOME + "/.local/share");
exports.appData = `${userAppData}/${appName}/${defaultFileName}`;
