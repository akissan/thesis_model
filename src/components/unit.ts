import { GLOBALS } from "../globals";
import { uid } from "../tools/utils";
import Entity, { BaseEntityProps } from "./entity";
import { PageID } from "./pages";
import { ResponseState } from "./response";

export class Unit extends Entity {
  stage: ResponseState = "new";
  pageID: PageID;
  requiredBlockType: "handler" | "builder" | "exit" = "handler";

  constructor({
    id,
    pageID,
    globalManager,
  }: BaseEntityProps & { pageID: Unit["pageID"] }) {
    super({ id: id ?? `${uid()}`, globalManager });
    this.pageID = pageID;
    globalManager.tables.unitTable.set(this.id, this);
  }
}
