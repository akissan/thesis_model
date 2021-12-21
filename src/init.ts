import chalk from "chalk";
import Block from "./components/block";
import BuilderBlock from "./components/blocks/builder";
import HandlerBlock from "./components/blocks/handler";
import Process from "./components/process";
import Queue from "./components/queue";
import Unit, { UnitTable } from "./components/unit";
import { clog, Repeat } from "./tools/utils";
import { BlockTable, ProcessTable } from "./types/tables";

const initQueues = () => {
  const handlerQueue: Queue = new Queue({ options: { id: "H_QUEUE" } });
  const builderQueue: Queue = new Queue({ options: { id: "B_QUEUE" } });
  const finishQueue: Queue = new Queue({
    options: {
      id: "F_QUEUE",
      onPush: global.VERBOSE
        ? (unit) =>
            clog(chalk.white(`[F] Unit ${chalk.yellow(unit.id)} finished!`))
        : undefined,
    },
  });
  return { handlerQueue, builderQueue, finishQueue } as const;
};

const initTables = () => {
  const processTable: ProcessTable = new Map();
  const blockTable: BlockTable = new Map();
  const unitTable: UnitTable = new Map();

  return { processTable, blockTable, unitTable } as const;
};

const assignTables = (
  {
    blockTable,
    processTable,
    unitTable,
  }: {
    blockTable: BlockTable;
    processTable: ProcessTable;
    unitTable: UnitTable;
  },
  {
    block,
    process,
    unit,
  }: { block: typeof Block; process: typeof Process; unit: typeof Unit }
) => {
  block.setTable(blockTable);
  process.setTable(processTable);
  unit.setTable(unitTable);
};

const spawnUnits = (n: number) => {
  Repeat(n, (_, idx) => {
    new Unit({ id: `UNIT_${idx}` });
  });
};

const spawnHandlers = (
  n: number,
  {
    handlerQueue,
    builderQueue,
    finishQueue,
  }: { handlerQueue: Queue; builderQueue: Queue; finishQueue: Queue }
) => {
  Repeat(n, (_, idx) => {
    new HandlerBlock({
      id: `HANDLER_${idx}`,
      name: `handler_${idx}`,
      inputQueue: handlerQueue,
      outputQueue: { builderQueue, finishQueue },
    });
  });
};

const spawnBuilders = (
  n: number,
  { builderQueue, handlerQueue }: { builderQueue: Queue; handlerQueue: Queue }
) => {
  Repeat(n, (_, idx) => {
    new BuilderBlock({
      id: `BUILDER_${idx}`,
      name: `builder_${idx}`,
      inputQueue: builderQueue,
      outputQueue: { handlerQueue },
    });
  });
};

const init = {
  queues: initQueues,
  tables: initTables,
  assignTables,
  spawnUnits,
  spawnHandlers,
  spawnBuilders,
};

export default init;
