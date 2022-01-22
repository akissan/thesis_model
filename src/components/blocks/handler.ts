import { PROCESS_TIMES } from "../../parameters";
import { Block } from "../block";
import { Process } from "../process";
import { Unit } from "../unit";

export const handlerAcceptedResponseStates = [
  "new",
  "connected",
  "parsed",
  "cached",
  "readed",
  "crafted",
] as const;

export class HandlerBlock extends Block {
  blockType = "handler";

  decideProcess: (unit: Unit) => Process = (unit) => {
    switch (unit.stage) {
      case "new":
        return new Process({
          name: "connection",
          time: PROCESS_TIMES.connection,
          unit,
          nextStage: "connected",
          nextBlock: "handler",
          block: this,
        });
      case "connected": {
        // let isCached = Math.random() < 0.6;
        let isCached = this.globalManager.cacheManager.isCached(unit.pageID);
        return new Process({
          name: "parsing",
          time: PROCESS_TIMES.parsing,
          unit,
          //   nextStage: isCached ? "cached" : "not_cached",
          //   nextBlock: isCached ? "handler" : "builder",
          nextStage: isCached ? "cached" : "not_cached",
          nextBlock: isCached ? "handler" : "builder",
          block: this,
        });
      }
      case "cached":
        return new Process({
          name: "crafting",
          time: PROCESS_TIMES.response_crafting,
          unit,
          nextStage: "crafted",
          nextBlock: "handler",
          block: this,
        });
      case "crafted":
        return new Process({
          name: "sending",
          time: PROCESS_TIMES.sending,
          unit,
          nextStage: "sended",
          nextBlock: "exit",
          block: this,
        });
    }
    throw new Error("Handler block cant decide");
  };
}
