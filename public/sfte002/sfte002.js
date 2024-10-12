var mouseX = 0;
var mouseY = 0;
$(function(){
	$(this).mousedown(function(e) { mouseX = e.pageX; mouseY = e.pageY; });
	try { startApplication("sfte002"); }catch(ex) { }
	initialApplication();
});
function initialApplication() {
	setupComponents();
	setupAlertComponents();
}
function setupComponents() {
	$("#searchbutton").click(function(evt) { 
		resetFilters();
		search(); 
		return false;
	});
	$("#insertbutton").click(function(evt) { 
		insert(); 
		return false;
	});
	$("#savebutton").click(function() { 
		disableControls($("#savebutton"));
		update();
		return false;
	});
	$("#cancelbutton").click(function() { 
		cancel();
		return false;
	});
	$("#adduserbutton").click(function() { 
		addNewUserInfo();
		return false;
	});
	$("#addprogbutton").click(function() { 
		addNewProgram();
		return false;
	});		
	$("#savebuttondialoginsert").click(function() { 
		disableControls($("#savebuttondialoginsert"));
		save(fsinsertform,true);
		return false;			
	});
	$("#updatebuttondialoginsert").click(function() { 
		disableControls($("#updatebuttondialoginsert"));
		update(fsinsertform,true);
		return false;			
	});
	$("#iconstyleswitcher").styleswitcher({$styleInput: $("#iconstyledialog")});
	$(".modal-dialog").draggable();
	$("#progtablebody").sortable({
		stop: function( event, ui ) {
			displaySequenceTableLists("#progtablebody");
		}
	});	
}
function resetFilters() {
	try {
		fssearchform.page.value = "1";
		fssearchform.orderBy.value = "";
		fssearchform.orderDir.value = "";
	} catch(ex) { }
}
function refreshFilters() {
	try {
		fssearchform.page.value = fslistform.page.value;
		fssearchform.orderBy.value = fschapterform.orderBy.value;
		fssearchform.orderDir.value = fschapterform.orderDir.value;
	}catch(ex) { }
}
function ensurePaging(tablebody) {
	if(!tablebody) tablebody = "#datatablebody";
	try {
		let pageno = parseInt(fslistform.page.value);
		let size = $(tablebody).find("tr").length;
		if(size<=1 && pageno>1) {
			fslistform.page.value = ""+(pageno-1);
		}
	} catch(ex) { }
}
function clearingFields() {
	fsentryform.reset();
	$("#usertablebody").empty();
	$("#progtablebody").empty();
	$("#sitetablebody").empty();
	$(".alert-input").parent().removeClass("has-error");
	$(".alert-span").hide();
	clearAlerts();
}
function search(aform) {
	if(!aform) aform = fssearchform;
	let formdata = serializeDataForm(aform);
	startWaiting();
	jQuery.ajax({
		url: API_URL+"/api/sfte002/search",
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
}
function searchComplete(xhr,data) {
	$("#listpanel").data("searchfilters",createParameters(fssearchform));
	stopWaiting();
	$("#listpanel").html(data);
	setupDataTable();
}
function insert() {
	clearingFields();
	$("input.ikeyclass",fsentryform).removeAttr("readonly");
	fsinsertform.reset();
	$("#groupnamedialog").removeAttr("readonly");
	$("#privateflagdialog").attr("checked",false).val("1");
	$("#modalheaderedit").hide();
	$("#modalheader").show();
	$("#updatebuttondialoginsert").hide();
	$("#savebuttondialoginsert").show();
	$("#usertypedialogfieldset").attr("disabled",false);
	$("#iconstyleswitcher").styleupdate("fa fa-desktop");
	$("#insert_dialog_layer").modal("show");		
}
function showPageSearch() {
	$("#entrypanel").hide();
	$("#searchpanel").show();
}
function showPageEntry() {
	$("#entrypanel").show();
	$("#searchpanel").hide();
}
function submitRetrieve(src,groupname) {
	let aform = fslistform;
	aform.groupname.value = groupname;
	let formdata = serializeDataForm(aform);
	startWaiting();
	jQuery.ajax({
		url: API_URL+"/api/sfte002/retrieve",
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
			prepareScreenToUpdate(fsentryform,data);
		}
	});	
	return false;
}
function prepareScreenToUpdate(aform,data) {
	console.log("data",data);
	if(!aform) aform = fsentryform;
	clearAlerts();
	$("#progtablebody").empty();
	try {
		let json = $.parseJSON(data);
		let jsRecord = json.body.dataset;
		for(let p in jsRecord) {
			$("#"+p,aform).val(jsRecord[p]);
		}
		$("#privateflag").attr("checked","1"==jsRecord["privateflag"]).val("1");
		let icons = jsRecord["iconstyle"];		
		if(!icons || $.trim(icons)=="") icons = "fa fa-desktop";
		let $btn = $("<button style='width:55px;'></button>").addClass("btn btn-light").click(function() { return false; });
		$btn.append("<i class='"+icons+"' aria-hidden='true'></i>");
		$("#iconstylelayer").empty().append($btn);		
		$("#sequenceno").val(jsRecord["seqno"]);
		$("#mobilegroup").val(jsRecord["mobilegroup"]);
		readProgramInfo(jsRecord["groupname"]);
	} catch(ex) { }
	$("input.ikeyclass",aform).attr("readonly",true);	
	showPageEntry();
}
function submitEdit(src,groupname) {
	let aform = fslistform;
	aform.groupname.value = groupname;
	let formdata = serializeDataForm(aform);
	startWaiting();
	jQuery.ajax({
		url: API_URL+"/api/sfte002/retrieve",
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
			fsinsertform.reset();
			prepareScreenToEdit(fsinsertform,data);
			$("#insert_dialog_layer").modal("show");
		}
	});	
	return false;
}
function prepareScreenToEdit(aform,data) {
	if(!aform) aform = fsinsertform;
	clearAlerts();		
	try {
		let json = $.parseJSON(data);		
		let jsRecord = json.body.dataset;
		$("#groupnamedialog").val(jsRecord["groupname"]).attr("readonly",true);
		$("#nameendialog").val(jsRecord["nameen"]);
		$("#namethdialog").val(jsRecord["nameth"]);
		$("#privateflagdialog").attr("checked","1"==jsRecord["privateflag"]).val("1");
		$("#usertypedialogfieldset").attr("disabled",true);
		let icons = jsRecord["iconstyle"];		
		if(!icons || $.trim(icons)=="") icons = "fa fa-desktop";
		$("#iconstyleswitcher").styleupdate(icons);
		$("#sequencenodialog").val(jsRecord["seqno"]);
		$("#mobilegroupdialog").val(jsRecord["mobilegroup"]);
	} catch(ex) { }
	$("#modalheader").hide();	
	$("#modalheaderedit").show();
	$("#savebuttondialoginsert").hide();
	$("#updatebuttondialoginsert").show();
}
function cancel() {
	confirmCancel(function() {
		clearingFields();
		showPageSearch();
	});
}
function validForm(aform) {
	clearAlerts();
	let validator = null;
	if($.trim($(".groupname",aform).val())=="") {
		$(".groupname",aform).parent().addClass("has-error");
		$(".groupname-alert",aform).show();
		if(!validator) validator = "groupname";
	}
	if($.trim($(".nameen",aform).val())=="") {
		$(".nameen",aform).parent().addClass("has-error");
		$(".nameen-alert",aform).show();
		if(!validator) validator = "nameen";
	}
	if($.trim($(".nameth",aform).val())=="") {
		$(".nameth",aform).parent().addClass("has-error");
		$(".nameth-alert",aform).show();
		if(!validator) validator = "nameth";
	}
	if($.trim($(".sequenceno",aform).val())=="") {
		$(".sequenceno",aform).parent().addClass("has-error");
		$(".sequenceno-alert",aform).show();
		if(!validator) validator = "sequenceno";
	}
	if(validator) {
		$("."+validator,aform).focus();
		setTimeout(function() { 
			$("."+validator,aform).parent().addClass("has-error");
			$("."+validator+"-alert",aform).show();
		},100);
		return false;
	}
	return true;
}
function save(aform,dialog) {
	if(!aform) aform = fsentryform;
	if(!validForm(aform)) return false;
	confirmSave(function() {
		let formdata = serializeDataForm(aform);
		startWaiting();
		jQuery.ajax({
			url: API_URL+"/api/sfte002/insert",
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
				if(dialog) { 
					refreshFilters();
					search();							
				} 
				successbox(function() { fsinsertform.reset(); clearingFields(); });					
			}
		});
	});
	return false;
}
function update(aform) {
	if(!aform) aform = fsentryform;
	if(!validForm(aform)) return false;
	confirmUpdate(function() {
		let formdata = serializeDataForm(aform);
		startWaiting();
		jQuery.ajax({
			url: API_URL+"/api/sfte002/update",
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
				successbox(function() { 
					showPageSearch();
					refreshFilters();
					search();
					$("#insert_dialog_layer").modal("hide");
				});
			}
		});
	});
	return false;
}
function submitChapter(aform,index) {
	let fs_params = fetchParameters($("#listpanel").data("searchfilters"));
	let formdata = serializeDataForm(aform, $("#listpanel").data("searchfilters"));
	startWaiting();
	jQuery.ajax({
		url: API_URL+"/api/sfte002/search",
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
}
function submitOrder(src,sorter) {
	let aform = fssortform;
	aform.orderBy.value = sorter;
	let fs_params = fetchParameters($("#listpanel").data("searchfilters"));
	let formdata = serializeDataForm(aform, $("#listpanel").data("searchfilters"));
	startWaiting();
	jQuery.ajax({
		url: API_URL+"/api/sfte002/search",
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
}
function submitDelete(src,fsParams) {
	confirmDelete([fsParams[0]],function() {
		deleteRecord(fsParams);
	});
	return false;
}
function deleteRecord(fsParams) {
	let params = {
		ajax: true,
		groupname : fsParams[0]
	};
	let formdata = serializeParameters(params);
	startWaiting();
	jQuery.ajax({
		url: API_URL+"/api/sfte002/remove",
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
			showPageSearch();
			ensurePaging();
			refreshFilters();
			search();
		}
	});	
}
function exploreLayer(src,layer) {
	let $src = $(src);
	if($src.is(".up")) {
		$src.removeClass("up").addClass("down");
		$("#"+layer).hide();
		$src.find(".fa").removeClass("fa-chevron-circle-up").addClass("fa-chevron-circle-down");
	} else {
		$src.removeClass("down").addClass("up");
		$("#"+layer).show();
		$src.find(".fa").removeClass("fa-chevron-circle-down").addClass("fa-chevron-circle-up");
	}
}
function displaySequenceInfo(tabname) {
	$("tr",$(tabname)).each(function(index,element) { 
		$("td",$(element)).eq(0).html(""+(index+1));
	});		
}
function readProgramInfo(grpname) {
	let params = {
		ajax: true,
		groupname : grpname
	};
	let formdata = serializeParameters(params);
	$("#proglayerheader").startWaiting();
	jQuery.ajax({
		url: API_URL+"/api/sfte002/proglist",
		data: formdata.jsondata,
		headers: formdata.headers,
		type: "POST",
		dataType: "json",
		contentType: defaultContentType,
		error : function(transport,status,errorThrown) { 
			$("#proglayerheader").stopWaiting();
			submitFailure(transport,status,errorThrown);  
		},
		success: function(data,status,transport){ 
			$("#proglayerheader").stopWaiting();
			if(data.body["rows"]) {
				$(data.body.rows).each(function(index,element) { 
					displayProgramInfo(element["programid"],element["progname"],element["parameters"],element["seqno"]);
				});
				displaySequenceTableLists("#progtablebody");
				adjustProgTableHeight();
			}
		}
	});	
}
function addNewProgram() {
	let gid = $("#groupname").val();
	let pid = $("#progingroup").val();
	if($.trim(pid)=="" || $.trim(gid)=="") return;
	let found = $("input[value="+pid+"]",$("#progtablebody")).length>0;
	if(found) {
		alertbox("Duplicate program entry");
		return;
	}
	$("#permitgroupname").val(gid);
	$("#permitprogramid").val(pid);
	let text = $("option:selected",$("#progingroup")).text();
	$("#program_info").html(text);
	$("#savebuttondialogpermit").unbind("click");
	$("#savebuttondialogpermit").bind("click",function() { 
		addNewProgramInfo();
		return false;
	});
	$("#parameters").val("");
	$("input.permit-input").val("true");
	$("input.permit-checkbox").attr("checked",true);
	$("#permit_dialog_layer").modal("show");
	$("#permit_dialog_layer > .modal-dialog").draggable();
}
function addNewProgramInfo(aform) { 
	if(!aform) aform = fspermitform;
	let pid = $("#progingroup").val();
	if($.trim(pid)=="") return;
	let found = $("input[value='"+pid+"']",$("#progtablebody")).length>0;
	if(found) {
		alertbox("Duplicate program entry");
		return;
	}
	let pname = $("option:selected",$("#progingroup")).text();
	let para = $("#parameters").val();
	let idx = $("tr",$("#progtablebody")).length;
	$("#permitprogseqno").val(""+(idx+1));
	let formdata = serializeDataForm(aform);
	jQuery.ajax({
		url: API_URL+"/api/sfte002/proginsert",
		data: formdata.jsondata,
		headers: formdata.headers,
		type: "POST",
		dataType: "json",
		contentType: defaultContentType,
		error : function(transport,status,errorThrown) { 
			submitFailure(transport,status,errorThrown);  
		},
		success: function(data,status,transport){ 
			displayProgramInfo(pid,pname,para,idx+1);
			adjustProgTableHeight();
			$("#permit_dialog_layer").modal("hide");
		}
	});	
}
function removeProgramInGroup(pid,gid,callback) {
	let params = {
		ajax: true,
		programid : pid,
		groupname : gid
	};
	let formdata = serializeParameters(params);
	jQuery.ajax({
		url: API_URL+"/api/sfte002/progremove",
		data: formdata.jsondata,
		headers: formdata.headers,
		type: "POST",
		dataType: "json",
		contentType: defaultContentType,
		error : function(transport,status,errorThrown) { 
			submitFailure(transport,status,errorThrown);  
		},
		success: function(data,status,transport){ 
			if(callback) callback();
		}
	});	
}
function displayProgramInfo(pid,pname,para,seqno) {
	if(!seqno) seqno = "";
	if(!para) para = "";
	let $table = $("<table class='prog-item-table-class'></table>");
	let $item = $('<li class="prog-item-class ui-state-active"></li>');	
	let $tr = $("<tr></tr>");
	let $td1 = $('<td class="cclass progno-column" align="center"></td>').append(seqno);
	let $td2 = $('<td class="cclass progid-column" align="center"></td>').append(pid);
	let $td3 = $('<td class="cclass progname-column">&nbsp;</td>').append(pname);
	let $td4 = $('<td class="cclass progctrl-column" align="center"></td>');
	let $pinput = $("<input type='hidden'></input>");
	$pinput.val(para);
	let $ebtn = $('<input type="button" class="btn-edit"></input>');
	$ebtn.attr("title","Edit "+pid);
	$ebtn.click(function() { 
		editProgramInGroup(pid,$("#groupname").val(),pname,$pinput.val(),seqno,function(paras) { 
			$pinput.val(paras);
		});
	});	
	let $btn = $('<input type="button" class="btn-delete"></input>');
	$btn.attr("title","Delete "+pid);
	$btn.click(function() { 
		confirmRemove([pid],function() { 
			removeProgramInGroup(pid,$("#groupname").val(),function() { 
				$item.remove();
				displaySequenceTableLists("#progtablebody");
			});
		});
		return false;
	});
	$td4.append($ebtn).append("&nbsp;&nbsp;").append($btn);
	let $uinput = $('<input type="hidden" name="progid" class="progidclass"></input>');
	$uinput.val(pid);
	$td2.append($uinput)
	$td3.append($pinput);
	$tr.append($td1).append($td2).append($td3).append($td4);
	$table.append($tr);
	$item.append($table);
	$("#progtablebody").append($item);
}
function editProgramInGroup(pid,gid,pname,para,seqno,callback) {
	let params = {
		ajax: true,
		progid: pid,
		groupid: gid
	};
	let formdata = serializeParameters(params);
	jQuery.ajax({
		url: API_URL+"/api/sfte002/permit",
		data: formdata.jsondata,
		headers: formdata.headers,
		type: "POST",
		dataType: "html",
		contentType: defaultContentType,
		error : function(transport,status,errorThrown) { 
			submitFailure(transport,status,errorThrown);  
		},
		success: function(data,status,transport){ 
			$("#permitpanel").html(data);
			$("#program_info").html(pid+" - "+pname);
			$("#parameters").val(para);
			$("#permitprogseqno").val(""+seqno);
			$("#savebuttondialogpermit").unbind("click");
			$("#savebuttondialogpermit").bind("click",function() { 
				updateProgramInfo(fspermitform,callback);
				return false;
			});
			$("#permit_dialog_layer").modal("show");
			$("#permit_dialog_layer > .modal-dialog").draggable();
		}
	});	
}
function updateProgramInfo(aform,callback) { 
	if(!aform) aform = fspermitform;
	let para = $("#parameters").val();
	let formdata = serializeDataForm(aform);
	jQuery.ajax({
		url: API_URL+"/api/sfte002/progupdate",
		data: formdata.jsondata,
		headers: formdata.headers,
		type: "POST",
		dataType: "json",
		contentType: defaultContentType,
		error : function(transport,status,errorThrown) { 
			submitFailure(transport,status,errorThrown);  
		},
		success: function(data,status,transport) { 
			if(callback) callback(para);
			$("#permit_dialog_layer").modal("hide");
		}
	});	
}
function displaySequenceTableLists(tablelists) {
	$("li",$(tablelists)).each(function(index,element) { 
		let $table = $(this).find("table").eq(0);
		$table.find("tr").eq(0).find("td").eq(0).html(""+(index+1));
	});
}
function adjustProgTableHeight() {
	let totalHeight = 0;
	$("#progtablebody li").each(function() {
	   totalHeight += $(this).outerHeight(); 
	});
	$("#progtablelayer").height(totalHeight+5);	
}
function toggleValueClick(src,ctrl) {
	$("#"+ctrl).val($(src).is(":checked"));
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
	$("#datatablebody").find(".fa-data-delete").each(function(index,element) {
		$(element).click(function() {
			if($(this).is(":disabled")) return;
			submitDelete(element,[$(this).attr("data-key")]);
		});
	});
	$("#datatablebody").find(".fa-data-view").each(function(index,element) {
		$(element).click(function() {
			if($(this).is(":disabled")) return;
			submitEdit(element,$(this).attr("data-key"));
		});
	});
}
