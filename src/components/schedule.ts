import { GLOBALS } from "../globals";
import { MAX_SIM_TIME } from "../parameters";
import { Repeat } from "../tools/utils";
import { Process } from "./process";
import { StatManager } from "./statManager";
import { UnitGenerator } from "./unitGenerator";

export class Schedule {
  events = new Map<number, Process[]>();
  unhandledTicks: number[] = [];
  currentTime = 0;
  unitGenerator: UnitGenerator;
  statManager: StatManager;

  constructor({
    unitGenerator,
    statManager,
  }: {
    unitGenerator: Schedule["unitGenerator"];
    statManager: Schedule["statManager"];
  }) {
    this.unitGenerator = unitGenerator;
    this.statManager = statManager;
    this.statManager.schedule = this;
  }

  addTick = (tick: number) => {
    GLOBALS.VERBOSE && console.log(tick, " is being added to schedule");
    if (this.unhandledTicks.length === 0) {
      this.unhandledTicks = [tick];
      return;
    }

    if (tick < this.unhandledTicks[0]) {
      this.unhandledTicks.unshift(tick);
      return;
    }

    if (tick > this.unhandledTicks[this.unhandledTicks.length - 1]) {
      this.unhandledTicks.push(tick);
      return;
    }

    if (!this.unhandledTicks.includes(tick)) {
      this.unhandledTicks.push(tick);
      this.unhandledTicks.sort((a, b) => a - b); // KEKW
    }
    GLOBALS.VERBOSE && console.log(tick, " was added to schedule");
  };

  addNewProcess = (p: Process) => {
    const processEndTime = this.currentTime + p.time;
    this.addTick(processEndTime);

    this.events.set(processEndTime, [
      ...(this.events.get(processEndTime) ?? []),
      p,
    ]);
    GLOBALS.VERBOSE && console.log(this.currentTime, p.id, "added to schedule");
  };

  // spawnStep = (nextTime) => {
  //   const
  // }

  // getNearestTime = () => {
  //   const nextSpawnTime =
  // }

  // stepSpawns = () => {

  // }
  getNearestTime = () => {
    const times = [
      this.unhandledTicks[0] ?? Number.MAX_VALUE,
      this.unitGenerator.nextSpawn,
    ];
    return Math.min(...times);
  };

  stepSpawns = (time: number) => {
    if (time !== this.unitGenerator.nextSpawn) return;
    this.unitGenerator.generate();
  };

  stepProcessses = (time: number) => {
    if (time !== this.unhandledTicks[0]) return;

    this.unhandledTicks.shift();
    const processes = this.events.get(this.currentTime);
    if (!processes) throw new Error("Undefined step in schedule map");
    processes.forEach((p) => p.finish());

    GLOBALS.VERBOSE &&
      console.log(
        "NEW STEP: ",
        this.currentTime,
        "current processes:",
        processes.map((p) => p.id)
      );
  };

  step = () => {
    // console.log("STEPPING: ", this.currentTime);
    const nextTime = this.getNearestTime();
    // console.log("NEAREST TIME", nextTime);
    this.currentTime = nextTime;

    this.stepSpawns(nextTime);
    this.stepProcessses(nextTime);
  };
}
