(function($) {
  // Drag-and-Paste event
  const canvasEve = function() {
    const file = {
      $fileId: null,
      fileId: 0,
      //
      fileIdPos: 0,
      //
      fileIdRelPosX: 0,
      fileIdRelPosY: 0,
      //
      fileIdWidth: 0,
      fileIdHeight: 0,
      //
      fileIdRatio: 0,
      fileIdTheta: 0,
      //
      rotatedSize: {
        width: 0,
        height: 0
      },
      rotatedCenterPos: {
        left: 0,
        top: 0
      }
    };

    // Stored datas temporarily
    const tmp = {
      ro: {
        left_top_initRad: null,
        right_top_initRad: null,
        right_bottom_initRad: null,
        left_bottom_initRad: null,
        //
        left_top_pos: null,
        right_top_pos: null,
        right_bottom_pos: null,
        left_bottom_pos: null
      }
    };

    const resizeBox =
      '<div class="re-left-top"></div>' +
      '<div class="re-right-top"></div>' +
      '<div class="re-right-bottom"></div>' +
      '<div class="re-left-bottom"></div>';

    const rotateBox =
      '<div class="ro-left-top"></div>' +
      '<div class="ro-right-top"></div>' +
      '<div class="ro-right-bottom"></div>' +
      '<div class="ro-left-bottom"></div>';

    const updateUiVal = function() {
      // Update values according to a mouseWheelVal
      // A selected area
      $('#canvas-eve .selected').css({
        top: -1 * mouseWheelVal + 'px',
        left: -1 * mouseWheelVal + 'px',
        // 'width': 'calc(100% + ' + 2 * mouseWheelVal + 'px)',
        // 'height': 'calc(100% + ' + 2 * mouseWheelVal + 'px)',
        'border-width': mouseWheelVal + 'px'
      });

      // Icons
      $('.thumbtack-icon').css({
        width: 30 * mouseWheelVal + 'px',
        height: 40 * mouseWheelVal + 'px'
      });
      $('.resize-icon').css({
        width: 30 * mouseWheelVal + 'px',
        height: 30 * mouseWheelVal + 'px'
      });
      $('.rotate-icon').css({
        width: 30 * mouseWheelVal + 'px',
        height: 30 * mouseWheelVal + 'px'
      });
      $('.flip-icon').css({
        width: 30 * mouseWheelVal + 'px',
        height: 26 * mouseWheelVal + 'px'
      });
      $('.trash-icon').css({
        width: 30 * mouseWheelVal + 'px',
        height: 35 * mouseWheelVal + 'px'
      });

      // Function wrapper
      $('.function-wrapper').css({
        right: -70 * mouseWheelVal + 'px'
      });
      $('.function-wrapper>div:not(:last-of-type)').css({
        'margin-bottom': 15 * mouseWheelVal + 'px'
      });

      // Resize
      $('.re-left-top, .re-right-top, .re-right-bottom, .re-left-bottom').css({
        width: 10 * mouseWheelVal + 'px',
        height: 10 * mouseWheelVal + 'px',
        'border-width': 1 * mouseWheelVal + 'px'
      });
      $('.re-left-top').css({
        top: -6 * mouseWheelVal + 'px',
        left: -6 * mouseWheelVal + 'px'
      });
      $('.re-right-top').css({
        top: -6 * mouseWheelVal + 'px',
        right: -6 * mouseWheelVal + 'px'
      });
      $('.re-right-bottom').css({
        bottom: -6 * mouseWheelVal + 'px',
        right: -6 * mouseWheelVal + 'px'
      });
      $('.re-left-bottom').css({
        bottom: -6 * mouseWheelVal + 'px',
        left: -6 * mouseWheelVal + 'px'
      });

      // Rotate
      $('.ro-left-top, .ro-right-top, .ro-right-bottom, .ro-left-bottom').css({
        width: 20 * mouseWheelVal + 'px',
        height: 20 * mouseWheelVal + 'px'
      });
      $('.ro-left-top').css({
        top: -30 * mouseWheelVal + 'px',
        left: -30 * mouseWheelVal + 'px'
      });
      $('.ro-right-top').css({
        top: -30 * mouseWheelVal + 'px',
        right: -30 * mouseWheelVal + 'px'
      });
      $('.ro-right-bottom').css({
        bottom: -30 * mouseWheelVal + 'px',
        right: -30 * mouseWheelVal + 'px'
      });
      $('.ro-left-bottom').css({
        bottom: -30 * mouseWheelVal + 'px',
        left: -30 * mouseWheelVal + 'px'
      });
    };

    //////

    // Prefix for pasted-images. Initialize the values
    const init = function() {
      $(document).on(EVENTNAME_TOUCHSTART, '.file-wrap', function(e) {
        // console.log('mousedown .file-wrap is detected.');

        // To restrict preferred functions
        if ($(this).find('only-draggable').length > 0) {
          glFlgs.config.only_draggable_flg = true;
        } else {
          glFlgs.config.only_draggable_flg = false;
        }
        // To restrict zooming
        if (
          $(this)
            .children()
            .hasClass('no-zooming')
        ) {
          glFlgs.config.no_zooming_flg = true;
        } else {
          glFlgs.config.no_zooming_flg = false;
        }

        // Update the flag if spuit is active. colpick-eve.js
        // Initialize the flag first
        glFlgs.colpick.active_spuit_flg = false;
        // Check whether there exists #toggle-colpick or not at first, and check whether spuit is active or not next.
        // "$(this).find('#toggle-colpick').length == 0" means that this .file-wrap is not a colpick board
        if (
          $(this).find('#toggle-colpick').length == 0 &&
          $('#toggle-colpick').hasClass('active')
        ) {
          glFlgs.colpick.active_spuit_flg = true;
        }
        // console.log('glFlgs.colpick.active_spuit_flg is', glFlgs.colpick.active_spuit_flg);

        // Initialize a thumbtack flag, and insert a boolean value if pinning is active
        glFlgs.canvas.thumbtack_flg = false;
        if (
          $(this)
            .find('.thumbtack-wrapper')
            .hasClass('active')
        ) {
          glFlgs.canvas.thumbtack_flg = true;
        }
        // console.log('glFlgs.canvas.thumbtack_flg is', glFlgs.canvas.thumbtack_flg);

        // This if argument is the prefix for plain-eve.js
        if (e.button != 1) {
          // $('div').removeClass('selected');
          $('div').remove('.selected');
          $('div').remove('.thumbtack-icon');
          $('div').remove('.resize-icon');
          $('div').remove('.rotate-icon');
          $('div').remove('.flip-icon');
          $('div').remove('.trash-icon');

          $('div').remove('.re-left-top');
          $('div').remove('.re-right-top');
          $('div').remove('.re-right-bottom');
          $('div').remove('.re-left-bottom');

          $('div').remove('.ro-left-top');
          $('div').remove('.ro-right-top');
          $('div').remove('.ro-right-bottom');
          $('div').remove('.ro-left-bottom');

          // This if argument is the prefix for colpick-eve.js
          if (glFlgs.colpick.active_spuit_flg == false) {
            $(this).prepend('<div class="selected"></div>');
            // Added selected symbols and other functions
            if (glFlgs.config.only_draggable_flg == false) {
              // Resizing boxes
              if (
                $(this)
                  .find('.resize-wrapper')
                  .hasClass('active')
              ) {
                $(this).prepend(resizeBox);
              }
              if (
                $(this)
                  .find('.rotate-wrapper')
                  .hasClass('active')
              )
                $(this).prepend(rotateBox); // Rotating circles

              $(this)
                .find('.thumbtack-wrapper')
                .prepend('<div class="thumbtack-icon"></div>'); // Add a thumbtack icon
              $(this)
                .find('.resize-wrapper')
                .prepend('<div class="resize-icon"></div>'); // Add a resizing icon
              $(this)
                .find('.rotate-wrapper')
                .prepend('<div class="rotate-icon"></div>'); // Add a rotating icon
              $(this)
                .find('.flip-wrapper')
                .prepend('<div class="flip-icon"></div>'); // Add a flipping icon
              $(this)
                .find('.trash-wrapper')
                .prepend('<div class="trash-icon"></div>'); // Add a trash icon

              // Update values according to a mouseWheelVal
              updateUiVal();
            }

            // Add #id to #image, and initialize its values
            if (glFlgs.canvas.drag_flg == false) {
              file.fileId = '#' + $(this).attr('id');
              file.$fileId = $(file.fileId);
              // Global value for the selected ID
              currentId = $(this).attr('id');
              // console.log('id : ' + $(this).attr('id'));

              file.fileIdWidth = file.$fileId.outerWidth();
              file.fileIdHeight = file.$fileId.outerHeight();
              file.fileIdRatio = file.fileIdHeight / file.fileIdWidth;

              file.fileIdTheta = getRotationRad(file.$fileId);
              // console.log('file.fileIdTheta : ' + file.fileIdTheta);
              file.rotatedSize.width =
                file.fileIdWidth * Math.abs(Math.cos(file.fileIdTheta)) +
                file.fileIdHeight * Math.abs(Math.sin(file.fileIdTheta));
              file.rotatedSize.height =
                file.fileIdHeight * Math.abs(Math.cos(file.fileIdTheta)) +
                file.fileIdWidth * Math.abs(Math.sin(file.fileIdTheta));

              file.fileIdPos = file.$fileId.offset();
              // console.log('file.fileIdPos', file.fileIdPos);

              file.fileIdRelPosX = clientX - file.fileIdPos.left;
              file.fileIdRelPosY = clientY - file.fileIdPos.top;
              // debugCircle('test-pos_1', 'blue', file.fileIdPos.left, file.fileIdPos.top);
              // debugCircle('test-pos_4', 'white', file.fileIdRelPosX, file.fileIdRelPosY);

              // Initialize file.rotatedCenterPos. These are screen-space coordinates
              file.rotatedCenterPos.left =
                file.$fileId.offset().left + file.rotatedSize.width / 2 / mouseWheelVal;
              file.rotatedCenterPos.top =
                file.$fileId.offset().top + file.rotatedSize.height / 2 / mouseWheelVal;

              // Initialize the initRads for a rotating function
              tmp.ro.left_top_initRad = calcRadians(-file.fileIdWidth / 2, -file.fileIdHeight / 2);
              tmp.ro.right_top_initRad = calcRadians(file.fileIdWidth / 2, -file.fileIdHeight / 2);
              tmp.ro.right_bottom_initRad = calcRadians(
                file.fileIdWidth / 2,
                file.fileIdHeight / 2
              );
              tmp.ro.left_bottom_initRad = calcRadians(
                -file.fileIdWidth / 2,
                file.fileIdHeight / 2
              );

              // Set the $fileId to be the highest of all the other unselected elements
              HIGHEST_Z_INDEX += 1;
              file.$fileId.css('z-index', HIGHEST_Z_INDEX);
              glFlgs.canvas.drag_flg = true;
              // console.log('glFlgs.canvas.drag_flg is ' + glFlgs.canvas.drag_flg);
            }
          }
        }
      });
    };
    init();

    // Reset a selected area
    const reset = function() {
      $(document).on(EVENTNAME_TOUCHSTART, '#reset-res', function(e) {
        // console.log('mousedown #reset-res is detected.');
        // For #reset-res to be excluded if e.button == 1. Go check the plain-eve.js
        if (e.button != 1) {
          e.stopPropagation();

          $('div').remove('.selected');

          $('div').remove('.thumbtack-icon');
          $('div').remove('.resize-icon');
          $('div').remove('.rotate-icon');
          $('div').remove('.flip-icon');
          $('div').remove('.trash-icon');

          $('div').remove('.re-left-top');
          $('div').remove('.re-right-top');
          $('div').remove('.re-right-bottom');
          $('div').remove('.re-left-bottom');

          $('div').remove('.ro-left-top');
          $('div').remove('.ro-right-top');
          $('div').remove('.ro-right-bottom');
          $('div').remove('.ro-left-bottom');
        }
      });
    };
    reset();

    // Update variables everytime a mousemove event is called on wherever
    const Update = function() {
      $(document).on(EVENTNAME_TOUCHMOVE, function() {
        // Set the #reset-res at a mouse pos
        // $('#reset-res').css({
        //     'left': clientX - 50 + 'px',
        //     'top': clientY - 50 + 'px',
        //     // 'left': clientFromZoomX * mouseWheelVal - 50 + 'px',
        //     // 'top': clientFromZoomY * mouseWheelVal - 50 + 'px',
        //     // 'transform': 'translate(' + xNewMinus + 'px, ' + yNewMinus + 'px' + ')',
        // });
        // if (file.$fileId.find('.canvas-colpick')) {
        //     file.$fileId.find('.canvas-colpick').attr('width', file.$fileId.width());
        //     file.$fileId.find('.canvas-colpick').attr('height', file.$fileId.height());
        // }
      });

      $(document).on(EVENTNAME_TOUCHEND, function() {
        // Refrash the rendering result of each canvas when changing its size. This canvas is for color picking. colpick-eve.js
        if (file.$fileId != null && file.$fileId.find('.canvas-colpick').length > 0) {
          setTimeout(function() {
            var img = new Image();
            img.src = file.$fileId.find('img').attr('src');
            img.onload = () => {
              file.$fileId
                .find('.canvas-colpick')[0]
                .getContext('2d')
                .drawImage(img, 0, 0, file.$fileId.width(), file.$fileId.height());
            };
            file.$fileId.find('.canvas-colpick').attr('width', file.$fileId.width());
            file.$fileId.find('.canvas-colpick').attr('height', file.$fileId.height());
          }, 100);
        }
      });

      $(document).on('mousewheel', function() {
        // Update values according to a mouseWheelVal
        setTimeout(function() {
          updateUiVal();
        }, 1);
      });
    };
    Update();

    // Configuring flags and icons
    const configFlgs = function() {
      const activateFlgs = function() {
        // Configuring flags for resizing function
        const resize = function() {
          const whichResizeBox = function(b, n) {
            $(document).on(EVENTNAME_TOUCHSTART, b, function(e) {
              // console.log('mousedown ' + b + ' is detected');
              iframePointerNone();

              if (glFlgs.canvas.mousedown_flg == false) {
                glFlgs.canvas.mousedown_flg = true;
                glFlgs.canvas.resize_flg = true;
                // console.log('glFlgs.canvas.mousedown_flg is ' + glFlgs.canvas.mousedown_flg);
                // console.log('glFlgs.canvas.resize_flg is ' + glFlgs.canvas.resize_flg);

                if (n == 0) {
                  glFlgs.canvas.re.left_top_flg = true;
                  // console.log('glFlgs.canvas.re.left_top_flg is ' + glFlgs.canvas.re.left_top_flg);
                }
                if (n == 1) {
                  glFlgs.canvas.re.right_top_flg = true;
                  // console.log('glFlgs.canvas.re.right_top_flg is ' + glFlgs.canvas.re.right_top_flg);
                }
                if (n == 2) {
                  glFlgs.canvas.re.right_bottom_flg = true;
                  // console.log('glFlgs.canvas.re.right_bottom_flg is ' + glFlgs.canvas.re.right_bottom_flg);
                }
                if (n == 3) {
                  glFlgs.canvas.re.left_bottom_flg = true;
                  // console.log('glFlgs.canvas.re.left_bottom_flg is ' + glFlgs.canvas.re.left_bottom_flg);
                }
              }
            });
          };
          whichResizeBox('.re-left-top', 0);
          whichResizeBox('.re-right-top', 1);
          whichResizeBox('.re-right-bottom', 2);
          whichResizeBox('.re-left-bottom', 3);
          sep();
        };
        resize();

        // Configuring flags for a rotating function and a reset function
        const rotate = function() {
          const whichRotateBox = function(b, n) {
            $(document).on(EVENTNAME_TOUCHSTART, b, function(e) {
              // console.log('mousedown ' + b + ' is detected');
              e.stopPropagation();
              iframePointerNone();

              if (glFlgs.canvas.rotate_flg == false) {
                glFlgs.canvas.mousedown_flg = true;
                glFlgs.canvas.drag_flg = false;
                glFlgs.canvas.rotate_flg = true;
                // console.log('glFlgs.canvas.mousedown_flg is ' + glFlgs.canvas.mousedown_flg);
                // console.log('glFlgs.canvas.drag_flg is ' + glFlgs.canvas.drag_flg);
                // console.log('glFlgs.canvas.rotate_flg is ' + glFlgs.canvas.rotate_flg);

                if (n == 0) {
                  glFlgs.canvas.ro.left_top_flg = true;
                  // console.log('glFlgs.canvas.ro.left_top_flg is ' + glFlgs.canvas.ro.left_top_flg);
                }
                if (n == 1) {
                  glFlgs.canvas.ro.right_top_flg = true;
                  // console.log('glFlgs.canvas.ro.right_top_flg is ' + glFlgs.canvas.ro.right_top_flg);
                }
                if (n == 2) {
                  glFlgs.canvas.ro.right_bottom_flg = true;
                  // console.log('glFlgs.canvas.ro.right_bottom_flg is ' + glFlgs.canvas.ro.right_bottom_flg);
                }
                if (n == 3) {
                  glFlgs.canvas.ro.left_bottom_flg = true;
                  // console.log('glFlgs.canvas.ro.left_bottom_flg is ' + glFlgs.canvas.ro.left_bottom_flg);
                }
              }
            });
          };
          whichRotateBox('.ro-left-top', 0);
          whichRotateBox('.ro-right-top', 1);
          whichRotateBox('.ro-right-bottom', 2);
          whichRotateBox('.ro-left-bottom', 3);
          sep();
        };
        rotate();

        // A flag for colpick`s bar circle. colpick-eve.js
        $(document).on(
          EVENTNAME_TOUCHSTART,
          '#red-cir-colpick, #green-cir-colpick, #blue-cir-colpick',
          function() {
            glFlgs.colpick.move_circle_flg = true;
          }
        );
      };
      activateFlgs();

      const resetFlgs = function() {
        $(document).on(EVENTNAME_TOUCHEND, function() {
          iframePointerReset();

          // A flag for colpick`s bar circle. colpick-eve.js
          if (glFlgs.colpick.move_circle_flg == true) {
            glFlgs.colpick.move_circle_flg = false;
            // console.log('glFlgs.colpick.move_circle_flg is ' + glFlgs.colpick.move_circle_flg);
          }

          // A flag for drag event
          if (glFlgs.canvas.drag_flg == true) {
            glFlgs.canvas.drag_flg = false;
            // console.log('glFlgs.canvas.drag_flg is ' + glFlgs.canvas.drag_flg);
          }

          // A flag for mousedown event
          if (glFlgs.canvas.mousedown_flg == true) {
            glFlgs.canvas.mousedown_flg = false;
            // console.log('glFlgs.canvas.mousedown_flg is ' + glFlgs.canvas.mousedown_flg);
          }

          // Flags for resizing
          if (glFlgs.canvas.resize_flg == true) {
            glFlgs.canvas.resize_flg = false;
            // console.log('glFlgs.canvas.resize_flg is ' + glFlgs.canvas.resize_flg);
          }
          if (glFlgs.canvas.re.left_top_flg == true) glFlgs.canvas.re.left_top_flg = false;
          if (glFlgs.canvas.re.right_top_flg == true) glFlgs.canvas.re.right_top_flg = false;
          if (glFlgs.canvas.re.right_bottom_flg == true) glFlgs.canvas.re.right_bottom_flg = false;
          if (glFlgs.canvas.re.left_bottom_flg == true) glFlgs.canvas.re.left_bottom_flg = false;

          // A flag for rotating
          if (glFlgs.canvas.rotate_flg == true) {
            glFlgs.canvas.rotate_flg = false;
            // console.log('glFlgs.canvas.rotate_flg is ' + glFlgs.canvas.rotate_flg);
          }
          if (glFlgs.canvas.ro.left_top_flg == true) glFlgs.canvas.ro.left_top_flg = false;
          if (glFlgs.canvas.ro.right_top_flg == true) glFlgs.canvas.ro.right_top_flg = false;
          if (glFlgs.canvas.ro.right_bottom_flg == true) glFlgs.canvas.ro.right_bottom_flg = false;
          if (glFlgs.canvas.ro.left_bottom_flg == true) glFlgs.canvas.ro.left_bottom_flg = false;

          sep();
        });
      };
      resetFlgs();

      // Show icons to be active, and do something if needed
      const clickedIcon = function() {
        // Activate pinning
        $(document).on(EVENTNAME_TOUCHSTART, '.thumbtack-icon', function(e) {
          // console.log('mousedown .thumbtack-icon is detected.');

          if (e.button != 1) {
            e.stopPropagation();
            $(this)
              .parents('.thumbtack-wrapper')
              .toggleClass('active');

            if (
              $(this)
                .parents('.thumbtack-wrapper')
                .hasClass('active')
            ) {
              glFlgs.canvas.thumbtack_flg = true;

              // Update values according to a mouseWheelVal
              updateUiVal();
            } else {
              glFlgs.canvas.thumbtack_flg = false;
            }
          }
        });

        // Activate resizing
        $(document).on(EVENTNAME_TOUCHSTART, '.resize-icon', function(e) {
          // console.log('mousedown .resize-icon is detected.');
          e.stopPropagation();

          if (e.button != 1) {
            e.stopPropagation();
            $(this)
              .parents('.resize-wrapper')
              .toggleClass('active');

            if (
              $(this)
                .parents('.resize-wrapper')
                .hasClass('active')
            ) {
              if (!file.$fileId.hasClass('ro-left-top')) {
                file.$fileId.prepend(resizeBox);

                // Update values according to a mouseWheelVal
                updateUiVal();
              }
            } else {
              file.$fileId.children('.re-left-top').remove();
              file.$fileId.children('.re-right-top').remove();
              file.$fileId.children('.re-right-bottom').remove();
              file.$fileId.children('.re-left-bottom').remove();
            }
          }
        });

        // Activate rotating
        $(document).on(EVENTNAME_TOUCHSTART, '.rotate-icon', function(e) {
          // console.log('mousedown .rotate-icon is detected.');

          if (e.button != 1) {
            e.stopPropagation();
            $(this)
              .parents('.rotate-wrapper')
              .toggleClass('active');

            if (
              $(this)
                .parents('.rotate-wrapper')
                .hasClass('active')
            ) {
              if (!file.$fileId.hasClass('ro-left-top')) {
                file.$fileId.removeClass('not-rotated');
                file.$fileId.prepend(rotateBox);

                // Update values according to a mouseWheelVal
                updateUiVal();
              }
            } else {
              file.$fileId.addClass('not-rotated');
              file.$fileId.children('.ro-left-top').remove();
              file.$fileId.children('.ro-right-top').remove();
              file.$fileId.children('.ro-right-bottom').remove();
              file.$fileId.children('.ro-left-bottom').remove();
            }
          }
        });

        // Activate flipping
        $(document).on(EVENTNAME_TOUCHSTART, '.flip-icon', function(e) {
          // console.log('mousedown .flip-icon is detected.');

          if (e.button != 1) {
            e.stopPropagation();
            $(this)
              .parents('.flip-wrapper')
              .toggleClass('active');

            if (
              $(this)
                .parents('.flip-wrapper')
                .hasClass('active')
            ) {
              $(file.fileId + ' .is-flipped').addClass('flipped');

              // Update values according to a mouseWheelVal
              updateUiVal();
            } else {
              $(file.fileId + ' .is-flipped').removeClass('flipped');
            }
          }
        });

        // Trash the selected element
        $(document).on(EVENTNAME_TOUCHSTART, '.trash-icon', function(e) {
          // console.log('mousedown .trash-icon is detected.');

          if (e.button != 1) {
            e.stopPropagation();
            $(this)
              .parents('.trash-wrapper')
              .toggleClass('active');

            if (
              $(this)
                .parents('.trash-wrapper')
                .hasClass('active')
            ) {
              $(file.fileId).remove();
            }
          }
        });

        sep();
      };
      clickedIcon();
    };
    configFlgs();

    // Execute if flags are true
    const main = function() {
      // Allow events when flags are in specific values
      $(document).on(EVENTNAME_TOUCHMOVE, function(e) {
        // Prevent from the default drag events
        e.preventDefault();

        var pClientX = clientFromZoomX;
        var pClientY = clientFromZoomY;
        var mousewheel_avail_flg = false;
        if (e.button == 1) {
          mousewheel_avail_flg = true;
        }

        // When an image is dragged
        const dragged = function() {
          let targetPosLeft, targetPosTop;
          let resLeft, resTop;

          // The element has a class .no_zooming
          if (glFlgs.config.no_zooming_flg == true) {
            targetPosLeft = clientX - file.fileIdRelPosX;
            targetPosTop = clientY - file.fileIdRelPosY;

            resLeft = (file.rotatedSize.width - file.fileIdWidth) / 2 + targetPosLeft;
            resTop = (file.rotatedSize.height - file.fileIdHeight) / 2 + targetPosTop;
          } else {
            targetPosLeft = pClientX - file.fileIdRelPosX;
            targetPosTop = pClientY - file.fileIdRelPosY;

            resLeft =
              (file.rotatedSize.width - file.fileIdWidth) / 2 + targetPosLeft * mouseWheelVal;
            resTop =
              (file.rotatedSize.height - file.fileIdHeight) / 2 + targetPosTop * mouseWheelVal;
          }

          if (
            mousewheel_avail_flg == false &&
            glFlgs.canvas.thumbtack_flg == false &&
            glFlgs.canvas.resize_flg == false &&
            glFlgs.canvas.rotate_flg == false
          ) {
            if (glFlgs.canvas.drag_flg == true) {
              if (
                glFlgs.oekaki.move_wheelcircle_flg == false &&
                glFlgs.oekaki.move_trianglecircle_flg == false &&
                glFlgs.colpick.active_spuit_flg == false &&
                glFlgs.colpick.move_circle_flg == false
              ) {
                file.$fileId.css({
                  left: resLeft + 'px',
                  top: resTop + 'px'
                });
              }

              // Update file.rotatedCenterPos for the later-use in rotating function
              file.rotatedCenterPos.left =
                file.$fileId.offset().left + file.rotatedSize.width / 2 / mouseWheelVal;
              file.rotatedCenterPos.top =
                file.$fileId.offset().top + file.rotatedSize.height / 2 / mouseWheelVal;
              // debugCircle('test-pos_3', 'orange', file.rotatedCenterPos.left, file.rotatedCenterPos.top);
              // console.log('drag function is called');
            }
          }
        };

        // When an image is rotated
        const rotated = function() {
          let fileCenterPosX = file.rotatedCenterPos.left;
          let fileCenterPosY = file.rotatedCenterPos.top;
          // debugCircle('test-pos_5', 'purple', fileCenterPosX, fileCenterPosY);
          // A current radian value of the mouse
          let rad = calcRadians(clientX - fileCenterPosX, clientY - fileCenterPosY);
          // debugCircle('test-pos_6', 'black', 50 * Math.cos(rad) + fileCenterPosX, 50 * Math.sin(rad) + fileCenterPosY);

          if (
            mousewheel_avail_flg == false &&
            glFlgs.canvas.drag_flg == false &&
            glFlgs.canvas.resize_flg == false &&
            glFlgs.canvas.rotate_flg == true
          ) {
            if (glFlgs.canvas.ro.left_top_flg == true) {
              let resRad = rad - tmp.ro.left_top_initRad;
              // console.log('tmp.ro.left_top_initRad : ' + tmp.ro.left_top_initRad);

              file.$fileId.css('transform', 'rotate(' + resRad + 'rad)');
              // console.log('rotate function is called');
            }

            if (glFlgs.canvas.ro.right_top_flg == true) {
              let resRad = rad - tmp.ro.right_top_initRad;
              // console.log('tmp.ro.right_top_initRad : ' + tmp.ro.right_top_initRad);

              file.$fileId.css('transform', 'rotate(' + resRad + 'rad)');
              // console.log('rotate function is called');
            }

            if (glFlgs.canvas.ro.right_bottom_flg == true) {
              let resRad = rad - tmp.ro.right_bottom_initRad;
              // console.log('tmp.ro.right_bottom_initRad : ' + tmp.ro.right_bottom_initRad);

              file.$fileId.css('transform', 'rotate(' + resRad + 'rad)');
              // console.log('rotate function is called');
            }

            if (glFlgs.canvas.ro.left_bottom_flg == true) {
              let resRad = rad - tmp.ro.left_bottom_initRad;
              // console.log('tmp.ro.left_bottom_initRad : ' + tmp.ro.left_bottom_initRad);

              file.$fileId.css('transform', 'rotate(' + resRad + 'rad)');
              // console.log('rotate function is called');
            }
          }
        };

        // When resizing-boxes are clicked
        const resized = function() {
          if (
            mousewheel_avail_flg == false &&
            glFlgs.canvas.mousedown_flg == true &&
            glFlgs.canvas.resize_flg == true
          ) {
            if (glFlgs.canvas.re.left_top_flg == true) {
              file.$fileId.css({
                top:
                  (file.fileIdPos.top - $('#zoom').offset().top) * mouseWheelVal +
                  (file.fileIdHeight -
                    (file.fileIdWidth - (clientX - file.fileIdPos.left) * mouseWheelVal) *
                      file.fileIdRatio) +
                  'px',
                left:
                  (file.fileIdPos.left - $('#zoom').offset().left) * mouseWheelVal +
                  (clientX - file.fileIdPos.left) * mouseWheelVal +
                  'px',
                width: file.fileIdWidth - (clientX - file.fileIdPos.left) * mouseWheelVal + 'px'
              });
              // console.log('mousedown is called');
            }

            if (glFlgs.canvas.re.right_top_flg == true) {
              file.$fileId.css({
                top:
                  (file.fileIdPos.top - $('#zoom').offset().top) * mouseWheelVal +
                  (file.fileIdHeight -
                    (clientX - file.fileIdPos.left) * mouseWheelVal * file.fileIdRatio) +
                  'px',
                left: (file.fileIdPos.left - $('#zoom').offset().left) * mouseWheelVal + 'px',
                width: (clientX - file.fileIdPos.left) * mouseWheelVal + 'px'
              });
              // console.log('down one is called');
            }

            if (glFlgs.canvas.re.right_bottom_flg == true) {
              file.$fileId.css({
                top: (file.fileIdPos.top - $('#zoom').offset().top) * mouseWheelVal + 'px',
                left: (file.fileIdPos.left - $('#zoom').offset().left) * mouseWheelVal + 'px',
                width: (clientX - file.fileIdPos.left) * mouseWheelVal + 'px'
              });
              // console.log('down one is called');
            }

            if (glFlgs.canvas.re.left_bottom_flg == true) {
              file.$fileId.css({
                top: (file.fileIdPos.top - $('#zoom').offset().top) * mouseWheelVal + 'px',
                left:
                  (file.fileIdPos.left -
                    $('#zoom').offset().left +
                    (clientX - file.fileIdPos.left)) *
                    mouseWheelVal +
                  'px',
                width: file.fileIdWidth - (clientX - file.fileIdPos.left) * mouseWheelVal + 'px'
              });
              // console.log('down one is called');
            }
          }
        };

        const executed = function() {
          dragged();
          rotated();
          resized();
        };
        executed();
      });
    };
    main();
  };
  canvasEve();
})(jQuery);
