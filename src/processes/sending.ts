import { eventTimings } from "../parameters";
import { BaseProps, Process } from "../process";
import { UnitID } from "../unit";

export const SendingProcess = ({
  additionalData,
  ...baseProps
}: BaseProps & {
  additionalData: {
    terminatedUnits: UnitID[];
  };
}) =>
  new Process({
    ...baseProps,
    name: "sending",
    processTime: eventTimings.response_receiving.time,
    processData: additionalData,
    options: {
      onFinish: {
        unitRequestState: "received",
        unitStatus: "finished",
      },
    },
    onFinish: (process: Process) => {
      process.processData.terminatedUnits.push(process.unit);
    },
  });
