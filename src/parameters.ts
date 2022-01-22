export const MAX_SIM_TIME = 50;

export const INITIAL_UNIT_COUNT = 1;
export const REQUEST_RATE = 8;
export const REQUEST_BLUR = 10;

// export const UNIT_SPAWN_RATE = {
//   MIN_TICK: 0,
//   MAX_TICK: 8,
// };
export const PAGE_COUNT = 8;
// export const CACHE_SIZE = 10;
// export const CACHE_STRATEGY = "RANDOM";[]

export const HANLDERS_COUNT = 2;
export const BUILDER_COUNT = 2;

export const PROCESS_TIMES = {
  connection: 3,
  parsing: 2,
  reading_from_cache: 2,
  writing_to_cache: 3,
  building_start: 4,
  api_call: 4,
  building_end: 2,
  response_crafting: 3,
  sending: 5,
} as const;
