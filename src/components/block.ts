import { pp } from "../tools/prettyPrint";
import { uid } from "../tools/utils";
import { BlockTable } from "../types/tables";
import { builderAcceptedResponseStates } from "./blocks/builder";
import Process from "./process";
import { Queue } from "./queue";
import { ResponseState } from "./response";
import Unit from "./unit";

export type BaseBlockProps = {
  name: Block["name"];
  inputQueue: Block["inputQueue"];
  outputQueue: Block["outputQueue"];
};
export type BlockID = string;

export default abstract class Block {
  id: BlockID;
  name: string;
  private _process?: Process;
  status: "processing" | "idle";
  inputQueue: Queue;
  outputQueue: Record<string, Queue> | Queue;
  abstract allowedOperations: ResponseState[];
  abstract assignProcess: (unit: Unit) => Process | undefined;
  abstract decideTransfer: (unit: Unit) => Queue | undefined;

  static blockTable: BlockTable;

  static init = ({ blockTable }: { blockTable: typeof Block.blockTable }) => {
    this.blockTable = blockTable;
  };

  constructor({ name, inputQueue, outputQueue }: BaseBlockProps) {
    this.id = uid();
    this.name = name;
    this.status = "idle";
    this.inputQueue = inputQueue;
    this.outputQueue = outputQueue;

    Block.blockTable.set(this.id, this);
  }

  step = () => {
    if (this.status === "idle") {
      this.checkQueue(this.inputQueue);
    }
  };

  checkQueue = (queue: Queue) => {
    const unit = queue.shift();
    if (!unit) return;
    console.log(`I've got a ${unit.id} from queue`);

    this.decideProcess(unit);
  };

  onProcessFinish = (process: Process) => {
    this.decideProcess(process.unit);
  };

  shouldStay = (unit: Unit) => this.allowedOperations.includes(unit.state);

  get process(): Block["_process"] {
    return this._process;
  }
  set process(p: Block["_process"]) {
    this._process = p;
    this.status = p === undefined ? "idle" : "processing";
  }

  decideProcess = (unit: Unit) => {
    if (this.shouldStay(unit)) {
      this.process = this.assignProcess(unit);
    } else {
      this.process = undefined;
      this.transferSomewhere(unit);
    }
  };

  transferSomewhere = (unit: Unit) => {
    console.log("where should i transfer " + pp.unit(unit) + "?");
    this.decideTransfer(unit)?.push(unit);
  };
}
