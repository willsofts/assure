/*  
    Editor jQuery Plugin implement for handle input text can edit or not
     Author : Tassun Oros (TSO)
    Sample usage:  
	$(document).ready(function(){
		$("#myInputElement").editor({edit:false});
	});
 */
$.fn.editor = function(options){
	$.fn.editor.defaults = {
        edit:true,
		height: 0,
        styles: ""
    };
	var opts = $.extend({}, $.fn.editor.defaults, options);
	return this.each(function(){
		var input = $(this);
		var $inputId = input.attr("id");
		if(opts.edit) {
			input.next(".fs-editor-span:eq(0)").remove();				
			input.css("display","");
			if(input.is(".idate")) { input.next().css("display",""); $("#LK"+input.attr("id")).css("display",""); }
			if(input.is(".ilookup")) { $("#LK"+input.attr("id")).css("display",""); }		
		} else {
			var txt = input.val();
			if(input.is("select")) txt = $("option:selected",input).text()
			input.next(".fs-editor-span:eq(0)").remove();		
			//var ispan = $("<span class='fs-editor-span' id='"+($inputId+"_span")+"' style='display:inline-block; padding-top:3px; white-space: nowrap; "+opts.styles+"'></span>").html(this.value);
			var ispan = $("<span class='fs-editor-span' id='"+($inputId+"_span")+"' style='white-space: nowrap; "+opts.styles+"'></span>").text(txt);
			ispan.css("text-align",input.css("text-align"));
			if(input.is(".idecimal")) ispan.css("text-align","right");
			//ispan.height(input.innerHeight()+opts.height);
			//ispan.width(input.outerWidth());
			input.css("display","none");
			if(input.is(".idate")) { input.next().css("display","none"); $("#LK"+input.attr("id")).css("display","none"); }
			if(input.is(".ilookup")) { $("#LK"+input.attr("id")).css("display","none"); }
			ispan.insertAfter(input);			
		}
	});	
};
