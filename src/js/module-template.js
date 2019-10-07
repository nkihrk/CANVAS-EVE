/**
 *
 * hogehoge // Intro for this app
 *
 * * Dependencies // list up dependecies here
 * - jQuery 3.4.1
 *
 */

import jQuery from 'jquery';

const HogeEve = (function(w, d, $) {
  // The app`s capital letter must be uppercase, then add 'Eve' after the name
  function hoge() {}

  hoge.prototype = {
    constructor: hoge,

    load() {
      this._hoge();
    },

    _hoge() {
      console.log('hoge');
    }
  };

  return hoge; // return hoge() and insert into const HogeEve
})(window, document, jQuery); // Each item is for scope. w = window, d = document, and $ = jQuery

export default HogeEve; // export the above object to wherever it is imported. This will make the app a module
