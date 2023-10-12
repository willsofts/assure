var mouseX = 0;
var mouseY = 0;
$(function(){
	$(this).mousedown(function(e) { mouseX = e.pageX; mouseY = e.pageY; });
	try { startApplication("factor"); }catch(ex) { }
	initialApplication();
});
function initialApplication() {
	setupComponents();
	setupAlertComponents();
}
function setupComponents() {
	$("#savebutton").click(function() { 
		return save();
	});
	$("#factorcode").on("keydown", function (e) {
		e.stopPropagation();
		if(e.which==13) { $("#savebutton").trigger("click"); return false; }
	}).focus();
}
function clearingFields() {
}
function validForm() {
	clearAlerts();
	var validator = null;
	if($.trim($("#factorcode").val())=="") {
		$("#factorcode").parent().addClass("has-error");
		$("#factorcode_alert").show();
		if(!validator) validator = "factorcode";
	}
	if(validator) {
		$("#"+validator).focus();
		setTimeout(function() { 
			$("#"+validator).parent().addClass("has-error");
			$("#"+validator+"_alert").show();
		},100);
		return false;
	}
	return true;
}
function save(aform) {
	if(!validForm()) return false;
	if(!aform) aform = fsentryform;
	let data = serializeDataForm(aform);
	startWaiting();
	jQuery.ajax({
		url: API_URL+"/api/factor/verify",
		data: data.jsondata,
		headers : data.headers,
		type: "POST",
		dataType: "html",
		contentType: defaultContentType,
		error : function(transport,status,errorThrown) {
			submitFailure(transport,status,errorThrown);
		},
		success: function(data,status,transport){
			stopWaiting();
			//alert("success");
			try { 
				window.parent.doAfterLogin(null,false); 
				window.parent.hideWorkSpace();
			} catch(ex) { }
		}
	});	
	return false;
}
function openFactorInfo() {
	/*
	let fs_params = [
		{ name: "factorid", value: $("#factorid").val() },
		{ name: "authtoken", value: getAccessorToken() }
	];
	openNewWindow({ url: BASE_URL+"/gui/factor/factorimage", windowName: "factor_window", params:  fs_params });
	*/
	$("#dialogpanel").find(".modal-dialog").draggable();
	$("#fsmodaldialog_layer").modal("show");
}
