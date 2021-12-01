import { eventTimings } from "../parameters";
import { BaseProps, Process } from "../process";

export const ParsingProcess = ({ ...baseProps }: BaseProps) =>
  new Process({
    ...baseProps,
    name: "parsing",
    processTime: eventTimings.request_handling.time,
    options: {
      onFinish: {
        occupeOnFinish: true,
        unitRequestState: "parsed",
      },
    },
  });
