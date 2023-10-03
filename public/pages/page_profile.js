var mouseX = 0;
var mouseY = 0;
$(function(){
	$(this).mousedown(function(e) { mouseX = e.pageX; mouseY = e.pageY; });
	try { startApplication("page_profile"); }catch(ex) { }
	initialApplication();
});
function initialApplication() {
	setupComponents();
	setupAlertComponents();
}
function setupComponents() {
	$("#savebutton").click(function() { 
		save();
		return false;
	});
}
function clearingFields() {
}
function validForm() {
	clearAlerts();
	var validator = null;
	if($.trim($("#usertname").val())=="") {
		$("#usertname").parent().addClass("has-error");
		$("#usertname_alert").show();
		if(!validator) validator = "usertname";
	}
	if($.trim($("#usertsurname").val())=="") {
		$("#usertsurname").parent().addClass("has-error");
		$("#usertsurname_alert").show();
		if(!validator) validator = "usertsurname";
	}
	if($.trim($("#userename").val())=="") {
		$("#userename").parent().addClass("has-error");
		$("#userename_alert").show();
		if(!validator) validator = "userename";
	}
	if($.trim($("#useresurname").val())=="") {
		$("#useresurname").parent().addClass("has-error");
		$("#useresurname_alert").show();
		if(!validator) validator = "useresurname";
	}
	if($.trim($("#displayname").val())=="") {
		$("#displayname").parent().addClass("has-error");
		$("#displayname").show();
		if(!validator) validator = "displayname";
	}
	if($.trim($("#email").val())=="") {
		$("#email").parent().addClass("has-error");
		$("#email_alert").show();
		if(!validator) validator = "email";
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
	if(!aform) aform = fsentryform;
	if(!validForm()) return false;
	confirmSave(function() {
		let formdata = serializeDataForm(aform);		
		//formdata.headers["accept-type"] = "json/cipher"; //this return json and only body.data is encrypted
		//formdata.headers["accept-type"] = "text/cipher"; //this return encrypted string
		let accepttype = formdata.headers["accept-type"];
		startWaiting();
		jQuery.ajax({
			url: API_URL+"/api/profile/update",
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
				successbox(function() { clearingFields(); });
				//try { window.parent.takeSwitchLanguage($("#langcode").val()); } catch(ex) { }	
				console.log("data",data);
				let dh = getDH();
				if(accepttype=="json/cipher") {
					let json = $.parseJSON(data);
					if(dh && json.body.data && typeof json.body.data === "string") {
						let data = dh.decrypt(json.body.data);
						console.log("body.data",data);
					}
				}
				if(accepttype=="text/cipher") {
					let jsonstr = dh.decrypt(data);
					console.log("jsonstr",jsonstr);
					if(jsonstr) {
						let json = $.parseJSON(jsonstr);
						console.log("json",json);
					}
				}
			}
		});
	});
	return false;
}

