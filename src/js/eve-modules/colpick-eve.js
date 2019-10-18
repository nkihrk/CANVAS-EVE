/**
 *
 * Color picker for CANVAS EVE.
 *
 * Dependencies
 * - jQuery 3.4.1
 * - lib-eve
 *
 */

// import $ from 'jquery';

import $ from '../common/extend-eve';
import GlbEve from '../common/glb-eve';
import LibEve from '../common/lib-eve';

const ColpickEve = ((W, D) => {
  function Colpick() {
    LibEve.call(this);

    this.circleRelPosX = 0;
    this.$barCircle = null;
    this.flgs = {
      move_circle_flg: false
    };
  }

  const modules = { ...LibEve.prototype };

  Colpick.prototype = Object.assign(modules, {
    constructor: Colpick,

    options: {
      HEX: '#32303f'
    },

    load() {
      this.init();
      this.setFlgs();
      this.resetFlgs();
      this.handleEvents();
    },

    //

    init() {
      this._initColpick();

      D.addEventListener(
        'mousedown',
        e => {
          if (e.target) {
            if (
              e.target.closest('#red-cir-colpick') ||
              e.target.closest('#green-cir-colpick') ||
              e.target.closest('#blue-cir-colpick')
            ) {
              this.circleRelPosX = e.clientX - $(e.target).offset().left;
              this.$barCircle = $(e.target);
            }
          }
        },
        false
      );
    },

    //

    setFlgs() {
      D.addEventListener(
        'mousedown',
        e => {
          if (e.target) {
            if (
              e.target.closest('#red-cir-colpick') ||
              e.target.closest('#green-cir-colpick') ||
              e.target.closest('#blue-cir-colpick')
            ) {
              this.flgs.move_circle_flg = true;
            }
          }
        },
        false
      );
    },

    //

    resetFlgs() {
      D.addEventListener(
        'mouseup',
        () => {
          if (this.flgs.move_circle_flg === true) this.flgs.move_circle_flg = false;
        },
        false
      );
    },

    //

    handleEvents() {
      D.addEventListener(
        'mousedown',
        e => {
          if (e.target) {
            if (e.target.closest('#copy-colpick')) this._copyHex();
            if (e.target.closest('#toggle-colpick')) this._toggleColpick();
            if (
              $('#toggle-colpick').hasClass('active') &&
              $(e.target)
                .parents('.file-wrap')
                .find('canvas').length > 0 &&
              e.button !== 1
            ) {
              e.preventDefault();
              const col = this._getColor(e);
              const hex = this.rgb2hex([col[0], col[1], col[2]]);

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
          }
        },
        false
      );

      D.addEventListener(
        'change',
        e => {
          if (e.target) {
            if (e.target.closest('#input-colpick')) {
              const hex = this._getHex(e);
              this._updatePalette(hex);

              const col = this.hex2rgb(hex);
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
              const hex = this.rgb2hex([r, g, b]);
              const col = this.hex2rgb(hex);
              this._updatePalette(hex);
              this._updateRgbBar(col);
            }
          }
        },
        false
      );

      D.addEventListener(
        'mousemove',
        e => {
          if (this.flgs.move_circle_flg === true) this._syncWithBar(e);
        },
        false
      );
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
      this.copyTextToClipboard(hex);
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
      const r = this.hex2rgb(HEX)[0];
      const g = this.hex2rgb(HEX)[1];
      const b = this.hex2rgb(HEX)[2];

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
      console.log('-------------------------', $barColpick);
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
      $barColpick.find('.colbar-colpick').css('width', `${(posLeft / $barColpick.width()) * 100}%`);

      this.$barCircle
        .parents('.bar-colpick')
        .find('input')
        .val(colorCode);

      // console.log('-------------------------', this.$barCircle);

      // Update rgb values, and convert it to hex, and apply to a color code input
      const r = parseInt($('#r-colpick input').val(), 10);
      const g = parseInt($('#g-colpick input').val(), 10);
      const b = parseInt($('#b-colpick input').val(), 10);
      const hex = this.rgb2hex([r, g, b]);
      this._updatePalette(hex);
    }
  });

  return Colpick;
})(window, document);

export default ColpickEve;
