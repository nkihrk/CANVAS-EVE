/**
 *
 * Loading animation for CANVAS EVE.
 *
 * Dependencies
 * - jQuery 3.4.1
 * - lib-eve
 *
 */

import $ from 'jquery';
import LibEve from './lib-eve';

const CommonEve = ((W, D) => {
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
      $(() => {
        const h = $(W).height();
        $('#loader-bg, #loader')
          .height(h)
          .css('display', 'block');

        // Prevent default right-click events for the time being
        D.addEventListener(
          'contextmenu',
          e => {
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
          .fadeOut(800, () => {
            $(this).remove();
          });
        $('#loading')
          .delay(600)
          .fadeOut(300, () => {
            $(this).remove();
          });
      }

      this.event(W, 'load', false, load);
    },

    eventLoadResize() {
      function loadResize() {
        const top = `${W.innerHeight - 60}px`;
        const left = `${W.innerWidth / 2}px`;

        $('#footer').css({
          top,
          left
        });
      }

      this.event(W, 'load resize', false, loadResize);
    }
  });

  return Common;
})(window, document);

export default CommonEve;
