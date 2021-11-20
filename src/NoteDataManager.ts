import fs from "fs";
import path from "path";
import { appData } from "./defaultPath";
import { Category, Note, NotesData } from "./notes";
import { log } from "./utils";

const getNewNoteDataObject: () => NotesData = () => ({
  categories: {},
  notes: {},
});

export default class NoteDataManager {
  public data: NotesData;

  public readonly path: fs.PathLike;

  constructor(filepath?: fs.PathLike) {
    this.path = filepath ?? appData;
    this.data = this.getNoteData();
    log("DATA: ", this.data);
  }

  getNoteData = (filepath?: fs.PathLike) => {
    const path = filepath ?? this.path;

    const isExists = fs.existsSync(path as string);

    if (!isExists) {
      console.warn("No NoteFile on this path, creating new");
      return getNewNoteDataObject();
    }

    let rawData = fs.readFileSync(path);
    let notesData: NotesData = JSON.parse(rawData.toString()) as NotesData;
    return notesData;
  };

  writeNoteData = (filepath?: fs.PathLike) => {
    filepath ??= this.path;

    const dirpath = path.dirname(filepath.toString());
    if (!fs.existsSync(dirpath)) fs.mkdirSync(dirpath, { recursive: true });
    fs.writeFileSync(filepath, JSON.stringify(this.data));
  };

  public addNewNoteToData = (note: Note, forceBehavior: boolean = false) => {
    this.data.notes[note.id] = note;

    if (note.category) {
      if (this.data.categories[note.category]) {
        this.data.categories[note.category].notes.push(note.id);
      } else {
        throw new Error("There is no such a category");
      }
    }
  };

  public addNewCategoryToData = (category: Category) => {
    if (this.data.categories[category.name])
      throw new Error("Category already exists");
    this.data.categories[category.name] = category;
  };
}
