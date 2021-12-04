declare global {
  var VERBOSE: boolean;
}

namespace NodeJS {
  interface Global {
    VERBOSE: boolean;
  }
}

export {};
