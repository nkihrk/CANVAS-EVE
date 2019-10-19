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

    this.oekaki = new OekakiEve(D.getElementById('color-oekaki'));
    this.three = new ThreeEve();
    this.colpick = new ColpickEve();
    this.youtube = new YoutubeEve();
    this.file = new FileEve();
    this.zoom = new ZoomEve();
    this.plain = new PlainEve();
    this.canvas = new CanvasEve();
    this.common = new CommonEve();
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
      this.oekaki.load();
      this.three.load();
      this.colpick.load();
      this.common.load();
    },

    //

    mouseDownEvent() {
      D.addEventListener(
        'mousedown',
        e => {
          this.oekaki.mouseDownEvent(e);
          this.colpick.mouseDownEvent(e);
          this.youtube.mouseDownEvent(e);
          this.file.mouseDownEvent(e);
          this.plain.mouseDownEvent(e);
          this.canvas.mouseDownEvent(e);
        },
        false
      );
    },

    //

    mouseUpEvent() {
      D.addEventListener(
        'mouseup',
        e => {
          this.oekaki.mouseUpEvent();
          this.colpick.mouseUpEvent();
          this.youtube.mouseUpEvent(e);
          this.plain.mouseUpEvent();
          this.canvas.mouseUpEvent();
        },
        false
      );
    },

    //

    mouseMoveEvent() {
      D.addEventListener(
        'mousemove',
        e => {
          this.oekaki.mouseMoveEvent(e);
          this.colpick.mouseMoveEvent(e);
          this.file.mouseMoveEvent(e);
          this.plain.mouseMoveEvent(e);
          this.canvas.mouseMoveEvent(e);
        },
        false
      );
    },

    //

    mouseWheelEvent() {
      // IE9+, Chrome, Safari, Opera
      D.addEventListener(
        'mousewheel',
        e => {
          this.zoom.mouseWheelEvent(e);
          this.canvas.mouseWheelEvent();
        },
        false
      );
      // Firefox
      D.addEventListener(
        'DOMMouseScroll',
        e => {
          this.zoom.mouseWheelEvent(e);
          this.canvas.mouseWheelEvent();
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
          this.colpick.changeEvent(e);
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
          self.three.Reader.dragOverEvent(e);
          self.file.dragOverEvent(e);
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
          self.three.Reader.dropEvent(e);
          self.file.dropEvent(e);
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
          self.file.pasteEvent(e);
        },
        false
      );
    }
  });

  return Event;
})(window, document);

export default EventEve;
