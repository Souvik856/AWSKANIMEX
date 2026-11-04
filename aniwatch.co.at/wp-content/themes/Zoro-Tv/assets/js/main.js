$(document).ready(function() {
    function hiRestUrl(path) {
        const baseUrl = (hianime_ajax.rest_url || '').replace(/\/+$/, '');
        return baseUrl + '/' + String(path || '').replace(/^\/+/, '');
    }

    $(".btn-user-avatar").click(function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).parent().find(".dropdown-menu").toggleClass("show");
    });

    $(document).click(function(e) {
        if (!$(e.target).closest(".dropdown").length) {
            $(".dropdown-menu").removeClass("show");
        }
    });


    new Swiper("#slider", {
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        pagination: {
            el: "#slider .swiper-pagination",
            clickable: true,
        },
        loop: true,
        autoplay: {
            delay: 3000,
        },
    });
    new Swiper("#trending-home .swiper-container", {
        slidesPerView: 6,
        spaceBetween: 30,
        navigation: {
            nextEl: ".trending-navi .navi-next",
            prevEl: ".trending-navi .navi-prev",
        },
        breakpoints: {
            320: {
                slidesPerView: 3,
                spaceBetween: 2,
            },
            480: {
                slidesPerView: 3,
                spaceBetween: 15,
            },
            900: {
                slidesPerView: 4,
                spaceBetween: 20,
            },
            1320: {
                slidesPerView: 6,
                spaceBetween: 20,
            },
            1880: {
                slidesPerView: 8,
                spaceBetween: 20,
            },
        },
        autoplay: 2000,
    });
    $("#mobile_search").click(function() {
        $("#mobile_search, #search").toggleClass("active");
    });
    $(".cbox-collapse .btn-showmore").click(function(e) {
        $(this).parent().find(".anif-block-ul").toggleClass("no-limit");
        $(this).toggleClass("active");
    });
    $("#text-home-expand").click(function(e) {
        $(".text-home").toggleClass("thm-expand");
    });
    $('[data-toggle="tooltip"]').tooltip();
    $(".toggle-basic").click(function(e) {
        $(this).toggleClass("off");
    });
    $(".f-genre-item").click(function() {
        $(this).toggleClass("active");
        var genreIds = [];
        $(".f-genre-item").each(function() {
            $(this).hasClass("active") && genreIds.push($(this).data("id"));
        });
        $("#f-genre-ids").val(genreIds.join(","));
    });
    if ($(".film-description .text").length > 0) {
        var fullDes = $(".film-description .text").html().trim();
        if (fullDes.length > 300) {
            var desShow = fullDes.substring(0, 300) + '...<span class="btn-more-desc more"><i class="fas fa-plus"></i> More</span>';
            $(".film-description .text").html(desShow);

            $(document).on("click", ".btn-more-desc", function() {
                $(".film-description .text").toggleClass("text-full");
                $(this).toggleClass("active");

                if ($(this).hasClass("more")) {
                    $(".film-description .text").html(
                        fullDes + '<span class="btn-more-desc less"><i class="fas fa-minus"></i> Less</span>'
                    );
                } else {
                    $(".film-description .text").html(desShow);
                }
            });
        }
    }
    $(window).scroll(function() {
        const scrollTop = $(window).scrollTop();
        const $fixedElement = $('.header'); // Replace with your actual fixed element selector

        // Add/remove fixed class based on scroll position
        if (scrollTop >= 10) {
            $fixedElement.addClass("fixed");
        } else {
            $fixedElement.removeClass("fixed");
        }

        // Show/hide "back to top" button
        if (scrollTop >= 100) {
            $("#totop").addClass("active");
        } else {
            $("#totop").removeClass("active");
        }
    });

    // Handle "back to top" button click
    $("#totop").click(function(event) {
        event.preventDefault();
        $("html, body").animate({
            scrollTop: 0
        }, "slow");
    });

    if (typeof $.fn.qtip !== "undefined") {


        $(".item-qtip").qtip({
            prerender: true,
            content: {
                text: function(event, api) {
                    const target = api.elements.target;

                    if (!target.hasClass("loaded")) {
                        target.addClass("loaded");

                        // Get anime ID from data attribute
                        const animeId = target.attr("data-id");

                        // Validate anime ID
                        if (!animeId || isNaN(animeId) || animeId <= 0) {
                            api.set("content.text", '<div class="qtip-error">Invalid anime ID</div>');
                            return;
                        }

                        $.ajax({
                            url: hiRestUrl('anime/qtip/' + animeId),
                            type: "GET",
                            success: function(data, status) {
                                if (data && data.html) {
                                    api.set("content.text", data.html);
                                } else {
                                    api.set("content.text", '<div class="qtip-error">No content available</div>');
                                }
                            },
                            error: function(xhr, status, error) {
                                console.error('Qtip AJAX error:', error);
                                api.set("content.text", '<div class="qtip-error">Failed to load content</div>');
                            }
                        });
                    }

                    return `
                <div class="loading-relative">
                    <div class="loading">
                        <div class="span1"></div>
                        <div class="span2"></div>
                        <div class="span3"></div>
                    </div>
                </div>
            `;
                }
            },
            show: {
                solo: true,
                effect: function(offset) {
                    $(this).fadeIn(100);
                }
            },
            hide: {
                fixed: true,
                effect: function(offset) {
                    $(this).fadeOut(100);
                }
            },
            position: {
                at: 'center',
                viewport: $(window),
                effect: false
            },
            style: {
                width: 300,
                tip: {
                    corner: false
                }
            }
        });
    }

    // Genre toggle
    $(".genre-toggle").click(function() {
        var $genreMenu = $("#sidebar_subs_genre");
        var $genreIcon = $(".genre-icon");

        var isVisible = $genreMenu.css("display") === "block";
        $genreMenu.css("display", isVisible ? "none" : "block");
        $genreIcon.toggleClass("fa-angle-down", isVisible);
        $genreIcon.toggleClass("fa-angle-up", !isVisible);
    });

    waitForToggleLang(function(toggleBtns) {
        var animePref = getUserSetting("anime_name", "en");

        function updateAnimeNames(mode) {
            $(".dynamic-name").each(function() {
                var $item = $(this);
                var jpName = $item.attr("data-jname");
                var enName = $item.attr("data-en") || $item.text().trim();

                if (!$item.attr("data-en")) {
                    $item.attr("data-en", enName);
                }

                $item.text(mode === "en" ? enName : jpName);
            });

            $(toggleBtns).each(function() {
                var $btn = $(this);
                if (mode === "jp") {
                    $btn.addClass("off");
                } else {
                    $btn.removeClass("off");
                }
            });
        }

        updateAnimeNames(animePref);

        $(toggleBtns).each(function() {
            $(this).click(function() {
                animePref = animePref === "en" ? "jp" : "en";
                updateLocalStorageSetting("anime_name", animePref);
                updateAnimeNames(animePref);
            });
        });
    });

    function waitForToggleLang(callback) {
        var checkExist = setInterval(function() {
            var toggleBtns = $(".toggle-lang").get();
            if (toggleBtns.length > 0) {
                clearInterval(checkExist);
                callback(toggleBtns);
            }
        }, 50);
    }

    // Complete AJAX search suggestions implementation

    let searchRequest = null;

    function performSearchSuggestions(keyword) {
        if (searchRequest && searchRequest.readyState !== 4) {
            searchRequest.abort();
        }

        searchRequest = $.ajax({
            url: user.rest_url + 'search/suggestions',
            type: "GET",
            data: {
                keyword: keyword
            },
            beforeSend: function() {
                // Show loading indicator
                $("#search-suggest").show();
                $("#search-loading").show();
                $("#search-suggest .result").empty();
            },
            success: function(response) {
                // Hide loading indicator
                $("#search-loading").hide();

                if (response && response.html) {
                    // Display suggestions
                    $("#search-suggest .result").html(response.html);
                    $("#search-suggest").show();

                    // Optional: Add animation
                    $("#search-suggest .result").slideDown("fast");
                } else {
                    // Handle error or no results
                    $("#search-suggest .result").html('<div class="no-results">No suggestions found</div>');
                }
            },
            error: function(xhr, status, error) {
                if (status === "abort") {
                    return;
                }

                // Hide loading and show error
                $("#search-suggest").hide();
                $("#search-loading").hide();
                $("#search-suggest .result").html('<div class="error">Error loading suggestions</div>');
                console.error('Search suggestions error:', error);
            }
        });
    }

    // Complete search input handler with the AJAX call
    let searchTimeout = null;

    $(".search-input").keyup(function(e) {
        let keyCode = e.keyCode || e.which;

        // Skip processing for Enter (13) and Space (32) keys
        if ([13, 32].indexOf(keyCode) < 0) {

            // Clear previous timeout (debouncing)
            if (searchTimeout != null) {
                clearTimeout(searchTimeout);
            }

            // Set new timeout for 500ms delay
            searchTimeout = setTimeout(function() {
                searchTimeout = null;

                // Get trimmed input value
                let searchValue = $(".search-input").val().trim();

                // Only proceed if input has more than 1 character
                if (searchValue.length > 1) {
                    // Call the AJAX function
                    performSearchSuggestions(searchValue);
                } else {
                    // Clear suggestions if input is too short
                    $("#search-suggest").hide();
                    $("#search-suggest .result").empty();
                }
            }, 500);
        }
    });
});
$(document).on("click", ".dropdown-menu-right", function(e) {
    e.stopPropagation();
});

function updateOneSetting(key, newValue) {
    if (!window.user || !window.user.user_id) {
        console.log("User not logged in, saving to localStorage");
        localStorage.setItem(key, newValue);
        return $.Deferred().resolve().promise();
    }

    const currentSettings = Object.assign({}, window.user.settings);

    currentSettings[key] = newValue;

    const payload = {
        settings: {
            auto_next: !!currentSettings.auto_next,
            auto_play: !!currentSettings.auto_play,
            auto_skip_intro: !!currentSettings.auto_skip_intro,
            enable_dub: !!currentSettings.enable_dub,
            play_original_audio: !!currentSettings.play_original_audio,
            show_comments_at_home: !!currentSettings.show_comments_at_home,
            anime_name: currentSettings.anime_name || "en",
        },
    };

    updateUser(payload)
        .done((response) => {
            if (response.success) {
                window.user.settings = Object.assign({}, currentSettings);
                toastr.success("Your changes have been saved.", "", {
                    timeout: 6000
                });
            } else {
                toastr.error(response.message, "", {
                    timeout: 6000
                });
            }
        })
        .fail((jqXHR) => {
            let msg = "An unexpected error occurred. Please try again.";
            try {
                const resp = jqXHR.responseJSON;
                if (resp && resp.message) msg = resp.message;
            } catch (err) {}
            toastr.error(msg, "", {
                timeout: 6000
            });
        });
}