///
/// The template code for each -eve.js
///
// (function (window, $) {
//     const hogeEve = () => {
//         // Flags
//         const flgs = {
//             'hoge_flg': false,
//         };


//         ///


//         // Initialize values
//         const init = () => {
//             $(document).on(EVENTNAME_TOUCHSTART, function (e) {});
//         };
//         init();


//         const Update = function () {
//             $(document).on(EVENTNAME_TOUCHMOVE, function (e) {});
//         };
//         Update();


//         // Configuring flags
//         const configFlgs = () => {
//             // Activate flags
//             const activate = () => {
//                 $(document).on('mousedown', function (e) {
//                     if (e.button == 1) {
//                         flgs.hoge_flg = true;
//                         console.log('flgs.hoge_flg', flgs.hoge_flg);
//                     }
//                 });
//             };
//             activate();

//             // Reset flags
//             $(document).on('mouseup', function (e) {
//                 if (flgs.hoge_flg == true) {
//                     flgs.hoge_flg = false;
//                     console.log('flgs.hoge_flg', flgs.hoge_flg);
//                 }
//             });
//         };
//         configFlgs();


//         // Execute if flags are true
//         const main = () => {
//             $(document).mousemove(function (e) {
//                 // Prevent from the default drag events
//                 e.preventDefault();

//                 if (flgs.hoge_flg == true) {

//                 }
//             });
//         };
//         main();


//     };
//     hogeEve();
// })(window, jQuery);


///


// Namespace
var CANVASEVE = CANVASEVE || {};


// Variables
// Update the newFile when adding a new file
var newFile = {
    'id': 0,
};

// A current selected .file-wrap
var currentId = null;

// Global flags
const glFlgs = {
    'config': {
        'only_draggable_flg': false,
        'no_zooming_flg': false,
    },
    'canvas': {
        'drag_flg': false,
        'rotate_flg': false,
        'mousedown_flg': false,
        'resize_flg': false,
        'thumbtack_flg': false,
        're': {
            'left_top_flg': false,
            'right_top_flg': false,
            'right_bottom_flg': false,
            'left_bottom_flg': false,
        },
        'ro': {
            'left_top_flg': false,
            'right_top_flg': false,
            'right_bottom_flg': false,
            'left_bottom_flg': false,
        }
    },
    'colpick': {
        'active_spuit_flg': false,
        'move_circle_flg': false,
    },
    'oekaki': {
        'move_wheelcircle_flg': false,
        'move_trianglecircle_flg': false,
    },
};

// A max length of the HIGHEST_Z_INDEX is 2147483647
var HIGHEST_Z_INDEX = 1;

// API_KEY
var config = {
    'youtube': {
        API_KEY: null,
    },
    'twitter': {
        MY_KEY: null,
        SECRET_KEY: null,
        KEY_2: null
    }
};

// The global variables of the real-time coordinates of a mouse pointer. It will change its value depending on the devices: Smartphone or PC
var clientX, clientY;

// The value of a current mouse wheel
var mouseWheelVal = 1;
var xNew = 0;
var yNew = 0;
var xNewMinus = -xNew;
var yNewMinus = -yNew;

// The scree-space mouse coordinates from a zoom coordinate
var clientFromZoomX, clientFromZoomY;


///


// https: //stackoverflow.com/questions/3515446/jquery-mousewheel-detecting-when-the-wheel-stops
// Detect if it`s wheeling or not
const detectWheeling = () => {
    var wheeldelta = {
        x: 0,
        y: 0
    };
    var wheeling;
    $(document).on('mousewheel', function (e) {
        if (!wheeling) {
            console.log('start wheeling!');
        }

        if ($('#toggle-colpick').hasClass('active')) {
            clearTimeout(wheeling);
            wheeling = setTimeout(function () {
                console.log('stop wheeling!');
                wheeling = undefined;

                // reset wheeldelta
                wheeldelta.x = 0;
                wheeldelta.y = 0;
            }, 100);
        }

        wheeldelta.x += e.deltaFactor * e.deltaX;
        wheeldelta.y += e.deltaFactor * e.deltaY;
        console.log(wheeldelta);
    });
};

// Functions
// Get transform values of a specific selector
const transformValue = function (e) {
    let values = e.split('(')[1];
    values = values.split(')')[0];
    values = values.split(', ');
    const matrix = {
        'scaleX': values[0],
        'rotateP': values[1],
        'rotateM': values[2],
        'scaleY': values[3],
        'transformX': values[4],
        'transformY': values[5],
    };
    return matrix;
};

// Get a target`s specific transform-rotate value, and return the value as radian. The value will be in between 0 and 2PI
const getRotationRad = function (obj) {
    var matrix = obj.css("-webkit-transform") ||
        obj.css("-moz-transform") ||
        obj.css("-ms-transform") ||
        obj.css("-o-transform") ||
        obj.css("transform");
    if (matrix !== 'none') {
        var values = matrix.split('(')[1].split(')')[0].split(',');
        var a = values[0];
        var b = values[1];
        var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
    } else {
        var angle = 0;
    }
    return (angle < 0) ? (angle + 360) / 180 * Math.PI : angle / 180 * Math.PI;
}

// Calcurate radians. The value will be in between 0 and 2PI
const calcRadians = function (x, y) {
    var rad = Math.atan2(y, x) / Math.PI * 180 + (Math.atan2(y, x) > 0 ? 0 : 360);
    // console.log('The radian value : ' + rad);

    return rad / 180 * Math.PI;
};

const debugCircle = function (name, col, posX, posY, insertToWhichTag) {
    if (insertToWhichTag) {
        $('#' + insertToWhichTag).append('<div id="' + name + '"></div>')
    } else {
        $('#canvas-eve').append('<div id="' + name + '"></div>');
    }
    $('#' + name).css({
        'top': posY + 'px',
        'left': posX + 'px',
        'width': 14 + 'px',
        'height': 14 + 'px',
        'background': col,
        'border-radius': 50 + '%',
        'position': 'absolute',
        'z-index': 999,
        'transform': 'translateX(-50%) translateY(-50%)',
        'opacity': 0.8,
    });
};

// For the iframe pointer problem
const iframePointerNone = function () {
    $('iframe').css('pointer-events', 'none');
};
const iframePointerReset = function () {
    $('iframe').css('pointer-events', '');
};

// Just for separation
const sep = () => console.log('-------------------------------------');

function namespace(ns) {
    var names = ns.split('.');
    var parent = window;

    for (var i = 0, len = names.length; i < len; i++) {
        parent[names[i]] = parent[names[i]] || {};
        parent = parent[names[i]];
    }
    return parent;
}


///


// Implement touch events for smart-phone
// To check whether we can use the touch event or not
var supportTouch = 'ontouchend' in document;
console.log('supportTouch', supportTouch);
var supportPointer = 'onpointerup' in document;
console.log('supportPointer', supportPointer);

var EVENTNAME_TOUCHSTART = supportTouch ? 'touchstart' : 'mousedown';
var EVENTNAME_TOUCHMOVE = supportTouch ? 'touchmove' : 'mousemove';
var EVENTNAME_TOUCHEND = supportTouch ? 'touchend' : 'mouseup';

var IS_TRANSITION = supportTouch ? '' : 'width .1s, height .1s, top .1s, left .1s';
$('.file-wrap').css('transition', IS_TRANSITION);

const preventDefault = (e) => {
    e.preventDefault();
};
window.addEventListener('touchmove', preventDefault, {
    passive: false
});
window.removeEventListener('touchmove', preventDefault, {
    passive: false
});


// Update the coordinates of a mouse pointer
$(document).on(EVENTNAME_TOUCHMOVE, function (e) {
    if (e.originalEvent.changedTouches) {
        clientX = e.originalEvent.changedTouches[0].clientX;
        clientY = e.originalEvent.changedTouches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }

    clientFromZoomX = clientX - $('#zoom').offset().left;
    clientFromZoomY = clientY - $('#zoom').offset().top;
});


// Prevent default right-click events for the time being
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
}, false);

// document.addEventListener('touchstart', function (e) {
//     e.preventDefault();
// }, false);
// document.addEventListener('touchmove', function (e) {
//     e.preventDefault();
// }, false);