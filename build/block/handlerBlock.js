"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandlerBlock = void 0;
const blocks_1 = require("../blocks");
const crafting_1 = require("../processes/crafting");
const parsing_1 = require("../processes/parsing");
const reading_1 = require("../processes/reading");
const sending_1 = require("../processes/sending");
const HandlerBlockStateMachine = (baseProps, blockData) => {
    //   console.log("HBSMP", baseProps);
    return {
        connected: () => (0, parsing_1.ParsingProcess)(Object.assign(Object.assign({}, baseProps), { additionalData: {
                builder_queue: blockData.builderQueue,
                handler_queue: blockData.inputQueue,
            } })),
        builded: () => (0, reading_1.ReadingProcess)(baseProps),
        readed: () => (0, crafting_1.CraftingProcess)(baseProps),
        crafted: () => (0, sending_1.SendingProcess)(Object.assign(Object.assign({}, baseProps), { additionalData: {
                terminatedUnits: blockData.terminatedUnits,
            } })),
    };
};
const HandlerBlock = (baseProps, additionalData) => new blocks_1.BaseBlock(Object.assign(Object.assign({}, baseProps), { blockData: additionalData, assignProcess: (block, unitID) => {
        const { requestState } = block.tables.units[unitID];
        const { tables } = block;
        // console.dir(block);
        const stateMachine = HandlerBlockStateMachine({
            unit: unitID,
            tables,
            block: block.id,
        }, {
            builderQueue: block.blockData.builder_queue,
            inputQueue: block.inputQueue,
            terminatedUnits: block.blockData.terminatedUnits,
        });
        return stateMachine[requestState];
    }, onIdle: (block) => {
        var _a;
        const inputQueue = block.tables.queues[block.inputQueue];
        //   console.log("InputQueue", inputQueue);
        const freeUnitID = inputQueue.pop();
        if (freeUnitID) {
            //   console.log(block.assignProcess)
            const newProcess = (_a = block.assignProcess) === null || _a === void 0 ? void 0 : _a.call(block, block, freeUnitID)();
            // if (newProcess) console.log(newProcess());
        }
    } }));
exports.HandlerBlock = HandlerBlock;
