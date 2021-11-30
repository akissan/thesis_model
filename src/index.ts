#!/usr/bin/env node

import { SIM_TIME } from "./parameters";
import { Schedule, ScheduleEntry } from "./schedule";
import { copyState, initState } from "./state";
import { UnitID } from "./unit";
import { argvOptions, initArgs } from "./util/argv";
import { log, logError, uid } from "./util/utils";

const argv = initArgs(argvOptions);
export type Argv = typeof argv;

export type Block = any;

export type Unit = {
  id: UnitID;
  timeInSystem: number;
  taskTime: number;
  currentBlock: Block;
};

const process = ({ state, activeUnits }: ScheduleEntry): ScheduleEntry => {
  for (const unit in activeUnits) {
    // console.log();
  }

  const newState = copyState(state);
  const newActiveUnits: UnitID[] = [];

  return { state: newState, activeUnits: newActiveUnits };
};

const main = () => {
  const initUnit: Unit = {
    id: uid(),
    timeInSystem: 0,
    currentBlock: null,
  };

  const unitTable: Record<UnitID, Unit> = {
    [initUnit.id]: initUnit,
  };

  const scheduleManager = new Schedule({
    state: { ...initState, ...{ request_queue: [] } },
    activeUnits: [initUnit.id],
  });

  for (let t = 0; t < SIM_TIME; t++) {
    console.log(`[ ${t.toString().padStart(4)} ]`);
    const currentStep = scheduleManager.schedule[t];
    // const newStep = process(currentStep, unitTable);

    scheduleManager.schedule.push(newStep);
  }
};

main();
