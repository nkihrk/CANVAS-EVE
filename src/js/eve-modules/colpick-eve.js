/**
 *
 * Color picker for CANVAS EVE.
 *
 * Dependencies
 * - jQuery 3.4.1
 * - glb-eve
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
  }

  const modules = { ...LibEve.prototype };

  Colpick.prototype = Object.assign(modules, {
    constructor: Colpick,

    options: {
      hex: '#32303f'
    },

    load() {},

    init() {
      this._initColpick();

      d.addEventListener('mousedown', e => {
        if (e.target) {
          if (
            e.target.closest('#red-cir-colpick') ||
            e.target.closest('#green-cir-colpick') ||
            e.target.closest('#blue-cir-colpick')
          ) {
            this.circleRelPosX = clientX - $(this).offset().left;
            this.$barTop = $(this);
          }
        }
      });
    },

    _initColpick() {
      const { hex } = this.options;
      const r = this.hex2rgb(hex)[0];
      const g = this.hex2rgb(hex)[1];
      const b = this.hex2rgb(hex)[2];

      // Update bar-related values
      const rBar = (r / 255) * 100;
      const gBar = (g / 255) * 100;
      const bBar = (b / 255) * 100;

      // Initialize a value
      $('#input-colpick').val('#32303f');

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
    },

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
        }
      });

      d.addEventListener('change', e => {
        if (e.target) {
          if (e.target.closest('#code-colpick input')) {
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
            const r = hex2rgb(hex)[0];
            const g = hex2rgb(hex)[1];
            const b = hex2rgb(hex)[2];

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

          if (e.target.closest('#rgb-colpick input')) {
            // Update rgb values, convert it to hex and apply to a color code input
            const r = parseInt($('#r-colpick input').val(), 10);
            const g = parseInt($('#g-colpick input').val(), 10);
            const b = parseInt($('#b-colpick input').val(), 10);
            const hex = rgb2hex([r, g, b]);
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
    }
  });

  return Colpick;
})(window, document);

export default ColpickEve;

(function($) {
  const colpickEve = () => {
    // Execute if flags are true
    const main = () => {
      $(document).on('change', '#code-colpick input', function() {});

      // Events for #rgb-colpick input
      $(document).on('change', '#rgb-colpick input', function() {});

      $(document).on(EVENTNAME_TOUCHMOVE, function(e) {
        if (glFlgs.colpick.move_circle_flg === true) {
          // Syncing rgb values with sliders
          let x = clientX - circleRelPosX - $('.bar-colpick').offset().left;
          x =
            x >= -$barTop.width() / 2
              ? x >= $('.bar-colpick').width() - $barTop.width() / 2
                ? $('.bar-colpick').width() - $barTop.width() / 2
                : x
              : -$barTop.width() / 2;
          const posLeft = x + $barTop.width() / 2;
          const colorCode = parseInt((posLeft / $('.bar-colpick').width()) * 255, 10);
          $barTop.css('left', `${(posLeft / $('.bar-colpick').width()) * 100}%`);
          $barTop
            .parents('.bar-colpick')
            .find('.colbar-colpick')
            .css('width', `${(posLeft / $('.bar-colpick').width()) * 100}%`);
          $barTop
            .parent()
            .parent()
            .find('input')
            .val(colorCode);

          // Update rgb values, convert it to hex and apply to a color code input
          const r = parseInt($('#r-colpick input').val(), 10);
          const g = parseInt($('#g-colpick input').val(), 10);
          const b = parseInt($('#b-colpick input').val(), 10);
          const hex = rgb2hex([r, g, b]);
          $('#input-colpick').val(hex);
          $('#color-colpick').css('background-color', hex);
        }
      });

      $(document).on(EVENTNAME_TOUCHSTART, '.file-wrap', function(e) {
        if (
          $('#toggle-colpick').hasClass('active') &&
          $(this).find('canvas').length > 0 &&
          e.button != 1
        ) {
          const context = $(this)
            .find('canvas')[0]
            .getContext('2d');
          const relPosX = clientX - $(this).offset().left;
          const relPosY = clientY - $(this).offset().top;
          let imagedata = context.getImageData(
            relPosX * mouseWheelVal,
            relPosY * mouseWheelVal,
            1,
            1
          );
          if ($(this).has('.flipped').length > 0) {
            imagedata = context.getImageData(
              $(this)
                .find('img')
                .width() -
                relPosX * mouseWheelVal,
              relPosY * mouseWheelVal,
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

          const hex = rgb2hex([r, g, b]);

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
            initColpick();
          }
        }
      });

      $(document).on(EVENTNAME_TOUCHSTART, '#reset-res', function(e) {
        if ($('#toggle-colpick').hasClass('active') && e.button != 1) {
          initColpick();
        }
      });
    };
    main();
  };
  colpickEve();
})(jQuery);
