import { GLOBALS } from "../globals";
import { PageID } from "./pages";

export class CacheManager {
  cache: Map<PageID, boolean> = new Map();
  cachedPagesByTime: PageID[] = [];
  cacheSize: number;

  isCached = (pageID: PageID) => {
    const isCached = this.cache.get(pageID) ?? false;
    GLOBALS.VERBOSE && console.log(`page ${pageID} is cached? ${isCached}`);
    return isCached;
  };

  setCached = (pageID: PageID) => {
    if (this.cache.get(pageID)) {
      GLOBALS.VERBOSE && console.log(`page ${pageID} already cached`);
      return;
    }

    if (!(this.cache.size < this.cacheSize)) {
      const pageToUncache = this.cachedPagesByTime.shift();
      if (pageToUncache) {
        this.cache.set(pageToUncache, false);
        GLOBALS.VERBOSE && console.log(`page ${pageToUncache} was uncached`);
      }
    }

    this.cachedPagesByTime.push(pageID);
    this.cache.set(pageID, true);
    GLOBALS.VERBOSE && console.log(`page ${pageID} was cached`);
  };

  constructor({ cacheSize }: { cacheSize: CacheManager["cacheSize"] }) {
    this.cacheSize = cacheSize;
  }
}
