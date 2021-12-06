import Entity, { BaseEntityProps } from "./entity";
import { ResponseState } from "./response";

export type UnitID = Unit["id"];

export type UnitTable = Map<UnitID, Unit>;

export default class Unit extends Entity {
  state: ResponseState;

  static table: UnitTable;
  static setTable = (table: typeof Unit.table) => {
    Unit.table = table;
  };

  constructor(props?: BaseEntityProps) {
    super({ ...props });
    this.state = "new";

    Unit.table.set(this.id, this);
  }
}
