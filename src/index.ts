#!/usr/bin/env node

import { argvOptions, initArgs } from "./util/argv";
import { Notes } from "./notes/Notes";
import { log, logError } from "./util/utils";

const argv = initArgs(argvOptions);
export type Argv = typeof argv;

const nm = new Notes(argv.filepath);

try {
  if (argv.newCategory) {
    nm.createNewCategory(argv);
  }

  if (argv.title) {
    nm.createNewNote(argv);
  }

  if ((!argv.title && !argv.newCategory) || argv.list) {
    log(nm.getNotes(argv));
  }
} catch (e) {
  logError(e);
}

nm.save();
