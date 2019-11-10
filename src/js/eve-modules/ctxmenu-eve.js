/**
 *
 * Context menu for CANVAS EVE.
 *
 * Dependencies
 * - none
 *
 */

const CtxmenuEve = (() => {
  function Ctxmenu() {}

  const modules = {};

  Ctxmenu.prototype = Object.assign(modules, {
    constructor: Ctxmenu,

    options: {},

    //

    mouseDownEvent() {},

    //

    mouseUpEvent() {},

    //

    mouseMoveEvent() {}
  });

  return Ctxmenu;
})();

export default CtxmenuEve;
