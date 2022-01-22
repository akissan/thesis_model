import { Table } from "../types/tables";
import { Block } from "./block";
import { CacheManager } from "./cacheManager";
import { Queue } from "./queue";
import { StatManager } from "./statManager";
import { Unit } from "./unit";

export class GlobalManager {
  finishedUnits: Unit[] = [];
  queues: Map<Unit["requiredBlockType"], Queue> = new Map();
  tables: {
    blockTable: Table<Block>;
    unitTable: Table<Unit>;
  };
  cacheManager: CacheManager;
  statManager: StatManager;

  findQueueForType = (reqType: Exclude<Unit["requiredBlockType"], "exit">) => {
    const queue = this.queues.get(reqType);
    if (!queue) throw new Error(`Queue for blockType ${reqType} was not found`);
    return queue;
  };

  constructor({
    tables,
    queues,
    cacheManager,
    statManager,
  }: {
    tables: GlobalManager["tables"];
    queues: Queue[];
    cacheManager: GlobalManager["cacheManager"];
    statManager: GlobalManager["statManager"];
  }) {
    this.tables = tables;
    this.cacheManager = cacheManager;
    this.statManager = statManager;
    queues.forEach((q) => this.queues.set(q.blockType, q));
  }
}
