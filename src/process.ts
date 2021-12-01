import { GlobalTables } from ".";
import { BlockID } from "./blocks";
import { eventTimings } from "./parameters";
import { QueueID } from "./queue";
import { UnitID } from "./unit";
import { uid } from "./util/utils";

export type ProcessID = string;

export type BaseProps = {
  unit: Process["unit"];
  tables: Process["tables"];
  block?: Process["block"];
  id?: ProcessID;
};

export class Process {
  id: ProcessID;
  name: string;
  state: "processing" | "finished" = "processing";
  timeLeft: number;
  unit: UnitID;
  onFinish?: Function;
  tables: GlobalTables;
  block?: BlockID;

  constructor({
    processTime,
    name,
    unit,
    tables,
    block,
    id,
  }: BaseProps & {
    processTime: number;
    name: Process["name"];
  }) {
    this.id = id ?? uid();
    this.timeLeft = processTime;
    this.name = name;
    this.unit = unit;
    this.tables = tables;
    this.block = block;

    tables.units[unit].status = "processing";
    tables.units[unit].process = this.id;
    tables.processes[this.id] = this;
  }

  prefinish = () => {
    this.state = "finished";
    this.tables.units[this.unit].status = "waiting";
    this.tables.units[this.unit].process = null;

    if (this.block) {
      this.tables.blocks[this.block].status = "idle";
      this.tables.blocks[this.block].currentOccupant = null;
    }
  };

  step = () => {
    if (this.state === "processing") {
      this.timeLeft -= 1;
      if (this.timeLeft <= 0) {
        this.prefinish();
        if (this.onFinish) this.onFinish();
      }
    }
    return this.state;
  };
}
