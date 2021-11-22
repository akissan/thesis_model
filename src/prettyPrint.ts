import chalk from "chalk";
import { number } from "yargs";
import { Category, Note } from "./notes";

const spacer = " ".padStart(2);

interface PrintOptions {
  printCategory?: boolean;
  printOneLine?: boolean;
  descriptionLimit?: number;
  titlePadding?: number;
  printDescription?: boolean;
  printID?: boolean;
}

const truncate = (str: string, limit: number) =>
  limit && str.length > limit ? `${str.substring(0, limit)}…` : str;

export const printNote = (
  note: Note,
  {
    printCategory = true,
    printOneLine = false,
    descriptionLimit = 0,
    titlePadding = 30,
    printDescription = true,
    printID = true,
  }: PrintOptions = {}
) => {
  let res = "";
  if (printID) res += `${spacer}${chalk.magenta(note.id)}`;
  res += `${spacer}${note.title.padEnd(titlePadding)}${spacer}`;
  if (printCategory) res += ` [ ${chalk.blue(note.category)} ] `;
  if (!printOneLine) res += `\r\n${spacer}`;
  if (printDescription)
    res += `${chalk.gray(truncate(note.details ?? "", descriptionLimit))}`;
  return res;
};

// export const printCategory = (category: Category)
