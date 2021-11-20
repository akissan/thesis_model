import yargs from "yargs";

export type ArgsOptions = { [key: string]: yargs.Options };

export const initArgs = (options: ArgsOptions) => {
  const argv = yargs(process.argv.slice(2)).options(options).parseSync();

  return argv;
};
