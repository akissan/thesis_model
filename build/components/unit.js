"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../tools/utils");
class Unit {
    constructor() {
        this.id = (0, utils_1.uid)();
        this.state = "new";
        Unit.unitTable.set(this.id, this);
    }
}
exports.default = Unit;
Unit.init = ({ unitTable }) => {
    Unit.unitTable = unitTable;
};
