/**
 *
 * Global flags for CANVAS EVE.
 *
 * Dependencies
 * - jquery-eve
 * - lib-eve
 *
 */

import $ from './jquery-eve';
import LibEve from './lib-eve';

const FlgEve = (() => {
  function Flg() {
    this.config = {
      only_draggable_flg: false,
      no_zooming_flg: false
    };
    this.ctxmenu = {
      sub: {
        is_youtube_flg: false
      }
    };
    this.canvas = {
      multi_select_flg: false,
      select: {
        is_multi_flg: false
      },
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
    };
    this.plain = {
      active_mousewheel_flg: false,
      tools: {
        is_active_flg: false
      }
    };
    this.colpick = {
      active_spuit_flg: false,
      move_circle_flg: false,
      tools: {
        is_active_flg: false
      }
    };
    this.oekaki = {
      move_wheelcircle_flg: false,
      move_trianglecircle_flg: false,
      tools: {
        is_active_flg: false,
        brush_flg: false,
        eraser_flg: false
      }
    };
    this.ui = {
      is_ui_flg: false,
      toolbar: {
        is_active_flg: false
      }
    };
    this.keyMap = {};
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
          this.config.only_draggable_flg = true;
        } else {
          this.config.only_draggable_flg = false;
        }
        if ($fileWrap.children('.no-zooming').length > 0) {
          this.config.no_zooming_flg = true;
        } else {
          this.config.no_zooming_flg = false;
        }

        this.colpick.active_spuit_flg = false;
        if (
          $fileWrap.find('#toggle-colpick').length === 0 &&
          $('#toggle-colpick').hasClass('active')
        ) {
          this.colpick.active_spuit_flg = true;
        }

        this.canvas.thumbtack_flg = false;
        if ($fileWrap.find('.thumbtack-wrapper').hasClass('active')) {
          this.canvas.thumbtack_flg = true;
        }
      }

      if (
        e.target.closest('.re-left-top') ||
        e.target.closest('.re-right-top') ||
        e.target.closest('.re-right-bottom') ||
        e.target.closest('.re-left-bottom')
      ) {
        LibEve.iframePointerNone();
        this.canvas.resize_flg = true;

        if (e.target.closest('.re-left-top'))
          this.canvas.re.left_top_flg = true;
        if (e.target.closest('.re-right-top'))
          this.canvas.re.right_top_flg = true;
        if (e.target.closest('.re-right-bottom'))
          this.canvas.re.right_bottom_flg = true;
        if (e.target.closest('.re-left-bottom'))
          this.canvas.re.left_bottom_flg = true;
      }

      if (
        e.target.closest('.ro-left-top') ||
        e.target.closest('.ro-right-top') ||
        e.target.closest('.ro-right-bottom') ||
        e.target.closest('.ro-left-bottom')
      ) {
        LibEve.iframePointerNone();
        this.canvas.rotate_flg = true;

        if (e.target.closest('.ro-left-top'))
          this.canvas.ro.left_top_flg = true;
        if (e.target.closest('.ro-right-top'))
          this.canvas.ro.right_top_flg = true;
        if (e.target.closest('.ro-right-bottom'))
          this.canvas.ro.right_bottom_flg = true;
        if (e.target.closest('.ro-left-bottom'))
          this.canvas.ro.left_bottom_flg = true;
      }

      if (
        e.target.closest('#red-cir-colpick') ||
        e.target.closest('#green-cir-colpick') ||
        e.target.closest('#blue-cir-colpick')
      ) {
        this.colpick.move_circle_flg = true;
      }
    },

    //

    resetFlgs() {
      LibEve.iframePointerReset();

      // A flag for colpick`s bar circle. colpick-eve.js
      if (this.colpick.move_circle_flg === true)
        this.colpick.move_circle_flg = false;

      // A flag for drag event
      if (this.canvas.drag_flg === true) this.canvas.drag_flg = false;

      // A flag for mousedown event
      if (this.canvas.mousedown_flg === true) this.canvas.mousedown_flg = false;

      // Flags for resizing
      if (this.canvas.resize_flg === true) this.canvas.resize_flg = false;
      if (this.canvas.re.left_top_flg === true)
        this.canvas.re.left_top_flg = false;
      if (this.canvas.re.right_top_flg === true)
        this.canvas.re.right_top_flg = false;
      if (this.canvas.re.right_bottom_flg === true)
        this.canvas.re.right_bottom_flg = false;
      if (this.canvas.re.left_bottom_flg === true)
        this.canvas.re.left_bottom_flg = false;

      // A flag for rotating
      if (this.canvas.rotate_flg === true) this.canvas.rotate_flg = false;
      if (this.canvas.ro.left_top_flg === true)
        this.canvas.ro.left_top_flg = false;
      if (this.canvas.ro.right_top_flg === true)
        this.canvas.ro.right_top_flg = false;
      if (this.canvas.ro.right_bottom_flg === true)
        this.canvas.ro.right_bottom_flg = false;
      if (this.canvas.ro.left_bottom_flg === true)
        this.canvas.ro.left_bottom_flg = false;
    }
  };

  return Flg;
})();

export default new FlgEve();
