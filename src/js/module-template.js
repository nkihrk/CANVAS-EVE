/**
 *
 * hogehoge for CANVAS EVE.
 *
 * Dependencies // list up dependecies here
 * - jQuery 3.4.1
 * - lib-eve
 *
 */

import $ from 'jquery';
import LibEve from './common/lib-eve'; // Just for example

// The app`s capital letter must be uppercase. Add 'Eve' after the name
const HogeEve = ((w, d) => {
  function Hoge() {
    // To inherit external modules, code like down below
    LibEve.call(this);
  }

  // 'modules' is for us combining all external modules into one object.
  // i.e., { ...LibEve.prototype, ...HogeEve.prototype, ...HogeEve2.prototype, …… }
  const modules = { ...LibEve.prototype };

  Hoge.prototype = Object.assign(modules, {
    constructor: Hoge,

    options: {},

    // The main functions must be executed through load()
    load() {
      this.hogehoge();
    },

    hogehoge() {
      // It is recommended to define 'self' first to ensure 'this' object to be HogeEve.
      // Sometimes it will change its scope inside other objects like $(d).on('hoge', func);
      // It's not MUST anyway. I don't use normally, just a technique.
      const self = this;

      self._hogehoge();
    },

    // Always put underscore before function`s name if it's a private method
    _hogehoge() {
      console.log('hogehoge');
    }
  });

  return Hoge;
})(window, document); // Each item is for scope. w = window, and d = document

// Export the above object to wherever it is called. This will make the app a module
export default HogeEve;
