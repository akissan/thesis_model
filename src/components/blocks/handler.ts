import { PROCESS_TIMES } from "../../parameters";
import { pp } from "../../tools/prettyPrint";
import { randomItem } from "../../tools/utils";
import Block, { BaseBlockProps } from "../block";
import Process from "../process";
import Queue from "../queue";
import { HandlerAcceptedResponseStates, ResponseState } from "../response";
import Unit from "../unit";
import { builderAcceptedResponseStates } from "./builder";

export const handlerAcceptedResponseStates = [
  "new",
  "connected",
  "parsed",
  "cached",
  "readed",
  "crafted",
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
          timeLeft: PROCESS_TIMES.connection,
          unit,
          parentBlock: this,
          options: {
            finish: {
              state: "connected",
            },
          },
        });
      case "connected":
        return new Process({
          name: "Parsing",
          timeLeft: PROCESS_TIMES.parsing,
          unit,
          parentBlock: this,
          options: {
            finish: {
              state: randomItem<ResponseState>(["cached", "not_cached"]),
            },
          },
        });
      case "cached":
        return new Process({
          name: "Crafting",
          timeLeft: PROCESS_TIMES.response_crafting,
          unit,
          parentBlock: this,
          options: {
            finish: {
              state: "crafted",
            },
          },
        });
      case "crafted":
        return new Process({
          name: "Sending",
          timeLeft: PROCESS_TIMES.sending,
          unit,
          parentBlock: this,
          options: {
            finish: {
              state: "sended",
            },
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
