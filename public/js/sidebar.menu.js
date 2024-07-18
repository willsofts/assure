			function closeMenuBar(evt) {
				let menubar = $("#sidebarmenu");
				if(menubar.is(":visible")) {
					$("#mainmenutrigger").addClass("active-trigger");
					$('#sidebarmenu').removeClass('unfliph').addClass("fliph");
					$("#sidebarheader").hide();
				}
			}
			function showMenuBar(evt) {
				let menubar = $("#sidebarmenu");
				if(!menubar.is(":visible")) {
					menubar.removeClass("sidebar-hide"); 
					$("#mainmenutrigger").removeClass("active-trigger");
					$('#sidebarmenu').removeClass("fliph").addClass("unfliph");
					$("#sidebarheader").show();
				}
			}
			function hangOut(msg) {
				closeMenuBar();
			}
			function bindingOnSideBarMenu() {
				$("a.dropdown-toggle",$("#sidebarlayer")).click(function() {
					$('#sidebarmenu').removeClass("fliph").addClass("unfliph");
					$("#sidebarheader").show();
				});
				let jsAry = $.map($("#sidebarlayer").find("a.menu-desktop").toArray(),function(element,index) { 
					let e = $(element);
					return { 
						label : e.text(),
						element : e
					};
				});
				$("#sidemenusearchtext").autocomplete("option","source",jsAry);
				$("#sidebarlayer").find("a.fa-link-menu-item").each(function(index,element) {
					$(element).click(function() {
						let pid = $(this).attr("data-pid");
						let url = $(this).attr("data-url");
						open_page(pid,url,null,$(this).attr("data-path"));
					});
				});
			}
			$(function(){
				$("#mainmenutrigger").on("click", function(e) {
					let menubar = $("#sidebarmenu");
					barclicked = false;
					$(this).toggleClass("active-trigger");
					if(menubar.is(":visible")) { 		
						if(menubar.hasClass("fliph")) {
							$('#sidebarmenu').removeClass("fliph").addClass("unfliph");	
							$("#sidebarheader").show();
						} else {
							$('#sidebarmenu').removeClass("unfliph").addClass("fliph");
							$("#sidebarheader").hide();
						}
					} else { 						
						menubar.removeClass("sidebar-hide"); 
						$('#sidebarmenu').removeClass("fliph").addClass("unfliph");
						$("#sidebarheader").show();
					}
				});				
				$(document).on("click",function(e){ 
					let $target = $(e.target);
					if (!$target.closest('#sidebarmenu').length && !$target.closest('#mainmenutrigger').length) {
						let menubar = $("#sidebarmenu");
						if(menubar.is(":visible")) {
							$("#mainmenutrigger").addClass("active-trigger");
							$('#sidebarmenu').removeClass("unfliph").addClass("fliph");
							$("#sidebarheader").hide();
						}
					}
				});	
				$("#sidemenusearchtext").autocomplete({
					delay: 500, //delay keystroke to be search from server
					select : function(event, ui) {
						console.log(JSON.stringify(ui.item));
						$(ui.item["element"]).trigger("click");
					}
				});
			});
