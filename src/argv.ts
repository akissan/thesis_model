import yargs from "yargs";
import { log } from "./utils";

export const argvOptions = {
  title: { type: "string", alias: "n" },
  category: { type: "string", alias: "c", default: "" },
  details: { type: "string", alias: "d", default: "" },
  force: { type: "boolean", alias: "f", default: false },
  filepath: { type: "string", alias: "p" },
  list: { type: "string", alias: "l" },
  id: { type: "string", alias: "i" },
  newCategory: { type: "string", alias: "C" },
} as const;

export const initArgs = (options: typeof argvOptions) => {
  const args = yargs(process.argv.slice(2)).options(options).parseSync();
  log("ARGS: ", args);
  return args;
};
