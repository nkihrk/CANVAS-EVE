/* eslint-disable node/no-unsupported-features/node-builtins */
/**
 *
 * Model loader for CANVAS EVE.
 *
 * Dependencies
 * - jquery-eve
 * - glb-eve
 *
 */

import {
  Box3,
  PerspectiveCamera,
  LoaderUtils,
  LoadingManager,
  Scene,
  HemisphereLight,
  DirectionalLight,
  WebGLRenderer
} from 'three';
import { VRM } from '@pixiv/three-vrm';

import $ from '../common/jquery-eve';
import GlbEve from '../common/glb-eve';
import { OrbitControls } from '../three-modules/OrbitControls';
import { FBXLoader } from '../three-modules/FBXLoader';
import { DRACOLoader } from '../three-modules/DRACOLoader';
import { GLTFLoader } from '../three-modules/GLTFLoader';
import { OBJLoader } from '../three-modules/OBJLoader';
import { MTLLoader } from '../three-modules/MTLLoader';
import { MMDLoader } from '../three-modules/MMDLoader';

const ThreeEve = ((W, D, M) => {
  /**
   * Load model files.
   *
   * @param {object} manager - LoadingManager()
   * @param {object} scene - Scene()
   * @param {object} materials - Get materials from MTLLoader(), and set it to OBJLoader()
   * @param {string} rootFilePath - In-memory blob url to a model file
   * @param {string} modelFormat - Get Model format for MMDLoader()
   * @param {string} mtlFilePath - In-memory blob url to a MTL file
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
      const camera = new PerspectiveCamera(fovy, 1, 0.1, 20000);

      const BB = new Box3().setFromObject(object);
      const centerpoint = BB.getCenter();
      const size = BB.getSize();
      let backup = size.y / 2 / M.sin((camera.fov / 2) * (M.PI / 180));
      if (size.x > size.y) backup = size.x / 2 / M.sin((camera.fov / 2) * (M.PI / 180));
      let camZpos = BB.max.z + backup + camera.near;
      if (bool) camZpos = -camZpos;

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
    this.canvasEveWrap = D.getElementById('canvas-eve-wrapper');
    this.Loader = new Loader();
    this.scenes = scenes;
  }

  Reader.prototype = {
    constructor: Reader,

    options: {},

    dragOverEvent(e) {
      this._handleDragEvent(e);
    },

    //

    dropEvent(e) {
      this._handleDropEvent(e);
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
        progress: D.getElementById('progress-bar'),
        fileCount: files.length,
        eachProg: parseFloat(100 / files.length),
        totalProg: 0,
        iterate: 0
      };

      if (progSet.fileCount > 0) {
        let supportedModelFlg = false;
        Array.from(files).forEach(file => {
          if (this._isSupported(file.name)) supportedModelFlg = true;
        });
        if (supportedModelFlg === true) this._read(files, this.scenes, mousePos, progSet);
      }
    },

    //

    _read(files, scenes, mousePos, progSet) {
      let rootFileName;
      let rootFilePath;
      let mtlFileName;
      let mtlFilePath;
      let baseURL;
      let modelFormat;

      const blobs = {};
      const id = this._addFileWrap(mousePos);
      const scene = this._setScene(id, scenes);

      function __initTarget(file) {
        rootFilePath = URL.createObjectURL(file);
        baseURL = LoaderUtils.extractUrlBase(rootFilePath);
        rootFileName = rootFilePath.replace(baseURL, '');
        blobs[rootFileName] = file;
        modelFormat = file.name
          .split('.')
          .pop()
          .toLowerCase();
        console.log('blobs', blobs, 'baseURL', baseURL, 'rootFilePath', rootFilePath);
      }

      function __initMtl(file) {
        mtlFilePath = URL.createObjectURL(file);
        baseURL = LoaderUtils.extractUrlBase(mtlFilePath);
        mtlFileName = mtlFilePath.replace(baseURL, '');
        blobs[mtlFileName] = file;
        console.log('blobs', blobs);
      }

      Array.from(files).forEach(file => {
        if (this._isSupported(file.name)) {
          __initTarget(file);
        } else if (/\.(mtl)$/i.test(file.name)) {
          __initMtl(file);
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

      const manager = new LoadingManager();
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

      manager.onStart = () => {
        if (progSet.iterate === 0) progSet.progress.classList.add('loading');
      };

      manager.onProgress = () => {
        progSet.iterate++;

        if (progSet.iterate < progSet.fileCount) {
          progSet.totalProg = progSet.eachProg * progSet.iterate;
          progSet.progress.style.width = `${progSet.totalProg}%`;
        }
      };

      manager.onLoad = () => {
        progSet.progress.style.width = '100%';
        setTimeout(() => {
          progSet.progress.classList.remove('loading');
          $('.hide-scissor').remove();
        }, 1000);
      };

      manager.onError = url => {
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

    _isSupported(fileName) {
      return /\.(obj|fbx|pmx|pmd|gltf|vrm)$/i.test(fileName);
    },

    //

    _setScene(id, scenes) {
      const scene = new Scene();

      // eslint-disable-next-line prefer-destructuring
      scene.userData.element = D.getElementById(id).getElementsByClassName('eve-main')[0];
      scene.add(new HemisphereLight(0xaaaaaa, 0x444444));

      const light = new DirectionalLight(0xffffff, 0.5);
      light.position.set(1, 1, 1);
      scene.add(light);

      scenes.push(scene);

      return scene;
    },

    //

    _addFileWrap(mousePos) {
      GlbEve.NEWFILE_ID += 1;
      GlbEve.HIGHEST_Z_INDEX += 1;
      GlbEve.CURRENT_ID = GlbEve.NEWFILE_ID;

      const funcTags =
        '<div class="thumbtack-wrapper"></div><div class="resize-wrapper"></div><div class="trash-wrapper"></div>';
      const assertFile = `<div id ="${GlbEve.NEWFILE_ID}" class="glsl file-wrap" style="transition: ${GlbEve.IS_TRANSITION};"><div class="function-wrapper">${funcTags}</div><div class="eve-main"></div></div>`;
      $('#add-files').append(assertFile);

      const hideScissor = D.createElement('div');
      $('#add-files').append(hideScissor);
      hideScissor.classList.add('hide-scissor');
      $(hideScissor).css({
        left: `${mousePos.left * GlbEve.MOUSE_WHEEL_VAL - 600 / 2}px`,
        top: `${mousePos.top * GlbEve.MOUSE_WHEEL_VAL - 600 / 2}px`
      });

      const fileId = `#${GlbEve.NEWFILE_ID}`;
      const $fileId = $(fileId);

      $fileId.css({
        left: `${mousePos.left * GlbEve.MOUSE_WHEEL_VAL - 600 / 2}px`,
        top: `${mousePos.top * GlbEve.MOUSE_WHEEL_VAL - 600 / 2}px`,
        'z-index': GlbEve.HIGHEST_Z_INDEX
      });

      // For colpick-eve.js
      if ($('#toggle-colpick').length > 0) {
        if (!$('#toggle-colpick').hasClass('active')) $fileId.addClass('grab-pointer');
      } else {
        $fileId.addClass('grab-pointer');
      }

      return GlbEve.NEWFILE_ID;
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
    this.scenes = [];
    this.renderer = null; // lazy load
    this.canvas = D.getElementById('c');
    this.Reader = new Reader(this.scenes);
  }

  const modules = {};

  Three.prototype = Object.assign(modules, {
    constructor: Three,

    options: {},

    load() {
      this.init();
      this.animate();
    },

    //

    init() {
      this.renderer = new WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
        alpha: true
      });
      this.renderer.setClearColor(0x000000, 0);
      this.renderer.setPixelRatio(W.devicePixelRatio);
      this.renderer.shadowMap.enabled = true;
    },

    //

    animate() {
      const self = this;
      self._render();
      setTimeout(() => {
        requestAnimationFrame(() => {
          self.animate();
        });
      }, 1000 / 120);
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
            controls.rotateSpeed = 1 * GlbEve.MOUSE_WHEEL_VAL;
            controls.panSpeed = 1 * GlbEve.MOUSE_WHEEL_VAL;

            if (
              $(`#${GlbEve.CURRENT_ID}`)
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

      if (this.canvas.width !== cWidth || this.canvas.height !== cHeight)
        this.renderer.setSize(cWidth, cHeight, false);
    }
  });

  return Three;
})(window, document, Math);

export default ThreeEve;
