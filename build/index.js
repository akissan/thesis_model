#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = __importDefault(require("fs"));
const yargs_1 = __importDefault(require("yargs"));
const tasks_1 = require("./tasks");
const argv = (0, yargs_1.default)(process.argv.slice(2))
    .options({
    n: { type: "string" },
    c: { type: "string" },
    d: { type: "string" },
})
    .parseSync();
console.log("argv", argv);
const log = console.log;
let rawData = fs_1.default.readFileSync("./tasks.json");
let tasksData = JSON.parse(rawData.toString());
//log(tasksData);
for (const categoryID in tasksData.categories) {
    const category = tasksData.categories[categoryID];
    log(chalk_1.default.blue(category.name));
    log(category);
    // log
}
console.log(tasksData.tasks);
const parseArgs = (args) => {
    if (argv.n) {
        const task = new tasks_1.Task({ title: argv.n, details: argv.d, category: argv.c });
        if (argv.c) {
            const category = tasksData.categories[argv.c];
            if (category) {
                category.tasks.push(task.id);
            }
            else {
                return console.error("There is no such category...");
            }
        }
        tasksData.tasks[task.id] = task;
    }
};
fs_1.default.writeFileSync("./tasks.json", JSON.stringify(tasksData));
