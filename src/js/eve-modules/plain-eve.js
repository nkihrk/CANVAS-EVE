/**
 *
 * Screen-space coordinate for CANVAS EVE
 *
 * Dependencies
 * - jQuery 3.4.1
 * - lib-eve
 *
 */

import jQuery from 'jquery';

import LibEve from '../common/lib-eve';

const PlainEve = (function(d, $) {
  function Plain() {
    LibEve.call(this);

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
      d.addEventListener('mousedown', e => {
        const $plain = $('#plain');
        this.param.relPos.left = e.clientX - $plain.offset().left;
        this.param.relPos.top = e.clientY - $plain.offset().top;
        if (e.button === 1) {
          this.flgs.mousewheel_avail_flg = true;
        }
      });
    },

    resetFlgs() {
      d.addEventListener('mouseup', () => {
        if (this.flgs.mousewheel_avail_flg === true) {
          this.iframePointerReset();
          this.flgs.mousewheel_avail_flg = false;
          $('#canvas-eve').removeClass('active-mousewheel');
        }
      });
    },

    handleEvents() {
      d.addEventListener('mousemove', e => {
        e.preventDefault();

        if (this.flgs.mousewheel_avail_flg === true) {
          this.iframePointerNone();
          $('#plain').css({
            left: `${e.clientX - this.param.relPos.left}px`,
            top: `${e.clientY - this.param.relPos.top}px`
          });
          $('#canvas-eve').addClass('active-mousewheel');
        }
      });
    }
  });

  return Plain;
})(document, jQuery);

export default PlainEve;
