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
    this.length = this.e ? 1 : 0;
    if (this.isString(e)) {
      this.e =
        D.querySelectorAll(e).length === 1 ? D.querySelectorAll(e)[0] : D.querySelectorAll(e);
      this.length = D.querySelectorAll(e).length;
    }
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
     * @param {string} className - The selector to find
     * @returns {element} - Return a specific selector
     */
    find(className) {
      const { e } = this;
      const n = this.length;
      let elem;

      if (n === 1) {
        elem = e ? e.querySelector(className) : null;
      }

      return this._ext(elem);
    },

    /**
     * Vanilla JS jQuery.addClass() realisation.
     *
     * @param {string} className - The selector to add
     */
    addClass(className) {
      const { e } = this;

      const n = this.length;
      if (n > 1) {
        for (let i = 0; i < n; i++) {
          e[i].classList.add(className);
        }
      } else if (n === 1) {
        e.classList.add(className);
      }
    },

    /**
     * Vanilla JS jQuery.removeClass() realisation.
     *
     * @param {string} className - The name of a class name
     */
    removeClass(className) {
      const { e } = this;

      const n = this.length;
      if (n > 1) {
        for (let i = 0; i < n; i++) {
          e[i].classList.remove(className);
        }
      } else if (n === 1) {
        e.classList.remove(className);
      }
    },

    /**
     * Vanilla JS jQuery.toggleClass() realisation.
     *
     * @param {string} className - The class to toggle
     */
    toggleClass(className) {
      const { e } = this;
      const n = this.length;

      if (n === 1) {
        e.classList.toggle(className);
      }
    },

    /**
     * Vanilla JS jQuery.hasClass() realisation.
     *
     * @param {string} className - The selector to match
     * @returns {boolean} - Return true/false
     */
    hasClass(className) {
      const { e } = this;
      const n = this.length;
      let b;

      if (n === 1) {
        b = e.classList.contains(className);
      } else {
        return false;
      }

      return b;
    },

    /**
     * Vanilla JS jQuery.remove() realisation.
     *
     */
    remove() {
      const { e } = this;

      const n = this.length;
      if (n > 1) {
        for (let i = 0; i < n; i++) {
          e[i].parentNode.removeChild(e[i]);
        }
      } else if (n === 1) {
        e.parentNode.removeChild(e);
      }
    },

    /**
     * Vanilla JS jQuery.empty() realisation.
     *
     */
    empty() {
      const { e } = this;

      const n = this.length;
      if (n > 1) {
        for (let i = 0; i < n; i++) {
          while (e[i].firstChild) {
            e[i].removeChild(e[i].firstChild);
          }
        }
      } else if (n === 1) {
        while (e.firstChild) {
          e.removeChild(e.firstChild);
        }
      }
    },

    /**
     * Vanilla JS jQuery.prepend() realisation.
     *
     * @param {string} str - The HTML tags. i.e., '<div>hoge</div>'
     */
    prepend(str) {
      const { e } = this;
      const n = this.length;
      let elem;
      if (n > 1) {
        for (let i = 0; i < n; i++) {
          elem = this.str2node(str);
          e[i].insertBefore(elem, e[i].firstChild);
        }
      } else if (n === 1) {
        elem = this.str2node(str);
        e.insertBefore(elem, e.firstChild);
      }
    },

    /**
     * Vanilla JS jQuery.append() realisation.
     *
     * @param {string} str - The HTML tags. i.e., '<div>Hoge</div>'
     */
    append(str) {
      const { e } = this;
      const n = this.length;
      let elem;
      if (n > 1) {
        for (let i = 0; i < n; i++) {
          elem = this.str2node(str);
          e[i].appendChild(elem);
        }
      } else if (n === 1) {
        elem = this.str2node(str);
        e.appendChild(elem);
      }
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

      const n = this.length;
      const elements = [];
      let style;
      if (n > 1) {
        for (let i = 0; i < n; i++) {
          this.e[i].style[propName] = val;
          style = getComputedStyle(this.e[i]);
          elements.push(style[propName]);
        }
      } else if (n === 1) {
        this.e.style[propName] = val;
        style = getComputedStyle(this.e);
        return style[propName];
      }

      return elements;
    },

    /**
     * Vanilla JS jQuery.attr() realisation.
     *
     * @param {string} prop - The name of an attribute
     * @returns {string} - The value of an given attribute
     */
    attr(prop) {
      const { e } = this;
      const n = this.length;
      let elem;

      if (n === 1) {
        elem = e ? e.getAttribute(prop) : null;
      } else {
        return null;
      }
      return elem;
    }
  });

  return J;
})(document);

const ext = e => {
  return new $(e);
};

export default ext;
