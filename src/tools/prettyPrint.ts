import chalk from "chalk";
import Block from "../components/block";
import Process from "../components/process";
import Unit from "../components/unit";

const randomColors = [
  // chalk.greenBright,
  chalk.yellow,
  // chalk.black,
  // chalk.blueBright,
  chalk.magenta,
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
  return chalk(colorTable[str](str));
};

const block = ({ id, name, process, status }: Block) => {
  const info = [chalk.greenBright("Block  ")];
  info.push(chalk.bgBlack(rndClr(id).padStart(6)));
  info.push(chalk.green(name).padStart(8));
  info.push(chalk.blue(process?.name ?? " ").padStart(20));
  info.push((status === "idle" ? chalk.gray : chalk.greenBright)(status));
  return info.join(" ");
};

const unit = ({ id, state }: Unit) => {
  const info = [chalk.magenta("Unit  ")];
  info.push(chalk.bgBlack(rndClr(id)));
  info.push(chalk.greenBright(state));
  return info.join(" ");
};

const process = ({ id, name, status, timeLeft, unit, totalTime }: Process) => {
  const info = [chalk.blue("Process")];
  info.push(chalk.bgBlack(rndClr(id)));
  info.push(rndClr((name ?? " ").padStart(22)));
  info.push(
    chalk.yellowBright(timeLeft.toString().padStart(3)) +
      "/" +
      chalk.yellow(totalTime.toString().padEnd(3))
  );

  return info.join(" ");
};

export const pp = { block, unit, process };
