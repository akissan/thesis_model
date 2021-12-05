import chalk from "chalk";
import { pp } from "../tools/prettyPrint";
import { clog } from "../tools/utils";
import { BlockTable } from "../types/tables";
import Entity, { BaseEntityProps } from "./entity";
import Process from "./process";
import { Queue } from "./queue";
import { ResponseState } from "./response";
import Unit from "./unit";

export type BaseBlockProps = BaseEntityProps & {
  name: Block["name"];
  inputQueue: Block["inputQueue"];
  outputQueue: Block["outputQueue"];
};
export type BlockID = string;

export default abstract class Block extends Entity {
  name: string;
  private _process?: Process;
  status: "processing" | "idle";
  inputQueue: Queue;
  outputQueue: Record<string, Queue> | Queue;
  abstract allowedOperations: ResponseState[];
  abstract assignProcess: (unit: Unit) => Process | undefined;
  abstract decideTransfer: (unit: Unit) => Queue | undefined;

  static table: BlockTable;
  static setTable = (table: typeof Block.table) => {
    Block.table = table;
  };

  constructor({ name, inputQueue, outputQueue, id }: BaseBlockProps) {
    super({ id });
    this.name = name;
    this.status = "idle";
    this.inputQueue = inputQueue;
    this.outputQueue = outputQueue;

    Block.table.set(this.id, this);
  }

  step = () => {
    if (this.status === "idle") {
      this.checkQueue(this.inputQueue);
    }
  };

  checkQueue = (queue: Queue) => {
    const unit = queue.shift();
    if (!unit) return;
    clog(
      chalk.white(
        `[Q] Block ${chalk.yellow(this.id)} got a ${chalk.green(
          unit.id
        )} from queue`
      )
    );

    this.decideProcess(unit);
  };

  onProcessFinish = (process: Process) => {
    this.process = undefined;
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
      const process = this.assignProcess(unit);
      if (process?.parentBlock === this) {
        this.process = process;
      }
    } else {
      this.transferSomewhere(unit);
    }
  };

  transferSomewhere = (unit: Unit) => {
    clog(chalk.white("Where should i transfer " + pp.unit(unit) + "?"));
    this.decideTransfer(unit)?.push(unit);
  };
}
