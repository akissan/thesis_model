import chalk from "chalk";
import { MAX_SIM_TIME } from "../parameters";
import { Block, BlockID } from "./block";
import { PageID } from "./pages";
import { Schedule } from "./schedule";
import { Unit, UnitID } from "./unit";

export type Tick = number;

export class StatManager {
  schedule?: Schedule;
  tables: {
    unitBlockTimings: {
      unitTranfersByTime: Map<Tick, Array<{ unit: UnitID; block: BlockID }>>;
    };
    unitStartFinish: Record<UnitID, { start: Tick; finish: Tick }>;
  } = {
    unitBlockTimings: {
      unitTranfersByTime: new Map(),
    },
    unitStartFinish: {},
  };

  time = () => this.schedule?.currentTime ?? -999;

  stats = {
    units: {
      unitCreated: 0,
      unitFinished: 0,
    },
    pages: {
      pagesLookedUp: 0,
      pagesFoundCached: 0,
      pagesFoundNotCached: 0,
      pagesReplaced: 0,
    },
    simtime: 0,
  };

  logUnitTransfer = ({
    unit,
    blockA,
    blockB,
  }: {
    unit: Unit;
    blockA: Block;
    blockB: Block;
  }) => {
    this.print(`${unit.id} B[${blockA.id}] => B[${blockB.id}]`);
  };

  print = (msg: string) => {
    console.log(
      `[ ${chalk.yellow(
        this.time()?.toString().padStart(MAX_SIM_TIME.toString().length)
      )} ] ${msg}`
    );
  };

  logUnitCreation = (unit: Unit) => {
    // console.log();
    this.print(`${unit.id} was created`);
    this.stats.units.unitCreated += 1;
    this.tables.unitStartFinish[unit.id] = {
      start: this.time(),
      finish: -1,
    };
  };

  logSimEnd = (tick: number) => {
    // this.print(`Sim end: [ ${chalk.yellow(tick)} ]`);
    this.print(`Sim end`);
    this.stats.simtime = tick;
  };

  logUnitExit = (unit: Unit) => {
    this.print(`${unit.id} finished`);
    this.stats.units.unitFinished += 1;
    this.tables.unitStartFinish[unit.id].finish = this.time();
  };

  logFinalStats = () => {
    const unitTimes = Object.values(this.tables.unitStartFinish)
      .map(({ start, finish }) => (finish !== -1 ? finish - start : -1))
      .filter((t) => t !== -1);
    const averageUnitTime =
      unitTimes.reduce((pt, ct) => pt + ct) / unitTimes.length;

    console.log(`AVERAGE UNIT TIME: ${averageUnitTime}`);
  };

  logPageFound = (page: PageID, cached: boolean) => {
    this.stats.pages[cached ? "pagesFoundCached" : "pagesFoundNotCached"] += 1;
    this.stats.pages.pagesLookedUp += 1;
  };

  logPageReplaced = (page: PageID) => {
    this.stats.pages.pagesReplaced += 1;
  };

  logStats = () => {
    console.log(this.tables);
    console.log(this.stats);
    this.logFinalStats();
  };
}
