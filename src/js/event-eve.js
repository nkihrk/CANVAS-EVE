/**
 *
 * Handling all events for CANVAS EVE.
 *
 * Dependencies
 * - oekaki-eve
 * - three-eve
 * - colpick-eve
 * - youtube-eve
 * - file-eve
 * - zoom-eve
 * - plain-eve
 * - canvas-eve
 * - toggle-eve
 * - ctxmenu-eve
 * - menu-eve
 * - common-eve
 *
 */

import OekakiEve from './eve-modules/oekaki-eve';
import ThreeEve from './eve-modules/three-eve';
import ColpickEve from './eve-modules/colpick-eve';
import YoutubeEve from './eve-modules/youtube-eve';
import FileEve from './eve-modules/file-eve';
import ZoomEve from './eve-modules/zoom-eve';
import PlainEve from './eve-modules/plain-eve';
import CanvasEve from './eve-modules/canvas-eve';
import ToggleEve from './eve-modules/toggle-eve';
import CtxmenuEve from './eve-modules/ctxmenu-eve';
import MenuEve from './eve-modules/menu-eve';
import SidebarEve from './eve-modules/sidebar-eve';
import CommonEve from './common/common-eve';

const EventEve = ((W, D) => {
  function Event() {
    this.canvasEveWrap = D.getElementById('canvas-eve-wrapper');

    this.Oekaki = new OekakiEve(D.getElementById('color-oekaki'));
    this.Three = new ThreeEve();
    this.Colpick = new ColpickEve();
    this.Youtube = new YoutubeEve();
    this.File = new FileEve();
    this.Zoom = new ZoomEve(D.getElementById('zoom'));
    this.Plain = new PlainEve(D.getElementById('plain'));
    this.Canvas = new CanvasEve();
    this.Toggle = new ToggleEve();
    this.Ctxmenu = new CtxmenuEve();
    this.Menu = new MenuEve();
    this.Sidebar = new SidebarEve();
    this.Common = new CommonEve();
  }

  const modules = {};

  Event.prototype = Object.assign(modules, {
    constructor: Event,

    options: {},

    load() {
      this.initEvent();

      this.mouseDownEvent();
      this.mouseUpEvent();
      this.mouseMoveEvent();
      this.mouseWheelEvent();
      this.contextMenuEvent();
      this.changeEvent();
      // this.touchMoveEvent();
      this.dragOverEvent();
      this.dropEvent();
      this.pasteEvent();
      this.keyDownEvent();
      this.keyUpEvent();
    },

    //

    initEvent() {
      this.Common.load();
      this.Menu.load();
      this.Ctxmenu.load();
      this.Plain.load();
      this.Zoom.load();
      this.Oekaki.load();
      this.Sidebar.load();
      this.Three.load();
      this.Colpick.load();
    },

    //

    mouseDownEvent() {
      D.addEventListener(
        'mousedown',
        e => {
          this.Menu.mouseDownEvent(e);
          this.Ctxmenu.mouseDownEvent(e);
          this.Toggle.mouseDownEvent(e);
          this.Plain.mouseDownEvent(e);
          this.File.mouseDownEvent(e);
          this.Oekaki.mouseDownEvent(e);
          this.Colpick.mouseDownEvent(e);
          this.Youtube.mouseDownEvent(e);
          this.Canvas.mouseDownEvent(e);
        },
        false
      );
    },

    //

    mouseUpEvent() {
      D.addEventListener(
        'mouseup',
        e => {
          this.Plain.mouseUpEvent();
          this.Oekaki.mouseUpEvent();
          this.Colpick.mouseUpEvent();
          this.Youtube.mouseUpEvent(e);
          this.Canvas.mouseUpEvent();
          this.Ctxmenu.mouseUpEvent(e);
          this.Sidebar.mouseUpEvent(e);
        },
        false
      );
    },

    //

    mouseMoveEvent() {
      D.addEventListener(
        'mousemove',
        e => {
          e.preventDefault();
          e.stopPropagation();

          this.Plain.mouseMoveEvent(e);
          this.File.mouseMoveEvent(e);
          this.Oekaki.mouseMoveEvent(e);
          this.Colpick.mouseMoveEvent(e);
          this.Canvas.mouseMoveEvent(e);
        },
        false
      );
    },

    //

    mouseWheelEvent() {
      D.addEventListener(
        'wheel',
        e => {
          this.Zoom.mouseWheelEvent(e);
          this.Oekaki.mouseWheelEvent(e);
          this.Canvas.mouseWheelEvent();
        },
        false
      );
    },

    //

    contextMenuEvent() {
      D.addEventListener(
        'contextmenu',
        e => {
          e.preventDefault();
        },
        false
      );
    },

    //

    changeEvent() {
      D.addEventListener(
        'change',
        e => {
          this.Colpick.changeEvent(e);
        },
        false
      );
    },

    //

    touchMoveEvent() {
      W.addEventListener(
        'touchmove',
        e => {
          e.preventDefault();
        },
        {
          passive: false
        },
        false
      );
      W.removeEventListener(
        'touchmove',
        e => {
          e.preventDefault();
        },
        {
          passive: false
        },
        false
      );
    },

    //

    dragOverEvent() {
      const self = this;
      this.canvasEveWrap.addEventListener(
        'dragover',
        e => {
          e.preventDefault();
          e.stopPropagation();

          self.Three.Reader.dragOverEvent(e);
          self.File.dragOverEvent(e);
        },
        false
      );
    },

    //

    dropEvent() {
      const self = this;
      this.canvasEveWrap.addEventListener(
        'drop',
        e => {
          e.preventDefault();
          e.stopPropagation();

          self.Three.Reader.dropEvent(e);
          self.File.dropEvent(e);
        },
        false
      );
    },

    //

    pasteEvent() {
      const self = this;
      this.canvasEveWrap.addEventListener(
        'paste',
        e => {
          self.File.pasteEvent(e);
        },
        false
      );
    },

    //

    keyDownEvent() {
      D.addEventListener('keydown', e => {
        this.Canvas.keyDownEvent(e);
      });
    },

    //

    keyUpEvent() {
      D.addEventListener('keyup', e => {
        this.Canvas.keyUpEvent(e);
      });
    }
  });

  return Event;
})(window, document);

export default EventEve;
