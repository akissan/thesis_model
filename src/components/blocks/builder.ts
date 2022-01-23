import { PROCESS_TIMES } from "../../parameters";
import { Block } from "../block";
import { Process } from "../process";
import { Unit } from "../unit";

export const builderAcceptedResponseStates = [
  "not_cached",
  "prebuilded",
  "hydrated",
  "builded",
] as const;

export class BuilderBlock extends Block {
  blockType = "builder";

  decideProcess: (unit: Unit) => Process = (unit) => {
    switch (unit.stage) {
      case "not_cached":
        return new Process({
          name: "prebuilding",
          time: PROCESS_TIMES.building_start,
          unit,
          nextBlock: "builder",
          nextStage: "prebuilded",
          block: this,
          globalManager: this.globalManager,
        });
      case "prebuilded":
        return new Process({
          name: "hydration",
          time: PROCESS_TIMES.api_call,
          unit,
          nextBlock: "builder",
          nextStage: "hydrated",
          block: this,
          globalManager: this.globalManager,
          //   blockOccupe: false,
        });
      case "hydrated":
        return new Process({
          name: "building",
          time: PROCESS_TIMES.building_end,
          unit,
          nextBlock: "builder",
          nextStage: "builded",
          globalManager: this.globalManager,
          block: this,
        });
      case "builded":
        return new Process({
          name: "caching",
          time: PROCESS_TIMES.writing_to_cache,
          globalManager: this.globalManager,
          unit,
          nextBlock: "handler",
          nextStage: "cached",
          block: this,
          onFinish: () =>
            this.globalManager.cacheManager.setCached(unit.pageID),
        });
    }
    throw new Error("Builder block cant deicde");
  };
}
