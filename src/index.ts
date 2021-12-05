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
import { pp, tableMap } from "./tools/prettyPrint";
import { clog } from "./tools/utils";
import { BlockTable, ProcessTable } from "./types/tables";

const argv = initArgs(argvOptions);
const { id_length } = argv;
export type Argv = typeof argv;

export const GLOBAL_OPTIONS = {
  id_length,
};

export type clogCurrentTablesOptions = {
  logInactiveProcesses?: boolean;
  logBlocks?: boolean;
  logProcesses?: boolean;
  logUnits?: boolean;
};

const clogCurrentTables = ({
  logBlocks = true,
  logInactiveProcesses = undefined,
  logUnits = true,
  logProcesses = true,
}: clogCurrentTablesOptions = {}) => {
  const options = { logInactiveProcesses };
  if (logBlocks)
    clog(chalk.greenBright("Blocks:\n") + tableMap(Block.table, options));
  if (logProcesses)
    clog(chalk.blueBright("Processes: \n") + tableMap(Process.table, options));
  if (logUnits)
    clog(chalk.magentaBright("Units: \n") + tableMap(Unit.table, options));
};

const main = () => {
  const handlerQueue: Queue = new Queue();
  const builderQueue: Queue = new Queue();
  const finishQueue: Queue = new Queue({
    options: {
      onPush: (unit) =>
        clog(chalk.white(`[F] Unit ${chalk.yellow(unit.id)} finished!`)),
    },
  });

  const processTable: ProcessTable = new Map();
  const blockTable: BlockTable = new Map();
  const unitTable: UnitTable = new Map();

  Entity.init({ ...GLOBAL_OPTIONS });

  Block.setTable(blockTable);
  Process.setTable(processTable);
  Unit.setTable(unitTable);

  const U1 = new Unit();
  const U2 = new Unit();
  const U3 = new Unit();
  const U4 = new Unit();

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

  Unit.table.forEach((Unit) => {
    handlerQueue.push(Unit);
  });

  console.log("Blocks");
  clogCurrentTables();
  console.log("H1 InputQueue", H1.inputQueue);
  let t = 0;
  while (finishQueue.length !== Unit.table.size) {
    clog(pp.block(B1));

    // clogCurrentTables({
    //   logBlocks: false,
    //   logProcesses: true,
    //   logUnits: false,
    // });
    for (const [processID, process] of Process.table) {
      process.step();
    }
    for (const [blockID, block] of Block.table) {
      block.step();
    }
    t++;
  }

  console.log(
    chalk.bgWhite.black("-".repeat(32) + " FINISH " + "-".repeat(32))
  );
  Unit.table.forEach((unit) => clog(pp.unit(unit)));
  Block.table.forEach((block) => clog(pp.block(block)));
};

main();
