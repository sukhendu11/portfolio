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