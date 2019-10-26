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
      this.touchMoveEvent();
      this.dragOverEvent();
      this.dropEvent();
      this.pasteEvent();
    },

    //

    initEvent() {
      this.Common.load();
      this.Oekaki.load();
      this.Three.load();
      this.Colpick.load();
      this.Plain.load();
    },

    //

    mouseDownEvent() {
      D.addEventListener(
        'mousedown',
        e => {
          this.Oekaki.mouseDownEvent(e);
          this.Colpick.mouseDownEvent(e);
          this.Youtube.mouseDownEvent(e);
          this.File.mouseDownEvent(e);
          this.Plain.mouseDownEvent(e);
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
          this.Oekaki.mouseUpEvent();
          this.Colpick.mouseUpEvent();
          this.Youtube.mouseUpEvent(e);
          this.Plain.mouseUpEvent();
          this.Canvas.mouseUpEvent();
        },
        false
      );
    },

    //

    mouseMoveEvent() {
      D.addEventListener(
        'mousemove',
        e => {
          this.Oekaki.mouseMoveEvent(e);
          this.Colpick.mouseMoveEvent(e);
          this.File.mouseMoveEvent(e);
          this.Plain.mouseMoveEvent(e);
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
    }
  });

  return Event;
})(window, document);

export default EventEve;
