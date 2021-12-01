import { BaseBlock, BaseBlockProps, BlockStateMachine } from "../blocks";
import { BaseProps, Process } from "../process";
import { BuildingProcess } from "../processes/building";
import { QueueID } from "../queue";
import { UnitID } from "../unit";

type BuilderBlockStateMachinePackage = Pick<BlockStateMachine, "parsed">;

const BuilderBlockStateMachine = (
  baseProps: BaseProps,
  blockData: {
    inputQueue: QueueID;
    handlerQueueID: QueueID;
    terminatedUnits: UnitID[];
  }
): BuilderBlockStateMachinePackage => {
  return {
    parsed: () =>
      BuildingProcess({
        ...baseProps,
        additionalData: { handlerQueueID: blockData.handlerQueueID },
      }),
  };
};

export const BuilderBlock = (
  baseProps: BaseBlockProps,
  additionalData: {
    handlerQueueID: QueueID;
    inputQueue: QueueID;
  }
) =>
  new BaseBlock({
    ...baseProps,
    blockData: additionalData,
    assignProcess: (block: BaseBlock, unitID: UnitID) => {
      const { requestState } = block.tables.units[unitID];
      const { tables } = block;

      const stateMachine = BuilderBlockStateMachine(
        {
          unit: unitID,
          tables,
          block: block.id,
        },
        block.blockData
      );
      return stateMachine[
        requestState as keyof BuilderBlockStateMachinePackage
      ];
    },
    onIdle: (block: BaseBlock) => {
      // console.log(block);

      const inputQueue =
        block.tables.queues[block.blockData.inputQueue as QueueID];
      const freeUnitID = inputQueue.pop();
      if (freeUnitID) {
        const newProcess = block.assignProcess?.(block, freeUnitID)();
      }
    },
  });
