import { BlockID } from "./blocks";
import { ProcessID } from "./process";
import { uid } from "./util/utils";

export type UnitID = string;

type UnitStatus = "init" | "waiting" | "processing" | "finished";

export type Unit = {
  //   time: number;
  timeInSystem: number;
  status: UnitStatus;
  id: UnitID;
  process: null | ProcessID;
  requestState:
    | "init"
    | "connected"
    | "parsed"
    | "readed"
    | "crafted"
    | "received"
    | "builded";
  //   currentOccupation: null | BlockID;
  data?: any;
};

export const newUnit = (id?: UnitID): Unit => ({
  id: id ?? uid(),
  status: "init",
  process: null,
  timeInSystem: 0,
  data: {},
  requestState: "init",
});
