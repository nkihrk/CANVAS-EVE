/**
 *
 * Global variables for CANVAS EVE.
 *
 * Dependencies
 * - none
 *
 */

const NEWFILE_ID = 0;
const CURRENT_ID = 0;
const HIGHEST_Z_INDEX = 1;
const MOUSE_WHEEL_VAL = 1;
let IS_TRANSITION;
if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
  IS_TRANSITION = '';
} else {
  IS_TRANSITION = 'width .1s, height .1s, top .1s, left .1s';
}
const YOUTUBE_API_KEY = null;

exports.NEWFILE_ID = NEWFILE_ID;
exports.CURRENT_ID = CURRENT_ID;
exports.HIGHEST_Z_INDEX = HIGHEST_Z_INDEX;
exports.MOUSE_WHEEL_VAL = MOUSE_WHEEL_VAL;
exports.IS_TRANSITION = IS_TRANSITION;
exports.YOUTUBE_API_KEY = YOUTUBE_API_KEY;
