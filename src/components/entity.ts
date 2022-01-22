import { uid } from "../tools/utils";
import { GlobalManager } from "./globalManager";

export type BaseEntityProps = {
  id?: Entity["id"];
  globalManager: Entity["globalManager"];
};

export default class Entity {
  id: string;
  globalManager: GlobalManager;

  constructor({ id, globalManager }: BaseEntityProps) {
    this.globalManager = globalManager;
    this.id = id ?? uid();
  }
}
