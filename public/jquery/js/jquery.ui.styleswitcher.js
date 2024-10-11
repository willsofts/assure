$.fn.styleswitcher = function(settings){
	var options = jQuery.extend({
		loadStyle: null,
		initialText: 'Style Selection',
		width: 180,
		height: 200,
		$styleInput: null,
		styleURL : "/api/style/category",
		cdnURL: "https://cdn.jsdelivr.net/gh/willsofts/will-asset@1.0.0",
		closeOnSelect: true,
		buttonHeight: 33,		
		onOpen: function(){},
		onClose: function(){},
		onSelect: function(){}
	}, settings);
				
	var button = $('<a href="javascript:void(0)" class="jquery-ui-styleswitcher-trigger"><span class="jquery-ui-styleswitcher-icon"></span><span class="jquery-ui-styleswitcher-title">'+ options.initialText +'</span></a>');
	if(options.$styleInput) {		
		if(options.$styleInput.val()!="") {
			var styleName = "<i class='"+options.$styleInput.val()+"' aria-hidden='true'></i>";
			button.find('.jquery-ui-styleswitcher-title').html(styleName);			
		}
	}		
	
	var gallery = '<div class="jquery-ui-styleswitcher">'
	+ 	'<div id="styleGallery">'
	+ '<ul id="styleGalleryLists">'
	+ '<li><a href="fa fa-tasks"><i class="fa fa-tasks" aria-hidden="true"></i></a></li>'
	+ '<li><a href="fa fa-pencil-square-o"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a></li>'
	+ '<li><a href="fa fa-square-o"><i class="fa fa-square-o" aria-hidden="true"></i></a></li>'
	+ '<li><a href="fa fa-align-justify"><i class="fa fa-align-justify" aria-hidden="true"></i></a></li>'
	+ '<li><a href="fa fa-cube"><i class="fa fa-cube" aria-hidden="true"></i></a></li>'
	+ '<li><a href="fa fa-cubes"><i class="fa fa-cubes" aria-hidden="true"></i></a></li>'
	+ '<li><a href="fa fa-clone"><i class="fa fa-clone" aria-hidden="true"></i></a></li>'
	+ '<li><a href="fa fa-desktop"><i class="fa fa-desktop" aria-hidden="true"></i></a></li>'
	+ '<li><a href="fa fa-globe"><i class="fa fa-globe" aria-hidden="true"></i></a></li>'
	+ '<li><a href="fa fa-exchange"><i class="fa fa-exchange" aria-hidden="true"></i></a></li>'
	+ '<li><a href="fa fa-list-alt"><i class="fa fa-list-alt" aria-hidden="true"></i></a></li>'
	+ '</ul></div></div>';
	var switcherpane = $(gallery).find('div').removeAttr('id');
	if(options.styleURL!=null) {
		$.ajax({
			url: options.styleURL,
			type: "POST",
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			dataType: "json",
			error : function(transport,status,errorThrown) { 
				console.log("error : "+errorThrown);
			},
			success: function(data,status,xhr){
				if(data && data.body["stylecategory"])
				var $ul = switcherpane.find("ul").empty();
				var cat = data.body["stylecategory"];
				for(var p in cat) {
					var $i = $("<i class='"+p+"' aria-hidden='true'></i> ");
					var $a = $("<a></a>").append($i).attr("href",p).attr("title",p);
					var $li = $("<li></li>").append($a);
					$ul.append($li);
				}
				
				switcherpane.find('a').on("click",function(){
					if(options.$styleInput) {
						options.$styleInput.val($(this).attr('href'));
					}
					var styleName = $(this).html();
					button.find('.jquery-ui-styleswitcher-title').html(styleName);
					options.onSelect($(this));
					if(options.closeOnSelect && switcherpane.is(':visible')){ switcherpane.spHide(button); }
					return false;
				});
				
				switcherpane.find('li').hover(
					function(){ 
						$(this).css({
							'borderColor':'#555',
							'background': 'url('+options.cdnURL+'/jquery/gallery/menuhoverbg.png) 50% 50% repeat-x',
							cursor: 'pointer'
						}); 
					},
					function(){ 
						$(this).css({
							'borderColor':'#111',
							'background': '#DCDCDC',
							cursor: 'auto'
						}); 
					}
				).css({
					width: options.width-30,
					height: '',
					padding: '2px',
					margin: '1px',
					'-moz-border-radius': '4px',
					clear: 'left',
					float: 'left'
				}).end()
				.find('a').css({
					textDecoration: 'none',
					float: 'left',
					width: '100%',
					outline: '0'
				}).end();
				
			}
		});
	}
	
	button.on("click",
		function(){
			if(switcherpane.is(':visible')){ switcherpane.spHide(button); }
			else{ switcherpane.spShow(button); }
			return false;
		}
	);	
		
	switcherpane.hover(
		function(){},
		function(){if(switcherpane.is(':visible')){$(this).spHide(button);}}
	);
	
	$(document).on("click",function() { switcherpane.spHide(button); });
	
	//show/hide panel functions
	$.fn.spShow = function(btn){ 
		var ofset = btn.offset();
		$(this).css({top: ofset.top + options.buttonHeight + 1, left: ofset.left}).slideDown(50); button.css(button_active); options.onOpen(); 
	}
	$.fn.spHide = function(btn){ 
		$(this).slideUp(50, function(){options.onClose();}); btn.css(button_default); 
	}			
	
	switcherpane.find('a').on("click",function(){
		if(options.$styleInput) {
			options.$styleInput.val($(this).attr('href'));
		}
		var styleName = $(this).html();
		button.find('.jquery-ui-styleswitcher-title').html(styleName);
		options.onSelect($(this));
		if(options.closeOnSelect && switcherpane.is(':visible')){ switcherpane.spHide(button); }
		return false;
	});
	
	var button_default = {
		fontSize: '18px',
		color: '#666',
		background: '#eee url('+options.cdnURL+'/jquery/gallery/buttonbg.png) 50% 50% repeat-x',
		border: '1px solid #ccc',
		'-moz-border-radius': '6px',
		'-webkit-border-radius': '6px',
		textDecoration: 'none',
		padding: '3px 3px 3px 8px',
		width: options.width - 11,//minus must match left and right padding 
		display: 'block',
		height: options.buttonHeight,
		outline: '0'
	};
	var button_hover = {
		'borderColor':'#bbb',
		'background': '#f0f0f0',
		cursor: 'pointer',
		color: '#444'
	};
	var button_active = {
		color: '#aaa',
		background: '#DCDCDC',
		border: '1px solid #ccc',
		borderBottom: 0,
		'-moz-border-radius-bottomleft': 0,
		'-webkit-border-bottom-left-radius': 0,
		'-moz-border-radius-bottomright': 0,
		'-webkit-border-bottom-right-radius': 0,
		outline: '0'
	};	
	
	//button css
	button.css(button_default)
	.hover(
		function(){ 
			$(this).css(button_hover); 
		},
		function(){ 
		 if( !switcherpane.is(':animated') && switcherpane.is(':hidden') ){	$(this).css(button_default);  }
		}	
	)
	.find('.jquery-ui-styleswitcher-icon').css({
		float: 'right',
		width: '20px',
		height: '25px',
		background: 'url('+options.cdnURL+'/jquery/gallery/icon_color_arrow.gif) 50% 50% no-repeat'
	});	
	
	//pane css
	switcherpane.css({
		position: 'absolute',
		float: 'left',
		fontFamily: 'Trebuchet MS, Verdana, sans-serif',
		fontSize: '18px',
		background: '#DCDCDC',
		color: '#fff',
		padding: '8px 3px 3px',
		border: '1px solid #ccc',
		'-moz-border-radius-bottomleft': '6px',
		'-webkit-border-bottom-left-radius': '6px',
		'-moz-border-radius-bottomright': '6px',
		'-webkit-border-bottom-right-radius': '6px',
		borderTop: 0,
		zIndex: 999999,
		width: options.width-11//minus must match left and right padding
	})
	.find('ul').css({
		listStyle: 'none',
		margin: '0',
		padding: '0',
		overflow: 'auto',
		height: options.height
	}).end()
	.find('li').hover(
		function(){ 
			$(this).css({
				'borderColor':'#555',
				'background': 'url('+options.cdnURL+'/jquery/gallery/menuhoverbg.png) 50% 50% repeat-x',
				cursor: 'pointer'
			}); 
		},
		function(){ 
			$(this).css({
				'borderColor':'#111',
				'background': '#DCDCDC',
				cursor: 'auto'
			}); 
		}
	).css({
		width: options.width-30,
		height: '',
		padding: '2px',
		margin: '1px',
		'-moz-border-radius': '4px',
		clear: 'left',
		float: 'left'
	}).end()
	.find('a').css({
		/*color: '#aaa',*/
		textDecoration: 'none',
		float: 'left',
		width: '100%',
		outline: '0'
	}).end();
		
	$.fn.styleupdate = function(styleText) {
		let btn = $(this).find("a.jquery-ui-styleswitcher-trigger");
		if(styleText === undefined) {
			btn.find('.jquery-ui-styleswitcher-title').html("Style Selection");
		} else {
			if(styleText!="") {
				let styleName = "<i class='"+styleText+"' aria-hidden='true'></i>";
				btn.find('.jquery-ui-styleswitcher-title').html(styleName);
			} else {
				btn.find('.jquery-ui-styleswitcher-title').html("");
			}
		}
	};
		
	$(this).append(button);
	$('body').append(switcherpane);
	switcherpane.hide();
	return this;
};
