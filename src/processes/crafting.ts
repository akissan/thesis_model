import { eventTimings } from "../parameters";
import { BaseProps, Process } from "../process";

export const CraftingProcess = ({ ...baseProps }: BaseProps) =>
  new Process({
    ...baseProps,
    name: "crafting",
    processTime: eventTimings.response_crafting.time,
    options: {
      onFinish: {
        occupeOnFinish: true,
        unitRequestState: "crafted",
      },
    },
  });
