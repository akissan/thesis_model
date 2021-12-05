import chalk from "chalk";
import crypto from "crypto";
import { inspect } from "util";

export const uid = (uid_length: number = 3) => {
  return crypto.randomBytes(uid_length).toString("hex");
};

export const logError = (err: unknown) => {
  // if (global.VERBOSE) {
  const inspection = inspect(err, { colors: true, compact: false }).split("\n");
  console.error(chalk.bold.red(inspection[0]));
  console.error(inspection.slice(1, -1).join("\n"));
  // } else {
  console.error(chalk.bold.red(err));
  // }
};

export const clog = console.log;
