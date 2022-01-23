import { uid } from "../tools/utils";
import Entity, { BaseEntityProps } from "./entity";
import { GlobalManager } from "./globalManager";
import { Process } from "./process";
import { Queue } from "./queue";
import { Schedule } from "./schedule";
import { Unit } from "./unit";

export type BlockID = Block["id"];

export abstract class Block extends Entity {
  blockType: string = "base";
  status: "busy" | "idle" = "idle";
  currentProcess: Process["id"] | undefined = undefined;
  schedule: Schedule;
  queue: Queue;

  abstract decideProcess: (unit: Unit) => Process;

  handle = (unit: Unit) => {
    if (unit.requiredBlockType == this.blockType) {
      this.assignProcess(unit);
      return;
    }

    if (unit.requiredBlockType === "exit") {
      // this.globalManager.finishedUnits.push(unit);
      this.globalManager.finishUnit(unit);
    } else {
      const queue = this.globalManager.findQueueForType(unit.requiredBlockType);
      queue.push(unit);
    }
    this.free();
  };

  assignProcess = (unit: Unit) => {
    const p = this.decideProcess(unit);
    this.status = "busy";
    this.currentProcess = p.id;
    this.schedule.addNewProcess(p);
  };

  free = () => {
    this.status = "idle";
    this.currentProcess = undefined;
    this.queue.onBlockFreed(this);
  };

  constructor({
    id,
    schedule,
    globalManager,
    queue,
  }: BaseEntityProps & {
    schedule: Block["schedule"];
    queue: Block["queue"];
  }) {
    super({ id: id ?? `B${uid()}`, globalManager });
    this.schedule = schedule;
    this.queue = queue;

    this.queue.blocks.push(this);
    this.globalManager.tables.blockTable.set(this.id, this);
  }
}
