import { eventTimings } from "../parameters";
import { BaseProps, Process } from "../process";
import { QueueID } from "../queue";

export const ConnectionProcess = ({
  additionalData,
  ...baseProps
}: BaseProps & { additionalData: { handlerQueueID: QueueID } }) =>
  new Process({
    ...baseProps,
    name: "connection",
    processTime: eventTimings.connection_time.time,
    options: {
      onFinish: {
        unitRequestState: "connected",
      },
    },
    processData: additionalData,
    onFinish: (process: Process) => {
      process.tables.units[process.unit].status = "waiting";
      process.tables.queues[process.processData.handlerQueueID].push(
        process.unit
      );
    },
  });
