$(document).ready(function () {
    buildFiltersFromUrl();

    $('.js-header-search').bind("keypress", function (e) {
        if (e.which == 13) {
            e.preventDefault();
            var search = $(this).val().trim();
            if (search.length > 0) {
                filters["search"] = search;
            } else {
                if (filters["search"] !== undefined) {
                    delete filters["search"];
                }
            }

            buildQueryString();
        }
    });


    $('.js-sidebar-toggle').on('click', function (e) {
        e.preventDefault();
        $('.filter-sidebar').toggle();
        if ($('.filter-sidebar').is(':visible')) {
            $(this).addClass('btn-primary').removeClass('btn-default');
            $('.js-sidebar-toggle span').text('Hide Filters');
        } else {
            $(this).removeClass('btn-primary').addClass('btn-default');
            $('.js-sidebar-toggle span').text('Show Filters');
        }
    });

    $(".js-filter-clearall").click(function (e) {
        e.preventDefault();
        $(".nav-filters > li.active").removeClass("active");
        $(".js-filter-all").parent().addClass("active");
        $(".js-filter-search").val("");
        filters = {};
        buildQueryString();
    });

    $(".js-filter-criteria").click(function (e) {
        e.preventDefault();
        var type = $(this).data('filter-type');
        var value = $(this).data('filter-value');
        if ($(this).hasClass('js-filter-all')) {
            $(this).parents('.nav').find('li').removeClass('active');
            $(this).parent().addClass('active');
            // remove array from filters
            if (type !== undefined && filters[type] !== undefined) {
                delete filters[type];
            }
        } else {
            if ($(this).parent().hasClass('active')) {
                if (type !== undefined && value !== undefined) {
                    var itemIndex = filters[type].indexOf(String(value));
                    if (itemIndex !== -1) {
                        filters[type].splice(itemIndex, 1);

                        if (filters[type].length === 0) {
                            delete filters[type];
                        }
                    }
                }
                $(this).parent().removeClass('active');

                if( $(this).parents('.nav').find('.active').length === 0 ) {
                    $(this).parents('.nav').find('.js-filter-all').parent().addClass('active');
                }
            } else {
                $(this).parents('.nav').find('js-filter-all').parent().removeClass('active');
                $(this).parent().addClass('active');
                $(this).parent().parent().find('.js-filter-all').parent().removeClass('active');

                if (type !== undefined && value !== undefined) {
                    filter = filters[type];
                    if (filter === undefined) {
                        filters[type] = [];
                    }
                    filters[type].push(String(value));
                }
            }
        }

        buildQueryString();
    });

    $(".js-filter-select").change(function (e) {
        var type = $(this).attr('name');
        var value = $(this).val();

        if (type !== undefined && value !== undefined) {
            filter = filters[type];
            if (filter === undefined) {
                filters[type] = [];
            }

            filters[type] = [String(value)];
        }

        buildQueryString();
    });

    $(".js-filter-link").click(function (e) {
        e.preventDefault();
        var type = $(this).data('filter-type');
        var value = $(this).data('filter-value');
        var allowPageChange = false;

        if (type !== undefined && value !== undefined) {
            filter = filters[type];
            if (filter === undefined) {
                filters[type] = [];
            }

            filters[type] = [String(value)];
            if (type == 'page') {
                allowPageChange = true;
                if (value == 1) {
                    delete filters[type];
                }
            }

            buildQueryString(allowPageChange);
        }
    });
});


function buildFiltersFromUrl() {
    filters = {};
    encodedSearchParams = window.location.search.replace('?', '').split('&');

    // Decode each part of the search query
    decodedSearchParams = encodedSearchParams.map(function (encodedParam) {
        var query = decodeURIComponent(encodedParam);
        var keyValue = query.split('=');
        if (keyValue.length === 2) {
            filters[keyValue[0]] = [...new Set(keyValue[1].split(','))];
        }
    });

    if (Object.keys(filters).length > 0) {
        updateSelectedFilters();
    }
}

function buildQueryString(allowPageChange) {
    var selectorsArr = [];
    var str = '';

    for (key in filters) {
        if(filters.hasOwnProperty(key) && filters[key] != '') {
            if (key !== 'page' || allowPageChange) {
                selectorsArr.push(key + "=" + filters[key])
            } else {
                delete filters['page'];
            }
        }
    }

    str = selectorsArr.join('&');
    if (str !== undefined && str !== '') {
        // insert string into url before the hash if it exists
        var hash = window.location.hash;
        if (hash !== undefined && hash !== '') {
            var pageUrl = window.location.pathname + '?' + str + hash;
        } else {
            var pageUrl = window.location.pathname + '?' + str;
        }
    } else {
        var pageUrl = window.location.href.split('?')[0];
    }
    // go to url
    window.location.href = pageUrl;
}

function updateSelectedFilters() {
    for (key in filters) {
        if (filters[key].length > 0) {
            if (key !== 'search') {
                $(".js-filter-all[data-filter-type='" + key + "']").parent().removeClass("active");
                for (var i = 0; i < filters[key].length; i++) {
                    var value = filters[key][i];
                    $(".js-filter-criteria[data-filter-type='" + key + "'][data-filter-value='" + value + "']").parent().addClass("active");
                }
            } else {
                $(".js-filter-search").val(filters['search'][0]);
            }
        }
    }
}
