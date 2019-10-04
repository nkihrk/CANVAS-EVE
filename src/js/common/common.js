(function (window, $) {
    // When DOM tree is constructed
    $(function () {
        const h = $(window).height();

        // Loading animation
        const loadingFirst = function () {
            $('#loader-bg, #loader').height(h).css('display', 'block');
        }
        loadingFirst();
    });


    // When loading is finished
    $(window).on('load', function () {
        // loadingLast
        const loadingLast = function () {
            $('#loader-bg').delay(900).fadeOut(800, function () {
                $(this).remove();
            });
            $('#loading').delay(600).fadeOut(300, function () {
                $(this).remove();
            });
        }
        loadingLast();
    });


    // When loading is finished and is resized
    $(window).on('load resize', function () {
        $('#footer').css({
            'top': window.innerHeight - 60 + 'px',
            'left': window.innerWidth / 2 + 'px'
        });
    });
})(window, jQuery);