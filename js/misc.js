var hd = hd || {};

hd.stickyHeader = function() {
    var obj = this;
    obj.el = jQuery('#navbar');
    obj.isSticky = false;;

    obj.init = function() {

        obj.el.on('activate.bs.scrollspy', function () {

            obj.hash = jQuery(this).find(".active a").attr("href");

            if(obj.hash != '#top' && !obj.isSticky) {
                jQuery('.js-sticky').addClass('is-stuck');
                obj.isSticky = true;
            } else if(obj.hash == '#top' && obj.isSticky) {
                jQuery('.js-sticky').removeClass('is-stuck');
                obj.isSticky = false;
            }

        });

    }

    obj.init();
}

hd.navigation = function() {
    var obj = this;
    obj.nav = jQuery('.js-nav');

    obj.init = function() {

        obj.nav.on('click', 'a', function(e){
            e.preventDefault();

            obj.elId = jQuery(this).attr('href');
            obj.position = jQuery(obj.elId).position();
            obj.offset = jQuery(obj.elId).data('offset') != undefined ? jQuery(obj.elId).data('offset') : 0;

            jQuery('html, body').animate({scrollTop: Math.ceil(obj.position.top) - obj.offset - 71});

        });

        jQuery('.js-contact').on('click', function(e){
            e.preventDefault();
            jQuery(this).blur();
            jQuery('.js-contact-link').click();
        });
    }

    obj.init();
}

hd.showInspiration = function() {
    var obj = this;
    obj.group = jQuery('.js-inspiration');
    obj.button = jQuery('.js-showInspiration');

    obj.init = function() {

        obj.button.on('click', function(e){
            e.preventDefault();
            jQuery(this).blur();
            obj.showItems(1);
        });
    };

    // @todo: fixme
    obj.showItems = function(limit) {

        obj.elements = obj.group.find('.is-hidden');

        if(obj.elements.length == 1) {
            obj.button.parent().hide();
        }

        obj.group.find('.is-hidden').first().removeClass('is-hidden');

    };

    obj.init();
}

hd.showTabContent = function() {
    var obj = this;
    obj.tabs = jQuery('.js-tabs');

    obj.init = function() {
        obj.tabs.on('click', 'a', function(e){
            e.preventDefault();

            obj.position = obj.tabs.position(); // @todo: rewrite

            // Scroll top = tabs.position().top - 20px
            jQuery('html, body').animate({scrollTop: obj.position.top - 101});

            // Set active tab
            jQuery(this).parent().siblings().removeClass('is-active');
            jQuery(this).parent().addClass('is-active');
            jQuery(this).blur();

            // Show content
            obj.tabId = jQuery(this).attr('href');
            jQuery(obj.tabId).siblings().removeClass('is-active');
            jQuery(obj.tabId).addClass('is-active');
        });
    };

    obj.init();
}

hd.sendEmail = function() {
    var obj = this;
    obj.form = jQuery('.js-form');

    obj.init = function() {
        obj.form.on('submit', function(e){
            e.preventDefault();

            $.ajax({
                url: 'form.php',
                cache: false,
                method: 'POST',
                data: obj.form.serialize()
            })
                .done(function(response) {

                    obj.form.find('.has-error').removeClass('has-error');

                    if(response.status == 300) {

                        $.each(response.fields, function(k, v) {
                            jQuery(v).addClass('has-error');
                        });

                    } else if(response.status == 400) {

                        obj.form.find('.has-error').removeClass('has-error');
                        obj.form.find('.js-message').addClass('is-active');
                    }
                });
        });
    };

    obj.init();
}

jQuery(document).ready(function($) {

    hd.showInspiration();
    hd.sendEmail();

    if(jQuery(window).width() >= 800) {
        hd.stickyHeader();
        hd.navigation();
        hd.showTabContent();
    }

    jQuery('img.js-lazy').lazyload({
        threshold : 200
    });

    if( jQuery('.js-fancybox').length ) {

        jQuery('.js-fancybox').fancybox({
            openEffect  : 'none',
            closeEffect : 'none',
            nextEffect  : 'fade',
            prevEffect  : 'fade',
            helpers: {
                overlay: {
                    locked: false,
                    css : {
                       'background': 'rgba(41, 42, 46, 0.9)'
                    }
                }
            }
        });
    }

    if( jQuery('.js-carousel').length ) {

        var isMobile = (jQuery(window).width() < 800);

        jQuery('.js-carousel').flickity({
          cellAlign: 'left',
          prevNextButtons: !(isMobile),
          pageDots: isMobile,
          contain: true
        });
    }

});