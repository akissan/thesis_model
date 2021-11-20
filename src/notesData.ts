import chalk from "chalk";
import fs from "fs";
import { Argv } from ".";
import { appData } from "./defaultPath";
import NoteDataManager from "./NoteDataManager";
import { Note, NoteID, NotesData } from "./notes";
import { log } from "./utils";

export class Notes {
  private _noteDataManager: NoteDataManager;
  public save: Function;

  constructor(filepath?: fs.PathLike) {
    this._noteDataManager = new NoteDataManager(filepath);
    this.save = this._noteDataManager.writeNoteData;
  }

  public getNotes = (args: Argv) => {
    const category = args.list;
    const id = args.id ?? args._[0];

    if (category) {
      log("Notes in category [ " + chalk.blue(category) + " ]");
      const categoryData = this._noteDataManager.data.categories[category];
      if (!categoryData) throw new Error("Seems lika a wrong category...");
      return categoryData.notes.map((noteId) => this.getNote(noteId));
    }

    if (id) {
      log("Note with id [ " + chalk.magenta(id) + " ]");
      return this.getNote(id);
    }

    log("Dumping everything: ");
    return this._noteDataManager.data;
  };

  public getNote = (id: NoteID) => {
    const note = this._noteDataManager.data.notes[id];
    if (!note) throw new Error("There is no note with a such ID");
    return note;
  };

  public createNewNote = (args: Argv) => {
    const { title, details, category } = args;
    if (!title) throw new Error("Note title is not provided");

    const note = new Note({ title, details: args.d, category: args.c });
    this._noteDataManager.addNewNoteToData(note, args.f);
    log("Noted!", note);
  };
}
