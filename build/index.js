#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const argv_1 = require("./argv");
const tasksData_1 = require("./tasksData");
const utils_1 = require("./utils");
const argv = (0, argv_1.initArgs)(argv_1.argvOptions);
const nm = new tasksData_1.Notes(argv.filepath);
if (argv.title) {
    nm.createNewNote(argv);
}
if (!argv.title || argv.list) {
    (0, utils_1.log)(nm.getNotes(argv));
}
nm.save();
