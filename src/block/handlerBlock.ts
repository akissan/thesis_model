import { BaseBlock, BaseBlockProps, BlockStateMachine } from "../blocks";
import { BaseProps, Process } from "../process";
import { BuildingProcess } from "../processes/building";
import { CraftingProcess } from "../processes/crafting";
import { ParsingProcess } from "../processes/parsing";
import { ReadingProcess } from "../processes/reading";
import { SendingProcess } from "../processes/sending";
import { QueueID } from "../queue";
import { UnitID } from "../unit";

type HandlerBlockStateMachinePackage = Pick<
  BlockStateMachine,
  "connected" | "parsed" | "readed" | "crafted" | "builded"
>;

const pageInCache = (unit: UnitID) => {
  return false;
};

const HandlerBlockStateMachine = (
  baseProps: BaseProps,
  blockData: { inputQueue: QueueID; terminatedUnits: UnitID[] }
): HandlerBlockStateMachinePackage => {
  return {
    connected: () => ParsingProcess(baseProps),
    parsed: () => {
      if (pageInCache(baseProps.unit)) {
        return ReadingProcess(baseProps);
      } else {
        return BuildingProcess({
          ...baseProps,
          block: undefined,
          additionalData: { handlerQueueID: blockData.inputQueue },
        });
        // throw new Error("KEKW");
      }
    },
    builded: () => ReadingProcess(baseProps),
    readed: () => CraftingProcess(baseProps),
    crafted: () =>
      SendingProcess({
        ...baseProps,
        additionalData: {
          terminatedUnits: blockData.terminatedUnits,
        },
      }),
  };
};

export const HandlerBlock = (
  baseProps: BaseBlockProps,
  additionalData: { inputQueue: QueueID; terminatedUnits: UnitID[] }
) =>
  new BaseBlock({
    ...baseProps,
    blockData: additionalData,
    assignProcess: (block: BaseBlock, unitID: UnitID) => {
      const { requestState } = block.tables.units[unitID];
      const { tables } = block;

      const stateMachine = HandlerBlockStateMachine(
        {
          unit: unitID,
          tables,
          block: block.id,
        },
        block.blockData
      );
      return stateMachine[
        requestState as keyof HandlerBlockStateMachinePackage
      ]();
    },
    onIdle: (block: BaseBlock) => {
      //   console.log(block);

      const inputQueue =
        block.tables.queues[block.blockData.inputQueue as QueueID];

      const freeUnitID = inputQueue.pop();

      if (freeUnitID) {
        block.occupe(freeUnitID);
      }
    },
  });
