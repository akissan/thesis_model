#!/usr/bin/env node

import Block, { BlockID } from "./components/block";
import BuilderBlock from "./components/blocks/builder";
import HandlerBlock from "./components/blocks/handler";
import Process, { ProcessID } from "./components/process";
import { Queue } from "./components/queue";
import Unit, { UnitTable } from "./components/unit";
import { initArgs, argvOptions } from "./tools/argv";
import { pp } from "./tools/prettyPrint";
import { clog } from "./tools/utils";
import { ProcessTable, BlockTable } from "./types/tables";

const argv = initArgs(argvOptions);
export type Argv = typeof argv;

const main = () => {
  const handlerQueue: Queue = [];
  const builderQueue: Queue = [];
  const finishQueue: Queue = [];

  const processTable: ProcessTable = new Map();
  const blockTable: BlockTable = new Map();
  const unitTable: UnitTable = new Map();

  const tables = { processTable, blockTable, unitTable };
  const queues = { handlerQueue, builderQueue, finishQueue };

  Block.init({ blockTable });
  Process.init({ processTable });
  Unit.init({ unitTable });

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
  // for (let t = 0; t < 30; t++) {
  while (finishQueue.length !== Unit.unitTable.size) {
    console.log(queues);
    for (const [processID, process] of Process.processTable) {
      // clog(pp.process(process));
      process.step();
    }

    for (const [blockID, block] of Block.blockTable) {
      clog(pp.block(block));
      block.step();
    }
  }
};

main();
