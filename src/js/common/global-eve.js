/**
 *
 *
 *
 * * Dependencies
 * - jQuery 3.4.1
 * - lib-eve
 *
 */

import jQuery from 'jquery';
import LibEve from './lib-eve';

const HogeEve = (function(w, d, $) {
  function hoge() {
    LibEve.call(this);
  }

  const modules = { ...LibEve.prototype };

  hoge.prototype = Object.assign(modules, {
    constructor: hoge,

    options: {},

    load() {
      this.hogehoge();
    },

    hogehoge() {
      const self = this;

      self._hogehoge();
    },

    _hogehoge() {
      console.log('hogehoge');
    }
  });

  return hoge;
})(window, document, jQuery);

export default HogeEve;
