var fs_default_raw_parameters = false;
var fs_default_language = "EN";
var fs_mainPage = "index";
var fs_currentpid = null;
var fs_langsDocs = null;
var fs_mainDocs = null;
var fs_defaultDocs = null;
var fs_labelAry = null;
var fs_winary = new Array();
var fs_fontSize = 14;
var API_URL = "";
var BASE_URL = "";
var API_TOKEN = null;
function getWindowByName(winname) {
	if(!winname) return null;
	for(let i=0,isz=fs_winary.length;i<isz;i++) {
		try	{
			if(fs_winary[i]) {
				if(fs_winary[i].name == winname) return fs_winary[i];
			}
		}catch (ex)	{ 	}
	}
	return null;
}
function closeChildWindows() {
	for(let i=0,isz=fs_winary.length;i<isz;i++) {
		try	{
			if(fs_winary[i]) fs_winary[i].close();
		}catch(ex) { }
	}
}
function addWindow(awindow) {
	if(!awindow) return;
	fs_winary.push(awindow);
}
function fs_getLanguageDocuments(fs_progid,mainpage) {
	console.log("progid="+fs_progid+", mainpage="+mainpage);
	let aurl = API_URL+"/api/label/get";
	let docdata = {};
	let authtoken = getAccessorToken();
	$.ajax({
		async: false,
		url: aurl,
		data: { labelname: fs_progid },
		headers : { "authtoken": authtoken },
		type: "GET",
		dataType: "json",
		success: function(data,status,transport){ docdata = data; },
	});
	if(!docdata) docdata = {};
	return docdata; 
}
function fs_getLangsDocs(fs_progid,mainpage) {
	console.log("getLangsDocs, langsDocs="+fs_langsDocs+", defaultDocs="+fs_defaultDocs+", mainDocs="+fs_mainDocs);
	if(!fs_progid || fs_progid=="") return fs_langsDocs;
	if(!fs_langsDocs) {
		let json = fs_getLanguageDocuments(fs_progid,mainpage);
		if(json && json.body) {
			fs_langsDocs = Object.assign({},json.body);
		}
		if(fs_mainPage==fs_progid && json && json.body) fs_mainDocs = Object.assign({},json.body);
	}
	if(!fs_defaultDocs) {
		let json = fs_getLanguageDocuments("default_label",mainpage);
		if(json && json.body) {
			fs_defaultDocs = Object.assign({},json.body);
		}
	}
	if(fs_mainPage==fs_progid) {
		if(!fs_mainDocs) {
			let json = fs_getLanguageDocuments(fs_progid,mainpage);
			if(json && json.body) {
				fs_mainDocs = Object.assign({},json.body);
			}
		}
		return fs_mainDocs;
	}
	return fs_langsDocs;
}
function fs_createHashElements(fs_lang,fs_langHash,json) { 
 	if(!fs_lang) return false; 
 	if(!fs_langHash) return false; 
 	if(!json) return false;
	Object.assign(fs_langHash,json[fs_lang]);
 	return true; 
} 
function fs_createLabelArrays(json) { 
 	let result = []; 
 	if(!json) return result; 
	let data = json["EN"];
	if(!data) data = json["TH"];
	if(data) {
		result = Object.keys(data);
	}
 	return result; 
} 
var fs_hashLang = {};
function fs_switchingLanguage(fs_Language,mainpage,progid) {
	if(!progid || progid=="") progid = fs_currentpid;
	if(!fs_labelAry) {
		fs_labelAry = fs_createLabelArrays(fs_getLangsDocs(progid,mainpage));
		if(fs_defaultDocs) {
			let fs_defaultLabelAry = fs_createLabelArrays(fs_defaultDocs);
			if(fs_labelAry && fs_defaultLabelAry) fs_labelAry = fs_labelAry.concat(fs_defaultLabelAry);
		}
	}
	let fs_curArray = fs_labelAry;
	let fs_hash= fs_hashLang[fs_Language];
	if(!fs_hash) {
		fs_hash = {};
		if(fs_defaultDocs) {
			fs_createHashElements(fs_Language,fs_hash,fs_defaultDocs);			
		}
		fs_createHashElements(fs_Language,fs_hash,fs_getLangsDocs(progid,mainpage));
		fs_hashLang[fs_Language] = fs_hash;
	}
	if(fs_mainPage==progid) {
		fs_hash = {};
		if(fs_mainDocs) {
			fs_curArray = fs_createLabelArrays(fs_mainDocs);
			fs_createHashElements(fs_Language,fs_hash,fs_mainDocs);
		} else {
			let json = fs_getLanguageDocuments(progid,mainpage);
			if(json && json.body) {
				fs_mainDocs = Object.assign({},json.body);
			}
			fs_curArray = fs_createLabelArrays(fs_mainDocs);
			fs_createHashElements(fs_Language,fs_hash,fs_mainDocs);
		}
	}
	if(fs_hash) {
		for(let i=0;i<fs_curArray.length;i++) {
			try { $("#"+fs_curArray[i]).html(fs_hash[""+fs_curArray[i]]); } catch(ex) { }
			try { $("#"+fs_curArray[i]).val(fs_hash[""+fs_curArray[i]]); } catch(ex) { }
		}
	}
}
function fs_switchLanguage(fs_Language,mainpage) { 
	if(!fs_Language) return;
	fs_Language = fs_Language.toUpperCase();
	try { fs_switchingLanguage(fs_Language,mainpage); } catch(ex) { }
	try { fs_changingLanguage(fs_Language,mainpage); } catch(ex) { }
	fs_default_language = fs_Language;
}
function fs_getLabelName(labelId,progid,lang) {
	if(!progid || progid=="") progid = fs_currentpid;
	let fs_Language = fs_default_language;
	if(lang) fs_Language = lang;
	let fs_hash= fs_hashLang[fs_Language];
	if(!fs_hash) {
		fs_hash = {};
		fs_createHashElements(fs_Language,fs_hash,fs_getLangsDocs(progid));
		fs_hashLang[fs_Language] = fs_hash;
	}
	if(fs_mainPage==progid) {
		if(fs_mainDocs) {
			fs_hash = {};
			fs_createHashElements(fs_Language,fs_hash,fs_mainDocs);
		} else {
			fs_hash = {};
			fs_createHashElements(fs_Language,fs_hash,fs_getLangsDocs(progid));
		}
	}
	if(fs_hash) {
		return fs_hash[labelId];
	}
	return null;
}
function fs_stopAnchorTaborder() {
		try {
			let links = document.getElementsByTagName("A");
			for( let i = 0, j =  links.length; i < j; i++ ) {
				links[i].setAttribute('tabIndex','-1');
			}
		}catch(ex) { }
}
function fs_enterTab(myfield, e) { 
	 let key; let keychar;  
	 if (window.event) key = window.event.keyCode; else if (e) key = e.which; else return true; 
	 keychar = String.fromCharCode(key); 
	 if ((key==null) || (key==0) || (key==8) || (key==9) || (key==27)) return true; 
	 else if (key !=13) return true; 
} 
function convert(str) { 
	if(str==null) return "";
	let i = 0; 
	let result = ""; 
	for(i=0;i<str.length;i++) { 
		let a = str.charCodeAt(i); 
		if(a>3424) { 
			a = a - 3424; 
			result = result + String.fromCharCode(a); 
		} else { 
			result = result + str.charAt(i); 
		} 
	} 
	result = escape(result); 
	while(result.indexOf('+')!=-1) result = result.replace('+','%2B'); 
	return result; 
} 

function openWindow(url, winname, winWidth, winHeight, fullScreen) { 
	if(!winname) return;  
	try {	 
		let fswin = getWindowByName(winname); 
		if(fswin) { fswin.focus(); return; }  
	} catch(ex) { } 
	if(!winWidth) winWidth = window.screen.availWidth; 
	if(!winHeight) winHeight = window.screen.availHeight; 
	if(!url) url = ""; 
	let sw = window.screen.availWidth; 
	let sh = window.screen.availHeight; 
	try{if(fullScreen==null) fullScreen = fs_fullscreen; }catch(ex) { }
	if(fullScreen) { 
		winWidth = sw; 
		winHeight = sh; 
	} 
	let wx = (sw - winWidth) / 2; 
	let wy = (sh - winHeight) / 2; 
	let features = "top="+wy+",left="+wx+",width="+winWidth+",height="+winHeight+",toobar=no,menubar=1,location=no,directories=no,status=no,scrollbars=yes,resizable=yes"; 
	let fs_window = window.open(url,winname,features); 
	fs_window.opener = self; 
	try {	 
		if("_self" != winname.toLowerCase()) {
			addWindow(fs_window); 
		}
	} catch(ex) { } 
	return fs_window; 
 } 
		
  function validNumeric(myfield){ 
   let data=myfield.value; 
   if (data!="") { 
	data = clearComma(data);  
	if (data.length>1) {  
		if (data.indexOf('.')==0)	data='0'+data; 
		if (data.indexOf('.')==data.length-1) data += '0';  
	} 
	data =  formatFloat(data , myfield.getAttribute("DECIMAL") ); 
	if (  data == 0 || Number(data)  ) ;  
	else return false; 
	myfield.value = putComma(data); 
   } 
   return true; 
 } 

function formatFloat(myvalue , point){ 
   if ( point == null || point <= 0 ) return myvalue ; 
   let dec = "0"; 
   dec += (myvalue.indexOf('.')>-1 )?myvalue.substring( myvalue.indexOf('.') ):".0"; 
	let i = point - (dec.length-2) ; 
	for ( ;i>0 ;i-- ){ dec +="0"; } 
	let x =( myvalue.indexOf('.')>-1 )?myvalue.substring(0,myvalue.indexOf('.')):myvalue ; 
	return  x+dec.substring(dec.indexOf('.')); 
} 

function validDate(myfield){ 
  if ( myfield == null || myfield.value=="" ) return true; 
  if ( formatDate(myfield.value) ) return true; 
  else return false; 
} 

function formatDate(mydate) { 
   let delimiter = "/"; 
	let dmy = /\d{1,2}\/\d{1,2}\/\d{2,4}/ ;
	if ( !mydate.match(dmy) ) return false; 
	let intDay = new Date(); 
	intDay.setDate(1); 
	let ary_date = mydate.split(delimiter); 
	let y=ary_date[2]; 
	if ( y.length==2 ) { 
	if (y>=80) { y = intDay.getYear()-100-(intDay.getYear()%100)+eval(y) ;   
	}else { y = intDay.getYear()-(intDay.getYear()%100)+ eval(y) ;}  
	}else if ( y.length==3 )  return false; 
	intDay.setYear(y);   
	let m = eval(ary_date[1]) ; 
  if ( (m>0) && (m<=12) ) { intDay.setMonth(m);   intDay.setDate(0); } 
  else   return false ; 
  let d = eval(ary_date[0]); 
  if ( (d>0) && (d<=intDay.getDate()) ) return true;  
  else return false; 
} 

function validRangeDate(a,b){ 
	 try{ 
		if ( a!="" && b!="" ){ 
			let vala = a.split("/").reverse().join(""); 
			let valb = b.split("/").reverse().join(""); 
			if ( eval(valb)<eval(vala) ) return false; 
		} 
	 }catch(ex){  } 
	 return true; 
} 

function increaseValue(avalue,addonvalue,decimal) { 
	if(!decimal) decimal = 0; 
	return forValue(avalue,addonvalue,decimal,"+"); 
} 
		  
function decreaseValue(avalue,addonvalue,decimal) { 
	if(!decimal) decimal = 0; 
	return forValue(avalue,addonvalue,decimal,"-"); 
} 
		  
function forValue(avalue,addonvalue,decimal,flag) { 
	let result = eval(removeComma(avalue)); 
	if(decimal>0) { 
		let mval = Math.pow(10,decimal); 
		let addon = addonvalue * mval; 
		result = result * mval; 
		if(flag=="+") { 
			result = result + addon; 
		} else { 
			result = result - addon; 
		} 
		result = result / mval;			 
	} else { 
		if(flag=="+") { 
			result = result + addonvalue; 
		} else { 
			result = result - addonvalue; 
		} 
	} 
	return result; 
} 
		 		 
function parseNumber(avalue) { 
	return eval(removeComma(avalue)); 
} 
		  
function removeComma(avalue) { 
	let result = avalue ; 
	while ( result.indexOf(",") > -1 ) { 
		result = removeDelimiter(result,",");	} 
	return result; 
} 
		 				 
function removeDelimiter(avalue,delimiter) { 
	return avalue.replace(delimiter,""); 
} 
		 							 
function formatFloating(avalue,decimal) { 
	avalue = avalue+""; 
	avalue = removeComma(avalue); 
	return formatDecimal(avalue,decimal,true); 
} 
		 							 
function formatDecimal(avalue,decimal,verifydecimal) { 
	let sign = ""; 
	let result = avalue+"";			 
	let bstr = ""; 
	let cstr = ""; 
	let i = result.indexOf("-"); 
	if(i>=0) { 
		sign = "-"; 
		result = result.substring(i+1); 
	} else { 
		i = result.indexOf("+"); 
		if(i>=0) { 
			sign = "+"; 
			result = result.substring(i+1);					 
		} 
	} 
	let astr = result; 
	i = result.indexOf("."); 
	if(i>0) { 
		astr = result.substring(0,i); 
		bstr = result.substring(i+1); 
		cstr = result.substring(i); 
	}  
	let la = astr.length; 
	if(la>3) { 
		let tstr = astr; 
		astr = ""; 
		while(tstr!="") { 
			la = tstr.length; 
			let md = la % 3; 
			if(md>0) { 
				astr += tstr.substring(0,md)+","; 
				tstr = tstr.substring(md); 
			} else { 
				astr += tstr.substring(0,3); 
				tstr = tstr.substring(3); 
				if(tstr!="") astr += ","; 
			} 
		} 
	} 
	if(verifydecimal) { 
		if(decimal>0) { 
			let l = bstr.length; 
			if(decimal>l) { 
				let j = 0; 
				for(j=l;j<decimal;j++) { 
					bstr += "0"; 
				} 
			} else { 
				bstr = bstr.substring(0,decimal); 
			}		 
			if(astr=="") return ""; 
			return sign+astr+"."+bstr; 
		} else { 
			return sign+astr; 
		} 
	} else { 
		return sign+astr+cstr; 
	} 
}						 
		  
function getTimeNow() { 
	let now = new Date(); 
	let hh = now.getHours(); 
	let mm = now.getMinutes(); 
	let ss = now.getSeconds(); 
	let result = ((hh < 10) ? "0":"") + hh; 
	result += ((mm < 10) ? ":0" : ":") + mm; 
	result += ((ss < 10) ? ":0" : ":") + ss; 
	return result; 
} 
		  
function getDateNow() { 
	let now  = new Date(); 
	let dd = now.getDate(); 
	let mm = now.getMonth()+1; 
	let yy = now.getFullYear(); 
	let result = ((dd < 10) ? "0" : "") + dd; 
	result += ((mm < 10) ? "/0" : "/") + mm; 
	result += "/"+yy; 
	return result; 
} 
let regPicture = /[9XEATxea]/; 
function fs_intNumsOnly(myfield, e,decimal,isPlus) { 
	let key; let keychar;  
	if (window.event) key = window.event.keyCode; else if (e) key = e.which; else return true; 
	keychar = String.fromCharCode(key); 
	 let element = myfield; 
	 isPlus = ( isPlus != null )? true : false ; 
	 let isPoint= ( decimal != null && decimal != 0 )? true : false ; 
	 if ( key==45 && element.value.indexOf('-')==-1 && !isPlus  ) { 
	 element.value="-"+element.value;} 
	 if ( (key==46)&&(element.value.indexOf('.')==-1)&& isPoint ){ 
	 if (element.value == "") element.value='0'; 
	 return true; } 
	if ((key==null) || (key==0) || (key==8) || (key==9) || (key==27)) return true; 
	else if ((("0123456789").indexOf(keychar) > -1)) return true; 
	else return false; 
} 
function fs_intNumsOnly_chkKey(myfield, e,decimal,isPlus) { 
	 let iskeyup = myfield.getAttribute('keyup'); 
	 if ( iskeyup==null) ;  
	 else if ( iskeyup==false){  event.returnValue = false;  return false; }  
	 myfield.setAttribute('keyup',false);  
	 return fs_intNumsOnly(myfield, e,decimal,isPlus);  
} 
function fs_chkKey(myfield,maxvalue,decimal) { 
	let iNum=event.keyCode; 
	if (((iNum>=48)&&(iNum<=57)) || ((iNum>=96)&&(iNum<=105)) || iNum==109 || iNum==110 || iNum==189 || iNum==190 ) { 
		myfield.setAttribute('keyup',true);    
		let c_pos = getCaretPosition(myfield);
		let o_len = myfield.value.length;
		formatNumber(myfield,maxvalue,decimal);
		let n_len = myfield.value.length;
		setCaretPosition(myfield,n_len>o_len?c_pos+1:c_pos);
	} 
} 
function formatNumber(element,maxvalue,decimal) { 
      let valueBfChange = element.value;
	  let data = element.value; 
	  let point = 0 ; 
	  if ( decimal != null && decimal !=  ""  )  { 
	   point = ( eval(decimal) >= 0 ) ? eval(decimal) : 99  ;} 
	  let fraction = null ; 
	  if ( maxvalue != null && maxvalue != "" ) { 
	  if ( eval(maxvalue) >= 0 ) { 
	   fraction = maxvalue ; 
	   if ( data.indexOf("-")>-1 )  fraction++; 	} 
	  else 
	   fraction = null  ; 
	  } 
	  data = clearComma(data); 
	  try { 
	   let dot = '' ; 
	   let x = data.split('.'); 
	   if ( x.length == 2 && point > 0 ) { 
	    dot = ( x[1].length > point )?('.'+x[1].substring(0,point)):('.'+x[1]) ; } 
	   while ( x[0].length > 1 && x[0].charAt(0)=="0" ) { 
	    x[0] = x[0].substring(1);	} 
	   if ( (fraction == 0 && eval(x[0]) > 0 ) || 
	    ( fraction > 0 && x[0].length > fraction ) ){ 
	    element.value = valueBfChange ; return true;	} 
	   data = x[0] + dot; 
	  }catch (ex) { } 
	  element.value=putComma(data); 
} 
function putComma(data) { 
	  if ( data.indexOf(',') > -1 ) { data = clearComma(data); } 
	  let move = ( data.indexOf('.') > -1 ) ? data.indexOf('.') : data.length; 
	  let minus = ( data.indexOf('-') > -1 ) ? 1 : 0 ; 
	  while ( move > 3 ) { 
	   if ( minus && move <= 4  )  { break ; } 
	   data = data.substring(0,move-3)+","+data.substring(move-3) ; 
	   move -= 3 ; 
	  } 
	  return data; 
} 
function clearComma(data){ 
  while (data.indexOf(',')!=-1) { 
   data =  data.replace(',',''); } 
  return data; 
} 
function getCaretPosition (ctrl) {
	let iCaretPos = 0;
	if (document.selection) { 
		ctrl.focus ();
		let selector = document.selection.createRange ();
		selector.moveStart ('character', -ctrl.value.length);
		iCaretPos = selector.text.length;
	} else if (ctrl.selectionStart || ctrl.selectionStart == '0') {
		iCaretPos = ctrl.selectionStart;
	}
	return (iCaretPos);
}
function setCaretPosition(ctrl, iCaretPos) {
	if (ctrl.createTextRange) { 
		let selector = ctrl.createTextRange ();
		selector.collapse(true);
		selector.moveEnd ('character', iCaretPos);
		selector.moveStart ('character', iCaretPos);
		selector.select ();
	} else if (ctrl.selectionStart || ctrl.selectionStart == '0') {
		ctrl.selectionStart = iCaretPos;
		ctrl.selectionEnd = iCaretPos;
		ctrl.focus ();
	}
}

function enableElements(doc) {
	$("input[type!=hidden]:disabled, select:disabled, button:disabled, textarea:disabled, a",doc||this.document).each(function(index,element){ 
		let e = $(this);
		if(e.data("fs_disabled_element")) {
			e.attr("disabled",false);
			if(e.is("a")) {
				e.attr("disables",false);
				let ahref = e.data("fs_ahref");
				if(ahref) e.attr("href",ahref);
				let fnclick = e.data("fs_fnclick");
				if(fnclick) {
					e.bind("click",fnclick);
				}
			}
		}
	});
}
function disableElements(doc) {
	$("input[type!=hidden]:enabled, select:enabled, button:enabled, textarea:enabled, a",doc||this.document).each(function(index,element){ 
		let e = $(this);
		if(!e.is(".ignoredisabled")) {
			e.attr("disabled",true);
			e.data("fs_disabled_element",true);
			if(e.is("a")) {
				if(!e.is(".allowdisabled")) {
					e.attr("disabled",false);
				}
				e.attr("disables",true);
				let ahref = e.attr("href");
				if(ahref) {
					e.removeAttr("href");
					e.data("fs_ahref",ahref);
				}
				let fnclick = e.data("fs_fnclick");
				if(fnclick) e.unbind("click",fnclick);
				fnclick = e.attr("onclick");
				if(fnclick) {
					e.removeAttr("onclick");
					e.data("fs_fnclick",fnclick);
				}
			}
		}
	});
}
function enableButtons() {
	$("input[type=submit]:disabled, input[type=reset]:disabled, input[type=button]:disabled, button:disabled").each(function(index,element){ 
		$(this).attr("disabled",false);
	});
}
function disableButtons() {
	$("input[type=submit]:enabled, input[type=reset]:enabled, input[type=button]:enabled, button:enabled").each(function(index,element){ 
		$(this).attr("disabled",true);
	});
}
function enableForm(aform) {
	$("input[type=submit]:disabled, input[type=reset]:disabled, input[type=button]:disabled, button:disabled",aform).each(function(index,element){ 
		$(this).attr("disabled",false);
	});
}
function disableForm(aform) {
	$("input[type=submit]:enabled, input[type=reset]:enabled, input[type=button]:enabled, button:enabled",aform).each(function(index,element){ 
		$(this).attr("disabled",true);
	});
}
function handleFocus() {
	$("input[type=text]:enabled, textarea:enabled").each(function(index,element){ 
		$(this).focusin(function() { $(this).addClass("ui-active-input"); });
		$(this).focusout(function(){ $(this).removeClass("ui-active-input");  });
	});
}
function hideLayer(layer) {
	$(layer).hide();
}
function showLayer(layer) {
	$(layer).show();
}
function startWaiting() {
	try{
		let dc = $(document.body);
		let sh = dc.innerHeight();
		let fslayer = $("#fswaitlayer");
		let lh = fslayer.height();
		let fstop = mouseY;
		if(lh > (sh-fstop)) fstop = mouseY-lh;
		fslayer.css("top",fstop);
		fslayer.css("left",mouseX>0?mouseX:dc.innerWidth()-50);
		fslayer.show();
	} catch(ex) { }
}
function stopWaiting() {
	try { hideLayer("#fswaitlayer"); }catch(ex) { }
}
function handleDataTable(containerList) {
	if(!containerList) containerList = $("#listpanel");
	$(".drowclass",containerList).each(function(index,element) { 
		let e = $(this);
		e.dblclick(function() { let alink = $("a.anclass:eq(0)",e); if(alink) alink.trigger("click"); else $("input.buttonedit:eq(0)",e).trigger("click"); });
		e.mouseenter(function() { $("td",e).each(function(index,element) { $(this).addClass("ui-state-highlight"); }); });
		e.mouseleave(function() { $("td",e).each(function(index,element) { $(this).removeClass("ui-state-highlight"); }); });
	});
}
function handleDecimalElements(doc) {
	$(".idecimal",doc||this.document).each(function(index,element){ 
		let df = $(this);
		let decimals = df.attr("decimal");
		df.blur(function() { let v = df.val(); if(v=="") v="0"; df.val(formatFloat(v,decimals)); });
	});
}
function clearingFields(aform) {
	$("input[type=text]",aform||this.document).each(function(index,element) { 
		let input = $(this);
		input.val(""); 
		if(input.is(".ilookup")) $("#"+input.attr("id")+"desc").html("");
	});
	$("textarea",aform||this.document).each(function(index,element) { $(this).val(""); });
}
function initialFocus(aform) {
	$("input:visible:eq(0)",aform).trigger("focusin").focus();
}
function startApplication(pid,unbind,aform) { 
	fs_currentpid = pid;
	fs_langsDocs = null;
	fs_labelAry = null;
	fs_hashLang = {};
	if(!unbind) {
		bindHangOut();
	}
	initialAjax();
	initialApplicationControls(aform);
	//disable bootstrap modal auto close when click outside and ESC key
	try {
		$.fn.modal.prototype.constructor.Constructor.DEFAULTS.backdrop = "static";
		$.fn.modal.prototype.constructor.Constructor.DEFAULTS.keyboard =  false;
	} catch(ex) { }
	try {
		//bootstrap v4
		$.fn.modal.Constructor.Default.backdrop = "static";
		$.fn.modal.Constructor.Default.keyboard = false;
	} catch(ex) { }
	try { requestAccessorInfo(); }catch(ex) { }
}
function initialAjax() {
	$.ajaxPrefilter(function( options, originalOptions, xhr ) {
		let token = getAccessorToken();
		if(token) {
			options.headers = $.extend({ "authtoken" : token }, options.headers);
		}
	});
}
function initialApplicationControls(aform) { 
	$("input[type=text]",aform||this.document).each(function(index,element) { 
		let input = $(this);
		try { 	if(input.attr("picture")) { input.mask(input.attr("picture")); } }catch(ex) { }
	});			
	$("input[type=text].itime",aform||this.document).each(function(index,element) { 
		$(this).clockpicker({ align: "left", autoclose: true, donetext: "Done", cleartext: "Clear" });
	});
	$("select[readonly] option:not(:selected)",aform||this.document).attr("disabled",true);
	$("input[type=radio][readonly]",aform||this.document).bind("click",function() { return false; });
	$("input[type=checkbox][readonly]",aform||this.document).bind("click",function() { return false; });
	$("input[type=radio]",aform||this.document).each(function() { 
		if($(this).attr("readonly")) {
			$(this).parent().wrap($("<fieldset disabled></fieldset>"));
		}
	});
	$("input[type=checkbox]",aform||this.document).each(function() { 
		if($(this).attr("readonly")) {
			$(this).parent().wrap($("<fieldset disabled></fieldset>"));
		}
	});
}
function bindHangOut() {
	$(document).bind("click",function(e){ 
		try { window.parent.hangOut(); }catch(ex) { }
	});	
}
function setupApplication(aform) {
	fs_stopAnchorTaborder();
	try{ 
		if(fs_default_language.toUpperCase()!="EN") fs_switchLanguage(fs_default_language,true);
	}catch(ex) { }	
	try { backHawkDown(); }catch(ex) { }
	try { $(window).bind("unload",closeChildWindows); }catch(ex) { }
}
function startPeriodical(period) {
}
function prepareOptions(jsAry,elementname,listing,defaultValue,defaultCaption,doubleValue,notEmpty) {
	if(!jsAry) return;
	if(!defaultCaption) { 
		try { defaultCaption = jsAry["undefinedlookup"]["value"]; } catch(ex) { }
	}
	try {
		if(!defaultCaption) defaultCaption = "   ";
		if(defaultValue!=null) $("<option value='"+defaultValue+"'>"+defaultCaption+"</option>").appendTo(listing);
		let opts = jsAry[elementname];
		if(opts) {
			for(let p in opts) {
				if(doubleValue) {
					if(notEmpty) {
						if(p!="") {
							$("<option value='"+p+"'>"+(p+" - "+opts[p])+"</option>").appendTo(listing);
						}
					} else {
						$("<option value='"+p+"'>"+(p+" - "+opts[p])+"</option>").appendTo(listing);
					}
				} else {
					if(notEmpty) {
						if(p!="") {
							$("<option value='"+p+"'>"+opts[p]+"</option>").appendTo(listing);
						}
					} else {
						$("<option value='"+p+"'>"+opts[p]+"</option>").appendTo(listing);
					}
				}				
			}
		}
	}catch(ex) { }
}

function backHawkDown() {
	$(document).on("keydown", function (e) {
		if (e.which == 8 && !$(e.target).is("input:not([readonly]), textarea")) {
			e.preventDefault(); return;
		}
        if (e.which == 17) {
            e.preventDefault(); return;
        }		
        //if(e.which==123) { //F12
		//	e.preventDefault(); return;
		//}
	});	
}
function notAllowRightClick() {
    $(document).on("contextmenu", function(e) {
        e.preventDefault();
        return false;
    });
}
function submitWindow(settings) {
	let p = settings;
	if((p.url && p.url!="") && p.params) {
		let frm = $("<form method='POST'></form>");
		frm.attr("action",p.url);
		frm.attr("target",p.windowName);
		if(typeof(p.params)==="string") {
			let prms = p.params.split("&");
			for(let i=0;i<prms.length;i++) {
				let kary = prms[i].split("=");
				let inp = $('<input type="hidden" name="'+kary[0]+'"></input>');
				inp.val(kary[1]);
				frm.append(inp);
			}
		} else {
			if($.isArray(p.params)) {
				for(let i=0;i<p.params.length;i++) {
					let prm = p.params[i];
					if(prm.name) {
						let inp = $('<input type="hidden" name="'+prm.name+'"></input>');
						inp.val(prm.value);
						frm.append(inp);
					} 
				}
			} else {
				if(p.params) {
					for(let prm in p.params) {
						let inp = $('<input type="hidden" name="'+prm+'"></input>');
						inp.val(p.params[prm]);
						frm.append(inp);
					}
				}
			}
		}
		let layer = $("<div class='open-new-window-submit-layer'></div>");
		layer.append(frm);
		$("body").append(layer);
		frm.trigger("submit");
		setTimeout(function() { layer.remove(); },1500);
	}
}		 
function openNewWindow(settings) {
	let defaultSettings = {
		url : "",
		windowName : "_blank",
		windowWidth : window.screen.availWidth,
		windowHeight : window.screen.availHeight,
		windowFeatures : "toobar=no,menubar=no,location=no,directories=no,status=no,scrollbars=yes,resizable=yes",
		fullScreen : null,
		params : null
	};
	let p = $.extend({},defaultSettings, settings);		
	try {	 
		let fswin = window.parent.getWindowByName(p.winName); 
		if(fswin) { fswin.focus(); return; }  
	} catch(ex) { } 
	let sw = window.screen.availWidth; 
	let sh = window.screen.availHeight; 
	try{if(p.fullScreen==null) p.fullScreen = fs_fullscreen; }catch(ex) { }
	if(p.fullScreen) { 
		winWidth = sw; 
		winHeight = sh; 
	} 
	let wx = (sw - p.windowWidth) / 2; 
	let wy = (sh - p.windowHeight) / 2; 
	let fs_features = "top="+wy+",left="+wx+",width="+p.windowWidth+",height="+p.windowHeight+","+p.windowFeatures;
	let fs_window = null;
	if(p.params) fs_window = window.open("",p.windowName,fs_features); 
	else fs_window = window.open(p.url,p.windowName,fs_features); 
	fs_window.opener = self; 
	try {	 
		window.parent.addWindow(fs_window); 
	} catch(ex) { } 
	submitWindow(p);
	return fs_window; 
} 
function parseErrorThrown(xhr,status,errorThrown) {
	if (!errorThrown) {
		errorThrown = xhr.responseText;
	} else {
		if(errorThrown==xhr.status) {
			errorThrown = xhr.responseText;
		}
	}
	try{
		if(xhr.status==400 || xhr.status==401) errorThrown = xhr.responseText; //400=Bad Request,401=Unauthen
		let json = $.parseJSON(xhr.responseText);
		if(json.text) errorThrown = json.text;
        if(json.head.errordesc) errorThrown = json.head.errordesc;
	}catch(ex) { }
	if($.trim(errorThrown)=="") errorThrown = "Unknown error or network error";
	return errorThrown;
}
function replaceString(str, arrStr){                           
	if(arrStr) {
		let regex = /%s/;
		for(let i=0;i<arrStr.length;i++){
			let t_str = arrStr[i];
			str = str.replace(regex, t_str);
		}
	} 
	if(str) {
		let regex = /%s/g;
		str = str.replace(regex,"");
	}
	return str;
}
var msgxmldoc = null;
function loadXMLMessage(aSync) {
	jQuery.ajax({
		url: "/xml/smart_message.xml?seed="+Math.random(),
		async : aSync,
		type: "GET",
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		dataType: "xml",
		error : function(transport,status,errorThrown) { 
		},
		success: function(data,status,transport){ msgxmldoc = data; }
	});	
}
function getMessageCode(errcode, params) {
	try {
		if (msgxmldoc == null) loadXMLMessage(false);
		let msgnode = $("root msg[code=" + errcode + "]", msgxmldoc);
		let fs_curlang = fs_default_language;
		if(!fs_curlang) fs_curlang = "EN";
		let fs_msgtext = msgnode.find(fs_curlang.toUpperCase()).text();
		if(!fs_msgtext) return errcode;
		if(fs_msgtext && fs_msgtext!="") return replaceString(fs_msgtext, params);
		return msgnode.text();
	}catch(ex) { }
	return errcode;
}
function getMessageTitle(titleCode, defaultTitle) {
	let fs_msgtitle = getMessageCode(titleCode); 
	if(!fs_msgtitle || fs_msgtitle=="") fs_msgtitle = defaultTitle;
	return fs_msgtitle;
}
function createDialog(dialoglayer) {
}
function confirmDialogBox(errcode, params, defaultmsg, okFn, cancelFn, width, height, addedMsg){
	let txt = getMessageCode(errcode,params);
	if(txt!=null && txt!="") {	
		if(addedMsg) txt += " "+addedMsg;
		confirmDialog(txt, okFn, cancelFn, width, height); 
		return false;
	} else {
		if (defaultmsg) {
			return confirmDialog(defaultmsg, okFn, cancelFn, width, height);
		} else {
			return confirmDialog(errcode, okFn, cancelFn, width, height);
		}
	}
}
function confirmDelete(params, okFn, cancelFn,  width, height) {
	if(!confirmDialogBox("QS0001",params,"Do you want to delete this transaction?",okFn,cancelFn,width,height)) return false;
	return true;
}
function confirmSave(okFn, cancelFn, width, height) {
	if(!confirmDialogBox("QS0002",null,"Do you want to save this transaction?",okFn,cancelFn,width,height)) return false;
	return true;
}
function confirmCancel(okFn, cancelFn, width, height) {
	if(!confirmDialogBox("QS0003",null,"Do you want to cancel this transaction?",okFn,cancelFn,width,height)) return false;
	return true;
}
function confirmRemove(params, okFn, cancelFn,  width, height) {
	if(!confirmDialogBox("QS0005",params,"Do you want to delete this record?",okFn,cancelFn,width,height)) return false;
	return true;
}
function confirmSend(okFn, cancelFn, width, height) {
	if(!confirmDialogBox("QS0006",null,"Do you want to send this transaction?",okFn,cancelFn,width,height)) return false;
	return true;
}
function confirmUpdate(okFn, cancelFn, width, height) {
	if(!confirmDialogBox("QS0014",null,"Do you want to update this transaction?",okFn,cancelFn,width,height)) return false;
	return true;
}
function confirmClear(params, okFn, cancelFn,  width, height) {
	if(!confirmDialogBox("QS0015",params,"Do you want to clear this?",okFn,cancelFn,width,height)) return false;
	return true;
}
function confirmProcess(okFn, cancelFn, width, height) {
	if(!confirmDialogBox("QS0018",null,"Do you want to process this transaction?",okFn,cancelFn,width,height)) return false;
	return true;
}
function confirmReceive(okFn, cancelFn, width, height) {
	if(!confirmDialogBox("QS0020",null,"Do you want to receive this transaction?",okFn,cancelFn,width,height)) return false;
	return true;
}
function confirmReset(okFn, cancelFn,  width, height) {
	if(!confirmDialogBox("QS0021",null,"Do you want to reset this trasaction?",okFn,cancelFn,width,height)) return false;
	return true;
}
function confirmErase(params, okFn, cancelFn,  width, height) {
	if(!confirmDialogBox("QS0022",params,"Do you want to delete %s row(s)?",okFn,cancelFn,width,height)) return false;
	return true;
}
function confirmApprove(params, okFn, cancelFn,  width, height) {
	if(!confirmDialogBox("QS0024",params,"Do you want to confirm approve the %s request?",okFn,cancelFn,width,height)) return false;
	return true;
}
function confirmReject(params, okFn, cancelFn,  width, height) {
	if(!confirmDialogBox("QS0025",params,"Do you want to reject %s?",okFn,cancelFn,width,height)) return false;
	return true;
}
function confirmRequest(okFn, cancelFn, width, height) {
	if(!confirmDialogBox("QS0027",null,"Do you want to create this request?",okFn,cancelFn,width,height)) return false;
	return true;
}
function confirmImport(okFn, cancelFn, width, height) {
	if(!confirmDialogBox("QS0028",null,"Do you want to import this transaction?",okFn,cancelFn,width,height)) return false;
	return true;
}
function confirmExport(okFn, cancelFn, width, height) {
	if(!confirmDialogBox("QS0029",null,"Do you want to export this transaction?",okFn,cancelFn,width,height)) return false;
	return true;
}
function confirmResend(okFn, cancelFn, width, height) {
	if(!confirmDialogBox("QS0032",null,"Do you want to resend this transaction?",okFn,cancelFn,width,height)) return false;
	return true;
}
function confirmRevise(params, okFn, cancelFn,  width, height) {
	if(!confirmDialogBox("QS0033",params,"Do you want to revise the %s request?",okFn,cancelFn,width,height)) return false;
	return true;
}
function successbox(callback,params) {
	alertbox("QS0004",callback,null,params);
}
function alertbox(errcode, callback, defaultmsg, params) {
	let txt = getMessageCode(errcode, params);
	if(txt!=null && txt!="") {
		alertDialog(txt, callback);
	} else {
		if (defaultmsg) {
			alertDialog(defaultmsg, callback);
		} else {
			alertDialog(errcode, callback);
		}
	}
}
function confirmbox(errcode, okFn, cancelFn, defaultmsg, params){
	let txt = getMessageCode(errcode,params);
	if(txt!=null && txt!="") {
		return confirmDialog(txt, okFn, cancelFn);
	} else {
		if (defaultmsg) {
			return confirmDialog(defaultmsg, okFn, cancelFn);
		} else {
			return confirmDialog(errcode, okFn, cancelFn);
		}
	}
}
/* uncomment to use boot dialog */
function alertDialog(msg, callbackfn, width, height) {
	try {
		let fs_okbtn = getMessageCode("fsokbtn"); if(!fs_okbtn || (fs_okbtn=="" || fs_okbtn=="fsokbtn")) fs_okbtn = "OK";
    	bootbox.alert({
    		message: msg,
    		callback: function() {    		
    			if (callbackfn) callbackfn();
    		},
			buttons: {
				ok:  { label: fs_okbtn }
			}    		
    	}); 
        $(".bootbox > .modal-dialog").draggable();
		return;
    } catch (ex) { console.log(ex.description); }
    //alert(msg);
    if (callbackfn) callbackfn();
}
function confirmDialog(msg, okCallback, cancelCallback, width, height) {
	try {
		let fs_confirmbtn = getMessageCode("fsconfirmbtn"); if(!fs_confirmbtn || (fs_confirmbtn=="" || fs_confirmbtn=="fsconfirmbtn")) fs_confirmbtn = "OK";
		let fs_cancelbtn = getMessageCode("fscancelbtn"); if(!fs_cancelbtn || (fs_cancelbtn=="" || fs_cancelbtn=="fscancelbtn")) fs_cancelbtn = "Cancel";
    	bootbox.confirm({
			message: msg, 
			callback: function(result) {
				if(result) {
					if (okCallback) okCallback();
				} else {
					if (cancelCallback) cancelCallback();
				}
			},
			buttons: {
				confirm : { label: fs_confirmbtn },
				cancel: { label: fs_cancelbtn }
			}
    	}); 
        $(".bootbox > .modal-dialog").draggable();
		return;
    } catch (ex) { console.log(ex.description); }
}
function submitFailure(xhr, status, errorThrown) {
	stopWaiting();
	console.log(xhr.responseText);
	console.log("status = "+status+" : xhr = "+xhr.status);
	errorThrown = parseErrorThrown(xhr, status, errorThrown);
	alertbox(errorThrown, function() { 
		if(xhr.status==401) { 
			//window.open("index.jsp","_self"); 
			try {
				window.parent.reLogin();
			}catch(ex) { }
		}
	});
}
function alertmsg(errcode, fallmsg, params, callback) {
	alertbox(errcode, callback, fallmsg, params);
}
function confirmmsg(errcode, fallmsg, params, okFn, cancelFn) {
	confirmbox(errcode, okFn, cancelFn, fallmsg, params);
}
function bootAlertDialog(msg, callback, width, height) {
	try {
		let fs_okbtn = getMessageCode("fsokbtn"); if(!fs_okbtn || (fs_okbtn=="" || fs_okbtn=="fsokbtn")) fs_okbtn = "OK";
    	bootbox.alert({
    		message: msg,
    		callback: function() {    		
    			if (callback) callback();
    		},
			buttons: {
				ok:  { label: fs_okbtn, className : "btn-primary btn-base" }
			}    		
    	});
    	$(".bootbox > .modal-dialog").draggable();
		return;
    } catch (ex) { console.log(ex.description); }
    //alert(msg);
    if (callback) callback();
}
function bootConfirmDialog(msg, okCallback, cancelCallback, width, height) {
	try {
		let fs_confirmbtn = getMessageCode("fsconfirmbtn"); if(!fs_confirmbtn || (fs_confirmbtn=="" || fs_confirmbtn=="fsconfirmbtn")) fs_confirmbtn = "OK";
		let fs_cancelbtn = getMessageCode("fscancelbtn"); if(!fs_cancelbtn || (fs_cancelbtn=="" || fs_cancelbtn=="fscancelbtn")) fs_cancelbtn = "Cancel";
    	bootbox.confirm({
			message: msg, 
			callback: function(result) {
				if(result) {
					if (okCallback) okCallback();
				} else {
					if (cancelCallback) cancelCallback();
				}
			},
			buttons: {
				confirm : { label: fs_confirmbtn, className : "btn-primary btn-base" },
				cancel: { label: fs_cancelbtn, className : "btn-primary btn-base" }
			}
    	});
    	$(".bootbox > .modal-dialog").draggable();
		return;
    } catch (ex) { console.log(ex.description); }
}
function alertboot(errcode, callback, defaultmsg, params) {
	let txt = getMessageCode(errcode, params);
	if(txt!=null && txt!="") {
		bootAlertDialog(txt, callback);
	} else {
		if (defaultmsg) {
			bootAlertDialog(defaultmsg, callback);
		} else {
			bootAlertDialog(errcode, callback);
		}
	}
}
function confirmboot(errcode, okFn, cancelFn, defaultmsg, params){
	let txt = getMessageCode(errcode,params);
	if(txt!=null && txt!="") {
		return bootConfirmDialog(txt, okFn, cancelFn);
	} else {
		if (defaultmsg) {
			return bootConfirmDialog(defaultmsg, okFn, cancelFn);
		} else {
			return bootConfirmDialog(errcode, okFn, cancelFn);
		}
	}
}
function fs_beforedeactivate(src,rival) {  }
function fs_deactivate(src,rival) { }
function fs_rival_deactivate(src,rival) { }
function fs_rival_beforedeactivate(src,rival) { }
function toggleCollapseExpand(src) {
	let $src = $(src);
	if($src.is(".down")) {
		$src.removeClass("down").addClass("up");
		$src.find(".fa").removeClass("fa-chevron-circle-down").addClass("fa-chevron-circle-up");
		let $part = $src.parents("table").eq(0);
		$part.nextUntil("table.partition-table").show();
	} else {
		$src.removeClass("up").addClass("down");
		$src.find(".fa").removeClass("fa-chevron-circle-up").addClass("fa-chevron-circle-down");
		let $part = $src.parents("table").eq(0);
		$part.nextUntil("table.partition-table").hide();
	}	
}
function handleControls(fs_radiocontrols,fs_checkboxcontrols,fs_selectcontrols) {
	if(fs_radiocontrols) {
		for(let p in fs_radiocontrols) {
			$("input[name="+p+"]").change(function() { 
				let that = $(this);
				let fs_ctrls = fs_radiocontrols[that.attr("name")];
				if(fs_ctrls) {
					$(fs_ctrls).each(function(index,element) {
						if(element.value==that.val()) {
							if(element.hidden) {
								$("#"+element.control).show();
							} else {
								$("#"+element.control).attr("disabled",false); 
								$("input",$("#"+element.control)).attr("disabled",false); 
								$("select",$("#"+element.control)).attr("disabled",false); 
								$("input:checked",$("#"+element.control)).trigger("change");
								$("select:selected",$("#"+element.control)).trigger("change");
							}
						} else {
							if(element.hidden) {
								$("#"+element.control).hide();
							} else {
								$("#"+element.control).attr("disabled",true); 
								$("input",$("#"+element.control)).attr("disabled",true); 
								$("select",$("#"+element.control)).attr("disabled",true); 
								$("input:checked",$("#"+element.control)).trigger("change");
								$("select:selected",$("#"+element.control)).trigger("change");
								if(!$("#"+element.control).is(":checkbox") && !$("#"+element.control).is(":radio")) {
									$("#"+element.control).val("");
								}
							}
						}
					});
				}
			});
		}
	}
	if(fs_checkboxcontrols) {
		for(let p in fs_checkboxcontrols) {
			$("#"+p).change(function() {
				let that = $(this);
				let fs_ctrls = fs_checkboxcontrols[that.attr("id")];
				if(fs_ctrls) {
					let fs_ischecked = that.is(":checked");
					$(fs_ctrls).each(function(index,element) {
						if(fs_ischecked) {
							if(element.hidden) {
								$("#"+element.control).show();
							} else {
								$("#"+element.control).attr("disabled",false);
								$("input",$("#"+element.control)).attr("disabled",false);
								$("select",$("#"+element.control)).attr("disabled",false);
								$("input:checked",$("#"+element.control)).trigger("change");
								$("select:selected",$("#"+element.control)).trigger("change");
							}
						} else {
							if(element.hidden) {
								$("#"+element.control).hide();
							} else {
								$("#"+element.control).attr("disabled",true);
								$("input",$("#"+element.control)).attr("disabled",true);
								$("select",$("#"+element.control)).attr("disabled",true);
								$("input:checked",$("#"+element.control)).trigger("change");
								$("select:selected",$("#"+element.control)).trigger("change");
								if(!$("#"+element.control).is(":checkbox") && !$("#"+element.control).is(":radio")) {
									$("#"+element.control).val("");
								}
							}
						}
					});
				}
			});
		}
	}
	if(fs_selectcontrols) {
		for(let p in fs_selectcontrols) {
			$("select[name="+p+"]").change(function() { 
				let that = $(this);
				let fs_ctrls = fs_selectcontrols[that.attr("name")];
				if(fs_ctrls) {
					$(fs_ctrls).each(function(index,element) {
						if(element.value==that.val()) {
							if(element.hidden) {
								$("#"+element.control).show();
							} else {
								$("#"+element.control).attr("disabled",false);
								$("input",$("#"+element.control)).attr("disabled",false);
								$("select",$("#"+element.control)).attr("disabled",false);
								$("input:checked",$("#"+element.control)).trigger("change");
								$("select:selected",$("#"+element.control)).trigger("change");
							}
						} else {
							if(element.hidden) {
								$("#"+element.control).hide();
							} else {
								$("#"+element.control).attr("disabled",true);
								$("input",$("#"+element.control)).attr("disabled",true);
								$("select",$("#"+element.control)).attr("disabled",true);
								$("input:checked",$("#"+element.control)).trigger("change");
								$("select:selected",$("#"+element.control)).trigger("change");
								if(!$("#"+element.control).is(":checkbox") && !$("#"+element.control).is(":radio")) {
									$("#"+element.control).val("");
								}
							}
						}
					});
				}
			});
		}
	}
}
function initialControls(fs_radiocontrols,fs_checkboxcontrols,fs_selectcontrols) {
	if(fs_radiocontrols) {
		for(let p in fs_radiocontrols) {
			$("input[name="+p+"]").each(function(index,element) { 
				let that = $(element);
				if(that.is(":checked")) that.trigger("change");
			});
		}
	}
	if(fs_checkboxcontrols) {
		for(let p in fs_checkboxcontrols) {
			let that = $("#"+p);
			that.trigger("change");
		}
	}
	if(fs_selectcontrols) {
		for(let p in fs_selectcontrols) {
			$("select[name="+p+"]").each(function(index,element) { 
				let that = $(element);
				that.trigger("change");
			});
		}
	}
}
function startEntryPage() {
}
function hasInset(textSet,textValue,textDelimiter) {
	if(!textDelimiter) textDelimiter = ",";
	let sets = textSet.split(textDelimiter);
	for(let p in sets) { 
		if(textValue.toLowerCase()==sets[p].toLowerCase()) {
			return true;
		}
	}
	return false;
}
function toYMDDate(text) {
	let txts = text.split("/");
	return (txts.length>2?txts[2]:"")+"/"+(txts.length>1?txts[1]:"")+"/"+(txts.length>0?txts[0]:"");
}
function validNumericFields(aform) {
	let valid = true;
	$("input.iint, input.imoney",aform).each(function(index,element) { 
		let ths = $(this);
		let text = removeComma(ths.val());
		//console.log("valid number field : "+text);
		if(isNaN(text)) {
			valid = false;
			alertbox("Invalid Numeric Field: Not a Number",function() { 
				setTimeout(function() { ths.focus(); },500);	
			});
			return false;
		}
		let precision = ths.attr("precision");
		let decimal = ths.attr("decimal");
		//console.log("precision = "+precision+" : decimal = "+decimal);
		if(precision) {
			let txts = text;
			let precise = parseNumber(precision+"");
			let idx = txts.indexOf(".");
			if(idx>=0) txts = txts.substring(0,idx);
			//console.log("valid number field : precise="+precise+" : "+txts.length);
			if(precise<txts.length) {
				valid = false;
				alertbox("Invalid Numeric Field: Precision ("+precision+") or decimal"+(decimal?" ("+decimal+")":"")+" is over",function() { 
					setTimeout(function() { ths.focus(); },500);	
				});
				return false;
			}
		}
		if(decimal) {
			let txts = text;
			let scale = parseNumber(decimal+"");
			let idx = txts.indexOf(".");
			if(idx>=0) {
				txts = txts.substring(idx+1);
				//console.log("valid decimal field : scale="+scale+" : "+txts.length);
				if(scale<txts.length) {
					valid = false;
					alertbox("Invalid Numeric Field: Precision"+(precision?" ("+precision+")":"")+" or decimal ("+decimal+") is over",function() { 
						setTimeout(function() { ths.focus(); },500);	
					});
					return false;
				}
			}
		}
	});
	return valid;
}
function assignControlValue(control,value) {
	let controlbox = false;
	let input = $("input[name="+control+"]");
	if(input.length>0) {
		$(input).each(function(index,element) { 
			let $e = $(element);
			if($e.is(":checkbox") || $e.is(":radio")) { 
				if($e.val()==value) {
					$e.attr("checked",true);
				}
				controlbox = true; 
			}
		});
	}
	if(!controlbox) {
		let ctrl = $("#"+control);
		ctrl.val(value);
		if(ctrl.is("select") && ctrl.is("[readonly]")) {
			$("option:selected",ctrl).attr("disabled",false);
			$("option:not(:selected)",ctrl).attr("disabled",true);
		} else if(ctrl.is("label")) {
			ctrl.html(value);
		}
	}
}
function validCompletedFields(fs_completedfields) {
	for(let p in fs_completedfields) {
		let spec = fs_completedfields[p];
		let input = $("input[name="+p+"]");
		let valid = false;
		if(input.length>1) {
			$(input).each(function(index,element) { 
				let $e = $(element);
				if($e.is(":checked")) { valid = true; return false; }
			});
			input = input.eq(0);
		} else {
			input = $("#"+p);
			if(input.is(":checkbox")) {
				valid = input.is(":checked");
			} else {
				valid = $.trim(input.val())!="";
			}
		}
		if(!valid) {
			alertbox("Field Uncompleted: "+spec.msg,function() { 
				setTimeout(function() { input.focus(); },500);	
			});
			return false;
		}
	}
	return true;
}
function controlFontSize(fs_fontSize) {
	$("input:not(:button)").css("font-size",fs_fontSize);
	$("select").css("font-size",fs_fontSize);
}
function increaseFontSize() {
	fs_fontSize++;
	controlFontSize(fs_fontSize);
	$.cookie("fsfontsize",fs_fontSize);
}
function decreaseFontSize() {
	fs_fontSize--;
	controlFontSize(fs_fontSize);
	$.cookie("fsfontsize",fs_fontSize);
}
function setupAlertComponents(container) {
	$(".alert-input",container||this.document).focus(function() {
		let ths = $(this);
		ths.removeClass("is-invalid");
		let thisId = ths.attr("id");
		$("#"+thisId).parent().removeClass("has-error");
		$("#"+thisId+"_cover").removeClass("has-error");
		$("#"+thisId+"_alert").hide();
	}).blur(function() { 
		let ths = $(this);
		ths.removeClass("is-invalid");
		let thisId = ths.attr("id");
		if($.trim(ths.val())=="") {
			$("#"+thisId+"_alert").show();
		}
		$("#"+thisId+"_error").hide();
		let ctrl = ths.attr("control");
		if(ctrl) $(ctrl).hide();
	});
}
function clearAlerts() {
	$(".alert-input").each(function(index,element) {
		let ths = $(this);
		let thisId = ths.attr("id");
		ths.removeClass("is-invalid");
		$("#"+thisId).parent().removeClass("has-error");
		$("#"+thisId+"_cover").removeClass("has-error");
		$("#"+thisId+"_alert").hide();
		let ctrl = ths.attr("control");
		if(ctrl) $(ctrl).hide();
	});
}
function validRequiredFields(callback,fs_requiredfields,hassomefields) {
	clearAlerts();
	let validationflag = false;
	let validator = null;
	for(let p in fs_requiredfields) {
		let valid = false;
		let input = $("#"+p);
		if(input.is(":checkbox")) {
			valid = input.is(":checked");
		} else {
			valid = $.trim(input.val())!="";
		}
		if(!valid) {
			input.addClass("is-invalid");
			input.parent().addClass("has-error");
			$("#"+p+"_alert").show();
			if(!validator) validator = p;
		} else {
			validationflag = true;
		}
	}
	if(hassomefields && validationflag) {
		clearAlerts();
		if(callback) callback();
		return true;		
	} else {
		if(validator) {
			$("#"+validator).focus();
			setTimeout(function() { 
				$("#"+validator).addClass("is-invalid");
				$("#"+validator).parent().addClass("has-error");
				$("#"+validator+"_alert").show();
			},100);
			return false;
		}	
		if(callback) callback();
		return true;
	}
}
function disableControls() {
	$(arguments).each(function(index,element) { 
		let $src = $(element);
		$src.attr("disabled",true);
		setTimeout(function() { 
			$src.removeAttr("disabled"); 
		},1000);		
	});
}

const fsmadatoryfields = ["ajax","datatype","rowsPerPage","limit","page","orderBy","orderDir","offset","action"];
function isMadatoryField(fieldName) {
	let found = false;
	$(fsmadatoryfields).each(function(index,element) {
		if(element==fieldName) {
			found = true;
			return false;
		}
	})
	return found;
}
function createParameters(aform) {
	let result = [];
	if(!aform) return result;
	let ary = $(aform).serializeArray();
	$(ary).each(function(index,element) { 
		if(!isMadatoryField(element.name)) {
			result.push(element);
		}
	});
	return result;
}
function fetchParameters(storeData) {
	if(!storeData) return "";
	let result = $.param(storeData);
	return result && result!=""?"&"+result:"";
}
function createMandatoryParameters(aform) {
	let result = [];
	if(!aform) return result;
	let ary = $(aform).serializeArray();
	$(ary).each(function(index,element) { 
		if(isMadatoryField(element.name)) {
			result.push(element);
		}
	});
	return result;
}
function getStorage(key) {
    return sessionStorage.getItem(key);
    //return localStorage.getItem(key);
}
function setStorage(key,value) {
    sessionStorage.setItem(key,value);
    //localStorage.setItem(key,value);
}
function removeStorage(key) {
    sessionStorage.removeItem(key);
    //localStorage.removeItem(key);
}
function getAccessorInfo() {
    let info = getStorage("accessorinfo");
    if(info && info!="") {
        return $.parseJSON(info);
    }    
    return null;
}
function getAccessorToken() {
    let json = getAccessorInfo();
    if(json && json.authtoken) {
        return json.authtoken;
    }
	if(API_TOKEN && API_TOKEN!="") return API_TOKEN;
    return "";
}
function saveAccessorInfo(json) {
	setStorage("accessorinfo",JSON.stringify(json));
}
function removeAccessorInfo() {
	removeStorage("accessorinfo");
}
function setupDiffie(json) {
	console.log("setupDiffie",this.getAccessorToken());
    let info = json.body.info;
    if(info) {
        const dh = new DH();
        dh.prime = info.prime;
        dh.generator = info.generator;
        dh.otherPublicKey = info.publickey;
        dh.compute();
        dh.updatePublicKey();
        info.privatekey = dh.privateKey;
        info.publickey = dh.publicKey;
        info.sharedkey = dh.sharedKey;
        info.otherpublickey = dh.otherPublicKey;
        saveAccessorInfo(json.body);
    }
}
function getDH() {
    let json = getAccessorInfo();
    if(json && json.info) {
        let info = json.info;
        if(info.prime && info.generator && info.publickey && info.privatekey && info.sharedkey && info.otherpublickey) {
            const dh = new DH();
            dh.prime = info.prime;
            dh.generator = info.generator;
            dh.otherPublicKey = info.publickey;
            dh.privateKey = info.privatekey;
            dh.publicKey = info.publickey;
            dh.sharedKey = info.sharedkey;
            dh.otherPublicKey = info.otherpublickey;
            return dh;
        }
    }
    return null;
}
function sendMessageInterface() {
	let info = getAccessorInfo();
	let msg = {type: "storage", API_URL: API_URL, BASE_URL: BASE_URL, API_TOKEN: API_TOKEN, accessorinfo: info};
	sendMessageToFrame(msg);
}
function sendMessageToFrame(data) {
    if(!data) return;
    try {
		console.log("sendMessageToFrame:",data);
        let win = document.getElementsByTagName('iframe')[0].contentWindow;    
        win.postMessage(JSON.stringify(data), "*");	
    } catch(ex) { console.log(ex); }
}
function serializeToJSON(aform) {
    let json = {};
	if(aform) {
		let formarray = Array.isArray(aform) ? aform : $(aform).serializeArray();
		formarray.forEach(function(element, index) {
			let name = element['name'];
			if(json.hasOwnProperty(name)) {
				let arr = json[name];
				if(Array.isArray(arr)) {
					arr.push(element['value']);
				} else {
					json[name] = [arr, element['value']];
				}
			} else {
				json[name] = element['value']; 
			}
		});
	}
    return json;
}
function serializeDataForm(aform, addonForm, raw) {
	return serializeParameters(serializeToJSON(aform),serializeToJSON(addonForm),raw);
}
function serializeParameters(parameters, addonParameters, raw) {
	if(addonParameters) {
		Object.assign(parameters,addonParameters);
	}
	let jsondata = { };
	let cipherdata = false;
	if(raw || fs_default_raw_parameters) {
		jsondata = parameters;
	} else {
		let dh = getDH();
		if(dh) {
			cipherdata = true;
			jsondata.ciphertext = dh.encrypt(JSON.stringify(parameters));
		} else {
			jsondata = parameters;
		}
	}
	console.log("serialize: parameters",parameters);
	console.log("serialize: jsondata",jsondata);
	return { cipherdata: cipherdata, jsondata: jsondata, headers : { "data-type": cipherdata?"json/cipher":"", language: fs_default_language } };
}
function decryptCipherData(headers, data) {
	let accepttype = headers["accept-type"];
	let dh = getDH();
	if(accepttype=="json/cipher") {
		let json = $.parseJSON(data);
		if(dh && json.body.data && typeof json.body.data === "string") {
			let jsondatatext = dh.decrypt(json.body.data);
			console.log("jsondatatext",jsondatatext);
			let jsondata = $.parseJSON(jsondatatext);
			json.body = jsondata;
			return json;
		}
	}
	if(accepttype=="text/cipher") {
		let jsontext = dh.decrypt(data);
		console.log("jsontext",jsontext);
		if(jsontext) {
			let json = $.parseJSON(jsontext);
			return json;
		}
	}
	return data;
}