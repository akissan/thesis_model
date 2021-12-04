#!/usr/bin/env node

import { pp } from "./prettyPrint";
import { argvOptions, initArgs } from "./util/argv";
import { clog, uid } from "./util/utils";

const argv = initArgs(argvOptions);
export type Argv = typeof argv;

export type Queue = Unit[];

export type UnitID = string;

export const handlerAcceptedResponseStates = [
  "new",
  "connected",
  "parsed",
  "cached",
  "readed",
  "crafted",
  "builded",
] as const;

export const builderAcceptedResponseStates = [
  "not_cached",
  "api_called",
] as const;

export type HandlerAcceptedResponseStates =
  typeof handlerAcceptedResponseStates[number];
export type BuilderAcceptedResponseStates =
  typeof builderAcceptedResponseStates[number];

export type ResponseState =
  | HandlerAcceptedResponseStates
  | BuilderAcceptedResponseStates;

/*
  | "new"
  | "connected"
  | "parsed"
  | "cached"
  | "readed"
  | "crafted"
  | "builded";
*/

export class Unit {
  id: UnitID;
  state: ResponseState;
  constructor() {
    this.id = uid();
    this.state = "new";
  }
}

export type ProcessID = string;
type BaseProcessProps = {
  timeLeft: Process["timeLeft"];
  unit: Process["unit"];
  name: Process["name"];
};
export class Process {
  id: ProcessID;
  timeLeft: number;
  status: "processing" | "finished";
  onFinish?: (process: Process) => void;
  parentBlock?: Block;
  unit: Unit;
  name: string;

  constructor({
    timeLeft,
    onFinish,
    unit,
    name,
  }: BaseProcessProps & { onFinish?: Process["onFinish"] }) {
    this.id = uid();
    this.status = "processing";
    this.timeLeft = timeLeft;
    this.onFinish = onFinish;
    this.unit = unit;
    this.name = name;
  }

  step = () => {
    // if (this.status === "")

    if (this.status === "processing") {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        this.onFinish?.(this);
      }
    }
  };
}

export type BaseBlockProps = {
  name: Block["name"];
  inputQueue: Block["inputQueue"];
  outputQueue: Block["outputQueue"];
};
export type BlockID = string;

type BlockTable = Map<BlockID, Block>;

export abstract class Block {
  id: BlockID;
  name: string;
  process?: Process;
  status: "processing" | "idle";
  inputQueue: Queue;
  outputQueue: Record<string, Queue> | Queue;
  abstract allowedOperations: ResponseState[];
  abstract assignProcess: (unit: Unit) => Process | undefined;

  checkQueue = (queue: Queue) => {
    const unit = queue.shift();
    if (!unit) return;
    console.log(`I've got a ${unit.id} from queue`);

    this.decideProcess(unit);
  };

  shouldStay = (unit: Unit) => this.allowedOperations.includes(unit.state);

  decideProcess = (unit: Unit) => {
    if (this.shouldStay(unit)) {
      this.process = this.assignProcess(unit);
    } else {
      this.transferSomewhere(unit);
    }
  };

  transferSomewhere = (unit: Unit) => {
    console.log("where should i transfer " + pp.unit(unit) + "?");
  };

  step = () => {
    if (this.status === "idle") {
      this.checkQueue(this.inputQueue);
    }
  };

  static blockTable: BlockTable;

  static init = ({ blockTable }: { blockTable: BlockTable }) => {
    this.blockTable = blockTable;
  };

  constructor({ name, inputQueue, outputQueue }: BaseBlockProps) {
    this.id = uid();
    this.name = name;
    this.status = "idle";
    this.inputQueue = inputQueue;
    this.outputQueue = outputQueue;

    // if (!Block.blockTable) throw new Error("Block.blockTable is not defined");
    Block.blockTable.set(this.id, this);
  }
}

export class HandlerBlock extends Block {
  allowedOperations = [...handlerAcceptedResponseStates];

  assignProcess = (unit: Unit) => {
    if ((unit.state as HandlerAcceptedResponseStates) === "new") {
      return new Process({
        name: "Connection",
        timeLeft: 4,
        unit,
        onFinish: (process) => {
          process.unit.state = "connected";
        },
      });
    }
    if (unit.state === "connected") {
      return new Process({
        name: "Parsing",
        timeLeft: 5,
        unit,
        onFinish: (process) => {
          process.unit.state = "parsed";
        },
      });
    }
  };
}

export class BuilderBlock extends Block {
  allowedOperations = [...builderAcceptedResponseStates];

  assignProcess = (unit: Unit) => {
    if ((unit.state as BuilderAcceptedResponseStates) == "not_cached") {
      return new Process({
        name: "Caching",
        timeLeft: 2,
        unit,
        onFinish: (process) => {
          process.unit.state = "cached";
        },
      });
    }
  };
}

const main = () => {
  const handlerQueue: Queue = [];
  const builderQueue: Queue = [];

  const blockTable = new Map<BlockID, Block>();

  Block.init({ blockTable });

  const H1 = new HandlerBlock({
    name: "handler_0",
    inputQueue: handlerQueue,
    outputQueue: { builderQueue },
  });

  const B1 = new BuilderBlock({
    name: "builder_0",
    inputQueue: builderQueue,
    outputQueue: { handlerQueue },
  });

  // blockTable.set(H1.id, H1);

  const U1 = new Unit();

  handlerQueue.push(U1);

  console.log("Blocks");
  for (let t = 0; t < 10; t++) {
    for (const [blockID, block] of Block.blockTable) {
      clog(pp.block(block));
      block.step();
    }
  }
};

main();
