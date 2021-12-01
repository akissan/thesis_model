#!/usr/bin/env node

import { argvOptions, initArgs } from "./util/argv";
import { uid } from "./util/utils";

const argv = initArgs(argvOptions);
export type Argv = typeof argv;

export type UnitID = string;
export type ResponseState =
  | "new"
  | "connected"
  | "parsed"
  | "cached"
  | "readed"
  | "crafted"
  | "builded";
// "";

export class Unit {
  id: UnitID;
  constructor() {
    this.id = uid();
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
  onFinish?: Function;
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
    if (this.status === "processing") {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        this.onFinish?.(this);
        // this.parentBlock?.onProcessFinishs
      }
    }
  };
}

export type BaseBlockProps = {
  name: Block["name"];
};
export type BlockID = string;
export class Block {
  id: BlockID;
  name: string;
  process?: Process;
  status: "processing" | "idle";

  constructor({ name }: BaseBlockProps) {
    this.id = uid();
    this.name = name;
    this.status = "idle";
  }
}

export type Queue = Array<Unit>;

const main = () => {
  const handlerQueue: Queue = [];
  const builderQueue: Queue = [];

  const H1 = new Block({ name: "handler_0" });
  const B1 = new Block({ name: "builder_0" });

  const U1 = new Unit();

  handlerQueue.push(U1);
};
