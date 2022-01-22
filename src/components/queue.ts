import { GLOBALS } from "../globals";
import { Block } from "./block";
import { Unit } from "./unit";

export class Queue {
  id: string;
  blocks: Block[] = [];
  units: Unit[] = [];
  blockType: Unit["requiredBlockType"];

  constructor({
    id,
    blockType,
  }: {
    id: Queue["id"];
    blockType: Queue["blockType"];
  }) {
    this.id = id;
    this.blockType = blockType;
  }

  findAvailableBlock = () => {
    const freeBlock = this.blocks.find((block) => block.status === "idle");
    return freeBlock;
  };

  onBlockFreed = (b: Block) => {
    GLOBALS.VERBOSE &&
      console.log(`${b.id} freed, so ${this.id} is looking for unit`);
    const unit = this.units.shift();
    if (unit) b.handle(unit);
    GLOBALS.VERBOSE &&
      console.log(`${this.id} found and assigned ${unit?.id} to ${b.id}`);
  };

  push = (unit: Unit) => {
    const freeBlock = this.findAvailableBlock();
    if (freeBlock) {
      GLOBALS.VERBOSE &&
        console.log(unit.id, "redirected to", freeBlock.id, "by", this.id);
      freeBlock.handle(unit);
    } else {
      GLOBALS.VERBOSE && console.log(unit.id, "pushed to ", this.id);
      this.units.push(unit);
    }
  };
}
