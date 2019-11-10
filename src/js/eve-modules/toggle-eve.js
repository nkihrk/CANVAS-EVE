/**
 *
 * Toggling system for CANVAS EVE.
 *
 * Dependencies
 * - jquery-eve
 * - flg-eve
 *
 */

import $ from '../common/jquery-eve';
import FlgEve from '../common/flg-eve';

const ToggleEve = (() => {
  function Toggle() {}

  const modules = {};

  Toggle.prototype = Object.assign(modules, {
    constructor: Toggle,

    options: {
      BUTTON_FOR_LEFT: 0,
      LIST_OF_TOOLS: ['#toggle-colpick', '#brush-oekaki', '#eraser-oekaki']
    },

    //

    mouseDownEvent(e) {
      if (e.button === this.options.BUTTON_FOR_LEFT) {
        this._toggleEntry(e);
      }
    },

    //

    _toggleEntry(e) {
      if (this.options.LIST_OF_TOOLS.indexOf(`#${e.target.getAttribute('id')}`) !== -1) {
        this._toggleTool($(e.target));
      }
    },

    //

    _toggleTool($container) {
      $container.toggleClass('active');

      if (
        this.__$toggleButton !== undefined &&
        this.__$toggleButton[0] !== $container[0] &&
        this.__$toggleButton.hasClass('active')
      ) {
        this.__$toggleButton.removeClass('active');
        this._resetIsActiveFlg(this.__$toggleButton);
      }
      if ($container.hasClass('active')) this.__$toggleButton = $container;

      this._colpick($container);
      this._oekaki($container);
    },

    //

    _resetIsActiveFlg($container) {
      const btnName = $container.attr('id');

      switch (btnName) {
        case 'toggle-colpick':
          FlgEve.colpick.tools.is_active_flg = false;
          break;

        case 'brush-oekaki':
        case 'eraser-oekaki':
          FlgEve.oekaki.tools.is_active_flg = false;
          break;

        default:
          break;
      }
    },

    //

    _colpick($container) {
      const btnName = $container.attr('id');

      if ($container.hasClass('active') && btnName === 'toggle-colpick') {
        $('#canvas-eve .file-wrap').removeClass('grab-pointer');
        $('#canvas-eve').addClass('spuit-pointer');
      } else {
        $('#canvas-eve').removeClass('spuit-pointer');
        $('#canvas-eve .file-wrap').addClass('grab-pointer');
      }

      switch (btnName) {
        case 'toggle-colpick':
          if ($container.hasClass('active')) {
            FlgEve.colpick.tools.is_active_flg = true;
          } else {
            FlgEve.colpick.tools.is_active_flg = false;
          }
          break;

        default:
          break;
      }
    },

    //

    _oekaki($container) {
      const btnName = $container.attr('id');

      if ($container.hasClass('active') && btnName === 'brush-oekaki') {
        FlgEve.oekaki.tools.brush_flg = true;
        FlgEve.oekaki.tools.is_active_flg = true;
      } else {
        FlgEve.oekaki.tools.brush_flg = false;
        FlgEve.oekaki.tools.is_active_flg = false;
      }

      if ($container.hasClass('active') && btnName === 'eraser-oekaki') {
        FlgEve.oekaki.tools.eraser_flg = true;
        FlgEve.oekaki.tools.is_active_flg = true;
      } else {
        FlgEve.oekaki.tools.eraser_flg = false;
        FlgEve.oekaki.tools.is_active_flg = false;
      }

      switch (btnName) {
        case 'brush-oekaki':
        case 'eraser-oekaki':
          if ($container.hasClass('active')) {
            FlgEve.oekaki.tools.is_active_flg = true;
          } else {
            FlgEve.oekaki.tools.is_active_flg = false;
          }
          break;

        default:
          break;
      }
    }
  });

  return Toggle;
})();

export default ToggleEve;
