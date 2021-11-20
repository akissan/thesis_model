"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const notes_1 = require("./notes");
const createNewNote = (args) => {
    if (!args.n)
        throw new Error("Note title is not provided");
    const note = new notes_1.Note({ title: args.n, details: args.d, category: args.c });
};
const getNoteData = (filepath) => {
    let rawData = fs_1.default.readFileSync("./notes.json");
    let notesData = JSON.parse(rawData.toString());
};
