import { GlobalTables } from ".";
import { eventTimings } from "./parameters";
import { QueueID } from "./queue";
import { UnitID } from "./unit";
import { uid } from "./util/utils";

export type ProcessID = string;

export type BaseProps = {
  unit: Process["unit"];
  tables: Process["tables"];
};

export class Process {
  id: ProcessID;
  name: string;
  state: "processing" | "finished" = "processing";
  timeLeft: number;
  unit: UnitID;
  onFinish?: Function;
  tables: GlobalTables;

  constructor({
    processTime,
    name,
    unit,
    tables,
  }: BaseProps & {
    processTime: number;
    name: Process["name"];
  }) {
    this.id = uid();
    this.timeLeft = processTime;
    this.name = name;
    this.unit = unit;
    this.tables = tables;

    tables.units[unit].status = "processing";
    tables.units[unit].process = this.id;
    tables.processes[this.id] = this;
  }

  prefinish = () => {
    this.state = "finished";
    this.tables.units[this.unit].status = "waiting";
    this.tables.units[this.unit].process = null;
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
