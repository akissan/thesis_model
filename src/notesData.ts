import fs from "fs";
import { Argv } from ".";
import { Note, NotesData } from "./notes";

const createNewNote = (args: Argv) => {
    if (!args.n) throw new Error("Note title is not provided");

    const note = new Note({ title: args.n, details: args.d, category: args.c })
};

const getNoteData = (filepath: fs.PathOrFileDescriptor) => {
  let rawData = fs.readFileSync("./notes.json");
  let notesData: NotesData = JSON.parse(rawData.toString()) as NotesData;
};
