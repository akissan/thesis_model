import { eventTimings } from "../parameters";
import { BaseProps, Process } from "../process";

export const ReadingProcess = ({ ...baseProps }: BaseProps) =>
  new Process({
    ...baseProps,
    name: "reading",
    processTime: eventTimings.read_from_cache.time,
    options: {
      onFinish: {
        unitRequestState: "readed",
        occupeOnFinish: true,
      },
    },
  });
