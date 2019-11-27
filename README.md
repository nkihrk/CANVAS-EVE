# <p align="middle"><font color="#c1125b">C</font>ANVAS EVE</p>

<p align="middle">CANVAS EVE is a daily-use canvas which will be helpful in various ways ;
<br>Use it as references, memos, image-preview, etc.
<br><a href="https://nkihrk.github.io/CANVAS-EVE/"><b>DEMO</b></a>
</p>

![CANVAS EVE](assets/img/readme/chrome_2019-11-24_20-13-10.png)

> Heads up : This project is currently under development. It won`t be stable for now.

<br>

# 💡 Current Features

- **Drag'n'Drop** single or multiple files on the app
  - Supported file formats :
    - jpg/png/gif/svg/bmp/psd
    - obj(mtl)/fbx/gltf(bin)/vrm/pmx/pmd
- **Paste** a single file to the app
  - Supported file formats : jpg/png/gif/svg/bmp/psd
- **Play YouTube** on the app with browser-like-window
- **Color Picker** for images
- **Pen/Eraser** for drawing
- **Zoom In/Out** with mousewheel rotation
- **Move** around the canvas with mousewheel
- **Resize/Pinned/Rotate/Flip** files on the canvas
- **Single/Multiple Selection** on the canvas
- **Auto-Aligment** for files with `Ctrl + Arrow key`
- **Photoshop-like UI**
- **Right-Click Context Menu**

<br>

# ⛏️ How To Build

```
$ cd CANVAS-EVE/
$ npm install
$ npm run build
```

Use Webpack's web-dev-server to host a local server( `http://localhost:8080/` )

```
$ npm run start_win // For windows user
$ npm run start_linux // For linux user
```

<br>

# 📝 Future Release Notes

Last updated : November 27, 2019

- Make the app cross-browser and cross-platform. Will be launched as both a web service and native apps.
- Switching tool-tabs with a click
- Moving tools to other sidebars
- In-app browser
- Split view
- Multiple canvas creating and its management system
- GLSL node editor
- Text editor
- Music player
- Stopwatch and timer
- OCR

<br>

# 💪 Currently Working On...

Last updated : November 27, 2019

- Photoshop-like UI. This will be finished in the near future
- Link Pinterest with the app to get images from user`s boards
- High-performance tuning for the engine
- Loading PDF

<br>

# ⚙️ How To Use

🏷️ `Pen and eraser`

![CANVAS EVE](assets/img/readme/bandicam&#32;2019-11-27&#32;12-19-08-135.gif)

🏷️ `Playing Youtube videos` including playlists.

![CANVAS EVE](assets/img/readme/bandicam&#32;2019-11-27&#32;21-22-03-281.gif)

🏷️ `Color picker`. Only image formats are suppported for now.

![CANVAS EVE](assets/img/readme/bandicam&#32;2019-11-27&#32;21-34-00-379.gif)

🏷️ `Loading PSD`. Will implement layer extracting feature in the future.

![CANVAS EVE](assets/img/readme/bandicam&#32;2019-11-27&#32;21-37-51-047.gif)

🏷️ `Auto-aligment` for multiple files on the canvas. Press `Ctrl + Arrow key` to wake up the auto-aligment.

![CANVAS EVE](assets/img/readme/bandicam&#32;2019-11-27&#32;21-40-36-827.gif)

🏷️ Loading `FBX`. Currently TGA texture format is not supported.

![CANVAS EVE](assets/img/readme/bandicam&#32;2019-11-27&#32;21-42-26-007.gif)

🏷️ Loading `GLTF`. Currently Binary glTF is not supported. Draco compressed glTF in the same.

![CANVAS EVE](assets/img/readme/bandicam&#32;2019-11-27&#32;21-44-43-687.gif)

🏷️ Loading `pmx/pmd(MMD)`. Will implement a loader for VMD motion files

![CANVAS EVE](assets/img/readme/bandicam&#32;2019-11-27&#32;21-45-15-661.gif)

🏷️ Loading `OBJ(and MTL)`

![CANVAS EVE](assets/img/readme/bandicam&#32;2019-11-27&#32;21-47-42-462.gif)

🏷️ Loading `VRM`

![CANVAS EVE](assets/img/readme/bandicam&#32;2019-11-27&#32;21-48-12-560.gif)

<br>

# 🦟 Bug Report

If you find bugs, please report to me opening new issues on GitHub.
