const SIM_TIME = 50;

const BUILDER_COUNT = 2;
const HANLDERS_COUNT = 4;

const eventTimings = {
  connection_time: {
    time: 4,
  },
  request_handling: {
    time: 3,
  },
  build_time: {
    time: 12,
  },
  api_calls: {
    time: 2,
  },
  read_from_cache: {
    time: 1,
  },
  response_crafting: {
    time: 2,
  },
  response_receiving: {
    time: 4,
  },
};

export { BUILDER_COUNT, HANLDERS_COUNT, SIM_TIME, eventTimings };
