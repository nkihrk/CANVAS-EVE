/* eslint-disable prefer-destructuring */
/* eslint-disable no-lonely-if */
/**
 *
 * Youtube streaming app for CANVAS EVE.
 *
 * Dependencies
 * - extend-eve
 * - glb-eve
 * - lib-eve
 *
 */

import $ from '../common/extend-eve';
import GlbEve from '../common/glb-eve';
import LibEve from '../common/lib-eve';

const YoutubeEve = ((W, D) => {
  function Youtube() {
    LibEve.call(this);
  }

  const modules = { ...LibEve.prototype };

  Youtube.prototype = Object.assign(modules, {
    constructor: Youtube,

    options: {},

    load() {
      this.handleEvents();
    },

    //

    handleEvents() {
      D.addEventListener(
        'mousedown',
        e => {
          if (e.target) {
            if (
              e.target.closest('#add-youtube') ||
              e.target.closest('.tab-block-youtube') ||
              e.target.closest('.child-search-youtube')
            ) {
              this.iframePointerNone();
            }

            if (e.button !== 1) {
              if (e.target.closest('.backspace-icon')) {
                $(e.target)
                  .parent()
                  .children('input')
                  .val('');
              }

              if (e.target.closest('.search-button-youtube')) {
                this._parent(e);
              }

              if (e.target.closest('.child-search-button-youtube')) this._child(e);
            }
          }
        },
        false
      );

      D.addEventListener(
        'mouseup',
        e => {
          if (e.target) {
            if (e.target.closest('.tab-block-youtube') || e.target.closest('.child-search-youtube'))
              this.iframePointerReset();
          }
        },
        false
      );
    },

    //

    _parent(e) {
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
      const isUrl = input.match(/^(https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)$/);
      const isYoutube = input.match(/youtube/);
      if (input && isUrl && isYoutube) {
        url = input;

        if (url.match(/&/)) {
          // Should be a movie with options
          videoID = url.split('v=')[1];
          videoID = videoID.split('&')[0];
          youtubeID = `${videoID}?rel=0&showinfo=0`;
          jsonYt = GlbEve.YOUTUBE_API_KEY == null ? -1 : this._ajaxDataVideo(videoID);
          isVideo = true;
        } else {
          // Should be a movie or just a list without any options
          if (url.match(/list=/)) {
            listID = url.split('list=')[1];
            youtubeID = `videoseries?list=${listID}`;
            jsonYt = GlbEve.YOUTUBE_API_KEY == null ? -1 : this._ajaxDataPlaylistItem(listID);
            isVideo = false;
          } else if (url.match(/v=/)) {
            videoID = url.split('v=')[1];
            youtubeID = `${url.split('v=')[1]}?rel=0&showinfo=0`;
            jsonYt = GlbEve.YOUTUBE_API_KEY == null ? -1 : this._ajaxDataVideo(videoID);
            isVideo = true;
          }
        }

        GlbEve.NEWFILE_ID += 1;
        GlbEve.HIGHEST_Z_INDEX += 1;

        const self = this;
        if (jsonYt === -1) {
          tabName =
            'The API Key is missing; the key is needed to show up a name of the now-playing video properly.';
          self._assertFile(youtubeID, tabName, url);
        } else {
          jsonYt.done(jsonData => {
            if (isVideo) {
              tabName = jsonData.items[0].snippet.title;
            } else {
              tabName = `Playlist : Enqueued ${jsonData.pageInfo.totalResults} videos`;
            }
            self._assertFile(youtubeID, tabName, url);
          });
        }
      }
    },

    //

    _assertFile(youtubeID, tabName, url) {
      const iframeTag = `<iframe src="https://www.youtube.com/embed/${youtubeID}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      const childTop =
        ($('#add-youtube').offset().top - $('#zoom').offset().top) * GlbEve.MOUSE_WHEEL_VAL + 300;
      const childLeft =
        ($('#add-youtube').offset().left - $('#zoom').offset().left) * GlbEve.MOUSE_WHEEL_VAL +
        $('#add-youtube').outerWidth() / 2 -
        350;
      const childStyle = `${'width: 700px; top:'}${childTop}px; left:${childLeft}px; z-index:${
        GlbEve.HIGHEST_Z_INDEX
      }; transition:${GlbEve.IS_TRANSITION};`;
      const assertFile =
        `<div id="${GlbEve.NEWFILE_ID}" class="grab-pointer file-wrap limit-size" style="${childStyle}">` +
        `<div class="function-wrapper">` +
        `<div class="thumbtack-wrapper"></div>` +
        `<div class="resize-wrapper"></div>` +
        `<div class="rotate-wrapper"></div>` +
        `<div class="flip-wrapper"></div>` +
        `<div class="trash-wrapper"></div>` +
        `</div>` +
        `<div class="eve-main is-flipped" style="width: 100%;">` +
        `<div class="tab-block-youtube" style="position: relative;">` +
        `<div class="fix-top-border">` +
        `<div class="ellipsis tab-youtube bold agency-fb">${tabName}</div>` +
        `</div>` +
        `</div>` +
        `<div class="child-search-youtube" style="position: relative;">` +
        `<div class="child-search-box-wrapper" style="position: relative;">` +
        `<input value="${url}" class="ellipsis child-search-box-youtube" placeholder="Paste a URL of any YouTube videos here." type="text" spellcheck="false" style="position: relative;">` +
        `<div class="backspace-icon"></div>` +
        `</div>` +
        `<div class="hover-shadow-single child-search-button-youtube" style="position: relative;"></div>` +
        `</div>` +
        `<div class="content-youtube">${iframeTag}</div>` +
        `</div>` +
        `</div>`;

      $('#add-files').append(assertFile);
    },

    //

    _child(e) {
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
      const isUrl = input.match(/^(https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)$/);
      const isYoutube = input.match(/youtube/);
      if (input && isUrl && isYoutube) {
        url = input;

        if (url.match(/&/)) {
          // Should be a movie with options
          videoID = url.split('v=')[1];
          videoID = videoID.split('&')[0];
          youtubeID = `${videoID}?rel=0&showinfo=0`;
          jsonYt = GlbEve.YOUTUBE_API_KEY == null ? -1 : this._ajaxDataVideo(videoID);
          isVideo = true;
        } else {
          // Should be a movie or just a list without any options
          if (url.match(/list=/)) {
            listID = url.split('list=')[1];
            youtubeID = `videoseries?list=${listID}`;
            jsonYt = GlbEve.YOUTUBE_API_KEY == null ? -1 : this._ajaxDataPlaylistItem(listID);
            isVideo = false;
          } else if (url.match(/v=/)) {
            videoID = url.split('v=')[1];
            youtubeID = `${url.split('v=')[1]}?rel=0&showinfo=0`;
            jsonYt = GlbEve.YOUTUBE_API_KEY == null ? -1 : this._ajaxDataVideo(videoID);
            isVideo = true;
          }
        }

        // Get a specific json data from youtube via data api
        if (jsonYt === -1) {
          tabName =
            'The API Key is missing; the key is needed to show a name of the now-playing video properly.';
        } else {
          jsonYt.done(jsonData => {
            if (isVideo) {
              tabName = jsonData.items[0].snippet.title;
            } else {
              tabName = `Playlist : Enqueued ${jsonData.pageInfo.totalResults} videos`;
            }
            $selected.parents('.file-wrap').find('.tab-youtube')[0].innerText = tabName;
          });
        }

        $selected
          .parents('.file-wrap')
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
})(window, document);

export default YoutubeEve;
