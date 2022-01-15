import { Statserver } from "../statserver";
import { uid } from "../tools/utils";
import Block, { BlockID } from "./block";
import Entity from "./entity";
import Unit from "./unit";

export type QueueProps = {
  list?: Unit[];
  options?: {
    onPush?: Queue["onPush"];
    id?: Queue["id"];
  };
};

export type QueueID = Queue["id"];

export type consumerStates = "available" | "busy";

export default class Queue extends Array {
  onPush?: (unit: Unit) => void;
  id: Entity["id"];
  consumers: Map<BlockID, consumerStates> = new Map();

  setConsumerState = (id: BlockID, state: consumerStates) => {
    this.consumers.set(id, state);
    if (state === "available") this.onAvailableConsumer(id);
  };

  addNewConsumer = (id: BlockID) => {
    this.consumers.set(id, "available");
  };

  onAvailableConsumer = (id: BlockID) => {
    Block.table.get(id)?.tryQueue();
  };

  push = (unit: Unit) => {
    super.push(unit);
    Statserver.reportTravel({ unitID: unit.id, entityID: this.id });
    this.onPush?.(unit);

    this.getConsumer()?.tryQueue();

    return this.length;
  };

  getConsumer = () => {
    for (const [blockID, blockState] of this.consumers) {
      if (blockState === "available") {
        return Block.table.get(blockID);
      }
    }
  };

  constructor(
    { list = [], options: { onPush, id } = {} }: QueueProps = {
      list: [],
      options: {},
    }
  ) {
    super();
    super.push(...list);
    this.onPush = onPush;
    this.id = id ?? uid();
  }
}
