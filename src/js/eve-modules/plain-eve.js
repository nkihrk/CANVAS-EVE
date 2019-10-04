(function ($) {
    const plainEve = () => {

        const plain = {
            'size': {
                'width': 0,
                'height': 0
            },
            'pos': {
                'left': 0,
                'top': 0
            },
            'relPos': {
                'left': 0,
                'top': 0
            }
        }

        var mousewheel_avail_flg = false;


        ///


        // Initialize values
        const init = () => {
            $(document).on(EVENTNAME_TOUCHSTART, function (e) {
                var $plain = $('#plain');

                plain.size.width = $plain.outerWidth();
                plain.size.height = $plain.outerHeight();

                plain.pos.left = $plain.offset().left;
                plain.pos.top = $plain.offset().top;

                plain.relPos.left = clientX - plain.pos.left;
                plain.relPos.top = clientY - plain.pos.top;
                // Image-space mouse coordinates
                if (e.button == 1) {
                    mousewheel_avail_flg = true;
                    // console.log('mousewheel_avail_flg', mousewheel_avail_flg);
                }
            });
        };
        init();


        // Update variables everytime a mousemove event is called on wherever
        const Update = function () {
            $(document).on(EVENTNAME_TOUCHMOVE, function (e) {
                // debugCircle('plainPos', 'orange', $('#plain').offset().left, $('#plain').offset().top);
                // debugCircle('zoomPos', 'white', $('#zoom').offset().left, $('#zoom').offset().top);
                // debugCircle('filePos', 'red', $('.file-wrap').offset().left, $('.file-wrap').offset().top);
            });
        };
        Update();


        // Configuring flags
        const configFlgs = () => {
            // Reset flags
            $(document).on('mouseup', function (e) {
                if (mousewheel_avail_flg == true) {
                    iframePointerReset();

                    $('#canvas-eve').removeClass('active-mousewheel');

                    mousewheel_avail_flg = false;
                    // console.log('mousewheel_avail_flg', mousewheel_avail_flg);
                }
            });
        };
        configFlgs();


        // Execute if flags are true
        const main = () => {
            // Move the canvas
            $(document).on(EVENTNAME_TOUCHMOVE, function (e) {
                // Prevent from the default drag events
                e.preventDefault();

                if (mousewheel_avail_flg == true) {
                    iframePointerNone();

                    $('#plain').css({
                        'left': clientX - plain.relPos.left + 'px',
                        'top': clientY - plain.relPos.top + 'px'
                    });

                    // Change a mouse pointer to a grabbing
                    $('#canvas-eve').addClass('active-mousewheel');
                    // debugCircle('plain-origin', 'red', $('#plain').offset().left, $('#plain').offset().top);
                }
            });
        };
        main();


    };
    plainEve();
})(jQuery);