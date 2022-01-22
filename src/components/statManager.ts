import { Block } from "./block";
import { Unit } from "./unit";

export class StatManager {
  logUnitTransfer = ({
    unit,
    blockA,
    blockB,
  }: {
    unit: Unit;
    blockA: Block;
    blockB: Block;
  }) => {
    console.log(`${unit.id} B[${blockA.id}] => B[${blockB.id}]`);
  };
}
