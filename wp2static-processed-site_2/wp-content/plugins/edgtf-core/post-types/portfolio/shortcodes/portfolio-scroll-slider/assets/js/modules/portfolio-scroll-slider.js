(function($) {
	'use strict';
	
	var portfolioScrollSlider = {};
	edgtf.modules.portfolioScrollSlider = portfolioScrollSlider;
    portfolioScrollSlider.edgtfPortfolioScrollSlider = edgtfPortfolioScrollSlider;

    portfolioScrollSlider.edgtfOnWindowLoad = edgtfOnWindowLoad;
    portfolioScrollSlider.edgtfOnWindowResize = edgtfOnWindowResize;

    $(window).on('load', edgtfOnWindowLoad);
    $(window).resize(edgtfOnWindowResize);

	/*
	 All functions to be called on $(window).on('load', ) should be in this function
	 */
    function edgtfOnWindowLoad() {
        edgtfPortfolioScrollSlider();
        initPortfolioFullScreenSlider();
    }

	/*
	 All functions to be called on $(window).resize() should be in this function
	 */
    function edgtfOnWindowResize() {
        edgtfPortfolioScrollSlider();
        initPortfolioFullScreenSlider();
    }

    function edgtfPortfolioScrollSlider() {
        var sliders = $('.edgtf-portfolio-scroll-slider-holder');

        if (sliders.length) {
            sliders.each(function(){
                var swiperInstance = $(this).find('.swiper-container');

                var swiperSlider = new Swiper (swiperInstance, {
                    loop: true,
                    speed: 800,
                    slidesPerView: 'auto',
                    direction: 'horizontal',
                    mousewheel: true,
                    autoplay: {
                        stopOnLastSlide: true
                    },

                    // Navigation arrows
                    navigation: {
                        nextEl: '.swiper-button-prev',
                        prevEl: '.swiper-button-next'
                    }
                });

            });
        }
    }

    function initPortfolioFullScreenSlider(){
        var holder = $('.edgtf-portfolio-scroll-slider-holder .edgtf-portfolio-list-holder');

        if(holder.length){
            holder.each(function(){
                var thisHolder = $(this),
                    article = thisHolder.find('article'),
                    screenHeight = edgtf.windowHeight - thisHolder.offset().top;

                article.css('height', screenHeight);
            });
        }
    }
	
})(jQuery);