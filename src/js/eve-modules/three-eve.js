/* eslint-disable node/no-unsupported-features/node-builtins */
/**
 *
 * 3D Model loader for CANVAS EVE.
 *
 * Dependencies
 * - jQuery 3.4.1
 * - global-eve
 * - lib-eve
 *
 */

import jQuery from 'jquery';
import * as THREE from 'three';
import { VRM } from '@pixiv/three-vrm';

import LibEve from '../common/lib-eve';
import GlbEve from '../common/global-eve';
import { OrbitControls } from '../three-modules/OrbitControls';
import { FBXLoader } from '../three-modules/FBXLoader';
import { DRACOLoader } from '../three-modules/DRACOLoader';
import { GLTFLoader } from '../three-modules/GLTFLoader';
import { OBJLoader } from '../three-modules/OBJLoader';
import { MTLLoader } from '../three-modules/MTLLoader';
import { MMDLoader } from '../three-modules/MMDLoader';

const ThreeEve = (function(w, $) {
  /**
   * Load model files.
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

    MMDLoader(manager, scene, rootFilePath, modelFormat) {
      const self = this;
      const loader = new MMDLoader(manager);
      loader.modelFormat = modelFormat;
      loader.load(rootFilePath, mmd => {
        self._fit2Scene(scene, mmd, false);
        // var box = new THREE.BoxHelper(mmd, 0xffff00);
        // scene.add(box);
        scene.add(mmd);
      });
    },

    //

    FBXLoader(manager, scene, rootFilePath) {
      const self = this;
      const loader = new FBXLoader(manager);
      loader.load(rootFilePath, fbx => {
        fbx.traverse(child => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material.transparent = true;
            child.material.alphaTest = 0.5;
          }
        });

        self._fit2Scene(scene, fbx, false);
        scene.add(fbx);
      });
    },

    //

    MTLLoader(manager, scene, rootFilePath, mtlFilePath) {
      const self = this;
      const mtlLoader = new MTLLoader(manager);
      mtlLoader.load(mtlFilePath, materials => {
        materials.preload();
        self.OBJLoader(manager, scene, rootFilePath, materials);
      });
    },

    //

    OBJLoader(manager, scene, rootFilePath, materials) {
      const self = this;
      const loader = new OBJLoader(manager);
      if (materials) {
        loader.setMaterials(materials);
      }
      loader.load(rootFilePath, obj => {
        obj.traverse(child => {
          if (child.isMesh) {
            // child.material.map = texture;
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        self._fit2Scene(scene, obj, false);
        scene.add(obj);
      });
    },

    //

    GLTFLoader(manager, scene, rootFilePath) {
      const self = this;
      const loader = new GLTFLoader(manager);
      const dracoLoader = new DRACOLoader(manager);
      dracoLoader.setDecoderPath('../three-modules/draco/'); // This path is incorrect when with a Node.js module. It won't refer correct path
      loader.setDRACOLoader(dracoLoader);
      loader.load(rootFilePath, gltf => {
        self._fit2Scene(scene, gltf.scene, false);
        scene.add(gltf.scene);
      });
    },

    //

    VRMLoader(manager, scene, rootFilePath) {
      const self = this;
      const loader = new GLTFLoader(manager);
      loader.load(rootFilePath, gltf => {
        VRM.from(gltf).then(vrm => {
          self._fit2Scene(scene, vrm.scene, true);
          scene.add(vrm.scene);
        });
      });
    },

    //

    _fit2Scene(scene, object, bool) {
      const fovy = 40;
      const camera = new THREE.PerspectiveCamera(fovy, 1, 0.1, 20000);

      const BB = new THREE.Box3().setFromObject(object);
      const centerpoint = BB.getCenter();
      const size = BB.getSize();
      let backup = size.y / 2 / Math.sin((camera.fov / 2) * (Math.PI / 180));
      if (size.x > size.y) {
        backup = size.x / 2 / Math.sin((camera.fov / 2) * (Math.PI / 180));
      }
      let camZpos = BB.max.z + backup + camera.near;
      if (bool) {
        camZpos = -camZpos;
      }

      camera.position.set(centerpoint.x, centerpoint.y, camZpos);
      camera.far = camera.near + 300 * size.z;
      camera.updateProjectionMatrix();

      scene.userData.camera = camera;

      const controls = new OrbitControls(scene.userData.camera, scene.userData.element);
      controls.target.set(0, size.y / 2, 0);
      controls.enableKeys = false;
      controls.screenSpacePanning = true;
      controls.update();
      scene.userData.controls = controls;
    }
  };

  /**
   * Read model files.
   *
   * @param {blob} files - The set of blob files
   * @param {object} mousePos - The set of current mouse positions
   * @param {object} progSet - The set of states for a progress bar
   */
  function Reader(scenes) {
    this.canvasEveWrap = document.getElementById('canvas-eve-wrapper');
    this.Loader = new Loader();
    this.scenes = scenes;
  }

  Reader.prototype = {
    constructor: Reader,

    options: {},

    drop() {
      const self = this;

      this.canvasEveWrap.addEventListener('dragover', self._handleDragEvent, false);
      this.canvasEveWrap.addEventListener(
        'drop',
        function(e) {
          self._handleDropEvent(e);
        },
        false
      );
    },

    //

    _handleDragEvent(e) {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = 'copy';
      // Not clear why this will help. I should have to reset pointer-events, but still works fine
      $('iframe').css('pointer-events', 'none');
    },

    //

    _handleDropEvent(e) {
      e.stopPropagation();
      e.preventDefault();

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

      const { files } = e.dataTransfer;
      // console.log('files', files);

      const progSet = {
        progress: document.getElementById('progress-bar'),
        fileCount: files.length,
        eachProg: parseFloat(100 / files.length),
        totalProg: 0,
        iterate: 0
      };

      if (progSet.fileCount > 0) {
        let supportedModelFlg = false;
        Array.from(files).forEach(file => {
          if (this._isSupported(file.name)) {
            supportedModelFlg = true;
          }
        });
        if (supportedModelFlg === true) {
          this.read(files, this.scenes, mousePos, progSet);
        }
      }
    },

    //

    _isSupported(fileName) {
      return /\.(obj|fbx|pmx|pmd|gltf|vrm)$/i.test(fileName);
    },

    //

    read(files, scenes, mousePos, progSet) {
      let rootFileName;
      let rootFilePath;
      let mtlFileName;
      let mtlFilePath;
      let baseURL;
      let modelFormat;

      const blobs = {};
      const id = this._addFileWrap(mousePos);
      const scene = this._setScene(id, scenes);

      function initTarget(file) {
        rootFilePath = URL.createObjectURL(file);
        baseURL = THREE.LoaderUtils.extractUrlBase(rootFilePath);
        rootFileName = rootFilePath.replace(baseURL, '');
        blobs[rootFileName] = file;
        modelFormat = file.name
          .split('.')
          .pop()
          .toLowerCase();
        console.log('blobs', blobs, 'baseURL', baseURL, 'rootFilePath', rootFilePath);
      }

      function initMtl(file) {
        mtlFilePath = URL.createObjectURL(file);
        baseURL = THREE.LoaderUtils.extractUrlBase(mtlFilePath);
        mtlFileName = mtlFilePath.replace(baseURL, '');
        blobs[mtlFileName] = file;
        console.log('blobs', blobs);
      }

      Array.from(files).forEach(file => {
        if (this._isSupported(file.name)) {
          initTarget(file);
        } else if (/\.(mtl)$/i.test(file.name)) {
          initMtl(file);
        } else {
          blobs[file.name] = file;
          console.log('blobs', blobs);
        }
      });

      const mmdFlg = !!(modelFormat === 'pmx' || modelFormat === 'pmd');
      const fbxFlg = modelFormat === 'fbx';
      const objFlg = modelFormat === 'obj';
      const gltfFlg = modelFormat === 'gltf';
      // const vrmFlg = modelFormat === 'vrm';

      const manager = new THREE.LoadingManager();
      manager.setURLModifier(url => {
        console.log('url', url);

        const isMMD = mmdFlg && !url.match(/base64/);
        const isGLTF = gltfFlg && !url.match(/draco/);

        let n;
        if (isMMD || isGLTF || fbxFlg || objFlg) {
          n = url.replace(baseURL, '');
          url = URL.createObjectURL(blobs[n]);
        }

        console.log('url', url, 'fileName', n, 'blobs[n]', blobs[n]);
        return url;
      });

      manager.onStart = function() {
        if (progSet.iterate === 0) {
          progSet.progress.classList.add('loading');
        }
      };

      manager.onProgress = function() {
        progSet.iterate++;

        if (progSet.iterate < progSet.fileCount) {
          progSet.totalProg = progSet.eachProg * progSet.iterate;
          progSet.progress.style.width = `${progSet.totalProg}%`;
        }
      };

      manager.onLoad = function() {
        progSet.progress.style.width = '100%';
        setTimeout(function() {
          progSet.progress.classList.remove('loading');
          $('div').remove('.hide-scissor');
        }, 1000);
      };

      manager.onError = function(url) {
        console.log(`There was an error loading ${url}`);
      };

      switch (modelFormat) {
        case 'obj':
          if (mtlFileName) {
            this.Loader.MTLLoader(manager, scene, rootFilePath, mtlFilePath);
          } else {
            this.Loader.OBJLoader(manager, scene, rootFilePath);
          }
          break;

        case 'fbx':
          this.Loader.FBXLoader(manager, scene, rootFilePath);
          break;

        case 'pmx':
        case 'pmd':
          this.Loader.MMDLoader(manager, scene, rootFilePath, modelFormat);
          break;

        case 'gltf':
          this.Loader.GLTFLoader(manager, scene, rootFilePath);
          break;

        case 'vrm':
          this.Loader.VRMLoader(manager, scene, rootFilePath);
          break;

        default:
          break;
      }
    },

    //

    _setScene(id, scenes) {
      const scene = new THREE.Scene();

      // eslint-disable-next-line prefer-destructuring
      scene.userData.element = document.getElementById(id).getElementsByClassName('eve-main')[0];
      scene.add(new THREE.HemisphereLight(0xaaaaaa, 0x444444));

      const light = new THREE.DirectionalLight(0xffffff, 0.5);
      light.position.set(1, 1, 1);
      scene.add(light);

      scenes.push(scene);

      return scene;
    },

    //

    _addFileWrap(mousePos) {
      GlbEve.newFileId += 1;
      GlbEve.HIGHEST_Z_INDEX += 1;

      const IS_TRANSITION = 'width .1s, height .1s, top .1s, left .1s';
      const funcTags =
        '<div class="thumbtack-wrapper"></div><div class="resize-wrapper"></div><div class="trash-wrapper"></div>';
      const assertFile = `<div id ="${GlbEve.newFileId}" class="glsl file-wrap" style="transition: ${IS_TRANSITION};"><div class="function-wrapper">${funcTags}</div><div class="eve-main"></div></div>`;
      $('#add-files').append(assertFile);

      const hide = $('<div class="hide-scissor"></div>').css({
        left: `${mousePos.left * GlbEve.mouseWheelVal - 600 / 2}px`,
        top: `${mousePos.top * GlbEve.mouseWheelVal - 600 / 2}px`,
        transform: `translate(${GlbEve.xNewMinus}px, ${GlbEve.yNewMinus}px)`
      });
      $('#add-files').append(hide);

      const fileId = `#${GlbEve.newFileId}`;
      const $fileId = $(fileId);

      $fileId.css({
        left: `${mousePos.left * GlbEve.mouseWheelVal - 600 / 2}px`,
        top: `${mousePos.top * GlbEve.mouseWheelVal - 600 / 2}px`,
        transform: `translate(${GlbEve.xNewMinus}px, ${GlbEve.yNewMinus}px)`,
        'z-index': GlbEve.HIGHEST_Z_INDEX
      });

      // For colpick-eve.js
      if ($('#toggle-colpick').length > 0) {
        if (!$('#toggle-colpick').hasClass('active')) {
          $fileId.addClass('grab-pointer');
        }
      } else {
        $fileId.addClass('grab-pointer');
      }

      return GlbEve.newFileId;
    }
  };

  /**
   * Entry point for ThreeEve.
   *
   *Currently supported:
   * - pmx, pmd
   * - fbx
   * - obj, mtl
   * - glTF
   * - vrm
   */
  function Three() {
    LibEve.call(this);

    this.scenes = [];
    this.renderer = null; // lazy load
    this.canvas = document.getElementById('c');
    this.Reader = new Reader(this.scenes);
  }

  const modules = { ...LibEve.prototype };

  Three.prototype = Object.assign(modules, {
    constructor: Three,

    options: {},

    load() {
      this.init();
      this.animate();
    },

    //

    init() {
      this.Reader.drop();

      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
        alpha: true
      });
      this.renderer.setClearColor(0x000000, 0);
      this.renderer.setPixelRatio(w.devicePixelRatio);
      this.renderer.shadowMap.enabled = true;
    },

    //

    animate() {
      const self = this;
      self._render();
      requestAnimationFrame(() => {
        self.animate();
      });
      // setTimeout(function() {
      //   requestAnimationFrame(this.animate());
      // }, 1000 / 120);
    },

    //

    _render() {
      this._updateSize();

      this.renderer.setScissorTest(false);
      this.renderer.clear(true, true);
      this.renderer.setScissorTest(true);

      if (this.scenes[0]) {
        const self = this;
        this.scenes.forEach(scene => {
          const { element } = scene.userData;

          const { controls } = scene.userData;
          if (controls) {
            controls.rotateSpeed = 1 * GlbEve.mouseWheelVal;
            controls.panSpeed = 1 * GlbEve.mouseWheelVal;
            if (
              $(`#${GlbEve.currentId}`)
                .find('.thumbtack-wrapper')
                .hasClass('active')
            ) {
              controls.enabled = true;
            } else {
              controls.enabled = false;
            }
          }

          const rect = element.getBoundingClientRect();
          if (
            rect.bottom < 0 ||
            rect.top > self.renderer.domElement.clientHeight ||
            rect.right < 0 ||
            rect.left > self.renderer.domElement.clientWidth
          ) {
            return;
          }

          const width = rect.right - rect.left;
          const height = rect.bottom - rect.top;
          const { left } = rect;
          const bottom = self.renderer.domElement.clientHeight - rect.bottom;
          // console.log('width', width, 'height', height, 'left', left, 'bottom', bottom);

          self.renderer.setViewport(left, bottom, width, height);
          self.renderer.setScissor(left, bottom, width, height);

          const { camera } = scene.userData;
          if (camera) {
            self.renderer.render(scene, camera);
            self.renderer.autoClear = false;
          }
        });
      }
    },

    //

    _updateSize() {
      const cWidth = this.canvas.clientWidth;
      const cHeight = this.canvas.clientHeight;

      if (this.canvas.width !== cWidth || this.canvas.height !== cHeight) {
        this.renderer.setSize(cWidth, cHeight, false);
      }
    }
  });

  return Three;
})(window, jQuery);

export default ThreeEve;
