/**
 *
 * Loading animation for CANVAS EVE.
 *
 * Dependencies
 * - jquery-eve
 * - glb-eve
 *
 */

import $ from './jquery-eve';
import GlbEve from './glb-eve';

const CommonEve = ((W, D) => {
  function Common() {
    this.$footer = $('#footer');
  }

  const modules = {};

  Common.prototype = Object.assign(modules, {
    constructor: Common,

    options: {},

    load() {
      this.eventReady();
      this.eventLoad();
    },

    //

    eventReady() {
      function ready() {
        const h = $(W).height();
        const $load = $('#loader-bg, #loader');
        $load.height(h);
        $load.css('display', 'block');
      }

      if (D.readyState !== 'loading') {
        ready();
      } else {
        D.addEventListener('DOMContentLoaded', ready);
      }
    },

    //

    eventLoad() {
      const self = this;

      function load() {
        const $loaderBg = $('#loader-bg');
        const $loading = $('#loading');

        setTimeout(() => {
          $loaderBg.fadeOut(800, () => {
            $loaderBg.remove();
          });
        }, 900);
        setTimeout(() => {
          $loading.fadeOut(300, () => {
            $loading.remove();
          });
        }, 600);

        $('.file-wrap').css('transition', GlbEve.IS_TRANSITION);

        self._fixFooter();
        self.eventLoadResize();
      }

      W.addEventListener('load', load);
    },

    //

    eventLoadResize() {
      const self = this;

      function resize() {
        self._fixFooter();
      }

      W.addEventListener('resize', resize);
    },

    //

    _fixFooter() {
      this.$footer.css({
        top: `${W.innerHeight - 60}px`,
        left: `${W.innerWidth / 2}px`
      });
    }
  });

  return Common;
})(window, document);

export default CommonEve;
