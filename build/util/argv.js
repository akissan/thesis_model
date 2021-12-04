"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initArgs = exports.argvOptions = void 0;
const yargs_1 = __importDefault(require("yargs"));
exports.argvOptions = 
// : Record<string, yargs.Options>
{
    title: {
        type: "string",
        alias: "n",
        describe: "New note title",
        group: "New note",
    },
    category: {
        type: "string",
        alias: "c",
        describe: "Specify a category",
        implies: ["n"],
        group: "New note",
    },
    details: {
        type: "string",
        alias: "d",
        describe: "Specify a details",
        implies: ["n"],
        group: "New note",
    },
    list: {
        type: "string",
        alias: "l",
        describe: "Get notes in category",
        group: "Output",
    },
    id: {
        type: "string",
        alias: "i",
        describe: "Get note with ID",
        group: "Output",
    },
    newCategory: {
        type: "string",
        alias: "C",
        describe: "New category",
        group: "New category",
    },
    D: {
        type: "boolean",
        describe: "Print description",
        group: "Print options",
        default: false,
    },
    noID: {
        type: "boolean",
        describe: "Do not print IDs",
        group: "Print options",
        default: false,
    },
    force: { type: "boolean", alias: "f", default: false },
    filepath: { type: "string", alias: "p", describe: "Note file" },
    verbose: { type: "boolean", alias: "v", default: false },
};
const initArgs = (options) => {
    const args = (0, yargs_1.default)(process.argv.slice(2))
        .usage("$0 <NoteID>")
        .options(options)
        .parseSync();
    // global.VERBOSE = args.verbose;
    global.VERBOSE = true;
    // if (global.VERBOSE) log("ARGS: ", args);
    return args;
};
exports.initArgs = initArgs;
