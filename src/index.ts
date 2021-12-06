#!/usr/bin/env node

import chalk from "chalk";
import Block from "./components/block";
import Entity from "./components/entity";
import Process from "./components/process";
import Queue from "./components/queue";
import Unit, { UnitTable } from "./components/unit";
import init from "./init";
import {
  INITIAL_UNIT_COUNT,
  HANLDERS_COUNT,
  BUILDER_COUNT,
} from "./parameters";
import { Statserver } from "./statserver";
import { argvOptions, initArgs } from "./tools/argv";
import { clogTables, pp } from "./tools/prettyPrint";
import { clog } from "./tools/utils";
import { BlockTable, ProcessTable } from "./types/tables";

const argv = initArgs(argvOptions);
const { id_length } = argv;
export type Argv = typeof argv;

export const GLOBAL_OPTIONS = {
  id_length,
};

const main = () => {
  const { builderQueue, finishQueue, handlerQueue } = init.queues();
  const { blockTable, processTable, unitTable } = init.tables();

  Entity.init({ ...GLOBAL_OPTIONS });

  init.assignTables(
    { blockTable, processTable, unitTable },
    { block: Block, process: Process, unit: Unit }
  );

  init.spawnUnits(INITIAL_UNIT_COUNT);

  init.spawnHandlers(HANLDERS_COUNT, {
    builderQueue,
    finishQueue,
    handlerQueue,
  });

  init.spawnBuilders(BUILDER_COUNT, {
    builderQueue,
    handlerQueue,
  });

  Unit.table.forEach((Unit) => {
    handlerQueue.push(Unit);
  });

  clogTables({
    blockTable: Block.table,
    processTable: Process.table,
    unitTable: Unit.table,
  });
  let t = 0;
  while (finishQueue.length !== Unit.table.size) {
    clog(chalk.yellow.bold(`${"-".repeat(32)} ${t}  ${"-".repeat(32)}`));

    for (const [_, process] of Process.table) process.step();
    for (const [_, block] of Block.table) block.step();

    clogTables(
      {
        blockTable: Block.table,
        processTable: Process.table,
        unitTable: Unit.table,
      },
      {
        logBlocks: true,
        logProcesses: true,
        logUnits: true,
      }
    );

    t++;
    Statserver.tick();
  }

  clog(chalk.bgWhite.black(`${"-".repeat(32)} FINISH  ${"-".repeat(32)}`));
  Unit.table.forEach((unit) => clog(pp.unit(unit)));
  Block.table.forEach((block) => clog(pp.block(block)));
  console.dir(Statserver.event_table, { depth: 4 });
};

main();
