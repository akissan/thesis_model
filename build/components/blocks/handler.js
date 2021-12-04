"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlerAcceptedResponseStates = void 0;
const prettyPrint_1 = require("../../tools/prettyPrint");
const block_1 = __importDefault(require("../block"));
const process_1 = __importDefault(require("../process"));
const builder_1 = require("./builder");
exports.handlerAcceptedResponseStates = [
    "new",
    "connected",
    "parsed",
    "cached",
    "readed",
    "crafted",
    "builded",
];
class HandlerBlock extends block_1.default {
    constructor(props) {
        super(props);
        this.allowedOperations = [...exports.handlerAcceptedResponseStates];
        this.assignProcess = (unit) => {
            const state = unit.state;
            switch (state) {
                case "new":
                    return new process_1.default({
                        name: "Connection",
                        timeLeft: 4,
                        unit,
                        parentBlock: this,
                        onFinish: (process) => {
                            process.unit.state = "connected";
                        },
                    });
                case "connected":
                    return new process_1.default({
                        name: "Parsing",
                        timeLeft: 5,
                        unit,
                        parentBlock: this,
                        onFinish: (process) => {
                            process.unit.state = "not_cached";
                        },
                    });
                case "cached":
                    return new process_1.default({
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
                    return new process_1.default({
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
        this.decideTransfer = (unit) => {
            const travelMap = {
                builder: this.outputQueue.builderQueue,
                finish: this.outputQueue.finishQueue,
            };
            if (builder_1.builderAcceptedResponseStates.includes(unit.state))
                return travelMap.builder;
            if (unit.state === "sended")
                return travelMap.finish;
            throw new Error("Builder cannot decide what to do with " + prettyPrint_1.pp.unit(unit));
        };
        this.outputQueue = props.outputQueue;
    }
}
exports.default = HandlerBlock;
