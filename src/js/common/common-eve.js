/**
 *
 * Loading animation for CANVAS EVE.
 *
 * Dependencies
 * - jQuery 3.4.1
 *
 */

import $ from 'jquery';
import GlbEve from './glb-eve';

const CommonEve = (W => {
  function Common() {}

  const modules = {};

  Common.prototype = Object.assign(modules, {
    constructor: Common,

    options: {},

    load() {
      this.eventReady();
      this.eventLoad();
      this.eventLoadResize();
    },

    //

    eventReady() {
      $(() => {
        const h = $(W).height();
        $('#loader-bg, #loader')
          .height(h)
          .css('display', 'block');
      });
    },

    //

    eventLoad() {
      $(W).on('load', () => {
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

        $('.file-wrap').css('transition', GlbEve.IS_TRANSITION);
      });
    },

    //

    eventLoadResize() {
      $(W).on('load resize', () => {
        const top = `${W.innerHeight - 60}px`;
        const left = `${W.innerWidth / 2}px`;

        $('#footer').css({
          top,
          left
        });
      });
    }
  });

  return Common;
})(window);

export default CommonEve;
