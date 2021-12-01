#!/usr/bin/env node

import { Block, BlockID, HandlerBlock } from "./blocks";
import { eventTimings, SIM_TIME } from "./parameters";
import { Process, ProcessID } from "./process";
import { ConnectionProcess } from "./processes/connection";
import { Queue, QueueID } from "./queue";
import { UnitID, Unit } from "./unit";
import { argvOptions, initArgs } from "./util/argv";

const argv = initArgs(argvOptions);
export type Argv = typeof argv;

export type GlobalTables = {
  queues: Record<QueueID, Queue>;
  units: Record<UnitID, Unit>;
  processes: Record<ProcessID, Process>;
  blocks: Record<BlockID, Block>;
};

// const unitTravelMap = (unit: Unit) => {};

const main = () => {
  let unitCount = 1;

  const processTable: GlobalTables["processes"] = {};
  const terminatedUnits: UnitID[] = [];
  const handler_queue: Queue = [];
  const blockTable: GlobalTables["blocks"] = {};

  const unitTable: GlobalTables["units"] = {
    x1: {
      id: "x1",
      status: "init",
      process: null,
      timeInSystem: 0,
      data: {},
      requestState: "init",
    },
  };

  const tables: GlobalTables = {
    queues: { handler_queue },
    units: unitTable,
    processes: processTable,
    blocks: blockTable,
  };

  new HandlerBlock({ queue: "handler_queue", tables, terminatedUnits });

  let t = 0;

  while (terminatedUnits.length !== unitCount && t < SIM_TIME) {
    for (const unitID in unitTable) {
      const unit = unitTable[unitID];
      unit.timeInSystem++;

      if (unit.status === "init") {
        const connectionProcess = new ConnectionProcess({
          unit: unitID,
          tables: tables,
          handlerQueueID: "handler_queue",
        });
      }

      if (unit.status === "processing" && unit.process) {
        const process = processTable[unit.process];
        process.step();
      }
    }

    for (const blockID in blockTable) {
      const block = blockTable[blockID];
      block.step();
    }

    console.log(t, tables);
    t++;
  }
};

main();
