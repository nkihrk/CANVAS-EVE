/**
 *
 * 2D Engine for CANVAS EVE.
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

const CanvasEve = ((W, D, M) => {
  /**
   * Entry point for CanvasEve.
   *
   */
  function Canvas() {
    FlgEve.call(this);

    this.file = {
      $fileId: null,
      fileId: 0,
      fileIdPos: 0,
      fileIdRelPosX: 0,
      fileIdRelPosY: 0,
      fileIdWidth: 0,
      fileIdHeight: 0,
      fileIdRatio: 0,
      fileIdTheta: 0,
      rotatedSize: {
        width: 0,
        height: 0
      },
      rotatedCenterPos: {
        left: 0,
        top: 0
      }
    };

    this.tmp = {
      ro: {
        left_top_initRad: null,
        right_top_initRad: null,
        right_bottom_initRad: null,
        left_bottom_initRad: null,
        //
        left_top_pos: null,
        right_top_pos: null,
        right_bottom_pos: null,
        left_bottom_pos: null
      }
    };

    this.resizeBox =
      '<div class="re-left-top"></div>' +
      '<div class="re-right-top"></div>' +
      '<div class="re-right-bottom"></div>' +
      '<div class="re-left-bottom"></div>';

    this.rotateBox =
      '<div class="ro-left-top"></div>' +
      '<div class="ro-right-top"></div>' +
      '<div class="ro-right-bottom"></div>' +
      '<div class="ro-left-bottom"></div>';
  }

  const modules = { ...FlgEve.prototype };

  Canvas.prototype = Object.assign(modules, {
    constructor: Canvas,

    options: {
      BUTTON_FOR_FUNC: 0,
      BUTTON_FOR_MOUSEWHEEL: 1,
      UPDATE_CANVAS_SIZE_DELAY: 150
    },

    //

    mouseDownEvent(e) {
      if (e.button === this.options.BUTTON_FOR_FUNC) {
        this.setFlgs(e);
        this._init(e);
        if ($(e.target)[0].id === 'reset-res') this._reset();
        this._handleEventMouseDown(e);
      }
    },

    //

    mouseUpEvent() {
      this._update();
      this.resetFlgs();
    },

    //

    mouseMoveEvent(e) {
      this._handleEventMouseMove(e);
    },

    //

    mouseWheelEvent() {
      this._updateUiVal();
    },

    //

    _init(e) {
      const self = this;

      let $fileWrap = $(e.target).parents('.file-wrap');
      if ($fileWrap.length === 0) {
        $fileWrap = $(e.target);
      }

      if ($fileWrap && $fileWrap.hasClass('file-wrap')) {
        if ($fileWrap.find('.selected').length === 0) {
          this._reset();
        }

        // This if argument is the prefix for colpick-eve.js
        if (this.flgs.colpick.active_spuit_flg === false) {
          // Added selected symbols and other functions
          if (this.flgs.config.only_draggable_flg === false) {
            if ($fileWrap.find('.selected').length === 0) {
              $fileWrap.prepend('<div class="selected"></div>');
              // Resizing boxes
              if ($fileWrap.find('.resize-wrapper').hasClass('active')) {
                $fileWrap.prepend(self.resizeBox);
              }

              if ($fileWrap.find('.rotate-wrapper').hasClass('active')) {
                $fileWrap.prepend(self.rotateBox); // Rotating circles
              }

              $fileWrap.find('.thumbtack-wrapper').prepend('<div class="thumbtack-icon"></div>'); // Add a thumbtack icon
              $fileWrap.find('.resize-wrapper').prepend('<div class="resize-icon"></div>'); // Add a resizing icon
              $fileWrap.find('.rotate-wrapper').prepend('<div class="rotate-icon"></div>'); // Add a rotating icon
              $fileWrap.find('.flip-wrapper').prepend('<div class="flip-icon"></div>'); // Add a flipping icon
              $fileWrap.find('.trash-wrapper').prepend('<div class="trash-icon"></div>'); // Add a trash icon
            }

            this._updateUiVal();
          }

          // Add #id to #image, and initialize its values
          if (this.flgs.canvas.drag_flg === false) {
            // Global value for the selected ID
            GlbEve.CURRENT_ID = $fileWrap.attr('id');
            this.file.fileId = `#${GlbEve.CURRENT_ID}`;
            this.file.$fileId = $(`#${GlbEve.CURRENT_ID}`);

            this.file.fileIdWidth = this.file.$fileId.outerWidth();
            this.file.fileIdHeight = this.file.$fileId.outerHeight();
            this.file.fileIdRatio = this.file.fileIdHeight / this.file.fileIdWidth;

            this.file.fileIdTheta = LibEve.getRotationRad(this.file.$fileId[0]);
            this.file.rotatedSize.width =
              this.file.fileIdWidth * M.abs(M.cos(this.file.fileIdTheta)) +
              this.file.fileIdHeight * M.abs(M.sin(this.file.fileIdTheta));
            this.file.rotatedSize.height =
              this.file.fileIdHeight * M.abs(M.cos(this.file.fileIdTheta)) +
              this.file.fileIdWidth * M.abs(M.sin(this.file.fileIdTheta));

            this.file.fileIdPos = this.file.$fileId.offset();

            this.file.fileIdRelPosX = e.clientX - this.file.fileIdPos.left;
            this.file.fileIdRelPosY = e.clientY - this.file.fileIdPos.top;

            // Initialize this.file.rotatedCenterPos. These are screen-space coordinates
            this.file.rotatedCenterPos.left =
              this.file.$fileId.offset().left +
              this.file.rotatedSize.width / 2 / GlbEve.MOUSE_WHEEL_VAL;
            this.file.rotatedCenterPos.top =
              this.file.$fileId.offset().top +
              this.file.rotatedSize.height / 2 / GlbEve.MOUSE_WHEEL_VAL;

            // Initialize the initRads for a rotating function
            this.tmp.ro.left_top_initRad = LibEve.calcRadians(
              -this.file.fileIdWidth / 2,
              -this.file.fileIdHeight / 2
            );
            this.tmp.ro.right_top_initRad = LibEve.calcRadians(
              this.file.fileIdWidth / 2,
              -this.file.fileIdHeight / 2
            );
            this.tmp.ro.right_bottom_initRad = LibEve.calcRadians(
              this.file.fileIdWidth / 2,
              this.file.fileIdHeight / 2
            );
            this.tmp.ro.left_bottom_initRad = LibEve.calcRadians(
              -this.file.fileIdWidth / 2,
              this.file.fileIdHeight / 2
            );

            // Set the $fileId to be the highest of all the other unselected elements
            GlbEve.HIGHEST_Z_INDEX += 1;
            this.file.$fileId.css('z-index', GlbEve.HIGHEST_Z_INDEX);
            this.flgs.canvas.drag_flg = true;
          }
        }
      }
    },

    //

    _reset() {
      $('.selected').remove();

      $('.thumbtack-icon').remove();
      $('.resize-icon').remove();
      $('.rotate-icon').remove();
      $('.flip-icon').remove();
      $('.trash-icon').remove();

      $('.re-left-top').remove();
      $('.re-right-top').remove();
      $('.re-right-bottom').remove();
      $('.re-left-bottom').remove();

      $('.ro-left-top').remove();
      $('.ro-right-top').remove();
      $('.ro-right-bottom').remove();
      $('.ro-left-bottom').remove();
    },

    //

    _update() {
      // Refrash the rendering result of each canvas when changing its size.
      // This canvas is for color picking.colpick-eve.js
      if (this.file.$fileId !== null && this.file.$fileId.find('.canvas-colpick').length > 0) {
        if (
          this.flgs.canvas.re.left_top_flg === true ||
          this.flgs.canvas.re.right_top_flg === true ||
          this.flgs.canvas.re.right_bottom_flg === true ||
          this.flgs.canvas.re.left_bottom_flg === true
        ) {
          setTimeout(() => {
            const img = new Image();
            img.src = this.file.$fileId.find('img').attr('src');
            img.onload = () => {
              this.file.$fileId
                .find('.canvas-colpick')[0]
                .getContext('2d')
                .drawImage(img, 0, 0, this.file.$fileId.width(), this.file.$fileId.height());
            };
            this.file.$fileId.find('.canvas-colpick').attr('width', this.file.$fileId.width());
            this.file.$fileId.find('.canvas-colpick').attr('height', this.file.$fileId.height());
          }, this.options.UPDATE_CANVAS_SIZE_DELAY);
        }
      }
    },

    //

    _handleEventMouseDown(e) {
      const self = this;
      e.stopPropagation();

      if (e.target.closest('.thumbtack-icon')) {
        $(e.target)
          .parents('.thumbtack-wrapper')
          .toggleClass('active');

        if (
          $(e.target)
            .parents('.thumbtack-wrapper')
            .hasClass('active')
        ) {
          this.flgs.canvas.thumbtack_flg = true;
          this._updateUiVal();
        } else {
          this.flgs.canvas.thumbtack_flg = false;
        }
      }

      if (e.target.closest('.resize-icon')) {
        $(e.target)
          .parents('.resize-wrapper')
          .toggleClass('active');

        if (
          $(e.target)
            .parents('.resize-wrapper')
            .hasClass('active')
        ) {
          if (!this.file.$fileId.hasClass('ro-left-top')) {
            this.file.$fileId.prepend(self.resizeBox);
            this._updateUiVal();
          }
        } else {
          this.file.$fileId.children('.re-left-top').remove();
          this.file.$fileId.children('.re-right-top').remove();
          this.file.$fileId.children('.re-right-bottom').remove();
          this.file.$fileId.children('.re-left-bottom').remove();
        }
      }

      if (e.target.closest('.rotate-icon')) {
        $(e.target)
          .parents('.rotate-wrapper')
          .toggleClass('active');

        if (
          $(e.target)
            .parents('.rotate-wrapper')
            .hasClass('active')
        ) {
          if (!this.file.$fileId.hasClass('ro-left-top')) {
            this.file.$fileId.removeClass('not-rotated');
            this.file.$fileId.prepend(self.rotateBox);
            this._updateUiVal();
          }
        } else {
          this.file.$fileId.addClass('not-rotated');
          this.file.$fileId.children('.ro-left-top').remove();
          this.file.$fileId.children('.ro-right-top').remove();
          this.file.$fileId.children('.ro-right-bottom').remove();
          this.file.$fileId.children('.ro-left-bottom').remove();
        }
      }

      if (e.target.closest('.flip-icon')) {
        $(e.target)
          .parents('.flip-wrapper')
          .toggleClass('active');

        if (
          $(e.target)
            .parents('.flip-wrapper')
            .hasClass('active')
        ) {
          $(`${this.file.fileId}`)
            .find('.is-flipped')
            .addClass('flipped');
          this._updateUiVal();
        } else {
          $(`${this.file.fileId}`)
            .find('.is-flipped')
            .removeClass('flipped');
        }
      }

      if (e.target.closest('.trash-icon')) {
        $(e.target)
          .parents('.trash-wrapper')
          .toggleClass('active');

        if (
          $(e.target)
            .parents('.trash-wrapper')
            .hasClass('active')
        ) {
          $(this.file.fileId).remove();
        }
      }
    },

    //

    _handleEventMouseMove(e) {
      e.preventDefault();
      const pClientX = e.clientX - $('#zoom').offset().left;
      const pClientY = e.clientY - $('#zoom').offset().top;
      let mouseWheelAvailFlg = false;
      if (e.button === this.options.BUTTON_FOR_MOUSEWHEEL) {
        mouseWheelAvailFlg = true;
      }

      this._dragged(e, pClientX, pClientY, mouseWheelAvailFlg);
      this._rotate(e, mouseWheelAvailFlg);
      this._resize(e, mouseWheelAvailFlg);
    },

    //

    _dragged(e, pClientX, pClientY, mouseWheelAvailFlg) {
      let targetPosLeft;
      let targetPosTop;
      let resLeft;
      let resTop;

      if (this.flgs.config.no_zooming_flg === true) {
        targetPosLeft = e.clientX - this.file.fileIdRelPosX;
        targetPosTop = e.clientY - this.file.fileIdRelPosY;

        resLeft = (this.file.rotatedSize.width - this.file.fileIdWidth) / 2 + targetPosLeft;
        resTop = (this.file.rotatedSize.height - this.file.fileIdHeight) / 2 + targetPosTop;
      } else {
        targetPosLeft = pClientX - this.file.fileIdRelPosX;
        targetPosTop = pClientY - this.file.fileIdRelPosY;

        resLeft =
          (this.file.rotatedSize.width - this.file.fileIdWidth) / 2 +
          targetPosLeft * GlbEve.MOUSE_WHEEL_VAL;
        resTop =
          (this.file.rotatedSize.height - this.file.fileIdHeight) / 2 +
          targetPosTop * GlbEve.MOUSE_WHEEL_VAL;
      }

      if (
        mouseWheelAvailFlg === false &&
        this.flgs.canvas.thumbtack_flg === false &&
        this.flgs.canvas.resize_flg === false &&
        this.flgs.canvas.rotate_flg === false
      ) {
        if (this.flgs.canvas.drag_flg === true) {
          if (
            this.flgs.oekaki.move_wheelcircle_flg === false &&
            this.flgs.oekaki.move_trianglecircle_flg === false &&
            this.flgs.colpick.active_spuit_flg === false &&
            this.flgs.colpick.move_circle_flg === false
          ) {
            this.file.$fileId.css({
              left: `${resLeft}px`,
              top: `${resTop}px`
            });
          }

          this.file.rotatedCenterPos.left =
            this.file.$fileId.offset().left +
            this.file.rotatedSize.width / 2 / GlbEve.MOUSE_WHEEL_VAL;
          this.file.rotatedCenterPos.top =
            this.file.$fileId.offset().top +
            this.file.rotatedSize.height / 2 / GlbEve.MOUSE_WHEEL_VAL;
        }
      }
    },

    //

    _resize(e, mouseWheelAvailFlg) {
      if (mouseWheelAvailFlg === false && this.flgs.canvas.resize_flg === true) {
        if (this.flgs.canvas.re.left_top_flg === true) {
          this.file.$fileId.css({
            top: `${(this.file.fileIdPos.top - $('#zoom').offset().top) * GlbEve.MOUSE_WHEEL_VAL +
              (this.file.fileIdHeight -
                (this.file.fileIdWidth -
                  (e.clientX - this.file.fileIdPos.left) * GlbEve.MOUSE_WHEEL_VAL) *
                  this.file.fileIdRatio)}px`,
            left: `${(this.file.fileIdPos.left - $('#zoom').offset().left) *
              GlbEve.MOUSE_WHEEL_VAL +
              (e.clientX - this.file.fileIdPos.left) * GlbEve.MOUSE_WHEEL_VAL}px`,
            width: `${this.file.fileIdWidth -
              (e.clientX - this.file.fileIdPos.left) * GlbEve.MOUSE_WHEEL_VAL}px`
          });
        }

        if (this.flgs.canvas.re.right_top_flg === true) {
          this.file.$fileId.css({
            top: `${(this.file.fileIdPos.top - $('#zoom').offset().top) * GlbEve.MOUSE_WHEEL_VAL +
              (this.file.fileIdHeight -
                (e.clientX - this.file.fileIdPos.left) *
                  GlbEve.MOUSE_WHEEL_VAL *
                  this.file.fileIdRatio)}px`,
            left: `${(this.file.fileIdPos.left - $('#zoom').offset().left) *
              GlbEve.MOUSE_WHEEL_VAL}px`,
            width: `${(e.clientX - this.file.fileIdPos.left) * GlbEve.MOUSE_WHEEL_VAL}px`
          });
        }

        if (this.flgs.canvas.re.right_bottom_flg === true) {
          this.file.$fileId.css({
            top: `${(this.file.fileIdPos.top - $('#zoom').offset().top) *
              GlbEve.MOUSE_WHEEL_VAL}px`,
            left: `${(this.file.fileIdPos.left - $('#zoom').offset().left) *
              GlbEve.MOUSE_WHEEL_VAL}px`,
            width: `${(e.clientX - this.file.fileIdPos.left) * GlbEve.MOUSE_WHEEL_VAL}px`
          });
        }

        if (this.flgs.canvas.re.left_bottom_flg === true) {
          this.file.$fileId.css({
            top: `${(this.file.fileIdPos.top - $('#zoom').offset().top) *
              GlbEve.MOUSE_WHEEL_VAL}px`,
            left: `${(this.file.fileIdPos.left -
              $('#zoom').offset().left +
              (e.clientX - this.file.fileIdPos.left)) *
              GlbEve.MOUSE_WHEEL_VAL}px`,
            width: `${this.file.fileIdWidth -
              (e.clientX - this.file.fileIdPos.left) * GlbEve.MOUSE_WHEEL_VAL}px`
          });
        }
      }
    },

    //

    _rotate(e, mouseWheelAvailFlg) {
      const fileCenterPosX = this.file.rotatedCenterPos.left;
      const fileCenterPosY = this.file.rotatedCenterPos.top;
      const rad = LibEve.calcRadians(e.clientX - fileCenterPosX, e.clientY - fileCenterPosY);

      if (mouseWheelAvailFlg === false && this.flgs.canvas.rotate_flg === true) {
        if (this.flgs.canvas.ro.left_top_flg === true) {
          const resRad = rad - this.tmp.ro.left_top_initRad;
          this.file.$fileId.css('transform', `rotate(${resRad}rad)`);
        }

        if (this.flgs.canvas.ro.right_top_flg === true) {
          const resRad = rad - this.tmp.ro.right_top_initRad;
          this.file.$fileId.css('transform', `rotate(${resRad}rad)`);
        }

        if (this.flgs.canvas.ro.right_bottom_flg === true) {
          const resRad = rad - this.tmp.ro.right_bottom_initRad;
          this.file.$fileId.css('transform', `rotate(${resRad}rad)`);
        }

        if (this.flgs.canvas.ro.left_bottom_flg === true) {
          const resRad = rad - this.tmp.ro.left_bottom_initRad;
          this.file.$fileId.css('transform', `rotate(${resRad}rad)`);
        }
      }
    },

    //

    _updateUiVal() {
      // A selected area
      $('#canvas-eve .selected').css({
        'border-width': `${GlbEve.MOUSE_WHEEL_VAL}px`
      });

      // Icons
      $('.thumbtack-icon').css({
        width: `${30 * GlbEve.MOUSE_WHEEL_VAL}px`,
        height: `${40 * GlbEve.MOUSE_WHEEL_VAL}px`
      });
      $('.resize-icon').css({
        width: `${30 * GlbEve.MOUSE_WHEEL_VAL}px`,
        height: `${30 * GlbEve.MOUSE_WHEEL_VAL}px`
      });
      $('.rotate-icon').css({
        width: `${30 * GlbEve.MOUSE_WHEEL_VAL}px`,
        height: `${30 * GlbEve.MOUSE_WHEEL_VAL}px`
      });
      $('.flip-icon').css({
        width: `${30 * GlbEve.MOUSE_WHEEL_VAL}px`,
        height: `${26 * GlbEve.MOUSE_WHEEL_VAL}px`
      });
      $('.trash-icon').css({
        width: `${30 * GlbEve.MOUSE_WHEEL_VAL}px`,
        height: `${35 * GlbEve.MOUSE_WHEEL_VAL}px`
      });

      // Function wrapper
      $('.function-wrapper').css({
        right: `${-70 * GlbEve.MOUSE_WHEEL_VAL}px`
      });
      $('.function-wrapper>div:not(:last-of-type)').css({
        'margin-bottom': `${15 * GlbEve.MOUSE_WHEEL_VAL}px`
      });

      // Resize
      $('.re-left-top, .re-right-top, .re-right-bottom, .re-left-bottom').css({
        width: `${10 * GlbEve.MOUSE_WHEEL_VAL}px`,
        height: `${10 * GlbEve.MOUSE_WHEEL_VAL}px`,
        'border-width': `${1 * GlbEve.MOUSE_WHEEL_VAL}px`
      });
      $('.re-left-top').css({
        top: `${-6 * GlbEve.MOUSE_WHEEL_VAL}px`,
        left: `${-6 * GlbEve.MOUSE_WHEEL_VAL}px`
      });
      $('.re-right-top').css({
        top: `${-6 * GlbEve.MOUSE_WHEEL_VAL}px`,
        right: `${-6 * GlbEve.MOUSE_WHEEL_VAL}px`
      });
      $('.re-right-bottom').css({
        bottom: `${-6 * GlbEve.MOUSE_WHEEL_VAL}px`,
        right: `${-6 * GlbEve.MOUSE_WHEEL_VAL}px`
      });
      $('.re-left-bottom').css({
        bottom: `${-6 * GlbEve.MOUSE_WHEEL_VAL}px`,
        left: `${-6 * GlbEve.MOUSE_WHEEL_VAL}px`
      });

      // Rotate
      $('.ro-left-top, .ro-right-top, .ro-right-bottom, .ro-left-bottom').css({
        width: `${20 * GlbEve.MOUSE_WHEEL_VAL}px`,
        height: `${20 * GlbEve.MOUSE_WHEEL_VAL}px`
      });
      $('.ro-left-top').css({
        top: `${-30 * GlbEve.MOUSE_WHEEL_VAL}px`,
        left: `${-30 * GlbEve.MOUSE_WHEEL_VAL}px`
      });
      $('.ro-right-top').css({
        top: `${-30 * GlbEve.MOUSE_WHEEL_VAL}px`,
        right: `${-30 * GlbEve.MOUSE_WHEEL_VAL}px`
      });
      $('.ro-right-bottom').css({
        bottom: `${-30 * GlbEve.MOUSE_WHEEL_VAL}px`,
        right: `${-30 * GlbEve.MOUSE_WHEEL_VAL}px`
      });
      $('.ro-left-bottom').css({
        bottom: `${-30 * GlbEve.MOUSE_WHEEL_VAL}px`,
        left: `${-30 * GlbEve.MOUSE_WHEEL_VAL}px`
      });
    }
  });

  return Canvas;
})(window, document, Math);

export default CanvasEve;
