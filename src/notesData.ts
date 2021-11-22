import chalk from "chalk";
import fs from "fs";
import { Argv } from ".";
import { appData } from "./defaultPath";
import NoteDataManager from "./NoteDataManager";
import { Category, Note, NoteID, NotesData } from "./notes";
import { printNote } from "./prettyPrint";
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

    const printOneCategory = (categoryData: Category) => {
      return categoryData.notes
        .map((noteId) =>
          printNote(this.getNote(noteId), {
            printCategory: false,
            printOneLine: true,
            descriptionLimit: 64,
            titlePadding: 2,
            printDescription: args.D,
            printID: !args.noID,
          })
        )
        .join("\r\n");
    };

    if (category) {
      log(
        chalk.greenBright("Notes in category") +
          " [ " +
          chalk.blue(category) +
          " ]"
      );
      const categoryData = this._noteDataManager.data.categories[category];
      if (!categoryData) throw new Error("Seems lika a wrong category...");
      return printOneCategory(categoryData);
    }

    if (id) {
      log(chalk.greenBright("Note with ID") + " [ " + chalk.magenta(id) + " ]");
      return printNote(this.getNote(id), { printID: false });
    }

    log(chalk.greenBright("All notes:"));
    const printedCategories = [];
    let res = "";
    for (const category in this._noteDataManager.data.categories) {
      const categoryData = this._noteDataManager.data.categories[category];
      res += chalk.blue(category) + "\r\n";
      res += printOneCategory(categoryData) + "\r\n";
      printedCategories.push(category);
    }
    const emptyCategory: Category = { name: "No category", notes: [] };
    for (const noteID in this._noteDataManager.data.notes) {
      const note = this._noteDataManager.data.notes[noteID];
      if (!note.category || !printedCategories.includes(note.category)) {
        emptyCategory.notes.push(noteID);
      }
    }

    if (emptyCategory.notes.length > 0) {
      res += chalk.blue(emptyCategory.name) + "\r\n";
      res += printOneCategory(emptyCategory);
    }

    // return this._noteDataManager.data;
    return res;
  };

  public getNote = (id: NoteID) => {
    const note = this._noteDataManager.data.notes[id];
    if (!note) throw new Error("There is no note with a such ID");
    return note;
  };

  public createNewNote = (args: Argv) => {
    const { title, details, category, force } = args;
    if (!title) throw new Error("Note title is not provided");

    const note = new Note({ title, details, category });
    this._noteDataManager.addNewNoteToData(note, force);
    log("Noted!", note);
  };

  public createNewCategory = (args: Argv) => {
    if (!args.newCategory)
      throw new Error("New category without a name? Wow...");

    const newCategory: Category = { name: args.newCategory, notes: [] };
    this._noteDataManager.addNewCategoryToData(newCategory);
  };
}
