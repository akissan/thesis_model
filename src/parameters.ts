const MAX_SIM_TIME = 50;

const INITIAL_UNIT_COUNT = 1;
const HANLDERS_COUNT = 1;
const BUILDER_COUNT = 1;

const PROCESS_TIMES = {
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

export {
  INITIAL_UNIT_COUNT,
  BUILDER_COUNT,
  HANLDERS_COUNT,
  MAX_SIM_TIME,
  PROCESS_TIMES,
};
