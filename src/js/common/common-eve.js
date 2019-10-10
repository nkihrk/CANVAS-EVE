/**
 *
 * Loading animation for CANVAS EVE.
 *
 * Dependencies
 * - jQuery 3.4.1
 * - lib-eve
 *
 */

import jQuery from 'jquery';
import LibEve from './lib-eve';

const CommonEve = (function(d, w, $) {
  function Common() {
    LibEve.call(this);
  }

  const modules = { ...LibEve.prototype };

  Common.prototype = Object.assign(modules, {
    constructor: Common,

    options: {},

    load() {
      this.eventReady();
      this.eventLoad();
      this.eventLoadResize();
    },

    eventReady() {
      $(function() {
        const h = $(w).height();
        $('#loader-bg, #loader')
          .height(h)
          .css('display', 'block');

        // Prevent default right-click events for the time being
        d.addEventListener(
          'contextmenu',
          function(e) {
            e.preventDefault();
          },
          false
        );
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
      }

      this.event(w, 'load', false, load);
    },

    eventLoadResize() {
      function loadResize() {
        const top = `${w.innerHeight - 60}px`;
        const left = `${w.innerWidth / 2}px`;

        $('#footer').css({
          top,
          left
        });
      }

      this.event(w, 'load resize', false, loadResize);
    }
  });

  return Common;
})(document, window, jQuery);

export default CommonEve;
