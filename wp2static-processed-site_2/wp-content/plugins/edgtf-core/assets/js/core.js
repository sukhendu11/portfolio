(function ($) {
	'use strict';
	
	var rating = {};
	edgtf.modules.rating = rating;

    rating.edgtfOnDocumentReady = edgtfOnDocumentReady;
	
	$(document).ready(edgtfOnDocumentReady);
	
	/*
	 All functions to be called on $(document).ready() should be in this function
	 */
	function edgtfOnDocumentReady() {
		edgtfInitCommentRating();
	}
	
	function edgtfInitCommentRating() {
		var ratingHolder = $('.edgtf-comment-form-rating');

        var addActive = function (stars, ratingValue) {
            for (var i = 0; i < stars.length; i++) {
                var star = stars[i];
                if (i < ratingValue) {
                    $(star).addClass('active');
                } else {
                    $(star).removeClass('active');
                }
            }
        };

		ratingHolder.each(function() {
		    var thisHolder = $(this),
                ratingInput = thisHolder.find('.edgtf-rating'),
                ratingValue = ratingInput.val(),
                stars = thisHolder.find('.edgtf-star-rating');

                addActive(stars, ratingValue);

            stars.on('click', function () {
                ratingInput.val($(this).data('value')).trigger('change');
            });

            ratingInput.change(function () {
                ratingValue = ratingInput.val();
                addActive(stars, ratingValue);
            });
        });
	}
	
})(jQuery);
(function($) {
    'use strict';

    var portfolio = {};
    edgtf.modules.portfolio = portfolio;
	
	portfolio.edgtfOnDocumentReady = edgtfOnDocumentReady;
    portfolio.edgtfOnWindowLoad = edgtfOnWindowLoad;
	portfolio.edgtfOnWindowResize = edgtfOnWindowResize;
	
	$(document).ready(edgtfOnDocumentReady);
    $(window).on('load', edgtfOnWindowLoad);
	$(window).resize(edgtfOnWindowResize);
	
	/*
	 All functions to be called on $(document).ready() should be in this function
	 */
	function edgtfOnDocumentReady() {
		initPortfolioSingleMasonry();
	}
	
	/*
	 All functions to be called on $(window).on('load', ) should be in this function
	 */
	function edgtfOnWindowLoad() {
		edgtfPortfolioSingleFollow().init();
        edgtfPortfolioSingleExpanding();
	}
	
	/*
	All functions to be called on $(window).resize() should be in this function
	*/
	function edgtfOnWindowResize() {
		initPortfolioSingleMasonry();
	}
	
	var edgtfPortfolioSingleFollow = function () {
		var info = $('.edgtf-follow-portfolio-info .edgtf-portfolio-single-holder .edgtf-ps-info-sticky-holder');
		
		if (info.length) {
			var infoHolder = info.parent(),
				infoHolderOffset = infoHolder.offset().top,
				infoHolderHeight = infoHolder.height(),
				mediaHolder = $('.edgtf-ps-image-holder'),
				mediaHolderHeight = mediaHolder.height(),
				header = $('.header-appear, .edgtf-fixed-wrapper'),
				headerHeight = (header.length) ? header.height() : 0,
				constant = 30; //30 to prevent mispositioned
		}
		
		var infoHolderPosition = function () {
			if (info.length && mediaHolderHeight >= infoHolderHeight) {
				if (edgtf.scroll >= infoHolderOffset - headerHeight - edgtfGlobalVars.vars.edgtfAddForAdminBar - constant) {
					var marginTop = edgtf.scroll - infoHolderOffset + edgtfGlobalVars.vars.edgtfAddForAdminBar + headerHeight + constant;
					// if scroll is initially positioned below mediaHolderHeight
					if (marginTop + infoHolderHeight > mediaHolderHeight) {
						marginTop = mediaHolderHeight - infoHolderHeight + constant;
					}
					info.stop().animate({
						marginTop: marginTop
					});
				}
			}
		};
		
		var recalculateInfoHolderPosition = function () {
			if (info.length && mediaHolderHeight >= infoHolderHeight) {
				//Calculate header height if header appears
				if (edgtf.scroll > 0 && header.length) {
					headerHeight = header.height();
				}
				
				if (edgtf.scroll >= infoHolderOffset - headerHeight - edgtfGlobalVars.vars.edgtfAddForAdminBar - constant) {
					if (edgtf.scroll + headerHeight + edgtfGlobalVars.vars.edgtfAddForAdminBar + constant + infoHolderHeight < infoHolderOffset + mediaHolderHeight) {
						info.stop().animate({
							marginTop: (edgtf.scroll - infoHolderOffset + edgtfGlobalVars.vars.edgtfAddForAdminBar + headerHeight + constant)
						});
						//Reset header height
						headerHeight = 0;
					} else {
						info.stop().animate({
							marginTop: mediaHolderHeight - infoHolderHeight
						});
					}
				} else {
					info.stop().animate({
						marginTop: 0
					});
				}
			}
		};
		
		return {
			init: function () {
				infoHolderPosition();
				$(window).scroll(function () {
					recalculateInfoHolderPosition();
				});
			}
		};
	};
	
	function initPortfolioSingleMasonry(){
		var masonryHolder = $('.edgtf-portfolio-single-holder .edgtf-ps-masonry-images'),
			masonry = masonryHolder.children();
		
		if(masonry.length){
			var size = masonry.find('.edgtf-ps-grid-sizer').width();
			
			masonry.waitForImages(function(){
				masonry.isotope({
					layoutMode: 'packery',
					itemSelector: '.edgtf-ps-image',
					percentPosition: true,
					packery: {
						gutter: '.edgtf-ps-grid-gutter',
						columnWidth: '.edgtf-ps-grid-sizer'
					}
				});
				
				edgtfResizePortfolioMasonryLayoutItems(size, masonry);
				
				masonry.isotope( 'layout').css('opacity', '1');
			});
		}
	}
	
	function edgtfResizePortfolioMasonryLayoutItems(size,container){
		if(container.find('.edgtf-ps-fixed-masonry').length) {
			var space_between_items = parseInt(container.find('.edgtf-ps-image').css('paddingLeft')),
				space_between_items_size = space_between_items !== undefined && space_between_items !== '' ? parseInt(space_between_items, 10) : 0,
				newSize = size - 2 * space_between_items_size,
				defaultMasonryItem = container.find('.edgtf-ps-masonry-small-box'),
				largeWidthMasonryItem = container.find('.edgtf-ps-masonry-large-width'),
				largeHeightMasonryItem = container.find('.edgtf-ps-masonry-large-height'),
				largeWidthHeightMasonryItem = container.find('.edgtf-ps-masonry-large-width-height');
			
			if (edgtf.windowWidth > 680) {
				defaultMasonryItem.css('height', newSize);
				largeHeightMasonryItem.css('height', Math.round(2 * ( newSize + space_between_items_size )));
				largeWidthHeightMasonryItem.css('height', Math.round(2 * ( newSize + space_between_items_size )));
				largeWidthMasonryItem.css('height', newSize);
			} else {
				defaultMasonryItem.css('height', newSize);
				largeHeightMasonryItem.css('height', Math.round(2 * ( newSize + space_between_items_size )));
				largeWidthHeightMasonryItem.css('height', newSize);
				largeWidthMasonryItem.css('height', Math.round(newSize / 2));
			}
		}
	}

    /**
     * Initializes portfolio single expanding content on hover
     */
    function edgtfPortfolioSingleExpanding() {
        var portExpanding = $('.edgtf-ps-expanding-layout');

        if (portExpanding.length) {
            var expandingImage = portExpanding.find('.edgtf-expanding-image'),
                expandingContent = $('.edgtf-expanding-content'),
                expandingOpener = $('.edgtf-icon-ion-icon'),
                headerHeight = $('.edgtf-page-header').height(),
                initialHeight;

            if ( parseInt($('.edgtf-content').css('margin-top'),10) < 0 ) {
                headerHeight = 0;
            }

            expandingContent.appendTo($('.edgtf-wrapper-inner'));
            edgtf.body.addClass('eldtf-portfolio-expanding-layout');

            expandingImage.css('height', 'calc(100vh - ' + headerHeight + 'px)');
            $('.edgtf-full-width-inner').css('padding', 0);
            $('.edgtf-content').addClass('edgtf-portfolio-expanding');

            expandingOpener.on('click', function() {
                if ( ! edgtf.body.hasClass('edgtf-opened') ) {
                    initialHeight = expandingContent.outerHeight();
                    edgtf.body.addClass('edgtf-opened');

                    expandingContent.addClass('edgtf-opened').animate({
                        height: '100vh'
                    }, 700);
                } else if ( edgtf.body.hasClass('edgtf-opened') ) {
                    edgtf.body.removeClass('edgtf-opened');

                    expandingContent.removeClass('edgtf-opened').animate({
                        height: initialHeight
                    }, 700);
                }
            });
        }
    }

})(jQuery);
(function($) {
    'use strict';
	
	var accordions = {};
	edgtf.modules.accordions = accordions;
	
	accordions.edgtfInitAccordions = edgtfInitAccordions;
	
	
	accordions.edgtfOnDocumentReady = edgtfOnDocumentReady;
	
	$(document).ready(edgtfOnDocumentReady);
	
	/*
	 All functions to be called on $(document).ready() should be in this function
	 */
	function edgtfOnDocumentReady() {
		edgtfInitAccordions();
	}
	
	/**
	 * Init accordions shortcode
	 */
	function edgtfInitAccordions(){
		var accordion = $('.edgtf-accordion-holder');
		
		if(accordion.length){
			accordion.each(function(){
				var thisAccordion = $(this);

				if(thisAccordion.hasClass('edgtf-accordion')){
					thisAccordion.accordion({
						animate: "swing",
						collapsible: true,
						active: 0,
						icons: "",
						heightStyle: "content"
					});
				}

				if(thisAccordion.hasClass('edgtf-toggle')){
					var toggleAccordion = $(this),
						toggleAccordionTitle = toggleAccordion.find('.edgtf-accordion-title'),
						toggleAccordionContent = toggleAccordionTitle.next();

					toggleAccordion.addClass("accordion ui-accordion ui-accordion-icons ui-widget ui-helper-reset");
					toggleAccordionTitle.addClass("ui-accordion-header ui-state-default ui-corner-top ui-corner-bottom");
					toggleAccordionContent.addClass("ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom").hide();

					toggleAccordionTitle.each(function(){
						var thisTitle = $(this);
						
						thisTitle.on('mouseenter mouseleave',function(){
							thisTitle.toggleClass("ui-state-hover");
						});

						thisTitle.on('click',function(){
							thisTitle.toggleClass('ui-accordion-header-active ui-state-active ui-state-default ui-corner-bottom');
							thisTitle.next().toggleClass('ui-accordion-content-active').slideToggle(400);
						});
					});
				}
			});
		}
	}

})(jQuery);
(function($) {
	'use strict';
	
	var animationHolder = {};
	edgtf.modules.animationHolder = animationHolder;
	
	animationHolder.edgtfInitAnimationHolder = edgtfInitAnimationHolder;
	
	
	animationHolder.edgtfOnDocumentReady = edgtfOnDocumentReady;
	
	$(document).ready(edgtfOnDocumentReady);
	
	/*
	 All functions to be called on $(document).ready() should be in this function
	 */
	function edgtfOnDocumentReady() {
		edgtfInitAnimationHolder();
	}
	
	/*
	 *	Init animation holder shortcode
	 */
	function edgtfInitAnimationHolder(){
		var elements = $('.edgtf-grow-in, .edgtf-fade-in-down, .edgtf-element-from-fade, .edgtf-element-from-left, .edgtf-element-from-right, .edgtf-element-from-top, .edgtf-element-from-bottom, .edgtf-flip-in, .edgtf-x-rotate, .edgtf-z-rotate, .edgtf-y-translate, .edgtf-fade-in, .edgtf-fade-in-left-x-rotate'),
			animationClass,
			animationData,
			animationDelay;
		
		if(elements.length){
			elements.each(function(){
				var thisElement = $(this);
				
				thisElement.appear(function() {
					animationData = thisElement.data('animation');
					animationDelay = parseInt(thisElement.data('animation-delay'));
					
					if(typeof animationData !== 'undefined' && animationData !== '') {
						animationClass = animationData;
						var newClass = animationClass+'-on';
						
						setTimeout(function(){
							thisElement.addClass(newClass);
						},animationDelay);
					}
				},{accX: 0, accY: edgtfGlobalVars.vars.edgtfElementAppearAmount});
			});
		}
	}
	
})(jQuery);
(function($) {
	'use strict';
	
	var button = {};
	edgtf.modules.button = button;
	
	button.edgtfButton = edgtfButton;
	
	
	button.edgtfOnDocumentReady = edgtfOnDocumentReady;
	
	$(document).ready(edgtfOnDocumentReady);
	
	/*
	 All functions to be called on $(document).ready() should be in this function
	 */
	function edgtfOnDocumentReady() {
		edgtfButton().init();
	}
	
	/**
	 * Button object that initializes whole button functionality
	 * @type {Function}
	 */
	var edgtfButton = function() {
		//all buttons on the page
		var buttons = $('.edgtf-btn');
		
		/**
		 * Initializes button hover color
		 * @param button current button
		 */
		var buttonHoverColor = function(button) {
			if(typeof button.data('hover-color') !== 'undefined') {
				var changeButtonColor = function(event) {
					event.data.button.css('color', event.data.color);
				};
				
				var originalColor = button.css('color');
				var hoverColor = button.data('hover-color');
				
				button.on('mouseenter', { button: button, color: hoverColor }, changeButtonColor);
				button.on('mouseleave', { button: button, color: originalColor }, changeButtonColor);
			}
		};
		
		/**
		 * Initializes button hover background color
		 * @param button current button
		 */
		var buttonHoverBgColor = function(button) {
			if(typeof button.data('hover-bg-color') !== 'undefined') {
				var changeButtonBg = function(event) {
					event.data.button.css('background-color', event.data.color);
				};
				
				var originalBgColor = button.css('background-color');
				var hoverBgColor = button.data('hover-bg-color');
				
				button.on('mouseenter', { button: button, color: hoverBgColor }, changeButtonBg);
				button.on('mouseleave', { button: button, color: originalBgColor }, changeButtonBg);
			}
		};
		
		/**
		 * Initializes button border color
		 * @param button
		 */
		var buttonHoverBorderColor = function(button) {
			if(typeof button.data('hover-border-color') !== 'undefined') {
				var changeBorderColor = function(event) {
					event.data.button.css('border-color', event.data.color);
				};
				
				var originalBorderColor = button.css('borderTopColor'); //take one of the four sides
				var hoverBorderColor = button.data('hover-border-color');
				
				button.on('mouseenter', { button: button, color: hoverBorderColor }, changeBorderColor);
				button.on('mouseleave', { button: button, color: originalBorderColor }, changeBorderColor);
			}
		};
		
		return {
			init: function() {
				if(buttons.length) {
					buttons.each(function() {
						buttonHoverColor($(this));
						buttonHoverBgColor($(this));
						buttonHoverBorderColor($(this));
					});
				}
			}
		};
	};
	
})(jQuery);
(function($) {
	'use strict';
	
	var countdown = {};
	edgtf.modules.countdown = countdown;
	
	countdown.edgtfInitCountdown = edgtfInitCountdown;
	
	
	countdown.edgtfOnDocumentReady = edgtfOnDocumentReady;
	
	$(document).ready(edgtfOnDocumentReady);
	
	/*
	 All functions to be called on $(document).ready() should be in this function
	 */
	function edgtfOnDocumentReady() {
		edgtfInitCountdown();
	}
	
	/**
	 * Countdown Shortcode
	 */
	function edgtfInitCountdown() {
		var countdowns = $('.edgtf-countdown'),
			date = new Date(),
			currentMonth = date.getMonth(),
			currentYear = date.getFullYear(),
			year,
			month,
			day,
			hour,
			minute,
			timezone,
			monthLabel,
			dayLabel,
			hourLabel,
			minuteLabel,
			secondLabel;
		
		if (countdowns.length) {
			countdowns.each(function(){
				//Find countdown elements by id-s
				var countdownId = $(this).attr('id'),
					countdown = $('#'+countdownId),
					digitFontSize,
					labelFontSize;
				
				//Get data for countdown
				year = countdown.data('year');
				month = countdown.data('month');
				day = countdown.data('day');
				hour = countdown.data('hour');
				minute = countdown.data('minute');
				timezone = countdown.data('timezone');
				monthLabel = countdown.data('month-label');
				dayLabel = countdown.data('day-label');
				hourLabel = countdown.data('hour-label');
				minuteLabel = countdown.data('minute-label');
				secondLabel = countdown.data('second-label');
				digitFontSize = countdown.data('digit-size');
				labelFontSize = countdown.data('label-size');

				if( currentMonth != month || currentYear !== year ) {
					month = month - 1;
				}
				
				//Initialize countdown
				countdown.countdown({
					until: new Date(year, month, day, hour, minute, 44),
					labels: ['', monthLabel, '', dayLabel, hourLabel, minuteLabel, secondLabel],
					format: 'ODHMS',
					timezone: timezone,
					padZeroes: true,
					onTick: setCountdownStyle
				});
				
				function setCountdownStyle() {
					countdown.find('.countdown-amount').css({
						'font-size' : digitFontSize+'px',
						'line-height' : digitFontSize+'px'
					});
					countdown.find('.countdown-period').css({
						'font-size' : labelFontSize+'px'
					});
				}
			});
		}
	}
	
})(jQuery);
(function($) {
	'use strict';
	
	var counter = {};
	edgtf.modules.counter = counter;
	
	counter.edgtfInitCounter = edgtfInitCounter;
	
	
	counter.edgtfOnDocumentReady = edgtfOnDocumentReady;
	
	$(document).ready(edgtfOnDocumentReady);
	
	/*
	 All functions to be called on $(document).ready() should be in this function
	 */
	function edgtfOnDocumentReady() {
		edgtfInitCounter();
	}
	
	/**
	 * Counter Shortcode
	 */
	function edgtfInitCounter() {
		var counterHolder = $('.edgtf-counter-holder');
		
		if (counterHolder.length) {
			counterHolder.each(function() {
				var thisCounterHolder = $(this),
					thisCounter = thisCounterHolder.find('.edgtf-counter');
				
				thisCounterHolder.appear(function() {
					thisCounterHolder.css('opacity', '1');
					
					//Counter zero type
					if (thisCounter.hasClass('edgtf-zero-counter')) {
						var max = parseFloat(thisCounter.text());
						thisCounter.countTo({
							from: 0,
							to: max,
							speed: 1500,
							refreshInterval: 100
						});
					} else {
						thisCounter.absoluteCounter({
							speed: 2000,
							fadeInDelay: 1000
						});
					}
				},{accX: 0, accY: edgtfGlobalVars.vars.edgtfElementAppearAmount});
			});
		}
	}
	
})(jQuery);
(function ($) {
	'use strict';
	
	var customFont = {};
	edgtf.modules.customFont = customFont;
	
	customFont.edgtfCustomFontResize = edgtfCustomFontResize;
	customFont.edgtfCustomFontTypeOut = edgtfCustomFontTypeOut;
	
	
	customFont.edgtfOnDocumentReady = edgtfOnDocumentReady;
	customFont.edgtfOnWindowLoad = edgtfOnWindowLoad;
	
	$(document).ready(edgtfOnDocumentReady);
	$(window).on('load', edgtfOnWindowLoad);
	
	/*
	 All functions to be called on $(document).ready() should be in this function
	 */
	function edgtfOnDocumentReady() {
		edgtfCustomFontResize();
	}
	
	/*
	 All functions to be called on $(window).on('load', ) should be in this function
	 */
	function edgtfOnWindowLoad() {
		edgtfCustomFontTypeOut();
	}
	
	/*
	 **	Custom Font resizing style
	 */
	function edgtfCustomFontResize() {
		var holder = $('.edgtf-custom-font-holder');
		
		if (holder.length) {
			holder.each(function () {
				var thisItem = $(this),
					itemClass = '',
					smallLaptopStyle = '',
					ipadLandscapeStyle = '',
					ipadPortraitStyle = '',
					mobileLandscapeStyle = '',
					style = '',
					responsiveStyle = '';
				
				if (typeof thisItem.data('item-class') !== 'undefined' && thisItem.data('item-class') !== false) {
					itemClass = thisItem.data('item-class');
				}
				
				if (typeof thisItem.data('font-size-1366') !== 'undefined' && thisItem.data('font-size-1366') !== false) {
					smallLaptopStyle += 'font-size: ' + thisItem.data('font-size-1366') + ' !important;';
				}
				if (typeof thisItem.data('font-size-1024') !== 'undefined' && thisItem.data('font-size-1024') !== false) {
					ipadLandscapeStyle += 'font-size: ' + thisItem.data('font-size-1024') + ' !important;';
				}
				if (typeof thisItem.data('font-size-768') !== 'undefined' && thisItem.data('font-size-768') !== false) {
					ipadPortraitStyle += 'font-size: ' + thisItem.data('font-size-768') + ' !important;';
				}
				if (typeof thisItem.data('font-size-680') !== 'undefined' && thisItem.data('font-size-680') !== false) {
					mobileLandscapeStyle += 'font-size: ' + thisItem.data('font-size-680') + ' !important;';
				}
				
				if (typeof thisItem.data('line-height-1366') !== 'undefined' && thisItem.data('line-height-1366') !== false) {
					smallLaptopStyle += 'line-height: ' + thisItem.data('line-height-1366') + ' !important;';
				}
				if (typeof thisItem.data('line-height-1024') !== 'undefined' && thisItem.data('line-height-1024') !== false) {
					ipadLandscapeStyle += 'line-height: ' + thisItem.data('line-height-1024') + ' !important;';
				}
				if (typeof thisItem.data('line-height-768') !== 'undefined' && thisItem.data('line-height-768') !== false) {
					ipadPortraitStyle += 'line-height: ' + thisItem.data('line-height-768') + ' !important;';
				}
				if (typeof thisItem.data('line-height-680') !== 'undefined' && thisItem.data('line-height-680') !== false) {
					mobileLandscapeStyle += 'line-height: ' + thisItem.data('line-height-680') + ' !important;';
				}
				
				if (smallLaptopStyle.length || ipadLandscapeStyle.length || ipadPortraitStyle.length || mobileLandscapeStyle.length) {
					
					if (smallLaptopStyle.length) {
						responsiveStyle += "@media only screen and (max-width: 1366px) {.edgtf-custom-font-holder." + itemClass + " { " + smallLaptopStyle + " } }";
					}
					if (ipadLandscapeStyle.length) {
						responsiveStyle += "@media only screen and (max-width: 1024px) {.edgtf-custom-font-holder." + itemClass + " { " + ipadLandscapeStyle + " } }";
					}
					if (ipadPortraitStyle.length) {
						responsiveStyle += "@media only screen and (max-width: 768px) {.edgtf-custom-font-holder." + itemClass + " { " + ipadPortraitStyle + " } }";
					}
					if (mobileLandscapeStyle.length) {
						responsiveStyle += "@media only screen and (max-width: 680px) {.edgtf-custom-font-holder." + itemClass + " { " + mobileLandscapeStyle + " } }";
					}
				}
				
				if (responsiveStyle.length) {
					style = '<style type="text/css">' + responsiveStyle + '</style>';
				}
				
				if (style.length) {
					$('head').append(style);
				}
			});
		}
	}
	
	/*
	 * Init Type out functionality for Custom Font shortcode
	 */
	function edgtfCustomFontTypeOut() {
		var edgtfTyped = $('.edgtf-cf-typed');
		
		if (edgtfTyped.length) {
			edgtfTyped.each(function () {
				
				//vars
				var thisTyped = $(this),
					typedWrap = thisTyped.parent('.edgtf-cf-typed-wrap'),
					customFontHolder = typedWrap.parent('.edgtf-custom-font-holder'),
					str = [],
					string_1 = thisTyped.find('.edgtf-cf-typed-1').text(),
					string_2 = thisTyped.find('.edgtf-cf-typed-2').text(),
					string_3 = thisTyped.find('.edgtf-cf-typed-3').text(),
					string_4 = thisTyped.find('.edgtf-cf-typed-4').text();
				
				if (string_1.length) {
					str.push(string_1);
				}
				
				if (string_2.length) {
					str.push(string_2);
				}
				
				if (string_3.length) {
					str.push(string_3);
				}
				
				if (string_4.length) {
					str.push(string_4);
				}
				
				customFontHolder.appear(function () {
					thisTyped.typed({
						strings: str,
						typeSpeed: 90,
						backDelay: 700,
						loop: true,
						contentType: 'text',
						loopCount: false,
						cursorChar: '_'
					});
				}, {accX: 0, accY: edgtfGlobalVars.vars.edgtfElementAppearAmount});
			});
		}
	}
	
})(jQuery);
(function($) {
	'use strict';
	
	var elementsHolder = {};
	edgtf.modules.elementsHolder = elementsHolder;
	
	elementsHolder.edgtfInitElementsHolderResponsiveStyle = edgtfInitElementsHolderResponsiveStyle;
	
	
	elementsHolder.edgtfOnDocumentReady = edgtfOnDocumentReady;
	
	$(document).ready(edgtfOnDocumentReady);
	
	/*
	 All functions to be called on $(document).ready() should be in this function
	 */
	function edgtfOnDocumentReady() {
		edgtfInitElementsHolderResponsiveStyle();
	}
	
	/*
	 **	Elements Holder responsive style
	 */
	function edgtfInitElementsHolderResponsiveStyle(){
		var elementsHolder = $('.edgtf-elements-holder');
		
		if(elementsHolder.length){
			elementsHolder.each(function() {
				var thisElementsHolder = $(this),
					elementsHolderItem = thisElementsHolder.children('.edgtf-eh-item'),
					style = '',
					responsiveStyle = '';
				
				elementsHolderItem.each(function() {
					var thisItem = $(this),
						itemClass = '',
						largeLaptop = '',
						smallLaptop = '',
						ipadLandscape = '',
						ipadPortrait = '',
						mobileLandscape = '',
						mobilePortrait = '';
					
					if (typeof thisItem.data('item-class') !== 'undefined' && thisItem.data('item-class') !== false) {
						itemClass = thisItem.data('item-class');
					}
					if (typeof thisItem.data('1280-1600') !== 'undefined' && thisItem.data('1280-1600') !== false) {
						largeLaptop = thisItem.data('1280-1600');
					}
					if (typeof thisItem.data('1024-1280') !== 'undefined' && thisItem.data('1024-1280') !== false) {
						smallLaptop = thisItem.data('1024-1280');
					}
					if (typeof thisItem.data('768-1024') !== 'undefined' && thisItem.data('768-1024') !== false) {
						ipadLandscape = thisItem.data('768-1024');
					}
					if (typeof thisItem.data('680-768') !== 'undefined' && thisItem.data('680-768') !== false) {
						ipadPortrait = thisItem.data('680-768');
					}
					if (typeof thisItem.data('680') !== 'undefined' && thisItem.data('680') !== false) {
						mobileLandscape = thisItem.data('680');
					}
					
					if(largeLaptop.length || smallLaptop.length || ipadLandscape.length || ipadPortrait.length || mobileLandscape.length || mobilePortrait.length) {
						
						if(largeLaptop.length) {
							responsiveStyle += "@media only screen and (min-width: 1281px) and (max-width: 1600px) {.edgtf-eh-item-content."+itemClass+" { padding: "+largeLaptop+" !important; } }";
						}
						if(smallLaptop.length) {
							responsiveStyle += "@media only screen and (min-width: 1025px) and (max-width: 1280px) {.edgtf-eh-item-content."+itemClass+" { padding: "+smallLaptop+" !important; } }";
						}
						if(ipadLandscape.length) {
							responsiveStyle += "@media only screen and (min-width: 769px) and (max-width: 1024px) {.edgtf-eh-item-content."+itemClass+" { padding: "+ipadLandscape+" !important; } }";
						}
						if(ipadPortrait.length) {
							responsiveStyle += "@media only screen and (min-width: 681px) and (max-width: 768px) {.edgtf-eh-item-content."+itemClass+" { padding: "+ipadPortrait+" !important; } }";
						}
						if(mobileLandscape.length) {
							responsiveStyle += "@media only screen and (max-width: 680px) {.edgtf-eh-item-content."+itemClass+" { padding: "+mobileLandscape+" !important; } }";
						}
					}
				});
				
				if(responsiveStyle.length) {
					style = '<style type="text/css">'+responsiveStyle+'</style>';
				}
				
				if(style.length) {
					$('head').append(style);
				}
				
				if (typeof edgtf.modules.common.edgtfOwlSlider === "function") {
					edgtf.modules.common.edgtfOwlSlider();
				}
			});
		}
	}
	
})(jQuery);
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
(function($) {
	'use strict';
	
	var googleMap = {};
	edgtf.modules.googleMap = googleMap;
	
	googleMap.edgtfShowGoogleMap = edgtfShowGoogleMap;
	
	
	googleMap.edgtfOnDocumentReady = edgtfOnDocumentReady;
	
	$(document).ready(edgtfOnDocumentReady);
	
	/*
	 All functions to be called on $(document).ready() should be in this function
	 */
	function edgtfOnDocumentReady() {
		edgtfShowGoogleMap();
	}
	
	/*
	 **	Show Google Map
	 */
	function edgtfShowGoogleMap(){
		var googleMap = $('.edgtf-google-map');
		
		if(googleMap.length){
			googleMap.each(function(){
				var element = $(this);
				
				var snazzyMapStyle = false;
				var snazzyMapCode  = '';
				if(typeof element.data('snazzy-map-style') !== 'undefined' && element.data('snazzy-map-style') === 'yes') {
					snazzyMapStyle = true;
					var snazzyMapHolder = element.parent().find('.edgtf-snazzy-map'),
						snazzyMapCodes  = snazzyMapHolder.val();
					
					if( snazzyMapHolder.length && snazzyMapCodes.length ) {
						snazzyMapCode = JSON.parse( snazzyMapCodes.replace(/`{`/g, '[').replace(/`}`/g, ']').replace(/``/g, '"').replace(/`/g, '') );
					}
				}
				
				var customMapStyle;
				if(typeof element.data('custom-map-style') !== 'undefined') {
					customMapStyle = element.data('custom-map-style');
				}
				
				var colorOverlay;
				if(typeof element.data('color-overlay') !== 'undefined' && element.data('color-overlay') !== false) {
					colorOverlay = element.data('color-overlay');
				}
				
				var saturation;
				if(typeof element.data('saturation') !== 'undefined' && element.data('saturation') !== false) {
					saturation = element.data('saturation');
				}
				
				var lightness;
				if(typeof element.data('lightness') !== 'undefined' && element.data('lightness') !== false) {
					lightness = element.data('lightness');
				}
				
				var zoom;
				if(typeof element.data('zoom') !== 'undefined' && element.data('zoom') !== false) {
					zoom = element.data('zoom');
				}
				
				var pin;
				if(typeof element.data('pin') !== 'undefined' && element.data('pin') !== false) {
					pin = element.data('pin');
				}
				
				var mapHeight;
				if(typeof element.data('height') !== 'undefined' && element.data('height') !== false) {
					mapHeight = element.data('height');
				}
				
				var uniqueId;
				if(typeof element.data('unique-id') !== 'undefined' && element.data('unique-id') !== false) {
					uniqueId = element.data('unique-id');
				}
				
				var scrollWheel;
				if(typeof element.data('scroll-wheel') !== 'undefined') {
					scrollWheel = element.data('scroll-wheel');
				}
				var addresses;
				if(typeof element.data('addresses') !== 'undefined' && element.data('addresses') !== false) {
					addresses = element.data('addresses');
				}
				
				var map = "map_"+ uniqueId;
				var geocoder = "geocoder_"+ uniqueId;
				var holderId = "edgtf-map-"+ uniqueId;
				
				edgtfInitializeGoogleMap(snazzyMapStyle, snazzyMapCode, customMapStyle, colorOverlay, saturation, lightness, scrollWheel, zoom, holderId, mapHeight, pin,  map, geocoder, addresses);
			});
		}
	}
	
	/*
	 **	Init Google Map
	 */
	function edgtfInitializeGoogleMap(snazzyMapStyle, snazzyMapCode, customMapStyle, color, saturation, lightness, wheel, zoom, holderId, height, pin,  map, geocoder, data){
		
		if(typeof google !== 'object') {
			return;
		}
		
		var mapStyles = [];
		if(snazzyMapStyle && snazzyMapCode.length) {
			mapStyles = snazzyMapCode;
		} else {
			mapStyles = [
				{
					stylers: [
						{hue: color },
						{saturation: saturation},
						{lightness: lightness},
						{gamma: 1}
					]
				}
			];
		}
		
		var googleMapStyleId;
		
		if(snazzyMapStyle || customMapStyle === 'yes'){
			googleMapStyleId = 'edgtf-style';
		} else {
			googleMapStyleId = google.maps.MapTypeId.ROADMAP;
		}
		
		wheel = wheel === 'yes';
		
		var qoogleMapType = new google.maps.StyledMapType(mapStyles, {name: "Edge Google Map"});
		
		geocoder = new google.maps.Geocoder();
		var latlng = new google.maps.LatLng(-34.397, 150.644);
		
		if (!isNaN(height)){
			height = height + 'px';
		}
		
		var myOptions = {
			zoom: zoom,
			scrollwheel: wheel,
			center: latlng,
			zoomControl: true,
			zoomControlOptions: {
				style: google.maps.ZoomControlStyle.SMALL,
				position: google.maps.ControlPosition.RIGHT_CENTER
			},
			scaleControl: false,
			scaleControlOptions: {
				position: google.maps.ControlPosition.LEFT_CENTER
			},
			streetViewControl: false,
			streetViewControlOptions: {
				position: google.maps.ControlPosition.LEFT_CENTER
			},
			panControl: false,
			panControlOptions: {
				position: google.maps.ControlPosition.LEFT_CENTER
			},
			mapTypeControl: false,
			mapTypeControlOptions: {
				mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'edgtf-style'],
				style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
				position: google.maps.ControlPosition.LEFT_CENTER
			},
			mapTypeId: googleMapStyleId
		};
		
		map = new google.maps.Map(document.getElementById(holderId), myOptions);
		map.mapTypes.set('edgtf-style', qoogleMapType);
		
		var index;
		
		for (index = 0; index < data.length; ++index) {
			edgtfInitializeGoogleAddress(data[index], pin, map, geocoder);
		}
		
		var holderElement = document.getElementById(holderId);
		holderElement.style.height = height;
	}
	
	/*
	 **	Init Google Map Addresses
	 */
	function edgtfInitializeGoogleAddress(data, pin, map, geocoder){
		if (data === '') {
			return;
		}
		
		var contentString = '<div id="content">'+
			'<div id="siteNotice">'+
			'</div>'+
			'<div id="bodyContent">'+
			'<p>'+data+'</p>'+
			'</div>'+
			'</div>';
		
		var infowindow = new google.maps.InfoWindow({
			content: contentString
		});
		
		geocoder.geocode( { 'address': data}, function(results, status) {
			if (status === google.maps.GeocoderStatus.OK) {
				map.setCenter(results[0].geometry.location);
				var marker = new google.maps.Marker({
					map: map,
					position: results[0].geometry.location,
					icon:  pin,
					title: data.store_title
				});
				google.maps.event.addListener(marker, 'click', function() {
					infowindow.open(map,marker);
				});
				
				google.maps.event.addDomListener(window, 'resize', function() {
					map.setCenter(results[0].geometry.location);
				});
			}
		});
	}
	
})(jQuery);
(function($) {
	'use strict';
	
	var icon = {};
	edgtf.modules.icon = icon;
	
	icon.edgtfIcon = edgtfIcon;
	
	
	icon.edgtfOnDocumentReady = edgtfOnDocumentReady;
	
	$(document).ready(edgtfOnDocumentReady);
	
	/*
	 All functions to be called on $(document).ready() should be in this function
	 */
	function edgtfOnDocumentReady() {
		edgtfIcon().init();
	}
	
	/**
	 * Object that represents icon shortcode
	 * @returns {{init: Function}} function that initializes icon's functionality
	 */
	var edgtfIcon = function() {
		var icons = $('.edgtf-icon-shortcode');
		
		/**
		 * Function that triggers icon animation and icon animation delay
		 */
		var iconAnimation = function(icon) {
			if(icon.hasClass('edgtf-icon-animation')) {
				icon.appear(function() {
					icon.parent('.edgtf-icon-animation-holder').addClass('edgtf-icon-animation-show');
				}, {accX: 0, accY: edgtfGlobalVars.vars.edgtfElementAppearAmount});
			}
		};
		
		/**
		 * Function that triggers icon hover color functionality
		 */
		var iconHoverColor = function(icon) {
			if(typeof icon.data('hover-color') !== 'undefined') {
				var changeIconColor = function(event) {
					event.data.icon.css('color', event.data.color);
				};
				
				var iconElement = icon.find('.edgtf-icon-element');
				var hoverColor = icon.data('hover-color');
				var originalColor = iconElement.css('color');
				
				if(hoverColor !== '') {
					icon.on('mouseenter', {icon: iconElement, color: hoverColor}, changeIconColor);
					icon.on('mouseleave', {icon: iconElement, color: originalColor}, changeIconColor);
				}
			}
		};
		
		/**
		 * Function that triggers icon holder background color hover functionality
		 */
		var iconHolderBackgroundHover = function(icon) {
			if(typeof icon.data('hover-background-color') !== 'undefined') {
				var changeIconBgColor = function(event) {
					event.data.icon.css('background-color', event.data.color);
				};
				
				var hoverBackgroundColor = icon.data('hover-background-color');
				var originalBackgroundColor = icon.css('background-color');
				
				if(hoverBackgroundColor !== '') {
					icon.on('mouseenter', {icon: icon, color: hoverBackgroundColor}, changeIconBgColor);
					icon.on('mouseleave', {icon: icon, color: originalBackgroundColor}, changeIconBgColor);
				}
			}
		};
		
		/**
		 * Function that initializes icon holder border hover functionality
		 */
		var iconHolderBorderHover = function(icon) {
			if(typeof icon.data('hover-border-color') !== 'undefined') {
				var changeIconBorder = function(event) {
					event.data.icon.css('border-color', event.data.color);
				};
				
				var hoverBorderColor = icon.data('hover-border-color');
				var originalBorderColor = icon.css('borderTopColor');
				
				if(hoverBorderColor !== '') {
					icon.on('mouseenter', {icon: icon, color: hoverBorderColor}, changeIconBorder);
					icon.on('mouseleave', {icon: icon, color: originalBorderColor}, changeIconBorder);
				}
			}
		};
		
		return {
			init: function() {
				if(icons.length) {
					icons.each(function() {
						iconAnimation($(this));
						iconHoverColor($(this));
						iconHolderBackgroundHover($(this));
						iconHolderBorderHover($(this));
					});
				}
			}
		};
	};
	
})(jQuery);
(function($) {
	'use strict';
	
	var iconListItem = {};
	edgtf.modules.iconListItem = iconListItem;
	
	iconListItem.edgtfInitIconList = edgtfInitIconList;
	
	
	iconListItem.edgtfOnDocumentReady = edgtfOnDocumentReady;
	
	$(document).ready(edgtfOnDocumentReady);
	
	/*
	 All functions to be called on $(document).ready() should be in this function
	 */
	function edgtfOnDocumentReady() {
		edgtfInitIconList().init();
	}
	
	/**
	 * Button object that initializes icon list with animation
	 * @type {Function}
	 */
	var edgtfInitIconList = function() {
		var iconList = $('.edgtf-animate-list');
		
		/**
		 * Initializes icon list animation
		 * @param list current slider
		 */
		var iconListInit = function(list) {
			setTimeout(function(){
				list.appear(function(){
					list.addClass('edgtf-appeared');
				},{accX: 0, accY: edgtfGlobalVars.vars.edgtfElementAppearAmount});
			},30);
		};
		
		return {
			init: function() {
				if(iconList.length) {
					iconList.each(function() {
						iconListInit($(this));
					});
				}
			}
		};
	};
	
})(jQuery);
(function($) {
    'use strict';
	
	var imageGallery = {};
	edgtf.modules.imageGallery = imageGallery;
	
	imageGallery.edgtfInitImageGalleryMasonry = edgtfInitImageGalleryMasonry;
	
	
	imageGallery.edgtfOnWindowLoad = edgtfOnWindowLoad;
	
	$(window).on('load', edgtfOnWindowLoad);
	
	/*
	 ** All functions to be called on $(window).on('load', ) should be in this function
	 */
	function edgtfOnWindowLoad() {
		edgtfInitImageGalleryMasonry();
	}
	
	/*
	 ** Init Image Gallery shortcode - Masonry layout
	 */
	function edgtfInitImageGalleryMasonry(){
		var holder = $('.edgtf-image-gallery.edgtf-ig-masonry-type');
		
		if(holder.length){
			holder.each(function(){
				var thisHolder = $(this),
					masonry = thisHolder.find('.edgtf-ig-masonry');
				
				masonry.waitForImages(function() {
					masonry.isotope({
						layoutMode: 'packery',
						itemSelector: '.edgtf-ig-image',
						percentPosition: true,
						packery: {
							gutter: '.edgtf-ig-grid-gutter',
							columnWidth: '.edgtf-ig-grid-sizer'
						}
					});
					
					setTimeout(function() {
						masonry.isotope('layout');
						edgtf.modules.common.edgtfInitParallax();
					}, 800);
					
					masonry.css('opacity', '1');
				});
			});
		}
	}

})(jQuery);
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

(function($) {
	'use strict';
	
	var pieChart = {};
	edgtf.modules.pieChart = pieChart;
	
	pieChart.edgtfInitPieChart = edgtfInitPieChart;
	
	
	pieChart.edgtfOnDocumentReady = edgtfOnDocumentReady;
	
	$(document).ready(edgtfOnDocumentReady);
	
	/*
	 All functions to be called on $(document).ready() should be in this function
	 */
	function edgtfOnDocumentReady() {
		edgtfInitPieChart();
	}
	
	/**
	 * Init Pie Chart shortcode
	 */
	function edgtfInitPieChart() {
		var pieChartHolder = $('.edgtf-pie-chart-holder');
		
		if (pieChartHolder.length) {
			pieChartHolder.each(function () {
				var thisPieChartHolder = $(this),
					pieChart = thisPieChartHolder.children('.edgtf-pc-percentage'),
					barColor = '#25abd1',
					trackColor = '#f7f7f7',
					lineWidth = 3,
					size = 176;
				
				if(typeof pieChart.data('size') !== 'undefined' && pieChart.data('size') !== '') {
					size = pieChart.data('size');
				}
				
				if(typeof pieChart.data('bar-color') !== 'undefined' && pieChart.data('bar-color') !== '') {
					barColor = pieChart.data('bar-color');
				}
				
				if(typeof pieChart.data('track-color') !== 'undefined' && pieChart.data('track-color') !== '') {
					trackColor = pieChart.data('track-color');
				}
				
				pieChart.appear(function() {
					initToCounterPieChart(pieChart);
					thisPieChartHolder.css('opacity', '1');
					
					pieChart.easyPieChart({
						barColor: barColor,
						trackColor: trackColor,
						scaleColor: false,
						lineCap: 'butt',
						lineWidth: lineWidth,
						animate: 1500,
						size: size
					});
				},{accX: 0, accY: edgtfGlobalVars.vars.edgtfElementAppearAmount});
			});
		}
	}
	
	/*
	 **	Counter for pie chart number from zero to defined number
	 */
	function initToCounterPieChart(pieChart){
		var counter = pieChart.find('.edgtf-pc-percent'),
			max = parseFloat(counter.text());
		
		counter.countTo({
			from: 0,
			to: max,
			speed: 1500,
			refreshInterval: 50
		});
	}
	
})(jQuery);
(function($) {
	'use strict';
	
	var process = {};
	edgtf.modules.process = process;
	
	process.edgtfInitProcess = edgtfInitProcess;
	
	
	process.edgtfOnDocumentReady = edgtfOnDocumentReady;
	
	$(document).ready(edgtfOnDocumentReady);
	
	/*
	 All functions to be called on $(document).ready() should be in this function
	 */
	function edgtfOnDocumentReady() {
		edgtfInitProcess();
	}
	
	/**
	 * Inti process shortcode on appear
	 */
	function edgtfInitProcess() {
		var holder = $('.edgtf-process-holder');
		
		if(holder.length) {
			holder.each(function(){
				var thisHolder = $(this);
				
				thisHolder.appear(function(){
					thisHolder.addClass('edgtf-process-appeared');
				},{accX: 0, accY: edgtfGlobalVars.vars.edgtfElementAppearAmount});
			});
		}
	}
	
})(jQuery);
(function($) {
	'use strict';
	
	var progressBar = {};
	edgtf.modules.progressBar = progressBar;
	
	progressBar.edgtfInitProgressBars = edgtfInitProgressBars;
	
	
	progressBar.edgtfOnDocumentReady = edgtfOnDocumentReady;
	
	$(document).ready(edgtfOnDocumentReady);
	
	/*
	 All functions to be called on $(document).ready() should be in this function
	 */
	function edgtfOnDocumentReady() {
		edgtfInitProgressBars();
	}
	
	/*
	 **	Horizontal progress bars shortcode
	 */
	function edgtfInitProgressBars(){
		var progressBar = $('.edgtf-progress-bar');
		
		if(progressBar.length){
			progressBar.each(function() {
				var thisBar = $(this),
					thisBarContent = thisBar.find('.edgtf-pb-content'),
					percentage = thisBarContent.data('percentage');
				
				thisBar.appear(function() {
					edgtfInitToCounterProgressBar(thisBar, percentage);
					
					thisBarContent.css('width', '0%');
					thisBarContent.animate({'width': percentage+'%'}, 2000);
				});
			});
		}
	}
	
	/*
	 **	Counter for horizontal progress bars percent from zero to defined percent
	 */
	function edgtfInitToCounterProgressBar(progressBar, $percentage){
		var percentage = parseFloat($percentage),
			percent = progressBar.find('.edgtf-pb-percent');
		
		if(percent.length) {
			percent.each(function() {
				var thisPercent = $(this);
				thisPercent.css('opacity', '1');
				
				thisPercent.countTo({
					from: 0,
					to: percentage,
					speed: 2000,
					refreshInterval: 50
				});
			});
		}
	}
	
})(jQuery);
(function($) {
	'use strict';
	
	var sectionTitle = {};
	edgtf.modules.sectionTitle = sectionTitle;
	
	sectionTitle.edgtfInitSectionTitle = edgtfInitSectionTitle;
	sectionTitle.edgtfOnDocumentReady = edgtfOnDocumentReady;
	
	$(document).ready(edgtfOnDocumentReady);
	
	/*
	 All functions to be called on $(document).ready() should be in this function
	 */
	function edgtfOnDocumentReady() {
		edgtfInitSectionTitle();
	}
	
	/*
	 **	Section Title appear animation
	 */
	function edgtfInitSectionTitle(){
		var sectionTitle = $('.edgtf-section-title-holder.edgtf-st-appear-fx');
		
		if(sectionTitle.length){
			sectionTitle.each(function(){
				edgtf.modules.common.edgtfElementInView(sectionTitle);
			});
		}
	}
	
})(jQuery);
(function($) {
	'use strict';
	
	var tabs = {};
	edgtf.modules.tabs = tabs;
	
	tabs.edgtfInitTabs = edgtfInitTabs;
	
	
	tabs.edgtfOnDocumentReady = edgtfOnDocumentReady;
	
	$(document).ready(edgtfOnDocumentReady);
	
	/*
	 All functions to be called on $(document).ready() should be in this function
	 */
	function edgtfOnDocumentReady() {
		edgtfInitTabs();
	}
	
	/*
	 **	Init tabs shortcode
	 */
	function edgtfInitTabs(){
		var tabs = $('.edgtf-tabs');
		
		if(tabs.length){
			tabs.each(function(){
				var thisTabs = $(this);
				
				thisTabs.children('.edgtf-tab-container').each(function(index){
					index = index + 1;
					var that = $(this),
						link = that.attr('id'),
						navItem = that.parent().find('.edgtf-tabs-nav li:nth-child('+index+') a'),
						navLink = navItem.attr('href');
					
					link = '#'+link;

					if(link.indexOf(navLink) > -1) {
						navItem.attr('href',link);
					}
				});
				
				thisTabs.tabs();

                $('.edgtf-tabs a.edgtf-external-link').off('click');
			});
		}
	}
	
})(jQuery);
(function($) {
    'use strict';

    var portfolioList = {};
    edgtf.modules.portfolioList = portfolioList;

    portfolioList.edgtfOnDocumentReady = edgtfOnDocumentReady;
    portfolioList.edgtfOnWindowLoad = edgtfOnWindowLoad;
    portfolioList.edgtfOnWindowResize = edgtfOnWindowResize;
    portfolioList.edgtfOnWindowScroll = edgtfOnWindowScroll;

    $(document).ready(edgtfOnDocumentReady);
    $(window).on('load', edgtfOnWindowLoad);
    $(window).resize(edgtfOnWindowResize);
    $(window).scroll(edgtfOnWindowScroll);

    /*
     All functions to be called on $(document).ready() should be in this function
     */
    function edgtfOnDocumentReady() {

    }

    /*
     All functions to be called on $(window).on('load', ) should be in this function
     */
    function edgtfOnWindowLoad() {
        edgtfInitPortfolioMasonry();
        edgtfInitPortfolioFilter();
        edgtfInitPortfolioListAnimation();
	    edgtfInitPortfolioPagination().init();
    }

    /*
     All functions to be called on $(window).resize() should be in this function
     */
    function edgtfOnWindowResize() {
        edgtfInitPortfolioMasonry();
    }

    /*
     All functions to be called on $(window).scroll() should be in this function
     */
    function edgtfOnWindowScroll() {
	    edgtfInitPortfolioPagination().scroll();
    }

    /**
     * Initializes portfolio list article animation
     */
    function edgtfInitPortfolioListAnimation(){
        var portList = $('.edgtf-portfolio-list-holder.edgtf-pl-has-animation');

        if(portList.length){
            portList.each(function(){
                var thisPortList = $(this).children('.edgtf-pl-inner');

                thisPortList.children('article').each(function(l) {
                    var thisArticle = $(this);

                    thisArticle.appear(function() {
                        thisArticle.addClass('edgtf-item-show');

                        setTimeout(function(){
                            thisArticle.addClass('edgtf-item-shown');
                        }, 1000);
                    },{accX: 0, accY: 0});
                });
            });
        }
    }

    /**
     * Initializes portfolio list
     */
    function edgtfInitPortfolioMasonry(){
        var portList = $('.edgtf-portfolio-list-holder.edgtf-pl-masonry');

        if(portList.length){
            portList.each(function(){
                var thisPortList = $(this),
                    masonry = thisPortList.children('.edgtf-pl-inner'),
                    size = thisPortList.find('.edgtf-pl-grid-sizer').width();

                edgtfResizePortfolioItems(size, thisPortList);

                masonry.isotope({
                    layoutMode: 'packery',
                    itemSelector: 'article',
                    percentPosition: true,
                    packery: {
                        gutter: '.edgtf-pl-grid-gutter',
                        columnWidth: '.edgtf-pl-grid-sizer'
                    }
                });

                setTimeout(function () {
	                edgtf.modules.common.edgtfInitParallax();
                }, 600);

                masonry.css('opacity', '1');
            });
        }
    }

    /**
     * Init Resize Portfolio Items
     */
    function edgtfResizePortfolioItems(size,container){
        if(container.hasClass('edgtf-pl-images-fixed')) {
            var padding = parseInt(container.find('article').css('padding-left')),
                defaultMasonryItem = container.find('.edgtf-pl-masonry-default'),
                largeWidthMasonryItem = container.find('.edgtf-pl-masonry-large-width'),
                largeHeightMasonryItem = container.find('.edgtf-pl-masonry-large-height'),
                largeWidthHeightMasonryItem = container.find('.edgtf-pl-masonry-large-width-height');

            if (edgtf.windowWidth > 680) {
                defaultMasonryItem.css('height', size - 2 * padding);
                largeHeightMasonryItem.css('height', Math.round(2 * size) - 2 * padding);
                largeWidthHeightMasonryItem.css('height', Math.round(2 * size) - 2 * padding);
                largeWidthMasonryItem.css('height', size - 2 * padding);
            } else {
                defaultMasonryItem.css('height', size);
                largeHeightMasonryItem.css('height', size * 2);
                largeWidthHeightMasonryItem.css('height', size);
                largeWidthMasonryItem.css('height', Math.round(size / 2));
            }
        }
    }

    /**
     * Initializes portfolio masonry filter
     */
    function edgtfInitPortfolioFilter(){
        var filterHolder = $('.edgtf-portfolio-list-holder .edgtf-pl-filter-holder');

        if(filterHolder.length){
            filterHolder.each(function(){
                var thisFilterHolder = $(this),
                    thisPortListHolder = thisFilterHolder.closest('.edgtf-portfolio-list-holder'),
                    thisPortListInner = thisPortListHolder.find('.edgtf-pl-inner'),
                    portListHasLoadMore = thisPortListHolder.hasClass('edgtf-pl-pag-load-more') ? true : false;

                thisFilterHolder.find('.edgtf-pl-filter:first').addClass('edgtf-pl-current');

	            if(thisPortListHolder.hasClass('edgtf-pl-gallery')) {
		            thisPortListInner.isotope();
	            }

                thisFilterHolder.find('.edgtf-pl-filter').on('click', function(){
                    var thisFilter = $(this),
                        filterValue = thisFilter.attr('data-filter'),
                        filterClassName = filterValue.length ? filterValue.substring(1) : '',
	                    portListHasArticles = thisPortListInner.children().hasClass(filterClassName) ? true : false;

                    thisFilter.parent().children('.edgtf-pl-filter').removeClass('edgtf-pl-current');
                    thisFilter.addClass('edgtf-pl-current');

	                if(portListHasLoadMore && !portListHasArticles && filterValue.length) {
		                edgtfInitLoadMoreItemsPortfolioFilter(thisPortListHolder, filterValue, filterClassName);
	                } else {
		                filterValue = filterValue.length === 0 ? '*' : filterValue;

                        thisFilterHolder.parent().children('.edgtf-pl-inner').isotope({ filter: filterValue });
	                    edgtf.modules.common.edgtfInitParallax();
                    }
                });
            });
        }
    }

    /**
     * Initializes load more items if portfolio masonry filter item is empty
     */
    function edgtfInitLoadMoreItemsPortfolioFilter($portfolioList, $filterValue, $filterClassName) {
        var thisPortList = $portfolioList,
            thisPortListInner = thisPortList.find('.edgtf-pl-inner'),
            filterValue = $filterValue,
            filterClassName = $filterClassName,
            maxNumPages = 0;

        if (typeof thisPortList.data('max-num-pages') !== 'undefined' && thisPortList.data('max-num-pages') !== false) {
            maxNumPages = thisPortList.data('max-num-pages');
        }

        var	loadMoreDatta = edgtf.modules.common.getLoadMoreData(thisPortList),
            nextPage = loadMoreDatta.nextPage,
	        ajaxData = edgtf.modules.common.setLoadMoreAjaxData(loadMoreDatta, 'edgtf_core_portfolio_ajax_load_more'),
            loadingItem = thisPortList.find('.edgtf-pl-loading');

        if(nextPage <= maxNumPages) {
            loadingItem.addClass('edgtf-showing edgtf-filter-trigger');
            thisPortListInner.css('opacity', '0');

            $.ajax({
                type: 'POST',
                data: ajaxData,
                url: edgtfGlobalVars.vars.edgtfAjaxUrl,
                success: function (data) {
                    nextPage++;
                    thisPortList.data('next-page', nextPage);
                    var response = $.parseJSON(data),
                        responseHtml = response.html;

                    thisPortList.waitForImages(function () {
                        thisPortListInner.append(responseHtml).isotope('reloadItems').isotope({sortBy: 'original-order'});
                        var portListHasArticles = !!thisPortListInner.children().hasClass(filterClassName);

                        if(portListHasArticles) {
                            setTimeout(function() {
                                edgtfResizePortfolioItems(thisPortListInner.find('.edgtf-pl-grid-sizer').width(), thisPortList);
                                thisPortListInner.isotope('layout').isotope({filter: filterValue});
                                loadingItem.removeClass('edgtf-showing edgtf-filter-trigger');

                                setTimeout(function() {
                                    thisPortListInner.css('opacity', '1');
                                    edgtfInitPortfolioListAnimation();
	                                edgtf.modules.common.edgtfInitParallax();
                                }, 150);
                            }, 400);
                        } else {
                            loadingItem.removeClass('edgtf-showing edgtf-filter-trigger');
                            edgtfInitLoadMoreItemsPortfolioFilter(thisPortList, filterValue, filterClassName);
                        }
                    });
                }
            });
        }
    }

	/**
	 * Initializes portfolio pagination functions
	 */
	function edgtfInitPortfolioPagination(){
		var portList = $('.edgtf-portfolio-list-holder');

		var initStandardPagination = function(thisPortList) {
			var standardLink = thisPortList.find('.edgtf-pl-standard-pagination li');

			if(standardLink.length) {
				standardLink.each(function(){
					var thisLink = $(this).children('a'),
						pagedLink = 1;

					thisLink.on('click', function(e) {
						e.preventDefault();
						e.stopPropagation();

						if (typeof thisLink.data('paged') !== 'undefined' && thisLink.data('paged') !== false) {
							pagedLink = thisLink.data('paged');
						}

						initMainPagFunctionality(thisPortList, pagedLink);
					});
				});
			}
		};

		var initLoadMorePagination = function(thisPortList) {
			var loadMoreButton = thisPortList.find('.edgtf-pl-load-more a');

			loadMoreButton.on('click', function(e) {
				e.preventDefault();
				e.stopPropagation();

				initMainPagFunctionality(thisPortList);
			});
		};

		var initInifiteScrollPagination = function(thisPortList) {
			var portListHeight = thisPortList.outerHeight(),
				portListTopOffest = thisPortList.offset().top,
				portListPosition = portListHeight + portListTopOffest - edgtfGlobalVars.vars.edgtfAddForAdminBar;

			if(!thisPortList.hasClass('edgtf-pl-infinite-scroll-started') && edgtf.scroll + edgtf.windowHeight > portListPosition) {
				initMainPagFunctionality(thisPortList);
			}
		};

		var initMainPagFunctionality = function(thisPortList, pagedLink) {
			var thisPortListInner = thisPortList.find('.edgtf-pl-inner'),
				nextPage,
				maxNumPages;

			if (typeof thisPortList.data('max-num-pages') !== 'undefined' && thisPortList.data('max-num-pages') !== false) {
				maxNumPages = thisPortList.data('max-num-pages');
			}

			if(thisPortList.hasClass('edgtf-pl-pag-standard')) {
				thisPortList.data('next-page', pagedLink);
			}

			if(thisPortList.hasClass('edgtf-pl-pag-infinite-scroll')) {
				thisPortList.addClass('edgtf-pl-infinite-scroll-started');
			}

			var loadMoreDatta = edgtf.modules.common.getLoadMoreData(thisPortList),
				loadingItem = thisPortList.find('.edgtf-pl-loading');

			nextPage = loadMoreDatta.nextPage;

			if(nextPage <= maxNumPages || maxNumPages === 0){
				if(thisPortList.hasClass('edgtf-pl-pag-standard')) {
					loadingItem.addClass('edgtf-showing edgtf-standard-pag-trigger');
					thisPortList.addClass('edgtf-pl-pag-standard-animate');
				} else {
					loadingItem.addClass('edgtf-showing');
				}

				var ajaxData = edgtf.modules.common.setLoadMoreAjaxData(loadMoreDatta, 'edgtf_core_portfolio_ajax_load_more');

				$.ajax({
					type: 'POST',
					data: ajaxData,
					url: edgtfGlobalVars.vars.edgtfAjaxUrl,
					success: function (data) {
						if(!thisPortList.hasClass('edgtf-pl-pag-standard')) {
							nextPage++;
						}

						thisPortList.data('next-page', nextPage);

						var response = $.parseJSON(data),
							responseHtml =  response.html;

						if(thisPortList.hasClass('edgtf-pl-pag-standard')) {
							edgtfInitStandardPaginationLinkChanges(thisPortList, maxNumPages, nextPage);

							thisPortList.waitForImages(function(){
								if(thisPortList.hasClass('edgtf-pl-masonry')){
									edgtfInitHtmlIsotopeNewContent(thisPortList, thisPortListInner, loadingItem, responseHtml);
								} else if (thisPortList.hasClass('edgtf-pl-gallery') && thisPortList.hasClass('edgtf-pl-has-filter')) {
									edgtfInitHtmlIsotopeNewContent(thisPortList, thisPortListInner, loadingItem, responseHtml);
								} else {
									edgtfInitHtmlGalleryNewContent(thisPortList, thisPortListInner, loadingItem, responseHtml);
								}
							});
						} else {
							thisPortList.waitForImages(function(){
								if(thisPortList.hasClass('edgtf-pl-masonry')){
								    if(pagedLink == 1) {
                                        edgtfInitHtmlIsotopeNewContent(thisPortList, thisPortListInner, loadingItem, responseHtml);
                                    } else {
                                        edgtfInitAppendIsotopeNewContent(thisPortList, thisPortListInner, loadingItem, responseHtml);
                                    }
								} else if (thisPortList.hasClass('edgtf-pl-gallery') && thisPortList.hasClass('edgtf-pl-has-filter') && pagedLink != 1) {
									edgtfInitAppendIsotopeNewContent(thisPortList, thisPortListInner, loadingItem, responseHtml);
								} else {
								    if (pagedLink == 1) {
                                        edgtfInitHtmlGalleryNewContent(thisPortList, thisPortListInner, loadingItem, responseHtml);
                                    } else {
                                        edgtfInitAppendGalleryNewContent(thisPortListInner, loadingItem, responseHtml);
                                    }
								}
							});
						}

						if(thisPortList.hasClass('edgtf-pl-infinite-scroll-started')) {
							thisPortList.removeClass('edgtf-pl-infinite-scroll-started');
						}
					}
				});
			}

			if(nextPage === maxNumPages){
				thisPortList.find('.edgtf-pl-load-more-holder').hide();
			}
		};

		var edgtfInitStandardPaginationLinkChanges = function(thisPortList, maxNumPages, nextPage) {
			var standardPagHolder = thisPortList.find('.edgtf-pl-standard-pagination'),
				standardPagNumericItem = standardPagHolder.find('li.edgtf-pl-pag-number'),
				standardPagPrevItem = standardPagHolder.find('li.edgtf-pl-pag-prev a'),
				standardPagNextItem = standardPagHolder.find('li.edgtf-pl-pag-next a');

			standardPagNumericItem.removeClass('edgtf-pl-pag-active');
			standardPagNumericItem.eq(nextPage-1).addClass('edgtf-pl-pag-active');

			standardPagPrevItem.data('paged', nextPage-1);
			standardPagNextItem.data('paged', nextPage+1);

			if(nextPage > 1) {
				standardPagPrevItem.css({'opacity': '1'});
			} else {
				standardPagPrevItem.css({'opacity': '0'});
			}

			if(nextPage === maxNumPages) {
				standardPagNextItem.css({'opacity': '0'});
			} else {
				standardPagNextItem.css({'opacity': '1'});
			}
		};

		var edgtfInitHtmlIsotopeNewContent = function(thisPortList, thisPortListInner, loadingItem, responseHtml) {
            thisPortListInner.find('article').remove();
            thisPortListInner.append(responseHtml);
            edgtfResizePortfolioItems(thisPortListInner.find('.edgtf-pl-grid-sizer').width(), thisPortList);
            thisPortListInner.isotope('reloadItems').isotope({sortBy: 'original-order'});
			loadingItem.removeClass('edgtf-showing edgtf-standard-pag-trigger');
			thisPortList.removeClass('edgtf-pl-pag-standard-animate');

			setTimeout(function() {
				thisPortListInner.isotope('layout');
				edgtfInitPortfolioListAnimation();
				edgtf.modules.common.edgtfInitParallax();
				edgtf.modules.common.edgtfPrettyPhoto();
			}, 600);
		};

		var edgtfInitHtmlGalleryNewContent = function(thisPortList, thisPortListInner, loadingItem, responseHtml) {
			loadingItem.removeClass('edgtf-showing edgtf-standard-pag-trigger');
			thisPortList.removeClass('edgtf-pl-pag-standard-animate');
			thisPortListInner.html(responseHtml);
			edgtfInitPortfolioListAnimation();
			edgtf.modules.common.edgtfInitParallax();
			edgtf.modules.common.edgtfPrettyPhoto();
		};

		var edgtfInitAppendIsotopeNewContent = function(thisPortList, thisPortListInner, loadingItem, responseHtml) {
            thisPortListInner.append(responseHtml);
            edgtfResizePortfolioItems(thisPortListInner.find('.edgtf-pl-grid-sizer').width(), thisPortList);
            thisPortListInner.isotope('reloadItems').isotope({sortBy: 'original-order'});
			loadingItem.removeClass('edgtf-showing');

			setTimeout(function() {
				thisPortListInner.isotope('layout');
				edgtfInitPortfolioListAnimation();
				edgtf.modules.common.edgtfInitParallax();
				edgtf.modules.common.edgtfPrettyPhoto();
			}, 600);
		};

		var edgtfInitAppendGalleryNewContent = function(thisPortListInner, loadingItem, responseHtml) {
			loadingItem.removeClass('edgtf-showing');
			thisPortListInner.append(responseHtml);
			edgtfInitPortfolioListAnimation();
			edgtf.modules.common.edgtfInitParallax();
			edgtf.modules.common.edgtfPrettyPhoto();
		};

		return {
			init: function() {
				if(portList.length) {
					portList.each(function() {
						var thisPortList = $(this);

						if(thisPortList.hasClass('edgtf-pl-pag-standard')) {
							initStandardPagination(thisPortList);
						}

						if(thisPortList.hasClass('edgtf-pl-pag-load-more')) {
							initLoadMorePagination(thisPortList);
						}

						if(thisPortList.hasClass('edgtf-pl-pag-infinite-scroll')) {
							initInifiteScrollPagination(thisPortList);
						}
					});
				}
			},
			scroll: function() {
				if(portList.length) {
					portList.each(function() {
						var thisPortList = $(this);

						if(thisPortList.hasClass('edgtf-pl-pag-infinite-scroll')) {
							initInifiteScrollPagination(thisPortList);
						}
					});
				}
			},
            getMainPagFunction: function(thisPortList, paged) {
                initMainPagFunctionality(thisPortList, paged);
            }
		};
	}

})(jQuery);
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