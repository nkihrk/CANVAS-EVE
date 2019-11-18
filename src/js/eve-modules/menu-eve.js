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

    this.__toggleActive = {}; // A specified variable for _toggleActive method. Just for initialization
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

    load() {
      this._setPos();
      this.mouseEnterEvent();
      this.mouseLeaveEvent();
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

    _setPos() {
      const { $uiBarMenu } = this;
      const { $menuFile } = this;
      const { $menuEdit } = this;
      const { $menuWindow } = this;
      const { $menuFileList } = this;
      const { $menuEditList } = this;
      const { $menuWindowList } = this;
      const top = $uiBarMenu.height();

      $menuFileList.css({
        left: `${$menuFile.offset().left}px`,
        top: `${top}px`
      });

      $menuEditList.css({
        left: `${$menuEdit.offset().left}px`,
        top: `${top}px`
      });

      $menuWindowList.css({
        left: `${$menuWindow.offset().left}px`,
        top: `${top}px`
      });
    },

    //

    mouseEnterEvent() {},

    //

    mouseLeaveEvent() {},

    //

    _initMenu() {
      const { $menuFile } = this;
      const { $menuEdit } = this;
      const { $menuWindow } = this;
      const { $menuFileList } = this;
      const { $menuEditList } = this;
      const { $menuWindowList } = this;

      $menuFile.removeClass('active');
      $menuEdit.removeClass('active');
      $menuWindow.removeClass('active');
      $menuFileList.removeClass('active');
      $menuEditList.removeClass('active');
      $menuWindowList.removeClass('active');
    },

    //

    _showMenu(e) {
      const { $menuFile } = this;
      const { $menuEdit } = this;
      const { $menuWindow } = this;
      const { $menuFileList } = this;
      const { $menuEditList } = this;
      const { $menuWindowList } = this;

      if (e.target.closest('#menu-file')) {
        this._toggleActive([$menuFile, $menuFileList]);
      } else if (e.target.closest('#menu-edit')) {
        this._toggleActive([$menuEdit, $menuEditList]);
      } else if (e.target.closest('#menu-window')) {
        this._toggleActive([$menuWindow, $menuWindowList]);
      }
    },

    //

    _toggleActive($container) {
      for (let i = 0; i < 2; i++) {
        $container[i].toggleClass('active');

        if (
          this.__toggleActive[i] !== undefined &&
          this.__toggleActive[i][0] !== $container[i][0] &&
          this.__toggleActive[i].hasClass('active')
        ) {
          this.__toggleActive[i].removeClass('active');
        }
        if ($container[i].hasClass('active'))
          this.__toggleActive[i] = $container[i];
      }
    }
  });

  return Menu;
})(document);

export default MenuEve;
