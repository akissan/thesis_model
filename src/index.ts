#!/usr/bin/env node
import { notStrictEqual } from "assert";
import chalk from "chalk";
import { argvOptions, initArgs } from "./argv";
import { Note, NotesData } from "./notes";
import { Notes } from "./tasksData";
import { log } from "./utils";

const argv = initArgs(argvOptions);
export type Argv = typeof argv;

const nm = new Notes(argv.filepath);

if (argv.title) {
  nm.createNewNote(argv);
}

if (!argv.title || argv.list) {
  log(nm.getNotes(argv));
}

nm.save();
