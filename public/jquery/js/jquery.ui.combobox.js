;(function($) {
	
var KEY_UP = 38,
	KEY_DOWN = 40,
	KEY_ENTER = 13,
	KEY_ESC = 27,
	KEY_F4 = 115,
	KEY_SPACEBAR = 32;
var regPicture = /[9XEATxea]/; 

$.widget('ui.combobox', {

	/**
	 * Main JQuery method.  Call $(selector).combobox(options) on any element,
	 * or collection of elements, to turn them into a combobox.
	 * 
	 * All event handlers take 2 arguments: the original browser event, and an
	 * object with the following fields:<ul> 
	 * <li>value: the current value of the input field</li>
	 * <li>index: the index within the option list of the presently-selected
	 * value, or -1 if directly inputted.</li>
	 * <li>isCustom: true if the user has typed in an option not on the list</li>
	 * <li>inputElement: JQuery object containing the input field</li>
	 * <li>listElement: JQuery object containing the drop-down list</li>
	 * </ul>
	 * @function combobox
	 * @param {Object} options Options hash
	 * @option {Array<String>} data List of options for the combobox
	 * 
	 * @option {Boolean} autoShow If true (the default), then display the
	 * drop-down whenever the input field receives focus.  Otherwise, the 
	 * user must explicitly click the drop-down icon to show the list.
	 * 
	 * @option {Boolean} matchMiddle If true (the default), then the combobox
	 * tries to match the typed text with any portion of any of the 
	 * options, instead of just the beginning.
	 * 
	 * @option {Function(e, ui)} key Event handler called whenever a key is
	 * pressed in the input box.
	 * 
	 * @option {Function(e, ui)} change Event handler called whenever a new
	 * option is selected on the drop-down list (eg. down/up arrows, typing in 
	 * the input field).
	 * 
	 * @option {Function(e, ui)} select Event handler called when a selection
	 * is finished (enter pressed or input field loses focus)
	 * 
	 * @option {String} arrowUrl URL of the image used for the drop-down arrow.
	 * Used only by the default arrowHTML function; if you override 
	 * that, you don't need to supply this.  Defaults to "drop_down.png"
	 * 
	 * @option {Function()} arrowHTML Function that should return the HTML of
	 * the element used to display the drop-down.  Defaults to an image tag.
	 *
	 * @option {String} listContainerTag Tag to hold the drop-down list element.
	 *
	 * @option {Function(String, Int)} listHTML Function that takes the option
	 * datum and index within the list and returns an HTML fragment for each
	 * option.  Default is a span of class ui-combobox-item.
	 */
	init: function() {
		var that = this;
		//var options = this.options;
		var options = this.applySetting(this.options,this.element);
		this.options.canLookup = options.canLookup;
		this.options.beforeLookup = options.beforeLookup;
		this.options.afterLookup = options.afterLookup;
		this.options.change = options.change;
		this.options.select = options.select;
		this.options.dialog = options.dialog;
		this.options.styles = options.styles;
		this.options.afterShow = options.afterShow;
		this.options.dynamicTag = options.dynamicTag;
		this.element.attr("readonly",options.readOnly);
		this.element.data("offset",this.element.offset());
		this.element.data("position",this.element.position());
		this.element.data("width",this.element.width());
		this.element.data("height",this.element.height());
		this.wraperbox = $("<span class='fsx_combo_box'></span>");
		function closeListOnDocumentClick() {
			that.hideList();
			$(document).unbind('click', closeListOnDocumentClick);
		};
		if(options.button) {
			this.arrowElem = $(options.arrowHTML.call(this))
				.click(function(e) {
					if(that.element.is(":disabled")) return false;
					if(that.element.is("[readonly]")) {
						var edit = that.element.attr("editable");
						if(!("true"==edit)) return false;		
					}
					if(!that.options.canLookup) return false;
					if(!that.options.beforeLookup(that)) return false;
					if(that.isListVisible()) {
						//that.hideList();
					} else {
						that.showList();
						$(document).click(closeListOnDocumentClick);
					}
					return false;
				});
			//this.element.wrap(this.wraperbox);
			//this.element.after(this.arrowElem);
			//var $atd = $("<td style='padding-left:2px;'></td>").append(this.arrowElem);
			//this.element.wrap("<table class='fsx-combo-table'></table>").wrap("<tr></tr>").wrap("<td></td>").parent().after($atd);			
			var $div = $('<div class="input-group"></div>');
			this.element.wrap($div);
			this.element.after(this.arrowElem);
		}
		//this.listElem = this.buildList().insertAfter(this.arrowElem).hide();
		if(options.dialog) {
			//this.listElem = this.buildList().insertAfter(options.container).hide();
			var id = "fsccommboo"+Math.random();
			var input = $('<input type="text" id="' + id +'" style="position: absolute; top: -100px; width: 0px; z-index: -10;"/>');
			$("body").append(input);
			this.listElem = this.buildList().insertAfter(input).hide();
		} else { 
			//this.listElem = this.buildList().insertAfter(this.element).hide();
			this.listElem = this.buildList().insertAfter(this.element.parent()).hide();
		}
		if(options.autoShow) {
			this.element
				.focus(boundCallback(this, 'showList'))
				.blur(function(e) {
					that.finishSelection(that.selectedIndex, e);
					that.hideList();
				});
		}

		//this.element.wrap("<span class='fsx_combo_box'></span>");
	},
	_setOption: function(key, value){
		this.options[key] = value;
		if(key=="readOnly") { 
			this.element.attr("readOnly",value); 
		}
	},
	_init: function() {
		// JQuery UI 1.6rc6 compatibility
		this.init.apply(this, arguments);
	},

	applySetting : function(settings,element) {
		var eid = element.attr("id");
		//element.addClass("fsx_combo_input");
		//var fs_img = $('<IMG  align="absmiddle"  class="jrivaly lookupbuttonclass" SRC="../lookup/spacer.gif" ALT="">').mouseover(function(){ $(this).addClass('ui-lookupbuttonclass-hover');}).mouseout(function(){$(this).removeClass("ui-lookupbuttonclass-hover");});
		var fs_img = $('<i class="fa fa-list-alt" aria-hidden="true"></i>');
		//var fs_alink = '<A href="#0" tabIndex="-1"  ID="LK'+eid+'" style="cursor: pointer;"  class="jrivaly lookup-link-class" ondeactivate="fs_rival_deactivate('+eid+',this)" onbeforedeactivate="fs_rival_beforedeactivate('+eid+',this)"></A>';
		//this.fs_alink = $('<A href="javascript:void(0);" tabIndex="-1"  ID="LK'+eid+'" style="cursor: pointer; font-size: 24px;" class="jrivaly lookup-link-class ui-combobox-link-class"></A>').bind("ondeactivate",function() {fs_rival_deactivate(eid,this);}).bind("onbeforedeactivate",function(){fs_rival_beforedeactivate(eid,this);});
		this.fs_alink = $('<A href="javascript:void(0);" tabIndex="-1"  ID="LK'+eid+'" class="jrivaly lookup-link-class ui-combobox-link-class input-group-addon input-group-append input-group-text"></A>').bind("ondeactivate",function() {fs_rival_deactivate(eid,this);}).bind("onbeforedeactivate",function(){fs_rival_beforedeactivate(eid,this);});
		var options = jQuery.extend({
				data: [],
				dataMap: {},
				picture: "",
				xmldocs : null,
				singleShow: false,
				autoShow: false,
				matchMiddle: true,
				readOnly : false, 
				canLookup : true,		
				button : true,
				styles : null,
				viewStyle : null,
				beforeLookup: function() { return true; },
				afterLookup : function(value,description) { return true; },
				change: function(e, ui) {},
				select: function(e, ui) { },
				key: function(e, ui) {},
				arrowURL: 'drop_down.png',
				arrowHTML: function() {
					return $(this.fs_alink).append(fs_img);
				},
				onSelect : function(index,data) {  },
				afterShow : function() { },
				listContainerTag: 'div',
				listHTML: defaultListHTML
			}, settings);	
		if(element.is("[readonly]")) { options.readOnly = true; };
		return options;				
	},

	composeLookupDatas : function(dataMap) {  
		var result = [];
		var xmldocs = this.options.xmldocs;
		if(xmldocs) {
			var childs = $(xmldocs).children();
		 	if(childs.length>0) {  
				try{
		 			var parentnode = xmldocs.documentElement;  
					if(!parentnode) parentnode = xmldocs.parentNode;
		 			var attr = parentnode.getAttribute("type");  
		 			if(attr && ((attr=="error") || (attr=="none"))) return result; 
				}catch(ex) { }
				if(childs.children().length==0) return result;
				var rownode;
		 		var element1 = "element";  
		 		var element2;  
				var elementName = this.options.dynamicTag;
				if(elementName) {
					rownode = $(elementName,xmldocs).get(0);
				} else {
					rownode = childs.children()[0];
					if(xmldocs.parentNode) rownode = childs[0];
					elementName = rownode.nodeName;
				}
				if(rownode) {
					var rownodechilds = $(rownode).children();
		 			if(rownodechilds.length>0) {  
		 				element1 = rownodechilds[0].nodeName;  
		 				if(rownodechilds.length>1) {  
		 					element2 = rownodechilds[1].nodeName;						  
		 				}					  
		 			}
				}
				$(elementName, xmldocs).each(function(index,element) {
					var value1 = $(element1, this).text();
					result.push(value1);
					if(element2) {
						var value2 = $(element2,this).text();
						dataMap[value1] = value2;
					} else {
						dataMap[value1] = value1;
					}
				});
			}
		}
		return result;
	},

	cleanup: function() {
		if(this.boundKeyHandler) {
			$(document).unbind('keyup', this.boundKeyHandler);
		}
		if(this.arrowElem) this.arrowElem.remove();
		this.listElem.remove();
	},

	/**
	 * Remove all combobox functionality from this element, restoring the
	 * original element.
	 */
	destroy: function() {
	},

	/**
	 * Dynamically changes one of the combobox options.
	 * 
	 * @param {String} key Option name.
	 * @param {Object} value New value.
	 */
	setData: function(key, value) {
		this.options[key] = value;

		if(key == 'disabled' && this.isListVisible()) {
			this.hideList();
		}
		if(key == 'data' || key=='xmldocs' || key == 'listContainerTag' || key == 'listHTML') {
			var isVisible = this.isListVisible();
			this.listElem = this.buildList().replaceAll(this.listElem);
			this[isVisible ? 'showList' : 'hideList']();
		}
	},
	buildTableList : function() {
		var that = this;
		var options = this.applySetting(this.options,this.element);
		var tag = options.listContainerTag;
		var elem = $('<' + tag + ' style="z-Index:1999999;" class = "jrivaly ui-combobox-list">' + '</' + tag + '>');		
		
		elem.hover(
			function(){},
			function(){ if( elem.is(':visible')){ that.hideList();}}
		);
		return elem;
	},
	buildNormalList : function() {
		var that = this;
		var options = this.applySetting(this.options,this.element);
		var tag = options.listContainerTag;
		var elem = $('<' + tag + ' style="z-Index:1999999;" class = "jrivaly ui-combobox-list">' + '</' + tag + '>');		
		options.dataMap = {};
		this.options.dataMap = {};
		if(!$.isArray(options.data)) {
			options.dataMap = options.data;
			this.options.data = [];
			options.data = [];
			for(var p in options.dataMap) { 
				this.options.data.push(p); 
				options.data.push(p);
			};
		}
		this.options.dataMap = options.dataMap;
		if(this.options.xmldocs) {
			this.options.data = this.composeLookupDatas(this.options.dataMap);
			options.data = this.options.data;
		}
		$.each(options.data, function(i, val) {
			$(options.listHTML(val, i,options.singleShow,options.dataMap,options.viewStyle))
				.appendTo(elem)
				.click(boundCallback(that, 'finishSelection', i))
				.mouseover(boundCallback(that, 'changeSelection', i));
		});
		
		elem.hover(
			function(){},
			function(){ if( elem.is(':visible')){ that.hideList();}}
		);
		return elem;
	},
	buildList: function() {
		if(this.listElem) this.listElem.empty();
		//return this.buildTableList();
		return this.buildNormalList();
	},

	isListVisible: function() {
		return this.listElem.is(':visible');
	},

	/**
	 * Programmatically shows the drop-down list.
	 * 
	 * @param {Event} e Original event triggering this.
	 */
	showList: function(e) {
		if(this.options.disabled) {
			return;
		}
		this.showNormalList(e);
		//this.showTableList(e);
	},
	showNormalList : function(e) {
		if(!$.isArray(this.options.data)) {
			this.options.dataMap = this.options.data;
			this.options.data = [];
			for(var p in this.options.dataMap) { 
				this.options.data.push(p); 
			};
		}		
		var of,styles,eh,ew;
		try{ 
			of = this.element.offset();
			styles = this.element.position();
			eh = this.element.height()
			ew = this.element.width();
		}catch(ex) { }
		if(of && of.top && of.left) { } else {
			of = this.element.data("offset");
			styles = this.element.data("position");
			eh = this.element.data("height");
			ew = this.element.data("width");
		}
		if(this.options.xmldocs) { 
			//this.listElem = this.buildList().replaceAll(this.listElem); 
		}
		if(!this.options.data) return;
		var len = this.options.data.length;
		styles.top += eh + 7;
		if(this.options.dialog) {
			styles.top = eh;
			styles.top = of.top+ styles.top;
			styles.left = of.left;
		}
		styles.width = ew + 5;
		styles.position = 'absolute';
		styles.overflow = "auto";
		if(len>15) {
			styles.height = 200;
			styles.width = ew + 20;
		}		
		var dc = $(document.body);
		var sh = dc.innerHeight();
		var lh = styles.top + styles.height;
		if(lh > sh) styles.top = styles.top - styles.height - eh - 7; 
		if(this.options.styles) {
			styles.width = this.options.styles.width;
		}
		this.boundKeyHandler = boundCallback(this, 'keyHandler');
		$(document).keyup(this.boundKeyHandler);
		$('.ui-combobox-list').hide();
		this.listElem.css(styles).show();
		this.changeSelection(this.findSelection(), e);
		if(this.options.afterShow) this.options.afterShow();
	},
	showTableList : function(e) {

	},
	/**
	 * Programmatically hide the drop-down list.
	 */
	hideList: function() {
		this.listElem.hide();
		$(document).unbind('keyup', this.boundKeyHandler);
	},

	closeList: function() {
		hideList();
		if(this.arrowElem) this.arrowElem.remove();
		this.listElem.remove();
	},

	keyHandler: function(e) {
		if(this.options.disabled) {
			return;
		}

		var optionLength = this.options.data.length;
		switch(e.which) {
			case KEY_ESC:
				this.hideList(); 
				break;
			case KEY_UP:
				// JavaScript modulus apparently doesn't handle negatives
				var newIndex = this.selectedIndex - 1;
				if(newIndex < 0) {
					newIndex = optionLength - 1;
				}
				this.changeSelection(newIndex, e);
				break;
			case KEY_DOWN:
				this.changeSelection((this.selectedIndex + 1) % optionLength, e);
				break;
			case KEY_SPACEBAR:
			case KEY_ENTER:
				this.finishSelection(this.selectedIndex, e);
				break;
			default:
				this.fireEvent('key', e);
				this.changeSelection(this.findSelection());
				break;
		}
	},

	prepareCallbackObj: function(val) {
		val = val || this.element.val();
		var index = $.inArray(val, this.options.data);
		return {
			value: val,
			index: index,
			isCustom: index == -1,
			inputElement: this.element,
			listElement: this.listElement
		};
	},

	fireEvent: function(eventName, e, val) {
		//this.element.triggerHandler('combobox' + eventName, [e,	this.prepareCallbackObj(val)], this.options[eventName]);
		var fn = this.options[eventName]; if(fn) fn(e,this.prepareCallbackObj(val));
	},

	findSelection: function() {
		var data = this.options.data;
		var typed = this.element.val().toLowerCase();
		if(data && data.length>0) {
			for(var i = 0, len = data.length; i < len; ++i) {
				var index = data[i].toLowerCase().indexOf(typed);
				if(index == 0) {
					return i;
				}
			};
		
			if(this.options.matchMiddle) {
				for(var i = 0, len = data.length; i < len; ++i) {
					var index = data[i].toLowerCase().indexOf(typed);
					if(index != -1) {
						return i;
					}
				};
			}
		}
		return 0;
	},

	changeSelection: function(index, e) {
		this.selectedIndex = index;
		this.listElem.children('.selected').removeClass('selected');
		this.listElem.children(':eq(' + index + ')').addClass('selected');
		if(e) {
			this.fireEvent('change', e, this.options.data[index]);
		}
	},

	finishSelection: function(index, e) {
		var value = this.options.data[index];
		this.element.val(value);
		this.hideList();
		this.fireEvent('select', e,value);
		var fn = this.options['afterLookup']; if(fn) fn(value,this.options.dataMap[value] || value);
	}

});

	$.fn.combobox.defaults = {
				data: [],
				dataMap: {},
				picture: "",
				xmldocs : null,
				singleShow: false,
				autoShow: false,
				matchMiddle: true,
				readOnly : false, 
				canLookup : true,
				beforeLookup: function() { return true; },
				afterLookup : function(value,description) { return true; },
				change: function(e, ui) {},
				select: function(e, ui) { },
				key: function(e, ui) {},
				arrowURL: 'drop_down.png',
				arrowHTML: function() { },
				listContainerTag: 'div',
				listHTML: defaultListHTML,
				button : true
    };

var oldPlugin = $.fn.combobox;
$.fn.combobox = function(settings) {	
	var oldlk = $("#LK"+$(this).attr("id"));
	if(!oldlk.is(".ui-combobox-link-class")) oldlk.remove();
	var results = oldPlugin.apply(this, arguments);
	if(!(results instanceof $)) {
		return results;
	}
	return results;
};

function defaultListHTML(item, i,singleShow,dataMap,viewStyle) {
	//var cls = i % 2 ? 'odd' : 'even';
	//return '<span class = "jrivaly ui-combobox-item ' + cls + '">' + item + '</span>';
	var dataShow = item;
	if(!singleShow && dataMap[item]) dataShow += " - "+dataMap[item];
	if("D"==viewStyle) dataShow = dataMap[item];
	var cls = i % 2 ? 'odd' : 'even';								
	return '<span class = "jrivaly ui-combobox-item ' + cls + '" style="white-space:nowrap; ">' + dataShow + '</span>';					
};

function boundCallback(that, methodName) {
	var extraArgs = [].slice.call(arguments, 2);
	return function() {
		that[methodName].apply(that, extraArgs.concat([].slice.call(arguments)));
	};
};
$.fn.lookup = function(settings) {
	var that = $(this);
	var lookupDefaults = {
			dialogTitle : "Lookup Dialog",
			dialogWidth : 530,
			dialogHeight : 315,
			dialogURL : "../flexigrid/flexidialog.jsp?seed="+Math.random(),
			dialogFeatures : "scrollbars=no;center=yes;border=thin;help=no;status=no;resizable=yes;",
			afterLookup : function(data) { 
				//data structure is { index: ?, cell : [] } but in case of multiple data is the array 
				if(data.cell) {
					var $cell = data.cell;
					that.val($cell[0]); 
					try { $("#"+that.attr("id")+"desc").html($cell[1]); }catch(ex) { }
				} else {
					var $dat = $(data);
					if($dat.size()==1) {
						var $cell = $dat[0].cell;						
						that.val($cell[0]); 
						try { $("#"+that.attr("id")+"desc").html($cell[1]); }catch(ex) { }						
					} else {
						var $txt = "";
						$dat.each(function(idx,elm) { 
							if(idx>0) $txt = $txt + ",";
							$txt = $txt + elm.cell[0];
						});					
						that.val($txt); 
					}
				}
			},	
			defaultColumnModel : true,
			defaultSearchItems : true,
			singleSelect : true,
			title : "",
			method : "POST",
			dataType: 'xml',			
			usepager: false,
			autoload : true,
			customizeColumn : false, 
			useRp: false,
			showTableToggleBtn: false,
			width: 500,
			height: 250
	};
	var p = $.extend({},lookupDefaults, settings);	
	if(p.title) p.height = p.height==lookupDefaults.height?200:p.height;
	if(p.sortOptions) {
		p.width = p.width==lookupDefaults.width?560:p.width;
		p.dialogWidth = p.dialogWidth==lookupDefaults.dialogWidth?560:p.dialogWidth;
	}
	if(p.defaultColumnModel) {
		var autoHeight = p.dialogHeight==lookupDefaults.dialogHeight?285:p.dialogHeight;
		p = $.extend({
				columnModel : [
					{display: 'Item', name : 'item', width : 150, sortable : false, align: 'center'},
					{display: 'Description', name : 'description', width : 200, sortable : false, align: 'left'}
				]					
		},p);
		p.dialogHeight = autoHeight;
	}
	if(p.defaultSearchItems) {
		var autoHeight = p.dialogHeight==lookupDefaults.dialogHeight?285:(p.dialogHeight==285?315:p.dialogHeight);
		p = $.extend({
				searchItems : [
					{display: 'Item', name : 'item', isdefault: true},
					{display: 'Description', name : 'description'}
				]
		},p);
		p.dialogHeight = autoHeight;
	}
	p.query = that.val();
	p.selectedItems = that.val().split(",");
	if(p.url || p.xml) {
		var fs_frame_id = 'fs_lookup_iframe_' + Math.round(new Date().getTime() / 1000);
		var fs_lookupframe = $("<iframe id='"+fs_frame_id+"' name='"+fs_frame_id+"' width='100%' height='100%' scrolling='no' frameBorder='0'></iframe>");
		var fs_dialoglayer = $("<div style='display:none; padding: 5px;'></div>");
		fs_dialoglayer.append(fs_lookupframe);
		$("body").after(fs_dialoglayer);
		var fs_lookupdialog = fs_dialoglayer.dialog({
			autoOpen: false, modal: true, title: p.dialogTitle,
			width: p.dialogWidth, height: p.dialogHeight, 
			open: function( event, ui ) { 
				var par = fs_dialoglayer.parent();
				var pos = par.position();
				var h = (p.dialogHeight + 10 - par.height()) / 2;
				fs_dialoglayer.height(p.dialogHeight+10);  
				par.css("top", pos.top - h);
			},
			beforeClose: function( event, ui ) { setTimeout(function() { try { fs_dialoglayer.remove(); }catch(ex) { } },500); }
		});
		window.getShowLookupDialogArguments = function() { return p; };
		window.closeLookupDialog = function() { try { fs_lookupdialog.dialog("close"); } catch(ex) { } };
		window.afterShowLookupDialog = function(args) { 
			try { fs_lookupdialog.dialog("close"); } catch(ex) { }
			try { p.afterLookup(args); } catch(ex) { }
		};
		var fs_lookupwin = window.open(p.dialogURL,fs_frame_id);
		fs_lookupwin.opener = self;
		fs_lookupdialog.dialog("open");
		fs_lookupdialog.parent().css("zIndex",5002);
		fs_lookupdialog.parent().next(".ui-widget-overlay").css("zIndex",5001);
	}
};

})(jQuery);
