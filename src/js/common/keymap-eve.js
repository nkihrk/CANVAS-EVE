/**
 *
 * Key map for CANVAS EVE.
 *
 * Dependencies
 * - flg-eve
 *
 */

import FlgEve from './flg-eve';

const KeymapEve = (() => {
  function Keymap() {}

  const modules = {};

  Keymap.prototype = Object.assign(modules, {
    constructor: Keymap,

    //

    keyDownEvent(e) {
      FlgEve.keyMap[e.key] = true;

      const isCtrlKey = FlgEve.keyMap.Control;
      const isDelKey = FlgEve.keyMap.Delete;

      if (!(isCtrlKey || isDelKey)) FlgEve.keyMap = {};

      // console.log(FlgEve.keyMap);
    },

    //

    // Reset specific keys in the keyMap when keyUp events are called
    keyUpEvent(e) {
      if (e.key === 'Control') FlgEve.keyMap.Control = false;
    },

    //

    // Initialize all keyMaps values when the key events are finshed executing
    _initKeyMap() {
      // Used:
      // - canvas-eve
      FlgEve.keyMap.ArrowUp = false;
      FlgEve.keyMap.ArrowDown = false;
      FlgEve.keyMap.ArrowLeft = false;
      FlgEve.keyMap.ArrowRight = false;
    }
  });

  return Keymap;
})();

export default KeymapEve;
