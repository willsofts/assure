var mouseX = 0;
var mouseY = 0;
$(function(){
	$(this).mousedown(function(e) { mouseX = e.pageX; mouseY = e.pageY; });
	try { startApplication("page_change"); }catch(ex) { }
	initialApplication();
});
function initialApplication() {
	setupComponents();
	setupAlertComponents();
	$("#userpassword").blur(function() { 
		$("#matchpassword_alert").hide();
	});
	$("#confirmpassword").blur(function() {
		$("#matchpassword_alert").hide();
	});
}
function setupComponents() {
	$("#savebutton").click(function() { 
		save();
		return false;
	});
	let json = getAccessorInfo();
	if(json) {
		if(json.useruuid) $("#useruuid").val(json.useruuid);
		if(json.userid) $("#userid").val(json.userid);
	}
}
function clearingFields() {
}
function validForm() {
	clearAlerts();
	$("#matchpassword_alert").hide();
	var validator = null;
	if($.trim($("#oldpassword").val())=="") {
		$("#oldpassword").parent().addClass("has-error");
		$("#oldpassword_alert").show();
		if(!validator) validator = "oldpassword";
	}
	if($.trim($("#userpassword").val())=="") {
		$("#userpassword").parent().addClass("has-error");
		$("#userpassword_alert").show();
		if(!validator) validator = "userpassword";
	}
	if($.trim($("#confirmpassword").val())=="") {
		$("#confirmpassword").parent().addClass("has-error");
		$("#confirmpassword_alert").show();
		if(!validator) validator = "confirmpassword";
	}
	if($("#userpassword").val()!=$("#confirmpassword").val()) {
		$("#confirmpassword").parent().addClass("has-error");
		$("#matchpassword_alert").show();
		if(!validator) validator = "matchpassword";
	}	
	if(validator) {
		var matching = validator=="matchpassword";
		if(matching) validator = "confirmpassword";
		$("#"+validator).focus();
		setTimeout(function() { 
			$("#"+validator).parent().addClass("has-error");
			if(!matching) $("#"+validator+"_alert").show();
		},100);
		return false;
	}
	return true;
}
function save(aform) {
	if(!aform) aform = fsentryform;
	if(!validForm()) return false;
	confirmSave(function() {
		let formdata = serializeDataForm(aform);
		startWaiting();
		jQuery.ajax({
			url: API_URL+"/api/password/change",
			data: formdata.jsondata,
			headers : formdata.headers,
			type: "POST",
			dataType: "html",
			contentType: defaultContentType,
			error : function(transport,status,errorThrown) { 
				submitFailure(transport,status,errorThrown); 
			},
			success: function(data,status,transport){ 
				stopWaiting();
				successbox(function() { 
					clearingFields();
					if(CHANGED_ACTION=="force" || CHANGED_ACTION=="expire") {						
						try {  window.parent.doAfterLogin(null,false); } catch(ex) { }
						return;
					}
					try {  window.parent.goHome(); } catch(ex) { }
				});					
			}
		});
	});
	return false;
}

