/**
 *
 * Main menu for CANVAS EVE.
 *
 * Dependencies
 * - jQuery-eve
 *
 */

import $ from '../common/jquery-eve';

const MenuEve = (() => {
  function Menu() {
    this.$uiBarMenu = $('#ui-bar-menu');
    this.$menuWrapper = $('#menu-wrapper');
    this.$menuFile = $('#menu-file');
    this.$menuEdit = $('#menu-edit');
    this.$menuWindow = $('#menu-window');
    this.$menuFileList = $('#menu-file-list');
    this.$menuEditList = $('#menu-edit-list');
    this.$menuWindowList = $('#menu-window-list');

    this.timeoutShow = null; // lazy load
    this.timeoutHide = null; // lazy load
  }

  const modules = {};

  Menu.prototype = Object.assign(modules, {
    constructor: Menu,

    options: {
      BUTTON_FOR_LEFT: 0,
      BUTTON_FOR_RIGHT: 2,
      MOUSE_OVER_DELAY: 300,
      TRANSITION_TIME: 100
    },

    //

    mouseDownEvent(e) {
      const isMenuButton =
        e.target.closest('#menu-file') ||
        e.target.closest('#menu-edit') ||
        e.target.closest('#menu-window');

      if (e.button === this.options.BUTTON_FOR_LEFT && isMenuButton) {
        this._showMenu(e);
      } else if (!e.target.closest('#menu-wrapper')) {
        this._initMenu();
      }
    },

    //

    _initMenu() {
      const { $menuFileList } = this;
      const { $menuEditList } = this;
      const { $menuWindowList } = this;

      $menuFileList.removeClass('active');
      $menuEditList.removeClass('active');
      $menuWindowList.removeClass('active');
    },

    //

    _showMenu(e) {
      const { $uiBarMenu } = this;
      const { $menuWrapper } = this;
      const { $menuFile } = this;
      const { $menuEdit } = this;
      const { $menuWindow } = this;
      const { $menuFileList } = this;
      const { $menuEditList } = this;
      const { $menuWindowList } = this;
      const top = $uiBarMenu.height();
      let left;

      if (e.target.closest('#menu-file')) {
        left = $menuFile.offset().left;
        $menuFile.addClass('active');
        $menuFileList.addClass('active');
      } else if (e.target.closest('#menu-edit')) {
        left = $menuEdit.offset().left;
        $menuEdit.addClass('active');
        $menuEditList.addClass('active');
      } else if (e.target.closest('#menu-window')) {
        left = $menuWindow.offset().left;
        $menuWindow.addClass('active');
        $menuWindowList.addClass('active');
      }

      $menuWrapper.css({
        left: `${left}px`,
        top: `${top}px`
      });
    }
  });

  return Menu;
})(document);

export default MenuEve;
