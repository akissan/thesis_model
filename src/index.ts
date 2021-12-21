#!/usr/bin/env node

import chalk from "chalk";
import Block from "./components/block";
import Entity from "./components/entity";
import Process from "./components/process";
import Unit from "./components/unit";
import init from "./init";
import {
  BUILDER_COUNT,
  HANLDERS_COUNT,
  INITIAL_UNIT_COUNT,
} from "./parameters";
import { Statserver } from "./statserver";
import { argvOptions, initArgs } from "./tools/argv";
import { clogTables, pp } from "./tools/prettyPrint";
import { clog } from "./tools/utils";

const argv = initArgs(argvOptions);
const { id_length, builders, handlers, units } = argv;
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

  init.spawnUnits(units ?? INITIAL_UNIT_COUNT);

  init.spawnHandlers(handlers ?? HANLDERS_COUNT, {
    builderQueue,
    finishQueue,
    handlerQueue,
  });

  init.spawnBuilders(builders ?? BUILDER_COUNT, {
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

  const simStartTime = performance.now();
  // console.time("SIMTIME");
  while (finishQueue.length !== Unit.table.size) {
    if (global.VERBOSE)
      clog(chalk.yellow.bold(`${"-".repeat(32)} ${t}  ${"-".repeat(32)}`));

    for (const [_, process] of Process.table) process.step();
    for (const [_, block] of Block.table) block.step();

    if (global.VERBOSE)
      clogTables(
        {
          blockTable: Block.table,
          processTable: Process.table,
          unitTable: Unit.table,
        },
        {
          logUnits: false,
        }
      );

    t++;
    Statserver.tick();
  }
  const simEndTime = performance.now();

  clog(chalk.bgWhite.black(`${"-".repeat(32)} FINISH  ${"-".repeat(32)}`));
  Unit.table.forEach((unit) => clog(pp.unit(unit)));
  Block.table.forEach((block) => clog(pp.block(block)));
  console.dir(Statserver.event_table, { depth: 4 });
  clog(`SIMTIME: ${simEndTime - simStartTime} ms`);
};

main();
