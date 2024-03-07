// jquery ready start
var postbackCount = 0;
document.addEventListener('DOMContentLoaded', function () {
    Sys.Application.add_load(function () {
        // increment postback
        postbackCount++;
        if (postbackCount > 1) {
            document.body.classList.add("has-postback");
        }

        pageEvents();
    });
});


$(document).ready(function() {


}); // jquery end

function pageEvents() {
    var body                       = $('body');
    var zoneNavigation             = $('#zone-navigation');

    // on click of .js-scroll-trigger class smooth scroll to the #main-content
    $('.js-scroll-trigger').click(function(e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $($.attr(this, 'href')).offset().top
        }, 500);
    });

    // .js-megamenu-trigger on click
    $('.js-megamenu-trigger').click(function(e) {
        e.preventDefault();
        $(this).toggleClass('collapsed');
        // Get bottom of #zone-navigation
        var zoneNavigationBottom = zoneNavigation.outerHeight();
        $('#modalNavigation').modal({backdrop: false }).modal('show');
        $('#modalNavigation').css('top', zoneNavigationBottom);
        $('#modalNavigation').modal('show');
        $('body').addClass('fullscreen-nav-open');
    });

    // add class to the body when scrolled up
    var lastScrollTop = 0;
    var zoneNavigationBottom = zoneNavigation.outerHeight();
    $(window).scroll(function(event){
        var st = $(this).scrollTop();
        if (st > lastScrollTop){
            // downscroll code
            if(st > zoneNavigationBottom) {
            zoneNavigation.addClass('scrolled');
            }
            zoneNavigation.removeClass('scrolled-up');
            body.removeClass('scrolled-up');
        } else {
            // upscroll code
            if(st <= 50) {
                zoneNavigation.removeClass('scrolled scrolled-up');
                body.removeClass('scrolled-up');
            } else {
                zoneNavigation.addClass('scrolled-up');
                body.addClass('scrolled-up');
            }
        }
        lastScrollTop = st;
    })



    $('#search-input').bind("keypress", function (e) {
        if (e.which == 13) {
            e.preventDefault();
            var search = $(this).val();
            if (search.length > 0) {
                window.location = '/search?Q=' + search;
            }
        }
    });

    // if div exists .js-breadcrumb
    if ($('.page-layout-homepage').length) {
        // if screen width is less than 992px
        if ($(window).width() < 992) {
            resizeHomeImg();
        }

        $(window).resize(function() {
                resizeHomeImg();
        });
    };


    // if div exists .bg-text-scroll
    if ($('.bg-text-scroll').length) {
        var divScrollTop = $('.bg-text-scroll').offset().top;
        var divScrollHeight = $('.bg-text-scroll').height();
        var divScrollBottom = divScrollTop + divScrollHeight;
        
        // intersection observer
        var observer = new IntersectionObserver(function(entries) {
            if (entries[0].isIntersecting === true) {
                $(window).on( 'scroll.text-scroll', function(){
                    var windowScrollBottom = $(window).scrollTop() + $(window).height();
                    var percentageScrolled = 100 * ((divScrollTop - windowScrollBottom) / divScrollBottom);
                    $('.bg-text-scroll .animate').css('transform', 'translateX(' + percentageScrolled + '%)');
                });

            } else {
                $(window).off( '.text-scroll' );
            }
        }, { threshold: [0] });
        observer.observe(document.querySelector('.bg-text-scroll'));
    };


    // if div exists .js-breadcrumb
    if ($('.js-breadcrumb').length) {
        // get contents of .js-breadcrumb-container and replace .js-breadcrumb
        var breadcrumbContainer = $('.js-breadcrumb-container').html();
        $('.js-breadcrumb').html(breadcrumbContainer);
    };

    // if .js-alertbar
    if ($('.js-alertbar').length) {
        $(".js-alertbar").each(function() {
            var notificationbarId = "#" + this.id;
            var notificationbarClose = $(".js-alertbar-close");
            var notificationbarName = this.getAttribute("data-alertbar-name");
            var notificationbarValue = this.getAttribute("data-alertbar-value");
            var alertCookie = Cookies.get(notificationbarName)
            
            if(alertCookie) {
                // do something
                $(' .js-alertbar').hide(); 
                } else { 
                    $(notificationbarClose).on("click", function(){ 
                        var expireIn=2/48; Cookies.set(notificationbarName,notificationbarValue, { 
                            expires: expireIn 
                        }); 
                    $(notificationbarId).removeClass("js-active").addClass("d-none"); 
                }) 
            }
        }); 
        $('.js-alertbar-close').on('click', function(){ 
            var alertHeight = $( ".alertbar" ).height();
            $('.js-alertbar').animate({ 'marginTop': alertHeight *-1 }, 800);
            $('body').css( "margin-top", "0" );
        });
    }

    // if .nav-bold
    if ($('.js-nav-responsive').length) {
        // for each .js-nav-responsive
        $('.js-nav-responsive').each(function() {
            var navRes = $(this);
            var navResActive = $('.nav-bold .active');
            navRes.addClass("dropdown-md").wrap('<div class="dropdown"></div>');
            navRes.parent().prepend('<button class="btn btn-dropdown dropdown-toggle d-lg-none" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' + navResActive.text() + '</button>');
            // if navBold has role tablist
            if (navRes.attr('role') === 'tablist') {
                console.log("tablist");
                navRes.find('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
                    var tabText = $(e.target).text();
                    navRes.parent().find('.dropdown-toggle').text(tabText);
                })
            }
        });
    }

    // when window is resized
    $(window).resize(function() {
        resizeNavigation();
    });
}

$(document).on('shown.bs.modal', '#modalNavigation', function () {
    resizeNavigation();
});

$(document).on('hide.bs.modal', '#modalNavigation', function () {
    $('body').removeClass('fullscreen-nav-open');
});

function resizeHomeImg() {
    if ($(window).width() < 992) {
        var pageHeaderHeight = $('.page-header').outerHeight();
        var contentHeight = $('.page-header .container-mobile-100').height();
        var heroImgHeight = pageHeaderHeight - contentHeight;
        $('.page-header .hero-image').css('max-height', heroImgHeight);
    } else {
        $('.page-header .hero-image').css('max-height', '');
    }
}

function resizeNavigation() {
    var zoneNavigation             = $('#zone-navigation');
    var zoneNavigationBottom = Math.max(91, zoneNavigation.outerHeight());

    // if modalNavigation is visible
    if($('#modalNavigation').is(':visible')) {
        // if zoneNavigation has class .scrolled
        if(zoneNavigation.hasClass('scrolled-up')) {
            zoneNavigationBottom = zoneNavigation.find('.navbar-static-top').outerHeight();
        }
        $('#modalNavigation').css('cssText', 'display:block;top:'+zoneNavigationBottom + 'px !important');
    }
}



/*! JS.Cookie.js 2.2.0 */
!function(e){var n=!1;if("function"==typeof define&&define.amd&&(define(e),n=!0),"object"==typeof exports&&(module.exports=e(),n=!0),!n){var o=window.Cookies,t=window.Cookies=e();t.noConflict=function(){return
    window.Cookies=o,t}}}(function(){function e(){for(var e=0,n={};e<arguments.length;e++){var o=arguments[e];for(var t in o)n[t]=o[t]}return n}function n(o){function t(n,r,i){var c;if("undefined"!=typeof document){if(arguments.length>
    1){if("number"==typeof(i=e({path:"/"},t.defaults,i)).expires){var a=new
    Date;a.setMilliseconds(a.getMilliseconds()+864e5*i.expires),i.expires=a}i.expires=i.expires?i.expires.toUTCString():"";try{/^[\{\[]/.test(c=JSON.stringify(r))&&(r=c)}catch(e){}r=o.write?o.write(r,n):encodeURIComponent(String(r)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent),n=(n=(n=encodeURIComponent(String(n))).replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent)).replace(/[\(\)]/g,escape);var
    s="";for(var f in i)i[f]&&(s+="; "+f,!0!==i[f]&&(s+="="+i[f]));return document.cookie=n+"="+r+s}n||(c={});for(var p=document.cookie?document.cookie.split("; "):[],d=/(%[0-9A-Z]{2})+/g,u=0;u<p.length;u++){var
        l=p[u].split("="),C=l.slice(1).join("=");this.json||'"'!==C.charAt(0)||(C=C.slice(1,-1));try{var g=l[0].replace(d,decodeURIComponent);if(C=o.read?o.read(C,g):o(C,g)||C.replace(d,decodeURIComponent),this.json)try{C=JSON.parse(C)}catch(e){}if(n===g){c=C;break}n||(c[g]=C)}catch(e){}}return c}}return t.set=t,t.get=function(e){return t.call(t,e)},t.getJSON=function(){return t.apply({json:!0},[].slice.call(arguments))},t.defaults={},t.remove=function(n,o){t(n,"",e(o,{expires:-1}))},t.withConverter=n,t}return n(function(){})});