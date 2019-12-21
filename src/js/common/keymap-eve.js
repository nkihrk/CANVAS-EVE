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
      const isShiftKey = FlgEve.keyMap.Shift;
      const isDelKey = FlgEve.keyMap.Delete;

      const isPermitkey = isCtrlKey || isShiftKey || isDelKey;

      if (!isPermitkey) FlgEve.keyMap = {};

      // console.log(FlgEve.keyMap);
    },

    //

    // Reset specific keys in the keyMap when keyUp events are called
    keyUpEvent(e) {
      if (e.key === 'Control') FlgEve.keyMap.Control = false;
      if (e.key === 'Shift') FlgEve.keyMap.Shift = false;
      if (e.key === 'Delete') FlgEve.keyMap.Delete = false;
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
