/* eslint-disable node/no-unsupported-features/node-builtins */
/**
 *
 * Drag'n'Drop / Paste functionality for CANVAS EVE.
 *
 * Dependencies
 * - psd.js
 * - jquery-eve
 * - glb-eve
 * - store-eve
 *
 */

// ES6 Import statement
import PSD from 'psd.js/dist/psd.min';

import $ from '../common/jquery-eve';
import GlbEve from '../common/glb-eve';
// import StoreEve from '../common/store-eve';

// ES5 Import statement
const pdfjsLib = require('pdfjs-dist');
// Setting worker path to worker bundle.
pdfjsLib.GlobalWorkerOptions.workerSrc =
  '../../../build/js/pdf.worker.bundle.js';

const FileEve = ((W, D, M) => {
  function File() {
    this.canvasEveWrap = D.getElementById('canvas-eve-wrapper');
    this.currentMousePos = {
      x: 0,
      y: 0
    };
  }

  const modules = {};

  File.prototype = Object.assign(modules, {
    constructor: File,

    options: {
      SHOW_FILE_DELAY: 0,
      DEFAULT_FILE_WIDTH: 300
    },

    //

    mouseDownEvent(e) {
      this._updateMousePos(e);
    },

    //

    mouseMoveEvent(e) {
      this._updateMousePos(e);
    },

    //

    dragOverEvent(e) {
      this._dragOver(e);
    },

    //

    dropEvent(e) {
      this._drop(e);
    },

    //

    pasteEvent(e) {
      this._paste(e);
    },

    //

    // _storeFiles(file) {},

    //

    _updateMousePos(e) {
      let x;
      let y;
      if (e.changedTouches) {
        x = e.changedTouches[0].clientX;
        y = e.changedTouches[0].clientY;
      } else {
        x = e.clientX;
        y = e.clientY;
      }

      this.currentMousePos.x = x;
      this.currentMousePos.y = y;
    },

    //

    _dragOver(e) {
      e.dataTransfer.dropEffect = 'copy';
      // Not clear why this will help. I should have to reset pointer-events, but still works fine
      $('iframe').css('pointer-events', 'none');
    },

    //

    _drop(e) {
      let x;
      let y;
      if (e.changedTouches) {
        x = e.changedTouches[0].clientX;
        y = e.changedTouches[0].clientY;
      } else {
        x = e.clientX;
        y = e.clientY;
      }

      const mousePos = {
        left: x - $('#zoom').offset().left,
        top: y - $('#zoom').offset().top
      };

      // console.log(mousePos, x, y);

      const { files } = e.dataTransfer;
      // console.log('files', files);

      const progSet = {
        progress: D.getElementById('progress-bar'),
        fileCount: files.length,
        eachProg: 100 / files.length,
        totalProg: 0,
        iterate: 0
      };

      if (progSet.fileCount > 0) {
        // Disable texture loading when it is a model
        let modelFlg = false;
        Array.from(files).forEach(file => {
          if (!this._isSupported.checkAll(file.name)) {
            modelFlg = true;
          }
        });
        if (modelFlg === false) {
          // eslint-disable-next-line no-restricted-syntax
          for (const i in files) {
            if (this._isSupported.fileReader(files[i].name)) {
              this._fileReader(files[i], mousePos, progSet);
            } else if (this._isSupported.blobReader(files[i].name)) {
              this._blobReader(files[i], mousePos, progSet);
            }
            // console.log('i', i, 'files[i]', files[i]);
          }
        }
      }
    },

    //

    _paste(e) {
      let file = null;
      const { items } = e.clipboardData || e.originalEvent.clipboardData;
      for (let i = 0; i < items.length; i++) {
        if (items[i].kind === 'file') {
          file = items[i].getAsFile();
          break;
        }
      }
      if (file == null) return;

      const { x } = this.currentMousePos;
      const { y } = this.currentMousePos;

      const mousePos = {
        left: x - $('#zoom').offset().left,
        top: y - $('#zoom').offset().top
      };

      const progSet = {
        progress: D.getElementById('progress-bar'),
        fileCount: 1,
        eachProg: 100,
        totalProg: 0,
        iterate: 0
      };

      if (this._isSupported.fileReader(file.name)) {
        this._fileReader(file, mousePos, progSet);
      } else if (this._isSupported.blobReader(file.name)) {
        this._blobReader(file, mousePos, progSet);
      }
    },

    //

    _isSupported: {
      fileReader(fileName) {
        return /\.(psd)$/i.test(fileName);
      },
      blobReader(fileName) {
        return /\.(jpe?g|png|gif|svg|bmp|pdf)$/i.test(fileName);
      },
      checkAll(fileName) {
        return /\.(jpe?g|png|gif|svg|bmp|psd|pdf)$/i.test(fileName);
      }
    },

    //

    _fileReader(file, mousePos, progSet) {
      const self = this;
      this._readFileImg(file, progSet).then(img => {
        self._readerPromiseImg(img, mousePos, progSet);
      });
    },

    //

    _readFileImg(file, progSet) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadstart = () => {
          if (progSet.iterate === 0) progSet.progress.classList.add('loading');
        };
        reader.onprogress = e => {
          if (e.lengthComputable) {
            const percentLoaded = M.round(
              (e.loaded / e.total) * progSet.eachProg
            );
            if (percentLoaded < progSet.eachProg) {
              const progWidth = percentLoaded + progSet.totalProg;
              progSet.progress.style.width = `${progWidth}%`;
            }
          }
        };
        reader.onload = e => {
          progSet.iterate++;

          if (progSet.iterate < progSet.fileCount) {
            progSet.totalProg = progSet.eachProg * progSet.iterate;
            progSet.progress.style.width = `${progSet.totalProg}%`;
          } else {
            progSet.progress.style.width = '100%';
            setTimeout(() => {
              progSet.progress.classList.remove('loading');
            }, 1000);
          }

          const img = new Image();
          img.style.cssText = 'width: 100%;';
          if (/\.(psd)$/i.test(file.name)) {
            const psd = new PSD(new Uint8Array(e.target.result));
            psd.parse();
            img.src = psd.image.toBase64();
          } else {
            img.src = e.target.result;
          }

          return resolve(img);
        };
        reader.onerror = reject;
        if (/\.(psd)$/i.test(file.name)) {
          reader.readAsArrayBuffer(file);
        } else {
          reader.readAsDataURL(file);
        }
      });
    },

    //

    _blobReader(file, mousePos, progSet) {
      const self = this;
      const isPdf = /\.(pdf)$/i.test(file.name);

      if (isPdf) {
        this._readBlobPdf(file, mousePos, progSet);
      } else {
        this._readBlobImg(file, progSet).then(img => {
          self._readerPromiseImg(img, mousePos, progSet);
        });
      }
    },

    //

    _readBlobPdf(file, mousePos, progSet) {
      const self = this;
      const pdfPath = URL.createObjectURL(file);
      const loadingTask = pdfjsLib.getDocument(pdfPath).promise;

      if (progSet.iterate === 0) progSet.progress.classList.add('loading');

      loadingTask.then(pdfDocument => {
        // Request a first page
        return pdfDocument.getPage(1).then(pdfPage => {
          progSet.iterate++;

          if (progSet.iterate < progSet.fileCount) {
            progSet.totalProg = progSet.eachProg * progSet.iterate;
            progSet.progress.style.width = `${progSet.totalProg}%`;
          } else {
            progSet.progress.style.width = '100%';
            setTimeout(() => {
              progSet.progress.classList.remove('loading');
            }, 1000);
          }

          const id = self._createBasePdf(mousePos, progSet);
          const renderTask = self._renderPdf(id, mousePos, pdfPage);

          return renderTask.promise;
        });
      });
    },

    //

    _createBasePdf(mousePos, progSet) {
      GlbEve.NEWFILE_ID += 1;
      GlbEve.HIGHEST_Z_INDEX += 1;

      const id = `new-canvas-${GlbEve.CURRENT_CANVAS_ID}_${GlbEve.NEWFILE_ID}`;
      const canvasWidth = this.options.DEFAULT_FILE_WIDTH;
      const canvas = `<canvas width="${canvasWidth}"></canvas>`;
      const funcTags =
        '<div class="thumbtack-wrapper"></div><div class="resize-wrapper"></div><div class="rotate-wrapper"></div><div class="flip-wrapper"></div><div class="trash-wrapper"></div>';
      const assertFile = `<div id ="${id}" class="file-wrap transparent update-canvas" style="transition: ${GlbEve.IS_TRANSITION};"><div class="function-wrapper">${funcTags}</div><div class="eve-main is-flipped">${canvas}</div></div>`;
      $(`#add-files-${GlbEve.CURRENT_CANVAS_ID}`).append(assertFile);

      const fileId = `#${id}`;
      const $fileId = $(fileId);

      $fileId.css({
        left: `${mousePos.left * GlbEve.MOUSE_WHEEL_VAL -
          this.options.DEFAULT_FILE_WIDTH / 2}px`,
        'z-index': GlbEve.HIGHEST_Z_INDEX
      });

      // For colpick-eve.js
      if ($('#toggle-colpick').length > 0) {
        if (!$('#toggle-colpick').hasClass('active'))
          $fileId.addClass('grab-pointer');
      } else {
        $fileId.addClass('grab-pointer');
      }

      if (progSet.iterate === progSet.fileCount) {
        setTimeout(() => {
          $('div').removeClass('transparent');
        }, this.options.SHOW_FILE_DELAY);
      }

      return id;
    },

    //

    _renderPdf(id, mousePos, pdfPage) {
      const $fileId = $(`#${id}`);
      const canvas = $fileId.find('canvas')[0];

      // Display page on the existing canvas with 100% scale.
      const viewport = pdfPage.getViewport({
        scale: canvas.width / pdfPage.getViewport(1.0).width
      });
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');
      const renderTask = pdfPage.render({
        canvasContext: ctx,
        viewport: viewport
      });

      // Set top according to viewport
      $fileId.css({
        top: `${mousePos.top * GlbEve.MOUSE_WHEEL_VAL - viewport.height / 2}px`
      });

      return renderTask;
    },

    //

    _readBlobImg(file, progSet) {
      // eslint-disable-next-line no-unused-vars
      return new Promise((resolve, reject) => {
        if (progSet.iterate === 0) progSet.progress.classList.add('loading');

        const img = new Image();
        img.style.cssText = 'width: 100%;';
        img.src = URL.createObjectURL(file);
        img.onload = () => {
          progSet.iterate++;

          if (progSet.iterate < progSet.fileCount) {
            progSet.totalProg = progSet.eachProg * progSet.iterate;
            progSet.progress.style.width = `${progSet.totalProg}%`;
          } else {
            progSet.progress.style.width = '100%';
            setTimeout(() => {
              progSet.progress.classList.remove('loading');
            }, 1000);
          }

          return resolve(img);
        };
      });
    },

    //

    _readerPromiseImg(img, mousePos, progSet) {
      GlbEve.NEWFILE_ID += 1;
      GlbEve.HIGHEST_Z_INDEX += 1;

      // Currently not supporting video
      // const videoTag = '<video controls playsinline preload="metadata" style="width: 100%;">' +
      //     '<source src="' + dataUrl + '" type="video/webm">' +
      //     '<source src="' + dataUrl + '" type="video/mp4">' +
      //     '</video>';
      // const resTag = /\.(jpe?g|png|gif|svg)$/i.test(file.name) ? imgTag : videoTag;
      const id = `new-canvas-${GlbEve.CURRENT_CANVAS_ID}_${GlbEve.NEWFILE_ID}`;
      const canvas = '<canvas class="canvas-colpick"></canvas>';
      const funcTags =
        '<div class="thumbtack-wrapper"></div><div class="resize-wrapper"></div><div class="rotate-wrapper"></div><div class="flip-wrapper"></div><div class="trash-wrapper"></div>';
      const assertFile = `<div id ="${id}" class="file-wrap transparent update-canvas" style="transition: ${GlbEve.IS_TRANSITION};"><div class="function-wrapper">${funcTags}</div><div class="eve-main is-flipped">${canvas}</div></div>`;
      $(`#add-files-${GlbEve.CURRENT_CANVAS_ID}`).append(assertFile);

      const imgWidth = img.width;
      const imgHeight = img.height;
      const imgRatio = imgHeight / imgWidth;

      const fileId = `#${id}`;
      const $fileId = $(fileId);

      const canvasDefaultSize = this.options.DEFAULT_FILE_WIDTH - 2;
      $fileId.find('.canvas-colpick').attr('width', canvasDefaultSize);
      $fileId
        .find('.canvas-colpick')
        .attr('height', canvasDefaultSize * imgRatio);
      $fileId
        .find('.canvas-colpick')[0]
        .getContext('2d')
        .drawImage(img, 0, 0, canvasDefaultSize, canvasDefaultSize * imgRatio);

      $fileId.css({
        left: `${mousePos.left * GlbEve.MOUSE_WHEEL_VAL -
          this.options.DEFAULT_FILE_WIDTH / 2}px`,
        top: `${mousePos.top * GlbEve.MOUSE_WHEEL_VAL -
          (this.options.DEFAULT_FILE_WIDTH * imgRatio) / 2}px`,
        'z-index': GlbEve.HIGHEST_Z_INDEX
      });

      // For colpick-eve.js
      if ($('#toggle-colpick').length > 0) {
        if (!$('#toggle-colpick').hasClass('active'))
          $fileId.addClass('grab-pointer');
      } else {
        $fileId.addClass('grab-pointer');
      }

      $fileId.find('.eve-main').prepend(img);

      if (progSet.iterate === progSet.fileCount) {
        setTimeout(() => {
          $('div').removeClass('transparent');
        }, this.options.SHOW_FILE_DELAY);
      }
    }
  });

  return File;
})(window, document, Math);

export default FileEve;
