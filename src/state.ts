import { BUILDER_COUNT, eventTimings, HANLDERS_COUNT } from "./parameters";
import { ProcessingBlock } from "./process";
import { UnitID } from "./unit";

// type Queue = UnitID[];

export type State = {
  cache: {};
  build_queue: UnitID[];
  request_queue: UnitID[];
  builders: ProcessingBlock[];
  handlers: ProcessingBlock[]; //
};

const request_queue: UnitID[] = [];
const build_queue: UnitID[] = [];

export const initState: State = {
  cache: {},
  build_queue,
  request_queue,
  builders: Array(BUILDER_COUNT).fill(
    new ProcessingBlock({
      processTime: eventTimings.build_time,
      queue: request_queue,
    })
  ),
  handlers: Array(HANLDERS_COUNT).fill(
    new ProcessingBlock({
      processTime: eventTimings.request_handling,
      queue: request_queue,
    })
  ),
};

export const copyState = (state: State): State => ({ ...state });

// export { Queue, ProcessingBlock };
