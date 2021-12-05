import chalk from "chalk";
import Block from "../components/block";
import Process from "../components/process";
import Unit, { UnitTable } from "../components/unit";
import { BlockTable, ProcessTable } from "../types/tables";

const randomColors = [
  // chalk.greenBright,
  chalk.yellow,
  // chalk.black,
  // chalk.blueBright,
  chalk.magenta,
  chalk.cyan,
  chalk.green,
  // chalk.white,
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

  if (process?.unit) {
    info.push(chalk.yellow(process?.unit.id));
  }
  return info.join(" ");
};

const unit = ({ id, state }: Unit) => {
  const info = [chalk.magenta("Unit   ")];
  info.push(chalk.bgBlack(rndClr(id).padStart(6)));
  info.push(chalk.greenBright(state));
  return info.join(" ");
};

const process = ({ id, name, status, timeLeft, unit, totalTime }: Process) => {
  const info = [chalk.blue("Process")];
  info.push(chalk.bgBlack(rndClr(id)));
  info.push(rndClr((name ?? " ").padStart(11)));
  info.push(
    chalk.blue(timeLeft.toString().padStart(3)) +
      "/" +
      chalk.yellow(totalTime.toString().padEnd(3))
  );
  info.push(chalk.green(unit.id));

  return info.join(" ");
};

export const tableMap = (
  table: UnitTable | ProcessTable | BlockTable,
  options: { logInactiveProcesses?: boolean } = { logInactiveProcesses: false }
) => {
  // if (typeof table === typeof UnitTable)
  const result = [];
  for (const [_, entity] of table) {
    if (entity instanceof Unit) {
      result.push(unit(entity));
    }
    if (entity instanceof Process) {
      if (
        entity.status === "processing" ||
        (entity.status === "finished" && options.logInactiveProcesses)
      )
        result.push(process(entity));
    }
    if (entity instanceof Block) {
      result.push(block(entity));
    }
  }
  return result.length > 0 ? result.join("\n") : "Table is empty";
};

export const pp = { block, unit, process };
