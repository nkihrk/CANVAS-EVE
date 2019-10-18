/**
 *
 * Library for CANVAS EVE.
 *
 * * Dependencies
 * - none
 *
 */

function lib() {}

Object.assign(lib.prototype, {
  /**
   * Convert RGB into HEX.
   *
   * @param {array} rgb - The array of rgb. i.e. [r, g, b]
   * @returns {string} - The hex code
   */
  rgb2hex(rgb) {
    return `#${rgb
      .map(val => {
        return `0${val.toString(16)}`.slice(-2);
      })
      .join('')}`;
  },

  /**
   * Convert HEX into RGB.
   *
   * @param {string} hex - The hex code
   * @returns {array} - The RGB. i.e. [r, g, b]
   */
  hex2rgb(hex) {
    if (hex.slice(0, 1) === '#') hex = hex.slice(1);
    if (hex.length === 3)
      hex =
        hex.slice(0, 1) +
        hex.slice(0, 1) +
        hex.slice(1, 2) +
        hex.slice(1, 2) +
        hex.slice(2, 3) +
        hex.slice(2, 3);

    return [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)].map(str => {
      return parseInt(str, 16);
    });
  },

  /**
   * Convert HSL into RGB.
   *
   * @param {array} hsl - The HSL. i.e., [h, s, l]
   * @returns {array} - The RGB. i.e. [r, g, b]
   */
  hsl2rgb(hsl) {
    let r;
    let g;
    let b;

    function __hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;

      return p;
    }

    if (hsl[1] === 0) {
      r = 1;
      g = 1;
      // eslint-disable-next-line prefer-destructuring
      b = hsl[2];
    } else {
      const q = hsl[2] < 0.5 ? hsl[2] * (1 + hsl[1]) : hsl[2] + hsl[1] - hsl[2] * hsl[1];
      const p = 2 * hsl[2] - q;
      r = __hue2rgb(p, q, hsl[0] + 1 / 3);
      g = __hue2rgb(p, q, hsl[0]);
      b = __hue2rgb(p, q, hsl[0] - 1 / 3);
    }

    return [
      Math.min(Math.floor(r * 256), 255),
      Math.min(Math.floor(g * 256), 255),
      Math.min(Math.floor(b * 256), 255)
    ];
  },

  /**
   * Copy text to clipboard.
   * https://webllica.com/copy-text-to-clipboard/
   *
   * @param {string} textVal - The text to be copied to clipboard
   */
  copyTextToClipboard(textVal) {
    const copyFrom = document.createElement('textarea');

    copyFrom.textContent = textVal;

    const bodyElm = document.getElementsByTagName('body')[0];
    bodyElm.appendChild(copyFrom);

    copyFrom.select();
    const retVal = document.execCommand('copy');
    bodyElm.removeChild(copyFrom);
    return retVal;
  },

  /**
   * Convert string to node
   *
   * @param {string} str - The string of which you want to convert into node. i.e., '<div>hoge</div>'
   * @returns {object} Return generated elements in array
   */
  str2node(str) {
    return new DOMParser().parseFromString(str, 'text/html').body.children;
  },

  /**
   * Get transform values of a specific selector.
   *
   * @param {object} obj - The jQuery object of a specific css property of transform. i.e., $(elem).css('transform')
   * @returns {array} - The array of transform property
   */
  transformValue(obj) {
    const values = obj
      .split('(')[1]
      .split(')')[0]
      .split(', ');
    const matrix = {
      scaleX: values[0],
      rotateP: values[1],
      rotateM: values[2],
      scaleY: values[3],
      transformX: values[4],
      transformY: values[5]
    };

    return matrix;
  },

  /**
   * Get transform values of a specific selector.
   *
   * @param {number} x1 - The x coorcinate of a start point
   * @param {number} y1 - The y coorcinate of a start point
   * @param {number} x2 - The x coorcinate of a last point
   * @param {number} y2 - The y coorcinate of a last point
   * @returns {number} - The length between two coordinates
   */
  getDistance(x1, y1, x2, y2) {
    let xs = x2 - x1;
    let ys = y2 - y1;
    xs *= xs;
    ys *= ys;

    return Math.sqrt(xs + ys);
  },

  /**
   * Get a target`s specific transform-rotate value,and return the value as radian.
   *
   * @param {element} elem - Input an element
   * @returns {number} The angle of a given element. The value will be in between 0 and 2PI
   */
  getRotationRad(elem) {
    let angle;
    const style = getComputedStyle(elem, null);
    const matrix =
      style.getPropertyValue('-webkit-transform') ||
      style.getPropertyValue('-moz-transform') ||
      style.getPropertyValue('-ms-transform') ||
      style.getPropertyValue('-o-transform') ||
      style.getPropertyValue('transform');

    if (matrix !== 'none') {
      const values = matrix
        .split('(')[1]
        .split(')')[0]
        .split(',');
      const a = values[0];
      const b = values[1];
      angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
    } else {
      angle = 0;
    }

    return angle < 0 ? ((angle + 360) / 180) * Math.PI : (angle / 180) * Math.PI;
  },

  /**
   * Calcurate randian between x-axis and given coordinates.
   *
   * @param {number} x - The x coordinate from specific origin
   * @param {number} y - The y coordinate from specific origin
   * @returns {number} The angle between x-axis and a given coordinate. The value will be in between 0 and 2PI
   */
  calcRadians(x, y) {
    const rad = (Math.atan2(y, x) / Math.PI) * 180 + (Math.atan2(y, x) > 0 ? 0 : 360);

    return (rad / 180) * Math.PI;
  },

  /**
   * Render a small circle for debugging coordinates.
   * Head up: This method is jQuery dependency. It is no longer available. Rewrite to vanilla JS
   *
   * @param {string} name - The name of a debugCircle. No need for '#'
   * @param {string} col - The color for the circle
   * @param {array} pos - The array of coordinates. i.e, [x, y]
   * @param {string} tagName - The name of element for where to insert. No need for '#'
   */
  debugCircle(name, col, pos, tagName) {
    if ($(`#${name}`).length === 0) {
      if (tagName) {
        $(`#${tagName}`).append(`<div id="${name}"></div>`);
      } else {
        $('#canvas-eve-wrapper').append(`<div id="${name}"></div>`);
      }
    }
    $(`#${name}`).css({
      left: `${pos[0]}px`,
      top: `${pos[1]}px`,
      width: `${14}px`,
      height: `${14}px`,
      background: col,
      'border-radius': `${50}%`,
      position: 'absolute',
      'z-index': 999,
      transform: 'translateX(-50%) translateY(-50%)',
      opacity: 0.8
    });
  },

  /**
   * Set iframe's pointer-events to be none
   *
   */
  iframePointerNone() {
    const array = document.querySelectorAll('iframe');
    for (let i = 0; i < array.length; i++) {
      array[i].style.pointerEvents = 'none';
      // console.log(array[i].style.pointerEvents);
    }
  },

  /**
   * Set iframe's pointer-events to be default
   *
   */
  iframePointerReset() {
    const array = document.querySelectorAll('iframe');
    for (let i = 0; i < array.length; i++) {
      array[i].style.pointerEvents = '';
      // console.log(array[i].style.pointerEvents);
    }
  },

  /**
   * Check if it is string or not.
   *
   * @param val
   * @returns {boolean} - Return true/false
   */
  isString(val) {
    return typeof val === 'string' || val instanceof String;
  },

  /**
   * Check if it is number or not.
   *
   * @param val
   * @returns {boolean} - Return true/false
   */
  isNumber(val) {
    // eslint-disable-next-line no-restricted-globals
    return typeof val === 'number' && isFinite(val);
  },

  /**
   * Check if it is array or not.
   *
   * @param val
   * @returns {boolean} - Return true/false
   */
  isArray(val) {
    // return val && typeof val === 'object' && val.constructor === Array;
    return val && typeof val === 'object';
  },

  /**
   * Check if it is function or not.
   *
   * @param val
   * @returns {boolean} - Return true/false
   */
  isFunction(val) {
    return typeof val === 'function';
  },

  /**
   * Check if it is object or not.
   *
   * @param val
   * @returns {boolean} - Return true/false
   */
  isObject(val) {
    // return val && typeof val === 'object' && val.constructor === Object;
    return val && typeof val === 'object';
  },

  /**
   * Check if it is element or not.
   *
   * @param val
   * @returns {boolean} - Return true/false
   */
  isElement(val) {
    return val instanceof Element || val instanceof HTMLDocument;
  },

  /**
   * Check if it is null or not.
   *
   * @param val
   * @returns {boolean} - Return true/false
   */
  isNull(val) {
    return val === null;
  },

  /**
   * Check if it is undefined or not.
   *
   * @param val
   * @returns {boolean} - Return true/false
   */
  isUndefined(val) {
    return typeof val === 'undefined';
  },

  /**
   * Check if it is boolean or not.
   *
   * @param val
   * @returns {boolean} - Return true/false
   */
  isBoolean(val) {
    return typeof val === 'boolean';
  },

  /**
   * Return a total number of keys in an object
   *
   * @param {object} obj
   * @returns {number} Return a total number of keys
   */
  keysCount(obj) {
    return _.keys(obj).length;
  },

  /**
   * Return an array of an object keys
   *
   * @param {object} obj
   * @returns {array} Return an array of keys
   */
  keysInArray(obj) {
    return Object.keys(obj);
  }
});

export default lib;
