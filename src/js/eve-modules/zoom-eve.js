(function ($) {
    const zoomEve = () => {
        // Execute if flags are true
        const main = () => {
            $(document).mousemove(function (e) {
                // Prevent from the default drag events
                e.preventDefault();

                var zoomOrigin = $('#zoom').css('transform-origin');
                var zoomScaleX = transformValue($('#zoom').css('transform')).scaleX;
                var zoomScaleY = transformValue($('#zoom').css('transform')).scaleY;
                var zoomOffset = $('#zoom').offset();
                // console.log('zoomOrigin', zoomOrigin, 'zoomScaleX', zoomScaleX, 'zoomScaleY', zoomScaleY, 'zoomOffset', zoomOffset);

            });


            // Implement zoom-in and zoom-out
            const setZoom = () => {
                // var i = parseInt(transformValue($('#zoom').css('transform')).scaleX);
                var i = 1;
                var xLast = 0; // last x location on the screen
                var yLast = 0; // last y location on the screen
                var xImage = 0; // last x location on the image
                var yImage = 0; // last y location on the image
                $(document).on('mousewheel', function (e) {
                    // find current location on screen 
                    xScreen = clientX - $('#plain').offset().left;
                    yScreen = clientY - $('#plain').offset().top;

                    // find current location on the image at the current scale
                    xImage = xImage + ((xScreen - xLast) / i);
                    yImage = yImage + ((yScreen - yLast) / i);
                    // console.log('xImage', xImage, 'yImage', yImage);


                    var delta = e.deltaY;
                    if (delta < 0) {
                        if (i > 2) {
                            i = 2;
                            i -= 0.09;
                        } else if (i > 0.9) {
                            i -= 0.09;
                        } else if (i > 0.8) {
                            i -= 0.08;
                        } else if (i > 0.7) {
                            i -= 0.07;
                        } else if (i > 0.6) {
                            i -= 0.06;
                        } else if (i > 0.5) {
                            i -= 0.05;
                        } else if (i > 0.4) {
                            i -= 0.04;
                        } else if (i > 0.3) {
                            i -= 0.03;
                        } else if (i > 0.2) {
                            i -= 0.02;
                        } else if (i >= 0.1) {
                            i -= 0.01;
                        } else {
                            i = 0.09;
                        }
                    } else {
                        if (i > 2) {
                            i = 2.09;
                        } else if (i > 0.9) {
                            i += 0.09;
                        } else if (i > 0.8) {
                            i += 0.08;
                        } else if (i > 0.7) {
                            i += 0.07;
                        } else if (i > 0.6) {
                            i += 0.06;
                        } else if (i > 0.5) {
                            i += 0.05;
                        } else if (i > 0.4) {
                            i += 0.04;
                        } else if (i > 0.3) {
                            i += 0.03;
                        } else if (i > 0.2) {
                            i += 0.02;
                        } else if (i > 0.1) {
                            i += 0.01;
                        } else {
                            i = 0.1;
                            i += 0.01;
                        }
                    }

                    // determine the location on the screen at the new scale
                    xNew = (xScreen - xImage) / i;
                    yNew = (yScreen - yImage) / i;
                    // console.log('xNew', xNew, 'yNew', yNew);


                    // save the current screen location
                    xLast = xScreen;
                    yLast = yScreen;

                    // console.log('i', i);
                    mouseWheelVal = 1 / i;
                    $('#zoom').css({
                        'transform': 'scale(' + i + ')' + 'translate(' + xNew + 'px, ' + yNew + 'px' + ')',
                        'transform-origin': xImage + 'px ' + yImage + 'px',
                    });
                    // debugCircle('zoom-origin', 'orange', $('#zoom').offset().left, $('#zoom').offset().top);
                });
            };
            setZoom();
        };
        main();


    };
    zoomEve();
})(jQuery);