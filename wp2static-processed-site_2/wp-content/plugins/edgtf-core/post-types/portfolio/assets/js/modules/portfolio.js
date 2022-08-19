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