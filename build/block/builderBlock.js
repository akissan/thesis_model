"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuilderBlock = void 0;
const blocks_1 = require("../blocks");
const building_1 = require("../processes/building");
const BuilderBlockStateMachine = (baseProps, blockData) => {
    return {
        parsed: () => (0, building_1.BuildingProcess)(Object.assign(Object.assign({}, baseProps), { additionalData: { handlerQueueID: blockData.handlerQueueID } })),
    };
};
const BuilderBlock = (baseProps, additionalData) => new blocks_1.BaseBlock(Object.assign(Object.assign({}, baseProps), { blockData: additionalData, assignProcess: (block, unitID) => {
        const { requestState } = block.tables.units[unitID];
        const { tables } = block;
        const stateMachine = BuilderBlockStateMachine({
            unit: unitID,
            tables,
            block: block.id,
        }, block.blockData);
        return stateMachine[requestState];
    }, onIdle: (block) => {
        // console.log(block);
        var _a;
        const inputQueue = block.tables.queues[block.blockData.inputQueue];
        const freeUnitID = inputQueue.pop();
        if (freeUnitID) {
            const newProcess = (_a = block.assignProcess) === null || _a === void 0 ? void 0 : _a.call(block, block, freeUnitID)();
        }
    } }));
exports.BuilderBlock = BuilderBlock;
