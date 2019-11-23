/**
 *
 * Sidebar configuration for CANVAS EVE.
 *
 * Dependencies
 * - jquery-eve
 *
 */

import $ from '../common/jquery-eve';

const SidebarEve = (() => {
  function Sidebar() {}

  const modules = {};

  Sidebar.prototype = Object.assign(modules, {
    constructor: Sidebar,

    options: {
      BUTTON_FOR_LEFT: 0
    },

    //

    mouseDownEvent() {},

    //

    mouseUpEvent(e) {
      const { target } = e;
      const $uiButtonState = $(target.closest('.ui-bar-toolset'));
      const $uiButtonBarstate = $(target.closest('.ui-button-barstate'));
      const isActive = $uiButtonState.hasClass('active');

      if (e.button === this.options.BUTTON_FOR_LEFT) {
        if (isActive && $uiButtonBarstate.length === 1) {
          this._toggleState($uiButtonState);
        }
        if (!isActive) {
          this._toggleState($uiButtonState);
        }
      }
    },

    //

    _toggleState($container) {
      $container.toggleClass('active');
    }
  });

  return Sidebar;
})();

export default SidebarEve;
