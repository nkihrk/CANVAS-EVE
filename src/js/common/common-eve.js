/**
 *
 * Implemented loading animation.
 * 
 * * Dependencies
 * - jQuery 3.4.1
 *
 */

import jQuery from 'jquery';


var CommonEve = (function (w, $) {

    function CommonEve() {}

    CommonEve.prototype = {

        constructor: CommonEve,

        options: {},

        load: function () {
            this.eventReady();
            this.eventLoad();
            this.eventLoadResize();
        },


        eventReady: function () {
            $(function () {
                const h = $(w).height();

                $('#loader-bg, #loader').height(h).css('display', 'block');
            });
        },


        eventLoad: function () {
            function load() {
                $('#loader-bg').delay(900).fadeOut(800, function () {
                    $(this).remove();
                });
                $('#loading').delay(600).fadeOut(300, function () {
                    $(this).remove();
                });
                // console.log('load() is called.');
            }

            this._event('load', load);
        },


        eventLoadResize: function () {
            function loadResize() {
                $('#footer').css({
                    'top': window.innerHeight - 60 + 'px',
                    'left': window.innerWidth / 2 + 'px'
                });
                // console.log('loadResize() is called.');
            }

            this._event('load resize', loadResize);
        },


        _event: function (event, func) {
            $(w).on(event, func);
        },
    };


    return CommonEve;

})(window, jQuery);

export {
    CommonEve
};