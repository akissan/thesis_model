import { uid } from "./utils";

type TaskID = string | number;

export type Category = {
  name: string;
  tasks: TaskID[];
};

export type TaskT = {
  title: string;
  details?: string;
  category?: string;
};

export type TasksData = {
  categories: Record<string, Category>;
  tasks: Record<TaskID, Task>;
};

export class Task {
  public title: string = "";
  public details?: string = "";
  public id: string = "0";
  public category?: string = "";

  constructor(taskInitData: TaskT) {
    Object.assign(this, taskInitData);
    this.id = uid();
  }
}
