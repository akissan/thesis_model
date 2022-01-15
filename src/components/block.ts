import chalk from "chalk";
import { Statserver } from "../statserver";
import { pp } from "../tools/prettyPrint";
import { clog } from "../tools/utils";
import { BlockTable } from "../types/tables";
import Entity, { BaseEntityProps } from "./entity";
import Process from "./process";
import Queue from "./queue";
import { ResponseState } from "./response";
import { Schedule } from "./schedule";
import Unit from "./unit";

export type BaseBlockProps = BaseEntityProps & {
  name: Block["name"];
  inputQueue: Block["inputQueue"];
  outputQueue: Block["outputQueue"];
  schedule: Block["schedule"];
};

export type BlockID = Block["id"];

export default abstract class Block extends Entity {
  name: string;
  private _process?: Process;
  status: "processing" | "idle";
  inputQueue: Queue;
  outputQueue: Record<string, Queue> | Queue;
  abstract allowedOperations: ResponseState[];
  abstract decideProcess: (unit: Unit) => Process;
  abstract decideTransfer: (unit: Unit) => Queue | undefined;
  schedule: Schedule;

  static table: BlockTable;
  static setTable = (table: typeof Block.table) => {
    Block.table = table;
  };

  constructor({ name, inputQueue, outputQueue, id, schedule }: BaseBlockProps) {
    super({ id });
    this.name = name;
    this.status = "idle";
    this.inputQueue = inputQueue;
    this.outputQueue = outputQueue;
    this.schedule = schedule;

    Block.table.set(this.id, this);
    this.inputQueue.addNewConsumer(this.id);
  }

  tryQueue = () => {
    this.checkQueue(this.inputQueue);
  };

  step = () => {
    if (this.status === "idle") {
      this.checkQueue(this.inputQueue);
    }
  };

  checkQueue = (queue: Queue) => {
    const unit = queue.shift();
    if (!unit) return;
    if (global.VERBOSE)
      clog(
        chalk.white(
          `[Q] Block ${chalk.yellow(this.id)} got a ${chalk.green(
            unit.id
          )} from queue`
        )
      );
    this.setProcess(this.decideProcess(unit));
  };

  onProcessFinish = (process: Process) => {
    this.process = undefined;
    this.assignProcess(process.unit);
    // this.postFinish();
  };

  shouldStay = (unit: Unit) => this.allowedOperations.includes(unit.state);

  get process(): Block["_process"] {
    return this._process;
  }
  set process(p: Block["_process"]) {
    this._process = p;
    if (p) {
      Statserver.reportTravel({ unitID: p.unit.id, entityID: this.id });
    }
    this.status = p === undefined ? "idle" : "processing";

    if (this.status === "idle") {
      this.inputQueue.setConsumerState(this.id, "available");
    } else {
      this.inputQueue.setConsumerState(this.id, "busy");
    }
  }

  setProcess = (process: Process) => {
    if (process?.parentBlock === this) {
      this.process = process;
    }
  };

  assignProcess = (unit: Unit) => {
    if (this.shouldStay(unit)) {
      this.setProcess(this.decideProcess(unit));
    } else {
      this.transferSomewhere(unit);
    }
  };

  transferSomewhere = (unit: Unit) => {
    if (global.VERBOSE)
      clog(chalk.white("Where should i transfer " + pp.unit(unit) + "?"));
    this.decideTransfer(unit)?.push(unit);
  };
}
