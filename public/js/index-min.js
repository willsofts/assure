var mouseX=0;var mouseY=0;var $currPage="";var $ACCESS_TOKEN;function validInputUser(){if($.trim($("#main_username").val())==""){alertbox("User is undefined");return false}return true}function connectServer(){if(!validInputUser()){return}logIn()}function disConnectServer(){logOut()}function logIn(){startWaiting();let params={};let main_fields={main_username:"username",main_pass:"password",main_state:"state",main_nonce:"nonce"};for(let field in main_fields){params[main_fields[field]]=$("#"+field).val()}console.log("params",params);jQuery.ajax({url:API_URL+"/api/sign/signin",type:"POST",contentType:defaultContentType,data:params,dataType:"html",error:function(c,a,b){stopWaiting();b=parseErrorThrown(c,a,b);alertbox(b)},success:function(b,a,c){console.log("success : "+c.responseText);stopWaiting();loginSuccess(b)}})}function loginSuccess(a){console.log("login success : "+a);let unloadFirstPage=false;let json=$.parseJSON(a);if(json.head.errorflag=="Y"){alertbox(json.head.errordesc)}else{showUserDetail(json);saveAccessorInfo(json.body);setupDiffie(json);console.log("body",json.body);verifyAfterLogin(json,unloadFirstPage)}}function showUserDetail(a){$("#main_useruuid").val(a.body.useruuid);$("#main_user").val(a.body.userid);let userdetail=a.body.name+" "+a.body.surname;$("#accessor_label").html(userdetail);$("#accessor_label").data("NEW",a.body.newflag);$("#lastdate_label").html(a.body.accessdate+" "+a.body.accesstime);$("#last_access_label").html(" "+a.body.accessdate+" "+a.body.accesstime);$("#userchangeitem").show();if(a.body.activeflag=="1"||a.body.activeflag=="true"){$("#userchangeitem").hide()}}function verifyAfterLogin(c,b,a){$("#fsworkinglayer").addClass("working-control-class");if(c.body.factorverify&&c.body.factorid!=""&&(c.body.factorcode==undefined||c.body.factorcode=="")){$("#fsworkinglayer").removeClass("working-control-class");open_page("factor",null,"factorid="+c.body.factorid)}else{if(c.body.changeflag&&c.body.changeflag=="1"){$("#fsworkinglayer").removeClass("working-control-class");open_page("page_change",null,"changed=force")}else{if(c.body.expireflag&&c.body.expireflag=="1"){$("#fsworkinglayer").removeClass("working-control-class");open_page("page_change",null,"changed=expire")}else{doAfterLogin(c,b,a)}}}}function doAfterLogin(c,b,a){if(c){a=c.body.firstpage}startWorking(b,a);refreshScreen();if(c){showBackground(c.body.background);let avatar=c.body.avatar;if(avatar&&avatar!=""){$("#avatarimage").attr("src",avatar)}}}function startWorking(b,a){$("#navigatebar").removeClass("fa-hidden");$("#page_login").hide();createMenu();startupPage(b,a)}function createMenu(){$("#sidebarmenu").show();$("#homelayer").show();$("#mainmenu").show();$("#usermenuitem").show();$("#favormenuitem").show();$("#loginlayer").hide();$("#languagemenuitem").removeClass("language-menu-item")}function startupPage(b,a){if(!b){load_page_first()}load_sidebar_menu(a);load_favor_menu();load_prog_item();$("#languagemenuitem").show();$("#fsworkinglayer").addClass("working-control-class")}function load_page_first(){load_page("page_first",null,function(){$("#page_first").find("a.fa-link-app").each(function(a,b){$(b).click(function(){let pid=$(this).attr("data-pid");let url=$(this).attr("data-url");open_page(pid,url)})})})}function hideMenu(){$("#page_first").hide()}function fs_changingPlaceholder(a){if(!a){return}let u_placeholder=fs_getLabelName("login_user_placeholder","index",a);let p_placeholder=fs_getLabelName("login_pass_placeholder","index",a);if(u_placeholder){$("#main_username").attr("placeholder",u_placeholder);$("#loginframe").contents().find("#main_username").attr("placeholder",u_placeholder)}if(p_placeholder){$("#main_pass").attr("placeholder",p_placeholder);$("#loginframe").contents().find("#main_pass").attr("placeholder",p_placeholder)}let last_label=fs_getLabelName("lastaccess_label","index",a);if(last_label){$("#lastaccess_label").html(last_label)}let log_label=fs_getLabelName("logout_label","index",a);if(log_label){$("#logingout_label").html(log_label);$("#logout_label").html(" "+log_label)}let changepwd_label=fs_getLabelName("changepwd_label","index",a);if(changepwd_label){$("#changepwd_label").html(" "+changepwd_label)}let profile_label=fs_getLabelName("profile_label","index",a);if(profile_label){$("#profile_label").html(" "+profile_label)}let signin_label=fs_getLabelName("signin_label","index",a);if(signin_label){$("#loginmenutrigger").html(signin_label)}console.log("lang = "+a+" : "+log_label);let login_header_label=fs_getLabelName("login_label","index",a);if(login_header_label){$("#loginframe").contents().find("#login_label").html(login_header_label)}let login_button_label=fs_getLabelName("login_button","index",a);if(login_button_label){$("#loginframe").contents().find("#login_button").val(login_button_label)}let eng_label=fs_getLabelName("englishlanguage","index",a);let thi_label=fs_getLabelName("thailanguage","index",a);if(eng_label){$("#englishlanguage").html(eng_label)}if(thi_label){$("#thailanguage").html(thi_label)}}function goHome(){load_page_first();$("#languagemenuitem").show();hideWorkSpace()}function forceLogout(){let useruuid=$("#main_useruuid").val();let authtoken=getAccessorToken();console.log("useruuid="+useruuid+", authtoken="+authtoken);$.ajax({url:API_URL+"/api/sign/signout",data:{useruuid:useruuid},headers:{authtoken:authtoken},type:"POST"})}function profileClick(){open_page("page_profile",null,"userid="+$("#main_user").val())}function changeClick(){open_page("page_change")}function forgotClick(){hideLoginForm();$("#fsworkinglayer").removeClass("working-control-class");open_page("page_forgot")}function logOut(){forceLogout();doLogout();try{doSSOLogout();return}catch(a){console.error(a)}window.open("/index","_self")}function doLogout(){try{removeAccessorInfo()}catch(a){}try{closeMenuBar()}catch(a){}doLogin();clearBackground();clearAvatar()}function clearAvatar(){$("#avatarimage").attr("src",CDN_URL+"/img/avatar.png")}function clearBackground(){$("body").css("background-image","none")}function showBackground(a){if(!a){return}if($.trim(a)!=""){$("body").attr("style","background-image: url(/img/background/"+a+");")}}function logInClick(){hideWorkingFrame();$("#page_login").show();try{main_form.reset()}catch(a){}$("#main_useruuid").val("");displayLogin()}function doLogin(){$("#pagecontainer").empty();$("#mainmenu").hide();if($currPage==""){$currPage=$("#page_first")}if($currPage){$currPage.removeClass("pt-page-current pt-page-moveFromRight pt-page-moveFromLeft")}logInClick();hideWorkSpace();$("#sidebarmenu").hide();$("#sidebarlayer").empty();$("#homelayer").hide();$("#mainmenu").hide();$("#usermenuitem").hide();$("#favormenuitem").hide();$("#favorbarmenu").empty();$("#languagemenuitem").addClass("language-menu-item").show();$("#recentmenulist").empty();$("#recentcaret").hide();$("#loginlayer").show();hideNewFavorItem()}function load_sidebar_menu(a,b){let fs_user=$("#main_user").val();if(!b){b=fs_default_language}let authtoken=getAccessorToken();jQuery.ajax({url:API_URL+"/api/menuside/html",data:{userid:fs_user,language:b},headers:{authtoken:authtoken},type:"POST",dataType:"html",contentType:defaultContentType,success:function(c){$("#sidebarlayer").html(c);bindingOnSideBarMenu();if(a&&a!=""){open_page(a)}else{let isz=$("a[data-item=worklist]",$("#sidebarlayer")).length;if(isz>0){open_page("worklist")}}}})}function load_favor_menu(a){let fs_user=$("#main_user").val();if(!a){a=fs_default_language}let authtoken=getAccessorToken();jQuery.ajax({url:API_URL+"/api/menufavor/html",data:{userid:fs_user,language:a},headers:{authtoken:authtoken},type:"POST",dataType:"html",contentType:defaultContentType,success:function(b){$("#favorbarmenu").html(b);bindingOnFavorMenu()}})}function fs_changingLanguage(b){console.log("changing language = "+b);try{fs_changingPlaceholder(b);if(fs_currentpid&&fs_currentpid!="index"){fs_switchingLanguage(b,"index")}}catch(a){}let fs_name=$("#accessor_label").data(b);if(fs_name){$("#accessor_label").html(fs_name)}load_sidebar_menu(null,b)}function refreshScreen(){$(window).trigger("resize")}function getTargetFrameName(){return"workingframe"}function hideLoginForm(){$("#page_login").hide()}function showWorkingFrame(){$("#pagecontainer").hide();$("#workingframe").show()}function hideWorkingFrame(){$("#navigatebar").addClass("fa-hidden");$("#pagecontainer").hide();hideWorkSpace()}function hideWorkSpace(){$("#workingframe").hide();window.open(BASE_URL+"/blank.html","workingframe")}function takeSwitchLanguage(a){if(a&&a!=""){$("#linklang"+a.toLowerCase()).trigger("click")}}function displayLogin(){removeAccessorInfo();$("#main_username").focus()}function validAccessToken(a){let json=getAccessorInfo();if(json&&json.authtoken){doAccessToken(json.authtoken,a,json.info);return}if(a){a(false)}}function doAccessToken(a,c,b){if(a&&a!=""){jQuery.ajax({url:API_URL+"/api/sign/accesstoken",headers:{authtoken:a},type:"POST",contentType:defaultContentType,dataType:"html",error:function(f,d,e){if(c){c(false)}},success:function(e,d,f){accessSuccess(e,c,b)}});return}if(c){c(false)}}function accessSuccess(b,d,c){console.log("access token success : "+b);try{let json=$.parseJSON(b);if(json&&json.head.errorflag=="N"){showUserDetail(json);if(c){json.body.info=c}console.log("body",json.body);saveAccessorInfo(json.body);let accessToken=getStorage("access_token");if(accessToken){setupDiffie(json)}removeStorage("access_token");if(d){d(true,json)}return}}catch(a){console.error(a)}if(d){d(false)}}function setupComponents(){$("#homemenutrigger").click(function(){goHome()});$("#accessor_profile_link").click(function(){profileClick()});$("#accessor_change_link").click(function(){changeClick()});$("#accessor_logout_link").click(function(){logOut()});$("#linklangen").click(function(){let img=$("#linklangen").attr("data-image");$("#languageimage").attr("src",img+"/img/lang/EN.png");fs_switchLanguage("EN",true)});$("#linklangth").click(function(){let img=$("#linklangth").attr("data-image");$("#languageimage").attr("src",img+"/img/lang/TH.png");fs_switchLanguage("TH",true)});$("#forgot_password").click(function(){forgotClick()});$("#main_button").click(function(){connectServer()});$("#ssologinlayer").find("a.fa-link-sso-saml").each(function(a,b){$(b).click(function(){let domainid=$(this).attr("data-domain");window.open("/auth/signin/"+domainid,"_self")})});$("#ssologinlayer").find("a.fa-link-sso-biz").each(function(a,b){$(b).click(function(){let domainid=$(this).attr("data-domain");startSSO(domainid)})});$("#workingframe").on("load",function(){try{stopWaiting()}catch(a){}})}var fs_workingframe_offset=30;$(function(){$(this).mousedown(function(b){mouseX=b.pageX;mouseY=b.pageY});try{startApplication("index",true)}catch(a){}setupComponents();$("#main_pass").on("keydown",function(b){if(b.which==13){connectServer()}});$("#main_code").on("keydown",function(b){if(b.which==13){connectServer()}});$(window).resize(function(){let wh=$(window).height();let nh=0;if($("#navigatebar").is(":visible")){nh=$("#navigatebar").height()}let fh=0;if($("#footerbar").is(":visible")){fh=$("#footerbar").height()}$("#workingframe").height((wh-nh-fh)-fs_workingframe_offset)}).trigger("resize");let pos=$("#loginframe").position();if(pos){mouseX=pos.left;mouseY=pos.top}validAccessToken(function(c,b){console.log("valid = "+c+", json : "+b);if(!c){displayLogin()}else{sendMessageInterface(b.body);verifyAfterLogin(b)}})});window.onmessage=function(b){console.log("main: onmessage:",b.data);try{let payload=JSON.parse(b.data);if(payload.type=="accessorinfo"){sendMessageInterface()}}catch(a){}};