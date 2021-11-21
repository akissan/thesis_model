import { Note } from "./notes";

const spacer = " ".padStart(16);

export const printNote = (note: Note) => {
  console.log("wtf");
  return `${spacer}${note.title.padEnd(32)} [${note.category}]\r\n${spacer}${
    note.details
  }`;
  //   return note;
};
