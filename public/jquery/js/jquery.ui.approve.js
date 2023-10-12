;(function($) {
	
$.fn.approverdialog = function(settings) {
	var that = $(this);
	var lookupDefaults = {
		approveflow : "",
		approvegroup : "",
		approvetitle : "Approval Configuration",
		approveConfigure : function(approveid,approveroleid,levelid,alterid,alterroleid,alteruserid) { },
		approveClose : function() { }
	};
	
	var p = $.extend({},lookupDefaults, settings);		
	var $fsapplayer = $('<div class="modal fade pt-page pt-page-item" tabindex="-1" role="dialog"></div>');
	var $mdlayer = $('<div class="modal-dialog modal-lg"></div>');
	var $contentlayer = $('<div class="modal-content portal-area" style="margin-left:15px; padding-top: 10px; padding-left: 5px; padding-bottom:15px;"></div>');
	var $headlayer = $('<div class="modal-header"></div>');
	var $button = $('<button type="button" class="close" data-dismiss="modal">&times;</button>');
	var $h4 = $('<h4 class="modal-title" id="modalheadertitle"></h4>');
	var $entrylayer = $('<div class="entry-dialog-layer"></div>');
	var $iframe = $('<iframe width="100%" height="550px" style="border:none; margin:0px;"></iframe>');
	$h4.append(p.approvetitle);
	$headlayer.append($button).append($h4);
	$entrylayer.append($iframe);
	$contentlayer.append($headlayer).append($entrylayer);
	$mdlayer.append($contentlayer);
	$fsapplayer.append($mdlayer);
	that.empty().append($fsapplayer);
	var approve_url = "../pmte014/pmte014_plugin.jsp?seed="+Math.random()+"&approveflow="+p.approveflow+"&approvegroup="+p.approvegroup;
	$iframe.attr("src",approve_url);
	$fsapplayer.modal("show");
	$fsapplayer.find(".modal-dialog").draggable();
	window.closeConfigDialog = function() { try { $fsapplayer.modal("hide"); p.approveClose(); } catch(ex) { } };
	window.configDialogTitle = function(title) { if(title) { $h4.html(title); } };
	window.approveConfigure = function(appid,approleid,lvid,altid,altroleid,altuserid) { p.approveConfigure(appid,approleid,lvid,altid,altroleid,altuserid); };	
	/*
	var xhr = jQuery.ajax({
		url: "../pmte014/pmte014_plugin_dialog.jsp",
		type: "POST",
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		dataType: "html",
		error : function(transport,status,errorThrown) {
			console.log(errorThrown);
		},
		success: function(data,status,transport){
			that.html(data);
			$("#fspluginapproveframe").attr("src",approve_url);
			$("#fsapprovepluginmodaldialog_layer").modal("show");
			that.find(".modal-dialog").draggable();
		}
	});	
	window.closeConfigDialog = function() { try { $("#fsapprovepluginmodaldialog_layer").modal("hide"); } catch(ex) { } };
	*/
};

})(jQuery);
