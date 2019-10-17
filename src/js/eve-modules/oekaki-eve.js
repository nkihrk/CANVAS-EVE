/**
 *
 * Drawing app for CANVAS EVE.
 *
 * Dependencies
 * - jQuery 3.4.1
 * - glb-eve
 * - lib-eve
 *
 */

import $ from 'jquery';

import GlbEve from '../common/glb-eve';
import LibEve from '../common/lib-eve';

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

    LibEve.call(this);

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

    this.canvas = {
      newCanvasPos: {
        x: null,
        y: null
      },
      $newCanvasId: null,
      $canvasId: null
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
      newcanvas: {
        newcanvas_flg: false,
        create_canvas_avail_flg: false
      },
      brush: {
        brush_flg: false,
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

  const modules = { ...LibEve.prototype };

  Oekaki.prototype = Object.assign(modules, {
    constructor: Oekaki,

    options: {
      HUE: 0,
      RGB: [0, 0, 0],
      THETA: 0,
      BRUSH_SIZE: 4,
      ERASER_SIZE: 30,
      CANVAS_COLOR: '#f0e0d6'
    },

    load() {
      this.drawWheel();
      this.drawTriangle();
      this.setFlgs();
      this.resetFlgs();
      this.handleEvents();
    },

    setFlgs() {
      D.addEventListener(
        'mousedown',
        e => {
          if (e.target) {
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

            if (e.target.closest('#reset-res')) {
              if (this.flgs.newcanvas.newcanvas_flg === true) {
                this.flgs.newcanvas.create_canvas_avail_flg = true;
                this.canvas.newCanvasPos.x = e.clientX - $('#zoom').offset().left;
                this.canvas.newCanvasPos.y = e.clientY - $('#zoom').offset().top;
                this._createCanvasWrapper();
              }
            }

            if (e.target.closest('.oekaki-canvas')) {
              if (this.flgs.brush.brush_flg === true) this.flgs.brush.draw_canvas_avail_flg = true;
            }
          }
        },
        false
      );
    },

    //

    resetFlgs() {
      D.addEventListener(
        'mouseup',
        () => {
          if (this.flgs.oekaki.move_wheelcircle_flg === true)
            this.flgs.oekaki.move_wheelcircle_flg = false;
          if (this.flgs.oekaki.move_trianglecircle_flg === true)
            this.flgs.oekaki.move_trianglecircle_flg = false;

          if (this.flgs.newcanvas.create_canvas_avail_flg === true) {
            this.flgs.newcanvas.create_canvas_avail_flg = false;
            this._createCanvas();
          }
        },
        false
      );
    },

    //

    handleEvents() {
      D.addEventListener(
        'mousedown',
        e => {
          if (e.target) {
            if (e.target.closest('#color-oekaki')) {
              this._colorWheelArea(e);
              this._colorTriangleArea(e);
            }

            if (
              [
                '#newcanvas-oekaki',
                '#brush-oekaki',
                '#eraser-oekaki',
                '#spuit-oekaki',
                '#filldrip-oekaki'
              ].indexOf(`#${e.target.getAttribute('id')}`) !== -1
            ) {
              this._toggleTool($(e.target), e);
            }
          }
        },
        false
      );

      D.addEventListener(
        'mousemove',
        e => {
          e.stopPropagation();
          e.preventDefault();

          if (e.target) {
            const originX = $(this.param.container).offset().left;
            const originY = $(this.param.container).offset().top;
            const centerX = originX + this.param.size / 2;
            const centerY = originY + this.param.size / 2;
            this.param.centerPos.x = centerX;
            this.param.centerPos.y = centerY;

            if (this.flgs.oekaki.move_wheelcircle_flg === true) this._updateWheelCircle(e);
            if (this.flgs.oekaki.move_trianglecircle_flg === true) this._updateTriangleCircle(e);

            if (this.flgs.newcanvas.create_canvas_avail_flg === true) this._updateCanvasVal(e);
          }
        },
        false
      );

      if (W.PointerEvent) {
        for (let i = 0; i < this.drawPointerEvents.length; i++) {
          D.addEventListener(
            this.drawPointerEvents[i],
            e => {
              if (this.flgs.brush.brush_flg === true) {
                if (e.target.closest('.oekaki-canvas')) {
                  const $canvas = $(e.target);
                  this._drawCanvasPointer($canvas, e);
                }
              }
            },
            false
          );
        }
      } else {
        for (let i = 0; i < this.drawEvents.length; i++) {
          D.addEventListener(
            this.drawEvents[i],
            e => {
              if (e.target && this.flgs.brush.brush_flg === true) {
                if (e.target.closest('.oekaki-canvas')) {
                  const $canvas = $(e.target);
                  this._drawCanvas($canvas, e);
                }
              }
            },
            false
          );
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
      const innerRadius = outerRadius - (this.colorWheel.thickness / this.colorWheel.radius) * 100;
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
          this._describeArc(radius, radius, radius, i / resolution, (i + 2) / resolution)
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
      const left = r * M.cos(this.options.THETA + (3 / 2) * M.PI) + this.param.size / 2;
      const top = r * M.sin(this.options.THETA + (3 / 2) * M.PI) + this.param.size / 2;

      wheelCircle.id = 'color-wheel-circle';
      wheelCircle.style.left = `${left}px`;
      wheelCircle.style.top = `${top}px`;

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
      const mouseR = this.getDistance(
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
    },

    //

    _calculateTheta(e) {
      const rad =
        (M.atan2(e.clientY - this.param.centerPos.y, e.clientX - this.param.centerPos.x) / M.PI) *
          180 +
        (M.atan2(e.clientY - this.param.centerPos.y, e.clientX - this.param.centerPos.x) > 0
          ? 0
          : 360);

      return (rad / 180) * M.PI;
    },

    //

    _calculateHue(e) {
      const deg =
        (M.atan2(e.clientY - this.param.centerPos.y, e.clientX - this.param.centerPos.x) / M.PI) *
          180 +
        90 +
        ((M.atan2(e.clientY - this.param.centerPos.y, e.clientX - this.param.centerPos.x) / M.PI) *
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

      const grad0 = ctx.createLinearGradient(this.colorTriangle.radius, 0, leftTopX, 0);
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
      this._setRgb('#test-oekaki');
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
    },

    //

    _colorTriangleArea(e) {
      const isTriangleArea = this._isTriangleArea(e);
      if (isTriangleArea) {
        this._updateTriangleCircle(e);
      }
    },

    //

    _isTriangleArea(e) {
      const mouseX = e.clientX - this.param.centerPos.x;
      const mouseY = e.clientY - this.param.centerPos.y;
      const minX = M.cos((M.PI * 2) / 3) * this.colorTriangle.radius;
      const maxX = this.colorTriangle.radius;
      const maxY = (-mouseX + maxX) / M.sqrt(3);

      if (mouseX > minX && maxX > mouseX) {
        if (M.abs(mouseY) >= 0 && maxY >= M.abs(mouseY)) {
          return true;
        }
        return false;
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
      minY = mouseX <= minX ? -M.sin((M.PI * 2) / 3) * this.colorTriangle.radius : minY;
      maxY = mouseX <= minX ? M.sin((M.PI * 2) / 3) * this.colorTriangle.radius : maxY;

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
      this._setRgb('#test-oekaki');
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
      const a = -M.tan(M.PI / 6) * x - y - leftTopY + M.tan(M.PI / 6) * leftTopX;
      const k = M.abs(a) * M.sin(M.PI / 3);
      const l = (this.colorTriangle.radius * 3) / 2;

      const hsl = [this.param.color.hue / 360, 1.0, 0.5];
      const b = this.hsl2rgb(hsl);
      const s = [255, 255, 255];

      const co = [];
      let tmp;
      for (let i = 0; i < 3; i++) {
        tmp = (s[i] * (l - k)) / l + (b[i] * (l - (this.colorTriangle.radius - x))) / l;
        tmp = M.abs(M.round(tmp));
        co.push(tmp);
      }

      return co;
    },

    /**
     * Toggling tools
     *
     */
    _toggleTool($container, e) {
      if (e.button !== 1) {
        e.stopPropagation();
        $container.toggleClass('active');

        if (
          this.__$toggleButton !== undefined &&
          this.__$toggleButton[0] !== $container[0] &&
          this.__$toggleButton.hasClass('active')
        ) {
          this.__$toggleButton.removeClass('active');
        }
        if ($container.hasClass('active')) this.__$toggleButton = $container;

        if ($container.hasClass('active') && $container.attr('id') === 'newcanvas-oekaki') {
          this.flgs.newcanvas.newcanvas_flg = true;
        } else {
          this.flgs.newcanvas.newcanvas_flg = false;
        }

        if ($container.hasClass('active') && $container.attr('id') === 'brush-oekaki') {
          this.flgs.brush.brush_flg = true;
        } else {
          this.flgs.brush.brush_flg = false;
        }
      }
    },

    /**
     * Canvas
     *
     */
    _createCanvasWrapper() {
      const startX = this.canvas.newCanvasPos.x;
      const startY = this.canvas.newCanvasPos.y;

      GlbEve.NEWFILE_ID += 1;
      GlbEve.HIGHEST_Z_INDEX += 1;

      const funcTags =
        '<div class="thumbtack-wrapper"></div>' +
        '<div class="resize-wrapper"></div>' +
        '<div class="flip-wrapper"></div>' +
        '<div class="trash-wrapper"></div>';
      const assertFile =
        `<div id ="${GlbEve.NEWFILE_ID}" class="file-wrap selected-dot oekaki-canvas" style="transition: ${GlbEve.IS_TRANSITION};">` +
        `<div class="function-wrapper">${funcTags}</div>` +
        '<div class="eve-main is-flipped"></div>' +
        '</div>';
      $('#add-files').append(assertFile);

      const fileId = `#${GlbEve.NEWFILE_ID}`;
      const $fileId = $(fileId);

      $fileId.css({
        left: `${startX * GlbEve.MOUSE_WHEEL_VAL}px`,
        top: `${startY * GlbEve.MOUSE_WHEEL_VAL}px`,
        transform: 'translate(0, 0)',
        'z-index': GlbEve.HIGHEST_Z_INDEX
      });

      // // For colpick-eve.js
      // if ($('#toggle-colpick').length > 0) {
      //     if (!$('#toggle-colpick').hasClass('active')) {
      //         $fileId.addClass('grab-pointer');
      //     }
      // } else {
      //     $fileId.addClass('grab-pointer');
      // }

      this.canvas.$newCanvasId = $fileId;
    },

    //

    _updateCanvasVal(e) {
      const $canvas = this.canvas.$newCanvasId;
      const startX = this.canvas.newCanvasPos.x;
      const startY = this.canvas.newCanvasPos.y;
      const endX = e.clientX - $('#zoom').offset().left;
      const endY = e.clientY - $('#zoom').offset().top;

      const resultX = M.abs(endX - startX);
      const resultY = M.abs(endY - startY);

      $canvas.css({
        width: `${resultX * GlbEve.MOUSE_WHEEL_VAL}px`,
        height: `${resultY * GlbEve.MOUSE_WHEEL_VAL}px`
      });
    },

    //

    _createCanvas() {
      const $newCanvas = this.canvas.$newCanvasId;
      const c = D.createElement('canvas');
      const width = $newCanvas.width();
      const height = $newCanvas.height();

      c.width = width;
      c.height = height;

      const ctx = c.getContext('2d');
      ctx.canvas.style.touchAction = 'none';
      ctx.fillStyle = this.options.CANVAS_COLOR;
      ctx.fillRect(0, 0, width, height);

      $newCanvas.find('.eve-main').append(c);
      $newCanvas.removeClass('selected-dot');
    },

    //

    _drawCanvasPointer($canvas, e) {
      const ctx = $canvas[0].getContext('2d');
      const canvasRect = $canvas[0].getBoundingClientRect();

      const screenPos = {
        x: e.clientX,
        y: e.clientY
      };
      const pos = {
        x: (screenPos.x - canvasRect.left) * GlbEve.MOUSE_WHEEL_VAL,
        y: (screenPos.y - canvasRect.top) * GlbEve.MOUSE_WHEEL_VAL
      };

      let pressure = this.options.BRUSH_SIZE;
      // const rotate = e.twist;

      const brushColor = `rgba(${this.param.color.rgb[0]},${this.param.color.rgb[1]},${
        this.param.color.rgb[2]
      },1.0)`;
      const colorBackground = this.options.CANVAS_COLOR;

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

        if (e.buttons === this.oekakiParam.EPenButton.eraser) ctx.strokeStyle = colorBackground;

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

            if (e.buttons === this.oekakiParam.EPenButton.eraser) {
              const eraserSize = this.options.ERASER_SIZE;
              ctx.fillStyle = colorBackground;
              ctx.fillRect(pos.x, pos.y, eraserSize, eraserSize);
              ctx.fill();
            } else if (pressure > 0) {
              ctx.beginPath();
              ctx.lineCap = 'round';
              ctx.moveTo(this.oekakiParam.lastBrushPos.x, this.oekakiParam.lastBrushPos.y);

              const midPoint = this._midPointBetween(this.oekakiParam.lastBrushPos, pos);
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

          case 'pointerenter':
            D.body.style.cursor = 'crosshair';
            break;

          case 'pointerleave':
            D.body.style.cursor = 'default';
            break;

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
        x: screenPos.x - canvasRect.left,
        y: screenPos.y - canvasRect.top
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
            ctx.moveTo(this.oekakiParam.lastBrushPos.x, this.oekakiParam.lastBrushPos.y);

            const { midPoint } = this._midPointBetween(this.oekakiParam.lastBrushPos, pos);
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
