/**
 *
 * Sidebar configuration for CANVAS EVE.
 *
 * Dependencies
 * - jquery-eve
 *
 */

import $ from '../common/jquery-eve';

const SidebarEve = (W => {
  function Sidebar() {
    this.$uiBarTop = $('#ui-bar-top');
    this.$uiBarBottom = $('#ui-bar-bottom');
    this.$uiBarMiddle = $('#ui-bar-middle');
    this.$uiBarLeft = $('#ui-bar-left');
    this.$uiBarRight = $('#ui-bar-right');
  }

  const modules = {};

  Sidebar.prototype = Object.assign(modules, {
    constructor: Sidebar,

    options: {},

    //

    load() {
      this._checkResize();
    },

    //

    mouseDownEvent() {},

    //

    mouseUpEvent() {},

    //

    mouseMoveEvent() {},

    //

    _checkResize() {
      this._calcMiddleArea();
      // requestAnimationFrame(this._checkResize());
    },

    //

    _calcMiddleArea() {
      const { $uiBarBottom } = this;
      const { $uiBarMiddle } = this;
      const { $uiBarLeft } = this;
      const { $uiBarRight } = this;
      const w = W.innerWidth - $uiBarLeft.width() - $uiBarRight.width();
      console.log($uiBarRight.width());

      if (this._checkWidthDiff !== undefined && this._checkWidthDiff !== w) {
        $uiBarBottom.css('width', `${w}px`);
        $uiBarMiddle.css('width', `${w}px`);

        this._checkWidthDiff = w;
      }
    },

    //

    _uiBarTop() {},

    //

    _uiBarBottom() {},

    //

    _uiBarMiddle() {},

    //

    _uiBarLeft() {},

    //

    _uiBarRight() {}
  });

  return Sidebar;
})(window);

export default SidebarEve;
