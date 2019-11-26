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
      LIST_OF_TOOLS: [
        '#ui-button-hand',
        '#ui-button-pen',
        '#ui-button-eraser',
        '#ui-button-crop',
        '#ui-button-spuit',
        '#ui-button-thumbtack',
        '#ui-button-resize',
        '#ui-button-rotate',
        '#ui-button-flip'
      ]
    },

    //

    mouseDownEvent(e) {
      if (e.button === this.options.BUTTON_FOR_LEFT) {
        this._toggleEntry(e);
      }
    },

    //

    _toggleEntry(e) {
      if (
        this.options.LIST_OF_TOOLS.indexOf(
          `#${e.target.getAttribute('id')}`
        ) !== -1
      ) {
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

      this._plain($container);
      this._colpick($container);
      this._oekaki($container);

      FlgEve.ui.toolbar.is_active_flg = !!$('#ui-bar-tool li.active').length; // To know whether tools in the toolbar are active or not
    },

    //

    _resetIsActiveFlg($container) {
      const btnName = $container.attr('id');

      switch (btnName) {
        case 'ui-button-hand':
          FlgEve.plain.tools.is_active_flg = false;
          break;

        case 'ui-button-spuit':
          FlgEve.colpick.tools.is_active_flg = false;
          break;

        case 'ui-button-pen':
        case 'ui-button-eraser':
          FlgEve.oekaki.tools.is_active_flg = false;
          break;

        default:
          break;
      }
    },

    //

    _plain($container) {
      const btnName = $container.attr('id');

      if ($container.hasClass('active') && btnName === 'ui-button-hand') {
        $('#canvas-eve').addClass('active-grab-mousewheel');
      } else {
        $('#canvas-eve').removeClass('active-grab-mousewheel');
      }

      switch (btnName) {
        case 'ui-button-hand':
          if ($container.hasClass('active')) {
            FlgEve.plain.tools.is_active_flg = true;
          } else {
            FlgEve.plain.tools.is_active_flg = false;
          }
          break;

        default:
          break;
      }
    },

    //

    _colpick($container) {
      const btnName = $container.attr('id');

      if ($container.hasClass('active') && btnName === 'ui-button-spuit') {
        $('#canvas-eve .file-wrap').removeClass('grab-pointer');
        $('#canvas-eve').addClass('spuit-pointer');
      } else {
        $('#canvas-eve').removeClass('spuit-pointer');
        $('#canvas-eve .file-wrap').addClass('grab-pointer');
      }

      switch (btnName) {
        case 'ui-button-spuit':
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

      if ($container.hasClass('active') && btnName === 'ui-button-pen') {
        FlgEve.oekaki.tools.brush_flg = true;
      } else {
        FlgEve.oekaki.tools.brush_flg = false;
      }

      if ($container.hasClass('active') && btnName === 'ui-button-eraser') {
        FlgEve.oekaki.tools.eraser_flg = true;
      } else {
        FlgEve.oekaki.tools.eraser_flg = false;
      }

      switch (btnName) {
        case 'ui-button-pen':
        case 'ui-button-eraser':
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
