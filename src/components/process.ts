import { uid } from "../tools/utils";
import { ProcessTable } from "../types/tables";
import Block from "./block";
import Unit from "./unit";

export type ProcessID = string;
type BaseProcessProps = {
  timeLeft: Process["timeLeft"];
  unit: Process["unit"];
  name: Process["name"];
  parentBlock?: Process["parentBlock"];
};
export default class Process {
  id: ProcessID;
  timeLeft: number;
  status: "processing" | "finished";
  onFinish?: (process: Process) => void;
  parentBlock?: Block;
  unit: Unit;
  name: string;

  static processTable: ProcessTable;

  static init = ({
    processTable,
  }: {
    processTable: typeof Process.processTable;
  }) => {
    this.processTable = processTable;
  };

  constructor({
    timeLeft,
    onFinish,
    unit,
    name,
    parentBlock,
  }: BaseProcessProps & { onFinish?: Process["onFinish"] }) {
    this.id = uid();
    this.status = "processing";
    this.timeLeft = timeLeft;
    this.onFinish = onFinish;
    this.unit = unit;
    this.name = name;
    this.parentBlock = parentBlock;

    Process.processTable.set(this.id, this);
  }

  baseFinish = (process: Process) =>
    process.parentBlock?.onProcessFinish(process);

  step = () => {
    // if (this.status === "")

    if (this.status === "processing") {
      this.timeLeft--;
      if (this.timeLeft < 0) {
        this.status = "finished";
        this.onFinish?.(this);
        this.baseFinish(this);
      }
    }
  };
}
