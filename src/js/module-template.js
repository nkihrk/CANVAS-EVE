/**
 *
 * hogehoge for CANVAS EVE.
 *
 * Dependencies // list up dependecies here
 * - extend-eve
 * - lib-eve
 *
 */

import $ from './common/extend-eve';
import LibEve from './common/lib-eve'; // Just for example

// The app`s capital letter must be uppercase. Add 'Eve' after the name
const HogeEve = ((W, D) => {
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
      this.mouseDownEvent();
      this.mouseUpEvent();
      this.mouseMoveEvent();
    },

    mouseDownEvent() {
      D.addEventListener(
        'mousedown',
        () => {
          this._hogehoge();
        },
        false
      );
    },

    //

    mouseUpEvent() {
      D.addEventListener('mouseup', () => {}, false);
    },

    //

    mouseMoveEvent() {
      D.addEventListener('mousemove', () => {}, false);
    },

    _hogehoge() {
      // It is recommended to define 'self' first to ensure 'this' object to be HogeEve.
      // Sometimes it will change its scope inside other objects like $(d).on('hoge', func);
      // It's not MUST anyway. I don't use normally, just a technique.
      const self = this;

      self._hogehogehoge();
    },

    // Always put underscore before function`s name if it's a private method
    _hogehogehoge() {
      console.log('hogehogehoge');
    }
  });

  return Hoge;
  // Each item is for scope. W = window, and D = document.
  // Add objects in left-to-right order. All the represented characters, which is W and D, must be uppercase.
})(window, document);

// Export the above object to wherever it is called. This will make the app a module
export default HogeEve;
