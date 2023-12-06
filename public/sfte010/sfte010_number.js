$(function(){
	initialApplicationNumber();
});
function initialApplicationNumber() {
	setupComponentsNumber();
}
function setupComponentsNumber() {
	$("#searchbuttonnum").click(function(evt) {
		resetFiltersNumber();
		searchNumber();  return false;
	});
	$("#insertbuttonnum").click(function(evt) {
		insertNumber();  return false;
	});
	$("#savebuttonnum").click(function() {
		disableControls($("#savebuttonnum"));
		saveNumber();  return false;
	});
	$("#cancelbuttonnum").click(function() {
		cancelNumber();  return false;
	});
	$("#updatebuttonnum").click(function() {
		disableControls($("#updatebuttonnum"));
		updateNumber();  return false;
	});
	$("#deletebuttonnum").click(function() {
		disableControls($("#deletebuttonnum"));
		deletedNumber();  return false;
	});
}
function resetFiltersNumber() {
	try { 
		fssearchformnum.page.value = "1";
		fssearchformnum.orderBy.value = "";
		fssearchformnum.orderDir.value = "";
	}catch(ex) { }	
}
function refreshFiltersNumber() {
	try { 
		fssearchformnum.page.value = fslistformnum.page.value;
		fssearchformnum.orderBy.value = fslistformnum.orderBy.value;
		fssearchformnum.orderDir.value = fslistformnum.orderDir.value;
	}catch(ex) { }	
}
function ensurePagingNumber(tablebody) {
	if(!tablebody) tablebody = "#datatablebodynum";
	try {
		let pageno = parseInt(fslistform.page.value);
		let size = $(tablebody).find("tr").length;
		if(size<=1 && pageno>1) {
			fslistform.page.value = ""+(pageno-1);
		}
	} catch(ex) { }
}
function searchNumber(aform) {
	if(!aform) aform = fssearchformnum;
	let formdata = serializeDataForm(aform);
	startWaiting();
	jQuery.ajax({
		url: API_URL+"/api/sfte010/searchnum",
		data: formdata.jsondata,
		headers : formdata.headers,
		type: "POST",
		dataType: "html",
		contentType: defaultContentType,
		error : function(transport,status,errorThrown) {
			submitFailure(transport,status,errorThrown);
		},
		success: function(data,status,transport){
			searchCompleteNumber(transport,data);
		}
	});	
}
function searchCompleteNumber(xhr,data) {
	$("#listpanelnum").data("searchfiltersnum",createParameters(fssearchformnum));
	stopWaiting();
	$("#listpanelnum").html(data);
	setupDataTableNumber();
}
function insertNumber() {
	let aform = fslistformnum;
	aform.reservenum.value = "";
	let formdata = serializeDataForm(aform);
	startWaiting();
	jQuery.ajax({
		url: API_URL+"/api/sfte010/addnum",
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
			$("#dialogpanel").html(data);
			setupDialogComponentsNumber();
			$("#fsmodaldialog_layer").modal("show");
		}
	});
	return false;
}
function clearingFieldsNumber() {
	fsentryformnum.reset();
}
function cancelNumber() {
	confirmCancel(function() {
		clearingFieldsNumber();
	});
}
function saveNumber(aform) {
	fs_requiredfields = { "reservenum":{msg:""} };
	if(!aform) aform = fsentryformnum;
	if(!validNumericFields(aform)) return false;
	validSaveForm(function() {
		confirmSave(function() {
			let formdata = serializeDataForm(aform);
			startWaiting();
			jQuery.ajax({
				url: API_URL+"/api/sfte010/insertnum",
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
						aform.reset();
						setTimeout(function() { $("#reservenum").focus(); },200);
					});
					refreshFiltersNumber();
					searchNumber();
				}
			});
		});
	});
	return false;
}
function updateNumber(aform) {
	fs_requiredfields = { "reservenum":{msg:""} };
	if(!aform) aform = fsentryformnum;
	if(!validNumericFields(aform)) return false;
	validSaveForm(function() {
		confirmUpdate(function() {
			let formdata = serializeDataForm(aform);
			startWaiting();
			jQuery.ajax({
				url: API_URL+"/api/sfte010/updatenum",
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
						$("#fsmodaldialog_layer").modal("hide");
					});
					refreshFiltersNumber();
					searchNumber();
				}
			});
		});
	});
	return false;
}
function submitRetrieveNumber(src,reservenum) {
	let aform = fslistformnum;
	aform.reservenum.value = reservenum;
	let formdata = serializeDataForm(aform);
	startWaiting();
	jQuery.ajax({
		url: API_URL+"/api/sfte010/retrievalnum",
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
			setupDialogComponentsNumber();
			$("#fsmodaldialog_layer").modal("show");
		}
	});
	return false;
}
function submitChapterNumber(aform,index) {
	let fs_params = fetchParameters($("#listpanelnum").data("searchfiltersnum"));
	let formdata = serializeDataForm(aform, $("#listpanelnum").data("searchfiltersnum"));
	startWaiting();
	jQuery.ajax({
		url: API_URL+"/api/sfte010/searchnum",
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
			$("#listpanelnum").html(data);
			setupDataTableNumber();
		}
	});
}
function submitOrderNumber(src,sorter) {
	let aform = fssortformnum;
	aform.orderBy.value = sorter;
	let fs_params = fetchParameters($("#listpanelnum").data("searchfiltersnum"));
	let formdata = serializeDataForm(aform, $("#listpanelnum").data("searchfiltersnum"));
	startWaiting();
	jQuery.ajax({
		url: API_URL+"/api/sfte010/searchnum",
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
			$("#listpanelnum").html(data);
			setupDataTableNumber();
		}
	});
	return false;
}
function submitDeleteNumber(src,fsParams) {
	confirmDelete([fsParams[0]],function() {
		deleteRecordNumber(fsParams);
	});
}
function deleteRecordNumber(fsParams) {
	let params = {
		ajax: true,
		reservenum : fsParams[0]
	};
	let formdata = serializeParameters(params);
	startWaiting();
	jQuery.ajax({
		url: API_URL+"/api/sfte010/removenum",
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
			ensurePagingNumber();
			refreshFiltersNumber();
			searchNumber();
		}
	});
}
function deletedNumber(aform) {
	if(!aform) aform = fsentryformnum;
	confirmDelete([],function() {
		let formdata = serializeDataForm(aform);
		startWaiting();
		jQuery.ajax({
			url: API_URL+"/api/sfte010/removenum",
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
				$("#fsmodaldialog_layer").modal("hide");
				ensurePagingNumber();
				refreshFiltersNumber();
				searchNumber();
			}
		});
	});
	return false;
}
function setupDialogComponentsNumber() {
	$("#savebuttonnum").click(function() {
		disableControls($("#savebuttonnum"));
		saveNumber(); return false;
	});
	$("#updatebuttonnum").click(function() {
		disableControls($("#updatebuttonnum"));
		updateNumber(); return false;
	});
	$("#deletebuttonnum").click(function() {
		disableControls($("#deletebuttonnum"));
		deletedNumber(); return false;
	});
	setupAlertComponents($("#dialogpanel"));
	initialApplicationControls($("#dialogpanel"));
	$("#dialogpanel").find(".modal-dialog").draggable();
}
function setupDataTableNumber() {
	setupPageSorting("datatablenum",submitOrderNumber);
	setupPagination("fschapterlayernum",submitChapterNumber,fschapterformnum,fssearchformnum);
	$("#datatablebodynum").find(".fa-data-edit").each(function(index,element) {
		$(element).click(function() {
			if($(this).is(":disabled")) return;
			submitRetrieveNumber(element,$(this).attr("data-key"));
		});
	});
	$("#datatablebodynum").find(".fa-data-delete").each(function(index,element) {
		$(element).click(function() {
			if($(this).is(":disabled")) return;
			submitDeleteNumber(element,[$(this).attr("data-key")]);
		});
	});
}
