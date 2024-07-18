			var fs_current_favor_item;
			var fs_favor_prog_ary;
			function showNewFavorItem() {
				$("#favorcoverbarmenu").show();
				$("#favornewitemlayer").show();
			}
			function hideNewFavorItem() {
				$("#favorcoverbarmenu").hide();
				$("#favornewitemlayer").hide();
			}
			function addBlankMenuItem(alink) {
				let seqno = alink.attr("seqno");
				$blank = $("<a href=\"javascript:void(0);\" class=\"tile fa-box-title fav-blank\" title=\"New Favorite\" seqno=\""+seqno+"\"><div class=\"icon\"><img class=\"fa fa-app-image\" src=\""+CDN_URL+"/img/apps/fs_icon.png\" /></div><span class=\"title\">Add New</span></a>");
				$blank.click(function(evt) { 
					evt.stopPropagation();
					fs_current_favor_item = $(this);
					showNewFavorItem();
				});
				$blank.insertBefore(alink);
			}
			function setupOpenLink(alink) {
				let pid = alink.attr("pid");
				let url = alink.attr("url");
				if(pid && pid!="") alink.click(function() { open_page(pid,url,null,alink.attr("data-path"),alink); });
			}
			function setupTodo(alink) {
				if(!CDN_URL) CDN_URL = "";
				let $del = $("<li><img src=\""+CDN_URL+"/img/delete_icon.png\" title=\"Delete\" width=\"25px\" height=\"25px\"/></li>");
				$del.click(function(evt) { 
					evt.stopPropagation();
					let fs_user = $("#main_user").val();
					let fs_seqno = alink.attr("seqno");
					let fs_prog = alink.attr("pid");
					if(fs_prog && fs_prog!="") {
						let authtoken = getAccessorToken();
						jQuery.ajax({
							url: API_URL+"/api/menu/remove",
							type: "POST",
							data: { userid: fs_user, programid: fs_prog, seqno: fs_seqno },
							headers : { "authtoken": authtoken },
							dataType: "html",
							contentType: defaultContentType,
							error : function(transport,status,errorThrown) { 
								submitFailure(transport,status,errorThrown);  
							},
							success: function(data,status,transport){ 
							}
						});	
					}
					addBlankMenuItem(alink);
					alink.remove(); 
				});
				let $item = $("<ul class=\"todo\" style=\"display:none;\"></ul>").append($del);
				alink.append($item);
				alink.hover(function() { 
						$item.show();
					},function() { 
						$item.hide();
				});
			}
			function insertNewFavorMenuItem(alink,fs_prog,fs_title,fs_icon) {
				if(!fs_prog || !fs_title || !fs_icon) return;
				let fs_seqno = alink.attr("seqno");
				let fs_user = $("#main_user").val();
				let $img = $("<img class=\"fa fa-app-image\" src=\""+CDN_URL+"/img/apps/"+fs_icon+"\"></img>");
				let $div = $("<div class=\"icon\"></div>").append($img);
				let $span = $("<span class=\"title\">"+fs_title+"</span>");
				let $newlink = $("<a href=\"javascript:void(0);\" class=\"tile fa-box-title fav-app\" pid=\""+fs_prog+"\" seqno=\""+fs_seqno+"\"></a>");
				$newlink.append($div).append($span);
				if(fs_prog && fs_prog!="") {
					let authtoken = getAccessorToken();
					jQuery.ajax({
						url: API_URL+"/api/menu/insert",
						type: "POST",
						data: { userid: fs_user, programid: fs_prog, seqno: fs_seqno },
						headers : { "authtoken": authtoken },
						dataType: "json",
						contentType: defaultContentType,
						error : function(transport,status,errorThrown) { 
							submitFailure(transport,status,errorThrown);  
						},
						success: function(data,status,transport) { 
							console.log("insertNewFavorMenu:",data);
							if(data.body.rows && data.body.rows.length >0) {
								let row = data.body.rows[0];
								let iconfile = row.iconfile;
								if(!iconfile || $.trim(iconfile)=="") {
									iconfile = "application.png";
								}
								$img.attr("src",CDN_URL+"/img/apps/"+iconfile);
								$newlink.attr("data-path",row.progpath?row.progpath:"");
							}
							$newlink.insertBefore(alink);
							setupOpenLink($newlink);
							setupTodo($newlink);
							setupContextMenu("favorbarmenu","favorcontextmenu",$newlink);
							alink.remove();
						}
					});	
				}
			}
			function bindingOnFavorMenu() {
				$("a",$("#favorbarmenu")).each(function(index,element) { 
					let alink = $(element);
					if(!alink.is(".fav-app")) {
						alink.click(function(evt) { 
							evt.stopPropagation();
							fs_current_favor_item = alink;
							showNewFavorItem();
						});						
					} else {
						setupOpenLink(alink);
						setupTodo(alink);
					}
				});
				setupContextMenu("favorbarmenu","favorcontextmenu");
			}			
			function addNewFavorMenuItem(title,evt) {
				let favorbar = $("#favorbarmenu");
				let len = favorbar.find("a").length;
				if(len>14) favorbar.find("a:eq(0)").remove();
				let $newlink = $("<a href=\"javascript:void(0);\" class=\"tile fa-box-title\"><div class=\"icon\"><i class=\"fa fa-university\"></i></div><span class=\"title\">"+title+"</span></a>");
				favorbar.append($newlink);
				if(evt) evt.stopPropagation();
				if(!$("#favormenuitem").is(".open")) $("#favormenuitemlink").trigger("click");
			}
			function inputNewFavorMenuItem(evt) {
				if(evt) evt.stopPropagation();
    			bootbox.prompt({
					title: "Favorite Menu", 
					value: "Institute", 
					callback: function(result) {
						if(result && result!="") {
							addNewFavorMenuItem(result);
						}
					}
    			}); 
			}			
			function setupContextMenu(containerID,menuID,element) {
			}
			function load_prog_item() {
				let authtoken = getAccessorToken();
				let fs_user = $("#main_user").val();
				jQuery.ajax({
					url: API_URL+"/api/menu/prog",
					type: "POST",
					data: { userid: fs_user },
					headers : { "authtoken": authtoken },
					dataType: "json",
					contentType: defaultContentType,
					error : function(transport,status,errorThrown) { 
					},
					success: function(data,status,transport){ 
						fs_favor_prog_ary = data.body.dataset;
						prepareOptions(fs_favor_prog_ary,"progcategory",$("#favorprogitem").empty());
					}
				});	
			}
			$(function(){
				$("#favornewitem").click(function(evt){
					evt.stopPropagation();
					hideNewFavorItem();
					if(fs_current_favor_item) {
						let fs_prog = $("#favorprogitem").val();
						let fs_title = $("option:selected",$("#favorprogitem")).text();
						let fs_icon = fs_prog+".png";
						insertNewFavorMenuItem(fs_current_favor_item,fs_prog,fs_title,fs_icon);
					}
				});
				$("#favorprogitem").click(function(evt) { 
					evt.stopPropagation();
				});
				$("#favorcancelitem").click(function(evt) { 
					evt.stopPropagation();
					hideNewFavorItem();
				});
			});
		