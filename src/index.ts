import { inspect, isBoolean } from "util";
import { ResponseState } from "./components/response";
import { PROCESS_TIMES } from "./parameters";
import { randomItem, Repeat, uid } from "./tools/utils";

const GLOBALS = {
  VERBOSE: false,
};

type PageID = string;
class CacheManager {
  cache: Map<PageID, boolean> = new Map();
  isCached = (pageID: PageID) => this.cache.get(pageID) ?? false;
  setCached = (pageID: PageID) => this.cache.set(pageID, true);
}

class Schedule {
  events = new Map<number, Process[]>();
  unhandledTicks: number[] = [];
  currentTime = 0;
  //   nextTime = 0;

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

  step = () => {
    const nextTime = this.unhandledTicks.shift();
    if (!nextTime) throw new Error("Next time was not found in schedule");
    this.currentTime = nextTime;
    const processes = this.events.get(this.currentTime);
    if (!processes) throw new Error("Undefined step in schedule map");
    GLOBALS.VERBOSE &&
      console.log(
        "NEW STEP: ",
        this.currentTime,
        "current processes:",
        processes.map((p) => p.id)
      );
    processes.forEach((p) => p.finish());
  };
}

type Table<T> = Map<string, T>;

const pages: PageID[] = Array(5).map((_) => uid());

class Unit {
  id: string;
  stage: ResponseState = "new";

  pageID: PageID = randomItem(pages);

  requiredBlockType: "handler" | "builder" | "exit" = "handler";
  constructor({ id }: { id: Unit["id"] }) {
    this.id = id;
  }
}

class Process {
  id: string;
  name: string;
  time: number;
  onFinish: (() => void) | undefined;
  unit: Unit;
  block: Block;
  //   globalManager: GlobalManager;
  blockOccupe: boolean = true;

  nextStage: Unit["stage"];
  nextBlock: Unit["requiredBlockType"];

  finish = () => {
    GLOBALS.VERBOSE && console.log(this.id, "finishing");
    this.onFinish?.();

    this.unit.stage = this.nextStage;
    this.unit.requiredBlockType = this.nextBlock;

    this.block.handle(this.unit);
    GLOBALS.VERBOSE && console.log(this.id, "finished");
  };

  constructor({
    name,
    time,
    onFinish,
    nextStage,
    nextBlock,
    unit,
    block,
    blockOccupe,
  }: {
    name: Process["name"];
    time: Process["time"];
    onFinish?: Process["onFinish"];
    nextStage: Process["nextStage"];
    nextBlock: Process["nextBlock"];
    unit: Process["unit"];
    block: Process["block"];
    blockOccupe?: Process["blockOccupe"];
  }) {
    this.name = name;
    this.time = time;
    // this.id = uid();
    this.id = `${name}_${unit.id}_${block.id}_${uid()}`;
    this.onFinish = onFinish;

    this.nextBlock = nextBlock;
    this.nextStage = nextStage;

    this.unit = unit;
    this.block = block;

    if (typeof blockOccupe === "boolean") this.blockOccupe = blockOccupe;
  }
}

class GlobalManager {
  finishedUnits: Unit[] = [];
  queues: Map<Unit["requiredBlockType"], Queue> = new Map();
  tables: {
    blockTable: Table<Block>;
    unitTable: Table<Unit>;
  };
  cacheManager: CacheManager;

  findQueueForType = (reqType: Exclude<Unit["requiredBlockType"], "exit">) => {
    const queue = this.queues.get(reqType);
    if (!queue) throw new Error(`Queue for blockType ${reqType} was not found`);
    return queue;
  };

  constructor({
    tables,
    queues,
    cacheManager,
  }: {
    tables: GlobalManager["tables"];
    queues: Queue[];
    cacheManager: GlobalManager["cacheManager"];
  }) {
    this.tables = tables;
    this.cacheManager = cacheManager;
    queues.forEach((q) => this.queues.set(q.blockType, q));
  }
}

abstract class Block {
  id: string;
  blockType: string = "base";
  status: "busy" | "idle" = "idle";
  currentProcess: Process["id"] | undefined = undefined;
  schedule: Schedule;
  globalManager: GlobalManager;
  queue: Queue;

  abstract decideProcess: (unit: Unit) => Process;

  handle = (unit: Unit) => {
    if (unit.requiredBlockType == this.blockType) {
      this.assignProcess(unit);
      return;
    }

    if (unit.requiredBlockType === "exit") {
      this.globalManager.finishedUnits.push(unit);
    } else {
      const queue = this.globalManager.findQueueForType(unit.requiredBlockType);
      queue.push(unit);
    }
    this.free();
  };

  assignProcess = (unit: Unit) => {
    const p = this.decideProcess(unit);
    this.status = "busy";
    this.currentProcess = p.id;
    this.schedule.addNewProcess(p);
  };

  free = () => {
    this.status = "idle";
    this.currentProcess = undefined;
    this.queue.onBlockFreed(this);
  };

  constructor({
    id,
    schedule,
    globalManager,
    queue,
  }: {
    id: Block["id"];
    schedule: Block["schedule"];
    globalManager: Block["globalManager"];
    queue: Block["queue"];
  }) {
    this.id = id;
    this.schedule = schedule;
    this.globalManager = globalManager;
    this.queue = queue;

    this.queue.blocks.push(this);
  }
}

class Queue {
  id: string;
  blocks: Block[] = [];
  units: Unit[] = [];
  blockType: Unit["requiredBlockType"];

  constructor({
    id,
    blockType,
  }: {
    id: Queue["id"];
    blockType: Queue["blockType"];
  }) {
    this.id = id;
    this.blockType = blockType;
  }

  findAvailableBlock = () => {
    const freeBlock = this.blocks.find((block) => block.status === "idle");
    return freeBlock;
  };

  onBlockFreed = (b: Block) => {
    GLOBALS.VERBOSE &&
      console.log(`${b.id} freed, so ${this.id} is looking for unit`);
    const unit = this.units.shift();
    if (unit) b.handle(unit);
    GLOBALS.VERBOSE &&
      console.log(`${this.id} found and assigned ${unit?.id} to ${b.id}`);
  };

  push = (unit: Unit) => {
    const freeBlock = this.findAvailableBlock();
    if (freeBlock) {
      GLOBALS.VERBOSE &&
        console.log(unit.id, "redirected to", freeBlock.id, "by", this.id);
      freeBlock.handle(unit);
    } else {
      GLOBALS.VERBOSE && console.log(unit.id, "pushed to ", this.id);
      this.units.push(unit);
    }
  };
}

class BuilderBlock extends Block {
  blockType = "builder";

  decideProcess: (unit: Unit) => Process = (unit) => {
    switch (unit.stage) {
      case "not_cached":
        return new Process({
          name: "prebuilding",
          time: PROCESS_TIMES.building_start,
          unit,
          nextBlock: "builder",
          nextStage: "prebuilded",
          block: this,
        });
      case "prebuilded":
        return new Process({
          name: "hydration",
          time: PROCESS_TIMES.api_call,
          unit,
          nextBlock: "builder",
          nextStage: "hydrated",
          block: this,
          //   blockOccupe: false,
        });
      case "hydrated":
        return new Process({
          name: "building",
          time: PROCESS_TIMES.building_end,
          unit,
          nextBlock: "builder",
          nextStage: "builded",
          block: this,
        });
      case "builded":
        return new Process({
          name: "caching",
          time: PROCESS_TIMES.writing_to_cache,
          unit,
          nextBlock: "handler",
          nextStage: "cached",
          block: this,
          onFinish: () =>
            this.globalManager.cacheManager.setCached(unit.pageID),
        });
    }
    throw new Error("Builder block cant deicde");
  };
}

class HandlerBlock extends Block {
  blockType = "handler";

  decideProcess: (unit: Unit) => Process = (unit) => {
    switch (unit.stage) {
      case "new":
        return new Process({
          name: "connection",
          time: PROCESS_TIMES.connection,
          unit,
          nextStage: "connected",
          nextBlock: "handler",
          block: this,
        });
      case "connected": {
        // let isCached = Math.random() < 0.6;
        let isCached = this.globalManager.cacheManager.isCached(unit.pageID);
        return new Process({
          name: "parsing",
          time: PROCESS_TIMES.parsing,
          unit,
          //   nextStage: isCached ? "cached" : "not_cached",
          //   nextBlock: isCached ? "handler" : "builder",
          nextStage: isCached ? "cached" : "not_cached",
          nextBlock: isCached ? "handler" : "builder",
          block: this,
        });
      }
      case "cached":
        return new Process({
          name: "crafting",
          time: PROCESS_TIMES.response_crafting,
          unit,
          nextStage: "crafted",
          nextBlock: "handler",
          block: this,
        });
      case "crafted":
        return new Process({
          name: "sending",
          time: PROCESS_TIMES.sending,
          unit,
          nextStage: "sended",
          nextBlock: "exit",
          block: this,
        });
    }
    throw new Error("Handler block cant decide");
  };
}

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

  const cacheManager = new CacheManager();

  const globalManager = new GlobalManager({
    queues: [handlerQueue, builderQueue],
    tables: { unitTable, blockTable },
    cacheManager,
  });

  const schedule = new Schedule();

  Repeat(SIM_OPTIONS.UNIT_COUNT, (_, i) => {
    const u = new Unit({ id: `U${i}` });
    unitTable.set(u.id, u);
  });

  Repeat(SIM_OPTIONS.BUILDER_COUNT, (_, i) => {
    const b = new BuilderBlock({
      id: `B${i}`,
      schedule,
      globalManager,
      queue: builderQueue,
    });
    blockTable.set(b.id, b);
  });

  Repeat(SIM_OPTIONS.HANDLER_COUNT, (_, i) => {
    const h = new HandlerBlock({
      id: `H${i}`,
      schedule,
      globalManager,
      queue: handlerQueue,
    });
    blockTable.set(h.id, h);
  });

  unitTable.forEach((unit) => handlerQueue.push(unit));

  while (globalManager.finishedUnits.length !== SIM_OPTIONS.UNIT_COUNT)
    schedule.step();
  return schedule.currentTime;
};

const sim_start = performance.now();
const sim_ticks = main({
  BUILDER_COUNT: 2,
  HANDLER_COUNT: 4,
  UNIT_COUNT: 100,
});
const sim_end = performance.now();

console.log(
  `--- SIM TIME: ${sim_end - sim_start} | SIM TICKS: ${sim_ticks} ---`
);
