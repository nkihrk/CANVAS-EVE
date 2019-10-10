/**
 *
 * Global scopes.
 *
 * * Dependencies
 * - jQuery 3.4.1
 *
 */

import jQuery from 'jquery';

const GlobalEve = (function(w, d, $) {
  function global() {
    // Update the newFile when adding a new file
    this.newFile = {
      id: 0
    };
    // A current selected .file-wrap
    this.currentId = null; // lazy load
    // Global flags
    this.glFlgs = {
      config: {
        only_draggable_flg: false,
        no_zooming_flg: false
      },
      canvas: {
        drag_flg: false,
        rotate_flg: false,
        mousedown_flg: false,
        resize_flg: false,
        thumbtack_flg: false,
        re: {
          left_top_flg: false,
          right_top_flg: false,
          right_bottom_flg: false,
          left_bottom_flg: false
        },
        ro: {
          left_top_flg: false,
          right_top_flg: false,
          right_bottom_flg: false,
          left_bottom_flg: false
        }
      },
      colpick: {
        active_spuit_flg: false,
        move_circle_flg: false
      }
    };
    // Implement touch events for smart-phone
    // To check whether we can use the touch event or not
    this.supportTouch = 'ontouchend' in d;
    this.supportPointer = 'onpointerup' in d;
    this.EVENTNAME_TOUCHSTART = this.supportTouch ? 'touchstart' : 'mousedown';
    this.EVENTNAME_TOUCHMOVE = this.supportTouch ? 'touchmove' : 'mousemove';
    this.EVENTNAME_TOUCHEND = this.supportTouch ? 'touchend' : 'mouseup';
  }

  global.prototype = {
    constructor: global,

    options: {},

    load: function() {
      this._isTransition();
      this._addEventListener();
      this._updateMousePos();
    },

    _addEventListener: function() {
      w.addEventListener('touchmove', preventDefault, {
        passive: false
      });
      w.removeEventListener('touchmove', preventDefault, {
        passive: false
      });

      // d.addEventListener('touchstart', function (e) {
      //     e.preventDefault();
      // }, false);
      // d.addEventListener('touchmove', function (e) {
      //     e.preventDefault();
      // }, false);
    }
  };

  return global;
})(window, document, jQuery);

export default function globalScope() {
  return new GlobalEve();
}
