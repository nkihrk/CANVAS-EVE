/**
 *
 * Library for this app. The set of frequent-used functions.
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
   * Get transform values of a specific selector.
   *
   * @param {object} obj - The jQuery object of a specific css property of transform. i.e., $(elem).css('transform')
   * @returns {array} - The array of transform property
   */
  transformValue: function(obj) {
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
  getRotationRad: function(obj) {
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
  calcRadians: function(x, y) {
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
  debugCircle: function(name, col, pos, tagName) {
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
  iframePointerNone: function() {
    $('iframe').css('pointer-events', 'none');
  },

  /**
   * Set iframe's pointer-events to be default
   *
   */
  iframePointerReset: function() {
    $('iframe').css('pointer-events', '');
  }
});

export default lib;
