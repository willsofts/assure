(function( $ ) {

$.widget( "ui.customizer", {
	version: "1.0.0",
	options: {
		initialText: 'Customization',
		width: 180,
		height: 200,
		labelWidth: 105,
		buttonPreText: 'Customize: ',
		closeOnSelect: true,
		buttonHeight: 14,
		customizeGrid : function() { return null; },
		customizeTable : null,
		customizeTrigger : null,
		customizeData : null,
		customizeID : null,
		customizeURL : null,
		customizeTag : "data",
		onOpen: function(){},
		onClose: function(){},
		onSelect: function(){},		
		onCustomize : function(colIndex,showing) { },
		allowCustomize : function(colIndex) { return true; }
	},

	_create: function() {

		var button = $('<a href="#" class="jquery-ui-customizer-trigger"><span class="jquery-ui-customizer-icon"></span><span class="jquery-ui-customizer-title">'+ this.options.initialText +'</span></a>');
		var $ul = $("<ul></ul>");
		if(this.options.customizeGrid && this.options.customizeGrid()!=null) { //dhtmlxgrid
			var colnames = null;
			var columnNames = this.options.customizeGrid().getColumnNames();
			if(columnNames) colnames = columnNames.split(",");
			var gAry = [];
			for(var index=0,isz=this.options.customizeGrid().getColumnsNum();index<isz;index++) { gAry.push(index); }
			var aGrid = this.options.customizeGrid();
			$(gAry).each(function(idx,element) {
				var index = element;
				var text = aGrid.getColumnLabel(index);
				if($.trim(text)=='') text = "Column "+(index+1);
				var colname = null;
				if(colnames && colnames.length>index) colname = colnames[index];
				var $li = $("<li colIndex='"+(index)+"' colspan='0' "+(colname?"columnname='"+colname+"'":"")+" check='true'></li>");
				var $input = $("<input type='checkbox' colIndx='"+(index)+"' checked></input>");
				$input.click(function(evt) { evt.preventDefault(); evt.stopPropagation(); setTimeout(function(){ $li.trigger("click"); },50); return false; });
				var $span = $("<span class='jquery-ui-customizer-span'>"+text+"</span>");
				$li.append($input);
				$li.append($span);
				$ul.append($li);
			});
		} else {
			if(this.options.customizeTable) {
				var $tr = $("th",$(this.options.customizeTable)).eq(0).parent();
				$("th",$tr).each(function(index,element){
					var text = $(this).text();
					if($.trim(text)=='') text = "Column #"+(index+1);
					var colspan = $(this).attr("colspan");
					if(!colspan) colspan = "0";
					var colname = $(this).attr("columnname");
					var $li = $("<li colIndex='"+(index)+"' colspan='"+colspan+"' "+(colname?"columnname='"+colname+"'":"")+" check='true'></li>");
					var $input = $("<input type='checkbox' colIndx='"+(index)+"' checked></input>");
					$input.click(function(evt) { evt.preventDefault(); evt.stopPropagation(); setTimeout(function(){ $li.trigger("click"); },50); return false; });
					var $span = $("<span class='jquery-ui-customizer-span'>"+text+"</span>");
					$li.append($input);
					$li.append($span);
					$ul.append($li);
				});
			}	 
		}
		var $div = $("<div class='jquery-ui-customizer-list'></div>").append($ul);
		var customizerpane = $('<div class="jquery-ui-customizer"></div>').append($div);
		this.options.customizerPane = customizerpane;
		button.click(
			function(){
				if(customizerpane.is(':visible')){ customizerpane.customHide(); }
				else{ customizerpane.customShow();  }
				return false;
			}
		);
		if(this.options.customizeTrigger) {
			$(this.options.customizeTrigger).click(function(evt) { 
				evt.preventDefault(); evt.stopPropagation();
				if(customizerpane.is(':visible')){ customizerpane.customHide(); }
				else{ customizerpane.customShow();  }
				return false;
			});
		}
		customizerpane.hover(
			function(){},
			function(){if(customizerpane.is(':visible')){$(this).customHide();}}
		);

		$(document.body).click(function(){ customizerpane.customHide(); } );

		var options = this.options;
		$.fn.customShow = function(){ 		
			var bof = button.offset(); 		
			var bw = button.width();
			if(options.customizeTrigger) {
					bof = $(options.customizeTrigger).offset();
					bw = $(options.customizeTrigger).width();
			}
			var pw = customizerpane.width(); 
			var leftpane = bof.left-(pw-bw)+4;
			$(this).css({top: bof.top + options.buttonHeight + 6, left: leftpane}).slideDown(50);  
			button.css(button_active);  
			options.onOpen(); 
		}
		$.fn.customHide = function(){ $(this).slideUp(50, function(){options.onClose();}); button.css(button_default); }
			
		customizerpane.find('a').click(function(evt){
			evt.preventDefault();
			var themeName = $(this).find('span').text();
			button.find('.jquery-ui-customizer-title').text(this.options.buttonPreText + themeName );
			this.options.onSelect($(this));
			if(this.options.closeOnSelect && customizerpane.is(':visible')){ customizerpane.customHide(); }
			return false;
		});

		var button_default = {
			fontFamily: 'Trebuchet MS, Verdana, sans-serif',
			fontSize: '11px',
			color: '#666',
			background: '#eee url(../jquery/gallery/buttonbg.png) 50% 50% repeat-x',
			border: '1px solid #ccc',
			'-moz-border-radius': '6px',
			'-webkit-border-radius': '6px',
			textDecoration: 'none',
			padding: '3px 3px 3px 8px',
			width: this.options.labelWidth, //options.width - 70,
			display: 'block',
			height: this.options.buttonHeight,
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
			//background: '#000',
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
					if( !customizerpane.is(':animated') && customizerpane.is(':hidden') ){	$(this).css(button_default);  }
				}	
		)
		.find('.jquery-ui-customizer-icon').css({
			float: 'right',
			width: '16px',
			height: '16px',
			background: 'url(../jquery/gallery/icon_color_arrow.gif) 50% 50% no-repeat'
		});	
		//pane css
		customizerpane.css({
			position: 'absolute',
			float: 'left',
			fontFamily: 'Trebuchet MS, Verdana, sans-serif',
			fontSize: '12px',
			background: '#CCCCCC',
			color: '#fff',
			padding: '8px 3px 3px',
			border: '1px solid #ccc',
			'-moz-border-radius-bottomleft': '6px',
			'-webkit-border-bottom-left-radius': '6px',
			'-moz-border-radius-bottomright': '6px',
			'-webkit-border-bottom-right-radius': '6px',
			borderTop: 0,
			zIndex: 999999,
			width: this.options.width-6//minus must match left and right padding
		})
		.find('ul').css({
			listStyle: 'none',
			margin: '0',
			padding: '0',
			overflow: 'auto',
			height: this.options.height
		}).end()
		.find('li').css({'color':'black'}).hover(
			function(){ 
				$(this).css({
					'borderColor':'#555',
					//'background': 'url(../jquery/gallery/menuhoverbg.png) 50% 50% repeat-x',
					'background' : '#AAAAAA',
					cursor: 'pointer'
				}); 
			},
			function(){ 
				$(this).css({
					'borderColor':'#111',
					'background': '#CCCCCC',
					cursor: 'auto'
				}); 
			}
		).click(function(evt) { 
			evt.preventDefault(); evt.stopPropagation();
				if(options.customizeGrid && options.customizeGrid()!=null) {
					var th = $(this);
					var colIndex = th.attr("colIndex");
					var columnname = th.attr("columnname");
					if(columnname) {
						var columnNames = options.customizeGrid().getColumnNames();
						if(columnNames) {
							var colnames = columnNames.split(",");
							if(colnames) {
								$(colnames).each(function(index,element) { 
									if(element==columnname) {
										colIndex = index;
										return false;
									}
								});
							}
						}
					}
					if(options.allowCustomize) {
						if(!options.allowCustomize(eval(colIndex))) return;
					}
					var showing = $("input",th).is(":checked");
					var colspan = th.attr("colspan");
					if(!colspan) colspan = "0";
					var cols = eval(colspan);
					showing = th.attr("check")=="true";
					options.customizeGrid().setColumnHidden(colIndex,showing);
					$("input",th).attr("checked",!showing);					
					th.attr("check",!showing);
					if(options.onCustomize) options.onCustomize(colIndex,showing);
				} else {
					if(options.customizeTable) {
						var th = $(this);
						var colIndex = th.attr("colIndex");
						if(options.allowCustomize) {
							if(!options.allowCustomize(eval(colIndex))) return;
						}
						var showing = $("input",th).is(":checked");
						var colspan = th.attr("colspan");
						if(!colspan) colspan = "0";
						var cols = eval(colspan);
						showing = th.attr("check")=="true";
						$("tr",$(options.customizeTable)).each(function(index,element) {
							if(showing) $("th",this).eq(colIndex).hide(); else $("th",this).eq(colIndex).show();
							if(showing) $("td",this).eq(colIndex).hide(); else $("td",this).eq(colIndex).show();
						});			
						$("input",th).attr("checked",!showing);					
						th.attr("check",!showing);
						if(options.onCustomize) options.onCustomize(colIndex,showing);
					}
				}
			}
		).css({
			width: this.options.width-30,
			height: '',
			padding: '2px',
			margin: '1px',
			border: '1px solid #111',
			'-moz-border-radius': '4px',
			clear: 'left',
			float: 'left',
			textAlign: 'left',
			paddingLeft : '5px'
		}).end()
		.find('a').css({
			color: '#aaa',
			textDecoration: 'none',
			float: 'left',
			width: '100%',
			outline: '0'
		}).end()
		.find('img').css({
			float: 'left',
			border: '1px solid #333',
			margin: '0 2px'
		}).end()
		.find('.themeName').css({
			float: 'left',
			margin: '3px 0'
		}).end();
		
		if(this.options.customizeTrigger) { $(this).width(0); } else {
			this.element.append(button);
		}
		$('body').append(customizerpane);
		customizerpane.hide();

		if(this.options.customizeData) {
			if(this.options.customizeGrid && this.options.customizeGrid()!=null) {
				var colAry = null;
				var colNames = this.options.customizeGrid().getColumnNames();
				if(colNames) colAry = colNames.split(",");
				var founded = false;
				if(colAry) {							
					$(colAry).each(function(index,elementname) {
						$(this.options.customizeData).each(function(indx,elem) {
							var dsRecord = elem;
							if(dsRecord) {
								if(elementname==dsRecord.fieldname) {
									founded = true; 
									var hidden = !dsRecord || dsRecord.showing=="0";
									if(hidden) {
										$("li",customizerpane).eq(index).trigger("click");
									}
								}
							}
						});
					});
				}
				if(!founded) {
					for(var index=0,isz=this.options.customizeGrid().getColumnsNum();index<isz;index++) {
						if(this.options.customizeData.length>index) {
							var dsRecord = this.options.customizeData[index];
							if(dsRecord) {
								var hidden = !dsRecord || dsRecord.showing=="0";
								if(hidden) {
									$("li",customizerpane).eq(index).trigger("click");
								}
							}
						}
					}
				}
			} else {
				if(this.options.customizeTable) {
					var $tr = $("th",$(this.options.customizeTable)).eq(0).parent();
					$("th",$tr).each(function(index,element){
						var dsRecord = null;
						var columnname = $(this).attr("columnname");
						if(columnname) {
							$(this.options.customizeData).each(function(indx,elem) {
								if(elem.fieldname==columnname) {
									dsRecord = elem; 
									return false;
								}
							});
						}
						if(!dsRecord) {
							if(this.options.customizeData.length>index) dsRecord = this.options.customizeData[index];
						}
						if(dsRecord) {
							var hidden = !dsRecord.showing || dsRecord.showing=="0";
							if(hidden) {
								$("li",customizerpane).eq(index).trigger("click");
							}
						}
					});
				}
			}
		}
		var aurl = null;
		if(this.options.customizeURL) aurl = this.options.customizeURL;
		if(!aurl) {
			if(this.options.customizeID) aurl = "../jsp/customizer.jsp?fsAjax=true&fsJson=true&progid="+this.options.customizeID+"&seed="+Math.random();
		}
		if(aurl) {
			jQuery.ajax({
				url: aurl,
				type: "POST",
				contentType: "application/x-www-form-urlencoded; charset=UTF-8",
				dataType: "json",
				error : function(transport,status,errorThrown) { 
					//alert("error : "+errorThrown);
				},
				success: function(data,status,xhr){
					var dsAry = data;
					if(options.customizeTag && data[options.customizeTag]) dsAry = data[options.customizeTag];
					if(options.customizeID && data[options.customizeID]) dsAry = data[options.customizeID];
					if(options.customizeGrid && options.customizeGrid()!=null) {
						var colAry = null;
						var colNames = options.customizeGrid().getColumnNames();
						if(colNames) colAry = colNames.split(",");
						var founded = false;
						if(colAry) {							
							$(colAry).each(function(index,elementname) {
								$(dsAry).each(function(indx,elem) {
									var dsRecord = elem;
									if(dsRecord) {
										if(elementname==dsRecord.fieldname) {
											founded = true; 
											var listItem = null;
											if(dsRecord.caption && dsRecord.caption!="") {
												listItem = $("li",customizerpane).eq(index);
												$("span",listItem).html(dsRecord.caption);
											}
											var hidden = !dsRecord.showing || dsRecord.showing=="0";
											if(hidden) {
												if(!listItem) listItem = $("li",customizerpane).eq(index);
												listItem.trigger("click");
											}											
										}
									}
								});
							});
						} 
						if(!founded) {
							for(var index=0,isz=options.customizeGrid().getColumnsNum();index<isz;index++) {
								if(dsAry.length>index) {
									var dsRecord = dsAry[index];
									if(dsRecord) {
										var listItem = null;
										if(dsRecord.caption && dsRecord.caption!="") {
											listItem = $("li",customizerpane).eq(index);
											$("span",listItem).html(dsRecord.caption);
										}
										var hidden = !dsRecord.showing || dsRecord.showing=="0";
										if(hidden) {
											if(!listItem) listItem = $("li",customizerpane).eq(index);
											listItem.trigger("click");
										}
									}
								}
							}
						}
					} else {
						if(options.customizeTable) {
							var $tr = $("th",$(options.customizeTable)).eq(0).parent();
							$("th",$tr).each(function(index,element){
								var dsRecord = null;
								var columnname = $(this).attr("columnname");
								if(columnname) {
									$(dsAry).each(function(indx,elem) {
										if(elem.fieldname==columnname) {
											dsRecord = elem; 
											return false;
										}
									});
								}
								if(!dsRecord) {
									if(dsAry.length>index) dsRecord = dsAry[index];
								}
								if(dsRecord) {
									var listItem = null;
									if(dsRecord.caption && dsRecord.caption!="") {
										listItem = $("li",customizerpane).eq(index);
										$("span",listItem).html(dsRecord.caption);
									}
									var hidden = !dsRecord.showing || dsRecord.showing=="0";
									if(hidden) {
										if(!listItem) listItem = $("li",customizerpane).eq(index);
										listItem.trigger("click");
									}
								}
							});
						}
					}
				}
			});
		}
	},

	_setOption: function( key, value ) {
		var that = this;
		this._super( key, value );
	},

	refresh : function() {
		var options = this.options;
		if(options.customizerPane) {
			if(options.customizeGrid && options.customizeGrid()!=null) {
				$("li",options.customizerPane).each(function(idx,elem) { 
					var th = $(this);
					var colIndex = th.attr("colIndex");
					if(options.allowCustomize) {
						if(!options.allowCustomize(eval(colIndex))) return;
					}
					var showing = $("input",th).is(":checked");
					options.customizeGrid().setColumnHidden(colIndex,!showing);
					if(options.onCustomize) options.onCustomize(colIndex,showing);
				});
			} else {
				if(options.customizeTable) {
					$("li",options.customizerPane).each(function(idx,elem) { 
						var th = $(this);
						var colIndex = th.attr("colIndex");
						if(options.allowCustomize) {
							if(!options.allowCustomize(eval(colIndex))) return;
						}
						var showing = $("input",th).is(":checked");
						$("tr",$(options.customizeTable)).each(function(index,element) {
							if(showing) $("th",this).eq(colIndex).show(); else $("th",this).eq(colIndex).hide();
							if(showing) $("td",this).eq(colIndex).show(); else $("td",this).eq(colIndex).hide();
						});
						if(options.onCustomize) options.onCustomize(colIndex,showing);
					});
				}
			}
		}
	},

	reset : function() {
		var aurl = null;
		var options = this.options;
		if(this.options.customizeURL) aurl = this.options.customizeURL;
		if(!aurl) {
			if(this.options.customizeID) aurl = "../jsp/customizer.jsp?fsAjax=true&fsJson=true&progid="+this.options.customizeID+"&seed="+Math.random();
		}
		if(aurl) {
			jQuery.ajax({
				url: aurl,
				type: "POST",
				contentType: "application/x-www-form-urlencoded; charset=UTF-8",
				dataType: "json",
				error : function(transport,status,errorThrown) { 
					//alert("error : "+errorThrown);
				},
				success: function(data,status,xhr){
					var dsAry = data;
					if(options.customizeTag && data[options.customizeTag]) dsAry = data[options.customizeTag];
					if(options.customizeID && data[options.customizeID]) dsAry = data[options.customizeID];
					if(options.customizeGrid && options.customizeGrid()!=null) {
						var colAry = null;
						var colNames = options.customizeGrid().getColumnNames();
						if(colNames) colAry = colNames.split(",");
						var founded = false;
						if(colAry) {							
							$(colAry).each(function(index,elementname) {
								$(dsAry).each(function(indx,elem) {
									var dsRecord = elem;
									if(dsRecord) {
										if(elementname==dsRecord.fieldname) {
											founded = true; 
											var listItem = null;
											if(dsRecord.caption && dsRecord.caption!="") {
												listItem = $("li",options.customizerPane).eq(index);
												$("span",listItem).html(dsRecord.caption);
											}
											var hidden = !dsRecord.showing || dsRecord.showing=="0";
											if(hidden) {
												if(!listItem) listItem = $("li",options.customizerPane).eq(index);
												var showing = $("input",listItem).is(":checked");
												if(showing) {
													listItem.trigger("click");
												} 
											} else {
												if(!listItem) listItem = $("li",options.customizerPane).eq(index);
												var showing = $("input",listItem).is(":checked");
												if(!showing) {
													listItem.trigger("click");
												}
											}
										}
									}
								});
							});
						} 
						if(!founded) {
							for(var index=0,isz=options.customizeGrid().getColumnsNum();index<isz;index++) {
								if(dsAry.length>index) {
									var dsRecord = dsAry[index];
									if(dsRecord) {
										var listItem = null;
										if(dsRecord.caption && dsRecord.caption!="") {
											listItem = $("li",options.customizerPane).eq(index);
											$("span",listItem).html(dsRecord.caption);
										}
										var hidden = !dsRecord.showing || dsRecord.showing=="0";
										if(hidden) {
											if(!listItem) listItem = $("li",options.customizerPane).eq(index);
											var showing = $("input",listItem).is(":checked");
											if(showing) {
												listItem.trigger("click");
											} 
										} else {
											if(!listItem) listItem = $("li",options.customizerPane).eq(index);
											var showing = $("input",listItem).is(":checked");
											if(!showing) {
												listItem.trigger("click");
											}
										}
									}
								}
							}
						}
					} else {
						if(options.customizeTable) {
							var $tr = $("th",$(this.options.customizeTable)).eq(0).parent();
							$("th",$tr).each(function(index,element){
								var dsRecord = null;
								var columnname = $(this).attr("columnname");
								if(columnname) {
									$(dsAry).each(function(indx,elem) {
										if(elem.fieldname==columnname) {
											dsRecord = elem; 
											return false;
										}
									});
								}
								if(!dsRecord) {
									if(dsAry.length>index) dsRecord = dsAry[index];
								}
								if(dsRecord) {
									var listItem = null;
									if(dsRecord.caption && dsRecord.caption!="") {
										listItem = $("li",options.customizerPane).eq(index);
										$("span",listItem).html(dsRecord.caption);
									}
									var hidden = !dsRecord.showing || dsRecord.showing=="0";
									if(hidden) {
										if(!listItem) listItem = $("li",options.customizerPane).eq(index);
										var showing = $("input",listItem).is(":checked");
										if(showing) {
											listItem.trigger("click");
										} 
									} else {
										if(!listItem) listItem = $("li",options.customizerPane).eq(index);
										var showing = $("input",listItem).is(":checked");
										if(!showing) {
											listItem.trigger("click");
										}
									}
								}
							});
						}
					}
				}
			});
		}
	}
});

}( jQuery ) );
