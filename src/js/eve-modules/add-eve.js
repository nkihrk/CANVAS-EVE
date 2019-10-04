(function ($) {

    const initFileEve = {
        fileReader: (file, mousePos, progSet, PSD) => {

            read(file).then(function (img) {
                initFileEve.readerPromise(img, mousePos, progSet);
            });


            function read(file) {
                return new Promise(function (resolve, reject) {
                    var reader = new FileReader();
                    reader.onloadstart = function (e) {
                        if (progSet.iterate == 0) {
                            progSet.progress.classList.add('loading');
                        }
                    };
                    reader.onprogress = function (e) {
                        if (e.lengthComputable) {
                            var percentLoaded = Math.round((e.loaded / e.total) * progSet.eachProg);
                            // console.log('percentLoaded', percentLoaded);

                            if (percentLoaded < progSet.eachProg) {
                                var progWidth = percentLoaded + progSet.totalProg;
                                progSet.progress.style.width = progWidth + '%';
                                // console.log('progWidth', progWidth);
                            }
                        }
                    };
                    reader.onload = function (e) {
                        progSet.iterate++;
                        // console.log('progSet.iterate', progSet.iterate);


                        if (progSet.iterate < progSet.fileCount) {
                            progSet.totalProg = progSet.eachProg * progSet.iterate;
                            progSet.progress.style.width = progSet.totalProg + '%';
                            // console.log('progSet.totalProg', progSet.totalProg);
                        } else {
                            progSet.progress.style.width = '100%';
                            setTimeout(function () {
                                progSet.progress.classList.remove('loading');
                            }, 1000);
                        }


                        const img = new Image();
                        img.style.cssText = 'width: 100%;'
                        if (/\.(psd)$/i.test(file.name)) {
                            var psd = new PSD(new Uint8Array(e.target.result));
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
            };
        },


        //


        blobReader: (file, mousePos, progSet) => {

            read(file).then(function (img) {
                initFileEve.readerPromise(img, mousePos, progSet);
            });


            function read(file) {
                return new Promise(function (resolve, reject) {

                    if (progSet.iterate == 0) {
                        progSet.progress.classList.add('loading');
                    }


                    const img = new Image();
                    img.style.cssText = 'width: 100%;'
                    img.src = URL.createObjectURL(file);
                    // console.log('ObjectURL is successfuly created.');


                    img.onload = function () {
                        progSet.iterate++;
                        // console.log('progSet.iterate', progSet.iterate);


                        if (progSet.iterate < progSet.fileCount) {
                            progSet.totalProg = progSet.eachProg * progSet.iterate;
                            progSet.progress.style.width = progSet.totalProg + '%';
                            // console.log('progSet.totalProg', progSet.totalProg);
                        } else {
                            progSet.progress.style.width = '100%';
                            setTimeout(function () {
                                progSet.progress.classList.remove('loading');
                            }, 1000);
                        }


                        return resolve(img);
                    };
                });
            };
        },


        //


        readerPromise: (img, mousePos, progSet) => {
            newFile.id += 1;
            HIGHEST_Z_INDEX += 1;

            // Currently not supporting video
            // const videoTag = '<video controls playsinline preload="metadata" style="width: 100%;">' +
            //     '<source src="' + dataUrl + '" type="video/webm">' +
            //     '<source src="' + dataUrl + '" type="video/mp4">' +
            //     '</video>';
            // const resTag = /\.(jpe?g|png|gif|svg)$/i.test(file.name) ? imgTag : videoTag;
            const canvas = '<canvas class="canvas-colpick"></canvas>';
            const funcTags = '<div class="thumbtack-wrapper"></div><div class="resize-wrapper"></div><div class="rotate-wrapper"></div><div class="flip-wrapper"></div><div class="trash-wrapper"></div>';
            const assertFile = '<div id ="' + newFile.id + '" class="file-wrap transparent" style="transition: ' + IS_TRANSITION + ';"><div class="function-wrapper">' + funcTags + '</div><div class="eve-main is-flipped">' + canvas + '</div></div>';
            $('#add-files').append(assertFile);


            const imgWidth = img.width;
            const imgHeight = img.height;
            const imgRatio = imgHeight / imgWidth;


            const fileId = '#' + newFile.id;
            const $fileId = $(fileId);


            $(fileId + ' .canvas-colpick').attr('width', 598);
            $(fileId + ' .canvas-colpick').attr('height', 598 * imgRatio);
            $(fileId + ' .canvas-colpick')[0].getContext('2d').drawImage(img, 0, 0, 598, 598 * imgRatio);


            $fileId.css({
                'left': mousePos.left * mouseWheelVal - 600 / 2 + 'px',
                'top': mousePos.top * mouseWheelVal - 600 * imgRatio / 2 + 'px',
                'transform': 'translate(' + xNewMinus + 'px, ' + yNewMinus + 'px' + ')',
                'z-index': HIGHEST_Z_INDEX,
            });


            // For colpick-eve.js
            if ($('#toggle-colpick').length > 0) {
                if (!$('#toggle-colpick').hasClass('active')) {
                    $fileId.addClass('grab-pointer');
                }
            } else {
                $fileId.addClass('grab-pointer');
            }


            $('#' + newFile.id + ' .eve-main').prepend(img);


            if (progSet.iterate == progSet.fileCount) {
                setTimeout(function () {
                    $('div').removeClass('transparent');
                }, 0);
            }
        },


        //


        handleDragEvent: (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.dataTransfer.dropEffect = 'copy';
            // Not clear why this will help. Should have to reset pointer-events, but still works fine
            $('iframe').css('pointer-events', 'none');
        },


        //


        paste: () => {
            const canvasEveWrap = document.getElementById("canvas-eve-wrapper");
            canvasEveWrap.addEventListener('paste', initFileEve.handlePasteEvent, false);
        },


        //


        handlePasteEvent: (e) => {
            var file = null;
            var items = (e.clipboardData || e.originalEvent.clipboardData).items;
            for (let i = 0; i < items.length; i++) {
                if (items[i].kind === "file") {
                    file = items[i].getAsFile();
                    break;
                }
            }
            if (file == null) {
                return;
            }

            // Init the values before executing the readAndPreview()
            const mousePos = {
                left: clientFromZoomX,
                top: clientFromZoomY
            };

            const progSet = {
                progress: document.getElementById('progress-bar'),
                fileCount: 1,
                eachProg: 100,
                totalProg: 0,
                iterate: 0
            };

            const PSD = require('psd');

            if (initFileEve.isSupported.fileReader(file.name)) {
                initFileEve.fileReader(file, mousePos, progSet, PSD);
            } else if (initFileEve.isSupported.blobReader(file.name)) {
                initFileEve.blobReader(file, mousePos, progSet);
            }
        },


        //


        drop: () => {
            // The canvas-eve-wrapper area to paste
            const canvasEveWrap = document.getElementById("canvas-eve-wrapper");
            canvasEveWrap.addEventListener('dragover', initFileEve.handleDragEvent, false);
            canvasEveWrap.addEventListener('drop', initFileEve.handleDropEvent, false);
        },


        //


        handleDropEvent: (e) => {
            e.stopPropagation();
            e.preventDefault();

            // Init the values before executing the readAndPreview()
            let x, y;
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

            const files = e.dataTransfer.files;
            // console.log('files', files);


            const progSet = {
                progress: document.getElementById('progress-bar'),
                fileCount: files.length,
                eachProg: parseFloat(100 / files.length),
                totalProg: 0,
                iterate: 0
            };

            const PSD = require('psd');

            if (progSet.fileCount > 0) {
                // Disable texture loading when it is a model
                var model_flg = false;
                Array.from(files).forEach((file) => {
                    if (!initFileEve.isSupported.checkAll(file.name)) {
                        model_flg = true;
                    }
                });
                if (model_flg == false) {
                    for (var i in files) {
                        if (i < progSet.fileCount) {
                            if (initFileEve.isSupported.fileReader(files[i].name)) {
                                initFileEve.fileReader(files[i], mousePos, progSet, PSD);
                            } else if (initFileEve.isSupported.blobReader(files[i].name)) {
                                initFileEve.blobReader(files[i], mousePos, progSet);
                            }
                            // console.log('i', i, 'files[i]', files[i]);
                        }
                    }
                }
            } else {
                return;
            }
        },


        //


        isSupported: {
            fileReader: (fileName) => {
                return /\.(psd)$/i.test(fileName);
            },

            blobReader: (fileName) => {
                return /\.(jpe?g|png|gif|svg|bmp)$/i.test(fileName);
            },

            checkAll: (fileName) => {
                return /\.(jpe?g|png|gif|svg|bmp|psd)$/i.test(fileName);
            }
        }
    };


    initFileEve.paste();
    initFileEve.drop();


})(jQuery);