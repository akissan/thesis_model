import Block, { BlockID } from "../components/block";
import Process, { ProcessID } from "../components/process";

export type ProcessTable = Map<ProcessID, Process>;
export type BlockTable = Map<BlockID, Block>;
