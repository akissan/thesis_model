import { eventTimings } from "../parameters";
import { BaseProps, Process } from "../process";
import { UnitID } from "../unit";

export class SendingProcess extends Process {
  trashBin: UnitID[];

  constructor({
    id,
    unit,
    tables,
    terminatedUnits,
    block,
  }: BaseProps & { terminatedUnits: SendingProcess["trashBin"] }) {
    super({
      name: "sending",
      processTime: eventTimings.response_receiving.time,
      unit,
      tables,
      block,
      id,
    });
    this.trashBin = terminatedUnits;
  }

  onFinish = () => {
    this.tables.units[this.unit].status = "finished";
    this.tables.units[this.unit].requestState = "received";

    this.trashBin.push(this.unit);
  };
}
