import { uid } from "./utils";

export type NoteID = string | number;

export type Category = {
  name: string;
  notes: NoteID[];
};

export type NoteT = {
  title: string;
  details?: string;
  category?: string;
};

export type NotesData = {
  categories: Record<string, Category>;
  notes: Record<NoteID, Note>;
};

export class Note {
  public title: string = "";
  public details?: string;
  public category?: string;

  public id: string = "0";
  constructor(noteInitData: NoteT) {
    Object.assign(this, noteInitData);
    this.id = uid();
  }
}
