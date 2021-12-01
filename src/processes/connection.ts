import { eventTimings } from "../parameters";
import { BaseProps, Process } from "../process";
import { QueueID } from "../queue";

export class ConnectionProcess extends Process {
  handlerQueueID: QueueID;

  constructor({
    unit,
    tables,
    handlerQueueID,
  }: BaseProps & { handlerQueueID: QueueID }) {
    super({
      name: "connection",
      processTime: eventTimings.connection_time.time,
      unit,
      tables,
    });
    this.handlerQueueID = handlerQueueID;
  }

  onFinish = () => {
    this.tables.units[this.unit].requestState = "connected";
    this.tables.units[this.unit].status = "waiting";
    this.tables.queues[this.handlerQueueID].push(this.unit);
  };
}
