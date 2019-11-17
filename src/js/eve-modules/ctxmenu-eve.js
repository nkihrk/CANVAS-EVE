/**
 *
 * Context-menu for CANVAS EVE.
 *
 * Dependencies
 * - jQuery-eve
 *
 */

import $ from '../common/jquery-eve';

const CtxmenuEve = (D => {
  function Ctxmenu() {
    this.$ctxmenuWrapper = $('#ctxmenu-wrapper');
    this.$ctxmenu = $('#ctxmenu');
    this.$ctxmenuNew = $('#ctxmenu-new');
    this.$ctxmenuSub = $('#ctxmenu-sub');

    this.timeoutShow = null; // lazy load
    this.timeoutHide = null; // lazy load
  }

  const modules = {};

  Ctxmenu.prototype = Object.assign(modules, {
    constructor: Ctxmenu,

    options: {
      BUTTON_FOR_RIGHT: 2,
      MOUSE_OVER_DELAY: 300,
      TRANSITION_TIME: 100
    },

    //

    load() {
      this.mouseEnterEvent();
      this.mouseLeaveEvent();
    },

    //

    mouseDownEvent(e) {
      if (!e.target.closest('#ctxmenu-wrapper')) {
        this._initCtxmenu();
        this._initCtxmenuSub();
      }
    },

    //

    mouseUpEvent(e) {
      if (
        e.button === this.options.BUTTON_FOR_RIGHT &&
        !e.target.closest('#canvas-eve-ui') &&
        !e.target.closest('#ctxmenu-wrapper')
      ) {
        this._showCtxmenu(e);
      } else if (e.target.closest('#ctxmenu-new')) {
        this._showCtxmenuSub();
      }
    },

    //

    mouseEnterEvent() {
      const ctxmenu = D.getElementById('ctxmenu');
      const ctxmenuNew = D.getElementById('ctxmenu-new');
      const ctxmenuSub = D.getElementById('ctxmenu-sub');
      const t = this.options.MOUSE_OVER_DELAY;

      ctxmenu.onmouseenter = () => {
        this.timeoutHide = setTimeout(() => {
          this._initCtxmenuSub();
        }, t);
      };
      ctxmenuNew.onmouseenter = () => {
        clearTimeout(this.timeoutHide);
        this.timeoutShow = setTimeout(() => {
          this._showCtxmenuSub();
        }, t);
      };
      ctxmenuSub.onmouseenter = () => {
        clearTimeout(this.timeoutHide);
      };
    },

    //

    mouseLeaveEvent() {
      const ctxmenuNew = D.getElementById('ctxmenu-new');
      const t = this.options.MOUSE_OVER_DELAY;

      ctxmenuNew.onmouseleave = e => {
        clearTimeout(this.timeoutShow);
        if (!e.relatedTarget.closest('ctxmenu-sub')) {
          this.timeoutHide = setTimeout(() => {
            this._initCtxmenuSub();
          }, t);
        }
      };
    },

    //

    _initCtxmenu() {
      const { $ctxmenu } = this;
      const { $ctxmenuNew } = this;

      $ctxmenu.removeClass('active');
      $ctxmenuNew.removeClass('active');
    },

    //

    _initCtxmenuSub() {
      const { $ctxmenuNew } = this;
      const { $ctxmenuSub } = this;
      $ctxmenuNew.removeClass('active');
      $ctxmenuSub.removeClass('active');
    },

    //

    _showCtxmenu(e) {
      const { $ctxmenuWrapper } = this;
      const { $ctxmenu } = this;

      $ctxmenuWrapper.css({
        left: `${e.clientX}px`,
        top: `${e.clientY}px`
      });
      $ctxmenu.addClass('active');
    },

    //

    _showCtxmenuSub() {
      const { $ctxmenuNew } = this;
      const { $ctxmenuSub } = this;
      $ctxmenuNew.addClass('active');
      $ctxmenuSub.addClass('active');
    }
  });

  return Ctxmenu;
})(document);

export default CtxmenuEve;
