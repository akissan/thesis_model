#!/usr/bin/env node

import { argvOptions, initArgs } from "./argv";
import { Notes } from "./notesData";
import { log } from "./utils";

const argv = initArgs(argvOptions);
export type Argv = typeof argv;

const nm = new Notes(argv.filepath);

if (argv.newCategory) {
  nm.createNewCategory(argv);
}

if (argv.title) {
  nm.createNewNote(argv);
}

if ((!argv.title && !argv.newCategory) || argv.list) {
  log(nm.getNotes(argv));
}

nm.save();
