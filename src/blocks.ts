import chalk from "chalk";
import { GlobalTables } from ".";
import { HandlerBlock } from "./block/handlerBlock";
import { Process } from "./process";
import { CraftingProcess } from "./processes/crafting";
import { ParsingProcess } from "./processes/parsing";
import { ReadingProcess } from "./processes/reading";
import { SendingProcess } from "./processes/sending";
import { QueueID } from "./queue";
import { Unit, UnitID } from "./unit";
import { uid } from "./util/utils";

export type BlockID = string;

export type BlockStatus = "idle" | "processing";

export type BlockStateMachine = Record<Unit["requestState"], () => Process>;

export type BaseBlockProps = {
  id?: BaseBlock["id"];
  tables: BaseBlock["tables"];
};

export class BaseBlock {
  currentOccupant: UnitID | null = null;
  status: BlockStatus = "idle";
  id: BlockID;
  tables: GlobalTables;
  blockData?: any;
  onIdle?: Function;
  assignProcess?: (block: BaseBlock, unitID: UnitID) => Process;

  constructor({
    tables,
    id,
    blockData,
    assignProcess,
    onIdle,
  }: BaseBlockProps & {
    assignProcess?: BaseBlock["assignProcess"];
    onIdle?: BaseBlock["onIdle"];
    blockData?: BaseBlock["blockData"];
  }) {
    this.id = id ?? uid();
    this.tables = tables;
    this.tables.blocks[this.id] = this;
    this.blockData = blockData;
    this.assignProcess = assignProcess;
    this.onIdle = onIdle;
  }

  step = () => {
    if (this.status === "idle") {
      this.onIdle?.(this);
    }
  };

  occupe(unitID: UnitID) {
    this.currentOccupant = unitID;
    this.status = "processing";

    this.assignProcess?.(this, unitID);
  }
}

export type Block = BaseBlock;
