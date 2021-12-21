import chalk from "chalk";
import crypto from "crypto";
import { inspect } from "util";
// import { tableMap } from "./tableMap";

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

export const Repeat = (
  n: number,
  callback: Parameters<typeof Array["prototype"]["forEach"]>[0]
) => [...Array(n)].forEach(callback);

export const clog = console.log;

export const randomItem = <T>(arr: Array<T>) =>
  arr[Math.floor(Math.random() * arr.length)];
