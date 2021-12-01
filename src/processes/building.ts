import { BlockID } from "../blocks";
import { eventTimings } from "../parameters";
import { BaseProps, Process } from "../process";
import { QueueID } from "../queue";

export const BuildingProcess = ({
  additionalData,
  ...baseProps
}: BaseProps & {
  additionalData: { handlerQueueID: QueueID };
}) =>
  new Process({
    ...baseProps,
    name: "building",
    processTime: eventTimings.build_time.time,
    processData: additionalData,
    options: {
      //   onStart: {
      //       cleanBlock
      //   },
      onFinish: {
        unitRequestState: "builded",
      },
    },
    onFinish: (process: Process) => {
      process.tables.units[process.unit].status = "waiting";
      process.tables.queues[process.processData.handlerQueueID].push(
        process.unit
      );
    },
  });
