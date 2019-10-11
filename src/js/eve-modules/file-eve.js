/**
 *
 * Drag'n'Drop / Paste functionality for CANVAS EVE.
 *
 * Dependencies
 * - jQuery 3.4.1
 * - psd
 * - glb-eve
 * - lib-eve
 *
 */

import $ from 'jquery';
import PSD from 'psd.js/dist/psd.min';

import GlbEve from '../common/glb-eve';
import LibEve from '../common/lib-eve';

const FileEve = ((W, D, M) => {
  function File() {
    LibEve.call(this);

    this.canvasEveWrap = D.getElementById('canvas-eve-wrapper');
  }

  const modules = { ...LibEve.prototype };

  File.prototype = Object.assign(modules, {
    constructor: File,

    options: {},

    load() {
      this.handleEvents();
    },

    //

    handleEvents() {
      const self = this;
      this.canvasEveWrap.addEventListener(
        'dragover',
        e => {
          self._dragOver(e);
        },
        false
      );
      this.canvasEveWrap.addEventListener(
        'drop',
        e => {
          self._drop(e);
        },
        false
      );
      this.canvasEveWrap.addEventListener(
        'paste',
        e => {
          self._paste(e);
        },
        false
      );
    },

    //

    _dragOver(e) {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = 'copy';
      // Not clear why this will help. Should have to reset pointer-events, but still works fine
      $('iframe').css('pointer-events', 'none');
    },

    //

    _drop(e) {
      e.stopPropagation();
      e.preventDefault();

      // Init the values before executing the readAndPreview()
      let x;
      let y;
      if (e.changedTouches) {
        x = e.changedTouches[0].clientX;
        y = e.changedTouches[0].clientY;
      } else {
        x = e.clientX;
        y = e.clientY;
      }

      // Init the values before executing the readAndPreview()
      const mousePos = {
        left: x - $('#zoom').offset().left,
        top: y - $('#zoom').offset().top
      };

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

      // Init the values before executing the readAndPreview()
      const mousePos = {
        left: clientFromZoomX,
        top: clientFromZoomY
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
        return /\.(jpe?g|png|gif|svg|bmp)$/i.test(fileName);
      },
      checkAll(fileName) {
        return /\.(jpe?g|png|gif|svg|bmp|psd)$/i.test(fileName);
      }
    },

    //

    _fileReader(file, mousePos, progSet) {
      const self = this;
      this._readFile(file, progSet).then(function(img) {
        self._readerPromise(img, mousePos, progSet);
      });
    },

    //

    _readFile(file, progSet) {
      return new Promise(function(resolve, reject) {
        const reader = new FileReader();
        reader.onloadstart = () => {
          if (progSet.iterate === 0) {
            progSet.progress.classList.add('loading');
          }
        };
        reader.onprogress = e => {
          if (e.lengthComputable) {
            const percentLoaded = M.round((e.loaded / e.total) * progSet.eachProg);
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
            setTimeout(function() {
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
      this._readBlob(file, progSet).then(function(img) {
        self._readerPromise(img, mousePos, progSet);
      });
    },

    //

    _readBlob(file, progSet) {
      // eslint-disable-next-line no-unused-vars
      return new Promise(function(resolve, reject) {
        if (progSet.iterate === 0) progSet.progress.classList.add('loading');

        const img = new Image();
        img.style.cssText = 'width: 100%;';
        // eslint-disable-next-line node/no-unsupported-features/node-builtins
        img.src = URL.createObjectURL(file);
        img.onload = function() {
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

    _readerPromise(img, mousePos, progSet) {
      GlbEve.NEWFILE_ID += 1;
      GlbEve.HIGHEST_Z_INDEX += 1;

      // Currently not supporting video
      // const videoTag = '<video controls playsinline preload="metadata" style="width: 100%;">' +
      //     '<source src="' + dataUrl + '" type="video/webm">' +
      //     '<source src="' + dataUrl + '" type="video/mp4">' +
      //     '</video>';
      // const resTag = /\.(jpe?g|png|gif|svg)$/i.test(file.name) ? imgTag : videoTag;
      const canvas = '<canvas class="canvas-colpick"></canvas>';
      const funcTags =
        '<div class="thumbtack-wrapper"></div><div class="resize-wrapper"></div><div class="rotate-wrapper"></div><div class="flip-wrapper"></div><div class="trash-wrapper"></div>';
      const assertFile = `<div id ="${GlbEve.NEWFILE_ID}" class="file-wrap transparent" style="transition: ${GlbEve.IS_TRANSITION};"><div class="function-wrapper">${funcTags}</div><div class="eve-main is-flipped">${canvas}</div></div>`;
      $('#add-files').append(assertFile);

      const imgWidth = img.width;
      const imgHeight = img.height;
      const imgRatio = imgHeight / imgWidth;

      const fileId = `#${GlbEve.NEWFILE_ID}`;
      const $fileId = $(fileId);

      $(`${fileId} .canvas-colpick`).attr('width', 598);
      $(`${fileId} .canvas-colpick`).attr('height', 598 * imgRatio);
      $(`${fileId} .canvas-colpick`)[0]
        .getContext('2d')
        .drawImage(img, 0, 0, 598, 598 * imgRatio);

      $fileId.css({
        left: `${mousePos.left * GlbEve.MOUSE_WHEEL_VAL - 600 / 2}px`,
        top: `${mousePos.top * GlbEve.MOUSE_WHEEL_VAL - (600 * imgRatio) / 2}px`,
        transform: `translate(0, 0)`,
        'z-index': GlbEve.HIGHEST_Z_INDEX
      });

      // For colpick-eve.js
      if ($('#toggle-colpick').length > 0) {
        if (!$('#toggle-colpick').hasClass('active')) $fileId.addClass('grab-pointer');
      } else {
        $fileId.addClass('grab-pointer');
      }

      $(`#${GlbEve.NEWFILE_ID} .eve-main`).prepend(img);

      if (progSet.iterate === progSet.fileCount) {
        setTimeout(function() {
          $('div').removeClass('transparent');
        }, 0);
      }
    }
  });

  return File;
})(window, document, Math);

export default FileEve;
