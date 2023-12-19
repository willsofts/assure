		var mouseX = 0;
		var mouseY = 0;
		var $currPage = "";
		var $ACCESS_TOKEN;
		function validInputUser() {
			if($.trim($("#main_username").val())=="") { alertbox("User is undefined"); return false; }
			return true;
		}
		function connectServer() {	
			if(!validInputUser()) return;
			logIn();
		}
		function disConnectServer(){
			logOut();
		}
		function logIn(){
			startWaiting();
			let params = {};
			let main_fields = {"main_username":"username", "main_pass":"password", "main_state":"state", "main_nonce":"nonce"};
			for(let field in main_fields) {				
				params[main_fields[field]] = $("#"+field).val();
			}
			console.log("params",params);
			jQuery.ajax({
				url: API_URL+"/api/sign/signin",
				type: "POST",
				contentType: defaultContentType,
				data: params, 
				dataType: "html",
				error : function(transport,status,errorThrown) { 
					stopWaiting();
					errorThrown = parseErrorThrown(transport, status, errorThrown);
					alertbox(errorThrown);
				},
				success: function(data,status,xhr){ 
					console.log("success : "+xhr.responseText);
					stopWaiting();
					loginSuccess(data);
				}
			});			
		}
		function loginSuccess(data) {
			console.log("login success : "+data);
			let unloadFirstPage = false;
			let json = $.parseJSON(data);
			if(json.head.errorflag=="Y") {
				alertbox(json.head.errordesc);
			} else {
				showUserDetail(json);
				saveAccessorInfo(json.body);
				setupDiffie(json);
				console.log("body",json.body);
				verifyAfterLogin(json,unloadFirstPage);
			}			
		}
		function showUserDetail(json) {
			$("#main_useruuid").val(json.body.useruuid);
			$("#main_user").val(json.body.userid);
			let userdetail = json.body.name+" "+json.body.surname;
			$("#accessor_label").html(userdetail);
			$("#accessor_label").data("NEW",json.body.newflag);
			$("#lastdate_label").html(json.body.accessdate+" "+json.body.accesstime);
			$("#last_access_label").html(" "+json.body.accessdate+" "+json.body.accesstime);
			$("#userchangeitem").show();
			if(json.body.activeflag=="1" || json.body.activeflag=="true") {
				$("#userchangeitem").hide();
			}
		}		
		function verifyAfterLogin(json,unloadFirstPage,firstpage) {
			$("#fsworkinglayer").addClass("working-control-class");
			if(json.body.factorverify && json.body.factorid!="" && (json.body.factorcode==undefined || json.body.factorcode=="")) {
				$("#fsworkinglayer").removeClass("working-control-class");
				open_page("factor",null,"factorid="+json.body.factorid);			
			} else {
				if(json.body.changeflag && json.body.changeflag=="1") {
					$("#fsworkinglayer").removeClass("working-control-class");
					open_page("page_change",null,"changed=force");
				} else if(json.body.expireflag && json.body.expireflag=="1") {
					$("#fsworkinglayer").removeClass("working-control-class");
					open_page("page_change",null,"changed=expire");
				} else {
					doAfterLogin(json,unloadFirstPage,firstpage);
				}
			}
		}
		function doAfterLogin(json,unloadFirstPage,firstpage) {
			if(json) firstpage = json.body.firstpage;
			startWorking(unloadFirstPage,firstpage);
			refreshScreen();
			if(json) {
				showBackground(json.body.background);
				let avatar = json.body.avatar;
				if(avatar && avatar!="") {
					$("#avatarimage").attr("src",avatar);
				}
			}
		}
		function startWorking(unloadFirstPage,firstpage) {
			$("#navigatebar").removeClass("fa-hidden");
			$('#page_login').hide();
			createMenu(); 
			startupPage(unloadFirstPage,firstpage); 
		}
		function createMenu(){
			$("#sidebarmenu").show();
			$("#homelayer").show();
			$("#mainmenu").show();
			$("#usermenuitem").show();
			$("#favormenuitem").show();
			$("#loginlayer").hide();
			$("#languagemenuitem").removeClass("language-menu-item");
		}
		function startupPage(unloadFirstPage,firstpage){
			if(!unloadFirstPage) {
				load_page_first();
			}
			load_sidebar_menu(firstpage);
			load_favor_menu();
			load_prog_item();
			$("#languagemenuitem").show();
			$("#fsworkinglayer").addClass("working-control-class");
		}
		function load_page_first() {
			load_page("page_first",null,function() { 
				$("#page_first").find("a.fa-link-app").each(function(index,element) {
					$(element).click(function() {
						let pid = $(this).attr("data-pid");
						let url = $(this).attr("data-url");
						open_page(pid,url);
					});
				});
			}); //menu/box
		}
		function hideMenu() {
			$("#page_first").hide();
		}
		function fs_changingPlaceholder(lang) {
			if(!lang) return;
			let u_placeholder = fs_getLabelName("login_user_placeholder","index",lang);
			let p_placeholder = fs_getLabelName("login_pass_placeholder","index",lang);
			if(u_placeholder) {
				$("#main_username").attr("placeholder",u_placeholder);
				$("#loginframe").contents().find("#main_username").attr("placeholder",u_placeholder);
			}
			if(p_placeholder) {
				$("#main_pass").attr("placeholder",p_placeholder);
				$("#loginframe").contents().find("#main_pass").attr("placeholder",p_placeholder);
			}
			let last_label = fs_getLabelName("lastaccess_label","index",lang);
			if(last_label) $("#lastaccess_label").html(last_label);
			let log_label = fs_getLabelName("logout_label","index",lang);
			if(log_label) {
				$("#logingout_label").html(log_label);
				$("#logout_label").html(" "+log_label);
			}
			let changepwd_label = fs_getLabelName("changepwd_label","index",lang);
			if(changepwd_label) $("#changepwd_label").html(" "+changepwd_label);
			let profile_label = fs_getLabelName("profile_label","index",lang);
			if(profile_label) $("#profile_label").html(" "+profile_label);
			let signin_label = fs_getLabelName("signin_label","index",lang);
			if(signin_label) $("#loginmenutrigger").html(signin_label);
			console.log("lang = "+lang+" : "+log_label);
			let login_header_label = fs_getLabelName("login_label","index",lang); 
			if(login_header_label) {
				$("#loginframe").contents().find("#login_label").html(login_header_label);
			}
			let login_button_label = fs_getLabelName("login_button","index",lang); 
			if(login_button_label) {
				$("#loginframe").contents().find("#login_button").val(login_button_label);
			}
			let eng_label = fs_getLabelName("englishlanguage","index",lang);
			let thi_label = fs_getLabelName("thailanguage","index",lang);
			if(eng_label) $("#englishlanguage").html(eng_label);
			if(thi_label) $("#thailanguage").html(thi_label);
		}
		function goHome() {
			load_page_first();
			$("#languagemenuitem").show();
			hideWorkSpace();
		}
		function forceLogout() {
			let useruuid = $("#main_useruuid").val();
			let authtoken = getAccessorToken();
			console.log("useruuid="+useruuid+", authtoken="+authtoken);
			$.ajax({ url : API_URL+"/api/sign/signout", data: { useruuid: useruuid }, headers : { "authtoken": authtoken }, type : "POST" });
		}
		function profileClick() {
			open_page("page_profile",null,"userid="+$("#main_user").val());
		}
		function changeClick() {
			open_page("page_change");
		}
		function forgotClick() {
			hideLoginForm();
			$("#fsworkinglayer").removeClass("working-control-class");
			open_page("page_forgot");
		}		
		function logOut() {
			forceLogout();
			doLogout();
			try { doSSOLogout(); return; } catch(ex) { console.error(ex); }
			window.open("/index","_self");
		}
		function doLogout() {
			try { removeAccessorInfo(); } catch(ex) { }
			try { closeMenuBar(); }catch(ex) { }
			doLogin();
			clearBackground();
			clearAvatar();
		}
		function clearAvatar() {
			$("#avatarimage").attr("src",CDN_URL+"/img/avatar.png");
		}
		function clearBackground() {
			$("body").css("background-image","none");
		}
		function showBackground(bgfile) {
			if(!bgfile) return;
			if($.trim(bgfile)!="") {
				$("body").attr("style","background-image: url(/img/background/"+bgfile+");");
			}
		}		
		function logInClick() {
			hideWorkingFrame();
			$("#page_login").show();
			try {
				main_form.reset();
			}catch(ex) { }
			$("#main_useruuid").val("");
			displayLogin();
		}
		function doLogin() {
			$("#pagecontainer").empty();
			$("#mainmenu").hide();
			if($currPage=="") $currPage = $("#page_first");
			if($currPage) {
				$currPage.removeClass('pt-page-current pt-page-moveFromRight pt-page-moveFromLeft');	
			}
			logInClick();
			hideWorkSpace();
			$("#sidebarmenu").hide();
			$("#sidebarlayer").empty();
			$("#homelayer").hide();
			$("#mainmenu").hide();
			$("#usermenuitem").hide();
			$("#favormenuitem").hide();
			$("#favorbarmenu").empty();
			$("#languagemenuitem").addClass("language-menu-item").show();
			$("#recentmenulist").empty();
			$("#recentcaret").hide();
			$("#loginlayer").show();
			hideNewFavorItem();
		}		
		function load_sidebar_menu(firstpage,language) {
			let fs_user = $("#main_user").val();
			//if($.trim(fs_user)=="") return;
			if(!language) language = fs_default_language;
			let authtoken = getAccessorToken();
			jQuery.ajax({
				url: API_URL+"/api/menuside/html",
				data: { userid: fs_user, language: language },
				headers : { "authtoken": authtoken },
				type: "POST",
				dataType: "html",
				contentType: defaultContentType,
				success: function(data){ 
					$("#sidebarlayer").html(data); 
					bindingOnSideBarMenu(); 
					if(firstpage && firstpage!="") {
						open_page(firstpage);
					} else {
						//try to auto launch work list page
						let isz = $("a[data-item=worklist]",$("#sidebarlayer")).length;
						if(isz>0) {
							open_page("worklist");
						}
					}
				}
			});
		}
		function load_favor_menu(language) {
			let fs_user = $("#main_user").val();
			//if($.trim(fs_user)=="") return;
			if(!language) language = fs_default_language;
			let authtoken = getAccessorToken();
			jQuery.ajax({
				url: API_URL+"/api/menufavor/html",
				data: { userid: fs_user, language: language },
				headers : { "authtoken": authtoken },
				type: "POST",
				dataType: "html",
				contentType: defaultContentType,
				success: function(data){ 
					$("#favorbarmenu").html(data); 
					bindingOnFavorMenu(); 
				}
			});
		}
		function fs_changingLanguage(fs_Language) {
			console.log("changing language = "+fs_Language);
			try{
				fs_changingPlaceholder(fs_Language);
				if(fs_currentpid && fs_currentpid!="index") {
					fs_switchingLanguage(fs_Language,"index");
				}
			}catch(ex) { }
			let fs_name = $("#accessor_label").data(fs_Language);
			if(fs_name) $("#accessor_label").html(fs_name);
			load_sidebar_menu(null,fs_Language);
		}
		function refreshScreen() {
			$(window).trigger("resize");
		}
		function getTargetFrameName() { return "workingframe"; }
		function hideLoginForm() {
			$("#page_login").hide();
		}
		function showWorkingFrame() {
			$("#pagecontainer").hide();
			$("#workingframe").show();
		}
		function hideWorkingFrame() {
			$("#navigatebar").addClass("fa-hidden");
			$("#pagecontainer").hide();
			hideWorkSpace();
		}
		function hideWorkSpace() {
			$("#workingframe").hide();
			window.open(BASE_URL+"/blank.html","workingframe");
		}
		function takeSwitchLanguage(lang) {
			if(lang && lang!="") {
				$("#linklang"+lang.toLowerCase()).trigger("click");
			}
		}
		function displayLogin() {
			removeAccessorInfo();
			$("#main_username").focus();
		}
		function validAccessToken(callback) {
			let json = getAccessorInfo();
			if(json && json.authtoken) {
				doAccessToken(json.authtoken,callback,json.info);
				return;
			}
			if(callback) callback(false);
		}
		function doAccessToken(token,callback,info) {
			if(token && token!="") {
				jQuery.ajax({
					url: API_URL+"/api/sign/accesstoken",
					headers : { "authtoken": token },
					type: "POST",
					contentType: defaultContentType,
					dataType: "html",
					error : function(transport,status,errorThrown) {
						if(callback) callback(false); 
					},
					success: function(data,status,xhr){ 
						accessSuccess(data,callback,info);
					}
				});	
				return;
			}		
			if(callback) callback(false); 
		}
		function accessSuccess(data,callback,info) {
			console.log("access token success : "+data);
			try {
				let json = $.parseJSON(data);
				if(json && json.head.errorflag=="N") {
					showUserDetail(json);
					if(info) json.body.info = info;
					console.log("body",json.body);
					saveAccessorInfo(json.body);
					let accessToken = getStorage("access_token");
					if(accessToken) setupDiffie(json);
					removeStorage("access_token");
					if(callback) callback(true,json); 
					return;
				}
			} catch(ex) { 
				console.error(ex);
			}
			if(callback) callback(false); 
		}	
		function setupComponents() {
			$("#homemenutrigger").click(function() { goHome(); });
			$("#accessor_profile_link").click(function() { profileClick(); });
			$("#accessor_change_link").click(function() { changeClick(); });
			$("#accessor_logout_link").click(function() { logOut(); });
			$("#linklangen").click(function() { 
				let img = $("#linklangen").attr("data-image");
				$('#languageimage').attr('src',img); fs_switchLanguage('EN',true);
			});
			$("#linklangth").click(function() { 
				let img = $("#linklangth").attr("data-image");
				$('#languageimage').attr('src',img); fs_switchLanguage('TH',true);
			});
			$("#forgot_password").click(function() { forgotClick(); });
			$("#main_button").click(function() { connectServer(); });
			$("#ssologinlayer").find("a.fa-link-sso-saml").each(function(index,element) {
				$(element).click(function() {
					let domainid = $(this).attr("data-domain");
					window.open('/auth/signin/'+domainid,'_self');
				});
			});
			$("#ssologinlayer").find("a.fa-link-sso-biz").each(function(index,element) {
				$(element).click(function() {
					let domainid = $(this).attr("data-domain");
					startSSO(domainid);
				});
			});
			$("#workingframe").on("load",function() { try{stopWaiting();}catch(ex){} });
		}
		var fs_workingframe_offset = 30;
		$(function(){
			$(this).mousedown(function(e) { mouseX = e.pageX; mouseY = e.pageY; });
			try { startApplication("index",true); }catch(ex) { }
			setupComponents();
			//ignore force logout coz it was invalidate when refresh
			//try { $(window).bind("unload",forceLogout); }catch(ex) { }
			$("#main_pass").on("keydown", function (e) {
				if(e.which==13) { connectServer(); }
			});
			$("#main_code").on("keydown", function (e) {
				if(e.which==13) { connectServer(); }
			});
			$(window).resize(function() { 
					let wh = $(window).height();
					let nh = 0;
					if($("#navigatebar").is(":visible")) {
						nh = $("#navigatebar").height();
					}
					let fh = 0;
					if($("#footerbar").is(":visible")) {
						fh = $("#footerbar").height();
					}
					$("#workingframe").height((wh-nh-fh) - fs_workingframe_offset);
			}).trigger("resize");
			let pos = $("#loginframe").position();
			if(pos) { mouseX = pos.left; mouseY = pos.top; }
			validAccessToken(function(valid,json) {
				console.log("valid = "+valid+", json : "+json);
				if(!valid) {
					displayLogin();
				} else {
					sendMessageInterface(json.body);
					verifyAfterLogin(json);
				}
			});				
		});
		window.onmessage = function(e) {
			console.log("main: onmessage:",e.data);
			try {
				let payload = JSON.parse(e.data);
				if(payload.type=="accessorinfo") {					
					sendMessageInterface();
				}
			} catch(ex) { }
		}
