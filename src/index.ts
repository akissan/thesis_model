#!/usr/bin/env node

import { HandlerBlock } from "./block/handlerBlock";
import { Block, BlockID } from "./blocks";

import { eventTimings, SIM_TIME } from "./parameters";
import { getActiveProcessesLog } from "./prettyPrint";
import { Process, ProcessID } from "./process";
import { ConnectionProcess } from "./processes/connection";
import { Queue, QueueID } from "./queue";
import { UnitID, Unit, newUnit } from "./unit";
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
  const processTable: GlobalTables["processes"] = {};
  const terminatedUnits: UnitID[] = [];
  const handler_queue: Queue = [];
  const blockTable: GlobalTables["blocks"] = {};

  const unitTable: GlobalTables["units"] = {
    x1: newUnit("x1"),
    x2: newUnit("x2"),
    // x3: newUnit("x3"),
  };

  let unitCount = Object.keys(unitTable).length;

  const tables: GlobalTables = {
    queues: { handler_queue },
    units: unitTable,
    processes: processTable,
    blocks: blockTable,
  };

  const H1 = HandlerBlock(
    {
      id: "H1",
      tables,
    },
    {
      inputQueue: "handler_queue",
      terminatedUnits,
    }
  );
  const H2 = HandlerBlock(
    {
      id: "H2",
      tables,
    },
    {
      inputQueue: "handler_queue",
      terminatedUnits,
    }
  );

  let t = 0;

  while (terminatedUnits.length !== unitCount && t < SIM_TIME) {
    for (const unitID in unitTable) {
      const unit = unitTable[unitID];
      unit.timeInSystem++;

      if (unit.status === "init") {
        ConnectionProcess({
          unit: unitID,
          tables,
          additionalData: {
            handlerQueueID: "handler_queue",
          },
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

    // console.log(t, tables);
    console.log(t.toString().padStart(4), getActiveProcessesLog(tables));
    t++;
  }
};

main();
