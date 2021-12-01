import chalk from "chalk";
import { GlobalTables } from ".";
import { SendingProcess } from "./processes/sending";
import { QueueID } from "./queue";
import { UnitID } from "./unit";
import { uid } from "./util/utils";

export type BlockID = string;

export type BlockStatus = "idle" | "processing";

type BaseProps = {
  tables: GlobalTables;
};

export class BaseBlock {
  currentOccupant: UnitID | null = null;
  status: BlockStatus = "idle";
  id: BlockID;
  tables: GlobalTables;
  assignProcess?: Function;
  onIdle?: Function;

  constructor({ tables }: BaseProps) {
    this.id = uid();
    this.tables = tables;
    this.tables.blocks[this.id] = this;
  }

  step = () => {
    if (this.status === "idle") {
      this.onIdle?.();
    }
  };

  occupe(unitID: UnitID) {
    this.currentOccupant = unitID;
    this.status = "processing";

    this.assignProcess?.();
  }
}

export class HandlerBlock extends BaseBlock {
  inputQueue: QueueID;
  //   time: number = 0;
  //   nextBlockID: any;

  terminatedUnits: UnitID[];

  constructor({
    queue,
    tables,
    terminatedUnits,
  }: BaseProps & {
    queue: HandlerBlock["inputQueue"];
    terminatedUnits: UnitID[];
  }) {
    super({ tables });
    this.inputQueue = queue;
    this.terminatedUnits = terminatedUnits;
  }

  assignProcess = () => {
    if (
      this.currentOccupant &&
      this.tables.units[this.currentOccupant].requestState === "connected"
    ) {
      new SendingProcess({
        unit: this.currentOccupant,
        tables: this.tables,
        terminatedUnits: this.terminatedUnits,
      });
    }
  };

  onIdle = () => {
    const inputQueue = this.tables.queues[this.inputQueue];
    const freeUnitID = inputQueue.pop();

    if (freeUnitID) {
      this.occupe(freeUnitID);
    }
  };
}

export type Block = BaseBlock | HandlerBlock;
