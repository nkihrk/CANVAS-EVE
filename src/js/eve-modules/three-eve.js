CANVASEVE.Three = (function (w, $) {

    function Three() {
        this.scenes = [];
        this.renderer = null; // lazy load
        this.canvas = document.getElementById("c");
        this.canvasEveWrap = document.getElementById("canvas-eve-wrapper");
    }

    Three.prototype = {

        constructor: Three,

        options: {},


        init: function () {
            readFileEve.drop();

            this.renderer = new THREE.WebGLRenderer({
                canvas: this.canvas,
                antialias: true,
                alpha: true,
            });
            this.renderer.setClearColor(0x000000, 0);
            this.renderer.setPixelRatio(w.devicePixelRatio);
            this.renderer.shadowMap.enabled = true;
        },


        _setScene: function (id) {
            var scene = new THREE.Scene();

            scene.userData.element = document.getElementById(id).getElementsByClassName('eve-main')[0];

            scene.add(new THREE.HemisphereLight(0xaaaaaa, 0x444444));

            var light = new THREE.DirectionalLight(0xffffff, 0.5);
            light.position.set(1, 1, 1);
            scene.add(light);

            scenes.push(scene);

            return scene;
        },


        animate: function () {
            this.render();
            // requestAnimationFrame(this.animate);
            setTimeout(function () {
                requestAnimationFrame(this.animate);
            }, 1000 / 120);
        },


        render: function () {
            this._updateSize();

            this.renderer.setScissorTest(false);
            this.renderer.clear(true, true);
            this.renderer.setScissorTest(true);

            if (!!scenes[0]) {
                this.scenes.forEach(function (scene) {

                    var element = scene.userData.element;

                    var controls = scene.userData.controls;
                    if (!!controls) {
                        controls.rotateSpeed = 1 * mouseWheelVal;
                        controls.panSpeed = 1 * mouseWheelVal;
                        if ($('#' + currentId).find('.thumbtack-wrapper').hasClass('active')) {
                            controls.enabled = true;
                        } else {
                            controls.enabled = false;
                        }
                    }

                    var rect = element.getBoundingClientRect();
                    if (rect.bottom < 0 || rect.top > this.renderer.domElement.clientHeight ||
                        rect.right < 0 || rect.left > this.renderer.domElement.clientWidth) {
                        return;
                    }

                    var width = rect.right - rect.left;
                    var height = rect.bottom - rect.top;
                    var left = rect.left;
                    var bottom = this.renderer.domElement.clientHeight - rect.bottom;

                    // console.log('width', width, 'height', height, 'left', left, 'bottom', bottom);

                    this.renderer.setViewport(left, bottom, width, height);
                    this.renderer.setScissor(left, bottom, width, height);

                    var camera = scene.userData.camera;
                    if (!!camera) {
                        this.renderer.render(scene, camera);
                        this.renderer.autoClear = false;
                    }
                });
            }

        },


        _updateSize: function () {
            var cWidth = canvas.clientWidth;
            var cHeight = canvas.clientHeight;

            if (canvas.width !== cWidth || canvas.height !== cHeight) {
                this.renderer.setSize(cWidth, cHeight, false);
            }
        },

    };


    // Reader for supported model formats

    /**
     * Read Model files.
     * 
     * Currently supported: 
     * pmx, pmd, fbx, obj, glTF, glTF(Draco), vrm
     *
     * @param {Blob} files - The set of blob files
     * @param {object} mousePos - The set of current mouse position
     * @param {object} progSet - The set of states for a progress bar
     */
    function Reader() {}

    Reader.prototype = {
        constructor: Reader,

        options: {},

        read: function (files, mousePos, progSet) {
            var rootFileName, rootFilePath;
            var mtlFileName, mtlFilePath;
            var baseURL;
            var modelFormat;

            var blobs = {};

            var id = readFileEve.addFileWrap(mousePos);
            var scene = threeEve.setScene(id);

            Array.from(files).forEach((file) => {
                if (readFileEve.isSupported(file.name)) {
                    initTarget(file);
                } else if (/\.(mtl)$/i.test(file.name)) {
                    initMtl(file);
                } else {
                    blobs[file.name] = file;
                    // console.log('blobs', blobs);
                }
            });


            function initTarget(file) {
                rootFilePath = URL.createObjectURL(file);
                baseURL = THREE.LoaderUtils.extractUrlBase(rootFilePath);
                rootFileName = rootFilePath.replace(baseURL, '');
                blobs[rootFileName] = file;
                modelFormat = file.name.split('.').pop().toLowerCase();
                // console.log('blobs', blobs, 'baseURL', baseURL, 'rootFilePath', rootFilePath);
            }


            function initMtl(file) {
                mtlFilePath = URL.createObjectURL(file);
                baseURL = THREE.LoaderUtils.extractUrlBase(mtlFilePath);
                mtlFileName = mtlFilePath.replace(baseURL, '');
                blobs[mtlFileName] = file;
                // console.log('blobs', blobs);
            }


            var mmd_flg = modelFormat == 'pmx' | modelFormat == 'pmd' ? 1 : 0;
            var fbx_flg = modelFormat == 'fbx' ? 1 : 0;
            var obj_flg = modelFormat == 'obj' ? 1 : 0;
            var gltf_flg = modelFormat == 'gltf' ? 1 : 0;
            var vrm_flg = modelFormat == 'v' ? 1 : 0;


            var manager = new THREE.LoadingManager();
            manager.setURLModifier((url) => {
                // console.log('url', url);

                var isMMD = mmd_flg && !url.match(/base64/);
                var isGLTF = gltf_flg && !url.match(/canvas-eve/);

                if (isMMD | isGLTF | fbx_flg | obj_flg | vrm_flg) {
                    var n = url.replace(baseURL, '');
                    url = URL.createObjectURL(blobs[n]);
                }

                // console.log('url', url, 'fileName', n, 'blobs[n]', blobs[n]);
                return url;
            });

            manager.onStart = function (url, itemsLoaded, itemsTotal) {
                // console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');

                if (progSet.iterate == 0) {
                    progSet.progress.classList.add('loading');
                }
            };

            manager.onProgress = function (url, itemsLoaded, itemsTotal) {
                // console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');

                progSet.iterate++;
                // console.log('progSet.iterate', progSet.iterate);

                if (progSet.iterate < progSet.fileCount) {
                    progSet.totalProg = progSet.eachProg * progSet.iterate;
                    progSet.progress.style.width = progSet.totalProg + '%';
                    // console.log('progSet.totalProg', progSet.totalProg);
                }
            };

            manager.onLoad = function () {
                // console.log('Loading complete!');

                progSet.progress.style.width = '100%';
                setTimeout(function () {
                    progSet.progress.classList.remove('loading');
                    $('div').remove('.hide-scissor');
                }, 1000);
            };

            manager.onError = function (url) {
                // console.log('There was an error loading ' + url);
            };


            switch (modelFormat) {
                case 'obj':
                    if (mtlFileName) {
                        loaderEve.MTLLoader(manager, scene, rootFilePath, mtlFilePath);
                    } else {
                        loaderEve.OBJLoader(manager, scene, rootFilePath);
                    }
                    break;

                case 'fbx':
                    loaderEve.FBXLoader(manager, scene, rootFilePath);
                    break;

                case 'pmx':
                case 'pmd':
                    loaderEve.MMDLoader(manager, scene, rootFilePath, modelFormat);
                    break;

                case 'gltf':
                    loaderEve.GLTFLoader(manager, scene, rootFilePath);
                    break;

                case 'vrm':
                    loaderEve.VRMLoader(manager, scene, rootFilePath);
                    break;

                default:
                    break;
            }
        },


        addFileWrap: function (mousePos) {
            newFile.id += 1;
            HIGHEST_Z_INDEX += 1;


            const funcTags = '<div class="thumbtack-wrapper"></div><div class="resize-wrapper"></div><div class="trash-wrapper"></div>';
            const assertFile = '<div id ="' + newFile.id + '" class="glsl file-wrap" style="transition: ' + IS_TRANSITION + ';"><div class="function-wrapper">' + funcTags + '</div><div class="eve-main"></div></div>';
            $('#add-files').append(assertFile);


            const hide = $('<div class="hide-scissor"></div>').css({
                'left': mousePos.left * mouseWheelVal - 600 / 2 + 'px',
                'top': mousePos.top * mouseWheelVal - 600 / 2 + 'px',
                'transform': 'translate(' + xNewMinus + 'px, ' + yNewMinus + 'px' + ')',
            });
            $('#add-files').append(hide);


            const fileId = '#' + newFile.id;
            const $fileId = $(fileId);


            $fileId.css({
                'left': mousePos.left * mouseWheelVal - 600 / 2 + 'px',
                'top': mousePos.top * mouseWheelVal - 600 / 2 + 'px',
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


            return newFile.id;
        },


        //


        drop: function () {
            canvasEveWrap.addEventListener('dragover', readFileEve.handleDragEvent, false);
            canvasEveWrap.addEventListener('drop', readFileEve.handleDropEvent, false);
        },


        //


        handleDragEvent: function (e) {
            e.preventDefault();
            e.stopPropagation();
            e.dataTransfer.dropEffect = 'copy';
            // Not clear why this will help. I should have to reset pointer-events, but still works fine
            $('iframe').css('pointer-events', 'none');
        },


        //


        handleDropEvent: function (e) {
            e.stopPropagation();
            e.preventDefault();

            let x, y;
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

            const files = e.dataTransfer.files;
            // console.log('files', files);


            const progSet = {
                progress: document.getElementById('progress-bar'),
                fileCount: files.length,
                eachProg: parseFloat(100 / files.length),
                totalProg: 0,
                iterate: 0
            };


            if (progSet.fileCount > 0) {
                var supported_model_flg = false;
                var modelFormat;
                Array.from(files).forEach((file) => {
                    if (readFileEve.isSupported(file.name)) {
                        supported_model_flg = true;
                        modelFormat = file.name.split('.').pop().toLowerCase();
                        // console.log('modelFormat', modelFormat);
                    }
                });
                if (supported_model_flg == true) {

                    readFileEve.reader(files, mousePos, progSet);

                }
            } else {
                return;
            }
        },


        isSupported: function (fileName) {
            return /\.(obj|fbx|pmx|pmd|gltf|vrm)$/i.test(fileName);
        }
    };


    // Loader for supported model formats

    /**
     * Load Model files.
     * 
     * Currently supported: 
     * pmx, pmd, fbx, obj, glTF, glTF(Draco), vrm
     *
     * @param {object} manager - THREE.LoadingManager()
     * @param {object} scene - THREE.Scene()
     * @param {object} materials - Get materials from MTLLoader(), and set it to OBJLoader()
     * @param {string} rootFilePath - In-memory blob url to Model file
     * @param {string} modelFormat - Get Model format for MMDLoader()
     * @param {string} mtlFilePath - In-memory blob url to MTL file
     */
    function Loader() {}

    Loader.prototype = {
        constructor: Loader,

        options: {},


        MMDLoader: function (manager, scene, rootFilePath, modelFormat) {
            var loader = new THREE.MMDLoader(manager);
            loader.modelFormat = modelFormat;
            loader.load(

                rootFilePath,

                function (mmd) {

                    this._fit2Scene(scene, mmd, false);

                    // var box = new THREE.BoxHelper(mmd, 0xffff00);
                    // scene.add(box);

                    scene.add(mmd);

                }

            );
        },


        FBXLoader: function (manager, scene, rootFilePath) {
            var loader = new THREE.FBXLoader(manager);
            loader.load(

                rootFilePath,

                function (fbx) {

                    fbx.traverse(function (child) {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                            child.material.transparent = true;
                            child.material.alphaTest = 0.5;
                        }
                    });

                    this._fit2Scene(scene, fbx, false);

                    scene.add(fbx);

                }

            );
        },


        MTLLoader: function (manager, scene, rootFilePath, mtlFilePath) {
            var mtlLoader = new THREE.MTLLoader(manager);
            mtlLoader.load(

                mtlFilePath,

                function (materials) {

                    materials.preload();

                    this.OBJLoader(manager, scene, rootFilePath, materials);

                }

            );
        },


        OBJLoader: function (manager, scene, rootFilePath, materials) {
            var loader = new THREE.OBJLoader(manager);
            if (materials) {
                loader.setMaterials(materials);
            }
            loader.load(

                rootFilePath,

                function (obj) {

                    obj.traverse(function (child) {
                        if (child.isMesh) {
                            // child.material.map = texture;
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });

                    this._fit2Scene(scene, obj, false);

                    scene.add(obj);

                }

            );
        },


        GLTFLoader: function (manager, scene, rootFilePath) {
            var loader = new THREE.GLTFLoader(manager);
            var dracoLoader = new THREE.DRACOLoader(manager);
            dracoLoader.setDecoderPath('/js/works/webservice/canvas-eve/three/module/draco/');
            loader.setDRACOLoader(dracoLoader);
            loader.load(

                rootFilePath,

                function (gltf) {

                    this._fit2Scene(scene, gltf.scene, false);

                    scene.add(gltf.scene);

                }

            );
        },


        VRMLoader: function (manager, scene, rootFilePath) {
            var loader = new THREE.GLTFLoader(manager);
            loader.load(

                rootFilePath,

                function (gltf) {

                    THREE.VRM.from(gltf).then((vrm) => {

                        this._fit2Scene(scene, vrm.scene, true);

                        scene.add(vrm.scene);

                    });

                }

            );
        },


        _fit2Scene: function (scene, object, bool) {
            var fovy = 40;
            var camera = new THREE.PerspectiveCamera(fovy, 1, 0.1, 20000);

            var BB = new THREE.Box3().setFromObject(object);
            var centerpoint = BB.getCenter();
            var size = BB.getSize();
            var backup = (size.y / 2) / Math.sin((camera.fov / 2) * (Math.PI / 180));
            if (size.x > size.y) {
                backup = (size.x / 2) / Math.sin((camera.fov / 2) * (Math.PI / 180));
            }
            var camZpos = BB.max.z + backup + camera.near;
            if (bool) {
                camZpos = -camZpos;
            }

            camera.position.set(centerpoint.x, centerpoint.y, camZpos);
            camera.far = camera.near + 300 * size.z;
            camera.updateProjectionMatrix();

            scene.userData.camera = camera;

            var controls = new THREE.OrbitControls(scene.userData.camera, scene.userData.element);
            controls.target.set(0, size.y / 2, 0);
            controls.enableKeys = false;
            controls.screenSpacePanning = true;
            controls.update();
            scene.userData.controls = controls;
        },


    };


    return Three;

})(window, jQuery);

// const three = new CANVASEVE.Three();
// console.log(three);


//
// Model`s directories => /js/works/webservice/canvas-eve/three/model/
//

var scenes = [],
    renderer;
const canvas = document.getElementById("c");
const canvasEveWrap = document.getElementById("canvas-eve-wrapper");

const loaderEve = {

    VRMLoader: (manager, scene, rootFilePath) => {
        var loader = new THREE.GLTFLoader(manager);
        loader.load(

            rootFilePath,

            function (gltf) {

                THREE.VRM.from(gltf).then((vrm) => {

                    threeEve.fit2Scene(scene, vrm.scene, true);

                    scene.add(vrm.scene);

                });

            }

        );
    },


    //


    GLTFLoader: (manager, scene, rootFilePath) => {
        var loader = new THREE.GLTFLoader(manager);
        var dracoLoader = new THREE.DRACOLoader(manager);
        dracoLoader.setDecoderPath('/js/works/webservice/canvas-eve/three/module/draco/');
        loader.setDRACOLoader(dracoLoader);
        loader.load(

            rootFilePath,

            function (gltf) {

                threeEve.fit2Scene(scene, gltf.scene, false);

                scene.add(gltf.scene);

            }

        );
    },


    //


    OBJLoader: (manager, scene, rootFilePath, materials) => {
        var loader = new THREE.OBJLoader(manager);
        if (materials) {
            loader.setMaterials(materials);
        }
        loader.load(

            rootFilePath,

            function (obj) {

                obj.traverse(function (child) {
                    if (child.isMesh) {
                        // child.material.map = texture;
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });

                threeEve.fit2Scene(scene, obj, false);

                scene.add(obj);

            }

        );
    },


    //


    MTLLoader: (manager, scene, rootFilePath, mtlFilePath) => {
        var mtlLoader = new THREE.MTLLoader(manager);
        mtlLoader.load(

            mtlFilePath,

            function (materials) {

                materials.preload();

                loaderEve.OBJLoader(manager, scene, rootFilePath, materials);

            }

        );
    },


    //


    FBXLoader: (manager, scene, rootFilePath) => {
        var loader = new THREE.FBXLoader(manager);
        loader.load(

            rootFilePath,

            function (fbx) {

                fbx.traverse(function (child) {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                        child.material.transparent = true;
                        child.material.alphaTest = 0.5;
                    }
                });

                threeEve.fit2Scene(scene, fbx, false);

                scene.add(fbx);

            }

        );
    },


    //


    MMDLoader: (manager, scene, rootFilePath, modelFormat) => {
        var loader = new THREE.MMDLoader(manager);
        loader.modelFormat = modelFormat;
        loader.load(

            rootFilePath,

            function (mmd) {

                threeEve.fit2Scene(scene, mmd, false);

                // var box = new THREE.BoxHelper(mmd, 0xffff00);
                // scene.add(box);

                scene.add(mmd);

            }

        );
    },


};


const readFileEve = {

    reader: (files, mousePos, progSet) => {
        var rootFileName, rootFilePath;
        var mtlFileName, mtlFilePath;
        var baseURL;
        var modelFormat;

        var blobs = {};

        var id = readFileEve.addFileWrap(mousePos);
        var scene = threeEve.setScene(id);

        Array.from(files).forEach((file) => {
            if (readFileEve.isSupported(file.name)) {
                initTarget(file);
            } else if (/\.(mtl)$/i.test(file.name)) {
                initMtl(file);
            } else {
                blobs[file.name] = file;
                // console.log('blobs', blobs);
            }
        });


        function initTarget(file) {
            rootFilePath = URL.createObjectURL(file);
            baseURL = THREE.LoaderUtils.extractUrlBase(rootFilePath);
            rootFileName = rootFilePath.replace(baseURL, '');
            blobs[rootFileName] = file;
            modelFormat = file.name.split('.').pop().toLowerCase();
            // console.log('blobs', blobs, 'baseURL', baseURL, 'rootFilePath', rootFilePath);
        }


        function initMtl(file) {
            mtlFilePath = URL.createObjectURL(file);
            baseURL = THREE.LoaderUtils.extractUrlBase(mtlFilePath);
            mtlFileName = mtlFilePath.replace(baseURL, '');
            blobs[mtlFileName] = file;
            // console.log('blobs', blobs);
        }


        var mmd_flg = modelFormat == 'pmx' | modelFormat == 'pmd' ? 1 : 0;
        var fbx_flg = modelFormat == 'fbx' ? 1 : 0;
        var obj_flg = modelFormat == 'obj' ? 1 : 0;
        var gltf_flg = modelFormat == 'gltf' ? 1 : 0;
        var vrm_flg = modelFormat == 'v' ? 1 : 0;


        var manager = new THREE.LoadingManager();
        manager.setURLModifier((url) => {
            // console.log('url', url);

            var isMMD = mmd_flg && !url.match(/base64/);
            var isGLTF = gltf_flg && !url.match(/canvas-eve/);

            if (isMMD | isGLTF | fbx_flg | obj_flg | vrm_flg) {
                var n = url.replace(baseURL, '');
                url = URL.createObjectURL(blobs[n]);
            }

            // console.log('url', url, 'fileName', n, 'blobs[n]', blobs[n]);
            return url;
        });

        manager.onStart = function (url, itemsLoaded, itemsTotal) {
            // console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');

            if (progSet.iterate == 0) {
                progSet.progress.classList.add('loading');
            }
        };

        manager.onProgress = function (url, itemsLoaded, itemsTotal) {
            // console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');

            progSet.iterate++;
            // console.log('progSet.iterate', progSet.iterate);

            if (progSet.iterate < progSet.fileCount) {
                progSet.totalProg = progSet.eachProg * progSet.iterate;
                progSet.progress.style.width = progSet.totalProg + '%';
                // console.log('progSet.totalProg', progSet.totalProg);
            }
        };

        manager.onLoad = function () {
            // console.log('Loading complete!');

            progSet.progress.style.width = '100%';
            setTimeout(function () {
                progSet.progress.classList.remove('loading');
                $('div').remove('.hide-scissor');
            }, 1000);
        };

        manager.onError = function (url) {
            // console.log('There was an error loading ' + url);
        };


        switch (modelFormat) {
            case 'obj':
                if (mtlFileName) {
                    loaderEve.MTLLoader(manager, scene, rootFilePath, mtlFilePath);
                } else {
                    loaderEve.OBJLoader(manager, scene, rootFilePath);
                }
                break;

            case 'fbx':
                loaderEve.FBXLoader(manager, scene, rootFilePath);
                break;

            case 'pmx':
            case 'pmd':
                loaderEve.MMDLoader(manager, scene, rootFilePath, modelFormat);
                break;

            case 'gltf':
                loaderEve.GLTFLoader(manager, scene, rootFilePath);
                break;

            case 'vrm':
                loaderEve.VRMLoader(manager, scene, rootFilePath);
                break;

            default:
                break;
        }

    },


    //


    addFileWrap: (mousePos) => {
        newFile.id += 1;
        HIGHEST_Z_INDEX += 1;


        const funcTags = '<div class="thumbtack-wrapper"></div><div class="resize-wrapper"></div><div class="trash-wrapper"></div>';
        const assertFile = '<div id ="' + newFile.id + '" class="glsl file-wrap" style="transition: ' + IS_TRANSITION + ';"><div class="function-wrapper">' + funcTags + '</div><div class="eve-main"></div></div>';
        $('#add-files').append(assertFile);


        const hide = $('<div class="hide-scissor"></div>').css({
            'left': mousePos.left * mouseWheelVal - 600 / 2 + 'px',
            'top': mousePos.top * mouseWheelVal - 600 / 2 + 'px',
            'transform': 'translate(' + xNewMinus + 'px, ' + yNewMinus + 'px' + ')',
        });
        $('#add-files').append(hide);


        const fileId = '#' + newFile.id;
        const $fileId = $(fileId);


        $fileId.css({
            'left': mousePos.left * mouseWheelVal - 600 / 2 + 'px',
            'top': mousePos.top * mouseWheelVal - 600 / 2 + 'px',
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


        return newFile.id;
    },


    //


    drop: () => {
        canvasEveWrap.addEventListener('dragover', readFileEve.handleDragEvent, false);
        canvasEveWrap.addEventListener('drop', readFileEve.handleDropEvent, false);
    },


    //


    handleDragEvent: (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'copy';
        // Not clear why this will help. I should have to reset pointer-events, but still works fine
        $('iframe').css('pointer-events', 'none');
    },


    //


    handleDropEvent: (e) => {
        e.stopPropagation();
        e.preventDefault();

        let x, y;
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

        const files = e.dataTransfer.files;
        // console.log('files', files);


        const progSet = {
            progress: document.getElementById('progress-bar'),
            fileCount: files.length,
            eachProg: parseFloat(100 / files.length),
            totalProg: 0,
            iterate: 0
        };


        if (progSet.fileCount > 0) {
            var supported_model_flg = false;
            var modelFormat;
            Array.from(files).forEach((file) => {
                if (readFileEve.isSupported(file.name)) {
                    supported_model_flg = true;
                    modelFormat = file.name.split('.').pop().toLowerCase();
                    // console.log('modelFormat', modelFormat);
                }
            });
            if (supported_model_flg == true) {

                readFileEve.reader(files, mousePos, progSet);

            }
        } else {
            return;
        }
    },


    //


    isSupported: (fileName) => {
        return /\.(obj|fbx|pmx|pmd|gltf|vrm)$/i.test(fileName);
    }

};


const threeEve = {
    init: () => {
        readFileEve.drop();

        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true,
        });
        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
    },


    //


    setScene: (id) => {
        var scene = new THREE.Scene();

        scene.userData.element = document.getElementById(id).getElementsByClassName('eve-main')[0];

        scene.add(new THREE.HemisphereLight(0xaaaaaa, 0x444444));

        var light = new THREE.DirectionalLight(0xffffff, 0.5);
        light.position.set(1, 1, 1);
        scene.add(light);

        scenes.push(scene);

        return scene;
    },


    //


    fit2Scene: (scene, object, bool) => {
        var fovy = 40;
        var camera = new THREE.PerspectiveCamera(fovy, 1, 0.1, 20000);

        var BB = new THREE.Box3().setFromObject(object);
        var centerpoint = BB.getCenter();
        var size = BB.getSize();
        var backup = (size.y / 2) / Math.sin((camera.fov / 2) * (Math.PI / 180));
        if (size.x > size.y) {
            backup = (size.x / 2) / Math.sin((camera.fov / 2) * (Math.PI / 180));
        }
        var camZpos = BB.max.z + backup + camera.near;
        if (bool) {
            camZpos = -camZpos;
        }

        camera.position.set(centerpoint.x, centerpoint.y, camZpos);
        camera.far = camera.near + 300 * size.z;
        camera.updateProjectionMatrix();

        scene.userData.camera = camera;

        var controls = new THREE.OrbitControls(scene.userData.camera, scene.userData.element);
        controls.target.set(0, size.y / 2, 0);
        controls.enableKeys = false;
        controls.screenSpacePanning = true;
        controls.update();
        scene.userData.controls = controls;
    },


    //


    animate: () => {
        threeEve.render();
        // requestAnimationFrame(threeEve.animate);
        setTimeout(function () {
            requestAnimationFrame(threeEve.animate);
        }, 1000 / 120);
    },


    //


    updateSize: () => {
        var cWidth = canvas.clientWidth;
        var cHeight = canvas.clientHeight;

        if (canvas.width !== cWidth || canvas.height !== cHeight) {
            renderer.setSize(cWidth, cHeight, false);
        }
    },


    //


    render: () => {
        threeEve.updateSize();

        renderer.setScissorTest(false);
        renderer.clear(true, true);
        renderer.setScissorTest(true);

        if (!!scenes[0]) {
            scenes.forEach(function (scene) {

                var element = scene.userData.element;

                var controls = scene.userData.controls;
                if (!!controls) {
                    controls.rotateSpeed = 1 * mouseWheelVal;
                    controls.panSpeed = 1 * mouseWheelVal;
                    if ($('#' + currentId).find('.thumbtack-wrapper').hasClass('active')) {
                        controls.enabled = true;
                    } else {
                        controls.enabled = false;
                    }
                }

                var rect = element.getBoundingClientRect();
                if (rect.bottom < 0 || rect.top > renderer.domElement.clientHeight ||
                    rect.right < 0 || rect.left > renderer.domElement.clientWidth) {
                    return;
                }

                var width = rect.right - rect.left;
                var height = rect.bottom - rect.top;
                var left = rect.left;
                var bottom = renderer.domElement.clientHeight - rect.bottom;

                // console.log('width', width, 'height', height, 'left', left, 'bottom', bottom);

                renderer.setViewport(left, bottom, width, height);
                renderer.setScissor(left, bottom, width, height);

                var camera = scene.userData.camera;
                if (!!camera) {
                    renderer.render(scene, camera);
                    renderer.autoClear = false;
                }
            });
        }

    }
};
threeEve.init();
threeEve.animate();