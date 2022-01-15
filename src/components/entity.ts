import { GLOBAL_OPTIONS } from "..";
import { uid } from "../tools/utils";
import { Schedule } from "./schedule";

export type BaseEntityProps = {
  id?: Entity["id"];
};

export type EntityID = Entity["id"];

export default class Entity {
  id: string;

  static global_options: typeof GLOBAL_OPTIONS;

  static init = (global_options: typeof Entity.global_options) => {
    Entity.global_options = global_options;
  };
  static schedule: Schedule;

  constructor({ id }: BaseEntityProps) {
    this.id = id ?? uid(Entity.global_options.id_length);
  }
}
