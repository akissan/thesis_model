import { PROCESS_TIMES } from "../../parameters";
import { pp } from "../../tools/prettyPrint";
import Block, { BaseBlockProps } from "../block";
import Process from "../process";
import Queue from "../queue";
import { BuilderAcceptedResponseStates } from "../response";
import Unit from "../unit";
import { handlerAcceptedResponseStates } from "./handler";

export const builderAcceptedResponseStates = [
  "not_cached",
  "prebuilded",
  "hydrated",
  "builded",
] as const;

export default class BuilderBlock extends Block {
  allowedOperations = [...builderAcceptedResponseStates];
  outputQueue: { handlerQueue: Queue };

  constructor(
    props: BaseBlockProps & { outputQueue: BuilderBlock["outputQueue"] }
  ) {
    super(props);
    this.outputQueue = props.outputQueue;
  }

  decideProcess = (unit: Unit): Process => {
    const state = unit.state as BuilderAcceptedResponseStates;
    const schedule = this.schedule;

    if (state === "not_cached") {
      return new Process({
        name: "Prebuilding",
        timeLeft: PROCESS_TIMES.building_start,
        unit,
        parentBlock: this,
        options: {
          finish: {
            state: "prebuilded",
          },
        },
        schedule,
      });
    }

    if (state === "prebuilded") {
      return new Process({
        name: "Hydration",
        timeLeft: PROCESS_TIMES.api_call,
        unit,
        options: {
          finish: {
            state: "hydrated",
          },
        },
        onFinish: (process) => {
          this.inputQueue.push(process.unit);
        },
        schedule,
      });
    }

    if (state === "hydrated") {
      return new Process({
        name: "Building",
        timeLeft: PROCESS_TIMES.building_end,
        unit,
        parentBlock: this,
        options: {
          finish: {
            state: "builded",
          },
        },
        schedule,
      });
    }

    if (state === "builded") {
      return new Process({
        name: "Caching",
        timeLeft: PROCESS_TIMES.writing_to_cache,
        unit,
        parentBlock: this,
        options: {
          finish: {
            state: "cached",
          },
        },
        schedule,
      });
    }
    throw new Error("Process is not assigned correctly for " + unit);
  };

  decideTransfer = (unit: Unit) => {
    if (handlerAcceptedResponseStates.includes(unit.state as any)) {
      return this.outputQueue.handlerQueue;
    }
    throw new Error("Builder cannot decide what to do with " + pp.unit(unit));
  };
}
