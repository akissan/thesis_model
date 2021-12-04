import { pp } from "../../tools/prettyPrint";
import Block, { BaseBlockProps } from "../block";
import Process from "../process";
import { Queue } from "../queue";
import { BuilderAcceptedResponseStates, ResponseState } from "../response";
import Unit from "../unit";
import { handlerAcceptedResponseStates } from "./handler";

export const builderAcceptedResponseStates = [
  "not_cached",
  "api_called",
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

  assignProcess = (unit: Unit): Process | undefined => {
    if ((unit.state as BuilderAcceptedResponseStates) == "not_cached") {
      return new Process({
        name: "Caching",
        timeLeft: 2,
        unit,
        parentBlock: this,
        onFinish: (process) => {
          process.unit.state = "cached";
        },
      });
    }
  };

  decideTransfer = (unit: Unit) => {
    if (handlerAcceptedResponseStates.includes(unit.state as any)) {
      return this.outputQueue.handlerQueue;
    }
    throw new Error("Builder cannot decide what to do with " + pp.unit(unit));
  };
}
