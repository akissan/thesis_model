import { REQUEST_RATE, INITIAL_UNIT_COUNT, REQUEST_BLUR } from "../parameters";
import { getRndNum } from "../tools/random";
import { uid, randomItem } from "../tools/utils";
import { GlobalManager } from "./globalManager";
import { PageID } from "./pages";
import { Unit } from "./unit";

export class UnitGenerator {
  pages: PageID[];
  onSpawn: (unit: Unit) => any;
  globalManager: GlobalManager;
  public nextSpawn = 0;

  constructor({
    pages,
    onSpawn,
    globalManager,
  }: {
    pages: UnitGenerator["pages"];
    onSpawn: UnitGenerator["onSpawn"];
    globalManager: UnitGenerator["globalManager"];
  }) {
    this.pages = pages;
    this.globalManager = globalManager;
    this.onSpawn = onSpawn;
  }

  spawn = () => {
    const newUnit = new Unit({
      pageID: randomItem(this.pages),
      globalManager: this.globalManager,
    });
    this.onSpawn(newUnit);
  };

  generate = () => {
    this.spawn();

    while (true) {
      const delay = Math.max(
        Math.round((getRndNum() - 0.5) * 2 * REQUEST_BLUR) + REQUEST_RATE,
        0
      );
      if (delay === 0) {
        this.spawn();
      } else {
        this.nextSpawn += delay;
        return;
      }
    }
  };

  getSpawnTicks = (maxTickTime: number) => {
    const tickTable: Record<number, number> = { 0: INITIAL_UNIT_COUNT };
    let tick = 0;
    while (tick < maxTickTime) {}
    // console.log(tickTable);
    return tickTable;
  };
}
