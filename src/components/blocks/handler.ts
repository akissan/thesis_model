import { pp } from "../../tools/prettyPrint";
import Block, { BaseBlockProps } from "../block";
import Process from "../process";
import { Queue } from "../queue";
import { HandlerAcceptedResponseStates } from "../response";
import Unit from "../unit";
import { builderAcceptedResponseStates } from "./builder";

export const handlerAcceptedResponseStates = [
  "new",
  "connected",
  "parsed",
  "cached",
  "readed",
  "crafted",
  "builded",
] as const;

export default class HandlerBlock extends Block {
  allowedOperations = [...handlerAcceptedResponseStates];
  outputQueue: { builderQueue: Queue; finishQueue: Queue };

  constructor(
    props: BaseBlockProps & { outputQueue: HandlerBlock["outputQueue"] }
  ) {
    super(props);
    this.outputQueue = props.outputQueue;
  }

  assignProcess = (unit: Unit): Process | undefined => {
    const state = unit.state as HandlerAcceptedResponseStates;

    switch (state) {
      case "new":
        return new Process({
          name: "Connection",
          timeLeft: 4,
          unit,
          parentBlock: this,
          onFinish: (process) => {
            process.unit.state = "connected";
          },
        });
      case "connected":
        return new Process({
          name: "Parsing",
          timeLeft: 5,
          unit,
          parentBlock: this,
          onFinish: (process) => {
            process.unit.state = "not_cached";
          },
        });
      case "cached":
        return new Process({
          name: "Crafting",
          timeLeft: 2,
          unit,
          parentBlock: this,
          onFinish: (process) => {
            process.unit.state = "crafted";
          },
        });
      // default:
      //   break;
      case "crafted":
        return new Process({
          name: "Sending",
          timeLeft: 5,
          unit,
          parentBlock: this,
          onFinish: (process) => {
            process.unit.state = "sended";
          },
        });
    }
  };

  decideTransfer = (unit: Unit) => {
    const travelMap = {
      builder: this.outputQueue.builderQueue,
      finish: this.outputQueue.finishQueue,
    };
    if (builderAcceptedResponseStates.includes(unit.state as any))
      return travelMap.builder;
    if (unit.state === "sended") return travelMap.finish;

    throw new Error("Builder cannot decide what to do with " + pp.unit(unit));
  };
}
