import chalk from "chalk";
import { GlobalTables } from ".";
import { HandlerBlock } from "./block/handlerBlock";
import { Process, ProcessID } from "./process";
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
  status: BlockStatus = "idle";
  process?: ProcessID;
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

  occupe(processID: ProcessID) {
    this.status = "processing";
    this.process = processID;
  }

  free() {
    this.status = "idle";
    this.process = undefined;
  }
}

export type Block = BaseBlock;
