import yargs from "yargs";
import { log } from "./utils";

export const argvOptions = {
  title: { type: "string", alias: "n" },
  c: { type: "string", default: "" },
  d: { type: "string", default: "" },
  f: { type: "boolean", default: false },
  filepath: { type: "string", alias: "p" },
  list: { type: "string", alias: "l" },
  id: { type: "string", alias: "i" },
} as const;

export const initArgs = (options: typeof argvOptions) => {
  const args = yargs(process.argv.slice(2)).options(options).parseSync();
  log("ARGS: ", args);
  return args;
};
