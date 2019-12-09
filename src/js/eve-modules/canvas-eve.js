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
   * Multi-selecting function for CanvasEve.
   *
   */
  function MultiSelect() {
    this.$canvasEveWrapper = $('#canvas-eve-wrapper');
    this.$selectedArea = null; // lazy load

    this.newAreaPos = {
      x: null, // lazy load
      y: null // lazy load
    };
    this.newSelectedAreaPos = {
      x: null, // lazy load
      y: null // lazy load
    };
    this.endSelectedAreaPos = {
      x: null, // lazy load
      y: null // lazy load
    };

    this.flgs = {
      create_selected_area_flg: false,
      is_multi_mode_flg: false
    };
  }

  MultiSelect.prototype = {
    constructor: MultiSelect,

    options: {
      BUTTON_FOR_LEFT: 0
    },

    mouseDownEvent(e) {
      if (e.button === this.options.BUTTON_FOR_LEFT) {
        this._handleMultiMode(e);

        if (e.target.closest('#reset-res')) {
          LibEve.iframePointerNone();
          this._setFlgs();
          this._createSelectedArea(e);
        }
      }
    },

    //

    mouseUpEvent() {
      this._resetFlgs();
      if (this.$selectedArea !== null) this._releaseSelectedArea();
    },

    //

    mouseMoveEvent(e) {
      if (this.flgs.create_selected_area_flg === true)
        this._updateSelectedArea(e);
    },

    //

    _handleMultiMode(e) {
      let $fileWrap = $(e.target).parents('.file-wrap');
      if ($fileWrap.length === 0) {
        $fileWrap = $(e.target);
      }

      if (
        $fileWrap.find('.multi').length !== 1 &&
        FlgEve.ui.is_ui_flg === false
      ) {
        FlgEve.canvas.select.is_multi_flg = false;
      }
    },

    //

    _setFlgs() {
      this.flgs.create_selected_area_flg = true;
    },

    //

    _resetFlgs() {
      if (this.flgs.create_selected_area_flg === true)
        this.flgs.create_selected_area_flg = false;
    },

    //

    _createSelectedArea(e) {
      const startX = e.clientX;
      const startY = e.clientY;
      const selectedArea = D.createElement('div');
      selectedArea.id = 'selected-area';
      selectedArea.style.left = `${startX}px`;
      selectedArea.style.top = `${startY}px`;
      selectedArea.style.zIndex = 1;

      this.newAreaPos.x = startX;
      this.newAreaPos.y = startY;
      this.$selectedArea = $(selectedArea);
      this.$canvasEveWrapper.append(selectedArea);
    },

    //

    _updateSelectedArea(e) {
      const { $selectedArea } = this;
      const startX = this.newAreaPos.x;
      const startY = this.newAreaPos.y;
      const endX = e.clientX;
      const endY = e.clientY;
      const tmpW = endX - startX;
      const tmpH = endY - startY;
      const resultW = tmpW > 0 ? tmpW : -tmpW;
      const resultH = tmpH > 0 ? tmpH : -tmpH;
      const resultX = tmpW > 0 ? startX : startX - resultW;
      const resultY = tmpH > 0 ? startY : startY - resultH;

      this.newSelectedAreaPos.x = tmpW > 0 ? startX : endX;
      this.newSelectedAreaPos.y = tmpH > 0 ? startY : endY;
      this.endSelectedAreaPos.x = tmpW > 0 ? endX : startX;
      this.endSelectedAreaPos.y = tmpH > 0 ? endY : startY;

      $selectedArea.css({
        left: `${resultX}px`,
        top: `${resultY}px`,
        width: `${resultW}px`,
        height: `${resultH}px`
      });
    },

    //

    _releaseSelectedArea() {
      this.$selectedArea.remove();
      this.$selectedArea = null;

      this._evaluateArea();
      this._initVal();
    },

    //

    _evaluateArea() {
      const $fileWraps = $('.file-wrap');
      const n = $fileWraps.length;
      let fileWrap;
      let $fileWrap;
      let fileStartX;
      let fileStartY;
      let fileEndX;
      let fileEndY;
      let filePos;
      const areaStartX = this.newSelectedAreaPos.x;
      const areaStartY = this.newSelectedAreaPos.y;
      const areaEndX = this.endSelectedAreaPos.x;
      const areaEndY = this.endSelectedAreaPos.y;
      const areaPos = {
        startX: areaStartX,
        startY: areaStartY,
        endX: areaEndX,
        endY: areaEndY
      };
      let onlyDraggableFlg = false;
      let availCount = 0;
      // console.log($fileWraps);

      for (let i = 0; i < n; i++) {
        fileWrap = $fileWraps[i];
        $fileWrap = $(fileWrap);
        // console.log($fileWrap);

        if ($fileWrap.parents('#canvas-eve').length === 1) {
          fileStartX = $fileWrap.offset().left;
          fileStartY = $fileWrap.offset().top;
          fileEndX = fileStartX + $fileWrap.width() / GlbEve.MOUSE_WHEEL_VAL;
          fileEndY = fileStartY + $fileWrap.height() / GlbEve.MOUSE_WHEEL_VAL;
          filePos = {
            startX: fileStartX,
            startY: fileStartY,
            endX: fileEndX,
            endY: fileEndY
          };

          if ($fileWrap.find('.only-draggable').length > 0) {
            onlyDraggableFlg = true;
          } else {
            onlyDraggableFlg = false;
          }

          const isAvail = this._estimateBounding(areaPos, filePos);
          if (isAvail === true && onlyDraggableFlg === false) {
            availCount++;
            if (availCount === 1) {
              FlgEve.canvas.select.is_multi_flg = false;
            } else {
              FlgEve.canvas.select.is_multi_flg = true;
            }
            $fileWrap.prepend(
              `<div class="selected multi" style="border-width: ${GlbEve.MOUSE_WHEEL_VAL}px"></div>`
            );
          }
        }
      }
    },

    _estimateBounding(areaPos, filePos) {
      // console.log('filePos', filePos, 'areaPos', areaPos);
      const isLeftTopFile = this._isInBounding(areaPos, [
        filePos.startX,
        filePos.startY
      ]);
      const isRightTopFile = this._isInBounding(areaPos, [
        filePos.endX,
        filePos.startY
      ]);
      const isRightBottomFile = this._isInBounding(areaPos, [
        filePos.endX,
        filePos.endY
      ]);
      const isLeftBottomFile = this._isInBounding(areaPos, [
        filePos.startX,
        filePos.endY
      ]);

      const isLeftTopArea = this._isInBounding(filePos, [
        areaPos.startX,
        areaPos.startY
      ]);
      const isRightTopArea = this._isInBounding(filePos, [
        areaPos.endX,
        areaPos.startY
      ]);
      const isRightBottomArea = this._isInBounding(filePos, [
        areaPos.endX,
        areaPos.endY
      ]);
      const isLeftBottomArea = this._isInBounding(filePos, [
        areaPos.startX,
        areaPos.endY
      ]);

      if (
        isLeftTopFile ||
        isRightTopFile ||
        isRightBottomFile ||
        isLeftBottomFile ||
        isLeftTopArea ||
        isRightTopArea ||
        isRightBottomArea ||
        isLeftBottomArea
      ) {
        return true;
      }

      if (
        areaPos.startX < filePos.startX &&
        filePos.endX < areaPos.endX &&
        filePos.startY < areaPos.startY &&
        areaPos.endY < filePos.endY
      ) {
        return true;
      }

      if (
        filePos.startX < areaPos.startX &&
        areaPos.endX < filePos.endX &&
        areaPos.startY < filePos.startY &&
        filePos.endY < areaPos.endY
      ) {
        return true;
      }

      return false;
    },

    //

    _isInBounding(aPos, tPos) {
      if (aPos.startX < tPos[0] && tPos[0] < aPos.endX) {
        if (aPos.startY < tPos[1] && tPos[1] < aPos.endY) {
          return true;
        }
      }

      return false;
    },

    //

    _initVal() {
      this.newAreaPos = {
        x: null,
        y: null
      };
      this.newSelectedAreaPos = {
        x: null,
        y: null
      };
      this.endSelectedAreaPos = {
        x: null,
        y: null
      };
    }
  };

  /**
   * Auto-alignment function for CanvasEve.
   *
   */
  function AutoAlign() {
    this.keyMap = {};
  }

  AutoAlign.prototype = {
    constructor: AutoAlign,

    options: {
      THRESHOLD: 10000
    },

    //

    keyDownEvent(e) {
      this.keyMap[e.key] = true;

      const isCtrlKey = this.keyMap.Control;
      if (isCtrlKey) {
        this._verticalAlignEntry(e);
        this._horizontalAlignEntry(e);
      } else {
        this.keyMap = {};
      }

      // console.log(this.keyMap);
    },

    //

    // Reset specific keys in the keyMap when keyUp events are called
    keyUpEvent(e) {
      if (e.key === 'Control') this.keyMap.Control = false;
    },

    //

    // Initialize all keyMaps values when the key events are finshed executing
    _initKeyMap() {
      this.keyMap.ArrowUp = false;
      this.keyMap.ArrowDown = false;
      this.keyMap.ArrowLeft = false;
      this.keyMap.ArrowRight = false;
    },

    //

    _verticalAlignEntry(e) {
      const isDownKey = this.keyMap.ArrowDown;
      const isUpKey = this.keyMap.ArrowUp;

      if (isDownKey || isUpKey) {
        e.preventDefault();
        this._verticalAlign();
      }
    },

    //

    _verticalAlign() {
      const $fileWraps = $('.file-wrap');
      const n = $fileWraps.length;
      let minTop = this.options.THRESHOLD;
      let maxBottom = -this.options.THRESHOLD;

      for (let i = 0; i < n; i++) {
        const $fileWrap = $($fileWraps[i]);

        if ($fileWrap.find('.multi').length === 1) {
          const { top } = $fileWrap.offset();
          const height = $fileWrap.height();
          const bottom = top + height / GlbEve.MOUSE_WHEEL_VAL;

          minTop = top < minTop ? top : minTop;
          maxBottom = bottom > maxBottom ? bottom : maxBottom;
        }
      }

      const isUpKey = this.keyMap.ArrowUp;
      const isDownKey = this.keyMap.ArrowDown;

      if (isUpKey) this._alignFiles($fileWraps, minTop, 'verticalAlignTop');
      if (isDownKey)
        this._alignFiles($fileWraps, maxBottom, 'verticalAlignBottom');

      this._initKeyMap();
    },

    //

    _horizontalAlignEntry(e) {
      const isLeftKey = this.keyMap.ArrowLeft;
      const isRightKey = this.keyMap.ArrowRight;

      if (isLeftKey || isRightKey) {
        e.preventDefault();
        this._horizontalAlign();
      }
    },

    //

    _horizontalAlign() {
      const $fileWraps = $('.file-wrap');
      const n = $fileWraps.length;
      let minLeft = this.options.THRESHOLD;
      let maxRight = -this.options.THRESHOLD;

      for (let i = 0; i < n; i++) {
        const $fileWrap = $($fileWraps[i]);

        if ($fileWrap.find('.multi').length === 1) {
          const { left } = $fileWrap.offset();
          const width = $fileWrap.width();
          const right = left + width / GlbEve.MOUSE_WHEEL_VAL;

          minLeft = left < minLeft ? left : minLeft;
          maxRight = right > maxRight ? right : maxRight;
        }
      }

      const isLeftKey = this.keyMap.ArrowLeft;
      const isRightKey = this.keyMap.ArrowRight;

      if (isLeftKey)
        this._alignFiles($fileWraps, minLeft, 'horizontalAlignLeft');
      if (isRightKey)
        this._alignFiles($fileWraps, maxRight, 'horizontalAlignRight');

      this._initKeyMap();
    },

    //

    _alignFiles($fileWraps, limitVal, mode) {
      const n = $fileWraps.length;
      let targetVal;
      let resultTargetVal;

      for (let i = 0; i < n; i++) {
        const $fileWrapOrigin = $($fileWraps[i]);
        const origin = {
          id: $fileWrapOrigin.attr('id'),
          width: $fileWrapOrigin.width(),
          height: $fileWrapOrigin.height(),
          left: $fileWrapOrigin.offset().left,
          right:
            $fileWrapOrigin.offset().left +
            $fileWrapOrigin.width() / GlbEve.MOUSE_WHEEL_VAL,
          top: $fileWrapOrigin.offset().top,
          bottom:
            $fileWrapOrigin.offset().top +
            $fileWrapOrigin.height() / GlbEve.MOUSE_WHEEL_VAL
        };
        let isInsertedFlg = false;

        if ($fileWrapOrigin.find('.multi').length === 1) {
          for (let j = 0; j < n; j++) {
            const $fileWrapTarget = $($fileWraps[j]);
            const target = {
              id: $fileWrapTarget.attr('id'),
              width: $fileWrapTarget.width(),
              height: $fileWrapTarget.height(),
              left: $fileWrapTarget.offset().left,
              right:
                $fileWrapTarget.offset().left +
                $fileWrapTarget.width() / GlbEve.MOUSE_WHEEL_VAL,
              top: $fileWrapTarget.offset().top,
              bottom:
                $fileWrapTarget.offset().top +
                $fileWrapTarget.height() / GlbEve.MOUSE_WHEEL_VAL
            };

            if (
              $fileWrapTarget.find('.multi').length === 1 &&
              origin.id !== target.id
            ) {
              const isHigher = {
                alignTop: target.bottom < origin.top + 1,
                alignBottom: target.top > origin.bottom - 1,
                alignLeft: target.right < origin.left + 1,
                alignRight: target.left > origin.right - 1
              };
              const isLeft =
                origin.left < target.right && target.right <= origin.right;
              const isRight =
                origin.left <= target.left && target.left < origin.right;
              const isTop =
                origin.top < target.bottom && target.bottom <= origin.bottom;
              const isBottom =
                origin.top <= target.top && target.top < origin.bottom;
              const isMiddle = {
                vertical:
                  target.left <= origin.left && origin.right <= target.right,
                horizontal:
                  target.top <= origin.top && origin.bottom <= target.bottom
              };
              const isCover = {
                vertical:
                  origin.left <= target.left && target.right <= origin.right,
                horizontal:
                  origin.top <= target.top && target.bottom <= origin.bottom
              };

              if (!isInsertedFlg) {
                targetVal = limitVal;
              }

              switch (mode) {
                case 'verticalAlignTop':
                  if (isHigher.alignTop) {
                    if (
                      isLeft ||
                      isRight ||
                      isCover.vertical ||
                      isMiddle.vertical
                    ) {
                      targetVal =
                        target.bottom > targetVal ? target.bottom : targetVal;
                      isInsertedFlg = true;
                    }
                  }
                  break;

                case 'verticalAlignBottom':
                  if (isHigher.alignBottom) {
                    if (
                      isLeft ||
                      isRight ||
                      isCover.vertical ||
                      isMiddle.vertical
                    ) {
                      targetVal =
                        target.top < targetVal ? target.top : targetVal;
                      isInsertedFlg = true;
                    }
                  }
                  break;

                case 'horizontalAlignLeft':
                  if (isHigher.alignLeft) {
                    if (
                      isTop ||
                      isBottom ||
                      isCover.horizontal ||
                      isMiddle.horizontal
                    ) {
                      targetVal =
                        target.right > targetVal ? target.right : targetVal;
                      isInsertedFlg = true;
                    }
                  }
                  break;

                case 'horizontalAlignRight':
                  if (isHigher.alignRight) {
                    if (
                      isTop ||
                      isBottom ||
                      isCover.horizontal ||
                      isMiddle.horizontal
                    ) {
                      targetVal =
                        target.left < targetVal ? target.left : targetVal;
                      isInsertedFlg = true;
                    }
                  }
                  break;

                default:
                  break;
              }
            }
          }

          switch (mode) {
            case 'verticalAlignTop':
              resultTargetVal =
                (targetVal - $('#zoom').offset().top) * GlbEve.MOUSE_WHEEL_VAL;
              if ($fileWrapOrigin.find('.multi').length === 1) {
                $fileWrapOrigin.css({
                  top: `${resultTargetVal}px`
                });
              }
              break;

            case 'verticalAlignBottom':
              resultTargetVal =
                (targetVal - $('#zoom').offset().top) * GlbEve.MOUSE_WHEEL_VAL -
                origin.height;
              if ($fileWrapOrigin.find('.multi').length === 1) {
                $fileWrapOrigin.css({
                  top: `${resultTargetVal}px`
                });
              }
              break;

            case 'horizontalAlignLeft':
              resultTargetVal =
                (targetVal - $('#zoom').offset().left) * GlbEve.MOUSE_WHEEL_VAL;
              if ($fileWrapOrigin.find('.multi').length === 1) {
                $fileWrapOrigin.css({
                  left: `${resultTargetVal}px`
                });
              }
              break;

            case 'horizontalAlignRight':
              resultTargetVal =
                (targetVal - $('#zoom').offset().left) *
                  GlbEve.MOUSE_WHEEL_VAL -
                origin.width;
              if ($fileWrapOrigin.find('.multi').length === 1) {
                $fileWrapOrigin.css({
                  left: `${resultTargetVal}px`
                });
              }
              break;

            default:
              break;
          }
        }
      }
    }
  };

  /**
   * Entry point for CanvasEve.
   *
   */
  function Canvas() {
    this.MultiSelect = new MultiSelect();
    this.AutoAlign = new AutoAlign();

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
    this.multiFile = {}; // lazy generated

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

  const modules = {};

  Canvas.prototype = Object.assign(modules, {
    constructor: Canvas,

    options: {
      BUTTON_FOR_LEFT: 0,
      BUTTON_FOR_MIDDLE: 1,
      UPDATE_CANVAS_SIZE_DELAY: 150,
      BRUSH_SIZE: 8,
      ERASER_SIZE: 30
    },

    //

    mouseDownEvent(e) {
      if (
        e.button === this.options.BUTTON_FOR_LEFT &&
        FlgEve.ui.toolbar.is_active_flg === false
      ) {
        LibEve.iframePointerNone();
        FlgEve.setFlgs(e);
        this.MultiSelect.mouseDownEvent(e);
        if (
          FlgEve.canvas.select.is_multi_flg === true &&
          !e.target.closest('#canvas-eve-ui')
        ) {
          this._initMulti(e);
        } else {
          this._initSingle(e);
        }
        if ($(e.target)[0].id === 'reset-res') {
          this._reset();
          this._initMultiFile();
        }
        this._handleEventMouseDown(e);
      }
    },

    //

    mouseUpEvent() {
      if (FlgEve.ui.toolbar.is_active_flg === false) {
        this._update(); // Execute it before resetting all flgs
        this.MultiSelect.mouseUpEvent();
        FlgEve.resetFlgs();
      }
    },

    //

    mouseMoveEvent(e) {
      this.MultiSelect.mouseMoveEvent(e);
      this._handleEventMouseMove(e);
    },

    //

    mouseWheelEvent() {
      this._updateUiVal();
    },

    //

    keyDownEvent(e) {
      this.AutoAlign.keyDownEvent(e);
    },

    //

    keyUpEvent(e) {
      this.AutoAlign.keyUpEvent(e);
    },

    //

    _initSingle(e) {
      const self = this;

      let $fileWrap = $(e.target).parents('.file-wrap');
      if ($fileWrap.length === 0) {
        $fileWrap = $(e.target);
      }

      if ($fileWrap && $fileWrap.hasClass('file-wrap')) {
        if ($fileWrap.find('.selected').length === 0) this._reset();

        // This if argument is the prefix for colpick-eve.js
        if (FlgEve.colpick.active_spuit_flg === false) {
          // Added selected symbols and other functions
          if (FlgEve.config.only_draggable_flg === false) {
            if (
              FlgEve.canvas.select.is_multi_flg === false ||
              $fileWrap.find('.selected').length === 0
            ) {
              if ($fileWrap.find('.selected').length === 0)
                $fileWrap.prepend('<div class="selected"></div>');

              // Resizing boxes
              if ($fileWrap.find('.resize-wrapper').hasClass('active')) {
                if ($fileWrap.find('.re-left-top').length === 0)
                  $fileWrap.prepend(self.resizeBox);
              }
              if ($fileWrap.find('.rotate-wrapper').hasClass('active')) {
                if ($fileWrap.find('.ro-left-top').length === 0)
                  $fileWrap.prepend(self.rotateBox); // Rotating circles
              }

              if ($fileWrap.find('.thumbtack-icon').length === 0)
                $fileWrap
                  .find('.thumbtack-wrapper')
                  .prepend('<div class="thumbtack-icon"></div>'); // Add a thumbtack icon
              if ($fileWrap.find('.resize-icon').length === 0)
                $fileWrap
                  .find('.resize-wrapper')
                  .prepend('<div class="resize-icon"></div>'); // Add a resizing icon
              if ($fileWrap.find('.rotate-icon').length === 0)
                $fileWrap
                  .find('.rotate-wrapper')
                  .prepend('<div class="rotate-icon"></div>'); // Add a rotating icon
              if ($fileWrap.find('.flip-icon').length === 0)
                $fileWrap
                  .find('.flip-wrapper')
                  .prepend('<div class="flip-icon"></div>'); // Add a flipping icon
              if ($fileWrap.find('.trash-icon').length === 0)
                $fileWrap
                  .find('.trash-wrapper')
                  .prepend('<div class="trash-icon"></div>'); // Add a trash icon
            }

            this._updateUiVal();
          }

          // Add #id to #image, and initialize its values
          if (FlgEve.canvas.drag_flg === false) {
            // Global value for the selected ID
            GlbEve.CURRENT_ID = $fileWrap.attr('id');
            const f = this.file;
            f.fileId = `#${GlbEve.CURRENT_ID}`;
            f.$fileId = $(`#${GlbEve.CURRENT_ID}`);

            f.fileIdWidth = f.$fileId.outerWidth();
            f.fileIdHeight = f.$fileId.outerHeight();
            f.fileIdRatio = f.fileIdHeight / f.fileIdWidth;

            f.fileIdTheta = LibEve.getRotationRad(f.$fileId[0]);
            f.rotatedSize.width =
              f.fileIdWidth * M.abs(M.cos(f.fileIdTheta)) +
              f.fileIdHeight * M.abs(M.sin(f.fileIdTheta));
            f.rotatedSize.height =
              f.fileIdHeight * M.abs(M.cos(f.fileIdTheta)) +
              f.fileIdWidth * M.abs(M.sin(f.fileIdTheta));

            f.fileIdPos = f.$fileId.offset();

            f.fileIdRelPosX = e.clientX - f.fileIdPos.left;
            f.fileIdRelPosY = e.clientY - f.fileIdPos.top;

            // Initialize f.rotatedCenterPos. These are screen-space coordinates
            f.rotatedCenterPos.left =
              f.$fileId.offset().left +
              f.rotatedSize.width / 2 / GlbEve.MOUSE_WHEEL_VAL;
            f.rotatedCenterPos.top =
              f.$fileId.offset().top +
              f.rotatedSize.height / 2 / GlbEve.MOUSE_WHEEL_VAL;

            // Initialize the initRads for a rotating function
            this.tmp.ro.left_top_initRad = LibEve.calcRadians(
              -f.fileIdWidth / 2,
              -f.fileIdHeight / 2
            );
            this.tmp.ro.right_top_initRad = LibEve.calcRadians(
              f.fileIdWidth / 2,
              -f.fileIdHeight / 2
            );
            this.tmp.ro.right_bottom_initRad = LibEve.calcRadians(
              f.fileIdWidth / 2,
              f.fileIdHeight / 2
            );
            this.tmp.ro.left_bottom_initRad = LibEve.calcRadians(
              -f.fileIdWidth / 2,
              f.fileIdHeight / 2
            );

            // Set the $fileId to be the highest of all the other unselected elements
            GlbEve.HIGHEST_Z_INDEX += 1;
            f.$fileId.css('z-index', GlbEve.HIGHEST_Z_INDEX);
            FlgEve.canvas.drag_flg = true;
          }
        }
      }
    },

    //

    _initMulti(e) {
      const $fileWraps = $('.file-wrap');
      const n = $fileWraps.length;
      let availCount = 0;

      for (let i = 0; i < n; i++) {
        const $fileWrap = $($fileWraps[i]);

        if ($fileWrap.find('.selected').length === 1) {
          // This if argument is the prefix for colpick-eve.js
          if (FlgEve.colpick.active_spuit_flg === false) {
            if (FlgEve.canvas.drag_flg === false) {
              // Global value for the selected ID
              GlbEve.CURRENT_ID = $fileWrap.attr('id');
              this.multiFile[availCount] = {};
              const m = this.multiFile[availCount];
              m.fileId = `#${GlbEve.CURRENT_ID}`;
              m.$fileId = $(`#${GlbEve.CURRENT_ID}`);

              m.fileIdWidth = m.$fileId.outerWidth();
              m.fileIdHeight = m.$fileId.outerHeight();
              m.fileIdRatio = m.fileIdHeight / m.fileIdWidth;

              m.fileIdTheta = LibEve.getRotationRad(m.$fileId[0]);
              m.rotatedSize = {};
              m.rotatedSize.width =
                m.fileIdWidth * M.abs(M.cos(m.fileIdTheta)) +
                m.fileIdHeight * M.abs(M.sin(m.fileIdTheta));
              m.rotatedSize.height =
                m.fileIdHeight * M.abs(M.cos(m.fileIdTheta)) +
                m.fileIdWidth * M.abs(M.sin(m.fileIdTheta));

              m.fileIdPos = m.$fileId.offset();

              m.fileIdRelPosX = e.clientX - m.fileIdPos.left;
              m.fileIdRelPosY = e.clientY - m.fileIdPos.top;

              // Initialize m.rotatedCenterPos. These are screen-space coordinates
              m.rotatedCenterPos = {};
              m.rotatedCenterPos.left =
                m.$fileId.offset().left +
                m.rotatedSize.width / 2 / GlbEve.MOUSE_WHEEL_VAL;
              m.rotatedCenterPos.top =
                m.$fileId.offset().top +
                m.rotatedSize.height / 2 / GlbEve.MOUSE_WHEEL_VAL;

              // Set the $fileId to be the highest of all the other unselected elements
              GlbEve.HIGHEST_Z_INDEX += 1;
              m.$fileId.css('z-index', GlbEve.HIGHEST_Z_INDEX);
              availCount++;
            }
          }
        }
      }
      FlgEve.canvas.drag_flg = true;
    },

    //

    _initMultiFile() {
      this.multiFile = {};
    },

    //

    _reset() {
      GlbEve.CURRENT_ID = null;

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
      const f = this.file;

      // Refrash the rendering result of each canvas when changing its size.
      // This canvas is for color picking.colpick-eve.js
      if (f.$fileId !== null && f.$fileId.hasClass('update-canvas')) {
        if (
          FlgEve.canvas.re.left_top_flg === true ||
          FlgEve.canvas.re.right_top_flg === true ||
          FlgEve.canvas.re.right_bottom_flg === true ||
          FlgEve.canvas.re.left_bottom_flg === true
        ) {
          this._updateCanvasColpick(f);
        }
      }
    },

    //

    _updateCanvasColpick(f) {
      setTimeout(() => {
        const img = new Image();
        img.src = f.$fileId.find('img').attr('src');
        img.onload = () => {
          f.$fileId
            .find('.canvas-colpick')[0]
            .getContext('2d')
            .drawImage(img, 0, 0, f.$fileId.width(), f.$fileId.height());
        };
        f.$fileId.find('.canvas-colpick').attr('width', f.$fileId.width());
        f.$fileId.find('.canvas-colpick').attr('height', f.$fileId.height());
      }, this.options.UPDATE_CANVAS_SIZE_DELAY);
    },

    //

    _handleEventMouseDown(e) {
      const self = this;
      const f = this.file;

      if (e.target.closest('.thumbtack-icon')) {
        $(e.target)
          .parents('.thumbtack-wrapper')
          .toggleClass('active');

        if (
          $(e.target)
            .parents('.thumbtack-wrapper')
            .hasClass('active')
        ) {
          FlgEve.canvas.thumbtack_flg = true;
          this._updateUiVal();
        } else {
          FlgEve.canvas.thumbtack_flg = false;
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
          if (!f.$fileId.hasClass('ro-left-top')) {
            f.$fileId.prepend(self.resizeBox);
            this._updateUiVal();
          }
        } else {
          f.$fileId.children('.re-left-top').remove();
          f.$fileId.children('.re-right-top').remove();
          f.$fileId.children('.re-right-bottom').remove();
          f.$fileId.children('.re-left-bottom').remove();
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
          if (!f.$fileId.hasClass('ro-left-top')) {
            f.$fileId.removeClass('not-rotated');
            f.$fileId.prepend(self.rotateBox);
            this._updateUiVal();
          }
        } else {
          f.$fileId.addClass('not-rotated');
          f.$fileId.children('.ro-left-top').remove();
          f.$fileId.children('.ro-right-top').remove();
          f.$fileId.children('.ro-right-bottom').remove();
          f.$fileId.children('.ro-left-bottom').remove();
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
          $(`${f.fileId}`)
            .find('.is-flipped')
            .addClass('flipped');
          this._updateUiVal();
        } else {
          $(`${f.fileId}`)
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
          $(f.fileId).remove();
        }
      }
    },

    //

    _handleEventMouseMove(e) {
      const pClientX = e.clientX - $('#zoom').offset().left;
      const pClientY = e.clientY - $('#zoom').offset().top;

      if (
        FlgEve.canvas.select.is_multi_flg === true &&
        !e.target.closest('#canvas-eve-ui')
      ) {
        this._draggedMulti(
          e,
          pClientX,
          pClientY,
          FlgEve.plain.active_mousewheel_flg
        );
      } else {
        this._draggedSingle(
          e,
          pClientX,
          pClientY,
          FlgEve.plain.active_mousewheel_flg
        );
      }
      this._rotate(e, FlgEve.plain.active_mousewheel_flg);
      this._resize(e, FlgEve.plain.active_mousewheel_flg);
    },

    //

    _draggedSingle(e, pClientX, pClientY, mouseWheelAvailFlg) {
      const f = this.file;
      let targetPosLeft;
      let targetPosTop;
      let resLeft;
      let resTop;

      if (FlgEve.config.no_zooming_flg === true) {
        targetPosLeft = e.clientX - f.fileIdRelPosX;
        targetPosTop = e.clientY - f.fileIdRelPosY;

        resLeft = (f.rotatedSize.width - f.fileIdWidth) / 2 + targetPosLeft;
        resTop = (f.rotatedSize.height - f.fileIdHeight) / 2 + targetPosTop;
      } else {
        targetPosLeft = pClientX - f.fileIdRelPosX;
        targetPosTop = pClientY - f.fileIdRelPosY;

        resLeft =
          (f.rotatedSize.width - f.fileIdWidth) / 2 +
          targetPosLeft * GlbEve.MOUSE_WHEEL_VAL;
        resTop =
          (f.rotatedSize.height - f.fileIdHeight) / 2 +
          targetPosTop * GlbEve.MOUSE_WHEEL_VAL;
      }

      if (
        mouseWheelAvailFlg === false &&
        FlgEve.canvas.thumbtack_flg === false &&
        FlgEve.canvas.resize_flg === false &&
        FlgEve.canvas.rotate_flg === false
      ) {
        if (FlgEve.canvas.drag_flg === true) {
          if (
            FlgEve.colpick.active_spuit_flg === false &&
            FlgEve.colpick.move_circle_flg === false
          ) {
            f.$fileId.css({
              left: `${resLeft}px`,
              top: `${resTop}px`
            });
          }

          f.rotatedCenterPos.left =
            f.$fileId.offset().left +
            f.rotatedSize.width / 2 / GlbEve.MOUSE_WHEEL_VAL;
          f.rotatedCenterPos.top =
            f.$fileId.offset().top +
            f.rotatedSize.height / 2 / GlbEve.MOUSE_WHEEL_VAL;
        }
      }
    },

    //

    _draggedMulti(e, pClientX, pClientY, mouseWheelAvailFlg) {
      const n = LibEve.keysCount(this.multiFile);
      for (let i = 0; i < n; i++) {
        const m = this.multiFile[i];
        const targetPosLeft = pClientX - m.fileIdRelPosX;
        const targetPosTop = pClientY - m.fileIdRelPosY;

        const resLeft =
          (m.rotatedSize.width - m.fileIdWidth) / 2 +
          targetPosLeft * GlbEve.MOUSE_WHEEL_VAL;
        const resTop =
          (m.rotatedSize.height - m.fileIdHeight) / 2 +
          targetPosTop * GlbEve.MOUSE_WHEEL_VAL;

        if (
          mouseWheelAvailFlg === false &&
          FlgEve.canvas.thumbtack_flg === false &&
          FlgEve.canvas.resize_flg === false &&
          FlgEve.canvas.rotate_flg === false
        ) {
          if (FlgEve.canvas.drag_flg === true) {
            if (
              FlgEve.colpick.active_spuit_flg === false &&
              FlgEve.colpick.move_circle_flg === false
            ) {
              m.$fileId.css({
                left: `${resLeft}px`,
                top: `${resTop}px`
              });
            }

            m.rotatedCenterPos.left =
              m.$fileId.offset().left +
              m.rotatedSize.width / 2 / GlbEve.MOUSE_WHEEL_VAL;
            m.rotatedCenterPos.top =
              m.$fileId.offset().top +
              m.rotatedSize.height / 2 / GlbEve.MOUSE_WHEEL_VAL;
          }
        }
      }
    },

    //

    _resize(e, mouseWheelAvailFlg) {
      const f = this.file;

      if (mouseWheelAvailFlg === false && FlgEve.canvas.resize_flg === true) {
        if (FlgEve.canvas.re.left_top_flg === true) {
          f.$fileId.css({
            top: `${(f.fileIdPos.top - $('#zoom').offset().top) *
              GlbEve.MOUSE_WHEEL_VAL +
              (f.fileIdHeight -
                (f.fileIdWidth -
                  (e.clientX - f.fileIdPos.left) * GlbEve.MOUSE_WHEEL_VAL) *
                  f.fileIdRatio)}px`,
            left: `${(f.fileIdPos.left - $('#zoom').offset().left) *
              GlbEve.MOUSE_WHEEL_VAL +
              (e.clientX - f.fileIdPos.left) * GlbEve.MOUSE_WHEEL_VAL}px`,
            width: `${f.fileIdWidth -
              (e.clientX - f.fileIdPos.left) * GlbEve.MOUSE_WHEEL_VAL}px`
          });
        }

        if (FlgEve.canvas.re.right_top_flg === true) {
          f.$fileId.css({
            top: `${(f.fileIdPos.top - $('#zoom').offset().top) *
              GlbEve.MOUSE_WHEEL_VAL +
              (f.fileIdHeight -
                (e.clientX - f.fileIdPos.left) *
                  GlbEve.MOUSE_WHEEL_VAL *
                  f.fileIdRatio)}px`,
            left: `${(f.fileIdPos.left - $('#zoom').offset().left) *
              GlbEve.MOUSE_WHEEL_VAL}px`,
            width: `${(e.clientX - f.fileIdPos.left) *
              GlbEve.MOUSE_WHEEL_VAL}px`
          });
        }

        if (FlgEve.canvas.re.right_bottom_flg === true) {
          f.$fileId.css({
            top: `${(f.fileIdPos.top - $('#zoom').offset().top) *
              GlbEve.MOUSE_WHEEL_VAL}px`,
            left: `${(f.fileIdPos.left - $('#zoom').offset().left) *
              GlbEve.MOUSE_WHEEL_VAL}px`,
            width: `${(e.clientX - f.fileIdPos.left) *
              GlbEve.MOUSE_WHEEL_VAL}px`
          });
        }

        if (FlgEve.canvas.re.left_bottom_flg === true) {
          f.$fileId.css({
            top: `${(f.fileIdPos.top - $('#zoom').offset().top) *
              GlbEve.MOUSE_WHEEL_VAL}px`,
            left: `${(f.fileIdPos.left -
              $('#zoom').offset().left +
              (e.clientX - f.fileIdPos.left)) *
              GlbEve.MOUSE_WHEEL_VAL}px`,
            width: `${f.fileIdWidth -
              (e.clientX - f.fileIdPos.left) * GlbEve.MOUSE_WHEEL_VAL}px`
          });
        }
      }
    },

    //

    _rotate(e, mouseWheelAvailFlg) {
      const f = this.file;
      const fileCenterPosX = f.rotatedCenterPos.left;
      const fileCenterPosY = f.rotatedCenterPos.top;
      const rad = LibEve.calcRadians(
        e.clientX - fileCenterPosX,
        e.clientY - fileCenterPosY
      );

      if (mouseWheelAvailFlg === false && FlgEve.canvas.rotate_flg === true) {
        if (FlgEve.canvas.ro.left_top_flg === true) {
          const resRad = rad - this.tmp.ro.left_top_initRad;
          f.$fileId.css('transform', `rotate(${resRad}rad)`);
        }

        if (FlgEve.canvas.ro.right_top_flg === true) {
          const resRad = rad - this.tmp.ro.right_top_initRad;
          f.$fileId.css('transform', `rotate(${resRad}rad)`);
        }

        if (FlgEve.canvas.ro.right_bottom_flg === true) {
          const resRad = rad - this.tmp.ro.right_bottom_initRad;
          f.$fileId.css('transform', `rotate(${resRad}rad)`);
        }

        if (FlgEve.canvas.ro.left_bottom_flg === true) {
          const resRad = rad - this.tmp.ro.left_bottom_initRad;
          f.$fileId.css('transform', `rotate(${resRad}rad)`);
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
