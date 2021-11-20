#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const argv_1 = require("./argv");
const argvOptions = {
    n: { type: "string" },
    c: { type: "string" },
    d: { type: "string" },
};
const argv = (0, argv_1.initArgs)(argvOptions);
