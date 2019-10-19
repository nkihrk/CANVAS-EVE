/**
 *
 * Handling all events for CANVAS EVE.
 *
 * Dependencies
 * -
 *
 */

import CommonEve from './common/common-eve';
import CanvasEve from './eve-modules/canvas-eve';
import PlainEve from './eve-modules/plain-eve';
import ZoomEve from './eve-modules/zoom-eve';
import FileEve from './eve-modules/file-eve';
import YoutubeEve from './eve-modules/youtube-eve';
import ColpickEve from './eve-modules/colpick-eve';
import ThreeEve from './eve-modules/three-eve';
import OekakiEve from './eve-modules/oekaki-eve';

const EventEve = (D => {
  function Event() {
    this.common = new CommonEve();
    this.canvas = new CanvasEve();
    this.plain = new PlainEve();
    this.zoom = new ZoomEve();
    this.file = new FileEve();
    this.youtube = new YoutubeEve();
    this.colpick = new ColpickEve();
    this.three = new ThreeEve();
    this.oekaki = new OekakiEve(D.getElementById('color-oekaki'));
  }

  const modules = {};

  Event.prototype = Object.assign(modules, {
    constructor: Event,

    options: {},

    load() {
      this.mouseDownEvent();
      this.mouseUpEvent();
      this.mouseMoveEvent();
    },

    //

    mouseDownEvent() {
      D.addEventListener('mousedown', () => {}, false);
    },

    //

    mouseUpEvent() {
      D.addEventListener('mouseup', () => {}, false);
    },

    //

    mouseMoveEvent() {
      D.addEventListener('mousemove', () => {}, false);
    }
  });

  return Event;
})(document);

export default EventEve;
