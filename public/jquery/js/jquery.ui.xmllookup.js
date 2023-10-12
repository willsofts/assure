;(function($) {
	
var KEY_UP = 38,
	KEY_DOWN = 40,
	KEY_ENTER = 13,
	KEY_ESC = 27,
	KEY_F4 = 115,
	KEY_SPACEBAR = 32;
var regPicture = /[9XEATxea]/; 

$.widget('ui.xmllookup', {

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
		this.element.attr("readOnly",options.readOnly);
		function closeListOnDocumentClick() {
			that.hideList();
			$(document).unbind('click', closeListOnDocumentClick);
		};
		if(options.button) {
		this.arrowElem = $(options.arrowHTML.call(this))
			.click(function(e) {
				if(that.element.is(":disabled")) return false;
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
		
		this.element.after(this.arrowElem);
		}
		//this.listElem = this.buildList().insertAfter(this.arrowElem).hide();
		if(options.dialog) {
			//this.listElem = this.buildList().insertAfter(options.container).hide();
			var id = "fsccommboo"+Math.random();
			var input = $('<input type="text" id="' + id +'" style="position: absolute; top: -100px; width: 0px; z-index: -10;"/>');
			$("body").append(input);
			this.listElem = this.buildList().insertAfter(input).hide();
		}else { 
			this.listElem = this.buildList().insertAfter(this.element).hide();
		}
		if(options.autoShow) {
			this.element
				.focus(boundCallback(this, 'showList'))
				.blur(function(e) {
					that.finishSelection(that.selectedIndex, e);
					that.hideList();
				});
		}
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
		var fs_img = $('<IMG  align="absmiddle"  class="jrivaly lookupbuttonclass" SRC="../lookup/spacer.gif" ALT="">').mouseover(function(){ $(this).addClass('ui-lookupbuttonclass-hover');}).mouseout(function(){$(this).removeClass("ui-lookupbuttonclass-hover");});
		//var fs_alink = '<A href="#0" tabIndex="-1"  ID="LK'+eid+'" style="cursor: pointer;"  class="jrivaly lookup-link-class" ondeactivate="fs_rival_deactivate('+eid+',this)" onbeforedeactivate="fs_rival_beforedeactivate('+eid+',this)"></A>';
		this.fs_alink = $('<A href="#0" tabIndex="-1"  ID="LK'+eid+'" style="cursor: pointer;" class="jrivaly lookup-link-class ui-combobox-link-class"></A>').bind("ondeactivate",function() {fs_rival_deactivate(eid,this);}).bind("onbeforedeactivate",function(){fs_rival_beforedeactivate(eid,this);});
		var options = jQuery.extend({
				data: [],
				dataMap: {},
				picture: "",
				xmldocs : null,
				singleShow: "both",
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

	composeXSL : function(dataMap) {  
		var result = '';  
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
				var selectelement = parentnode.nodeName;  
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
					var xpath = "/"+rownode.nodeName;					
					var prnode = rownode.parentNode;
					while(prnode && (prnode.nodeName!=parentnode.nodeName)) { 
						xpath = "/"+prnode.nodeName+xpath; 
						prnode = prnode.parentNode;
					}
					selectelement += xpath;
					var rownodechilds = $(rownode).children();
		 			if(rownodechilds.length>0) {  
		 				element1 = rownodechilds[0].nodeName;  
		 				if(rownodechilds.length>1) {  
		 					element2 = rownodechilds[1].nodeName;						  
		 				}					  
		 			}
				}
				var aelem = this.element;
				var afn = this.options['afterLookup'];
				window.choosedData = function(src,idx) { 
					var value = src.getAttribute("itemcode");
					var desc = src.getAttribute("itemdescription");
					aelem.val(value);
					if(afn) afn(value,desc);
				}
				var singleShow = this.options.singleShow;
		 				var astr = "</script"; 
		 				var xslstr = new String('<?xml version="1.0"?><xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"> ');
		 				xslstr += '<xsl:template match="/">'+  
		 				'<table id="lookup" width="100%"  border="0" cellspacing="0" class="ui-state-default"> '+  
		 				'<xsl:for-each select="'+selectelement+'"> '+  
		 				'<tr class="odd"> '+  
		 				'<xsl:if test="position() mod 2 = 0"><xsl:attribute name="class">event</xsl:attribute></xsl:if> '+  
		 				'<td class="elementline jrivaly ui-combobox-item" width="100%" style="cursor: pointer;" > '+  
						'<xsl:attribute name="itemcode"><xsl:value-of select="'+element1+'"/></xsl:attribute>';
						if(element2) xslstr += '<xsl:attribute name="itemdescription"><xsl:value-of select="'+element2+'"/></xsl:attribute>';
		 				xslstr += '<xsl:attribute name="onclick">choosedData(this,<xsl:value-of select="position() - 1"/>)</xsl:attribute> '+  
		 				'<div class="elementlayer" width="100%"> '+  
		 				'<a href="#" tabIndex="-1" ondragstart="return false;" class="jrivaly ui-combobox-item-link" style="white-space:nowrap; text-decoration: none; width:100%;" > '; 
						if(!singleShow) singleShow = "both";
						if(singleShow=="key") {
		 					xslstr += '<xsl:value-of select="'+element1+'"/> ';  
						} else {
							if(singleShow=="value" && element2) xslstr += '<xsl:value-of select="'+element2+'"/>';   
		 					if(singleShow=="both") {
								xslstr += '<xsl:value-of select="'+element1+'"/> ';  
								if(element2) xslstr += ' - <xsl:value-of select="'+element2+'"/>';  
							}
						}
		 				xslstr = xslstr +  '</a> </div> </td> ';  
		 				xslstr = xslstr + '</tr> </xsl:for-each> </table></xsl:template> </xsl:stylesheet> ';  
						result = xslstr;
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

	getData : function(key) {
		return this.composeXSL();
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
	getDataCount : function() {
		var result = 0;
		try { result = this.options.data.length; } catch(ex) { }
		if(this.options.xmldocs) {
			if(this.options.dynamicTag) {
				var childs = $(this.options.dynamicTag,this.options.xmldocs);
		 		result = childs.length;
			} else {
				var childs = $(this.options.xmldocs).children();
		 		result = childs.children().length;
			}
		}
		return result;
	},
	buildNormalList : function() {
		var that = this;
		var options = this.applySetting(this.options,this.element);
		var tag = options.listContainerTag;
		var elem = $('<' + tag + ' style="z-Index:1999999;" class = "jrivaly ui-combobox-list">' + '</' + tag + '>');	
		
		options.dataMap = {};
		this.options.dataMap = {};
		/*
		if(!$.isArray(options.data)) {
			options.dataMap = options.data;
			this.options.data = [];
			options.data = [];
			for(var p in options.dataMap) { 
				this.options.data.push(p); 
				options.data.push(p);
			};
		}
		*/
		this.options.dataMap = options.dataMap;		
		if(this.options.xmldocs) {
			//this.options.data = this.composeLookupDatas(this.options.dataMap);
			//options.data = this.options.data;
			var xsldocs = $.parseXML(this.composeXSL());
			$(elem).html($.transform(this.options.xmldocs,xsldocs));
		}
		/*
		$.each(options.data, function(i, val) {
			$(options.listHTML(val, i,options.singleShow,options.dataMap,options.viewStyle))
				.appendTo(elem)
				.click(boundCallback(that, 'finishSelection', i))
				.mouseover(boundCallback(that, 'changeSelection', i));
		});
		*/
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
		/*
		if(!$.isArray(this.options.data)) {
			this.options.dataMap = this.options.data;
			this.options.data = [];
			for(var p in this.options.dataMap) { 
				this.options.data.push(p); 
			};
		}*/
		var of = this.element.offset();
		var styles = this.element.position();
		if(this.options.xmldocs) { 
			//this.listElem = this.buildList().replaceAll(this.listElem); 
		}
		//if(!this.options.data) return;
		var len = this.getDataCount(); //this.options.data.length;
		styles.top += this.element.height() + 7;
		if(this.options.dialog) {
			styles.top = this.element.height();
			styles.top = of.top+ styles.top;
			styles.left = of.left;
		}
		styles.width = this.element.width() + 5;
		styles.position = 'absolute';
		styles.overflow = "auto";		
		if(len>15) {
			styles.height = 200;
			styles.width = this.element.width() + 20;
		}		
		var dc = $(document.body);
		var sh = dc.innerHeight();
		var lh = styles.top + styles.height;
		if(lh > sh) styles.top = styles.top - styles.height - this.element.height() - 7; 
		if(this.options.styles) {
			styles.width = this.options.styles.width;
			if(this.options.styles.height) styles.height = this.options.styles.height;
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
	    try{
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
		}catch(ex) { }
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

	$.fn.xmllookup.defaults = {
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

var oldPlugin = $.fn.xmllookup;
$.fn.xmllookup = function(settings) {	
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

})(jQuery);
