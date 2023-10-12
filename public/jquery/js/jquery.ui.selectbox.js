/*
 * Version 2.2.5
 * Demo: http://www.texotela.co.uk/code/jquery/select/
 */
 
;(function($) {
 
/**
 * Adds (single/multiple) options to a select box (or series of select boxes)
 *
 * @name     addOption
 * @author   Sam Collett (http://www.texotela.co.uk)
 * @type     jQuery
 * @example  $("#myselect").addOption("Value", "Text"); // add single value (will be selected)
 * @example  $("#myselect").addOption("Value 2", "Text 2", false); // add single value (won't be selected)
 * @example  $("#myselect").addOption({"foo":"bar","bar":"baz"}, false); // add multiple values, but don't select
 *
 */
$.fn.addOption = function()
{
	var add = function(el, v, t, sO, index)
	{
		var option = document.createElement("option");
		option.value = v, option.text = t;
		// get options
		var o = el.options;
		// get number of options
		var oL = o.length;
		if(!el.cache)
		{
			el.cache = {};
			// loop through existing options, adding to cache
			for(var i = 0; i < oL; i++)
			{
				el.cache[o[i].value] = i;
			}
		}
		if (index || index == 0)
		{
 			// we're going to insert these starting  at a specific index...
			// this has the side effect of el.cache[v] being the 
			// correct value for the typeof check below
			var ti = option;
			for(var ii =index; ii <= oL; ii++)
			{
				var tmp = el.options[ii];
				el.options[ii] = ti;
				o[ii] = ti;
				el.cache[o[ii].value] = ii;
				ti = tmp;
			}
		}
    
		// add to cache if it isn't already
		if(typeof el.cache[v] == "undefined") el.cache[v] = oL;
		el.options[el.cache[v]] = option;
		if(sO)
		{
			option.selected = true;
		}
	};
	var startindex;
	var a = arguments;
	if(a.length == 0) return this;
	// select option when added? default is true
	var sO = true;
	// multiple items
	var m = false;
	// array items
	var ary = false;
	// other variables
	var items, v, t;
	if(typeof(a[0]) == "object")
	{
		m = true;
		items = a[0];
		startindex = a[0];
	}	
	if(jQuery.isArray(a[0]))
	{
		ary = true;
		items = a[0];
		startindex = 0;
	}
	if(a.length >= 2)
	{
		if(typeof(a[1]) == "boolean")
		{
			sO = a[1];
			startindex = a[2];
		}
		else if(typeof(a[2]) == "boolean")
		{
			sO = a[2];
			startindex = a[1];
		}
		else
		{
			startindex = a[1];
		}
		if(!m)
		{
			v = a[0];
			t = a[1];
		}
	}
	var showKey = true;
	if(a.length>=3) {
			showKey = a[2];
			if(a[3]) showKey = a[3];
	}
	this.each(
		function()
		{
			if(this.nodeName.toLowerCase() != "select") return;			
			if(ary) {
				startindex = 0;
				for(var i=0;i<items.length;i++) {
					var subitems = items[i];					
					if(subitems.length>0) {
						var item = subitems[0];
						var text = "";
						if(subitems.length>1) text = subitems[1];
						add(this, item, (showKey?(text!=""?item+" - "+text:text):text), sO, startindex);
						startindex += 1;
					}
				}
			} else {
				if(m) {
					for(var item in items) {
						var text = items[item];
						add(this, item, (showKey?(text!=""?item+" - "+text:text):text), sO, startindex);
						startindex += 1;
					}
				} else {
					add(this, v, (showKey?(t!=""?v+" -"+t:t):t), sO, startindex);
				}
			}
		}
	);
	return this;
};

/**
 * Add options via ajax
 *
 * @name     ajaxAddOption
 * @author   Sam Collett (http://www.texotela.co.uk)
 * @type     jQuery
 * @param    String url      Page to get options from (must be valid JSON)
 * @param    Object params   (optional) Any parameters to send with the request
 * @param    Boolean select  (optional) Select the added options, default true
 * @param    Function fn     (optional) Call this function with the select object as param after completion
 * @param    Array args      (optional) Array with params to pass to the function afterwards
 * @example  $("#myselect").ajaxAddOption("myoptions.php");
 * @example  $("#myselect").ajaxAddOption("myoptions.php", {"code" : "007"});
 * @example  $("#myselect").ajaxAddOption("myoptions.php", {"code" : "007"}, false, sortoptions, [{"dir": "desc"}]);
 *
 */
$.fn.ajaxAddOption = function(url, params, select, fn, args)
{
	if(typeof(url) != "string") return this;
	if(typeof(params) != "object") params = {};
	if(typeof(select) != "boolean") select = true;
	this.each(
		function()
		{
			var el = this;
			$.getJSON(url,
				params,
				function(r)
				{
					$(el).addOption(r, select);
					if(typeof fn == "function")
					{
						if(typeof args == "object")
						{
							fn.apply(el, args);
						} 
						else
						{
							fn.call(el);
						}
					}
				}
			);
		}
	);
	return this;
};

/**
 * Removes an option (by value or index) from a select box (or series of select boxes)
 *
 * @name     removeOption
 * @author   Sam Collett (http://www.texotela.co.uk)
 * @type     jQuery
 * @param    String|RegExp|Number what  Option to remove
 * @param    Boolean selectedOnly       (optional) Remove only if it has been selected (default false)   
 * @example  $("#myselect").removeOption("Value"); // remove by value
 * @example  $("#myselect").removeOption(/^val/i); // remove options with a value starting with 'val'
 * @example  $("#myselect").removeOption(/./); // remove all options
 * @example  $("#myselect").removeOption(/./, true); // remove all options that have been selected
 * @example  $("#myselect").removeOption(0); // remove by index
 * @example  $("#myselect").removeOption(["myselect_1","myselect_2"]); // values contained in passed array
 *
 */
$.fn.removeOption = function()
{
	var a = arguments;
	if(a.length == 0) return this;
	var ta = typeof(a[0]);
	var v, index;
	// has to be a string or regular expression (object in IE, function in Firefox)
	if(ta == "string" || ta == "object" || ta == "function" )
	{
		v = a[0];
		// if an array, remove items
		if(v.constructor == Array)
		{
			var l = v.length;
			for(var i = 0; i<l; i++)
			{
				this.removeOption(v[i], a[1]); 
			}
			return this;
		}
	}
	else if(ta == "number") index = a[0];
	else return this;
	this.each(
		function()
		{
			if(this.nodeName.toLowerCase() != "select") return;
			// clear cache
			if(this.cache) this.cache = null;
			// does the option need to be removed?
			var remove = false;
			// get options
			var o = this.options;
			if(!!v)
			{
				// get number of options
				var oL = o.length;
				for(var i=oL-1; i>=0; i--)
				{
					if(v.constructor == RegExp)
					{
						if(o[i].value.match(v))
						{
							remove = true;
						}
					}
					else if(o[i].value == v)
					{
						remove = true;
					}
					// if the option is only to be removed if selected
					if(remove && a[1] === true) remove = o[i].selected;
					if(remove)
					{
						o[i] = null;
					}
					remove = false;
				}
			}
			else
			{
				// only remove if selected?
				if(a[1] === true)
				{
					remove = o[index].selected;
				}
				else
				{
					remove = true;
				}
				if(remove)
				{
					this.remove(index);
				}
			}
		}
	);
	return this;
};

/**
 * Sort options (ascending or descending) in a select box (or series of select boxes)
 *
 * @name     sortOptions
 * @author   Sam Collett (http://www.texotela.co.uk)
 * @type     jQuery
 * @param    Boolean ascending   (optional) Sort ascending (true/undefined), or descending (false)
 * @example  // ascending
 * $("#myselect").sortOptions(); // or $("#myselect").sortOptions(true);
 * @example  // descending
 * $("#myselect").sortOptions(false);
 *
 */
$.fn.sortOptions = function(ascending)
{
	// get selected values first
	var sel = $(this).selectedValues();
	var a = typeof(ascending) == "undefined" ? true : !!ascending;
	this.each(
		function()
		{
			if(this.nodeName.toLowerCase() != "select") return;
			// get options
			var o = this.options;
			// get number of options
			var oL = o.length;
			// create an array for sorting
			var sA = [];
			// loop through options, adding to sort array
			for(var i = 0; i<oL; i++)
			{
				sA[i] = {
					v: o[i].value,
					t: o[i].text
				}
			}
			// sort items in array
			sA.sort(
				function(o1, o2)
				{
					// option text is made lowercase for case insensitive sorting
					o1t = o1.t.toLowerCase(), o2t = o2.t.toLowerCase();
					// if options are the same, no sorting is needed
					if(o1t == o2t) return 0;
					if(a)
					{
						return o1t < o2t ? -1 : 1;
					}
					else
					{
						return o1t > o2t ? -1 : 1;
					}
				}
			);
			// change the options to match the sort array
			for(var i = 0; i<oL; i++)
			{
				o[i].text = sA[i].t;
				o[i].value = sA[i].v;
			}
		}
	).selectOptions(sel, true); // select values, clearing existing ones
	return this;
};
/**
 * Selects an option by value
 *
 * @name     selectOptions
 * @author   Mathias Bank (http://www.mathias-bank.de), original function
 * @author   Sam Collett (http://www.texotela.co.uk), addition of regular expression matching
 * @type     jQuery
 * @param    String|RegExp|Array value  Which options should be selected
 * can be a string or regular expression, or an array of strings / regular expressions
 * @param    Boolean clear  Clear existing selected options, default false
 * @example  $("#myselect").selectOptions("val1"); // with the value 'val1'
 * @example  $("#myselect").selectOptions(["val1","val2","val3"]); // with the values 'val1' 'val2' 'val3'
 * @example  $("#myselect").selectOptions(/^val/i); // with the value starting with 'val', case insensitive
 *
 */
$.fn.selectOptions = function(value, clear)
{
	var v = value;
	var vT = typeof(value);
	// handle arrays
	if(vT == "object" && v.constructor == Array)
	{
		var $this = this;
		$.each(v, function()
			{
      				$this.selectOptions(this, clear);
    			}
		);
	};
	var c = clear || false;
	// has to be a string or regular expression (object in IE, function in Firefox)
	if(vT != "string" && vT != "function" && vT != "object") return this;
	this.each(
		function()
		{
			if(this.nodeName.toLowerCase() != "select") return this;
			// get options
			var o = this.options;
			// get number of options
			var oL = o.length;
			for(var i = 0; i<oL; i++)
			{
				if(v.constructor == RegExp)
				{
					if(o[i].value.match(v))
					{
						o[i].selected = true;
					}
					else if(c)
					{
						o[i].selected = false;
					}
				}
				else
				{
					if(o[i].value == v)
					{
						o[i].selected = true;
					}
					else if(c)
					{
						o[i].selected = false;
					}
				}
			}
		}
	);
	return this;
};

/**
 * Copy options to another select
 *
 * @name     copyOptions
 * @author   Sam Collett (http://www.texotela.co.uk)
 * @type     jQuery
 * @param    String to  Element to copy to
 * @param    String which  (optional) Specifies which options should be copied - 'all' or 'selected'. Default is 'selected'
 * @example  $("#myselect").copyOptions("#myselect2"); // copy selected options from 'myselect' to 'myselect2'
 * @example  $("#myselect").copyOptions("#myselect2","selected"); // same as above
 * @example  $("#myselect").copyOptions("#myselect2","all"); // copy all options from 'myselect' to 'myselect2'
 *
 */
$.fn.copyOptions = function(to, which)
{
	var w = which || "selected";
	if($(to).size() == 0) return this;
	this.each(
		function()
		{
			if(this.nodeName.toLowerCase() != "select") return this;
			// get options
			var o = this.options;
			// get number of options
			var oL = o.length;
			for(var i = 0; i<oL; i++)
			{
				if(w == "all" || (w == "selected" && o[i].selected))
				{
					$(to).addOption(o[i].value, o[i].text);
				}
			}
		}
	);
	return this;
};

/**
 * Checks if a select box has an option with the supplied value
 *
 * @name     containsOption
 * @author   Sam Collett (http://www.texotela.co.uk)
 * @type     Boolean|jQuery
 * @param    String|RegExp value  Which value to check for. Can be a string or regular expression
 * @param    Function fn          (optional) Function to apply if an option with the given value is found.
 * Use this if you don't want to break the chaining
 * @example  if($("#myselect").containsOption("val1")) alert("Has an option with the value 'val1'");
 * @example  if($("#myselect").containsOption(/^val/i)) alert("Has an option with the value starting with 'val'");
 * @example  $("#myselect").containsOption("val1", copyoption).doSomethingElseWithSelect(); // calls copyoption (user defined function) for any options found, chain is continued
 *
 */
$.fn.containsOption = function(value, fn)
{
	var found = false;
	var v = value;
	var vT = typeof(v);
	var fT = typeof(fn);
	// has to be a string or regular expression (object in IE, function in Firefox)
	if(vT != "string" && vT != "function" && vT != "object") return fT == "function" ? this: found;
	this.each(
		function()
		{
			if(this.nodeName.toLowerCase() != "select") return this;
			// option already found
			if(found && fT != "function") return false;
			// get options
			var o = this.options;
			// get number of options
			var oL = o.length;
			for(var i = 0; i<oL; i++)
			{
				if(v.constructor == RegExp)
				{
					if (o[i].value.match(v))
					{
						found = true;
						if(fT == "function") fn.call(o[i], i);
					}
				}
				else
				{
					if (o[i].value == v)
					{
						found = true;
						if(fT == "function") fn.call(o[i], i);
					}
				}
			}
		}
	);
	return fT == "function" ? this : found;
};

/**
 * Returns values which have been selected
 *
 * @name     selectedValues
 * @author   Sam Collett (http://www.texotela.co.uk)
 * @type     Array
 * @example  $("#myselect").selectedValues();
 *
 */
$.fn.selectedValues = function()
{
	var v = [];
	this.selectedOptions().each(
		function()
		{
			v[v.length] = this.value;
		}
	);
	return v;
};

/**
 * Returns text which has been selected
 *
 * @name     selectedTexts
 * @author   Sam Collett (http://www.texotela.co.uk)
 * @type     Array
 * @example  $("#myselect").selectedTexts();
 *
 */
$.fn.selectedTexts = function()
{
	var t = [];
	this.selectedOptions().each(
		function()
		{
			t[t.length] = this.text;
		}
	);
	return t;
};

/**
 * Returns options which have been selected
 *
 * @name     selectedOptions
 * @author   Sam Collett (http://www.texotela.co.uk)
 * @type     jQuery
 * @example  $("#myselect").selectedOptions();
 *
 */
$.fn.selectedOptions = function()
{
	return this.find("option:selected");
};

function watchProperty(obj, name, handler) {
    if ('watch' in obj) {
        obj.watch(name, handler);
    } else if ('onpropertychange' in obj) {
        name= name.toLowerCase();
        obj.onpropertychange= function() {
            if (window.event.propertyName.toLowerCase()===name)
                handler.call(obj);
        };
    } else {
        var o= obj[name];
        setInterval(function() {
            var n= obj[name];
            if (o!==n) {
                o= n;
                handler.call(obj);
            }
        }, 200);
    }
}

$.widget( "ui.selectbox", {

			_create: function() {
				var options = this.applySetting(this.options,this.element);
				this.options = jQuery.extend({},options,this.options);
				this.element.attr("readOnly",options.readOnly);
				var self = this,
					select = this.element.hide(),
					//select = this.element,
					selected = select.children( ":selected" ),
					value = selected.val() ? selected.text() : "";

				    var input = this.input = $( "<input>" )
					//.insertAfter( select )
					.val(value)
					.autocomplete({
						delay: 0,
						minLength: 0,
						scroll : this.options.scroll,
						scrollWidth: this.options.scrollWidth,
						scrollHeight: this.options.scrollHeight,
						source: function( request, response ) {
							var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
							response( select.children( "option" ).map(function() {
								var text = $( this ).text();
								if ( this.value && ( !request.term || matcher.test(text) ) )
									return {
										label: text.replace(
											new RegExp(
												"(?![^&;]+;)(?!<[^<>]*)(" +
												$.ui.autocomplete.escapeRegex(request.term) +
												")(?![^<>]*>)(?![^&;]+;)", "gi"
											), "<strong>$1</strong>" ),
										value: text,
										option: this
									};
							}) );
						},
						select: function( event, ui ) {
							ui.item.option.selected = true;
							self._trigger( "selected", event, {
								item: ui.item.option
							});
						},
						change: function( event, ui ) {
							if ( !ui.item ) {
								var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( $(this).val() ) + "$", "i" ),
									valid = false;
								select.children( "option" ).each(function() {
									if ( $( this ).text().match( matcher ) ) {
										this.selected = valid = true;
										return false;
									}
								});
								if ( !valid ) {
									$( this ).val( "" );
									select.val( "" );
									input.data( "autocomplete" ).term = "";
									return false;
								}
							}
						}
					})
					.removeClass( "ui-autocomplete-input" );
					//.addClass( "ui-widget ui-widget-content ui-corner-left" );
				input.attr("readOnly",this.options.readOnly);
				input.width(this.options.width?this.options.width:this.element.width());
				var opt = this.options;
				input.data("autocomplete")._suggest = function( items ) {
					var ul = this.menu.element
						.empty()
						.zIndex( this.element.zIndex() + 1 ),
						menuWidth,
						textWidth;
						this._renderMenu( ul, items );
						//this.menu.deactivate();
						this.menu.refresh();
						this.menu.element.show().position({
							my: "left top",
							at: "left bottom",
							of: this.element,
							collision: "none"
						});
						ul.css({ maxHeight : "none", overflow : "" });
						menuWidth = ul.width( "" ).width();
						textWidth = this.element.width();
						ul.width( Math.max( menuWidth, textWidth ) );
						if((items.length>opt.maxItems) && this.options.scroll) {
							ul.scrollTop(0);
							ul.css({
								maxHeight: this.options.scrollHeight,
								//height : this.options.scrollHeight,
								overflow: 'auto'
							});		
							var awidth = input.width()>this.options.scrollWidth?input.width()+18:this.options.scrollWidth;
							$("li",ul).each(function(index,element){ 
								var li = $(this);
								li.css("width",awidth-24);
							});
							ul.width(awidth);			
						}
				};
				input.data("autocomplete")._renderItem = function( ul, item ) {
					return $( "<li class='jrivaly li-select-item-element'></li>" )
						.data( "item.autocomplete", item )
						.append( "<a class='jrivaly select-item-element'>" + item.label + "</a>" )
						.appendTo( ul );
				};
				//this.element.bind("change",function() { input.val($(this).val()); });		
				var eid = this.element.attr("id");
				watchProperty(document.getElementById(eid), 'value', function() { input.val($(":selected",this).text()); if(opt.onChange) opt.onChange(this); });
				input.addClass("form-control input-md");
				var $div = $('<div class="input-group"></div>')
				.append(input)
				.insertAfter(this.element);
				var fs_img = $('<i class="fa fa-list" aria-hidden="true"></i>');
				var button = this.button = $('<a href="javascript:void(0);" class="jrivaly lookup-select-button-class input-group-addon" ID="LK'+eid+'"></a>')
					.attr( "tabIndex", -1 )
					.attr( "title", "Show All Items" )
					.append(fs_img)
					.insertAfter( input )
					.removeClass( "ui-corner-all" )
					.addClass( "ui-corner-right ui-button-icon" )
					.click(function() {
						// close if already visible	
						if(button.attr("enabled")=="false") return;
						if ( input.autocomplete( "widget" ).is( ":visible" ) ) {
							input.autocomplete( "close" );
							return;
						}						
						// pass empty string as value to search for, displaying all results
						input.autocomplete( "search", "");
						input.focus();
					});
					if(this.options.xmlData) {
						this.composeXMLData(this.options.xmlData);
					}
					if(this.options.jsonData) {
						$(this.element).removeOption(/./);
						$(this.element).addOption(this.options.jsonData,this.options.autoDefault,this.options.showKey);
					}
					this.populate();
			},

		applySetting : function(settings,element) {
			var options = jQuery.extend({
					width : 0,
					scroll : true,
					scrollWidth: 100,
					scrollHeight: 225,
					maxItems : 10,
					enabled : true,
					readOnly : false,
					autoDefault : false,
					showKey : false,
					autoResize : true,
					dataType: "xml",
					url : false,
					method : "GET",
					param : "",
					dynamicTag : "root row",
					itemIndex : [0,1],
					afterPopulate : function(data,status,xhr) { },
					onChange : function(element) { },
					onError : function(xhr) { }
			}, settings);			
			return options;				
		},
			composeJSONData : function(data) {
				//alert("compose json data : "+data);
				$(this.element).removeOption(/./);
				$(this.element).addOption(data,this.options.autoDefault,this.options.showKey);
				if(this.options.autoResize) {
					var w = this.element.width();
					if(w<this.options.width) w = this.options.width;
					if(w>0) $(this.input).width(w);
				}
				$(this.input).val($(":selected",this.element).text());
			},
			composeXMLData : function(data) {
				var jsMap = {};
				var idx = this.options.itemIndex;
				$(this.options.dynamicTag,data).each(				 
				 	function (index,element) {
							var robj = this;
							var rchild = $(this).children();
							var ary = jQuery.map(rchild.toArray(),function(n,i) { return $(n).text(); });
							jsMap[ary[idx[0]]] = ary[idx[1]];
				});
				this.composeJSONData(jsMap);
			},
			composeData : function(data) {
				if(this.options.dataType=='xml') {
					this.composeXMLData(data);
				} else if(this.options.dataType=='json') {
					this.composeJSONData(data);
				}
			},
		rebind : function() {
				$(this.input).val($(":selected",this.element).text());
			},
		populate : function() {
			var that = this;
			if (!this.options.url) return false;				
				$.ajax({
					contentType : "application/x-www-form-urlencoded; charset=UTF-8",
					type: this.options.method,
					url: this.options.url,
					data: this.options.param,
					dataType: this.options.dataType,
					success: function(data,status,xhr){ that.composeData(data); if(that.options.afterPopulate) that.options.afterPopulate(data,status,xhr); },
					error: function(xhr,status,errorThrown) { try { if (that.options.onError) that.options.onError(xhr,status,errorThrown); } catch (e) {} }
				});
		},
		_setOption: function(key, value){
			this.options[key] = value;
			if(key=="readOnly") { 
				this.input.attr("readOnly",value); 
				this.element.attr("readOnly",value); 
			}
			if(key=="enabled") {
				this.button.attr("enabled",value);
				this.input.attr("enabled",value);
				this.element.attr("enabled",value);
			}
			if(key=="jsonData") {
				$(this.element).removeOption(/./);
				$(this.element).addOption(this.options.jsonData,this.options.autoDefault,this.options.showKey);
				if(this.options.autoResize) {
					var w = this.element.width();
					if(w<this.options.width) w = this.options.width;
					if(w>0) $(this.input).width(w);
				}
			}
			if(key=="xmlData") {
				this.composeXMLData(this.options.xmlData);
			}
			if(key=="width") {
				this.input.css("width",value);
			}
			if(key=="height") {
				this.input.css("height",value);
			}
			if(key=="rebind") {
					this.rebind();
			}
		},

			destroy: function() {
				this.input.remove();
				this.button.remove();
				this.element.show();
				$.Widget.prototype.destroy.call( this );
			}
		});

	$.fn.rebindSelect = function(p) { // function to refresh value from select box to input text
		return this.each( function() {
				if(this.rebind) this.rebind();
		});
	}; 

})(jQuery);