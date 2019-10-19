/**
 *
 * Screen-space coordinate for CANVAS EVE
 *
 * Dependencies
 * - extend-eve
 * - lib-eve
 *
 */

import $ from '../common/extend-eve';
import LibEve from '../common/lib-eve';

const PlainEve = (D => {
  function Plain() {
    this.$plain = $('#plain');
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

    options: {},

    load() {
      this.mouseDownEvent();
      this.mouseUpEvent();
      this.mouseMoveEvent();
    },

    //

    mouseDownEvent() {
      D.addEventListener(
        'mousedown',
        e => {
          this._setFlgs(e);
        },
        false
      );
    },

    //

    mouseUpEvent() {
      D.addEventListener(
        'mouseup',
        () => {
          this._resetFlgs();
        },
        false
      );
    },

    //

    mouseMoveEvent() {
      D.addEventListener(
        'mousemove',
        e => {
          this._handleEvents(e);
        },
        false
      );
    },

    //

    _setFlgs(e) {
      const { $plain } = this;
      this.param.relPos.left = e.clientX - $plain.offset().left;
      this.param.relPos.top = e.clientY - $plain.offset().top;
      if (e.button === 1) this.flgs.mousewheel_avail_flg = true;
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
      e.preventDefault();
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
})(document);

export default PlainEve;
