/**
 *
 * Screen-space coordinate for CANVAS EVE
 *
 * Dependencies
 * - jquery-eve
 * - lib-eve
 * - glb-eve
 * - flg-eve
 *
 */

import $ from '../common/jquery-eve';
import LibEve from '../common/lib-eve';
import GlbEve from '../common/glb-eve';
import FlgEve from '../common/flg-eve';

const PlainEve = (() => {
  function Plain(element) {
    // this.$plain = $('#plain');
    this.$plain = $(element);
    this.$canvasEve = $('#canvas-eve');

    this.param = {
      pos: {
        left: 0,
        top: 0
      },
      relPos: {
        left: 0,
        top: 0
      }
    };

    this.flgs = {
      mousewheel_avail_flg: false
    };
  }

  const modules = {};

  Plain.prototype = Object.assign(modules, {
    constructor: Plain,

    options: {
      BUTTON_FOR_LEFT: 0,
      BUTTON_FOR_MIDDLE: 1
    },

    //

    load() {
      this.$plain.css('transition', GlbEve.IS_TRANSITION);
    },

    //

    mouseDownEvent(e) {
      this._setFlgs(e);
    },

    //

    mouseUpEvent() {
      this._resetFlgs();
    },

    //

    mouseMoveEvent(e) {
      this._handleEvents(e);
    },

    //

    _setFlgs(e) {
      const { $plain } = this;
      const isToolActive =
        e.button === this.options.BUTTON_FOR_LEFT &&
        FlgEve.plain.tools.is_active_flg === true;

      this.param.relPos.left = e.clientX - $plain.offset().left;
      this.param.relPos.top = e.clientY - $plain.offset().top;

      if (
        FlgEve.ui.is_ui_flg === false &&
        (isToolActive || e.button === this.options.BUTTON_FOR_MIDDLE)
      ) {
        LibEve.iframePointerNone();
        FlgEve.plain.active_mousewheel_flg = true;
      }
    },

    //

    _resetFlgs() {
      if (FlgEve.plain.active_mousewheel_flg === true) {
        FlgEve.plain.active_mousewheel_flg = false;
        $('#canvas-eve').removeClass('active-grabbing-mousewheel');
      }
    },

    //

    _handleEvents(e) {
      const { $plain } = this;
      const { $canvasEve } = this;

      if (FlgEve.plain.active_mousewheel_flg === true) {
        $plain.css({
          left: `${e.clientX - this.param.relPos.left}px`,
          top: `${e.clientY - this.param.relPos.top}px`
        });
        $canvasEve.addClass('active-grabbing-mousewheel');
      }
    }
  });

  return Plain;
})();

export default PlainEve;
