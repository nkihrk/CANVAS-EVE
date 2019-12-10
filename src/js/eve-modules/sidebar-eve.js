/**
 *
 * Sidebar configuration for CANVAS EVE.
 *
 * Dependencies
 * - jquery-eve
 * - flg-eve
 *
 */

import $ from '../common/jquery-eve';
import FlgEve from '../common/flg-eve';

const SidebarEve = (D => {
  function Sidebar() {}

  const modules = {};

  Sidebar.prototype = Object.assign(modules, {
    constructor: Sidebar,

    options: {
      BUTTON_FOR_LEFT: 0
    },

    //

    load() {
      this.mouseEnterEvent();
      this.mouseLeaveEvent();
    },

    //

    mouseDownEvent(e) {
      if (e.button === this.options.BUTTON_FOR_LEFT) this._toggleTab(e);
    },

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

    mouseEnterEvent() {
      const canvasEveUi = D.getElementById('canvas-eve-ui');

      canvasEveUi.onmouseenter = () => {
        FlgEve.ui.is_ui_flg = true;
      };
    },

    //

    mouseLeaveEvent() {
      const canvasEveUi = D.getElementById('canvas-eve-ui');

      canvasEveUi.onmouseleave = () => {
        FlgEve.ui.is_ui_flg = false;
      };
    },

    //

    _initToolSets() {
      $('.ui-bar-toolset').removeClass('active');
    },

    //

    _toggleState($container) {
      $container.toggleClass('active');
    },

    //

    _toggleTab(e) {
      if (e.target.closest('.tab-prefix')) {
        const $tab = $(e.target.closest('.tab-prefix'));
        this._toggleActive($tab);
      }
    },

    //

    _toggleActive($container) {
      const $activeContainer = $container.parents('ul').find('li.active');
      const isActive = !!$activeContainer.length;

      $container.toggleClass('active');

      if (isActive) this.__toggleActive = $activeContainer;
      if (
        this.__toggleActive !== undefined &&
        this.__toggleActive[0] !== $container[0] &&
        this.__toggleActive.hasClass('active')
      ) {
        this.__toggleActive.removeClass('active');
      } else {
        $container.toggleClass('active');
      }
      if ($container.hasClass('active')) this.__toggleActive = $container;
    }
  });

  return Sidebar;
})(document);

export default SidebarEve;
