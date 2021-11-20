"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const utils_1 = require("./utils");
class Task {
    constructor(taskInitData) {
        this.title = "";
        this.details = "";
        this.id = "0";
        this.category = "";
        Object.assign(this, taskInitData);
        this.id = (0, utils_1.uid)();
    }
}
exports.Task = Task;
