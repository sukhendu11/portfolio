(function($) {
	'use strict';

	var interactiveText = {};
	edgtf.modules.interactiveText = interactiveText;
    interactiveText.edgtfInteractiveText = edgtfInteractiveText;

    interactiveText.edgtfOnWindowLoad = edgtfOnWindowLoad;
    interactiveText.edgtfOnWindowResize = edgtfOnWindowResize;

    $(window).on('load', edgtfOnWindowLoad);
    $(window).resize(edgtfOnWindowResize);

	/*
	 All functions to be called on $(window).on('load', ) should be in this function
	 */
    function edgtfOnWindowLoad() {
        edgtfInteractiveText();
    }

	/*
	 All functions to be called on $(window).resize() should be in this function
	 */
    function edgtfOnWindowResize() {
        edgtfInteractiveTextResize();
    }

    function edgtfInteractiveText() {
        var interactiveText = $('#edgtf-interactive-text');

        if (interactiveText.length) {
            var lines = interactiveText.find('.edgtf-interactive-text-content-line'),
                contentHolder = interactiveText.find('.edgtf-interactive-text-content-holder'),
                images,
                itemWrappers,
                slideSpeed = 800; //transition speed

            lines.each(function(i){
                var line = $(this),
                    lineHeight = 0,
                    sliderHeight,
                    swiperInstance = line.find('.swiper-container'),
                    slidesPerView = line.data('slides-per-view'),
                    lineItems = line.find('.edgtf-interactive-text-item'),
                    direction = 'horizontal',
                    loop = true,
                    wheel = false,
                    slidesOffsetBefore = -parseInt(contentHolder.css('padding-top')),
                    mobileHeaderHeight = $('.edgtf-mobile-header').height();

                if (typeof slidesPerView == 'undefined') {
                    slidesPerView = 2;
                }

                if(edgtf.htmlEl.hasClass('touch')){
                    interactiveText.css('height','calc(100vh - '+mobileHeaderHeight+'px)');
                }

                sliderHeight = parseInt(line.parents('#edgtf-interactive-text').outerHeight());

                if (interactiveText.hasClass('edgtf-it-direction-vertical')) {
                    direction = 'vertical';
                    wheel = true;
                    loop = false;
                    slideSpeed = 600; //transition speed

                    slidesOffsetBefore -= (edgtf.windowHeight - mobileHeaderHeight) * 0.3;

                    if (edgtf.htmlEl.hasClass('touch')) {
                        slidesOffsetBefore = 0;
                    }

                    if (lineItems.length) {
                        lineItems.each(function(){
                            var thisItem = $(this),
                                thisItemHeight = parseInt(thisItem.outerHeight());

                            lineHeight += thisItemHeight;
                        });
                    }
                }

                //if elements are higher then holder direction is horizontal
                if (direction == 'horizontal') {
                    //sliders
                    var swiperSlider = new Swiper(swiperInstance, {
                        loop: loop,
                        slidesPerView: 'auto',
                        centeredSlides: true,
                        speed: slideSpeed,
                        direction: direction,
                        mousewheel: true,
                        init: false
                    });

                    swiperSlider.on('init', function(){
                        edgtfInteractiveTextResize();
                        interactiveText.waitForImages(function(){
                            var activeItemWrapper = line.find('.edgtf-interactive-text-item.swiper-slide-active .edgtf-interactive-text-item-wrap'),
                                images = interactiveText.find('.edgtf-interactive-text-item-image'); //wait for clones

                            images.eq(0).addClass('edgtf-active');
                            activeItemWrapper.addClass('edgtf-image-visible');
                            interactiveText.addClass('edgtf-initialized');
                        });
                    });

                    swiperSlider.on('slideChangeTransitionStart', function(){
                        images = interactiveText.find('.edgtf-interactive-text-item-image'); //wait for clones
                        itemWrappers = interactiveText.find('.edgtf-interactive-text-item-wrap'); //wait for clones
                        images.addClass('edgtf-off');

                        if (edgtf.htmlEl.hasClass('touch')){
                            images.filter('.edgtf-active').removeClass('edgtf-active');
                            itemWrappers.removeClass('edgtf-image-visible');
                        }
                    });

                    swiperSlider.on('slideChangeTransitionEnd', function(){
                        var activeIndex = swiperSlider.activeIndex%images.length,
                            activeItemWrapper = line.find('.edgtf-interactive-text-item.swiper-slide-active .edgtf-interactive-text-item-wrap');

                        images.removeClass('edgtf-off');

                        if (edgtf.htmlEl.hasClass('touch')){
                            images.eq(activeIndex).addClass('edgtf-active');
                            activeItemWrapper.addClass('edgtf-image-visible');
                        }

                        if (interactiveText.hasClass('edgtf-it-direction-vertical')) {
                            var lastSlide = interactiveText.find('.edgtf-interactive-text-item').last();

                            if (lastSlide.offset().top + lastSlide.height() <= edgtf.windowHeight) {
                                swiperSlider.allowSlideNext = true;
                            } else {
                                swiperSlider.allowSlideNext = false;
                            }
                        }
                    });

                    interactiveText.waitForImages(function(){
                        swiperSlider.init();
                    });

                } else {
                    if (lineItems.length) {
                        lineItems.each(function(){
                            var thisItem = $(this);

                            thisItem.removeClass('swiper-slide');
                        });
                    }
                    lineItems.unwrap().unwrap();
                    line.addClass('edgtf-it-vertical-fixed');

                    images = interactiveText.find('.edgtf-interactive-text-item-image');
                    itemWrappers = interactiveText.find('.edgtf-interactive-text-item-wrap');

                    images.eq(0).addClass('edgtf-active');
                    interactiveText.addClass('edgtf-initialized');
                    itemWrappers.eq(0).addClass('edgtf-image-visible');
                }
            });

            //images-change logic
            var items = interactiveText.find('.edgtf-interactive-text-item-content');
                images = interactiveText.find('.edgtf-interactive-text-item-image');
                itemWrappers = items.find('.edgtf-interactive-text-item-wrap');

            if (images.length) {
                items.each(function(){
                    var item = $(this),
                        itemWrapper = item.find('.edgtf-interactive-text-item-wrap'),
                        id = item.data('index'),
                        tempImg = $('.edgtf-interactive-text-item-image[data-index='+id+']');

                    itemWrapper.on('mouseenter', function(){
                        images.removeClass('edgtf-remove');
                        images.filter('.edgtf-active').addClass('edgtf-remove');
                        images.removeClass('edgtf-active');
                        tempImg.addClass('edgtf-active');
                        itemWrappers.removeClass('edgtf-image-visible');
                        itemWrapper.addClass('edgtf-image-visible');
                    });
                });
            }
        }
    }

    function edgtfInteractiveTextResize(){
        var interactiveText = $('#edgtf-interactive-text');

        if (interactiveText.length) {
            var lines = interactiveText.find('.edgtf-interactive-text-content-line');

            lines.each(function(i){
                var line = $(this),
                    lineItems = line.find('.edgtf-interactive-text-item');

                lineItems.each(function(){
                    var thisLine = $(this),
                        thisContent = thisLine.find('.edgtf-interactive-text-item-content'),
                        height;

                    height = thisContent.height() + parseInt(thisLine.css('paddingTop'))*2;

                    thisLine.css('min-height',height);
                });
            });
        }

    }

})(jQuery);