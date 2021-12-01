const SIM_TIME = 50;

const BUILDER_COUNT = 2;
const HANLDERS_COUNT = 4;

// const eventTimings = {
//   connection_time: {
//     time: 0,
//   },
//   request_handling: {
//     time: 0,
//   },
//   build_time: {
//     time: 12,
//   },
//   api_calls: {
//     time: 0,
//   },
//   read_from_cache: {
//     time: 0,
//   },
//   response_crafting: {
//     time: 0,
//   },
//   response_receiving: {
//     time: 0,
//   },
// };

const eventTimings = {
  connection_time: {
    time: 0,
  },
  request_handling: {
    time: 2,
  },
  build_time: {
    time: 5,
  },
  api_calls: {
    time: 3,
  },
  read_from_cache: {
    time: 4,
  },
  response_crafting: {
    time: 2,
  },
  response_receiving: {
    time: 4,
  },
};

export { BUILDER_COUNT, HANLDERS_COUNT, SIM_TIME, eventTimings };
