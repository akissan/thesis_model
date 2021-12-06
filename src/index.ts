#!/usr/bin/env node

import chalk from "chalk";
import Block from "./components/block";
import BuilderBlock from "./components/blocks/builder";
import HandlerBlock from "./components/blocks/handler";
import Entity from "./components/entity";
import Process from "./components/process";
import { Queue } from "./components/queue";
import Unit, { UnitTable } from "./components/unit";
import {
  BUILDER_COUNT,
  HANLDERS_COUNT,
  INITIAL_UNIT_COUNT,
} from "./parameters";
import { Statserver } from "./statserver";
import { argvOptions, initArgs } from "./tools/argv";
import { pp, tableMap } from "./tools/prettyPrint";
import { clog, Repeat } from "./tools/utils";
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
  const handlerQueue: Queue = new Queue({ options: { id: "H_QUEUE" } });
  const builderQueue: Queue = new Queue({ options: { id: "B_QUEUE" } });
  const finishQueue: Queue = new Queue({
    options: {
      id: "F_QUEUE",
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

  Repeat(INITIAL_UNIT_COUNT, (_, idx) => {
    new Unit({ id: `UNIT_${idx}` });
  });

  const handlers: HandlerBlock[] = [];
  const builders: BuilderBlock[] = [];

  console.log(Array(HANLDERS_COUNT).map((_) => "1"));

  Repeat(HANLDERS_COUNT, (_, idx) => {
    new HandlerBlock({
      id: `HANDLER_${idx}`,
      name: `handler_${idx}`,
      inputQueue: handlerQueue,
      outputQueue: { builderQueue, finishQueue },
    });
  });

  Repeat(BUILDER_COUNT, (_, idx) => {
    new BuilderBlock({
      id: `BUILDER_${idx}`,
      name: `builder_${idx}`,
      inputQueue: builderQueue,
      outputQueue: { handlerQueue },
    });
  });

  Unit.table.forEach((Unit) => {
    handlerQueue.push(Unit);
  });

  clogCurrentTables();
  let t = 0;
  while (finishQueue.length !== Unit.table.size) {
    console.log(chalk.yellow.bold(t));
    // clog(pp.block(B1));

    for (const [processID, process] of Process.table) {
      if (
        process.name === "Parsing" &&
        process.unit.id === "UNIT_1" &&
        process.status === "processing"
      )
        console.log("Parsing U1");
      process.step();
    }

    for (const [blockID, block] of Block.table) {
      block.step();
    }

    clogCurrentTables({
      logBlocks: true,
      logProcesses: true,
      logUnits: true,
    });

    t++;
    Statserver.tick();
  }

  clog(chalk.bgWhite.black("-".repeat(32) + " FINISH " + "-".repeat(32)));
  Unit.table.forEach((unit) => clog(pp.unit(unit)));
  Block.table.forEach((block) => clog(pp.block(block)));

  console.dir(Statserver.event_table, { depth: 4 });

  Statserver.event_table.processMap.byUnit["UNIT_0"].forEach(
    ({ processID, time }) => {
      clog(
        chalk.yellow(time.toString().padStart(2)) +
          " " +
          chalk.blue(Process.table.get(processID)?.name)
      );
    }
  );
};

main();
