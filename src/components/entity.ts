import { GLOBAL_OPTIONS } from "..";
import { uid } from "../tools/utils";

export type BaseEntityProps = {
  id?: Entity["id"];
};

export default class Entity {
  id: string;

  static global_options: typeof GLOBAL_OPTIONS;
  static table: Map<Entity["id"], Entity>;

  static init = ({
    table,
    GLOBAL_OPTIONS,
  }: {
    table: typeof Entity.table;
    GLOBAL_OPTIONS: typeof Entity.global_options;
  }) => {
    this.table = table;
    this.global_options = GLOBAL_OPTIONS;
  };

  constructor({ id }: BaseEntityProps) {
    this.id = id ?? uid(Entity.global_options.id_length);
    Entity.table.set(this.id, this);
  }
}
