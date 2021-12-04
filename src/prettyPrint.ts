import chalk from "chalk";
import { Block, Unit } from ".";

const randomColors = [
  chalk.greenBright,
  chalk.yellowBright,
  chalk.magentaBright,
  chalk.blueBright,
  chalk.cyanBright,
];

const colorTable: Record<string, Function> = {};

const rndClr = (str: string = "") => {
  if (!colorTable[str]) {
    let ri = Math.floor(Math.random() * randomColors.length);
    colorTable[str] = randomColors[ri];
  }
  return colorTable[str](str);
};

const block = (block: Block) => {
  const info = [];
  info.push(chalk.yellow(block.id).padStart(6));
  info.push(chalk.green(block.name).padStart(8));
  info.push(chalk.redBright(block.process?.name ?? " ").padStart(20));
  info.push(
    (block.status === "idle" ? chalk.gray : chalk.greenBright)(block.status)
  );
  return info.join(" ");
};

const unit = (unit: Unit) => {
  const info = [];
  info.push(chalk.yellowBright(unit.id));
  info.push(chalk.greenBright(unit.state));
  return info.join(" ");
};

export const pp = { block, unit };
