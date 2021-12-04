import { uid } from "../tools/utils";
import { ResponseState } from "./response";

export type UnitID = string;

export type UnitTable = Map<UnitID, Unit>;

export default class Unit {
  id: UnitID;
  state: ResponseState;

  static unitTable: UnitTable;

  static init = ({ unitTable }: { unitTable: typeof Unit.unitTable }) => {
    Unit.unitTable = unitTable;
  };

  constructor() {
    this.id = uid();
    this.state = "new";

    Unit.unitTable.set(this.id, this);
  }
}
