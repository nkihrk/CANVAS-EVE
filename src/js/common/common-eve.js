/**
 *
 * Loading animation for the first time
 * * Dependencies
 * - jQuery 3.4.1
 *
 */

import jQuery from 'jquery';

const CommonEve = (function(w, $) {
  function common() {}

  common.prototype = {
    constructor: common,

    options: {},

    load() {
      this.eventReady();
      this.eventLoad();
      this.eventLoadResize();
    },

    eventReady() {
      $(function() {
        const h = $(w).height();
        const loadTag =
          '<div id="loader-bg" style="position: fixed; z-index: 1;">' +
          '<div id="loading">' +
          '<div class="spin-wrapper">' +
          '<div class="spinner"></div>' +
          '</div>' +
          '</div>' +
          '</div>';

        $(this.body).prepend(loadTag);
        $('#loader-bg, #loader')
          .height(h)
          .css('display', 'block');
      });
    },

    eventLoad() {
      function load() {
        $('#loader-bg')
          .delay(900)
          .fadeOut(800, function() {
            $(this).remove();
          });
        $('#loading')
          .delay(600)
          .fadeOut(300, function() {
            $(this).remove();
          });
        // console.log('load() is called.');
      }

      this._event('load', load);
    },

    eventLoadResize() {
      function loadResize() {
        const top = `${w.innerHeight - 60}px`;
        const left = `${w.innerWidth / 2}px`;

        $('#footer').css({
          top,
          left
        });
        // console.log('loadResize() is called.');
      }

      this._event('load resize', loadResize);
    },

    _event(event, func) {
      $(w).on(event, func);
    }
  };

  return common;
})(window, jQuery);

export default CommonEve;
