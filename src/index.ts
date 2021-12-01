#!/usr/bin/env node

import { BlockList } from "net";
import { argvOptions, initArgs } from "./util/argv";
import { uid } from "./util/utils";

const argv = initArgs(argvOptions);
export type Argv = typeof argv;

export type UnitID = string;
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

  constructor({ name }: BaseBlockProps) {
    this.id = uid();
    this.name = name;
  }
}
