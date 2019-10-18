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

    _ext(e) {
      return new $(e);
    }
  };

  function J(e) {
    L.call(this);
    LibEve.call(this);

    if (this.isArray(e) && this.isElement(e[0])) {
      for (let i = 0; i < e.length; i++) {
        this[i] = e[i];
      }
      this.length = e.length;
    } else if (this.isElement(e)) {
      this[0] = e;
      this.length = e ? 1 : 0;
    } else if (this.isString(e)) {
      const isNum = parseInt(e.split('#')[1], 10);
      if (this.isNumber(isNum)) {
        this[0] = D.getElementById(isNum);
        this.length = 1;
      } else {
        const n = D.querySelectorAll(e).length;
        for (let i = 0; i < n; i++) {
          this[i] = D.querySelectorAll(e)[i];
        }
        this.length = n;
      }
    } else {
      console.log('root', e);
      this.length = 0;
    }
  }

  const modules = { ...L.prototype, ...LibEve.prototype };

  J.prototype = Object.assign(modules, {
    constructor: J,

    /**
     * Vanilla JS jQuery.parents() realisation.
     *
     * @param {string} selector - The selector to match. If a selector is empty, it returns its parent element
     * @returns {element} Return an element that matches the given selector
     */
    parents(selector) {
      const elements = [];
      const isHaveSelector = selector !== undefined;
      let tmpElem = this[0];

      // eslint-disable-next-line no-cond-assign
      while ((tmpElem = tmpElem.parentElement) !== null) {
        if (tmpElem.nodeType !== Node.ELEMENT_NODE) {
          // eslint-disable-next-line no-continue
          continue;
        }
        if (!isHaveSelector || tmpElem.matches(selector)) {
          elements.push(tmpElem);
        }
      }

      return this._ext(elements);
    },

    /**
     * Vanilla JS jQuery.parent() realisation.
     *
     * @returns {element} Return a parent selector
     */
    parent() {
      const n = this.length;
      let elem;

      if (n === 1) {
        elem = this[0].parentNode;
      } else {
        console.log('parent', this);
      }

      return this._ext(elem);
    },

    /**
     * Vanilla JS jQuery.children() realisation.
     *
     * @param {string} str - The name of a child element
     * @returns {element} Return a specific selector
     */
    children(str) {
      const n = this.length;
      let e;

      if (n === 1) {
        e = this[0].children;
        if (!!str && this.isString(str) && this.isObject(e)) {
          e = this[0].querySelector(str);
        }
      } else {
        console.log('children', this);
      }

      return this._ext(e);
    },

    /**
     * Vanilla JS jQuery.find() realisation.
     *
     * @param {string} className - The selector to find
     * @returns {element} Return a specific selector
     */
    find(className) {
      const n = this.length;
      let elem;

      if (n === 1) {
        elem = this[0].querySelector(className);
      } else {
        console.log('find', this);
      }

      return this._ext(elem);
    },

    /**
     * Vanilla JS jQuery.addClass() realisation.
     *
     * @param {string} className - The selector to add
     */
    addClass(className) {
      const n = this.length;

      if (n > 1) {
        for (let i = 0; i < n; i++) {
          this[i].classList.add(className);
        }
      } else if (n === 1) {
        this[0].classList.add(className);
      } else {
        console.log('addClass', this);
      }
    },

    /**
     * Vanilla JS jQuery.removeClass() realisation.
     *
     * @param {string} className - The name of a class name
     */
    removeClass(className) {
      const n = this.length;

      if (n > 1) {
        for (let i = 0; i < n; i++) {
          this[i].classList.remove(className);
        }
      } else if (n === 1) {
        this[0].classList.remove(className);
      } else {
        console.log('removeClass', this);
      }
    },

    /**
     * Vanilla JS jQuery.toggleClass() realisation.
     *
     * @param {string} className - The class to toggle
     */
    toggleClass(className) {
      const n = this.length;

      if (n === 1) {
        this[0].classList.toggle(className);
      } else {
        console.log('toggleClass', this);
      }
    },

    /**
     * Vanilla JS jQuery.hasClass() realisation.
     *
     * @param {string} className - The selector to match
     * @returns {boolean} Return true/false
     */
    hasClass(className) {
      const n = this.length;
      let b;

      if (n === 1) {
        b = this[0].classList.contains(className);
      } else {
        console.log('find', this);
        return false;
      }

      return b;
    },

    /**
     * Vanilla JS jQuery.remove() realisation.
     *
     */
    remove() {
      const n = this.length;

      if (n > 1) {
        for (let i = 0; i < n; i++) {
          this[i].parentNode.removeChild(e[i]);
        }
      } else if (n === 1) {
        this[0].parentNode.removeChild(this[0]);
      } else {
        console.log('remove', this);
      }
    },

    /**
     * Vanilla JS jQuery.empty() realisation.
     *
     */
    empty() {
      const n = this.length;

      if (n > 1) {
        for (let i = 0; i < n; i++) {
          while (this[i].firstChild) {
            this[i].removeChild(this[i].firstChild);
          }
        }
      } else if (n === 1) {
        while (this[0].firstChild) {
          this[0].removeChild(this[0].firstChild);
        }
      } else {
        console.log('empty', this);
      }
    },

    /**
     * Vanilla JS jQuery.prepend() realisation.
     *
     * @param {string} str - The HTML tags. i.e., '<div>hoge</div>' or just an element
     */
    prepend(str) {
      const n = this.length;
      let elem;

      if (n > 1) {
        for (let i = 0; i < n; i++) {
          if (this.isString(str)) {
            elem = this.str2node(str);
            this[i].insertBefore(elem, this[i].firstChild);
          } else {
            this[i].insertBefore(str, this[i].firstChild);
          }
        }
      } else if (n === 1) {
        if (this.isString(str)) {
          elem = this.str2node(str);
          this[0].insertBefore(elem, this[0].firstChild);
        } else {
          this[0].insertBefore(str, this[0].firstChild);
        }
      } else {
        console.log('prepend', this);
      }
    },

    /**
     * Vanilla JS jQuery.append() realisation.
     *
     * @param {string} str - The HTML tags. i.e., '<div>Hoge</div>' or just an element
     */
    append(str) {
      const n = this.length;
      let elem;

      if (n > 1) {
        for (let i = 0; i < n; i++) {
          if (this.isString(str)) {
            elem = this.str2node(str);
            this[i].appendChild(elem);
          } else {
            this[i].appendChild(str);
          }
        }
      } else if (n === 1) {
        if (this.isString(str)) {
          elem = this.str2node(str);
          this[0].appendChild(elem);
        } else {
          this[0].appendChild(str);
        }
      } else {
        console.log('append', this);
      }
    },

    /**
     * Vanilla JS jQuery.css() realisation.
     *
     * @param {string} prop - The name of a css property
     * @param {string} val - The value of a css property
     * @returns {array} The value of a given css property
     */
    css(prop, val) {
      function __css(propName, propVal, self) {
        let fixedName;
        let parts;
        if (propName.match(/-/)) {
          parts = propName.split('-');
          fixedName = parts[0] + parts[1][0].toUpperCase() + parts[1].slice(1);
        } else {
          fixedName = propName;
        }

        const n = self.length;
        const elements = [];
        let style;

        if (n > 1) {
          for (let i = 0; i < n; i++) {
            self[i].style[fixedName] = propVal;
            style = getComputedStyle(self[i]);
            elements.push(style[fixedName]);
          }
        } else if (n === 1) {
          self[0].style[fixedName] = propVal;
          style = getComputedStyle(self[0]);
          return style[fixedName];
        } else {
          console.log('css', this);
        }

        return elements;
      }

      if (this.isObject(prop)) {
        const propArray = this.keysInArray(prop);
        const totalKeys = propArray.length;
        let eachProp;
        let eachVal;

        for (let i = 0; i < totalKeys; i++) {
          eachProp = propArray[i];
          eachVal = prop[eachProp];
          __css(eachProp, eachVal, this);
        }
      } else {
        __css(prop, val, this);
      }
    },

    /**
     * Vanilla JS jQuery.attr() realisation.
     *
     * @param {string} prop - The name of an attribute
     * @param {string} val - The vale of an attribute to set
     * @returns {string} The value of an given attribute
     */
    attr(prop, val) {
      const n = this.length;
      let elem;

      if (n === 1) {
        if (val) {
          elem = null;
          this[0].setAttribute(prop, val);
        } else {
          elem = this[0].getAttribute(prop);
        }
      } else {
        console.log('attr', this);
        return null;
      }

      return elem;
    },

    /**
     * Vanilla JS jQuery.offset() realisation.
     *
     * @returns {object} The screen-space coordinates of a given element
     */
    offset() {
      const n = this.length;
      let rect;
      let elemCoord;

      if (n === 1) {
        rect = this[0].getBoundingClientRect();
        elemCoord = {
          top: rect.top + D.body.scrollTop,
          left: rect.left + D.body.scrollLeft
        };
      } else {
        console.log('offset', this);
        return null;
      }

      return elemCoord;
    },

    /**
     * Vanilla JS jQuery.outerWidth() realisation.
     *
     * @returns {number} The outer width of an element
     */
    outerWidth() {
      const n = this.length;
      let w;

      if (n === 1) {
        w = this[0].offsetWidth;
      } else {
        console.log('outerWidth', this);
        return null;
      }

      return w;
    },

    /**
     * Vanilla JS jQuery.outerHeight() realisation.
     *
     * @returns {number} The outer height of an element
     */
    outerHeight() {
      const n = this.length;
      let h;

      if (n === 1) {
        h = this[0].offsetHeight;
      } else {
        console.log('outerHeight', this);
        return null;
      }

      return h;
    },

    /**
     * Vanilla JS jQuery.width() realisation.
     *
     * @returns {number} The width of an element
     */
    width() {
      const n = this.length;
      let w;

      if (n === 1) {
        w = parseFloat(getComputedStyle(this[0], null).width.replace('px', ''));
      } else {
        console.log('width', this);
        return null;
      }

      return w;
    },

    /**
     * Vanilla JS jQuery.height() realisation.
     *
     * @returns {number} The height of an element
     */
    height() {
      const n = this.length;
      let h;

      if (n === 1) {
        h = parseFloat(getComputedStyle(this[0], null).height.replace('px', ''));
      } else {
        console.log('height', this);
        return null;
      }

      return h;
    },

    /**
     * Vanilla JS jQuery.val() realisation.
     *
     * @param {string} str - The string to insert into an input
     * @returns {number} Return an input value
     */
    val(str) {
      const n = this.length;
      let v;

      if (n === 1) {
        if (this.isString(str) || this.isNumber(str)) {
          this[0].value = str;
        } else {
          v = this[0].value;
        }
      } else {
        console.log('val', this);
        return null;
      }

      return v;
    }
  });

  return J;
})(document);

const ext = e => {
  return new $(e);
};

export default ext;
