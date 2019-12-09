/**
 *
 * Storing files for CANVAS EVE.
 *
 * Dependencies
 * - none
 *
 */

const StoreEve = (() => {
  function Store() {
    this.fileList = {};
    this.historyList = {};
  }

  const modules = {};

  Store.prototype = Object.assign(modules, {
    constructor: Store,

    options: {}
  });

  return Store;
})();

export default StoreEve;
