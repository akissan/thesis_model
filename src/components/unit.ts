import { uid } from "../tools/utils";
import Entity, { BaseEntityProps } from "./entity";
import { ResponseState } from "./response";

export type UnitID = Unit["id"];

export type UnitTable = Map<UnitID, Unit>;

export default class Unit extends Entity {
  state: ResponseState;

  static table: UnitTable;

  constructor(props?: BaseEntityProps) {
    super({ ...props });
    this.state = "new";
  }
}
