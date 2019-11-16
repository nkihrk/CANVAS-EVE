/**
 *
 * Drawing app for CANVAS EVE.
 *
 * Dependencies
 * - jquery-eve
 * - glb-eve
 * - lib-eve
 * - plain-eve
 * - zoom-eve
 *
 */

import $ from '../common/jquery-eve';
import GlbEve from '../common/glb-eve';
import FlgEve from '../common/flg-eve';
import LibEve from '../common/lib-eve';
import PlainEve from './plain-eve';
import ZoomEve from './zoom-eve';

const OekakiEve = ((W, D, M) => {
  function Oekaki(container) {
    const size = container.clientWidth;
    const wheelRadius = size / 2;
    const wheelThickness = (size / 2) * 0.15;
    const wheelInnerRadius = wheelRadius - wheelThickness;
    const triangleRadius = (wheelRadius - wheelThickness) * 0.9;
    const originX = $(container).offset().left;
    const originY = $(container).offset().top;
    // centerX and centerY are screen-space coordinates of the center position of its container
    const centerX = originX + size / 2;
    const centerY = originY + size / 2;

    this.Plain = new PlainEve(D.getElementById('c-oekaki-plain'));
    this.Zoom = new ZoomEve(D.getElementById('c-oekaki-zoom'));

    this.$cOekaki = $('#c-oekaki');
    this.$cOekaki.css({
      width: `${this.options.CANVAS_SIZE}px`,
      height: `${this.options.CANVAS_SIZE}px`
    });
    this.$cOekakiPlain = $('#c-oekaki-plain');
    this.$plain = $('#plain');

    this.param = {
      container: container,
      size: size,
      centerPos: {
        x: centerX,
        y: centerY
      },
      color: {
        hue: this.options.HUE,
        rgb: this.options.RGB
      }
    };

    this.colorWheel = {
      radius: wheelRadius,
      innerRadius: wheelInnerRadius,
      thickness: wheelThickness
    };

    this.colorTriangle = {
      radius: triangleRadius,
      circlePos: {
        x: M.cos((M.PI * 2) / 3) * triangleRadius + size / 2,
        y: M.sin((M.PI * 2) / 3) * triangleRadius + size / 2
      }
    };

    this.oekakiParam = {
      lastBrushPos: {
        x: 0,
        y: 0
      },
      isDrawing: false,
      useTilt: false,
      EPenButton: {
        tip: 0x1, // left mouse, touch contact, pen contact
        barrel: 0x2, // right mouse, pen barrel button
        middle: 0x4, // middle mouse
        eraser: 0x20 // pen eraser button
      }
    };

    this.flgs = {
      cOekaki: {
        draw_canvas_avail_flg: false
      },
      oekaki: {
        move_wheelcircle_flg: false,
        move_trianglecircle_flg: false
      }
    };

    this.drawPointerEvents = [
      'pointerdown',
      'pointerup',
      'pointercancel',
      'pointermove',
      'pointerover',
      'pointerout',
      'pointerenter',
      'pointerleave',
      'gotpointercapture',
      'lostpointercapture'
    ];
    this.drawEvents = [
      'MSPointerDown',
      'MSPointerUp',
      'MSPointerCancel',
      'MSPointerMove',
      'MSPointerOver',
      'MSPointerOut',
      'MSPointerEnter',
      'MSPointerLeave',
      'MSGotPointerCapture',
      'MSLostPointerCapture',
      'touchstart',
      'touchmove',
      'touchend',
      'touchenter',
      'touchleave',
      'touchcancel',
      'mouseover',
      'mousemove',
      'mouseout',
      'mouseenter',
      'mouseleave',
      'mousedown',
      'mouseup',
      'focus',
      'blur',
      'click',
      'webkitmouseforcewillbegin',
      'webkitmouseforcedown',
      'webkitmouseforceup',
      'webkitmouseforcechanged'
    ];
  }

  const modules = {};

  Oekaki.prototype = Object.assign(modules, {
    constructor: Oekaki,

    options: {
      HUE: 0,
      RGB: [0, 0, 0],
      THETA: 0,
      BRUSH_SIZE: 4 / 2,
      ERASER_SIZE: 30 / 2,
      CANVAS_SIZE: 10000,
      CANVAS_RESOLUTION: 5000,
      CANVAS_RATIO: 2, // CANVAS_SIZE / CANVAS_RESOLUTION
      CANVAS_COLOR: '#f0e0d6',
      RESET_CANVAS_COLOR: '#32303f',
      CREATE_CANVAS_DELAY: 200, // Currently not in use
      BUTTON_FOR_LEFT: 0,
      BUTTON_FOR_MIDDLE: 1,
      BUTTON_FOR_RIGHT: 2
    },

    load() {
      this.Plain.load();
      this.Zoom.load();
      this.drawWheel();
      this.drawTriangle();
      this.drawEvent();
    },

    //

    mouseDownEvent(e) {
      this.Plain.mouseDownEvent(e);
      this._setFlgs(e);
      this._handleEventMouseDown(e);
    },

    //

    mouseUpEvent() {
      this.Plain.mouseUpEvent();
      this._resetFlgs();
    },

    //

    mouseMoveEvent(e) {
      this.Plain.mouseMoveEvent(e);
      this._handleEventMouseMove(e);
    },

    //

    mouseWheelEvent(e) {
      this.Zoom.mouseWheelEvent(e);
    },

    //

    drawEvent() {
      if (W.PointerEvent) {
        for (let i = 0; i < this.drawPointerEvents.length; i++) {
          D.addEventListener(
            this.drawPointerEvents[i],
            e => {
              this._drawPointerEvents(e);
            },
            false
          );
        }
      } else {
        for (let i = 0; i < this.drawEvents.length; i++) {
          D.addEventListener(
            this.drawEvents[i],
            () => {
              // this._drawEvents(e);
            },
            false
          );
        }
      }
    },

    //

    _setFlgs(e) {
      if (e.target.closest('#color-oekaki')) {
        const isWheelArea = this._isWheelArea(e);
        const isTriangleArea = this._isTriangleArea(e);
        if (isWheelArea) this.flgs.oekaki.move_wheelcircle_flg = true;
        if (isTriangleArea) this.flgs.oekaki.move_trianglecircle_flg = true;
      }

      if (e.target.closest('#color-wheel-circle'))
        this.flgs.oekaki.move_wheelcircle_flg = true;

      if (e.target.closest('#color-triangle-circle'))
        this.flgs.oekaki.move_trianglecircle_flg = true;
    },

    //

    _resetFlgs() {
      if (this.flgs.oekaki.move_wheelcircle_flg === true)
        this.flgs.oekaki.move_wheelcircle_flg = false;
      if (this.flgs.oekaki.move_trianglecircle_flg === true)
        this.flgs.oekaki.move_trianglecircle_flg = false;
    },

    //

    _handleEventMouseDown(e) {
      if (
        e.target.closest('#color-oekaki') &&
        e.button === this.options.BUTTON_FOR_RIGHT
      ) {
        this._colorWheelArea(e);
        this._colorTriangleArea(e);
      }
    },

    //

    _handleEventMouseMove(e) {
      const originX = $(this.param.container).offset().left;
      const originY = $(this.param.container).offset().top;
      const centerX = originX + this.param.size / 2;
      const centerY = originY + this.param.size / 2;
      this.param.centerPos.x = centerX;
      this.param.centerPos.y = centerY;

      if (e.buttons === this.options.BUTTON_FOR_RIGHT) {
        if (this.flgs.oekaki.move_wheelcircle_flg === true)
          this._updateWheelCircle(e);
        if (this.flgs.oekaki.move_trianglecircle_flg === true)
          this._updateTriangleCircle(e);
      }
    },

    //

    _drawPointerEvents(e) {
      if (
        FlgEve.oekaki.tools.brush_flg === true ||
        FlgEve.oekaki.tools.eraser_flg === true
      ) {
        const $canvas = this.$cOekaki;
        this._drawCanvasPointer($canvas, e);
      }
    },

    //

    _drawEvents(e) {
      if (
        FlgEve.oekaki.tools.brush_flg === true ||
        FlgEve.oekaki.tools.eraser_flg === true
      ) {
        if (
          e.target.closest('.oekaki-canvas') ||
          e.target.closest('.selected')
        ) {
          const $canvas = $(e.target)
            .parents('.file-wrap')
            .find('canvas');
          this._drawCanvas($canvas, e);
        }
      }
    },

    /**
     * Color wheel
     *
     */
    drawWheel() {
      const resolution = 1;
      const outerRadius = 100;
      const innerRadius =
        outerRadius -
        (this.colorWheel.thickness / this.colorWheel.radius) * 100;
      const root = D.getElementById('color-wheel');

      this._createWheelCircle();
      this._generateConicGradiant(outerRadius, resolution, root);
      this._generateOverlay(outerRadius, innerRadius, root);
    },

    //

    _generateOverlay(outerRadius, innerRadius, target) {
      const circle = D.createElementNS('http://www.w3.org/2000/svg', 'circle');

      circle.setAttribute('cx', outerRadius);
      circle.setAttribute('cy', outerRadius);
      circle.setAttribute('r', innerRadius);
      circle.setAttribute('fill', '#262533');

      target.appendChild(circle);
    },

    //

    _generateConicGradiant(radius, resolution, target) {
      for (let i = 0; i < 360 * resolution; i++) {
        const path = D.createElementNS('http://www.w3.org/2000/svg', 'path');

        path.setAttribute(
          'd',
          this._describeArc(
            radius,
            radius,
            radius,
            i / resolution,
            (i + 2) / resolution
          )
        );
        path.setAttribute('fill', `hsl(${i / resolution}, 100%, 50%)`);

        target.appendChild(path);
      }
    },

    //

    _describeArc(x, y, radius, startAngle, endAngle) {
      const start = this._polar2Cartesian(x, y, radius, endAngle);
      const end = this._polar2Cartesian(x, y, radius, startAngle);

      const arcSweep = endAngle - startAngle <= 180 ? '0' : '1';

      const setD = [
        'M',
        start.x,
        start.y,
        'A',
        radius,
        radius,
        0,
        arcSweep,
        0,
        end.x,
        end.y,
        'L',
        x,
        y,
        'L',
        start.x,
        start.y
      ].join(' ');

      return setD;
    },

    //

    _polar2Cartesian(centerX, centerY, radius, angleInDegrees) {
      const angleInRadians = ((angleInDegrees - 90) * M.PI) / 180.0;

      return {
        x: centerX + radius * M.cos(angleInRadians),
        y: centerY + radius * M.sin(angleInRadians)
      };
    },

    //

    _createWheelCircle() {
      const wheelCircle = D.createElement('div');
      const r = this.colorWheel.innerRadius + this.colorWheel.thickness / 2;
      const left =
        r * M.cos(this.options.THETA + (3 / 2) * M.PI) + this.param.size / 2;
      const top =
        r * M.sin(this.options.THETA + (3 / 2) * M.PI) + this.param.size / 2;

      wheelCircle.id = 'color-wheel-circle';
      wheelCircle.style.left = `${left}px`;
      wheelCircle.style.top = `${top}px`;
      wheelCircle.style.backgroundColor = `hsla(${M.round(
        this.options.HUE
      )}, 100%, 50%, 1)`;

      this.wheelCircle = wheelCircle;
      this.param.container.appendChild(wheelCircle);
    },

    //

    _colorWheelArea(e) {
      const isWheelArea = this._isWheelArea(e);
      if (isWheelArea) this._updateWheelCircle(e);
    },

    //

    _isWheelArea(e) {
      const minR = this.colorWheel.innerRadius;
      const maxR = this.colorWheel.radius;
      const mouseR = LibEve.getDistance(
        this.param.centerPos.x,
        this.param.centerPos.y,
        e.clientX,
        e.clientY
      );

      if (mouseR > minR && maxR > mouseR) return true;
      return false;
    },

    //

    _updateWheelCircle(e) {
      const pointer = this.wheelCircle;
      const r = this.colorWheel.innerRadius + this.colorWheel.thickness / 2;
      const theta = this._calculateTheta(e);
      const left = r * M.cos(theta) + this.param.size / 2;
      const top = r * M.sin(theta) + this.param.size / 2;
      pointer.style.left = `${left}px`;
      pointer.style.top = `${top}px`;

      const hue = this._calculateHue(e);
      this.param.color.hue = hue;
      this._updateTriangle(e);

      $('#color-wheel-circle').css(
        'background-color',
        `hsla(${M.round(this.param.color.hue)}, 100%, 50%, 1)`
      );
    },

    //

    _calculateTheta(e) {
      const rad =
        (M.atan2(
          e.clientY - this.param.centerPos.y,
          e.clientX - this.param.centerPos.x
        ) /
          M.PI) *
          180 +
        (M.atan2(
          e.clientY - this.param.centerPos.y,
          e.clientX - this.param.centerPos.x
        ) > 0
          ? 0
          : 360);

      return (rad / 180) * M.PI;
    },

    //

    _calculateHue(e) {
      const deg =
        (M.atan2(
          e.clientY - this.param.centerPos.y,
          e.clientX - this.param.centerPos.x
        ) /
          M.PI) *
          180 +
        90 +
        ((M.atan2(
          e.clientY - this.param.centerPos.y,
          e.clientX - this.param.centerPos.x
        ) /
          M.PI) *
          180 +
          90 >
        0
          ? 0
          : 360);

      return deg;
    },

    /**
     * Color triangle
     *
     */
    drawTriangle() {
      this._createTriangle();
      this._createTriangleCircle();
      this._initTriangle();
      this._getTriangleColor();
    },

    _initTriangle() {
      const ctx = this.triangleCtx;

      const leftTopX = M.cos((M.PI * 2) / 3) * this.colorTriangle.radius;
      const leftTopY = M.sin((M.PI * 2) / 3) * this.colorTriangle.radius;

      ctx.clearRect(0, 0, this.param.size, this.param.size);
      ctx.save();
      ctx.translate(this.colorWheel.radius, this.colorWheel.radius);

      ctx.beginPath();
      ctx.moveTo(leftTopX, leftTopY);
      ctx.lineTo(this.colorTriangle.radius, 0);
      ctx.lineTo(leftTopX, -leftTopY);
      ctx.closePath();
      ctx.stroke();
      ctx.clip();
      ctx.fillRect(
        -this.colorWheel.radius,
        -this.colorWheel.radius,
        this.param.size,
        this.param.size
      );

      const grad0 = ctx.createLinearGradient(
        this.colorTriangle.radius,
        0,
        leftTopX,
        0
      );
      const hsla = `hsla(${M.round(this.param.color.hue)}, 100%, 50%, `;
      grad0.addColorStop(0, `${hsla}1)`);
      grad0.addColorStop(1, `${hsla}0)`);
      ctx.fillStyle = grad0;
      ctx.fillRect(
        -this.colorWheel.radius,
        -this.colorWheel.radius,
        this.param.size,
        this.param.size
      );

      const grad1 = ctx.createLinearGradient(
        leftTopX,
        -leftTopY,
        (leftTopX + this.colorTriangle.radius) / 2,
        leftTopY / 2
      );
      grad1.addColorStop(0.0, 'rgba(255, 255, 255, 1)');
      grad1.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = grad1;
      ctx.fillRect(
        -this.colorWheel.radius,
        -this.colorWheel.radius,
        this.param.size,
        this.param.size
      );

      ctx.restore();
    },

    //

    _updateTriangle() {
      this._initTriangle();
      this._setRgb('#color-triangle-circle');
    },

    //

    _createTriangle() {
      const c = D.createElement('canvas');
      c.id = 'color-triangle';
      c.width = this.param.size;
      c.height = this.param.size;
      const triangleCtx = c.getContext('2d');

      this.triangleCtx = triangleCtx;
      this.param.container.appendChild(c);
    },

    //

    _createTriangleCircle() {
      const triangleCircle = D.createElement('div');
      triangleCircle.id = 'color-triangle-circle';
      triangleCircle.style.left = `${this.colorTriangle.circlePos.x}px`;
      triangleCircle.style.top = `${this.colorTriangle.circlePos.y}px`;

      this.triangleCircle = triangleCircle;
      this.param.container.appendChild(triangleCircle);
      this._setRgb('#color-triangle-circle');
    },

    //

    _colorTriangleArea(e) {
      const isTriangleArea = this._isTriangleArea(e);
      if (isTriangleArea) this._updateTriangleCircle(e);
    },

    //

    _isTriangleArea(e) {
      const mouseX = e.clientX - this.param.centerPos.x;
      const mouseY = e.clientY - this.param.centerPos.y;
      const minX = M.cos((M.PI * 2) / 3) * this.colorTriangle.radius;
      const maxX = this.colorTriangle.radius;
      const maxY = (-mouseX + maxX) / M.sqrt(3);

      if (mouseX > minX && maxX > mouseX) {
        if (M.abs(mouseY) >= 0 && maxY >= M.abs(mouseY)) return true;
      }
      return false;
    },

    //

    _updateTriangleCircle(e) {
      const mouseX = e.clientX - this.param.centerPos.x;
      const mouseY = e.clientY - this.param.centerPos.y;

      const minX = M.cos((M.PI * 2) / 3) * this.colorTriangle.radius;
      const maxX = this.colorTriangle.radius;
      let minY = (mouseX - maxX) / M.sqrt(3);
      let maxY = (-mouseX + maxX) / M.sqrt(3);
      minY =
        mouseX <= minX
          ? -M.sin((M.PI * 2) / 3) * this.colorTriangle.radius
          : minY;
      maxY =
        mouseX <= minX
          ? M.sin((M.PI * 2) / 3) * this.colorTriangle.radius
          : maxY;

      const pointer = this.triangleCircle;
      const $container = $(this.param.container);
      const parentNodeX = $container.offset().left;
      const parentNodeY = $container.offset().top;
      const left = e.clientX - parentNodeX;
      const top = e.clientY - parentNodeY;

      if (minX < mouseX && mouseX < maxX) {
        pointer.style.left = `${left}px`;
        if (mouseY >= maxY) {
          pointer.style.top = `${maxY + this.param.size / 2}px`;
        } else if (minY >= mouseY) {
          pointer.style.top = `${minY + this.param.size / 2}px`;
        } else {
          pointer.style.top = `${top}px`;
        }
      } else if (mouseX <= minX) {
        pointer.style.left = `${minX + this.param.size / 2}px`;
        if (maxY <= mouseY) {
          pointer.style.top = `${maxY + this.param.size / 2}px`;
        } else if (mouseY <= minY) {
          pointer.style.top = `${minY + this.param.size / 2}px`;
        } else {
          pointer.style.top = `${top}px`;
        }
      } else if (maxX <= mouseX) {
        pointer.style.left = `${maxX + this.param.size / 2}px`;
        pointer.style.top = `${this.param.size / 2}px`;
      }

      this.colorTriangle.circlePos.x = pointer.style.left.replace('px', '');
      this.colorTriangle.circlePos.y = pointer.style.top.replace('px', '');
      this._setRgb('#color-triangle-circle');
    },

    //

    _setRgb(target) {
      const rgb = this._getTriangleColor();
      const r = rgb[0];
      const g = rgb[1];
      const b = rgb[2];

      this.param.color.rgb = [r, g, b];
      $(target).css('background-color', `rgb(${r},${g},${b})`);
    },

    //

    _getRgba(x, y) {
      const ctx = this.triangleCtx;
      const imagedata = ctx.getImageData(x, y, 1, 1);
      const r = imagedata.data[0];
      const g = imagedata.data[1];
      const b = imagedata.data[2];
      const a = imagedata.data[3];

      return [r, g, b, a];
    },

    //

    _getTriangleColor() {
      const x = this.colorTriangle.circlePos.x - this.param.size / 2;
      const y = this.colorTriangle.circlePos.y - this.param.size / 2;
      const leftTopX = M.cos((M.PI * 2) / 3) * this.colorTriangle.radius;
      const leftTopY = M.sin((M.PI * 2) / 3) * this.colorTriangle.radius;
      const a =
        -M.tan(M.PI / 6) * x - y - leftTopY + M.tan(M.PI / 6) * leftTopX;
      const k = M.abs(a) * M.sin(M.PI / 3);
      const l = (this.colorTriangle.radius * 3) / 2;

      const hsl = [this.param.color.hue / 360, 1.0, 0.5];
      const b = LibEve.hsl2rgb(hsl);
      const s = [255, 255, 255];

      const co = [];
      let tmp;
      for (let i = 0; i < 3; i++) {
        tmp =
          (s[i] * (l - k)) / l +
          (b[i] * (l - (this.colorTriangle.radius - x))) / l;
        tmp = M.abs(M.round(tmp));
        co.push(tmp);
      }

      return co;
    },

    //

    _drawCanvasPointer($canvas, e) {
      const ctx = $canvas[0].getContext('2d');
      const canvasRect = $canvas[0].getBoundingClientRect();

      if (this.flgs.cOekaki.draw_canvas_avail_flg === false) {
        this._initCanvas(ctx);
        this.flgs.cOekaki.draw_canvas_avail_flg = true;
      }

      const screenPos = {
        x: e.clientX,
        y: e.clientY
      };
      const pos = {
        x: M.floor(
          ((screenPos.x - canvasRect.left) * GlbEve.MOUSE_WHEEL_VAL) /
            this.options.CANVAS_RATIO
        ),
        y: M.floor(
          ((screenPos.y - canvasRect.top) * GlbEve.MOUSE_WHEEL_VAL) /
            this.options.CANVAS_RATIO
        )
      };

      let pressure = this.options.BRUSH_SIZE;
      // const rotate = e.twist;

      const brushColor = `rgba(${this.param.color.rgb[0]},${
        this.param.color.rgb[1]
      },${this.param.color.rgb[2]},1.0)`;

      if (e.pointerType) {
        switch (e.pointerType) {
          case 'touch':
            // pressure = 1.0;
            ctx.strokeStyle = brushColor;
            ctx.lineWidth = pressure;
            break;

          case 'pen':
            ctx.strokeStyle = brushColor;
            ctx.lineWidth = pressure;
            // if (this.oekakiParam.useTilt) {
            //     ctx.lineWidth = pressure * 3 * M.abs(this.tilt.x);
            // } else {
            //     ctx.lineWidth = pressure * 10;
            // }
            break;

          case 'mouse':
            ctx.strokeStyle = brushColor;
            ctx.lineWidth = pressure;
            if (
              e.buttons === this.oekakiParam.EPenButton.barrel ||
              e.buttons === this.oekakiParam.EPenButton.middle
            ) {
              pressure = 0;
              ctx.lineWidth = 0;
            }
            break;

          default:
            break;
        }

        if (
          FlgEve.oekaki.tools.eraser_flg === true ||
          e.buttons === this.oekakiParam.EPenButton.eraser
        ) {
          ctx.lineWidth = this.options.ERASER_SIZE;
          ctx.globalCompositeOperation = 'destination-out';
        } else {
          ctx.globalCompositeOperation = 'source-over';
        }

        switch (e.type) {
          case 'pointerdown':
            this.oekakiParam.isDrawing = true;
            this.oekakiParam.lastBrushPos = pos;
            break;

          case 'pointerup':
            this.oekakiParam.isDrawing = false;
            break;

          case 'pointermove':
            if (!this.oekakiParam.isDrawing) {
              return;
            }

            if (pressure > 0) {
              ctx.beginPath();
              ctx.lineCap = 'round';
              ctx.moveTo(
                this.oekakiParam.lastBrushPos.x,
                this.oekakiParam.lastBrushPos.y
              );

              const midPoint = this._midPointBetween(
                this.oekakiParam.lastBrushPos,
                pos
              );
              ctx.quadraticCurveTo(
                this.oekakiParam.lastBrushPos.x,
                this.oekakiParam.lastBrushPos.y,
                midPoint.x,
                midPoint.y
              );

              ctx.lineTo(pos.x, pos.y);
              ctx.stroke();
            }

            this.oekakiParam.lastBrushPos = pos;
            break;

          // case 'pointerenter':
          //   D.body.style.cursor = 'crosshair';
          //   break;

          // case 'pointerleave':
          //   D.body.style.cursor = 'default';
          //   break;

          default:
            break;
        }
      }
    },

    //

    _drawCanvas($canvas, e) {
      const ctx = $canvas[0].getContext('2d');
      const canvasRect = $canvas.getBoundingClientRect();
      const screenPos = {
        x: e.clientX,
        y: e.clientY
      };

      const pos = {
        x:
          ((screenPos.x - canvasRect.left) * GlbEve.MOUSE_WHEEL_VAL) /
          this.options.CANVAS_RATIO,
        y:
          ((screenPos.y - canvasRect.top) * GlbEve.MOUSE_WHEEL_VAL) /
          this.options.CANVAS_RATIO
      };

      if (pos.x === undefined || pos.y === undefined) {
        console.log('WARNING: undefined position');
        return;
      }

      const pressure = this.options.BRUSH_SIZE;

      switch (e.type) {
        case 'mousedown':
        case 'MSPointerDown':
        case 'touchStart':
          this.oekakiParam.isDrawing = true;
          this.oekakiParam.lastBrushPos = pos;
          break;

        case 'mouseup':
        case 'MSPointerUp':
        case 'touchEnd':
          this.oekakiParam.isDrawing = false;
          break;

        case 'mousemove':
        case 'MSPointerMove':
        case 'touchmove':
          if (this.oekakiParam.isDrawing) {
            ctx.lineWidth = pressure;

            ctx.beginPath();
            ctx.lineCap = 'round';
            ctx.moveTo(
              this.oekakiParam.lastBrushPos.x,
              this.oekakiParam.lastBrushPos.y
            );

            const { midPoint } = this._midPointBetween(
              this.oekakiParam.lastBrushPos,
              pos
            );
            ctx.quadraticCurveTo(
              this.oekakiParam.lastBrushPos.x,
              this.oekakiParam.lastBrushPos.y,
              midPoint.x,
              midPoint.y
            );

            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
          }

          this.oekakiParam.lastBrushPos = pos;
          break;

        default:
          break;
      }
    },

    //

    _initCanvas(ctx) {
      const width = this.options.CANVAS_RESOLUTION;
      const height = this.options.CANVAS_RESOLUTION;
      ctx.canvas.width = width;
      ctx.canvas.height = height;
    },

    //

    _midPointBetween(p1, p2) {
      return {
        x: p1.x + (p2.x - p1.x) / 2,
        y: p1.y + (p2.y - p1.y) / 2
      };
    }
  });

  return Oekaki;
})(window, document, Math);

export default OekakiEve;
