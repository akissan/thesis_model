const MAX_SIM_TIME = 50;

const BUILDER_COUNT = 2;
const HANLDERS_COUNT = 4;

const PROCESS_TIMES = {
  connection: 3,
  parsing: 2,
  reading_from_cache: 2,
  writing_to_cache: 3,
  building_start: 4,
  api_call: 4,
  building_end: 2,
  sending: 7,
  response_crafting: 3,
} as const;

export { BUILDER_COUNT, HANLDERS_COUNT, MAX_SIM_TIME, PROCESS_TIMES };
