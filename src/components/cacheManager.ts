import { GLOBALS } from "../globals";
import { PageID } from "./pages";
import { StatManager } from "./statManager";

export class CacheManager {
  cache: Map<PageID, boolean> = new Map();
  cachedPagesByTime: PageID[] = [];
  cacheSize: number;
  statManager?: StatManager;

  isCached = (pageID: PageID) => {
    const isCached = this.cache.get(pageID) ?? false;
    this.statManager?.logPageFound(pageID, isCached);
    return isCached;
  };

  setCached = (pageID: PageID) => {
    if (this.cache.get(pageID)) {
      //   GLOBALS.VERBOSE && console.log(`page ${pageID} already cached`);
      return;
    }

    if (!(this.cache.size < this.cacheSize)) {
      const pageToUncache = this.cachedPagesByTime.shift();
      if (pageToUncache) {
        this.cache.set(pageToUncache, false);
        // GLOBALS.VERBOSE && console.log(`page ${pageToUncache} was uncached`);
        this.statManager?.logPageReplaced(pageID);
      }
    }

    this.cachedPagesByTime.push(pageID);
    this.cache.set(pageID, true);
    // GLOBALS.VERBOSE && console.log(`page ${pageID} was cached`);
  };

  constructor({ cacheSize }: { cacheSize: CacheManager["cacheSize"] }) {
    this.cacheSize = cacheSize;
  }
}
