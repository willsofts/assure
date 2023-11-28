/*
	Masked Input plugin for jQuery
	Version: 1.2.2 (03/09/2009 22:39:06)
	Modification : build 1.0 (23/11/2010)
	Usage : ex. 
		$("#mask1").mask("99/99/9999",{placeholder:"_"});
		$("#mask2").mask("aaaaaaaa");
		$("#mask3").mask("AAAAAAAAAA");
		$("#mask4").mask("eeeeeee");
		$("#mask5").mask("EEEEEE");
		$("#mask6").mask("xxxxxxxxxx");
		$("#mask7").mask("XXXXXXXXXX");
		$("#mask8").mask("(100)T");
		$("#mask9").mask("**********");		
*/
(function($) {
	var pasteEventName = "input.mask";
	var iPhone = (window.orientation != undefined);
	$.mask = {
		//Predefined character definitions
		definitions: {
			'9': "[0-9]",
			'*': "[A-Za-z0-9]",
			'E':"[A-Z]",
			'e':"[A-Za-z]",
			'A':"[A-Z0-9#&+_-]",
			'a':"[A-Za-z0-9#&+_-]",
			'X':"[A-Z0-9!\"#$%&'()*+,.\\/:;<=>?@^_`{|}~-]",
			'x':"[A-Za-z0-9!\"#$%&'()*+,.\\/:;<=>?@^_`{|}~-]",
			'T':"[^~]"
		}
	};
	$.fn.extend({
		//Helper Function for Caret positioning
		caret: function(begin, end) {
			if (this.length == 0) return;
			if (typeof begin == 'number') {
				end = (typeof end == 'number') ? end : begin;
				return this.each(function() {
					if (this.setSelectionRange) {
						this.focus();
						this.setSelectionRange(begin, end);
					} else if (this.createTextRange) {
						var range = this.createTextRange();
						range.collapse(true);
						range.moveEnd('character', end);
						range.moveStart('character', begin);
						range.select();
					}
				});
			} else {
				if (this[0].setSelectionRange) {
					begin = this[0].selectionStart;
					end = this[0].selectionEnd;
				} else if (document.selection && document.selection.createRange) {
					var range = document.selection.createRange();
					begin = 0 - range.duplicate().moveStart('character', -100000);
					end = begin + range.text.length;
				}
				return { begin: begin, end: end };
			}
		},
		unmask: function() { return this.trigger("unmask"); },
		mask: function(mask, settings) {
			if (!mask && this.length > 0) {
				var input = $(this[0]);
				var tests = input.data("tests");
				return $.map(input.data("buffer"), function(c, i) {
					return tests[i] ? c : null;
				}).join('');
			}
			settings = $.extend({
				placeholder: "",
				entirely: false,
				completed: null
			}, settings);
			var defs = $.mask.definitions;
			var tests = [];
			var firstIdx = mask.indexOf("(");
			var lastIdx = mask.indexOf(")");
			if(firstIdx>=0 && lastIdx>=0) {
				var count = mask.substring(firstIdx+1,lastIdx);
				var buf = mask.substring(0,firstIdx);
				var str2 = mask.substring(lastIdx+1);
				var cntr = eval(count);
				for(var i=0;i<cntr;i++) buf += str2.charAt(0);
				buf += str2.substring(1);
				mask = buf;
			}
			var firstNonMaskPos = null;
			var partialPosition = mask.length;
			var len = mask.length;
			$.each(mask.split(""), function(i, c) {
				if (c == '?') {
					len--;
					partialPosition = i;
				} else if (defs[c]) {
					tests.push(new RegExp(defs[c]));
					if(firstNonMaskPos==null)
						firstNonMaskPos =  tests.length - 1;
				} else {
					tests.push(null);
				}
			});			
			return this.each(function() {
				var input = $(this);
				var buffer = $.map(mask.split(""), function(c, i) { if (c != '?') return defs[c] ? settings.placeholder : c });
				var ignore = false;  			//Variable for ignoring control keys
				var focusText = input.val();
				var keycode = "";
				input.data("buffer", buffer).data("tests", tests);
				var mask_input = buffer.join('');
				function seekNext(pos) {
					while (++pos <= len && !tests[pos]);
					return pos;
				};
				function shiftL(pos) {
					if(pos>-1&&pos<len)
					{
						while (!tests[pos] && --pos >= 0);
						for (var i = pos; i < len; i++) {
							if (tests[i]) {
								buffer[i] = settings.placeholder;
								var j = seekNext(i);
								if (j < len && tests[i].test(buffer[j])) {
									buffer[i] = buffer[j];
								} else
									break;
							}
						}
						writeBuffer();
						input.caret(Math.max(firstNonMaskPos, pos));
					}
				};
				function shiftL2(begin,end) {
					if(begin>-1&&begin<len)
					{
						while (!tests[begin] && --begin >= 0);
						writeBuffer();
						input.caret(Math.max(firstNonMaskPos, begin));
					}
				};
				function shiftR(pos) {
					for (var i = pos, c = settings.placeholder; i < len; i++) {
						if (tests[i]) {
							var j = seekNext(i);
							var t = buffer[i];
							buffer[i] = c;
							if (j < len && tests[j].test(t))
								c = t;
							else
								break;
						}
					}
				};
				function keydownEvent(e) {	
					if($(this).is("[readonly]")) return true;
					var pos = $(this).caret();
					var k = e.charCode || e.keyCode || e.which;
					keycode = e.charCode || e.keyCode || e.which;
					ignore = (k < 16 || (k > 16 && k < 32) || (k > 32 && k < 41));
					//delete selection before proceeding
					if ((pos.begin - pos.end) != 0 && (!ignore || k == 8 || k == 46)){
						clearBuffer(pos.begin, pos.end);						
					}
					//backspace, delete, and escape get special treatment
					if (k == 8 || k == 46 || (iPhone && k == 127)) {//backspace/delete
						if((pos.begin-pos.end)!=0){
							shiftL2(pos.begin,pos.end);
							if(input.val()==mask_input){
								input.val("");
							} 
						}
						else{
							shiftL((pos.begin + (k == 46 ? 0 : -1)));
							if(input.val()==mask_input){
								input.val("");
							} 
						}
						return false;
					} else if (k == 27) {//escape
						input.val(focusText);
						input.caret(0, checkVal());
						return false;
					}
				};				
				function checkLength()
				{
					if(settings.placeholder!=""){
						if((input.val().indexOf(settings.placeholder)>-1)||input.val().length==0)
						{
							return true;
						}
						else
						{
							return false;
						}
					}
					if(input.val().length<mask.length)
					{
						return true;
					}
					return false;
				}
				function keypressEvent(e) {
					if($(this).is("[readonly]")) return true;
					if (ignore) {
						ignore = false;
						//Fixes Mac FF bug on backspace
						return (e.keyCode == 8) ? false : null;
					}
					e = e || window.event;
					var k = e.charCode || e.keyCode || e.which;
					var pos = $(this).caret();
					if(checkLetter()) {clearBuffer2();}
					//alert("keycode in keypress : "+k+" character : "+String.fromCharCode(k)+" keycode in keydown: "+keycode);
					if (e.ctrlKey || e.altKey || e.metaKey) {//Ignore
						return true;
					} else if ((keycode >= 32 && keycode <= 125&&keycode!=45&&keycode!=46) || keycode >= 186) {//typeable characters
						var p = seekNext(pos.begin - 1);
						if(checkLength()||((pos.begin-pos.end)!=0))
						{
							if (p < len) {								
								if(input.val().length==0) buffer = $.map(mask.split(""), function(c, i) { if (c != '?') return defs[c] ? settings.placeholder : c });
								if(settings.placeholder!=""){ writeBuffer();}
								var c = String.fromCharCode(k);
								if(isUpper(findDefs(tests[p].source))) c = c.toUpperCase();
								if (tests[p].test(c)) {
									shiftR(p);
									buffer[p] = c;
									writeBuffer();
									var next = seekNext(p);
									$(this).caret(next);
									if (settings.completed && next == len)
										settings.completed.call(input);
	
								}
							}						
						}						
					}					
					return false;
				};
				function clearBuffer(start, end) {					
					for (var i = start; i < end && i < len; i++) {
						if (tests[i])  
							buffer[i] = settings.placeholder; 
					}
					
					if(checkLetter())
					{
						var j = 0;
						var temp = $.map(mask.split(""), function(c, i) { if (c != '?') return defs[c] ? settings.placeholder : c });
						for (var i=0;i<buffer.length ;i++ )
						{
							if((buffer[i]!="")&&(tests[i]))
							{
								temp[j++] = buffer[i];
							}
						}
						buffer = temp;
					}
					
					
				};
				function clearBuffer2() {	
					if(!checkBuffer()){
						var j = 0;
						var temp = $.map(mask.split(""), function(c, i) { if (c != '?') return defs[c] ? settings.placeholder : c });
						for (var i=0;i<buffer.length ;i++ ){
							if((buffer[i]!="")&&(tests[i]))	{
								temp[j++] = buffer[i];
							}
							else{
								break;
							}
						}
						buffer = temp;
					}	
					
				};
				function checkBuffer() {
					if(input.val().length>-1)
					{
						var temp_input="";
						for (var i = 0; i < len; i++) {
							if (buffer[i]=="") {break;}
							temp_input = temp_input+buffer[i];
						}
						if(buffer.join('')==temp_input) {return true;}
					}
					return false;
				};
				function checkLetter()
				{
					for(var i=0;i<mask.length;i++)
					{
						if(defs[mask.charAt(i)]==null)
						{
							return false;
						}
					}
					return true;
				};
				function findDefs(src) { for(var p in defs) { if(defs[p]==src) return p; } return ""; };
				function isUpper(c) { return c=='E' || c=='A' || c=='X'; };
				function writeBuffer() { return input.val(buffer.join('')).val(); };
				function checkVal(allow) {
					//try to place characters where they belong
					var test = input.val();
					var lastMatch = -1;
					for (var i = 0, pos = 0; i < len; i++) {
						if (tests[i]) {
							buffer[i] = settings.placeholder;
							while (pos++ < test.length) {
								var c = test.charAt(pos - 1);
								if (tests[i].test(c)) {
									buffer[i] = c;
									lastMatch = i;
									break;
								}
							}
							if (pos > test.length)
								break;
						} else if (buffer[i] == test[pos] && i!=partialPosition) {
							pos++;
							lastMatch = i;
						} 
					}
					if (!allow && lastMatch + 1 < partialPosition) {
						if(settings.entirely) {
							input.val("");
							clearBuffer(0, len);
						}
					} else if (allow || lastMatch + 1 >= partialPosition) {
						writeBuffer();
						if (!allow) input.val(input.val().substring(0, lastMatch + 1));
					}
					return (partialPosition ? i : firstNonMaskPos);
				};
				if (!input.attr("readonly"))
					input
					.one("unmask", function() {
						input
							.unbind(".mask")
							.removeData("buffer")
							.removeData("tests");
					})
					.bind("focus.mask", function() {
						focusText = input.val();
						var pos = checkVal();
						/*
						if(settings.placeholder!="")
						{
							writeBuffer();
						}
						*/
						if (pos == mask.length)
							input.caret(0, pos);
						else
							input.caret(pos);
					})
					.bind("blur.mask", function() {
						checkVal();
						if (input.val() != focusText)
							input.change();
					})
					.bind("keydown.mask", keydownEvent)
					.bind("keypress.mask", keypressEvent)						
					.bind(pasteEventName, function() {
						setTimeout(function() { input.caret(checkVal(true)); }, 0);
					});
				checkVal(); //Perform initial check for existing values
			});
		}
	});
})(jQuery);