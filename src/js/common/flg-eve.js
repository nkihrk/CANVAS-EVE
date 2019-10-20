/**
 *
 * Global flags for CANVAS EVE.
 *
 * Dependencies
 * - extend-eve
 * - lib-eve
 *
 */

import $ from './extend-eve';
import LibEve from './lib-eve';

const FlgEve = (() => {
  function Flg() {
    this.flgs = {
      config: {
        only_draggable_flg: false,
        no_zooming_flg: false
      },
      canvas: {
        drag_flg: false,
        rotate_flg: false,
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
  }

  Flg.prototype = {
    constructor: Flg,

    //

    setFlgs(e) {
      let $fileWrap = $(e.target).parents('.file-wrap');
      if ($fileWrap.length === 0) {
        $fileWrap = $(e.target);
      }

      if ($fileWrap.hasClass('file-wrap')) {
        if ($fileWrap.find('.only-draggable').length > 0) {
          this.flgs.config.only_draggable_flg = true;
        } else {
          this.flgs.config.only_draggable_flg = false;
        }
        if ($fileWrap.children('.no-zooming').length > 0) {
          this.flgs.config.no_zooming_flg = true;
        } else {
          this.flgs.config.no_zooming_flg = false;
        }

        this.flgs.colpick.active_spuit_flg = false;
        if (
          $fileWrap.find('#toggle-colpick').length === 0 &&
          $('#toggle-colpick').hasClass('active')
        ) {
          this.flgs.colpick.active_spuit_flg = true;
        }

        this.flgs.canvas.thumbtack_flg = false;
        if ($fileWrap.find('.thumbtack-wrapper').hasClass('active')) {
          this.flgs.canvas.thumbtack_flg = true;
        }
      }

      if (
        e.target.closest('.re-left-top') ||
        e.target.closest('.re-right-top') ||
        e.target.closest('.re-right-bottom') ||
        e.target.closest('.re-left-bottom')
      ) {
        LibEve.iframePointerNone();
        this.flgs.canvas.resize_flg = true;

        if (e.target.closest('.re-left-top')) this.flgs.canvas.re.left_top_flg = true;
        if (e.target.closest('.re-right-top')) this.flgs.canvas.re.right_top_flg = true;
        if (e.target.closest('.re-right-bottom')) this.flgs.canvas.re.right_bottom_flg = true;
        if (e.target.closest('.re-left-bottom')) this.flgs.canvas.re.left_bottom_flg = true;
      }

      if (
        e.target.closest('.ro-left-top') ||
        e.target.closest('.ro-right-top') ||
        e.target.closest('.ro-right-bottom') ||
        e.target.closest('.ro-left-bottom')
      ) {
        LibEve.iframePointerNone();
        this.flgs.canvas.rotate_flg = true;

        if (e.target.closest('.ro-left-top')) this.flgs.canvas.ro.left_top_flg = true;
        if (e.target.closest('.ro-right-top')) this.flgs.canvas.ro.right_top_flg = true;
        if (e.target.closest('.ro-right-bottom')) this.flgs.canvas.ro.right_bottom_flg = true;
        if (e.target.closest('.ro-left-bottom')) this.flgs.canvas.ro.left_bottom_flg = true;
      }

      if (
        e.target.closest('#red-cir-colpick') ||
        e.target.closest('#green-cir-colpick') ||
        e.target.closest('#blue-cir-colpick')
      ) {
        this.flgs.colpick.move_circle_flg = true;
      }
    },

    //

    resetFlgs() {
      LibEve.iframePointerReset();

      // A flag for colpick`s bar circle. colpick-eve.js
      if (this.flgs.colpick.move_circle_flg === true) this.flgs.colpick.move_circle_flg = false;

      // A flag for drag event
      if (this.flgs.canvas.drag_flg === true) this.flgs.canvas.drag_flg = false;

      // A flag for mousedown event
      if (this.flgs.canvas.mousedown_flg === true) this.flgs.canvas.mousedown_flg = false;

      // Flags for resizing
      if (this.flgs.canvas.resize_flg === true) this.flgs.canvas.resize_flg = false;
      if (this.flgs.canvas.re.left_top_flg === true) this.flgs.canvas.re.left_top_flg = false;
      if (this.flgs.canvas.re.right_top_flg === true) this.flgs.canvas.re.right_top_flg = false;
      if (this.flgs.canvas.re.right_bottom_flg === true)
        this.flgs.canvas.re.right_bottom_flg = false;
      if (this.flgs.canvas.re.left_bottom_flg === true) this.flgs.canvas.re.left_bottom_flg = false;

      // A flag for rotating
      if (this.flgs.canvas.rotate_flg === true) this.flgs.canvas.rotate_flg = false;
      if (this.flgs.canvas.ro.left_top_flg === true) this.flgs.canvas.ro.left_top_flg = false;
      if (this.flgs.canvas.ro.right_top_flg === true) this.flgs.canvas.ro.right_top_flg = false;
      if (this.flgs.canvas.ro.right_bottom_flg === true)
        this.flgs.canvas.ro.right_bottom_flg = false;
      if (this.flgs.canvas.ro.left_bottom_flg === true) this.flgs.canvas.ro.left_bottom_flg = false;
    }
  };

  return Flg;
})();

export default FlgEve;
