var defaultContentType = "application/x-www-form-urlencoded; charset=UTF-8";
function load_page(appid,params,callback){	
	if(!$currPage || $currPage=="") {
		$currPage = $("#page_0");
	}	
	$currPage.hide();
	$currPage.removeClass("pt-page-current pt-page-moveFromRight pt-page-moveFromLeft");	
	try{ closeMenuBar(); }catch(ex) { }
	loadApplication(appid,params,callback);
	$("#pagecontainer").show();
	$("#workingframe").hide();
	$("#languagemenuitem").hide();
}
function loadApplication(appid,params,callback) {
	let fs_useruuid = $("#main_useruuid").val();
	let fs_user = $("#main_user").val();
	let appurl = BASE_URL+"/gui/"+appid; //+"?seed="+Math.random()+"&useruuid="+fs_useruuid+"&userid="+fs_user+(params?"&"+params:"");
	console.log("load application url",appurl);
	let prm = { useruuid: fs_useruuid, userid: fs_user, language: fs_default_language };
	if(params) {
		let pr = params.split("&");
		for(let i=0;i<pr.length;i++) {
			let kary = pr[i].split("=");
			prm[kary[0]] = kary[1];
		}
	}
	console.log("prm",prm);
	let authtoken = getAccessorToken();
	startWaiting();
	jQuery.ajax({
		url: appurl,
		data: prm,
		headers : { "authtoken": authtoken },
		type: "POST",
		dataType: "html",
		contentType: defaultContentType,
		error : function(transport,status,errorThrown) { 
			stopWaiting();
			let txt = $.trim(transport.responseText);
			let $div = $("<div class='protection-error'></div>").html(txt);
			$("#pagecontainer").html($div);
		},
		success: function(data,status,transport){ 
			stopWaiting();
			$("#pagecontainer").html(data);
			$currPage = $("#pagecontainer").children("div").eq(0);
			$currPage.addClass("pt-page-current pt-page-moveFromRight");
			$currPage.show();
			if(callback) callback();
		}
	});	
}
function open_page(appid,url,params,apath) {
	console.log("open_page(appid="+appid+",url="+url+",params="+params+",path="+apath+")");
	let fs_newflag = "1"==$("#accessor_label").data("NEW");
	if(!fs_newflag) {
		if(!$currPage || $currPage==""){
			$currPage = $("#page_0");
		}	
		$currPage.hide();
		$currPage.removeClass("pt-page-current pt-page-moveFromRight pt-page-moveFromLeft");	
		try{ closeMenuBar(); }catch(ex) { }
		$("#languagemenuitem").hide();
	}
	open_program(appid,url,params,apath);
}
var except_apps = ["page_profile","page_change","page_first","page_login","page_work","page_forgot"];
function open_program(appid,url,params,apath) {
	let fs_newwindows = "1"==$("#accessor_label").data("NEW");
	console.log("open_program(appid="+appid+", path="+apath+", url="+url+", params="+params+")");
	if(!apath) apath = "";
	let appurl = apath+"/gui/"+appid; //+"?seed="+Math.random()+(params?"&"+params:"");
	if(url && $.trim(url)!="") {
		appurl = "/load/"+appid; //+"?seed="+Math.random()+(params?"&"+params:"");
	}
	console.log("open : "+appurl);
	$("#page_login").hide();
	let authtoken = getAccessorToken();
	if(fs_newwindows) {
		let awin = openNewWindow({
			url : appurl,
			windowName: "fs_window_"+appid,
			params: "authtoken="+authtoken+"&language="+fs_default_language+(params?"&"+params:"")
		});
		awin.focus();
	} else {
		//$("#workingframe").contents().find("body").html("");
		//workingframe.onreadystatechange = function() { console.log("ie stop"); stopWaiting() }; //IE
		//workingframe.onload = function() { console.log("stop waiting ..."); stopWaiting() }; //chrome, mozilla
		$("#pagecontainer").hide();
		$("#workingframe").show();
		submitWindow({
			url : appurl,
			windowName: "workingframe",
			params: "authtoken="+authtoken+"&language="+fs_default_language+(params?"&"+params:"")
		});
		startWaiting();
	}
	recentApplication(appid,url,params);
}
function recentApplication(appid,url,params) {
	let $rlist = $("#recentmenulist");
	let $items = $rlist.find("li");
	if($items.length>15) return;
	let found = false;
	$(except_apps).each(function(idx,elem) { if(elem==appid) { found = true; return false; } });	
	$items.each(function(idx,elem) { if($(elem).attr("appid")==appid) { found = true; return false; }});
	if(found) return;	
	let authtoken = getAccessorToken();
	jQuery.ajax({
		url: API_URL+"/api/apps/find",
		data: { programid: appid },
		headers : { "authtoken": authtoken },
		type: "POST",
		dataType: "html",
		contentType: defaultContentType,
		success: function(data){ 
			let json = $.parseJSON(data);
			if(json && json.body.rows.length>0) {
				let row = json.body.rows[0];
				let $li = $("<li></li>");
				let $alink = $("<a href='javascript:void(0)'></a>");
				$alink.click(function() { open_page(appid,url,params); }).html(row["description"]);
				$li.append($alink).attr("appid",appid).attr("url",url).appendTo($rlist);	
				$("#recentcaret").show();
			}
		}
	});
}
function startWaiting() { 
	//do nothing
}
function stopWaiting() {
	//do nothing
}
