//#(10000) programmer code begin;
//#(10000) programmer code end;
$(function(){
	$("#savebuttonpolicy").click(function() {
		savePolicy();  return false;
	});
	$("#updatebuttonpolicy").click(function() {
		updatePolicy();  return false;
	});
	//#(20000) programmer code begin;
	//#(20000) programmer code end;
});
function savePolicy(aform) {
	//#(190000) programmer code begin;
	fs_requiredfields = { 
		"pwdexpireday":{msg:""}, 
		"minpwdlength":{msg:""}, 
		"maxpwdlength":{msg:""}, 
		"alphainpwd":{msg:""}, 
		"otherinpwd":{msg:""}, 
		"digitinpwd":{msg:""}, 
		"upperinpwd":{msg:""}, 
		"lowerinpwd":{msg:""},
		"timenotusedoldpwd":{msg:""}
	};
	//#(190000) programmer code end;
	if(!aform) aform = fsentryformpolicy;
	if(!validNumericFields(aform)) return false;
	validSaveForm(function() {
		//#(195000) programmer code begin;
		//#(195000) programmer code end;
		confirmSave(function() {
			let formdata = serializeDataForm(aform);
			startWaiting();
			jQuery.ajax({
				url: API_URL+"/api/sfte010/insertpolicy",
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
					//#(195300) programmer code begin;
					//#(195300) programmer code end;
					successbox(function() { 
					});
					//#(195500) programmer code begin;
					//#(195500) programmer code end;
				}
			});
		});
	});
	return false;
	//#(200000) programmer code begin;
	//#(200000) programmer code end;
}
function updatePolicy(aform) {
	//#(230000) programmer code begin;
	fs_requiredfields = { 
		"pwdexpireday":{msg:""}, 
		"minpwdlength":{msg:""}, 
		"maxpwdlength":{msg:""}, 
		"alphainpwd":{msg:""}, 
		"otherinpwd":{msg:""}, 
		"digitinpwd":{msg:""}, 
		"upperinpwd":{msg:""}, 
		"lowerinpwd":{msg:""},
		"timenotusedoldpwd":{msg:""}
	};
	//#(230000) programmer code end;
	if(!aform) aform = fsentryformpolicy;
	if(!validNumericFields(aform)) return false;
	validSaveForm(function() {
		//#(235000) programmer code begin;
		//#(235000) programmer code end;
		confirmUpdate(function() {
			let formdata = serializeDataForm(aform);
			startWaiting();
			jQuery.ajax({
				url: API_URL+"/api/sfte010/updatepolicy",
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
					//#(235300) programmer code begin;
					//#(235300) programmer code end;
					successbox(function() { 
					});
					//#(235500) programmer code begin;
					//#(235500) programmer code end;
				}
			});
		});
	});
	return false;
	//#(240000) programmer code begin;
	//#(240000) programmer code end;
}
//#(390000) programmer code begin;
function policySettingClick() {
	$("#entrypanelpolicy").show();
	$("#searchpanel").hide();
	$("#searchpanelnum").hide();		
}
function reserveWordClick() {
	$("#entrypanelpolicy").hide();
	$("#searchpanel").show();	
	$("#searchpanelnum").hide();		
}
function reserveNumberClick() {
	$("#entrypanelpolicy").hide();
	$("#searchpanel").hide();		
	$("#searchpanelnum").show();		
}
//#(390000) programmer code end;
