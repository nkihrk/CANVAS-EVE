/**
 *
 * Global scopes for CANVAS EVE.
 *
 * Dependencies
 * - jQuery 3.4.1
 *
 */

import jQuery from 'jquery';

const GlobalEve = (function(w, d, $) {
  function global() {}

  global.prototype = {
    constructor: global
  };

  return global;
})(window, document, jQuery);

export default GlobalEve;
