"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.builderAcceptedResponseStates = void 0;
const prettyPrint_1 = require("../../tools/prettyPrint");
const block_1 = __importDefault(require("../block"));
const process_1 = __importDefault(require("../process"));
const handler_1 = require("./handler");
exports.builderAcceptedResponseStates = [
    "not_cached",
    "api_called",
];
class BuilderBlock extends block_1.default {
    constructor(props) {
        super(props);
        this.allowedOperations = [...exports.builderAcceptedResponseStates];
        this.assignProcess = (unit) => {
            if (unit.state == "not_cached") {
                return new process_1.default({
                    name: "Caching",
                    timeLeft: 2,
                    unit,
                    parentBlock: this,
                    onFinish: (process) => {
                        process.unit.state = "cached";
                    },
                });
            }
        };
        this.decideTransfer = (unit) => {
            if (handler_1.handlerAcceptedResponseStates.includes(unit.state)) {
                return this.outputQueue.handlerQueue;
            }
            throw new Error("Builder cannot decide what to do with " + prettyPrint_1.pp.unit(unit));
        };
        this.outputQueue = props.outputQueue;
    }
}
exports.default = BuilderBlock;
