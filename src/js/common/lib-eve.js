/**
 *
 * Library for CANVAS EVE.
 *
 * * Dependencies
 * - jQuery 3.4.1
 *
 */

import $ from 'jquery';

function lib() {}

Object.assign(lib.prototype, {
  /**
   * Handle a specific event.
   *
   * @param {string} elem - A name of the element
   * @param {string} event - The name of event
   * @param {string} elementTag - A name of the extra element. Set false to tell no extra element
   * @param {function} func - The name of function to handle
   */
  event(elem, event, elementTag, func) {
    if (elementTag) {
      $(elem).on(event, elementTag, func);
    } else {
      $(elem).on(event, func);
    }
  },

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
   * Get a target`s specific transform-rotate value,and return the value as radian.
   *
   * @param {object} obj - The jQuery object. i.e., $(elem)
   * @returns {number} The angle of a given element. The value will be in between 0 and 2PI
   */
  getRotationRad(obj) {
    let angle;
    const matrix =
      obj.css('-webkit-transform') ||
      obj.css('-moz-transform') ||
      obj.css('-ms-transform') ||
      obj.css('-o-transform') ||
      obj.css('transform');
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
   *
   * @param {string} name - The name of a debugCircle. No need for '#'
   * @param {string} col - The color for the circle
   * @param {array} pos - The array of coordinates. i.e, [x, y]
   * @param {string} tagName - The name of element for where to insert. No need for '#'
   */
  debugCircle(name, col, pos, tagName) {
    if (tagName) {
      $(`#${tagName}`).append(`<div id="${name}"></div>`);
    } else {
      $('#canvas-eve').append(`<div id="${name}"></div>`);
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
    $('iframe').css('pointer-events', 'none');
  },

  /**
   * Set iframe's pointer-events to be default
   *
   */
  iframePointerReset() {
    $('iframe').css('pointer-events', '');
  }
});

export default lib;
