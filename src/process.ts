import { number } from "yargs";
import { UnitID } from "./unit";

class ProcessingBlock {
  status: "idle" | "busy";
  timeLeft: number;
  queue: UnitID[];
  currentUnit: UnitID | null;
  processTime: number;

  constructor(initParams: Partial<ProcessingBlock>) {
    this.status = "idle";
    this.timeLeft = 0;
    this.queue = [];
    this.currentUnit = null;
    this.processTime = 0;

    Object.assign(this, initParams);
  }

  process() {
      this.currentUnit?.

    if (this.currentUnit && this.timeLeft <= 0) {
      const nextUnit = this.queue.pop() ?? null;
      if (nextUnit) {
        this.timeLeft = this.processTime;
        this.currentUnit = nextUnit;
      }
    }
  }
}

const ProcessHandler = ({
  status,
  timeLeft,
  currentUnit,
  queue,
}: ProcessingBlock) => {
  timeLeft -= 1;

  if (currentUnit && timeLeft <= 0) {
    if (nextUnit) {
    }
  }

  return { status };
};
