import Entity, { EntityID } from "./components/entity";
import Process, { ProcessID } from "./components/process";
import { Queue } from "./components/queue";
import Unit, { UnitID } from "./components/unit";

export type StatTime = typeof Statserver["time"];

export type UnitLocation = {
  unitID: UnitID;
  entityID: EntityID;
};
export type UnitStamp = {
  time: StatTime;
  unitID: UnitID;
};
export type EntityStamp = {
  time: StatTime;
  entityID: EntityID;
};
export type UnitProcess = {
  unitID: UnitID;
  processID: ProcessID;
};
export type ProcessStamp = {
  time: StatTime;
  processID: ProcessID;
};

export class Statserver {
  static time: number = 0;

  static event_table: {
    travelMap: {
      byTime: Record<StatTime, UnitLocation[]>;
      byEntityID: Record<EntityID, UnitStamp[]>;
      byUnitID: Record<UnitID, EntityStamp[]>;
    };
    processMap: {
      byTime: Record<StatTime, UnitProcess[]>;
      byUnit: Record<UnitID, ProcessStamp[]>;
      byEntity: Record<EntityID, ProcessStamp[]>;
    };
  } = {
    travelMap: {
      byEntityID: {},
      byTime: {},
      byUnitID: {},
    },
    processMap: {
      byTime: {},
      byUnit: {},
      byEntity: {},
    },
  };

  static tick = (deltaTime: number = 1) => (this.time += deltaTime);

  static setTime = (time: StatTime) => (this.time = time);

  static addTravelMapEntry = (
    time: StatTime,
    { unitID, entityID }: UnitLocation
  ) => {
    const addByTime = (time: StatTime, ul: UnitLocation) =>
      (this.event_table.travelMap.byTime[time] ??= []).push(ul);
    const addByEntity = (entityID: EntityID, us: UnitStamp) =>
      (this.event_table.travelMap.byEntityID[entityID] ??= []).push(us);
    const addByUnit = (unitID: UnitID, es: EntityStamp) =>
      (this.event_table.travelMap.byUnitID[unitID] ??= []).push(es);

    addByTime(time, { unitID, entityID });
    addByEntity(entityID, { time, unitID });
    addByUnit(unitID, { time, entityID });
  };

  static addProcessMapEntry = (
    time: StatTime,
    { unitID, processID }: UnitProcess
  ) => {
    const addByTime = (time: StatTime, up: UnitProcess) =>
      (this.event_table.processMap.byTime[time] ??= []).push(up);

    const addByUnit = (unitID: UnitID, ps: ProcessStamp) =>
      (this.event_table.processMap.byUnit[unitID] ??= []).push(ps);

    const addByEntity = (entityID: EntityID, ps: ProcessStamp) =>
      (this.event_table.processMap.byEntity[entityID] ??= []).push(ps);

    addByTime(time, { unitID, processID });
    addByUnit(unitID, { time, processID });

    const entityID = Process.table.get(processID)?.parentBlock?.id;
    if (entityID) {
      addByEntity(entityID, { time, processID });
    }
  };

  static reportTravel = (ul: UnitLocation) =>
    this.addTravelMapEntry(this.time, ul);

  static reportProcessChange = (up: UnitProcess) => {
    this.addProcessMapEntry(this.time, up);
  };
}
