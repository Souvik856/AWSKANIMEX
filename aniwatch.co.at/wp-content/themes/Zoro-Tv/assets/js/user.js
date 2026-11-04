$(document).ready(() => {
    $(document).on('click', '.wl-item', function(e) {
        e.preventDefault();
        const animeId = $(this).data('animeid');
        if (!animeId) {
            console.error('Anime ID not found');
            return;
        }

        if (!user.is_logged_in || !user.rest_url) {
            toastr.error('You must be logged in to add to watchlist.');
            return;
        }

        let status = $(this).data('type');

        let requestData = {
            anime_id: animeId,
        };

        if (status !== undefined && status !== null && status !== '') {
            requestData.status = status;
        }

        $.ajax({
            url: user.rest_url + 'watchlist',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(requestData),
            success: function(response) {
                if (response && response.success) {
                    toastr.success(response.message);
                    // Update the button state
                    if ($(this).closest('.profile-list-fav').length > 0 && response.action !== 'remove') {
                        window.location.reload();
                    } else if ($(this).hasClass('dropdown-item') && response.action !== 'remove') {
                        $(this).siblings().removeClass('active');
                        $(this).parent().find('.fa-check').remove();
                        $(this).addClass('active').prepend('<i class="fas fa-check mt-2"></i>');
                        let removeItem = $(this).parent().find('.wl-item[data-type="0"]');
                        if (removeItem.length === 0) {
                            $(this).parent().append('<a class="wl-item dropdown-item text-danger" data-page="detail" data-animeid="' + animeId + '" href="javascript:;" data-type="0">Remove</a>');
                        }
                        $(this).closest('.dr-fav').find('[data-toggle="dropdown"]').html('<i class="fas fa-edit mr-2"></i> Edit Watch List');
                        $(this).closest('#watch-list-content').find('[data-toggle="dropdown"]').html('<i class="fas fa-edit mr-2"></i> Edit Watch List');
                        $(this).closest('.dr-tip-fav').find('[data-toggle="dropdown"]').html('<i class="fas fa-edit"></i>');
                    } else if ($(this).closest('.profile-list-fav').length > 0 && response.action === 'remove') {
                        window.location.reload();
                    } else if ($(this).hasClass('dropdown-item')) {
                        $(this).siblings().removeClass('active')
                        $(this).siblings().find('.fa-check').remove();
                        $(this).closest('.dr-fav').find('a[data-toggle="dropdown"]').html('<i class="fas fa-plus mr-2"></i> Add to List');
                        $(this).closest('##watch-list-content').find('a[data-toggle="dropdown"]').html('<i class="fas fa-plus mr-2"></i> Add to List');
                        $(this).closest('.dr-tip-fav').find('a[data-toggle="dropdown"]').html('<i class="fas fa-plus"></i>');
                        $(this).parent().find('.wl-item[data-type="0"]').remove();
                    } else {

                    }
                } else {
                    toastr.error((response && response.message) || 'Failed to update watchlist.');
                }
            }.bind(this),
            error: function(xhr) {
                let msg = 'Failed to update watchlist.';
                if (xhr && xhr.responseJSON && xhr.responseJSON.message) {
                    msg = xhr.responseJSON.message;
                }
                toastr.error(msg);
            }
        });
    });

    $(document).on('click', '.remove-cw', function(e) {
        e.preventDefault();
        const animeId = $(this).data('animeid');
        if (!animeId) {
            console.error('Anime ID not found');
            return;
        }

        if (!user.is_logged_in || !user.rest_url) {
            toastr.error('You must be logged in to remove anime from your watch list.');
            return;
        }

        $.ajax({
            url: user.rest_url + 'continue-watching/' + encodeURIComponent(animeId),
            type: 'DELETE',
            success: function(response) {
                if (response && response.success) {
                    toastr.success(response.message);
                    $(this).closest('.flw-item').remove();
                    if ($('.film_list-continue .flw-item').length === 0) {
                        $('.film_list-continue').html('<p class="text-center">No items in your watch list.</p>');
                    }
                } else {
                    toastr.error((response && response.message) || 'Failed to remove item.');
                }
            }.bind(this),
            error: function(xhr, status, error) {
                console.error('REST error:', status, error);
                toastr.error('Failed to remove item.');
            }
        });
    })

    // Quick settings toggle handler
    $(".quick-settings-toggle").click(function() {
        $(this).toggleClass("active");
        const option = $(this).data("option");
        const isActive = $(this).hasClass("active");
        updateUserSetting(option, isActive ? 1 : 0);
    });
});

function updateUserSetting(key, value) {
    if (!user.is_logged_in || !user.rest_url) {
        return;
    }

    if (!key || value === undefined || value === null || value === '') {
        return;
    }

    let requestData = {
        [key]: value,
    };

    $.ajax({
        url: user.rest_url + 'user/settings',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(requestData),
        success: function(response) {
            if (response && response.success) {
                if (response.message) {
                    toastr.success(response.message);
                }
            }
        },
        error: function(xhr) {
            let msg = 'Failed to update setting.';
            if (xhr && xhr.responseJSON && xhr.responseJSON.message) {
                msg = xhr.responseJSON.message;
            }
            toastr.error(msg);
        }
    });
}

function updateLocalStorageSetting(key, value) {
    if (!key || !value) {
        return;
    }

    let settings = JSON.parse(window.localStorage.getItem('settings')) || {};
    settings[key] = value;
    window.localStorage.setItem('settings', JSON.stringify(settings));
    updateUserSetting(key, value);
}

function toggleSetting(key) {
    let currentValue = JSON.parse(window.localStorage.getItem('settings')) ? .[key] || '0';
    let newValue = currentValue === '1' ? '0' : '1';

    updateLocalStorageSetting(key, newValue);
}

function getUserSetting(key, defaultValue) {
    if (!key) {
        return null;
    }

    let settings = JSON.parse(window.localStorage.getItem('settings')) || {};
    return settings[key] || defaultValue;
}