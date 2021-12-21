import yargs from "yargs";

export const argvOptions = {
  id_length: {
    type: "number",
    alias: "i",
    describe: "ID length",
    group: "Minor",
  },
  units: {
    type: "number",
    alias: "u",
    describe: "Unit count",
    group: "Model parameters",
  },
  handlers: {
    type: "number",
    alias: "h",
    describe: "Handler count",
    group: "Model parameters",
  },
  builders: {
    type: "number",
    alias: "b",
    describe: "Builder count",
    group: "Model parameters",
  },
  // id: {
  //   type: "string",
  //   alias: "i",
  //   describe: "Get note with ID",
  //   group: "Output",
  // },
  // newCategory: {
  //   type: "string",
  //   alias: "C",
  //   describe: "New category",
  //   group: "New category",
  // },
  // D: {
  //   type: "boolean",
  //   describe: "Print description",
  //   group: "Print options",
  //   default: false,
  // },
  // noID: {
  //   type: "boolean",
  //   describe: "Do not print IDs",
  //   group: "Print options",
  //   default: false,
  // },
  // force: { type: "boolean", alias: "f", default: false },
  // filepath: { type: "string", alias: "p", describe: "Note file" },
  verbose: { type: "boolean", alias: "v", default: false },
} as const;

export const initArgs = (options: typeof argvOptions) => {
  const args = yargs(process.argv.slice(2))
    .usage("$0 <NoteID>")
    .options(options)
    .parseSync();

  global.VERBOSE = args.verbose;
  // global.VERBOSE = true;
  // if (global.VERBOSE) log("ARGS: ", args);
  return args;
};
