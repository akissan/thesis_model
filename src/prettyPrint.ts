import chalk from "chalk";
import { Note } from "./notes";

const spacer = " ".padStart(2);

export const printNote = (note: Note) => {
  return `${spacer}${note.title.padEnd(32)} [ ${chalk.blue(
    note.category
  )} ]\r\n${spacer}${chalk.yellowBright(note.details)}`;
};
