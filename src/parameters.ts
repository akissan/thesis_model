const SIM_TIME = 50;

const BUILDER_COUNT = 2;
const HANLDERS_COUNT = 4;

const eventTimings = {
  connection_time: {
    time: 5,
  },
  request_handling: {
    time: 2,
  },
  build_time: {
    time: 16,
  },
  api_calls: {
    time: 3,
  },
  read_from_cache: {
    time: 1,
  },
  response_receiving: {
    time: 3,
  },
};

export { BUILDER_COUNT, HANLDERS_COUNT, SIM_TIME, eventTimings };
