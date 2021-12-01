import chalk from "chalk";

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
