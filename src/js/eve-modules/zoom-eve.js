/**
 *
 * Zooming functionality for CANVAS EVE
 *
 * Dependencies
 * - jquery-eve
 * - glb-eve
 * - flg-eve
 *
 */

import $ from '../common/jquery-eve';
import GlbEve from '../common/glb-eve';
import FlgEve from '../common/flg-eve';

const ZoomEve = (W => {
  function Zoom(element) {
    this.$zoom = $(element);

    this.i = 1;
    this.xLast = 0;
    this.yLast = 0;
    this.xScreen = 0;
    this.yScreen = 0;
    this.xNew = 0;
    this.yNew = 0;
    this.xImage = 0;
    this.yImage = 0;
  }

  const modules = {};

  Zoom.prototype = Object.assign(modules, {
    constructor: Zoom,

    options: {},

    //

    load() {
      this._init();
    },

    //

    mouseWheelEvent(e) {
      if (FlgEve.ui.is_ui_flg === false) {
        this._setZoom(e);
      }
    },

    //

    _init() {
      const e = {
        clientX: W.innerWidth / 2,
        clientY: W.innerHeight / 2
      };
      this._setZoom(e);
    },

    //

    _setZoom(e) {
      this.xScreen = e.clientX - $('#plain').offset().left;
      this.yScreen = e.clientY - $('#plain').offset().top;
      this.xImage += (this.xScreen - this.xLast) / this.i;
      this.yImage += (this.yScreen - this.yLast) / this.i;

      const delta = e.deltaY;

      if (delta > 0) {
        if (this.i > 10) {
          this.i = 10;
          this.i -= 0.9;
        } else if (this.i > 9) {
          this.i -= 0.9;
        } else if (this.i > 8) {
          this.i -= 0.8;
        } else if (this.i > 7) {
          this.i -= 0.7;
        } else if (this.i > 6) {
          this.i -= 0.6;
        } else if (this.i > 5) {
          this.i -= 0.5;
        } else if (this.i > 4) {
          this.i -= 0.4;
        } else if (this.i > 3) {
          this.i -= 0.3;
        } else if (this.i > 2) {
          this.i -= 0.2;
        } else if (this.i > 1) {
          this.i -= 0.1;
        } else if (this.i > 0.9) {
          this.i -= 0.09;
        } else if (this.i > 0.8) {
          this.i -= 0.08;
        } else if (this.i > 0.7) {
          this.i -= 0.07;
        } else if (this.i > 0.6) {
          this.i -= 0.06;
        } else if (this.i > 0.5) {
          this.i -= 0.05;
        } else if (this.i > 0.4) {
          this.i -= 0.04;
        } else if (this.i > 0.3) {
          this.i -= 0.03;
        } else if (this.i > 0.2) {
          this.i -= 0.02;
        } else if (this.i >= 0.1) {
          this.i -= 0.01;
        } else {
          this.i = 0.09;
        }
      } else if (this.i > 10) {
        this.i = 10.9;
      } else if (this.i > 9) {
        this.i += 0.9;
      } else if (this.i > 8) {
        this.i += 0.8;
      } else if (this.i > 7) {
        this.i += 0.7;
      } else if (this.i > 6) {
        this.i += 0.6;
      } else if (this.i > 5) {
        this.i += 0.5;
      } else if (this.i > 4) {
        this.i += 0.4;
      } else if (this.i > 3) {
        this.i += 0.3;
      } else if (this.i > 2) {
        this.i += 0.2;
      } else if (this.i > 1) {
        this.i += 0.1;
      } else if (this.i > 0.9) {
        this.i += 0.09;
      } else if (this.i > 0.8) {
        this.i += 0.08;
      } else if (this.i > 0.7) {
        this.i += 0.07;
      } else if (this.i > 0.6) {
        this.i += 0.06;
      } else if (this.i > 0.5) {
        this.i += 0.05;
      } else if (this.i > 0.4) {
        this.i += 0.04;
      } else if (this.i > 0.3) {
        this.i += 0.03;
      } else if (this.i > 0.2) {
        this.i += 0.02;
      } else if (this.i > 0.1) {
        this.i += 0.01;
      } else {
        this.i = 0.1;
        this.i += 0.01;
      }

      this.xNew = (this.xScreen - this.xImage) / this.i;
      this.yNew = (this.yScreen - this.yImage) / this.i;

      this.xLast = this.xScreen;
      this.yLast = this.yScreen;

      // console.log(this.i);

      GlbEve.MOUSE_WHEEL_VAL = 1 / this.i;
      this.$zoom.css({
        transform: `scale(${this.i}) translate(${this.xNew}px, ${this.yNew}px)`,
        'transform-origin': `${this.xImage}px ${this.yImage}px`
      });
    }
  });

  return Zoom;
})(window);

export default ZoomEve;
