import fs from "fs";
import { ArgsOptions } from "./argv";
import { TasksData } from "./tasks";

const createNewTask = (args: ArgsOptions) => {};

const getTaskData = (filepath: fs.PathOrFileDescriptor) => {
  let rawData = fs.readFileSync("./tasks.json");
  let tasksData: TasksData = JSON.parse(rawData.toString()) as TasksData;
};
