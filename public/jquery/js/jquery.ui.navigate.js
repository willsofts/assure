;(function($) {
	
$.fn.userslookup = function(settings) {
	var that = $(this);
	var lookupDefaults = {
			dialogTitle : "Users Lookup",
			dialogWidth : 830,
			dialogHeight : 450,
			dialogURL : "../nav/nav002.jsp?seed="+Math.random(),
			dialogFeatures : "scrollbars=no;center=yes;border=thin;help=no;status=no;resizable=yes;",
			afterLookup : function(data,reply) { 
				var adata = null;
				if(data.cell) {
					adata = data;
				} else adata = data[0];
				that.val(adata.cell[0]); 
				try { 
					if(data.language && ("EN"==data.language)) {
						$("#"+that.attr("id")+"desc").html(adata.cell[1]+"  "+adata.cell[2]); 
						$("#"+that.attr("id")+"desc").val(adata.cell[1]+"  "+adata.cell[2]); 
					} else {
						$("#"+that.attr("id")+"desc").html(adata.cell[1]+"  "+adata.cell[2]); 
						$("#"+that.attr("id")+"desc").val(adata.cell[1]+"  "+adata.cell[2]); 
					}
				}catch(ex) { }				
			},	
			singleSelect: true,
			afterOpen : function(reply) { }
	};
	var p = $.extend({},lookupDefaults, settings);	
	p.query = that.val();

	var fs_frame_id = 'fs_lookup_iframe_' + Math.round(new Date().getTime() / 1000);
	var fs_lookupframe = $("<iframe id='"+fs_frame_id+"' name='"+fs_frame_id+"' width='100%' height='100%' scrolling='no' frameBorder='0'></iframe>");
	var fs_dialoglayer = $("<div style='display:none; padding: 5px;'></div>");
	fs_dialoglayer.append(fs_lookupframe);
	$("body").after(fs_dialoglayer);
	var fs_lookupdialog = fs_dialoglayer.dialog({
		autoOpen: false, modal: true, title: p.dialogTitle,
		width: p.dialogWidth, height: p.dialogHeight, 
		open: function( event, ui ) { 
			var par = fs_dialoglayer.parent();
			var pos = par.position();
			var h = (p.dialogHeight + 10 - par.height()) / 2;
			fs_dialoglayer.height(p.dialogHeight+10);  
			par.css("top", pos.top - h);
		},
		beforeClose: function( event, ui ) { setTimeout(function() { try { fs_dialoglayer.remove(); }catch(ex) { } },500); }
	});
	window.getShowLookupDialogArguments = function() { return p; };
	window.closeLookupDialog = function() { try { fs_lookupdialog.dialog("close"); } catch(ex) { } };
	window.configLookupDialogTitle = function(title) { try { fs_lookupdialog.dialog("option","title",title); } catch(ex) { } };
	window.afterShowLookupDialog = function(args) { 
		try { fs_lookupdialog.dialog("close"); } catch(ex) { }
		try { p.afterLookup(args); } catch(ex) { }
	};
	var fs_lookupwin = window.open(p.dialogURL,fs_frame_id);
	fs_lookupwin.opener = self;
	fs_lookupdialog.dialog("open");
	fs_lookupdialog.parent().css("zIndex",5002);
	fs_lookupdialog.parent().next(".ui-widget-overlay").css("zIndex",5001);
};

$.fn.userlookup = function(settings) {
	var that = $(this);
	var lookupDefaults = {
			dialogTitle : "User Lookup",
			dialogWidth : 830,
			dialogHeight : 450,
			dialogURL : "../nav/nav003.jsp?seed="+Math.random(),
			dialogFeatures : "scrollbars=no;center=yes;border=thin;help=no;status=no;resizable=yes;",
			afterLookup : function(data,reply) { 
				var adata = null;
				if(data.cell) {
					adata = data;
				} else adata = data[0];
				that.val(adata.cell[0]); 
				try { 
					if(data.language && ("EN"==data.language)) {
						$("#"+that.attr("id")+"desc").html(adata.cell[1]+"  "+adata.cell[2]); 
						$("#"+that.attr("id")+"desc").val(adata.cell[1]+"  "+adata.cell[2]); 
					} else {
						$("#"+that.attr("id")+"desc").html(adata.cell[1]+"  "+adata.cell[2]); 
						$("#"+that.attr("id")+"desc").val(adata.cell[1]+"  "+adata.cell[2]); 
					}
				}catch(ex) { }				
			},	
			singleSelect: true,
			enable : true,
			afterOpen : function(reply) { }
	};
	var p = $.extend({},lookupDefaults, settings);	
	if(!p.enable) {
		var autoHeight = p.dialogHeight==lookupDefaults.dialogHeight?400:p.dialogHeight;
		p.dialogHeight = autoHeight;
	}
	p.query = that.val();

	var fs_frame_id = 'fs_lookup_iframe_' + Math.round(new Date().getTime() / 1000);
	var fs_lookupframe = $("<iframe id='"+fs_frame_id+"' name='"+fs_frame_id+"' width='100%' height='100%' scrolling='no' frameBorder='0'></iframe>");
	var fs_dialoglayer = $("<div style='display:none; padding: 5px; z-index: 5000;'></div>");
	fs_dialoglayer.append(fs_lookupframe);
	$("body").after(fs_dialoglayer);
	var fs_lookupdialog = fs_dialoglayer.dialog({
			autoOpen: false, modal: true, title: p.dialogTitle,
			width: p.dialogWidth, height: p.dialogHeight, 
			open: function( event, ui ) { 
				var par = fs_dialoglayer.parent();
				var pos = par.position();
				var h = (p.dialogHeight + 10 - par.height()) / 2;
				fs_dialoglayer.height(p.dialogHeight+10);  
				par.css("top", pos.top - h);
			},
			beforeClose: function( event, ui ) { setTimeout(function() { try { fs_dialoglayer.remove(); }catch(ex) { } },500); }
	});
	window.getShowLookupDialogArguments = function() { return p; };
	window.closeLookupDialog = function() { try { fs_lookupdialog.dialog("close"); } catch(ex) { } };
	window.configLookupDialogTitle = function(title) { try { fs_lookupdialog.dialog("option","title",title); } catch(ex) { } };
	window.afterShowLookupDialog = function(args) { 
		try { fs_lookupdialog.dialog("close"); } catch(ex) { }
		try { p.afterLookup(args); } catch(ex) { }
	};
	var fs_lookupwin = window.open(p.dialogURL,fs_frame_id);
	fs_lookupwin.opener = self;
	fs_lookupdialog.dialog("open");
	fs_lookupdialog.parent().css("zIndex",5002);
	fs_lookupdialog.parent().next(".ui-widget-overlay").css("zIndex",5001);
};

$.fn.employeelookup = function(settings) {
	var that = $(this);
	var lookupDefaults = {
			dialogTitle : "Employee Lookup",
			dialogWidth : 830,
			dialogHeight : 450,
			dialogURL : "../nav/nav005.jsp?seed="+Math.random(),
			dialogFeatures : "scrollbars=no;center=yes;border=thin;help=no;status=no;resizable=yes;",
			afterLookup : function(data,reply) { 
				var adata = null;
				if(data.cell) {
					adata = data;
				} else adata = data[0];
				that.val(adata.cell[0]); 
				try { 
					if(data.language && ("EN"==data.language)) {
						$("#"+that.attr("id")+"desc").html(adata.cell[1]+"  "+adata.cell[2]); 
						$("#"+that.attr("id")+"desc").val(adata.cell[1]+"  "+adata.cell[2]); 
					} else {
						$("#"+that.attr("id")+"desc").html(adata.cell[1]+"  "+adata.cell[2]); 
						$("#"+that.attr("id")+"desc").val(adata.cell[1]+"  "+adata.cell[2]); 
					}
				}catch(ex) { }				
			},	
			singleSelect: true,
			enable : true,
			afterOpen : function(reply) { }
	};
	var p = $.extend({},lookupDefaults, settings);	
	if(!p.enable) {
		var autoHeight = p.dialogHeight==lookupDefaults.dialogHeight?400:p.dialogHeight;
		p.dialogHeight = autoHeight;
	}
	p.query = that.val();

	var fs_frame_id = 'fs_lookup_iframe_' + Math.round(new Date().getTime() / 1000);
	var fs_lookupframe = $("<iframe id='"+fs_frame_id+"' name='"+fs_frame_id+"' width='100%' height='100%' scrolling='no' frameBorder='0'></iframe>");
	var fs_dialoglayer = $("<div style='display:none; padding: 5px; z-index: 5000;'></div>");
	fs_dialoglayer.append(fs_lookupframe);
	$("body").after(fs_dialoglayer);
	var fs_lookupdialog = fs_dialoglayer.dialog({
			autoOpen: false, modal: true, title: p.dialogTitle,
			width: p.dialogWidth, height: p.dialogHeight, 
			open: function( event, ui ) { 
				var par = fs_dialoglayer.parent();
				var pos = par.position();
				var h = (p.dialogHeight + 10 - par.height()) / 2;
				fs_dialoglayer.height(p.dialogHeight+10);  
				par.css("top", pos.top - h);
			},
			beforeClose: function( event, ui ) { setTimeout(function() { try { fs_dialoglayer.remove(); }catch(ex) { } },500); }
	});
	window.getShowLookupDialogArguments = function() { return p; };
	window.closeLookupDialog = function() { try { fs_lookupdialog.dialog("close"); } catch(ex) { } };
	window.configLookupDialogTitle = function(title) { try { fs_lookupdialog.dialog("option","title",title); } catch(ex) { } };
	window.afterShowLookupDialog = function(args) { 
		try { fs_lookupdialog.dialog("close"); } catch(ex) { }
		try { p.afterLookup(args); } catch(ex) { }
	};
	var fs_lookupwin = window.open(p.dialogURL,fs_frame_id);
	fs_lookupwin.opener = self;
	fs_lookupdialog.dialog("open");
	fs_lookupdialog.parent().css("zIndex",5002);
	fs_lookupdialog.parent().next(".ui-widget-overlay").css("zIndex",5001);
};

$.fn.getemployee = function(settings) {
	var that = $(this);
	var defaults = {
			async : true,
			dataType : "json",
			method : "POST",			
			url : "../nav/nav005_c.jsp",
			searchOptions : [{name:"fetch", value:"true"}, {name:"searchoption", value:"H"}],
			params : null,
			keys : [],
			afterPopulate : function(data,status,xhr) { 
				var adata = null;
				if(data.rows) {
					data = data.rows[0];
				}
				if(data.cell) {
					adata = data;
				} else adata = data[0];
				if(adata) {
					try { 
						if(data.language && ("EN"==data.language)) {
							$("#"+that.attr("id")+"desc").html(adata.cell[1]+"  "+adata.cell[2]); 
							$("#"+that.attr("id")+"desc").val(adata.cell[1]+"  "+adata.cell[2]); 
						} else {
							$("#"+that.attr("id")+"desc").html(adata.cell[1]+"  "+adata.cell[2]); 
							$("#"+that.attr("id")+"desc").val(adata.cell[1]+"  "+adata.cell[2]); 
						}
					}catch(ex) { }		
				}
			}	
	};
	var p = $.extend({},defaults, settings);	
	if(p.keycode) p.keys.push({name:"employeecode", value:p.keycode});
	if(p.url && (p.keys || p.params)) {
		var opts = $.merge(p.searchOptions,p.keys?p.keys:[]);
		var params = $.param(opts)+(p.params?p.params:"");
		$.ajax({
			contentType : "application/x-www-form-urlencoded; charset=UTF-8",
			async : p.async,
			type: p.method,
			url: p.url,
			data: params,
			dataType: p.dataType,
			success: function(adata,status,xhr){ if(p.afterPopulate) p.afterPopulate(adata,status,xhr); },
			error : function(transport,status,errorThrown) { try { if (p.onError) p.onError(transport,status,errorThrown); } catch (e) {} }
		});
	}
};

$.fn.getuser = function(settings) {
	var that = $(this);
	var defaults = {
			async : true,
			dataType : "json",
			method : "POST",			
			url : "../nav/nav002_c.jsp",
			searchOptions : [{name:"fetch", value:"true"}, {name:"searchoption", value:"H"}],
			params : null,
			keys : [],
			afterPopulate : function(data,status,xhr) { 
				var adata = null;
				if(data.rows) {
					data = data.rows[0];
				}
				if(data.cell) {
					adata = data;
				} else adata = data[0];
				if(adata) {
					try { 
						if(data.language && ("EN"==data.language)) {
							$("#"+that.attr("id")+"desc").html(adata.cell[1]+"  "+adata.cell[2]); 
							$("#"+that.attr("id")+"desc").val(adata.cell[1]+"  "+adata.cell[2]); 
						} else {
							$("#"+that.attr("id")+"desc").html(adata.cell[1]+"  "+adata.cell[2]); 
							$("#"+that.attr("id")+"desc").val(adata.cell[1]+"  "+adata.cell[2]); 
						}
					}catch(ex) { }		
				}
			}	
	};
	var p = $.extend({},defaults, settings);	
	if(p.keycode) p.keys.push({name:"userid", value:p.keycode});
	if(p.url && (p.keys || p.params)) {
		var opts = $.merge(p.searchOptions,p.keys?p.keys:[]);
		var params = $.param(opts)+(p.params?p.params:"");
		$.ajax({
			contentType : "application/x-www-form-urlencoded; charset=UTF-8",
			async : p.async,
			type: p.method,
			url: p.url,
			data: params,
			dataType: p.dataType,
			success: function(adata,status,xhr){ if(p.afterPopulate) p.afterPopulate(adata,status,xhr); },
			error : function(transport,status,errorThrown) { try { if (p.onError) p.onError(transport,status,errorThrown); } catch (e) {} }
		});
	}
};

$.fn.approveplugin = function(settings) {
	var that = $(this);
	var lookupDefaults = {
		approvesite : "",
		approveflow : "",
		approvegroup : ""
	};
	var p = $.extend({},lookupDefaults, settings);	
	var approve_url = "../pmte014/pmte014_plugin.jsp?seed="+Math.random()+"&approveflow="+p.approveflow+"&approvegroup="+p.approvegroup+"&site="+p.approvesite;
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
};

$.fn.approvedialog = function(settings) {
	var that = $(this);
	var lookupDefaults = {
		approvesite : "",
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
	var approve_url = "../pmte014/pmte014_plugin.jsp?seed="+Math.random()+"&approveflow="+p.approveflow+"&approvegroup="+p.approvegroup+"&site="+p.approvesite;
	$iframe.attr("src",approve_url);
	$fsapplayer.modal("show");
	$fsapplayer.find(".modal-dialog").draggable();
	window.closeConfigDialog = function() { try { $fsapplayer.modal("hide"); p.approveClose(); } catch(ex) { } };
	window.configDialogTitle = function(title) { if(title) { $h4.html(title); } };
	window.approveConfigure = function(appid,approleid,lvid,altid,altroleid,altuserid) { p.approveConfigure(appid,approleid,lvid,altid,altroleid,altuserid); };
};

$.fn.approverlookup = function(settings) {
	var that = $(this);
	var lookupDefaults = {
			dialogTitle : "Approver Lookup",
			dialogWidth : 830,
			dialogHeight : 460,
			dialogURL : "../nav/nav004.jsp?seed="+Math.random(),
			dialogFeatures : "scrollbars=no;center=yes;border=thin;help=no;status=no;resizable=yes;",
			afterLookup : function(data,reply) { 
				var adata = null;
				if(data.cell) {
					adata = data;
				} else adata = data[0];
				that.val(adata.cell[0]); 
				try { 
					if(data.language && ("EN"==data.language)) {
						$("#"+that.attr("id")+"desc").html(adata.cell[1]+"  "+adata.cell[2]); 
						$("#"+that.attr("id")+"desc").val(adata.cell[1]+"  "+adata.cell[2]); 
					} else {
						$("#"+that.attr("id")+"desc").html(adata.cell[1]+"  "+adata.cell[2]); 
						$("#"+that.attr("id")+"desc").val(adata.cell[1]+"  "+adata.cell[2]); 
					}
				}catch(ex) { }				
			},	
			singleSelect: true,
			enable : true,
			afterOpen : function(reply) { }
	};
	var p = $.extend({},lookupDefaults, settings);	
	if(!p.enable) {
		var autoHeight = p.dialogHeight==lookupDefaults.dialogHeight?400:p.dialogHeight;
		p.dialogHeight = autoHeight;
	}
	p.query = that.val();

	var fs_frame_id = 'fs_lookup_iframe_' + Math.round(new Date().getTime() / 1000);
	var fs_lookupframe = $("<iframe id='"+fs_frame_id+"' name='"+fs_frame_id+"' width='100%' height='100%' scrolling='no' frameBorder='0'></iframe>");
	var fs_dialoglayer = $("<div style='display:none; padding: 5px; z-index: 5000;'></div>");
	fs_dialoglayer.append(fs_lookupframe);
	$("body").after(fs_dialoglayer);
	var fs_lookupdialog = fs_dialoglayer.dialog({
			autoOpen: false, modal: true, title: p.dialogTitle,
			width: p.dialogWidth, height: p.dialogHeight, 
			open: function( event, ui ) { 
				var par = fs_dialoglayer.parent();
				var pos = par.position();
				var h = (p.dialogHeight + 10 - par.height()) / 2;
				fs_dialoglayer.height(p.dialogHeight+10);  
				par.css("top", pos.top - h);
			},
			beforeClose: function( event, ui ) { setTimeout(function() { try { fs_dialoglayer.remove(); }catch(ex) { } },500); }
	});
	window.getShowLookupDialogArguments = function() { return p; };
	window.closeLookupDialog = function() { try { fs_lookupdialog.dialog("close"); } catch(ex) { } };
	window.configLookupDialogTitle = function(title) { try { fs_lookupdialog.dialog("option","title",title); } catch(ex) { } };
	window.afterShowLookupDialog = function(args) { 
		try { fs_lookupdialog.dialog("close"); } catch(ex) { }
		try { p.afterLookup(args); } catch(ex) { }
	};
	var fs_lookupwin = window.open(p.dialogURL,fs_frame_id);
	fs_lookupwin.opener = self;
	fs_lookupdialog.dialog("open");
	fs_lookupdialog.parent().css("zIndex",5002);
	fs_lookupdialog.parent().next(".ui-widget-overlay").css("zIndex",5001);
};

})(jQuery);
