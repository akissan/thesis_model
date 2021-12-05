import Unit from "./unit";

// export type Queue = Unit[];

export type QueueProps = {
  list?: Unit[];
  options?: {
    onPush?: Queue["onPush"];
  };
};

export class Queue extends Array {
  onPush?: (unit: Unit) => void;

  push = (...items: Unit[]) => {
    super.push(...items);
    if (this.onPush) items.forEach((item) => this.onPush?.(item));
    return this.length;
  };

  constructor(
    { list = [], options: { onPush } = {} }: QueueProps = {
      list: [],
      options: {},
    }
  ) {
    super();
    super.push(...list);
    this.onPush = onPush;
  }
}
