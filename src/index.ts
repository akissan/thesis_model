#!/usr/bin/env node

import chalk from "chalk";
import Block from "./components/block";
import BuilderBlock from "./components/blocks/builder";
import HandlerBlock from "./components/blocks/handler";
import Entity from "./components/entity";
import Process from "./components/process";
import { Queue } from "./components/queue";
import Unit, { UnitTable } from "./components/unit";
import { argvOptions, initArgs } from "./tools/argv";
import { tableMap } from "./tools/prettyPrint";
import { clog } from "./tools/utils";
import { BlockTable, ProcessTable } from "./types/tables";

const argv = initArgs(argvOptions);
const { id_length } = argv;
export type Argv = typeof argv;

export const GLOBAL_OPTIONS = {
  id_length,
};

export type clogCurrentTablesOptions = {
  logInactiveProcesses: boolean;
};
const clogCurrentTables = (
  options: clogCurrentTablesOptions = { logInactiveProcesses: false }
) => {
  clog(chalk.greenBright("Blocks:\n") + tableMap(Block.table, options));
  clog(chalk.blueBright("Processes: \n") + tableMap(Process.table, options));
  clog(chalk.magentaBright("Units: \n") + tableMap(Unit.table, options));
};

const main = () => {
  const handlerQueue: Queue = [];
  const builderQueue: Queue = [];
  const finishQueue: Queue = [];

  const processTable: ProcessTable = new Map();
  const blockTable: BlockTable = new Map();
  const unitTable: UnitTable = new Map();

  Entity.init({ ...GLOBAL_OPTIONS });

  Block.setTable(blockTable);
  Process.setTable(processTable);
  Unit.setTable(unitTable);

  const U1 = new Unit();

  const H1 = new HandlerBlock({
    name: "handler_0",
    inputQueue: handlerQueue,
    outputQueue: { builderQueue, finishQueue },
  });

  const B1 = new BuilderBlock({
    name: "builder_0",
    inputQueue: builderQueue,
    outputQueue: { handlerQueue },
  });

  H1.inputQueue.push(U1);

  console.log("Blocks");

  clogCurrentTables();
  let t = 0;
  while (finishQueue.length !== Unit.table.size) {
    clogCurrentTables();
    for (const [processID, process] of Process.table) {
      process.step();
    }
    for (const [blockID, block] of Block.table) {
      block.step();
    }
    t++;
  }
};

main();
