/**
 *
 * Context-menu for CANVAS EVE.
 *
 * Dependencies
 * - jQuery-eve
 *
 */

import $ from '../common/jquery-eve';

const CtxmenuEve = (() => {
  function Ctxmenu() {
    this.$ctxmenuWrapper = $('#ctxmenu-wrapper');
    this.$ctxmenuSub = $('#ctxmenu-sub');
  }

  const modules = {};

  Ctxmenu.prototype = Object.assign(modules, {
    constructor: Ctxmenu,

    options: {
      BUTTON_FOR_RIGHT: 2
    },

    //

    mouseDownEvent(e) {
      if (!e.target.closest('#ctxmenu-wrapper')) {
        this._initCtxmenu();
      }
    },

    //

    mouseUpEvent(e) {
      if (e.button === this.options.BUTTON_FOR_RIGHT) {
        this._showCtxmenu(e);
      }
    },

    //

    mouseMoveEvent() {},

    //

    _initCtxmenu() {
      const { $ctxmenuWrapper } = this;
      $ctxmenuWrapper.css({
        'pointer-events': 'none',
        opacity: 0
      });
    },

    //

    _showCtxmenu(e) {
      const { $ctxmenuWrapper } = this;
      $ctxmenuWrapper.css({
        'pointer-events': 'auto',
        opacity: 1,
        left: `${e.clientX}px`,
        top: `${e.clientY}px`
      });
    }
  });

  return Ctxmenu;
})();

export default CtxmenuEve;
