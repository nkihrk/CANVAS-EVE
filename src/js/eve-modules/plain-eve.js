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
    LibEve.call(this);

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

  const modules = { ...LibEve.prototype };

  Plain.prototype = Object.assign(modules, {
    constructor: Plain,

    options: {},

    load() {
      this.setFlgs();
      this.resetFlgs();
      this.handleEvents();
    },

    setFlgs() {
      D.addEventListener(
        'mousedown',
        e => {
          const { $plain } = this;
          this.param.relPos.left = e.clientX - $plain.offset().left;
          this.param.relPos.top = e.clientY - $plain.offset().top;
          if (e.button === 1) this.flgs.mousewheel_avail_flg = true;
        },
        false
      );
    },

    resetFlgs() {
      D.addEventListener(
        'mouseup',
        () => {
          if (this.flgs.mousewheel_avail_flg === true) {
            this.iframePointerReset();
            this.flgs.mousewheel_avail_flg = false;
            $('#canvas-eve').removeClass('active-mousewheel');
          }
        },
        false
      );
    },

    handleEvents() {
      D.addEventListener(
        'mousemove',
        e => {
          e.preventDefault();
          const { $plain } = this;
          const { $canvasEve } = this;

          if (this.flgs.mousewheel_avail_flg === true) {
            this.iframePointerNone();
            $plain.css({
              left: `${e.clientX - this.param.relPos.left}px`,
              top: `${e.clientY - this.param.relPos.top}px`
            });
            $canvasEve.addClass('active-mousewheel');
          }
        },
        false
      );
    }
  });

  return Plain;
})(document);

export default PlainEve;
