// import { BaseBlock, BaseBlockProps, BlockStateMachine } from "../blocks";
// import { BaseProps, Process } from "../process";
// import { CraftingProcess } from "../processes/crafting";
// import { ParsingProcess } from "../processes/parsing";
// import { ReadingProcess } from "../processes/reading";
// import { SendingProcess } from "../processes/sending";
// import { QueueID } from "../queue";
// import { UnitID } from "../unit";

// type BuilderBlockStateMachinePackage = Omit<
//   BlockStateMachine,
//   "init" | "received"
// >;

// const HandlerBlockStateMachine = (
//   baseProps: BaseProps,
//   blockData: {
//     terminatedUnits: UnitID[];
//   }
// ): HandlerBlockStateMachinePackage => {
//   return {
//     connected: () => ParsingProcess(baseProps),
//     parsed: () => {
//       if (pageInCache(baseProps.unit)) {
//         return ReadingProcess(baseProps);
//       } else {
//         throw new Error("KEKW");
//       }
//     },
//     readed: () => CraftingProcess(baseProps),
//     crafted: () => SendingProcess({ ...baseProps, additionalData: blockData }),
//   };
// };

// export const HandlerBlock = (
//   baseProps: BaseBlockProps,
//   additionalData: { inputQueue: QueueID; terminatedUnits: UnitID[] }
// ) =>
//   new BaseBlock({
//     ...baseProps,
//     blockData: additionalData,
//     assignProcess: (block: BaseBlock, unitID: UnitID) => {
//       const { requestState } = block.tables.units[unitID];
//       const { tables } = block;

//       const stateMachine = HandlerBlockStateMachine(
//         {
//           unit: unitID,
//           tables,
//           block: block.id,
//         },
//         block.blockData
//       );
//       return stateMachine[
//         requestState as keyof HandlerBlockStateMachinePackage
//       ]();
//     },
//     onIdle: (block: BaseBlock) => {
//       console.log(block);

//       const inputQueue =
//         block.tables.queues[block.blockData.inputQueue as QueueID];

//       const freeUnitID = inputQueue.pop();

//       if (freeUnitID) {
//         block.occupe(freeUnitID);
//       }
//     },
//   });

// const pageInCache = (unit: UnitID) => {
//   return true;
// };
