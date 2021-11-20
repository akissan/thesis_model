"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Note = void 0;
const utils_1 = require("./utils");
class Note {
    constructor(noteInitData) {
        this.title = "";
        this.details = "";
        this.id = "0";
        this.category = "";
        Object.assign(this, noteInitData);
        this.id = (0, utils_1.uid)();
    }
}
exports.Note = Note;
