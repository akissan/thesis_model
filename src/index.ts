import { Block } from "./components/block";
import { BuilderBlock } from "./components/blocks/builder";
import { HandlerBlock } from "./components/blocks/handler";
import { CacheManager } from "./components/cacheManager";
import { GlobalManager } from "./components/globalManager";
import { PageID } from "./components/pages";
import { Queue } from "./components/queue";
import { Schedule } from "./components/schedule";
import { StatManager } from "./components/statManager";
import { Unit } from "./components/unit";
import { UnitGenerator } from "./components/unitGenerator";
import { MAX_SIM_TIME, PAGE_COUNT } from "./parameters";
import { randomItem, Repeat, uid } from "./tools/utils";
import { Table } from "./types/tables";

interface SIM_OPTIONS {
  UNIT_COUNT: number;
  BUILDER_COUNT: number;
  HANDLER_COUNT: number;
}

const main = (SIM_OPTIONS: SIM_OPTIONS) => {
  const unitTable: Table<Unit> = new Map();
  const blockTable: Table<Block> = new Map();

  const handlerQueue = new Queue({ id: "H_QUEUE", blockType: "handler" });
  const builderQueue = new Queue({ id: "B_QUEUE", blockType: "builder" });

  const cacheManager = new CacheManager({ cacheSize: 4 });

  const statManager = new StatManager();

  cacheManager.statManager = statManager;

  const globalManager = new GlobalManager({
    queues: [handlerQueue, builderQueue],
    tables: { unitTable, blockTable },
    cacheManager,
    statManager,
  });

  const pages: PageID[] = [];
  Repeat(PAGE_COUNT, (_, i) => (pages[i] = uid()));

  const onSpawn = (unit: Unit) => handlerQueue.push(unit);

  const unitGenerator = new UnitGenerator({ pages, onSpawn, globalManager });

  const schedule = new Schedule({ unitGenerator, statManager });

  Repeat(SIM_OPTIONS.BUILDER_COUNT, (_, i) => {
    const b = new BuilderBlock({
      id: `B${i}`,
      schedule,
      globalManager,
      queue: builderQueue,
    });
  });

  Repeat(SIM_OPTIONS.HANDLER_COUNT, (_, i) => {
    const h = new HandlerBlock({
      id: `H${i}`,
      schedule,
      globalManager,
      queue: handlerQueue,
    });
  });

  while (schedule.currentTime < MAX_SIM_TIME) schedule.step();

  statManager.logSimEnd(schedule.currentTime);
  statManager.logStats();
  return schedule.currentTime;
};

const sim_start = performance.now();
const sim_ticks = main({
  BUILDER_COUNT: 2,
  HANDLER_COUNT: 4,
  UNIT_COUNT: 50,
});
const sim_end = performance.now();

console.log(
  `--- SIM TIME: ${sim_end - sim_start} | SIM TICKS: ${sim_ticks} ---`
);
