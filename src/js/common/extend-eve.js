/**
 *
 * jQuery methods realization for CANVAS EVE.
 *
 * Dependencies
 * - lib-eve
 *
 */

import LibEve from './lib-eve';

const $ = (D => {
  function L() {}

  L.prototype = {
    constructor: L,

    //

    _ext(e) {
      return new $(e);
    }
  };

  function J(e) {
    L.call(this);
    LibEve.call(this);

    this.e = e || null;
    if (this.isString(e)) {
      this.e = D.querySelectorAll(e);
    }
    this.length = this.e ? this.e.childElementCount : 0;
  }

  const modules = { ...L.prototype, ...LibEve.prototype };

  J.prototype = Object.assign(modules, {
    constructor: J,

    /**
     * Vanilla JS jQuery.parents() realisation.
     *
     * @param {string} selector - The selector to match. If a selector is empty, it returns its parent element
     * @returns {element} - Return an element that matches the given selector
     */
    parents(selector) {
      const elements = [];
      let { e } = this;
      const isHaveSelector = selector !== undefined;

      // eslint-disable-next-line no-cond-assign
      while ((e = e.parentElement) !== null) {
        if (e.nodeType !== Node.ELEMENT_NODE) {
          // eslint-disable-next-line no-continue
          continue;
        }

        if (!isHaveSelector || e.matches(selector)) {
          elements.push(e);
        }
      }

      return this._ext(elements[0]);
    },

    /**
     * Vanilla JS jQuery.find() realisation.
     *
     * @param {string} - The selector to find
     * @returns {element} - Return a specific selector
     */
    find(selector) {
      const e = this.e ? this.e.querySelector(selector) : null;
      return this._ext(e);
    },

    /**
     * Vanilla JS jQuery.addClass() realisation.
     *
     * @param {string} - The selector to add
     */
    addClass(selector) {
      this.e.classList.add(selector);
    },

    /**
     * Vanilla JS jQuery.removeClass() realisation.
     *
     * @param {string} - The name of a class name
     */
    removeClass(className) {
      this.e.classList.remove(className);
    },

    /**
     * Vanilla JS jQuery.toggleClass() realisation.
     *
     * @param {string} - The class to toggle
     */
    toggleClass(selector) {
      this.e.classList.toggle(selector);
    },

    /**
     * Vanilla JS jQuery.hasClass() realisation.
     *
     * @param {string} - The selector to match
     * @returns {boolean} - Return true/false
     */
    hasClass(selector) {
      return this.e.classList.contains(selector);
    },

    /**
     * Vanilla JS jQuery.remove() realisation.
     *
     */
    remove() {
      const { e } = this;
      e.parentNode.removeChild(e);
    },

    /**
     * Vanilla JS jQuery.empty() realisation.
     *
     */
    empty() {
      const { e } = this;
      while (e.firstChild) {
        e.removeChild(e.firstChild);
      }
    },

    /**
     * Vanilla JS jQuery.prepend() realisation.
     *
     * @param {string} elem - The HTML tags. i.e., '<div>Hoge</div>'
     */
    prepend(elem) {
      const { e } = this;
      e.innerHTML = elem + e.innerHTML;
    },

    /**
     * Vanilla JS jQuery.append() realisation.
     *
     * @param {string} elem - The HTML tags. i.e., '<div>Hoge</div>'
     */
    append(elem) {
      const { e } = this;
      e.innerHTML += elem;
    },

    /**
     * Vanilla JS jQuery.css() realisation.
     *
     * @param {string} prop - The name of a css property
     * @param {string} val - The value of a css property
     * @returns {array} - The value of a given css property
     */
    css(prop, val) {
      let propName;
      let parts;
      if (prop.match(/-/)) {
        parts = prop.split('-');
        propName = parts[0] + parts[1][0].toUpperCase() + parts[1].slice(1);
      } else {
        propName = prop;
      }
      this.e.style[propName] = val;
      const style = getComputedStyle(this.e);
      return style[propName];
    },

    /**
     * Vanilla JS jQuery.attr() realisation.
     *
     * @param {string} prop - The name of an attribute
     * @returns {string} - The value of an given attribute
     */
    attr(prop) {
      return this.e ? this.e.getAttribute(prop) : null;
    }
  });

  return J;
})(document);

const ext = e => {
  return new $(e);
};

export default ext;
