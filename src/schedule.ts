import { State } from "./state";
import { UnitID } from "./unit";

export type ScheduleEntry = {
  state: State;
  activeUnits: UnitID[];
};

export class Schedule {
  schedule: ScheduleEntry[];

  constructor(initSchedule: ScheduleEntry) {
    this.schedule = [initSchedule];
  }
}
