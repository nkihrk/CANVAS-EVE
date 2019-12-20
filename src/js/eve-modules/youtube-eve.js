/* eslint-disable prefer-destructuring */
/* eslint-disable no-lonely-if */
/**
 *
 * Youtube streaming app for CANVAS EVE.
 *
 * Dependencies
 * - jquery-eve
 * - glb-eve
 * - lib-eve
 * - flg-eve
 *
 */

import $ from '../common/jquery-eve';
import GlbEve from '../common/glb-eve';
import LibEve from '../common/lib-eve';
import FlgEve from '../common/flg-eve';

const YoutubeEve = (W => {
  function Youtube() {}

  const modules = {};

  Youtube.prototype = Object.assign(modules, {
    constructor: Youtube,

    options: {
      BUTTON_FOR_LEFT: 0,
      BUTTON_FOR_MOUSEWHEEL: 1,
      DEFAULT_FILE_WIDTH: 400
    },

    //

    mouseDownEvent(e) {
      this._handleEventMouseDown(e);
    },

    //

    mouseUpEvent(e) {
      this._handleEventMouseUp(e);
    },

    //

    _handleEventMouseDown(e) {
      if (
        e.target.closest('.youtube-util') ||
        e.target.closest('.tab-block-youtube') ||
        e.target.closest('.child-search-youtube')
      ) {
        LibEve.iframePointerNone();
      }
    },

    //

    _handleEventMouseUp(e) {
      if (
        e.target.closest('.youtube-util') ||
        e.target.closest('.tab-block-youtube') ||
        e.target.closest('.child-search-youtube')
      ) {
        LibEve.iframePointerReset();
      }

      if (e.button === this.options.BUTTON_FOR_LEFT) {
        if (e.target.closest('.backspace-icon')) {
          $(e.target)
            .parent()
            .children('input')
            .val('');
        }

        if (FlgEve.ctxmenu.sub.is_youtube_flg === true) {
          this._invokeWindow(e);
        }

        if (e.target.closest('.youtube-search-button')) this._treatYoutube(e);
      }
    },

    //

    _invokeWindow() {
      GlbEve.NEWFILE_ID += 1;
      GlbEve.HIGHEST_Z_INDEX += 1;

      const left =
        (W.innerWidth / 2 - $('#zoom').offset().left) * GlbEve.MOUSE_WHEEL_VAL -
        this.options.DEFAULT_FILE_WIDTH / 2;
      const top =
        (W.innerHeight / 2 - $('#zoom').offset().top) * GlbEve.MOUSE_WHEEL_VAL -
        118;
      const childStyle = `width: ${this.options.DEFAULT_FILE_WIDTH}px; top:${top}px; left:${left}px; z-index:${GlbEve.HIGHEST_Z_INDEX}; transition:${GlbEve.IS_TRANSITION};`;
      const assertFile =
        `<div id="${GlbEve.NEWFILE_ID}" class="grab-pointer file-wrap limit-size" style="${childStyle}">` +
        ` <div class="function-wrapper">` +
        `   <div class="thumbtack-wrapper"></div>` +
        `   <div class="resize-wrapper"></div>` +
        `   <div class="rotate-wrapper"></div>` +
        `   <div class="flip-wrapper"></div>` +
        `   <div class="trash-wrapper"></div>` +
        ` </div>` +
        ` <div class="youtube-util">` +
        `   <div class="youtube-tab">` +
        `     <ul>` +
        `       <li class="tab-prefix tab-current tab-curve double" id="new-tab-youtube">` +
        `         <div class="tab-info">` +
        `           <div class="tab-name">New window</div>` +
        `           <div class="close-button"></div>` +
        `         </div>` +
        `       </li>` +
        `     </ul>` +
        `   </div>` +
        `   <div class="youtube-search">` +
        `     <div class="search-box-wrapper">` +
        `       <input class="ellipsis youtube-search-box" placeholder="Paste a YouTube link" type="text" spellcheck="false">` +
        `       <div class="backspace-icon"></div>` +
        `     </div>` +
        `     <div class="hover-shadow-single youtube-search-button"></div>` +
        `   </div>` +
        ` </div>` +
        ` <div class="eve-main is-flipped">` +
        `   <div class="youtube-content"></div>` +
        ` </div>` +
        `</div>`;

      $(`#add-files-${GlbEve.CURRENT_CANVAS_ID}`).append(assertFile);
      FlgEve.ctxmenu.sub.is_youtube_flg = false;
    },

    //

    _treatYoutube(e) {
      const $selected = $(e.target);
      let url;
      let youtubeID;
      let listID;
      let videoID;
      let jsonYt;
      let tabName;
      let isVideo;
      const input = encodeURI(
        $(e.target)
          .parent()
          .find('input')
          .val()
      );
      // eslint-disable-next-line no-useless-escape
      const isUrl = input.match(
        // eslint-disable-next-line no-useless-escape
        /^(https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)$/
      );
      const isYoutube = input.match(/youtube/);
      if (input && isUrl && isYoutube) {
        url = input;

        if (url.match(/&/)) {
          // Should be a movie with options
          videoID = url.split('v=')[1];
          videoID = videoID.split('&')[0];
          youtubeID = `${videoID}?rel=0&showinfo=0`;
          jsonYt =
            GlbEve.YOUTUBE_API_KEY == null ? -1 : this._ajaxDataVideo(videoID);
          isVideo = true;
        } else {
          // Should be a movie or just a list without any options
          if (url.match(/list=/)) {
            listID = url.split('list=')[1];
            youtubeID = `videoseries?list=${listID}`;
            jsonYt =
              GlbEve.YOUTUBE_API_KEY == null
                ? -1
                : this._ajaxDataPlaylistItem(listID);
            isVideo = false;
          } else if (url.match(/v=/)) {
            videoID = url.split('v=')[1];
            youtubeID = `${url.split('v=')[1]}?rel=0&showinfo=0`;
            jsonYt =
              GlbEve.YOUTUBE_API_KEY == null
                ? -1
                : this._ajaxDataVideo(videoID);
            isVideo = true;
          }
        }

        // Get a specific json data from youtube via data api
        if (jsonYt === -1) {
          tabName = 'The API Key is missing';
        } else {
          jsonYt.done(jsonData => {
            if (isVideo) {
              tabName = jsonData.items[0].snippet.title;
            } else {
              tabName = `Playlist : Enqueued ${jsonData.pageInfo.totalResults} videos`;
            }
          });
        }

        $selected
          .parents('.file-wrap')
          .find('.tab-name')[0].innerText = tabName;

        const iframeTag = `<iframe src="https://www.youtube.com/embed/${youtubeID}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        const $fileWrap = $selected.parents('.file-wrap');
        const hasIframe = $fileWrap.find('iframe').length;

        if (!hasIframe) {
          $fileWrap.find('.youtube-content').append(iframeTag);
        }
        $fileWrap
          .find('iframe')
          .attr('src', `https://www.youtube.com/embed/${youtubeID}`);
      }
    },

    //

    // Get json data from youtube. video
    _ajaxDataVideo() {
      return $.ajax({
        type: 'GET',
        url: 'https://www.googleapis.com/youtube/v3/videos',
        dataType: 'json',
        data: {
          part: 'snippet',
          id: id,
          maxResults: 50,
          key: GlbEve.YOUTUBE_API_KEY
        }
      });
    },

    //

    // Get json data from youtube. playlist item
    _ajaxDataPlaylistItem() {
      return $.ajax({
        type: 'GET',
        url: 'https://www.googleapis.com/youtube/v3/playlistItems',
        dataType: 'json',
        data: {
          part: 'snippet',
          playlistId: id,
          maxResults: 50,
          key: GlbEve.YOUTUBE_API_KEY
        }
      });
    }
  });

  return Youtube;
})(window);

export default YoutubeEve;
