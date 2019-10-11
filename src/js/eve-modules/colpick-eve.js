/**
 *
 * Color picker for CANVAS EVE.
 *
 * Dependencies
 * - jQuery 3.4.1
 * - lib-eve
 *
 */

import $ from 'jquery';

import GlbEve from '../common/glb-eve';
import LibEve from '../common/lib-eve';

const ColpickEve = ((w, d) => {
  function Colpick() {
    LibEve.call(this);

    this.circleRelPosX = 0;
    this.$barTop = null;
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

      d.addEventListener('mousedown', e => {
        if (e.target) {
          if (
            e.target.closest('#red-cir-colpick') ||
            e.target.closest('#green-cir-colpick') ||
            e.target.closest('#blue-cir-colpick')
          ) {
            this.circleRelPosX = e.clientX - $(e.target).offset().left;
            this.$barTop = $(e.target);
          }
        }
      });
    },

    //

    setFlgs() {
      d.addEventListener('mousedown', e => {
        if (e.target) {
          if (
            e.target.closest('#red-cir-colpick') ||
            e.target.closest('#green-cir-colpick') ||
            e.target.closest('#blue-cir-colpick')
          ) {
            this.flgs.move_circle_flg = true;
          }
        }
      });
    },

    //

    resetFlgs() {
      d.addEventListener('mouseup', () => {
        if (this.flgs.move_circle_flg === true) this.flgs.move_circle_flg = false;
      });
    },

    //

    handleEvents() {
      d.addEventListener('mousedown', e => {
        if (e.target) {
          if (e.target.closest('#copy-colpick')) {
            let hex = $('#input-colpick').val();
            if (hex.match(/#/)) {
              hex = hex.split('#').join('');
            }
            this.copyTextToClipboard(hex);
          }

          if (e.target.closest('#toggle-colpick')) {
            $('#toggle-colpick').toggleClass('active');

            if ($('#toggle-colpick').hasClass('active')) {
              $('#canvas-eve .file-wrap').removeClass('grab-pointer');
              $('#canvas-eve').addClass('spuit-pointer');
            } else {
              $('#canvas-eve').removeClass('spuit-pointer');
              $('#canvas-eve .file-wrap').addClass('grab-pointer');
            }
          }

          if (e.target.closest('.file-wrap')) {
            if (
              $('#toggle-colpick').hasClass('active') &&
              $(e.target).find('canvas').length > 0 &&
              e.button !== 1
            ) {
              const context = $(e.target)
                .find('canvas')[0]
                .getContext('2d');
              const relPosX = e.clientX - $(e.target).offset().left;
              const relPosY = e.clientY - $(e.target).offset().top;
              let imagedata = context.getImageData(
                relPosX * GlbEve.MOUSE_WHEEL_VAL,
                relPosY * GlbEve.MOUSE_WHEEL_VAL,
                1,
                1
              );
              if ($(e.target).has('.flipped').length > 0) {
                imagedata = context.getImageData(
                  $(e.target)
                    .find('img')
                    .width() -
                    relPosX * GlbEve.MOUSE_WHEEL_VAL,
                  relPosY * GlbEve.MOUSE_WHEEL_VAL,
                  1,
                  1
                );
              }
              const r = imagedata.data[0];
              const g = imagedata.data[1];
              const b = imagedata.data[2];
              const a = imagedata.data[3];

              const rBar = (r / 255) * 100;
              const gBar = (g / 255) * 100;
              const bBar = (b / 255) * 100;

              const hex = this.rgb2hex([r, g, b]);

              if (a > 0) {
                $('#input-colpick').val(hex);

                // Update a color palette
                $('#color-colpick').css('background-color', hex);

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
              } else {
                this._initColpick();
              }
            }
          }

          if (e.target.closest('#reset-res')) {
            if ($('#toggle-colpick').hasClass('active') && e.button !== 1) {
              this._initColpick();
            }
          }
        }
      });

      d.addEventListener('change', e => {
        if (e.target) {
          if (e.target.closest('#input-colpick')) {
            let hex = $(e.target).val();
            if (
              !$(e.target)
                .val()
                .match(/#/)
            ) {
              hex = `#${$(e.target).val()}`;
              $('#input-colpick').val(hex);
            } else {
              hex = `#${hex.split('#').join('')}`;
              $('#input-colpick').val(hex);
            }
            const r = this.hex2rgb(hex)[0];
            const g = this.hex2rgb(hex)[1];
            const b = this.hex2rgb(hex)[2];

            // Update rgb values
            $('#r-colpick input').val(r);
            $('#g-colpick input').val(g);
            $('#b-colpick input').val(b);

            // Update a color palette
            $('#color-colpick').css('background-color', hex);

            // Update bar-related values
            const rBar = (r / 255) * 100;
            const gBar = (g / 255) * 100;
            const bBar = (b / 255) * 100;

            $('#r-colpick .colbar-colpick').css('width', `${rBar}%`);
            $('#g-colpick .colbar-colpick').css('width', `${gBar}%`);
            $('#b-colpick .colbar-colpick').css('width', `${bBar}%`);

            $('#red-cir-colpick').css('left', `${rBar}%`);
            $('#green-cir-colpick').css('left', `${gBar}%`);
            $('#blue-cir-colpick').css('left', `${bBar}%`);
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
            $('#input-colpick').val(hex);
            $('#color-colpick').css('background-color', hex);

            // Update bar-related values
            const rBar = (r / 255) * 100;
            const gBar = (g / 255) * 100;
            const bBar = (b / 255) * 100;

            $('#r-colpick .colbar-colpick').css('width', `${rBar}%`);
            $('#g-colpick .colbar-colpick').css('width', `${gBar}%`);
            $('#b-colpick .colbar-colpick').css('width', `${bBar}%`);

            $('#red-cir-colpick').css('left', `${rBar}%`);
            $('#green-cir-colpick').css('left', `${gBar}%`);
            $('#blue-cir-colpick').css('left', `${bBar}%`);
          }
        }
      });

      d.addEventListener('mousemove', e => {
        if (this.flgs.move_circle_flg === true) {
          // Syncing rgb values with sliders
          let x = e.clientX - this.circleRelPosX - $('.bar-colpick').offset().left;
          x =
            // eslint-disable-next-line no-nested-ternary
            x >= -this.$barTop.width() / 2
              ? x >= $('.bar-colpick').width() - this.$barTop.width() / 2
                ? $('.bar-colpick').width() - this.$barTop.width() / 2
                : x
              : -this.$barTop.width() / 2;
          const posLeft = x + this.$barTop.width() / 2;
          const colorCode = parseInt((posLeft / $('.bar-colpick').width()) * 255, 10);
          this.$barTop.css('left', `${(posLeft / $('.bar-colpick').width()) * 100}%`);
          this.$barTop
            .parents('.bar-colpick')
            .find('.colbar-colpick')
            .css('width', `${(posLeft / $('.bar-colpick').width()) * 100}%`);
          this.$barTop
            .parent()
            .parent()
            .find('input')
            .val(colorCode);

          // Update rgb values, convert it to hex and apply to a color code input
          const r = parseInt($('#r-colpick input').val(), 10);
          const g = parseInt($('#g-colpick input').val(), 10);
          const b = parseInt($('#b-colpick input').val(), 10);
          const hex = this.rgb2hex([r, g, b]);
          $('#input-colpick').val(hex);
          $('#color-colpick').css('background-color', hex);
        }
      });
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
    }
  });

  return Colpick;
})(window, document);

export default ColpickEve;
