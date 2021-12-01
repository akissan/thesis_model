import { GlobalTables } from ".";
import { BlockID } from "./blocks";
import { eventTimings } from "./parameters";
import { QueueID } from "./queue";
import { Unit, UnitID } from "./unit";
import { uid } from "./util/utils";

export type ProcessID = string;

export type BaseProps = {
  id?: ProcessID;
  unit: Process["unit"];
  tables: Process["tables"];
  block?: Process["block"];
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
  processData?: any;
  options?: {
    onFinish?: {
      occupeOnFinish?: boolean;
      unitRequestState?: Unit["requestState"];
      unitStatus?: Unit["status"];
    };
  };

  constructor({
    processTime,
    name,
    unit,
    tables,
    block,
    id,
    processData,
    options,
    onFinish,
  }: BaseProps & {
    name: Process["name"];
    processTime: Process["timeLeft"];
    onFinish?: Process["onFinish"];
    processData?: Process["processData"];
    options?: Process["options"];
  }) {
    this.id = id ?? uid();
    this.timeLeft = processTime;
    this.name = name;
    this.unit = unit;
    this.tables = tables;
    this.block = block;
    this.processData = processData;
    this.options = options;
    this.onFinish = onFinish;

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

      if (this.options?.onFinish?.occupeOnFinish) {
        this.tables.blocks[this.block].occupe(this.unit);
      }
    }

    if (this.options?.onFinish?.unitRequestState) {
      this.tables.units[this.unit].requestState =
        this.options.onFinish.unitRequestState;
    }

    if (this.options?.onFinish?.unitStatus) {
      this.tables.units[this.unit].status = this.options.onFinish.unitStatus;
    }
  };

  step = () => {
    if (this.state === "processing") {
      this.timeLeft -= 1;
      if (this.timeLeft <= 0) {
        this.prefinish();
        if (this.onFinish) this.onFinish(this);
      }
    }
    return this.state;
  };
}
