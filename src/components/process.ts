import { GLOBALS } from "../globals";
import { uid } from "../tools/utils";
import { Block } from "./block";
import Entity, { BaseEntityProps } from "./entity";
import { Unit } from "./unit";

export type ProcessID = Process["id"];

export class Process extends Entity {
  name: string;
  time: number;
  onFinish: (() => void) | undefined;
  unit: Unit;
  block: Block;
  //   globalManager: GlobalManager;
  blockOccupe: boolean = true;

  nextStage: Unit["stage"];
  nextBlock: Unit["requiredBlockType"];

  finish = () => {
    GLOBALS.VERBOSE && console.log(this.id, "finishing");
    this.onFinish?.();

    this.unit.stage = this.nextStage;
    this.unit.requiredBlockType = this.nextBlock;

    this.block.handle(this.unit);
    GLOBALS.VERBOSE && console.log(this.id, "finished");
  };

  constructor({
    name,
    time,
    onFinish,
    nextStage,
    nextBlock,
    unit,
    block,
    blockOccupe,
    globalManager,
  }: BaseEntityProps & {
    name: Process["name"];
    time: Process["time"];
    onFinish?: Process["onFinish"];
    nextStage: Process["nextStage"];
    nextBlock: Process["nextBlock"];
    unit: Process["unit"];
    block: Process["block"];
    blockOccupe?: Process["blockOccupe"];
  }) {
    super({
      id: `${name}_${unit.id}_${block.id}_${uid()}`,
      globalManager,
    });
    this.name = name;
    this.time = time;
    this.onFinish = onFinish;

    this.nextBlock = nextBlock;
    this.nextStage = nextStage;

    this.unit = unit;
    this.block = block;

    if (typeof blockOccupe === "boolean") this.blockOccupe = blockOccupe;
  }
}
