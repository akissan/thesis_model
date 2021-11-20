#!/usr/bin/env node
import chalk from "chalk";
import { ArgsOptions, initArgs } from "./argv";
import { Task, TasksData } from "./tasks";
import { log } from "./utils";

const argvOptions: ArgsOptions = {
  n: { type: "string" },
  c: { type: "string" },
  d: { type: "string" },
};

const argv = initArgs(argvOptions);

export type Argv = typeof argv;
