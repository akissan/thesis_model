import { Statserver } from "../statserver";
import { ProcessTable } from "../types/tables";
import Block from "./block";
import Entity, { BaseEntityProps } from "./entity";
import { ResponseState } from "./response";
import { Schedule } from "./schedule";
import Unit from "./unit";

export type ProcessID = Process["id"];

type BaseProcessProps = BaseEntityProps & {
  timeLeft: Process["timeLeft"];
  unit: Process["unit"];
  name: Process["name"];
  parentBlock?: Process["parentBlock"];
};
export default class Process extends Entity {
  // id: ProcessID;
  timeLeft: number;
  totalTime: number;
  status: "processing" | "finished";
  onFinish?: (process: Process) => void;
  parentBlock?: Block;
  unit: Unit;
  name: string;
  options?: {
    finish?: {
      state?: ResponseState;
    };
  };

  static table: ProcessTable;
  static setTable = (table: typeof Process.table) => {
    Process.table = table;
  };

  constructor({
    timeLeft,
    onFinish,
    unit,
    name,
    parentBlock,
    options,
    id,
    schedule,
  }: BaseProcessProps & {
    onFinish?: Process["onFinish"];
    options?: Process["options"];
    schedule: Schedule;
  }) {
    super({ id });
    this.status = "processing";
    this.timeLeft = timeLeft;
    this.onFinish = onFinish;
    this.unit = unit;
    this.name = name;
    this.parentBlock = parentBlock;
    this.options = options;
    this.totalTime = timeLeft;

    Process.table.set(this.id, this);
    Statserver.reportProcessChange({ processID: this.id, unitID: unit.id });
    schedule.pushProcess(this);
  }

  baseFinish = (process: Process) => {
    if (this.options?.finish?.state) {
      process.unit.state = this.options.finish.state;
    }
    process.parentBlock?.onProcessFinish(process);
  };

  finishProcess = () => {
    this.timeLeft = 0;
    this.status = "finished";
    this.onFinish?.(this);
    this.baseFinish(this);
  };

  step = () => {
    if (this.status === "processing") {
      this.timeLeft--;
      if (this.timeLeft <= 0) this.finishProcess();
    }
  };
}
