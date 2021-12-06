import { Statserver } from "../statserver";
import { uid } from "../tools/utils";
import Entity from "./entity";
import Unit from "./unit";

// export type Queue = Unit[];

export type QueueProps = {
  list?: Unit[];
  options?: {
    onPush?: Queue["onPush"];
    id?: Queue["id"];
  };
};

export type QueueID = Queue["id"];

export class Queue extends Array {
  onPush?: (unit: Unit) => void;
  id: Entity["id"];

  push = (...items: Unit[]) => {
    super.push(...items);
    items.forEach((unit) =>
      Statserver.reportTravel({ unitID: unit.id, entityID: this.id })
    );

    if (this.onPush) items.forEach((item) => this.onPush?.(item));
    return this.length;
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
