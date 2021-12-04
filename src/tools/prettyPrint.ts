import chalk from "chalk";
import Block from "../components/block";
import Process from "../components/process";
import Unit from "../components/unit";

const randomColors = [
  // chalk.greenBright,
  chalk.yellow,
  // chalk.black,
  // chalk.blueBright,
  chalk.cyan,
  chalk.green,
  chalk.white,
  chalk.blue,
];

const colorTable: Record<string, Function> = {};

const rndClr = (str: string = "") => {
  if (!colorTable[str]) {
    let ri = Math.floor(Math.random() * randomColors.length);
    colorTable[str] = randomColors[ri];
  }
  return chalk.bgBlackBright(colorTable[str](str));
};

const block = ({ id, name, process, status }: Block) => {
  const info = [chalk.greenBright("Block  ")];
  info.push(rndClr(id).padStart(6));
  info.push(chalk.green(name).padStart(8));
  info.push(chalk.blue(process?.name ?? " ").padStart(20));
  info.push((status === "idle" ? chalk.gray : chalk.greenBright)(status));
  return info.join(" ");
};

const unit = ({ id, state }: Unit) => {
  const info = [chalk.magenta("Unit  ")];
  info.push(rndClr(id));
  info.push(chalk.greenBright(state));
  return info.join(" ");
};

const process = ({ id, name, status, timeLeft, unit }: Process) => {
  const info = [chalk.blue("Process")];
  info.push(rndClr(id));
  info.push(chalk.blue(name ?? " ").padStart(20));
  info.push(chalk.yellowBright(timeLeft).padStart(3));

  return info.join(" ");
};

export const pp = { block, unit, process };
