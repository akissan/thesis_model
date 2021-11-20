#!/usr/bin/env node
import chalk from "chalk";
import fs from "fs";
import yargs from "yargs";
import { Task, TasksData } from "./tasks";

const argv = yargs(process.argv.slice(2))
  .options({
    n: { type: "string" },
    c: { type: "string" },
    d: { type: "string" },
  })
  .parseSync();

console.log("argv", argv);

const log = console.log;

let rawData = fs.readFileSync("./tasks.json");
let tasksData: TasksData = JSON.parse(rawData.toString()) as TasksData;

//log(tasksData);
for (const categoryID in tasksData.categories) {
  const category = tasksData.categories[categoryID];
  log(chalk.blue(category.name));
  log(category);
  // log
}

console.log(tasksData.tasks);

const parseArgs = (args: typeof argv) => {
  if (argv.n) {
    const task = new Task({ title: argv.n, details: argv.d, category: argv.c });
    if (argv.c) {
      const category = tasksData.categories[argv.c as any];
      if (category) {
        category.tasks.push(task.id);
      } else {
        return console.error("There is no such category...");
      }
    }
    tasksData.tasks[task.id] = task;
  }
};

fs.writeFileSync("./tasks.json", JSON.stringify(tasksData));
