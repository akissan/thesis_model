import chalk from "chalk";
import { GlobalTables } from ".";
import { SendingProcess } from "./processes/sending";
import { QueueID } from "./queue";
import { UnitID } from "./unit";
import { uid } from "./util/utils";

export type BlockID = string;

export type BlockStatus = "idle" | "processing";

export class HandlerBlock {
  currentOccupant: UnitID | null = null;
  inputQueue: QueueID;
  time: number = 0;
  status: BlockStatus = "idle";
  nextBlockID: any;
  id: BlockID;
  tables: GlobalTables;

  terminatedUnits: UnitID[];
  //   process:
  //     | null
  //     | "parsing"
  //     | "cache_reading"
  //     | "response_crafting"
  //     | "response_receiving";

  constructor({
    queue,
    tables,
    terminatedUnits,
  }: {
    queue: HandlerBlock["inputQueue"];
    tables: GlobalTables;
    terminatedUnits: UnitID[];
  }) {
    this.inputQueue = queue;
    this.id = uid();
    this.tables = tables;
    this.tables.blocks[this.id] = this;
    this.terminatedUnits = terminatedUnits;
  }

  occupe(unitID: UnitID) {
    // this.tables.units[unitID].process = "processing";
    this.currentOccupant = unitID;
    this.status = "processing";

    new SendingProcess({
      unit: unitID,
      tables: this.tables,
      terminatedUnits: this.terminatedUnits,
    });
  }

  step = () => {
    if (this.status === "idle") {
      const inputQueue = this.tables.queues[this.inputQueue];
      const freeUnitID = inputQueue.pop();

      if (freeUnitID) {
        console.log(freeUnitID);
        this.occupe(freeUnitID);
      }
    }
  };
}

export type Block = HandlerBlock;
