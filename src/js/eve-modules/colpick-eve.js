/**
 *
 * Color picker for CANVAS EVE.
 *
 * Dependencies
 * - jquery-eve
 * - glb-eve
 * - lib-eve
 *
 */

import $ from '../common/jquery-eve';
import GlbEve from '../common/glb-eve';
import LibEve from '../common/lib-eve';

const ColpickEve = (() => {
  function Colpick() {
    this.circleRelPosX = 0;
    this.$barCircle = null;
    this.flgs = {
      move_circle_flg: false
    };
  }

  const modules = {};

  Colpick.prototype = Object.assign(modules, {
    constructor: Colpick,

    options: {
      BUTTON_FOR_LEFT: 0,
      HEX: '#32303f'
    },

    load() {
      this._initColpick();
    },

    //

    mouseDownEvent(e) {
      if (e.button === this.options.BUTTON_FOR_LEFT) {
        this._init(e);
        this._setFlgs(e);
        this._handleEventMouseDown(e);
      }
    },

    //

    mouseUpEvent() {
      this._resetFlgs();
    },

    //

    mouseMoveEvent(e) {
      this._handleEventMouseMove(e);
    },

    //

    changeEvent(e) {
      this._handleEventChange(e);
    },

    //

    _init(e) {
      if (
        e.target.closest('#red-cir-colpick') ||
        e.target.closest('#green-cir-colpick') ||
        e.target.closest('#blue-cir-colpick')
      ) {
        this.circleRelPosX = e.clientX - $(e.target).offset().left;
        this.$barCircle = $(e.target);
      }
    },

    //

    _setFlgs(e) {
      if (
        e.target.closest('#red-cir-colpick') ||
        e.target.closest('#green-cir-colpick') ||
        e.target.closest('#blue-cir-colpick')
      ) {
        this.flgs.move_circle_flg = true;
      }
    },

    //

    _resetFlgs() {
      if (this.flgs.move_circle_flg === true) this.flgs.move_circle_flg = false;
    },

    //

    _handleEventMouseDown(e) {
      if (e.target.closest('#copy-colpick')) this._copyHex();
      if (
        $('#toggle-colpick').hasClass('active') &&
        $(e.target)
          .parents('.file-wrap')
          .find('canvas').length > 0 &&
        e.button !== 1
      ) {
        const col = this._getColor(e);
        const hex = LibEve.rgb2hex([col[0], col[1], col[2]]);

        if (col[3] > 0) {
          this._updatePalette(hex);
          this._updateRgbBar(col);
          this._updateRgbInput(col);
        } else {
          this._initColpick();
        }
      }

      if (e.target.closest('#reset-res')) {
        if ($('#toggle-colpick').hasClass('active') && e.button !== 1) this._initColpick();
      }
    },

    //

    _handleEventMouseMove(e) {
      if (this.flgs.move_circle_flg === true) this._syncWithBar(e);
    },

    //

    _handleEventChange(e) {
      if (e.target.closest('#input-colpick')) {
        const hex = this._getHex(e);
        this._updatePalette(hex);

        const col = LibEve.hex2rgb(hex);
        this._updateRgbInput(col);
        this._updateRgbBar(col);
      }

      if (
        e.target.closest('#input-r-colpick') ||
        e.target.closest('#input-g-colpick') ||
        e.target.closest('#input-b-colpick')
      ) {
        // Update rgb values, convert it to hex and apply to a color code input
        const r = parseInt($('#r-colpick input').val(), 10);
        const g = parseInt($('#g-colpick input').val(), 10);
        const b = parseInt($('#b-colpick input').val(), 10);
        const hex = LibEve.rgb2hex([r, g, b]);
        const col = LibEve.hex2rgb(hex);
        this._updatePalette(hex);
        this._updateRgbBar(col);
      }
    },

    //

    _toggleColpick() {
      $('#toggle-colpick').toggleClass('active');

      if ($('#toggle-colpick').hasClass('active')) {
        $('#canvas-eve .file-wrap').removeClass('grab-pointer');
        $('#canvas-eve').addClass('spuit-pointer');
      } else {
        $('#canvas-eve').removeClass('spuit-pointer');
        $('#canvas-eve .file-wrap').addClass('grab-pointer');
      }
    },

    //

    _copyHex() {
      let hex = $('#input-colpick').val();
      if (hex.match(/#/)) hex = hex.split('#').join('');
      LibEve.copyTextToClipboard(hex);
    },

    //

    _getHex(e) {
      let hex = $(e.target).val();
      if (
        !$(e.target)
          .val()
          .match(/#/)
      ) {
        hex = `#${$(e.target).val()}`;
      } else {
        hex = `#${hex.split('#').join('')}`;
      }

      return hex;
    },

    //

    _getColor(e) {
      const $fileWrap = $(e.target).parents('.file-wrap');
      const context = $fileWrap.find('canvas')[0].getContext('2d');
      const relPosX = e.clientX - $fileWrap.offset().left;
      const relPosY = e.clientY - $fileWrap.offset().top;
      let imagedata = context.getImageData(
        relPosX * GlbEve.MOUSE_WHEEL_VAL,
        relPosY * GlbEve.MOUSE_WHEEL_VAL,
        1,
        1
      );
      if ($fileWrap.find('.flipped').length > 0) {
        imagedata = context.getImageData(
          $fileWrap.find('img').width() - relPosX * GlbEve.MOUSE_WHEEL_VAL,
          relPosY * GlbEve.MOUSE_WHEEL_VAL,
          1,
          1
        );
      }
      const r = imagedata.data[0];
      const g = imagedata.data[1];
      const b = imagedata.data[2];
      const a = imagedata.data[3];

      return [r, g, b, a];
    },

    //

    _updatePalette(hex) {
      $('#input-colpick').val(hex);
      $('#color-colpick').css('background-color', hex);
    },

    //

    _updateRgbBar(col) {
      const rBar = (col[0] / 255) * 100;
      const gBar = (col[1] / 255) * 100;
      const bBar = (col[2] / 255) * 100;

      $('#r-colpick .colbar-colpick').css('width', `${rBar}%`);
      $('#g-colpick .colbar-colpick').css('width', `${gBar}%`);
      $('#b-colpick .colbar-colpick').css('width', `${bBar}%`);

      $('#red-cir-colpick').css('left', `${rBar}%`);
      $('#green-cir-colpick').css('left', `${gBar}%`);
      $('#blue-cir-colpick').css('left', `${bBar}%`);
    },

    //

    _updateRgbInput(col) {
      $('#r-colpick input').val(col[0]);
      $('#g-colpick input').val(col[1]);
      $('#b-colpick input').val(col[2]);
    },

    //

    _initColpick() {
      const { HEX } = this.options;
      const r = LibEve.hex2rgb(HEX)[0];
      const g = LibEve.hex2rgb(HEX)[1];
      const b = LibEve.hex2rgb(HEX)[2];

      // Update bar-related values
      const rBar = (r / 255) * 100;
      const gBar = (g / 255) * 100;
      const bBar = (b / 255) * 100;

      // Initialize a value
      $('#input-colpick').val('#32303f');

      // Update a color palette
      $('#color-colpick').css('background-color', HEX);

      $('#r-colpick .colbar-colpick').css('width', `${rBar}%`);
      $('#g-colpick .colbar-colpick').css('width', `${gBar}%`);
      $('#b-colpick .colbar-colpick').css('width', `${bBar}%`);

      $('#red-cir-colpick').css('left', `${rBar}%`);
      $('#green-cir-colpick').css('left', `${gBar}%`);
      $('#blue-cir-colpick').css('left', `${bBar}%`);

      // Update rgb values
      $('#r-colpick input').val(r);
      $('#g-colpick input').val(g);
      $('#b-colpick input').val(b);
    },

    //

    _syncWithBar(e) {
      // Syncing rgb values with sliders
      const $barColpick = this.$barCircle.parent();
      let x = e.clientX - this.circleRelPosX - $barColpick.offset().left;
      x =
        // eslint-disable-next-line no-nested-ternary
        x >= -this.$barCircle.width() / 2
          ? x >= $barColpick.width() - this.$barCircle.width() / 2
            ? $barColpick.width() - this.$barCircle.width() / 2
            : x
          : -this.$barCircle.width() / 2;
      const posLeft = x + this.$barCircle.width() / 2;
      const colorCode = parseInt((posLeft / $barColpick.width()) * 255, 10);

      this.$barCircle.css('left', `${(posLeft / $barColpick.width()) * 100}%`);
      const $colBar = $barColpick.find('.colbar-colpick');
      $colBar.css('width', `${(posLeft / $barColpick.width()) * 100}%`);
      $barColpick
        .parent()
        .find('input')
        .val(colorCode);

      // Update rgb values, and convert it to hex, and apply to a color code input
      const r = parseInt($('#r-colpick input').val(), 10);
      const g = parseInt($('#g-colpick input').val(), 10);
      const b = parseInt($('#b-colpick input').val(), 10);
      const hex = LibEve.rgb2hex([r, g, b]);
      this._updatePalette(hex);
    }
  });

  return Colpick;
})();

export default ColpickEve;
