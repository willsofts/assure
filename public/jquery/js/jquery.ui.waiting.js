/*  
    Editor jQuery Plugin implement for handle waiting animation
     Author : Tassun Oros (TSO)
    Sample usage:  
	$(document).ready(function(){
		$("#myInputElement").startWaiting();
		$("#myInputElement").stopWaiting();
	});
 */
$.fn.startWaiting = function(options){
	$.fn.startWaiting.defaults = {
		width: 25,
		height: 25,
        styles: "",
		before: null,
    };
	var opts = $.extend({}, $.fn.startWaiting.defaults, options);
	return this.each(function(){
		var $element = $(this);
		//var p = $element.position();
		//var $img = $("<div class=\"fs-waiting-layer-loader\"><img class=\"fs-waiting-image-loader\" src=\"../img/loading.gif\" width=\""+opts.width+"px\" height=\""+opts.height+"px;\"></img></div>");
		var $img = $("<img class=\"fs-waiting-image-loader\" src=\"../img/loading.gif\" width=\""+opts.width+"px\" height=\""+opts.height+"px;\"></img>");
		//$element.append($img);	
		if(opts.before && opts.before!="") {
			$img.insertBefore($(opts.before));
		} else {
			var childs = $element.children();
			if(childs.length>0) {
				var child = childs.eq(0);
				$img.insertBefore(child);
			} else {
				$element.append($img);
			}
		}
	});	
};
$.fn.stopWaiting = function(options){
	return this.each(function(){
		$(this).find("img.fs-waiting-image-loader").remove();
	});	
};
