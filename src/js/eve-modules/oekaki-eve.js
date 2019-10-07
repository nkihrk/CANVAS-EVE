/**
 *
 * Drawing app for CANVAS EVE.
 *
 * * Dependencies
 * - jQuery 3.4.1
 *
 */

import jQuery from 'jquery';

const OekakiEve = (function(d, $) {
  function oekaki(container) {
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

    this.param = {
      container: container,
      size: size,
      centerPos: {
        x: centerX,
        y: centerY
      },
      color: {
        hue: this.options.hue,
        rgb: this.options.rgb
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
        x: Math.cos((Math.PI * 2) / 3) * triangleRadius + size / 2,
        y: Math.sin((Math.PI * 2) / 3) * triangleRadius + size / 2
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

  oekaki.prototype = {
    constructor: oekaki,

    options: {
      hue: 0,
      rgb: [0, 0, 0],
      theta: 0,
      brush_size: 4,
      eraser_size: 30,
      canvas_color: '#f0e0d6'
    },

    load() {
      this.drawWheel();
      this.drawTriangle();
      this.setFlgs();
      this.resetFlgs();
      this.handleEvents();
    },

    setFlgs() {
      const self = this;

      $(d).on(EVENTNAME_TOUCHSTART, '#color-oekaki', () => {
        const isWheelArea = self._isWheelArea();
        if (isWheelArea) {
          glFlgs.oekaki.move_wheelcircle_flg = true;
          console.log('glFlgs.oekaki.move_wheelcircle_flg is ', glFlgs.oekaki.move_wheelcircle_flg);
        }

        const isTriangleArea = self._isTriangleArea();
        if (isTriangleArea) {
          glFlgs.oekaki.move_trianglecircle_flg = true;
          console.log(
            'glFlgs.oekaki.move_trianglecircle_flg is ',
            glFlgs.oekaki.move_trianglecircle_flg
          );
        }
      });

      $(d).on(EVENTNAME_TOUCHSTART, '#color-wheel-circle', () => {
        glFlgs.oekaki.move_wheelcircle_flg = true;
        console.log('glFlgs.oekaki.move_wheelcircle_flg is ', glFlgs.oekaki.move_wheelcircle_flg);
      });
      $(d).on(EVENTNAME_TOUCHSTART, '#color-triangle-circle', () => {
        glFlgs.oekaki.move_trianglecircle_flg = true;
        console.log(
          'glFlgs.oekaki.move_trianglecircle_flg is ',
          glFlgs.oekaki.move_trianglecircle_flg
        );
      });

      $(d).on(EVENTNAME_TOUCHSTART, '#reset-res', () => {
        if (self.flgs.newcanvas.newcanvas_flg === true) {
          self.flgs.newcanvas.create_canvas_avail_flg = true;
          self.newCanvasX = clientFromZoomX;
          self.newCanvasY = clientFromZoomY;

          self._createCanvasWrapper();
          console.log(
            'self.flgs.newcanvas.create_canvas_avail_flg is ',
            self.flgs.newcanvas.create_canvas_avail_flg
          );
        }
      });

      $(d).on(EVENTNAME_TOUCHSTART, '.oekaki-canvas', () => {
        if (self.flgs.brush.brush_flg === true) {
          self.flgs.brush.draw_canvas_avail_flg = true;
          console.log(
            'self.flgs.brush.draw_canvas_avail_flg is ',
            self.flgs.brush.draw_canvas_avail_flg
          );
        }
      });
    },

    //

    resetFlgs() {
      const self = this;

      $(d).on(EVENTNAME_TOUCHEND, () => {
        if (glFlgs.oekaki.move_wheelcircle_flg === true) {
          glFlgs.oekaki.move_wheelcircle_flg = false;
          console.log('glFlgs.oekaki.move_wheelcircle_flg is ', glFlgs.oekaki.move_wheelcircle_flg);
        }
        if (glFlgs.oekaki.move_trianglecircle_flg === true) {
          glFlgs.oekaki.move_trianglecircle_flg = false;
          console.log(
            'glFlgs.oekaki.move_trianglecircle_flg is ',
            glFlgs.oekaki.move_trianglecircle_flg
          );
        }

        if (self.flgs.newcanvas.create_canvas_avail_flg === true) {
          self.flgs.newcanvas.create_canvas_avail_flg = false;
          self._createCanvas();
          console.log(
            'self.flgs.newcanvas.create_canvas_avail_flg is ',
            self.flgs.newcanvas.create_canvas_avail_flg
          );
        }
      });
    },

    //

    handleEvents() {
      const self = this;

      $(d).on(EVENTNAME_TOUCHSTART, '#color-oekaki', () => {
        self._colorWheelArea();
        self._colorTriangleArea();
      });

      $(d).on(
        EVENTNAME_TOUCHSTART,
        '#newcanvas-oekaki, #brush-oekaki, #eraser-oekaki, #spuit-oekaki, #filldrip-oekaki',
        function(e) {
          self._toggleTool($(this), e);
        }
      );

      $(d).on(EVENTNAME_TOUCHMOVE, () => {
        const originX = $(self.container).offset().left;
        const originY = $(self.container).offset().top;
        const centerX = originX + self.size / 2;
        const centerY = originY + self.size / 2;
        self.centerX = centerX;
        self.centerY = centerY;

        if (glFlgs.oekaki.move_wheelcircle_flg === true) {
          self._updateWheelCircle();
        }
        if (glFlgs.oekaki.move_trianglecircle_flg === true) {
          self._updateTriangleCircle();
        }

        if (self.flgs.newcanvas.create_canvas_avail_flg === true) {
          self._updateCanvasVal();
        }
      });

      if (window.PointerEvent) {
        for (let i = 0; i < self.drawPointerEvents.length; i++) {
          $(d).on(self.drawPointerEvents[i], '.oekaki-canvas', function(e) {
            if (self.flgs.brush.brush_flg === true) {
              const $canvas = $(this).find('canvas');
              self._drawCanvasPointer($canvas, e);
            }
          });
        }
      } else {
        for (let i = 0; i < self.drawEvents.length; i++) {
          $(d).on(self.drawEvents[i], '.oekaki-canvas', function(e) {
            if (self.flgs.brush.brush_flg === true) {
              const $canvas = $(this).find('canvas');
              self._drawCanvas($canvas, e);
            }
          });
        }
      }
    },

    //
    // Color Wheel
    //

    drawWheel() {
      const resolution = 1;
      const outerRadius = 100;
      const innerRadius = outerRadius - (this.colorWheel.thickness / this.colorWheel.radius) * 100;

      const root = d.getElementById('color-wheel');

      this._createWheelCircle();
      this._generateConicGradiant(outerRadius, resolution, root);
      this._generateOverlay(outerRadius, innerRadius, root);
    },
    _generateOverlay(outerRadius, innerRadius, target) {
      const circle = d.createElementNS('http://www.w3.org/2000/svg', 'circle');

      circle.setAttribute('cx', outerRadius);
      circle.setAttribute('cy', outerRadius);
      circle.setAttribute('r', innerRadius);
      circle.setAttribute('fill', '#262533');

      target.appendChild(circle);
    },
    _generateConicGradiant(radius, resolution, target) {
      for (let i = 0; i < 360 * resolution; i++) {
        const path = d.createElementNS('http://www.w3.org/2000/svg', 'path');

        path.setAttribute(
          'd',
          this._describeArc(radius, radius, radius, i / resolution, (i + 2) / resolution)
        );
        path.setAttribute('fill', `hsl(${i / resolution}, 100%, 50%)`);

        target.appendChild(path);
      }
    },
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
    _polar2Cartesian(centerX, centerY, radius, angleInDegrees) {
      const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

      return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians)
      };
    },

    //

    _createWheelCircle() {
      const wheelCircle = d.createElement('div');
      const r = this.colorWheel.innerRadius + this.colorWheel.thickness / 2;
      const { theta } = this.options;
      const left = r * Math.cos(theta + (3 / 2) * Math.PI) + this.param.size / 2;
      const top = r * Math.sin(theta + (3 / 2) * Math.PI) + this.param.size / 2;

      wheelCircle.id = 'color-wheel-circle';
      wheelCircle.style.left = `${left}px`;
      wheelCircle.style.top = `${top}px`;

      this.wheelCircle = wheelCircle;
      this.param.container.appendChild(wheelCircle);
    },

    //

    _colorWheelArea() {
      const isWheelArea = this._isWheelArea();
      if (isWheelArea) {
        this._updateWheelCircle();
      }
    },

    //

    _isWheelArea() {
      const minR = this.colorWheel.innerRadius;
      const maxR = this.colorWheel.radius;
      const mouseR = this.getDistance(
        this.param.centerPos.x,
        this.param.centerPos.y,
        clientX,
        clientY
      );

      if (mouseR > minR && maxR > mouseR) {
        return true;
      }
      return false;
    },

    //

    _updateWheelCircle() {
      const pointer = this.wheelCircle;
      const r = this.colorWheel.innerRadius + this.colorWheel.thickness / 2;
      const theta = this._calculateTheta();
      const left = r * Math.cos(theta) + this.param.size / 2;
      const top = r * Math.sin(theta) + this.param.size / 2;
      pointer.style.left = `${left}px`;
      pointer.style.top = `${top}px`;

      const hue = this._calculateHue();
      this.param.color.hue = hue;
      this._updateTriangle();
    },

    //

    _calculateTheta() {
      const rad =
        (Math.atan2(clientY - this.param.centerPos.y, clientX - this.param.centerPos.x) / Math.PI) *
          180 +
        (Math.atan2(clientY - this.param.centerPos.y, clientX - this.param.centerPos.x) > 0
          ? 0
          : 360);

      return (rad / 180) * Math.PI;
    },

    //

    _calculateHue() {
      const deg =
        (Math.atan2(clientY - this.param.centerPos.y, clientX - this.param.centerPos.x) / Math.PI) *
          180 +
        90 +
        ((Math.atan2(clientY - this.param.centerPos.y, clientX - this.param.centerPos.x) /
          Math.PI) *
          180 +
          90 >
        0
          ? 0
          : 360);

      return deg;
    },

    //
    // Color Triangle
    //

    drawTriangle() {
      this._createTriangle();
      this._createTriangleCircle();
      this._initTriangle();
      this._getTriangleColor();
    },

    _initTriangle() {
      const ctx = this.triangleCtx;

      const leftTopX = Math.cos((Math.PI * 2) / 3) * this.colorTriangle.radius;
      const leftTopY = Math.sin((Math.PI * 2) / 3) * this.colorTriangle.radius;

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
      const hsla = `hsla(${Math.round(this.param.color.hue)}, 100%, 50%, `;
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
      const c = d.createElement('canvas');
      c.id = 'color-triangle';
      c.width = this.param.size;
      c.height = this.param.size;
      const triangleCtx = c.getContext('2d');

      this.triangleCtx = triangleCtx;
      this.param.container.appendChild(c);
    },

    //

    _createTriangleCircle() {
      const triangleCircle = d.createElement('div');
      triangleCircle.id = 'color-triangle-circle';
      triangleCircle.style.left = `${this.colorTriangle.circlePos.x}px`;
      triangleCircle.style.top = `${this.colorTriangle.circlePos.y}px`;

      this.triangleCircle = triangleCircle;
      this.param.container.appendChild(triangleCircle);
    },

    //

    _colorTriangleArea() {
      const isTriangleArea = this._isTriangleArea();
      if (isTriangleArea) {
        this._updateTriangleCircle();
      }
    },

    //

    _isTriangleArea() {
      const mouseX = clientX - this.param.centerPos.x;
      const mouseY = clientY - this.param.centerPos.y;
      const minX = Math.cos((Math.PI * 2) / 3) * this.colorTriangle.radius;
      const maxX = this.colorTriangle.radius;
      const maxY = (-mouseX + maxX) / Math.sqrt(3);

      if (mouseX > minX && maxX > mouseX) {
        if (Math.abs(mouseY) >= 0 && maxY >= Math.abs(mouseY)) {
          return true;
        }
        return false;
      }
      return false;
    },

    //

    _updateTriangleCircle() {
      const mouseX = clientX - this.param.centerPos.x;
      const mouseY = clientY - this.param.centerPos.y;

      const minX = Math.cos((Math.PI * 2) / 3) * this.colorTriangle.radius;
      const maxX = this.colorTriangle.radius;
      let minY = (mouseX - maxX) / Math.sqrt(3);
      let maxY = (-mouseX + maxX) / Math.sqrt(3);
      minY = mouseX <= minX ? -Math.sin((Math.PI * 2) / 3) * this.colorTriangle.radius : minY;
      maxY = mouseX <= minX ? Math.sin((Math.PI * 2) / 3) * this.colorTriangle.radius : maxY;

      const pointer = this.triangleCircle;
      const $container = $(this.param.container);
      const parentNodeX = $container.offset().left;
      const parentNodeY = $container.offset().top;
      const left = clientX - parentNodeX;
      const top = clientY - parentNodeY;

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
      const leftTopX = Math.cos((Math.PI * 2) / 3) * this.colorTriangle.radius;
      const leftTopY = Math.sin((Math.PI * 2) / 3) * this.colorTriangle.radius;
      const a = -Math.tan(Math.PI / 6) * x - y - leftTopY + Math.tan(Math.PI / 6) * leftTopX;
      const k = Math.abs(a) * Math.sin(Math.PI / 3);
      const l = (this.colorTriangle.radius * 3) / 2;

      const b = this.hsl2rgb(this.param.color.hue / 360, 1.0, 0.5);
      const s = [255, 255, 255];

      const co = [];
      let tmp;
      for (let i = 0; i < 3; i++) {
        tmp = (s[i] * (l - k)) / l + (b[i] * (l - (this.colorTriangle.radius - x))) / l;
        tmp = Math.abs(Math.round(tmp));
        co.push(tmp);
      }

      return co;
    },

    // //

    getDistance(x1, y1, x2, y2) {
      let xs = x2 - x1;
      let ys = y2 - y1;
      xs *= xs;
      ys *= ys;

      return Math.sqrt(xs + ys);
    },

    //

    hsl2rgb(h, s, l) {
      let r;
      let g;
      let b;

      if (s === 0) {
        r = 1;
        g = 1;
        b = l;
      } else {
        const hue2rgb = function hue2rgb(p, q, t) {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1 / 6) return p + (q - p) * 6 * t;
          if (t < 1 / 2) return q;
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
          return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
      }

      return [
        Math.min(Math.floor(r * 256), 255),
        Math.min(Math.floor(g * 256), 255),
        Math.min(Math.floor(b * 256), 255)
      ];
    },

    //
    // Toggle Buttons
    //

    _toggleTool($container, e) {
      if (e.button !== 1) {
        e.stopPropagation();
        $container.toggleClass('active');

        if (
          this.__$toggleButton !== null &&
          this.__$toggleButton[0] !== $container[0] &&
          this.__$toggleButton.hasClass('active')
        ) {
          this.__$toggleButton.removeClass('active');
        }
        if ($container.hasClass('active')) {
          this.__$toggleButton = $container;
        }

        if ($container.hasClass('active') && $container.attr('id') === 'newcanvas-oekaki') {
          this.flgs.newcanvas.newcanvas_flg = true;
          console.log('this.flgs.newcanvas.newcanvas_flg is ', this.flgs.newcanvas.newcanvas_flg);
        } else {
          this.flgs.newcanvas.newcanvas_flg = false;
          console.log('this.flgs.newcanvas.newcanvas_flg is ', this.flgs.newcanvas.newcanvas_flg);
        }

        if ($container.hasClass('active') && $container.attr('id') === 'brush-oekaki') {
          this.flgs.brush.brush_flg = true;
          console.log('this.flgs.brush.brush_flg is ', this.flgs.brush.brush_flg);
        } else {
          this.flgs.brush.brush_flg = false;
          console.log('this.flgs.brush.brush_flg is ', this.flgs.brush.brush_flg);
        }
      }
    },

    //
    // Canvas
    //

    _createCanvasWrapper() {
      const startX = this.canvas.newCanvasPos.x;
      const startY = this.canvas.newCanvasPos.y;

      newFile.id += 1;
      HIGHEST_Z_INDEX += 1;

      const funcTags =
        '<div class="thumbtack-wrapper"></div>' +
        '<div class="resize-wrapper"></div>' +
        '<div class="flip-wrapper"></div>' +
        '<div class="trash-wrapper"></div>';
      const assertFile =
        `<div id ="${newFile.id}" class="file-wrap selected-dot oekaki-canvas" style="transition: ${IS_TRANSITION};">` +
        `<div class="function-wrapper">${funcTags}</div>` +
        '<div class="eve-main is-flipped"></div>' +
        '</div>';
      $('#add-files').append(assertFile);

      const fileId = `#${newFile.id}`;
      const $fileId = $(fileId);

      $fileId.css({
        left: `${startX * mouseWheelVal}px`,
        top: `${startY * mouseWheelVal}px`,
        transform: `translate(${xNewMinus}px, ${yNewMinus}px)`,
        'z-index': HIGHEST_Z_INDEX
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

    _updateCanvasVal() {
      const $canvas = this.canvas.$newCanvasId;
      const startX = this.canvas.newCanvasPos.x;
      const startY = this.canvas.newCanvasPos.y;
      const endX = clientFromZoomX;
      const endY = clientFromZoomY;

      const resultX = Math.abs(endX - startX);
      const resultY = Math.abs(endY - startY);

      $canvas.css({
        width: `${resultX * mouseWheelVal}px`,
        height: `${resultY * mouseWheelVal}px`
      });
    },

    //

    _createCanvas() {
      const { $newCanvasId } = this.canvas.$newCanvasId;
      const c = d.createElement('canvas');
      const width = $newCanvasId.width();
      const height = $newCanvasId.height();

      c.width = width;
      c.height = height;

      const ctx = c.getContext('2d');
      ctx.canvas.style.touchAction = 'none';
      ctx.fillStyle = this.options.canvas_color;
      ctx.fillRect(0, 0, width, height);

      $newCanvasId.find('.eve-main').append(c);
      $newCanvasId.removeClass('selected-dot');
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
        x: (screenPos.x - canvasRect.left) * mouseWheelVal,
        y: (screenPos.y - canvasRect.top) * mouseWheelVal
      };

      let pressure = this.options.brush_size;
      // const rotate = e.twist;

      const brushColor = `rgba(${this.param.color.rgb[0]},${this.param.color.rgb[1]},${
        this.param.color.rgb[2]
      },1.0)`;
      const colorBackground = this.options.canvas_color;

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
            //     ctx.lineWidth = pressure * 3 * Math.abs(this.tilt.x);
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

        if (e.buttons === this.oekakiParam.EPenButton.eraser) {
          ctx.strokeStyle = colorBackground;
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

            if (e.buttons === this.oekakiParam.EPenButton.eraser) {
              const eraserSize = this.options.eraser_size;
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
            d.body.style.cursor = 'crosshair';
            break;

          case 'pointerleave':
            d.body.style.cursor = 'default';
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

      const pressure = this.options.brush_size;

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
  };

  return oekaki;
})(document, jQuery);

export default OekakiEve;
