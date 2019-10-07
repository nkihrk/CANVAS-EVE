/**
 *
 * hogehoge // Intro for this app
 *
 * * Dependencies // list up dependecies here
 * - jQuery 3.4.1
 *
 */

import jQuery from 'jquery';

// The app`s capital letter must be uppercase. Add 'Eve' after the name
const HogeEve = (function(w, d, $) {
  function hoge() {}

  hoge.prototype = {
    constructor: hoge,

    options: {},

    // The main functions must be executed through load()
    load() {
      this.hogehoge();
    },

    hogehoge() {
      // It is recommended to define 'self' first to ensure 'this' object to be HogeEve.
      // Sometimes it will change its scope inside other objects like $(d).on('hoge', func);
      const self = this;

      self._hogehoge();
    },

    // Always put underscore before function`s name if it's a private method
    _hogehoge() {
      console.log('hogehoge');
    }
  };

  return hoge;
})(window, document, jQuery); // Each item is for scope. w = window, d = document, and $ = jQuery

// Export the above object to wherever it is imported. This will make the app a module
export default HogeEve;
