import { BlockID } from "./blocks";
import { ProcessID } from "./process";

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
    | "received";
  //   currentOccupation: null | BlockID;
  data?: any;
};
