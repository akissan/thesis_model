"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logUnit = exports.getBlockLog = exports.getActiveProcessesLog = void 0;
const chalk_1 = __importDefault(require("chalk"));
const randomColors = [
    chalk_1.default.greenBright,
    chalk_1.default.yellowBright,
    chalk_1.default.magentaBright,
    chalk_1.default.blueBright,
    chalk_1.default.cyanBright,
];
const colorTable = {};
const rndClr = (str = "") => {
    if (!colorTable[str]) {
        let ri = Math.floor(Math.random() * randomColors.length);
        colorTable[str] = randomColors[ri];
    }
    return colorTable[str](str);
};
const getActiveProcessesLog = (tables) => Object.values(tables.processes)
    .filter((process) => process.state === "processing")
    .map((process) => `[${process.id}] ${process.name.padStart(10)} (${process.timeLeft
    .toString()
    .padStart(2)}) UNIT: ${rndClr(process.unit)} BLOCK: ${rndClr(process.block)}`)
    .join("\n".padEnd(6));
exports.getActiveProcessesLog = getActiveProcessesLog;
const getBlockLog = (tables) => Object.values(tables.blocks)
    .map((block) => `${block.id} [${block.status}] ${block.process}`)
    .join("\n".padEnd(6));
exports.getBlockLog = getBlockLog;
const logUnit = (table, unitID) => {
    var _a, _b;
    const unit = table.units[unitID];
    return `[${unit.id.toString().padStart(6)}] ${chalk_1.default.blue(`${((_a = unit.process) !== null && _a !== void 0 ? _a : "").padStart(6)} ${((_b = (unit.process && table.processes[unit.process].name)) !== null && _b !== void 0 ? _b : "").padStart(12)}`)} TIME: ${chalk_1.default.green(unit.timeInSystem)}`;
};
exports.logUnit = logUnit;
// import { Category, Note, NoteID, NotesData } from "./notes/Note";
// const spacer = " ".padStart(2);
// interface PrintOptions {
//   printCategory?: boolean;
//   printOneLine?: boolean;
//   descriptionLimit?: number;
//   titlePadding?: number;
//   printDescription?: boolean;
//   printID?: boolean;
// }
// const truncate = (str: string, limit: number) =>
//   limit && str.length > limit ? `${str.substring(0, limit)}…` : str;
// export const printNote = (
//   note: Note,
//   {
//     printCategory = true,
//     printOneLine = false,
//     descriptionLimit = 0,
//     titlePadding = 30,
//     printDescription = true,
//     printID = true,
//   }: PrintOptions = {}
// ) => {
//   let res = "";
//   if (printID) res += `${spacer}${chalk.magenta(note.id)}`;
//   res += `${spacer}${note.title.padEnd(titlePadding)}${spacer}`;
//   if (printCategory) res += ` [ ${chalk.blue(note.category)} ] `;
//   if (!printOneLine) res += `\r\n${spacer}`;
//   if (printDescription)
//     res += `${chalk.gray(truncate(note.details ?? "", descriptionLimit))}`;
//   return res;
// };
// export const printOneCategory = (
//   categoryData: Category,
//   getNote: (noteID: NoteID) => Note,
//   args: Argv
// ) =>
//   categoryData.notes
//     .map((noteId) =>
//       printNote(getNote(noteId), {
//         printCategory: false,
//         printOneLine: true,
//         descriptionLimit: 64,
//         titlePadding: 2,
//         printDescription: args.D,
//         printID: !args.noID,
//       })
//     )
//     .join("\r\n");
// export const printEverything = (
//   data: NotesData,
//   getNote: (noteID: NoteID) => Note,
//   args: Argv
// ) => {
//   const printedCategories = [];
//   let res = "";
//   for (const category in data.categories) {
//     const categoryData = data.categories[category];
//     res += chalk.blue(category) + "\r\n";
//     res += printOneCategory(categoryData, getNote, args) + "\r\n";
//     printedCategories.push(category);
//   }
//   const emptyCategory: Category = { name: "No category", notes: [] };
//   for (const noteID in data.notes) {
//     const note = data.notes[noteID];
//     if (!note.category || !printedCategories.includes(note.category)) {
//       emptyCategory.notes.push(noteID);
//     }
//   }
//   if (emptyCategory.notes.length > 0) {
//     res += chalk.blue(emptyCategory.name) + "\r\n";
//     res += printOneCategory(emptyCategory, getNote, args);
//   }
//   return res;
// };
