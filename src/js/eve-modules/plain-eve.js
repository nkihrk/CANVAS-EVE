/**
 *
 * Screen-space coordinate for CANVAS EVE
 *
 * Dependencies
 * - jquery-eve
 * - lib-eve
 * - glb-eve
 *
 */

import $ from '../common/jquery-eve';
import LibEve from '../common/lib-eve';
import GlbEve from '../common/glb-eve';

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
      this.param.relPos.left = e.clientX - $plain.offset().left;
      this.param.relPos.top = e.clientY - $plain.offset().top;
      if (e.button === this.options.BUTTON_FOR_MIDDLE) this.flgs.mousewheel_avail_flg = true;
    },

    //

    _resetFlgs() {
      if (this.flgs.mousewheel_avail_flg === true) {
        LibEve.iframePointerReset();
        this.flgs.mousewheel_avail_flg = false;
        $('#canvas-eve').removeClass('active-mousewheel');
      }
    },

    //

    _handleEvents(e) {
      const { $plain } = this;
      const { $canvasEve } = this;

      if (this.flgs.mousewheel_avail_flg === true) {
        LibEve.iframePointerNone();
        $plain.css({
          left: `${e.clientX - this.param.relPos.left}px`,
          top: `${e.clientY - this.param.relPos.top}px`
        });
        $canvasEve.addClass('active-mousewheel');
      }
    }
  });

  return Plain;
})();

export default PlainEve;
