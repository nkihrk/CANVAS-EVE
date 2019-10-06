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
      },
      oekaki: {
        move_wheelcircle_flg: false,
        move_trianglecircle_flg: false
      }
    };
    // A max length of the HIGHEST_Z_INDEX is 2147483647
    this.HIGHEST_Z_INDEX = 1;
    // API_KEY
    this.config = {
      youtube: {
        API_KEY: null
      },
      twitter: {
        MY_KEY: null,
        SECRET_KEY: null,
        KEY_2: null
      }
    };
    // The global variables of the real-time coordinates of a mouse pointer.
    // It will change its value depending on the devices: Smartphone or PC.
    this.clientX = null;
    this.clientY = null;
    // The value of a current mouse wheel
    this.mouseWheelVal = 1;
    this.xNew = 0;
    this.yNew = 0;
    this.xNewMinus = -this.xNew;
    this.yNewMinus = -this.yNew;
    // The scree-space mouse coordinates from a zoom coordinate
    this.clientFromZoomX = null;
    this.clientFromZoomY = null;
    // Implement touch events for smart-phone
    // To check whether we can use the touch event or not
    this.supportTouch = 'ontouchend' in d;
    this.supportPointer = 'onpointerup' in d;
    this.EVENTNAME_TOUCHSTART = this.supportTouch ? 'touchstart' : 'mousedown';
    this.EVENTNAME_TOUCHMOVE = this.supportTouch ? 'touchmove' : 'mousemove';
    this.EVENTNAME_TOUCHEND = this.supportTouch ? 'touchend' : 'mouseup';
    // Enabling transition or not
    this.IS_TRANSITION = this.supportTouch ? '' : 'width .1s, height .1s, top .1s, left .1s';
  }

  global.prototype = {
    constructor: global,

    options: {},

    load: function() {
      this._isTransition();
      this._addEventListener();
      this._updateMousePos();
    },

    _isTransition: function() {
      $('.file-wrap').css('transition', this.IS_TRANSITION);
    },

    _addEventListener: function() {
      w.addEventListener('touchmove', preventDefault, {
        passive: false
      });
      w.removeEventListener('touchmove', preventDefault, {
        passive: false
      });

      // Prevent default right-click events for the time being
      d.addEventListener(
        'contextmenu',
        function(e) {
          e.preventDefault();
        },
        false
      );

      // d.addEventListener('touchstart', function (e) {
      //     e.preventDefault();
      // }, false);
      // d.addEventListener('touchmove', function (e) {
      //     e.preventDefault();
      // }, false);
    },

    // Update the coordinates of a mouse pointer
    _updateMousePos: function() {
      function update(e) {
        if (e.originalEvent.changedTouches) {
          this.clientX = e.originalEvent.changedTouches[0].clientX;
          this.clientY = e.originalEvent.changedTouches[0].clientY;
        } else {
          this.clientX = e.clientX;
          this.clientY = e.clientY;
        }

        this.clientFromZoomX = this.clientX - $('#zoom').offset().left;
        this.clientFromZoomY = this.clientY - $('#zoom').offset().top;
      }

      this._event(this.EVENTNAME_TOUCHMOVE, update);
    },

    _event(event, func) {
      $(d).on(event, func);
    },

    // Get transform values of a specific selector
    transformValue: function(e) {
      const values = e
        .split('(')[1]
        .split(')')[0]
        .split(', ');
      const matrix = {
        scaleX: values[0],
        rotateP: values[1],
        rotateM: values[2],
        scaleY: values[3],
        transformX: values[4],
        transformY: values[5]
      };

      return matrix;
    },

    // Get a target`s specific transform-rotate value, and return the value as radian. The value will be in between 0 and 2PI
    getRotationRad: function(obj) {
      let angle;
      const matrix =
        obj.css('-webkit-transform') ||
        obj.css('-moz-transform') ||
        obj.css('-ms-transform') ||
        obj.css('-o-transform') ||
        obj.css('transform');
      if (matrix !== 'none') {
        const values = matrix
          .split('(')[1]
          .split(')')[0]
          .split(',');
        const a = values[0];
        const b = values[1];
        angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
      } else {
        angle = 0;
      }

      return angle < 0 ? ((angle + 360) / 180) * Math.PI : (angle / 180) * Math.PI;
    },

    // Calcurate radians. The value will be in between 0 and 2PI
    calcRadians: function(x, y) {
      const rad = (Math.atan2(y, x) / Math.PI) * 180 + (Math.atan2(y, x) > 0 ? 0 : 360);

      return (rad / 180) * Math.PI;
    },

    debugCircle: function(name, col, posX, posY, insertToWhichTag) {
      if (insertToWhichTag) {
        $(`#${insertToWhichTag}`).append(`<div id="${name}"></div>`);
      } else {
        $('#canvas-eve').append(`<div id="${name}"></div>`);
      }
      $(`#${name}`).css({
        top: `${posY}px`,
        left: `${posX}px`,
        width: `${14}px`,
        height: `${14}px`,
        background: col,
        'border-radius': `${50}%`,
        position: 'absolute',
        'z-index': 999,
        transform: 'translateX(-50%) translateY(-50%)',
        opacity: 0.8
      });
    },

    // For the iframe pointer problem
    iframePointerNone: function() {
      $('iframe').css('pointer-events', 'none');
    },

    iframePointerReset: function() {
      $('iframe').css('pointer-events', '');
    },

    // Just for separation
    sep: function() {
      console.log('-------------------------------------');
    },

    preventDefault: function(e) {
      e.preventDefault();
    }
  };

  return global;
})(window, document, jQuery);

export default function globalScope() {
  return new GlobalEve();
}
