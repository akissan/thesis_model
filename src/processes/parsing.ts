import { eventTimings } from "../parameters";
import { BaseProps, Process } from "../process";

export class ParsingProcess extends Process {
  constructor({ id, tables, unit, block }: BaseProps) {
    super({
      name: "parsing",
      unit,
      tables,
      block,
      processTime: eventTimings.request_handling.time,
      id,
    });
  }

  onFinish = () => {
    this.tables.units[this.unit].requestState = "readed";
    if (this.block) this.tables.blocks[this.block].occupe(this.unit);
  };
}
