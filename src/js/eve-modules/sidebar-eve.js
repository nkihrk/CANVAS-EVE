/**
 *
 * Sidebar configuration for CANVAS EVE.
 *
 * Dependencies
 * - jquery-eve
 * - glb-eve
 * - flg-eve
 *
 */

import $ from '../common/jquery-eve';
import GlbEve from '../common/glb-eve';
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
        this._toggleActiveTab($tab);
        this._toggleActiveCanvas();
      }
    },

    //

    _toggleActiveTab($container) {
      const $activeContainer = $container.parents('ul').find('li.active');
      const isActive = !!$activeContainer.length;

      $container.toggleClass('active');

      // Extract number from canvas-tabs, updating a global variable for later-use in file-eve and three-eve
      if ($container.parents('#ui-bar-tab').length === 1) {
        const str = $container[0].id;
        const idMatch = str.match(/(\d+)/);
        if (idMatch) {
          [GlbEve.CURRENT_CANVAS_ID] = idMatch;
        }
      }

      if (isActive) this.__toggleActiveTab = $activeContainer;
      if (
        this.__toggleActiveTab !== undefined &&
        this.__toggleActiveTab[0] !== $container[0] &&
        this.__toggleActiveTab.hasClass('active')
      ) {
        this.__toggleActiveTab.removeClass('active');
      } else {
        $container.toggleClass('active');
      }
      if ($container.hasClass('active')) this.__toggleActiveTab = $container;

      // console.log(GlbEve.CURRENT_CANVAS_ID);
    },

    //

    _toggleActiveCanvas() {
      const $container = $(`#add-files-${GlbEve.CURRENT_CANVAS_ID}`);
      const $activeContainer = $container.parents('#add-files').find('.active');
      const isActive = !!$activeContainer.length;

      $container.toggleClass('active');

      if (isActive) this.__toggleActiveCanvas = $activeContainer;
      if (
        this.__toggleActiveCanvas !== undefined &&
        this.__toggleActiveCanvas[0] !== $container[0] &&
        this.__toggleActiveCanvas.hasClass('active')
      ) {
        this.__toggleActiveCanvas.removeClass('active');
      } else {
        $container.toggleClass('active');
      }
      if ($container.hasClass('active')) this.__toggleActiveCanvas = $container;
    }
  });

  return Sidebar;
})(document);

export default SidebarEve;
