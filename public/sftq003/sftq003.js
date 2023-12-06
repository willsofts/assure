var mouseX = 0;
var mouseY = 0;
//#(10000) programmer code begin;
//#(10000) programmer code end;
$(function(){
	$(this).mousedown(function(e) { mouseX = e.pageX; mouseY = e.pageY; });
	try { startApplication("sftq003"); }catch(ex) { }
	initialApplication();
	//#(20000) programmer code begin;
	//#(20000) programmer code end;
});
function initialApplication() {
	//#(30000) programmer code begin;
	//#(30000) programmer code end;
	setupComponents();
	setupAlertComponents();
	//#(40000) programmer code begin;
	//#(40000) programmer code end;
}
function setupComponents() {
	//#(50000) programmer code begin;
	//#(50000) programmer code end;
	$("#searchbutton").click(function(evt) {
		resetFilters();
		search();  return false;
	});
	$("#cancelbutton").click(function() {
		cancel();  return false;
	});
	//#(60000) programmer code begin;
	//#(60000) programmer code end;
}
function resetFilters() {
	try { 
		fssearchform.page.value = "1";
		fssearchform.orderBy.value = "";
		fssearchform.orderDir.value = "";
	}catch(ex) { }	
}
function refreshFilters() {
	try { 
		fssearchform.page.value = fslistform.page.value;
		fssearchform.orderBy.value = fschapterform.orderBy.value;
		fssearchform.orderDir.value = fschapterform.orderDir.value;
	}catch(ex) { }	
}
function search(aform) {
	//#(70000) programmer code begin;
	if(!validSearch()) return false;
	//#(70000) programmer code end;
	if(!aform) aform = fssearchform;
	let formdata = serializeDataForm(aform);
	startWaiting();
	jQuery.ajax({
		url: API_URL+"/api/sftq003/search",
		data: formdata.jsondata,
		headers : formdata.headers,
		type: "POST",
		dataType: "html",
		contentType: defaultContentType,
		error : function(transport,status,errorThrown) {
			submitFailure(transport,status,errorThrown);
		},
		success: function(data,status,transport){
			searchComplete(transport,data);
		}
	});	
	//#(80000) programmer code begin;
	//#(80000) programmer code end;
}
function searchComplete(xhr,data) {
	//#(90000) programmer code begin;
	$("#listpanel").data("searchfilters",createParameters(fssearchform));
	//#(90000) programmer code end;
	stopWaiting();
	$("#listpanel").html(data);
	setupDataTable();
	//#(100000) programmer code begin;
	//#(100000) programmer code end;
}
function clearingFields() {
	//#(130000) programmer code begin;
	//#(130000) programmer code end;
	fsentryform.reset();
	//#(140000) programmer code begin;
	//#(140000) programmer code end;
}
function cancel() {
	//#(150000) programmer code begin;
	//#(150000) programmer code end;
	confirmCancel(function() {
		clearingFields();
	});
	//#(160000) programmer code begin;
	//#(160000) programmer code end;
}
function validSaveForm(callback) {
	//#(170000) programmer code begin;
	//#(170000) programmer code end;
	return true;
	//#(180000) programmer code begin;
	//#(180000) programmer code end;
}
function submitRetrieve(src,keyid) {
	//#(250000) programmer code begin;
	//#(250000) programmer code end;
	var aform = fslistform;
	aform.keyid.value = keyid;
	let formdata = serializeDataForm(aform);
	startWaiting();
	jQuery.ajax({
		url: API_URL+"/api/sftq003/retrieval",
		data: formdata.jsondata,
		headers: formdata.headers,
		type: "POST",
		dataType: "html",
		contentType: defaultContentType,
		error : function(transport,status,errorThrown) {
			submitFailure(transport,status,errorThrown);
		},
		success: function(data,status,transport){
			stopWaiting();
			$("#dialogpanel").html(data);
			setupDialogComponents();
			$("#fsmodaldialog_layer").modal("show");
		}
	});
	return false;
	//#(260000) programmer code begin;
	//#(260000) programmer code end;
}
function submitChapter(aform,index) {
	let fs_params = fetchParameters($("#listpanel").data("searchfilters"));
	//#(270000) programmer code begin;
	//#(270000) programmer code end;
	let formdata = serializeDataForm(aform, $("#listpanel").data("searchfilters"));
	startWaiting();
	jQuery.ajax({
		url: API_URL+"/api/sftq003/search",
		data: formdata.jsondata,
		headers: formdata.headers,
		type: "POST",
		dataType: "html",
		contentType: defaultContentType,
		error : function(transport,status,errorThrown) {
			submitFailure(transport,status,errorThrown);
		},
		success: function(data,status,transport){
			stopWaiting();
			$("#listpanel").html(data);
			setupDataTable();
		}
	});
	//#(280000) programmer code begin;
	//#(280000) programmer code end;
}
function submitOrder(src,sorter) {
	let aform = fssortform;
	aform.orderBy.value = sorter;
	let fs_params = fetchParameters($("#listpanel").data("searchfilters"));
	let formdata = serializeDataForm(aform, $("#listpanel").data("searchfilters"));
	//#(290000) programmer code begin;
	//#(290000) programmer code end;
	startWaiting();
	jQuery.ajax({
		url: API_URL+"/api/sftq003/search",
		data: formdata.jsondata,
		headers: formdata.headers,
		type: "POST",
		dataType: "html",
		contentType: defaultContentType,
		error : function(transport,status,errorThrown) {
			submitFailure(transport,status,errorThrown);
		},
		success: function(data,status,transport){
			stopWaiting();
			$("#listpanel").html(data);
			setupDataTable();
		}
	});
	return false;
	//#(300000) programmer code begin;
	//#(300000) programmer code end;
}
function setupDialogComponents() {
	//#(380000) programmer code begin;
	//#(380000) programmer code end;
	setupAlertComponents($("#dialogpanel"));
	initialApplicationControls($("#dialogpanel"));
	$("#dialogpanel").find(".modal-dialog").draggable();
	//#(385000) programmer code begin;
	$("a",$("#contents")).attr("disabled",true).addClass("disabled").click(function(e){
	    e.preventDefault();
	});
	$("#resendbutton").click(function() { 
		disableControls($("#resendbutton"));
		resend(); return false;		
	});
	//#(385000) programmer code end;
}
//#(390000) programmer code begin;
function validSearch() {
	var valid = true;
	if($.trim($("#datefroms").val())=="") {
		$("#datefroms").parent().addClass("has-error");
		$("#datefroms").trigger("blur");
		valid = false;
	}
	if($.trim($("#datetos").val())=="") {
		$("#datetos").parent().addClass("has-error");
		$("#datetos").trigger("blur");
		valid = false;
	}
	return valid;
}
function resend(aform) {
	if(!aform) aform = fsentryform;
	confirmResend(function() {
		let formdata = serializeDataForm(aform);
		startWaiting();
		jQuery.ajax({
			url: API_URL+"/api/sftq003/resend",
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
				});
			}
		});
	});
	return false;
}
function submitRetrieveRefer(src,keyid) {
	let params = {
		ajax: true,
		keyid: keyid
	};
	let formdata = serializeParameters(params);
	startWaiting();
	jQuery.ajax({
		url: API_URL+"/api/sftq003/view",
		data: formdata.jsondata,
		headers: formdata.headers,
		type: "POST",
		dataType: "html",
		contentType: defaultContentType,
		error : function(transport,status,errorThrown) {
			submitFailure(transport,status,errorThrown);
		},
		success: function(data,status,transport){
			stopWaiting();
			$("#referdialogpanel").html(data);
			$("#referdialogpanel").find(".modal-dialog").draggable();
			$("a",$("#referdialogpanel")).attr("disabled",true).addClass("disabled").click(function(e){
			    e.preventDefault();
			});
			$("#fsrefermodaldialog_layer").modal("show");
		}
	});
	return false;
}
function displayRefer(src,keyid) {
	disableControls(src);
	submitRetrieveRefer(src,keyid);
}
function setupDataTable() {
	setupPageSorting("datatable",submitOrder);
	setupPagination("fschapterlayer",submitChapter,fschapterform,fssearchform);
	$("#datatablebody").find(".fa-data-edit").each(function(index,element) {
		$(element).click(function() {
			if($(this).is(":disabled")) return;
			submitRetrieve(element,$(this).attr("data-key"));
		});
	});
	$("#datatablebody").find(".fa-data-view").each(function(index,element) {
		$(element).click(function() {
			if($(this).is(":disabled")) return;
			submitRetrieveRefer(element,$(this).attr("data-key"));
		});
	});
}
//#(390000) programmer code end;
