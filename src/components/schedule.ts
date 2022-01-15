import Process, { ProcessID } from "./process";

export class Schedule {
  currentTick = 0;
  nearestActiveTick = 0;
  timeTable: Record<number, ProcessID[]> = {};

  pushProcess = (process: Process) => {
    const processFinishTime = this.currentTick + process.timeLeft;
    if (
      processFinishTime < this.nearestActiveTick ||
      this.currentTick === this.nearestActiveTick
    ) {
      this.nearestActiveTick = processFinishTime;
    }
    this.timeTable[processFinishTime]?.push(process.id);
    this.timeTable[processFinishTime] ??= [process.id];
  };

  step = () => {
    const delta = this.nearestActiveTick - this.currentTick;
    this.currentTick = this.nearestActiveTick;
    for (const processID of this.timeTable[this.currentTick]) {
      Process.table.get(processID)?.finishProcess();
    }
    return delta;
  };
}
