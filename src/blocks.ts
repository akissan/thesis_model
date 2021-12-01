import chalk from "chalk";
import { GlobalTables } from ".";
import { ParsingProcess } from "./processes/parsing";
import { SendingProcess } from "./processes/sending";
import { QueueID } from "./queue";
import { UnitID } from "./unit";
import { uid } from "./util/utils";

export type BlockID = string;

export type BlockStatus = "idle" | "processing";

type BaseProps = {
  id?: BlockID;
  tables: GlobalTables;
};

export class BaseBlock {
  currentOccupant: UnitID | null = null;
  status: BlockStatus = "idle";
  id: BlockID;
  tables: GlobalTables;
  assignProcess?: Function;
  onIdle?: Function;

  constructor({ tables, id }: BaseProps) {
    this.id = id ?? uid();
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

    this.assignProcess?.(unitID);
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
    id,
  }: BaseProps & {
    queue: HandlerBlock["inputQueue"];
    terminatedUnits: UnitID[];
  }) {
    super({ tables, id });
    this.inputQueue = queue;
    this.terminatedUnits = terminatedUnits;
  }

  assignProcess = (unit: UnitID) => {
    const { requestState } = this.tables.units[unit];

    if (requestState === "connected") {
      new ParsingProcess({
        unit,
        tables: this.tables,
        block: this.id,
      });
    }

    if (requestState === "readed") {
      new SendingProcess({
        unit,
        tables: this.tables,
        terminatedUnits: this.terminatedUnits,
        block: this.id,
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
