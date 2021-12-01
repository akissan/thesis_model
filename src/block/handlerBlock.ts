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
  "connected" | "readed" | "builded" | "crafted"
>;

const HandlerBlockStateMachine = (
  baseProps: BaseProps,
  blockData: {
    inputQueue: QueueID;
    builderQueue: QueueID;
    terminatedUnits: UnitID[];
  }
): HandlerBlockStateMachinePackage => {
  return {
    connected: () =>
      ParsingProcess({
        ...baseProps,
        additionalData: {
          builder_queue: blockData.builderQueue,
          handler_queue: blockData.inputQueue,
        },
      }),
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
  additionalData: {
    inputQueue: QueueID;
    builderQueue: QueueID;
    terminatedUnits: UnitID[];
  }
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
      const inputQueue =
        block.tables.queues[block.blockData.inputQueue as QueueID];
      const freeUnitID = inputQueue.pop();
      if (freeUnitID) {
        const newProcess = block.assignProcess?.(block, freeUnitID);
      }
    },
  });
