(function($) {
    'use strict';

    var introSection = {};
    edgtf.modules.introSection = introSection;

    introSection.edgtfInitIntroSection = edgtfInitIntroSection;
    introSection.edgtfOnDocumentReady = edgtfOnDocumentReady;

    $(document).ready(edgtfOnDocumentReady);

    /*
     All functions to be called on $(document).ready() should be in this function
     */
    function edgtfOnDocumentReady() {
        edgtfInitIntroSection();
    }

    /**
     * Init Intro Section Shortcode
     */
    function edgtfInitIntroSection() {
        var introSection = $('#edgtf-intro-section');

        if (introSection.length && !edgtf.htmlEl.hasClass('touch')) {
            var sectionHeight,
                sectionOffset,
                sectionArea,
                scrollTarget,
                readyToScroll = false,
                pageJump = false,
                wheelDownwards = false,
                initialAnimationDone = false;

            var Item = function(sel, classString, set) {
                this.sel = sel;
                this.classString = classString;
                this.set = set;
            }
            var headlineHolder = new Item(introSection.find('.edgtf-is-headline-holder'), 'headlines', false),
                image = new Item(introSection.find('.edgtf-is-additional-image'), 'image', false),
                firstScreen = new Item($('#edgtf-is-screen-1'), 'screen', true),
                secondScreen = new Item($('#edgtf-is-screen-2'), 'screen', false);

            var glitches = introSection.find('.edgtf-is-image-glitches');

            var animateGlitches = function() {
                glitches
                    .removeClass('edgtf-glitches-hide')
                    .addClass('edgtf-glitches-show');
                setTimeout(function(){
                    glitches
                        .removeClass('edgtf-glitches-show')
                        .addClass('edgtf-glitches-hide');
                }, 350)
            };

            var setItem = function(item) {
                item.sel
                    .removeClass('edgtf-'+item.classString+'-hide')
                    .addClass('edgtf-'+item.classString+'-show')
                    .one(edgtf.animationEnd, function() {
                        item.set = true;
                });
            }

            var unsetItem = function(item) {
                item.sel
                    .removeClass('edgtf-'+item.classString+'-show')
                    .addClass('edgtf-'+item.classString+'-hide')
                    .one(edgtf.animationEnd, function() {
                        item.set = false;
                });
            }

            //update section height and offset
            var updateCoordinates = function() {
                sectionHeight = introSection.height();
                sectionOffset = introSection.offset().top;
                sectionArea = sectionHeight - sectionOffset;
                scrollTarget = sectionHeight + sectionOffset;
            }

            //wheel direction get
            var sectionWheelDirection = function(e) {
                if (e.deltaY < 0) {
                    wheelDownwards = true; //downwards
                } else {
                    wheelDownwards = false; //upwards
                }
            }

            var scrollToScreen = function() {
                unsetItem(headlineHolder);
                introSection.one(edgtf.animationEnd, function() {
                    unsetItem(firstScreen);
                    setItem(secondScreen);

                    introSection.one(edgtf.animationEnd, function() {
                        unsetItem(headlineHolder);
                        introSection.addClass('edgtf-is-underscore-blink');
                    });
                });
            }

            //wheel logic
            var sectionWheelHandler = function(e) {
                if (headlineHolder.set && image.set) { 
                    initialAnimationDone = true;
                }

                if (edgtf.scroll < sectionArea) {
                    if (wheelDownwards) {
                        edgtf.modules.common.edgtfDisableScroll();

                        if (initialAnimationDone) {
                            //set headline 
                            if (!headlineHolder.set && !image.set && !secondScreen.set) {
                                setItem(headlineHolder);
                            }

                            //set image
                            if (headlineHolder.set && !image.set && !secondScreen.set) {
                                animateGlitches();
                                setItem(image);
                            }

                            //set second screen
                            if (headlineHolder.set && image.set && !secondScreen.set) {
                                scrollToScreen();
                            }

                            if (secondScreen.set) {
                                edgtf.modules.common.edgtfEnableScroll();
                            }
                        }
                    } else {
                        if (edgtf.scroll <= sectionOffset) {
                            if (firstScreen.set) {
                                animateGlitches();
                            }

                            if (secondScreen.set) {
                                introSection
                                    .removeClass('edgtf-is-underscore-blink')
                                    .addClass('edgtf-is-fadeout-text');
                                unsetItem(secondScreen);
                                setItem(firstScreen);

                                introSection.one(edgtf.animationEnd, function() {
                                    setItem(headlineHolder);
                                    animateGlitches();
                                    introSection.removeClass('edgtf-is-fadeout-text');
                                });
                            }
                        }
                    }
                }
            }

            firstScreen.sel.on('click', function() {
                if (headlineHolder.set && image.set) { 
                    initialAnimationDone = true;
                    scrollToScreen();
                }
            });

            //init
            updateCoordinates();
            introSection.on('mousewheel', function(e){
                sectionWheelDirection(e);
            });
            
            document.querySelector('#edgtf-intro-section').addEventListener('wheel', sectionWheelHandler, {passive: false});

            introSection.waitForImages(function(){
                setItem(headlineHolder);

                setTimeout(function() {
                    if (!readyToScroll) {
                        introSection.addClass('edgtf-is-headline-loop');
                    }
                }, 1000)
            });

            $(window).on('load', function(){
                readyToScroll = true;
                introSection.removeClass('edgtf-is-headline-loop');

                if (!headlineHolder.set) {
                    setItem(headlineHolder);
                    introSection.one(edgtf.animationEnd, function() {
                        animateGlitches();
                        setItem(image); 
                    });
                } else {
                    animateGlitches();
                    setItem(image); 
                }
            });   

            $(window).resize(function(){
                setTimeout(function(){
                    updateCoordinates();
                }, 100);
            });
        }
    }
})(jQuery);
