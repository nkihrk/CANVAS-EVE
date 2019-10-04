(function ($) {
    // Add youtube videos to the canvas
    const youtubeEve = () => {
        // Get json data from youtube. video
        const ajaxDataVideo = (id) => {
            return $.ajax({
                type: 'GET',
                url: 'https://www.googleapis.com/youtube/v3/videos',
                dataType: 'json',
                data: {
                    part: 'snippet',
                    id: id,
                    maxResults: 50,
                    key: config.youtube.API_KEY
                }
            })
        };

        // Get json data from youtube. playlist item
        const ajaxDataPlaylistItem = (id) => {
            return $.ajax({
                type: 'GET',
                url: 'https://www.googleapis.com/youtube/v3/playlistItems',
                dataType: 'json',
                data: {
                    part: 'snippet',
                    playlistId: id,
                    maxResults: 50,
                    key: config.youtube.API_KEY
                }
            })
        };


        ///


        // Execute if flags are true
        const main = () => {
            const searchBox = () => {
                // Stop propagation
                // $(document).on('mousedown', '.search-youtube', handlePropagation);
                // $(document).on('mousedown', '.child-search-youtube', handlePropagation);

                $(document).on('mousedown', '#add-youtube', iframePointerNone);
                $(document).on('mousedown', '.tab-block-youtube', iframePointerNone);
                $(document).on('mouseup', '.tab-block-youtube', iframePointerReset);
                $(document).on('mousedown', '.child-search-youtube', iframePointerNone);
                $(document).on('mouseup', '.child-search-youtube', iframePointerReset);


                // Reset the value of the selected input
                $(document).on('mousedown', '.backspace-icon', function (e) {
                    // console.log('mousedown .backspace-icon is detected.');
                    if (e.button != 1) {
                        $(this).parent().children('input').val('');
                    }
                });


                $(document).on('mousedown', '.search-button-youtube', function (e) {
                    if (e.button != 1) {
                        var url, youtubeID, listID, videoID, jsonYt, tabName, iframeTag, assertFile, isVideo;
                        var input = encodeURI($(this).parent().find('input').val());
                        var isUrl = input.match(/^(https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)$/);
                        var isYoutube = input.match(/youtube/);
                        if (input && isUrl && isYoutube) {
                            url = input;

                            if (url.match(/&/)) {
                                // Should be a movie with options
                                videoID = url.split('v=')[1];
                                videoID = videoID.split('&')[0];
                                youtubeID = videoID + '?rel=0&showinfo=0';
                                jsonYt = config.youtube.API_KEY == null ? -1 : ajaxDataVideo(videoID);
                                isVideo = true;
                            } else {
                                // Should be a movie or just a list without any options
                                if (url.match(/list=/)) {
                                    listID = url.split('list=')[1];
                                    youtubeID = 'videoseries?list=' + listID;
                                    jsonYt = config.youtube.API_KEY == null ? -1 : ajaxDataPlaylistItem(listID);
                                    isVideo = false;
                                } else if (url.match(/v=/)) {
                                    videoID = url.split('v=')[1];
                                    youtubeID = url.split('v=')[1] + '?rel=0&showinfo=0';
                                    jsonYt = config.youtube.API_KEY == null ? -1 : ajaxDataVideo(videoID);
                                    isVideo = true;
                                }
                            }

                            newFile.id += 1;
                            HIGHEST_Z_INDEX += 1;

                            // Get a specific json data from youtube via data api
                            if (jsonYt == -1) {
                                tabName = 'The API Key is missing; the key is needed to show a name of the now-playing video properly.';
                                iframeTag = '<iframe src="https://www.youtube.com/embed/' + youtubeID + '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
                                var childTop = ($('#add-youtube').offset().top - $('#zoom').offset().top) * mouseWheelVal + 300;
                                var childLeft = ($('#add-youtube').offset().left - $('#zoom').offset().left) * mouseWheelVal + $('#add-youtube').outerWidth() / 2 - 350;
                                var childTranslate = 'translate(' + xNewMinus + 'px, ' + yNewMinus + 'px' + ')';
                                var childStyle = 'width: 700px;' +
                                    ' top:' +
                                    childTop +
                                    'px; left:' +
                                    childLeft +
                                    'px; z-index:' +
                                    HIGHEST_Z_INDEX +
                                    '; transition:' +
                                    IS_TRANSITION +
                                    '; transform:' +
                                    childTranslate +
                                    ';';
                                assertFile = '<div id="' + newFile.id + '" class="grab-pointer file-wrap limit-size" style="' + childStyle + '">' +
                                    '<div class="function-wrapper">' +
                                    '<div class="thumbtack-wrapper"></div>' +
                                    '<div class="resize-wrapper"></div>' +
                                    '<div class="rotate-wrapper"></div>' +
                                    '<div class="flip-wrapper"></div>' +
                                    '<div class="trash-wrapper"></div>' +
                                    '</div>' +
                                    '<div class="eve-main is-flipped" style="width: 100%;">' +
                                    '<div class="tab-block-youtube" style="position: relative;">' +
                                    '<div class="fix-top-border">' +
                                    '<div class="ellipsis tab-youtube bold agency-fb">' +
                                    tabName +
                                    '</div>' +
                                    '</div>' +
                                    '</div>' +
                                    '<div class="child-search-youtube" style="position: relative;">' +
                                    '<div class="child-search-box-wrapper" style="position: relative;">' +
                                    '<input value="' + url + '" class="ellipsis child-search-box-youtube" placeholder="Paste a URL of any YouTube videos here." type="text" spellcheck="false" style="position: relative;">' +
                                    '<div class="backspace-icon"></div>' +
                                    '</div>' +
                                    '<div class="hover-shadow-single child-search-button-youtube" style="position: relative;"></div>' +
                                    '</div>' +
                                    '<div class="content-youtube">' +
                                    iframeTag +
                                    '</div>' +
                                    '</div>' +
                                    '</div>';
                                $('#add-files').append(assertFile);
                            } else {
                                jsonYt.done(function (jsonData) {
                                    if (isVideo) {
                                        tabName = jsonData.items[0].snippet.title;
                                    } else {
                                        tabName = 'Playlist : Enqueued ' + jsonData.pageInfo.totalResults + ' videos';
                                    }
                                    // console.log('tabName', tabName);

                                    iframeTag = '<iframe src="https://www.youtube.com/embed/' + youtubeID + '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
                                    var childTop = ($('#add-youtube').offset().top - $('#zoom').offset().top) * mouseWheelVal + 300;
                                    var childLeft = ($('#add-youtube').offset().left - $('#zoom').offset().left) * mouseWheelVal + $('#add-youtube').outerWidth() / 2 - 350;
                                    var childTranslate = 'translate(' + xNewMinus + 'px, ' + yNewMinus + 'px' + ')';
                                    var childStyle = 'width: 700px;' +
                                        ' top:' +
                                        childTop +
                                        'px; left:' +
                                        childLeft +
                                        'px; z-index:' +
                                        HIGHEST_Z_INDEX +
                                        '; transition:' +
                                        IS_TRANSITION +
                                        '; transform:' +
                                        childTranslate +
                                        ';';
                                    assertFile = '<div id="' + newFile.id + '" class="grab-pointer file-wrap limit-size" style="' + childStyle + '">' +
                                        '<div class="function-wrapper">' +
                                        '<div class="thumbtack-wrapper"></div>' +
                                        '<div class="resize-wrapper"></div>' +
                                        '<div class="rotate-wrapper"></div>' +
                                        '<div class="flip-wrapper"></div>' +
                                        '<div class="trash-wrapper"></div>' +
                                        '</div>' +
                                        '<div class="eve-main is-flipped" style="width: 100%;">' +
                                        '<div class="tab-block-youtube" style="position: relative;">' +
                                        '<div class="fix-top-border">' +
                                        '<div class="ellipsis tab-youtube bold agency-fb">' +
                                        tabName +
                                        '</div>' +
                                        '</div>' +
                                        '</div>' +
                                        '<div class="child-search-youtube" style="position: relative;">' +
                                        '<div class="child-search-box-wrapper" style="position: relative;">' +
                                        '<input value="' + url + '" class="ellipsis child-search-box-youtube" placeholder="Paste a URL of any YouTube videos here." type="text" spellcheck="false" style="position: relative;">' +
                                        '<div class="backspace-icon"></div>' +
                                        '</div>' +
                                        '<div class="hover-shadow-single child-search-button-youtube" style="position: relative;"></div>' +
                                        '</div>' +
                                        '<div class="content-youtube">' +
                                        iframeTag +
                                        '</div>' +
                                        '</div>' +
                                        '</div>';
                                    $('#add-files').append(assertFile);
                                });
                            }


                        } else {}
                        // console.log('URL', url);
                    }
                });


                $(document).on('mousedown', '.child-search-button-youtube', function (e) {
                    if (e.button != 1) {
                        var $selected = $(this);
                        var url, youtubeID, listID, videoID, jsonYt, tabName, isVideo;
                        var input = encodeURI($(this).parent().find('input').val());
                        var isUrl = input.match(/^(https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)$/);
                        var isYoutube = input.match(/youtube/);
                        if (input && isUrl && isYoutube) {
                            url = input;

                            if (url.match(/&/)) {
                                // Should be a movie with options
                                videoID = url.split('v=')[1];
                                videoID = videoID.split('&')[0];
                                youtubeID = videoID + '?rel=0&showinfo=0';
                                jsonYt = config.youtube.API_KEY == null ? -1 : ajaxDataVideo(videoID);
                                isVideo = true;
                            } else {
                                // Should be a movie or just a list without any options
                                if (url.match(/list=/)) {
                                    listID = url.split('list=')[1];
                                    youtubeID = 'videoseries?list=' + listID;
                                    jsonYt = config.youtube.API_KEY == null ? -1 : ajaxDataPlaylistItem(listID);
                                    isVideo = false;
                                } else if (url.match(/v=/)) {
                                    videoID = url.split('v=')[1];
                                    youtubeID = url.split('v=')[1] + '?rel=0&showinfo=0';
                                    jsonYt = config.youtube.API_KEY == null ? -1 : ajaxDataVideo(videoID);
                                    isVideo = true;
                                }
                            }

                            // Get a specific json data from youtube via data api
                            if (jsonYt == -1) {
                                tabName = 'The API Key is missing; the key is needed to show a name of the now-playing video properly.';
                            } else {
                                jsonYt.done(function (jsonData) {
                                    if (isVideo) {
                                        tabName = jsonData.items[0].snippet.title;
                                        // console.log('tabName(isVideo=true)', tabName);
                                    } else {
                                        tabName = 'Playlist : Enqueued ' + jsonData.pageInfo.totalResults + ' videos';
                                        // console.log('tabName(isVideo=false)', tabName);
                                    }
                                    $selected.parents('.file-wrap').find('.tab-youtube')[0].innerText = tabName;
                                });
                            }

                            $selected.parents('.file-wrap').find('iframe').attr('src', 'https://www.youtube.com/embed/' + youtubeID);
                        } else {}
                    }
                });
            };
            searchBox();


        };
        main();


    };
    youtubeEve();
})(jQuery);