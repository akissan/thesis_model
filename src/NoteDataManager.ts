import fs from "fs";
import { appData } from "./defaultPath";
import { Note, NotesData } from "./notes";
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
    const path = filepath ?? this.path;
    fs.writeFileSync(path, JSON.stringify(this.data));
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
}
