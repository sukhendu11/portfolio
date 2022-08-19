(function($) {
    'use strict';
    
    var fullscreenScrollSlider = {};
    edgtf.modules.fullscreenScrollSlider = fullscreenScrollSlider;
    
    fullscreenScrollSlider.edgtfFullscreenScrollSlider = edgtfFullscreenScrollSlider;
    fullscreenScrollSlider.edgtfOnDocumentReady = edgtfOnDocumentReady;
    
    $(document).ready(edgtfOnDocumentReady);

    /*
     All functions to be called on $(document).ready() should be in this function
     */
    function edgtfOnDocumentReady() {
        edgtfFullscreenScrollSlider()
    }

    /**
     * Fullscreen Scroll Slider shortcode
     */
    var edgtfFullscreenScrollSlider = function() {
        var slider = $('#edgtf-fullscreen-scroll-slider');

        if (slider.length) {
            var inner = slider.find('.edgtf-fullscreen-scroll-slider-inner'),
                items = slider.find('.edgtf-fss-item'),
                nav = slider.find('.edgtf-fss-nav'),
                navItems = nav.find('.edgtf-fss-nav-item'),
                withNav = nav.length ? true : false,
                wheelDownwards = false, //wheel direction
                animating = false; //slides animation in progress


            var getScrollbarWidth = function() {
                var outer = document.createElement("div");
                outer.style.visibility = "hidden";
                outer.style.width = "100px";
                outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps

                document.body.appendChild(outer);

                var widthNoScroll = outer.offsetWidth;
                // force scrollbars
                outer.style.overflow = "scroll";

                // add innerdiv
                var inner = document.createElement("div");
                inner.style.width = "100%";
                outer.appendChild(inner);        

                var widthWithScroll = inner.offsetWidth;

                // remove divs
                outer.parentNode.removeChild(outer);

                return widthNoScroll - widthWithScroll;
            }

            //direction for up/down animation
            var setDirectionClass = function() {
                if (!animating) {
                    slider.removeClass('edgtf-wheeldown-true edgtf-wheeldown-false').addClass('edgtf-wheeldown-'+wheelDownwards);
                }
            }

            var goToSlide = function(activeIndex) {
                var activeSlide = items.filter('.edgtf-active'),
                    targetSlide = items.filter(function() { 
                                    return $(this).data("index") == activeIndex; 
                                });

                if (activeSlide.data('index') < activeIndex) {
                    wheelDownwards = true;
                } else {
                    wheelDownwards = false;
                }

                setDirectionClass();

                animating = true;
                activeSlide.removeClass('edgtf-active').addClass('edgtf-remove');
                targetSlide.addClass('edgtf-active').find('.edgtf-fssi-image-holder').one(edgtf.animationEnd, function() {
                    activeSlide.removeClass('edgtf-remove');
                    animating = false;
                });
            }

            var updateNav = function(activeIndex) {
                if (withNav) {
                    navItems.removeClass('edgtf-active');
                    navItems.filter(function() { 
                        return $(this).data("index") == activeIndex; 
                    }).addClass('edgtf-active');
                }   
            }

            var initNavClick = function() {
                navItems.on('click', function() {
                    var activeItem = $(this),
                        activeIndex = activeItem.data('index');

                    goToSlide(activeIndex);
                    updateNav(activeIndex);
                });
            }

            var scrollHandler = function() {
                var blocked = false, // scroll blocked
                    set = false, //slideshow set to start
                    scrollDownwards = false, //scroll direction
                    lastScroll = 0, 
                    scrollingTimeStamp = new Date().getTime(), //scrolling timestamp
                    wheelingTimeStamp = new Date().getTime(), //wheel timestamp
                    currentTime = new Date().getTime(), //current timestamp
                    duration = 1200, //scroll-to animation time
                    scrollBarWidth = getScrollbarWidth(),
                    lastElementOnPage = (slider.offset().top + slider.height() == edgtf.body.height()) ? true : false,
                    introBgrnd = slider.find('.edgtf-fss-intro'),
                    outroBgrnd = slider.find('.edgtf-fss-outro'); 

                //scroll direction get
                var getScrollDirection = function() {
                    var currentScroll = edgtf.scroll;

                    if (currentScroll > lastScroll){
                        scrollDownwards = true; //downwards
                    } else {
                        scrollDownwards = false;  //upwards
                    }

                    lastScroll = currentScroll;
                }

                //wheel direction
                var getWheelDirection = function(e) {
                    if (e.deltaY < 0) {
                        wheelDownwards = true; //downwards
                    } else {
                        wheelDownwards = false; //upwards
                    }
                }

                //esc, home, arrow up/down
                $(document).on('keydown', function(e){
                    var upKeys = [27, 36, 38];
                    var downKeys = [40];

                    if (blocked && $.inArray(e.which, upKeys) !== -1) {
                        wheelDownwards = false;
                        scrollFromSection();
                        return false;
                    } 

                    if (blocked && $.inArray(e.which, downKeys) !== -1) {
                        wheelDownwards = true;
                        scrollFromSection();
                        return false;
                    }                     
                })

                //wait for scroll iteration to finish
                var waitForScroll = function() {
                    currentTime = new Date().getTime();

                    if (currentTime > scrollingTimeStamp) {
                        $(document).trigger('clearRefreshScroll');
                        scrollToSection();
                    }
                }

                //wait for wheel iteration to finish
                var waitForWheel = function() {
                    currentTime = new Date().getTime();

                    if (currentTime > wheelingTimeStamp) {
                        $(document).trigger('clearRefreshWheel');
                        animating = false;
                    }
                }

                //perform first scroll
                var scrollToSection = function() {
                    animating = true;

                    if (wheelDownwards) {
                        items.first().addClass('edgtf-active');
                    } else {
                        items.last().addClass('edgtf-active');
                    }

                    updateNav(items.filter('.edgtf-active').data('index'));

                    introBgrnd.removeClass('edgtf-hide').addClass('edgtf-show').one(edgtf.animationEnd, function() {
                        $(this).removeClass('edgtf-show').addClass('edgtf-hide');
                    });

                    $('html, body').stop().animate({
                        scrollTop: slider.offset().top 
                    }, duration, 'easeInOutExpo', function() {
                        blocked = true; //persist with blocked value
                        set = true; //ready for slide animation
                        animating = false;
                        nav.addClass('edgtf-show-nav');
                    });
                }

                //perform last scroll
                var scrollFromSection = function() {
                    set = false;

                    $(window).scrollTop(slider.offset().top);
                    document.querySelector('html').removeAttribute('style', 'overflow:hidden !important');
                    $('.edgtf-os-preserve-width').css('paddingRight', 0); //custom class

                    var scrollDest = wheelDownwards ? slider.offset().top + edgtf.windowHeight : slider.offset().top - edgtf.windowHeight;

                    slider.addClass('edgtf-exiting-down-'+wheelDownwards);

                    outroBgrnd.removeClass('edgtf-hide').addClass('edgtf-show').one(edgtf.animationEnd, function() {
                        $('html, body').stop().animate({
                            scrollTop: scrollDest
                        }, duration, 'easeInOutExpo', function() {
                            items.removeClass('edgtf-active');
                            animating = false;
                            edgtf.modules.common.edgtfEnableScroll();
                            blocked = false;
                            nav.removeClass('edgtf-show-nav');
                            outroBgrnd.removeClass('edgtf-show').addClass('edgtf-hide');
                            slider.removeClass('edgtf-wheeldown-true edgtf-wheeldown-false edgtf-exiting-down-true edgtf-exiting-down-false');
                        });
                    });
                }

                var scrollToSectionPrep = function() {
                    blocked = true;
                    setDirectionClass();

                    $(window).scrollTop(edgtf.scroll);
                    edgtf.modules.common.edgtfDisableScroll();
                    document.querySelector('html').setAttribute('style', 'overflow:hidden !important');
                    $('.edgtf-os-preserve-width').css('paddingRight', scrollBarWidth + 'px'); //set for custom elements neighbouring the sc

                    var refreshScroll = setInterval(function() {
                        waitForScroll();
                    }, 300);

                    $(document).on('clearRefreshScroll', function(){
                        clearInterval(refreshScroll);
                    });
                }

                //slideshow wheel logic-start
                var prevSlide = function() {
                    var activeSlide = items.filter('.edgtf-active'),
                        prevSlide = activeSlide.prev();

                    updateNav(prevSlide.data('index'));
                    setDirectionClass();

                    animating = true;
                    activeSlide.removeClass('edgtf-active').addClass('edgtf-remove'); 
                    prevSlide.addClass('edgtf-active').find('.edgtf-fssi-image-holder').one(edgtf.animationEnd, function() {
                        activeSlide.removeClass('edgtf-remove');

                        var refreshWheel = setInterval(function() {
                            waitForWheel();
                        }, 500);

                        $(document).on('clearRefreshWheel', function(){
                            clearInterval(refreshWheel);
                        });
                    });
                }

                var nextSlide = function() {
                    var activeSlide = items.filter('.edgtf-active'),
                        nextSlide = activeSlide.next();

                    updateNav(nextSlide.data('index'));
                    setDirectionClass();

                    animating = true;
                    activeSlide.removeClass('edgtf-active').addClass('edgtf-remove');
                    nextSlide.addClass('edgtf-active').find('.edgtf-fssi-image-holder').one(edgtf.animationEnd, function() {
                        activeSlide.removeClass('edgtf-remove');

                        var refreshWheel = setInterval(function() {
                            waitForWheel();
                        }, 500);

                        $(document).on('clearRefreshWheel', function(){
                            clearInterval(refreshWheel);
                        });
                    });
                }
                //slideshow wheel logic-end

                //tigger fullscreen scroll slider on load if in focus
                if (edgtf.scroll + edgtf.windowHeight >= slider.offset().top && 
                    edgtf.scroll < slider.offset().top + slider.height()*0.1) {
                    wheelDownwards = true;
                    scrollToSectionPrep();
                }

                if (edgtf.scroll < slider.offset().top + slider.height() && 
                    edgtf.scroll > slider.offset().top + slider.height()*0.1) {
                    wheelDownwards = false;
                    scrollToSectionPrep();
                }

                //get wheel direction
                $(document).on('mousewheel', function(e){   
                    if (!blocked) {
                        getWheelDirection(e);
                    }
                })

                //block/unblock scroll and/or change slides
                slider.on('mousewheel', function(e) {
                    if (blocked) {
                        getWheelDirection(e);
                        edgtf.modules.common.edgtfDisableScroll();
                        wheelingTimeStamp = new Date().getTime();

                        if (set && !animating) {
                            if (wheelDownwards) {
                                //next slide or unblock
                                if (items.filter('.edgtf-active').data('index') !== items.length) {
                                    nextSlide();
                                } else {
                                    if (!lastElementOnPage) {
                                        scrollFromSection();
                                    }
                                }
                            } else {
                                //prev slide or unblock
                                if (items.filter('.edgtf-active').data('index') !== 1) {
                                    prevSlide();
                                } else {
                                    scrollFromSection();
                                }
                            }
                        }
                    }
                });

                //get scroll direction and trigger Fullscreen Scroll Slider
                $(document).on('scroll', function(){
                    getScrollDirection();
                    scrollingTimeStamp = new Date().getTime();

                    if (edgtf.scroll + edgtf.windowHeight >= slider.offset().top && 
                        edgtf.scroll < slider.offset().top && 
                        scrollDownwards && wheelDownwards && !blocked) {
                        scrollToSectionPrep();
                    }

                    if (edgtf.scroll < slider.offset().top + slider.height() && 
                        edgtf.scroll > slider.offset().top && 
                        !scrollDownwards && !wheelDownwards && !blocked) {
                        scrollToSectionPrep();

                    }
                });

                $(window).resize(function(){
                    if (blocked && set) {
                        $(window).scrollTop(slider.offset().top);
                    }  
                })

                //support bullets functionality
                initNavClick();

                //support anchoring functionality
                $(document).on('edgtfAnchorClicked edgtfAnchorLoaded', function() {
                    if (edgtf.anchorOffset == slider.offset().top) {
                        if (edgtf.scroll < slider.offset().top) {
                            scrollDownwards = true;
                            wheelDownwards = true;
                        }

                        if (edgtf.scroll > slider.offset().top + slider.height()) {
                            scrollDownwards = false;
                            wheelDownwards = false;
                        }
                    }
                });

                //support btt click
                $('#edgtf-back-to-top').on('click', function() {
                    scrollDownwards = false;
                    wheelDownwards = true;
                    document.querySelector('html').removeAttribute('style', 'overflow:hidden !important');
                    $('.edgtf-os-preserve-width').css('paddingRight', 0); //custom class
                    animating = false;
                    blocked = false;
                    items.removeClass('edgtf-active');
                    slider.removeClass('edgtf-wheeldown-true edgtf-wheeldown-false');
                    edgtf.modules.common.edgtfEnableScroll();
                })
            }   

            //init
            slider.waitForImages(function(){
                if (!edgtf.htmlEl.hasClass('touch')) {
                    scrollHandler();
                } else {
                    items.first().addClass('edgtf-active');
                    updateNav(items.filter('.edgtf-active').data('index'));
                    initNavClick();
                    edgtf.modules.common.edgtfEnableScroll();
                }
            });
        }
    };
    
})(jQuery);