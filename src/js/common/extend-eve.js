/* eslint-disable */
/**
 *
 * jQuery methods realization for CANVAS EVE.
 *
 * Dependencies
 * - none
 *
 */

const $ = (() => {
  function j(elem) {
    this.elem = elem;
  }

  const modules = {};

  j.prototype = Object.assign(modules, {
    constructor: j,

    //

    parents(selector) {
      var elements = [];
      var elem = this.elem;
      var ishaveselector = selector !== undefined;

      while ((elem = elem.parentElement) !== null) {
        if (elem.nodeType !== Node.ELEMENT_NODE) {
          continue;
        }

        if (!ishaveselector || elem.matches(selector)) {
          elements.push(elem);
        }
      }

      return elements;
    }
  });

  return j;
})();

const ext = elem => {
  return new $(elem);
};

export default ext;
