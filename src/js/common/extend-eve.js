/**
 *
 * jQuery methods realization for CANVAS EVE.
 *
 * Dependencies
 * - none
 *
 */

const $ = (() => {
  function j(e) {
    this.e = e;
  }

  const modules = {};

  j.prototype = Object.assign(modules, {
    constructor: j,

    //

    _ext(e) {
      return new $(e);
    },

    //

    /**
     * Vanilla JS jQuery.parents() realisation.
     *
     * @param {string} - The selector to match
     * @returns {element} - Return an element that matches the given selector
     */
    parents(selector) {
      const elements = [];
      let { e } = this;
      const ishaveselector = selector !== undefined;

      // eslint-disable-next-line no-cond-assign
      while ((e = e.parentElement) !== null) {
        if (e.nodeType !== Node.ELEMENT_NODE) {
          // eslint-disable-next-line no-continue
          continue;
        }

        if (!ishaveselector || e.matches(selector)) {
          elements.push(e);
        }
      }

      return this._ext(elements[0]);
    },

    //

    /**
     * Vanilla JS jQuery.find() realisation.
     *
     * @param {string} - The selector to find
     * @returns {element} - Return a specific selector
     */
    find(selector) {
      const e = this.e.querySelector(selector);
      return this._ext(e);
    },

    //

    /**
     * Vanilla JS jQuery.addClass() realisation.
     *
     * @param {string} - The selector to add
     */
    addClass(selector) {
      this.e.classList.add(selector);
    },

    //

    /**
     * Vanilla JS jQuery.removeClass() realisation.
     *
     * @param {string} - The class to remove
     */
    removeClass(selector) {
      this.e.classList.remove(selector);
    },

    //

    /**
     * Vanilla JS jQuery.toggleClass() realisation.
     *
     * @param {string} - The class to toggle
     */
    toggleClass(selector) {
      this.e.classList.toggle(selector);
    },

    //

    /**
     * Vanilla JS jQuery.hasClass() realisation.
     *
     * @param {string} - The selector to match
     * @returns {boolean} - Return bool
     */
    hasClass(selector) {
      this.e.classList.contains(selector);
    },

    //

    /**
     * Vanilla JS jQuery.remove() realisation.
     *
     */
    remove() {
      this.e.classList.remove();
    }
  });

  return j;
})();

const ext = e => {
  return new $(e);
};

export default ext;
