import { eventTimings } from "../parameters";
import { BaseProps, Process } from "../process";
import { QueueID } from "../queue";
import { UnitID } from "../unit";

const pageInCache = (unit: UnitID) => {
  return false;
};

export const ParsingProcess = ({
  additionalData,
  ...baseProps
}: BaseProps & {
  additionalData: {
    builder_queue: QueueID;
    handler_queue: QueueID;
  };
}) =>
  new Process({
    ...baseProps,
    name: "parsing",
    processTime: eventTimings.request_handling.time,
    options: {
      onFinish: {
        // occupeOnFinish: true,
        unitRequestState: "parsed",
      },
    },
    processData: additionalData,
    onFinish: (process: Process) => {
      if (pageInCache(process.unit)) {
        process.tables.units[process.unit].status = "waiting";
        process.tables.queues[process.processData.handler_queue].push(
          process.unit
        );
      } else {
        process.tables.units[process.unit].status = "waiting";
        process.tables.queues[process.processData.builder_queue].push(
          process.unit
        );
      }
    },
  });
