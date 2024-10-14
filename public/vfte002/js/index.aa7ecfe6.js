/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 8435:
/***/ (function(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var core_js_modules_es_array_push_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4114);
/* harmony import */ var core_js_modules_es_array_push_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_push_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6587);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_1__);


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
(function ($) {
  var pasteEventName = "input.mask";
  var iPhone = window.orientation != undefined;
  $.mask = {
    //Predefined character definitions
    definitions: {
      '9': "[0-9]",
      '*': "[A-Za-z0-9]",
      'E': "[A-Z]",
      'e': "[A-Za-z]",
      'A': "[A-Z0-9#&+_-]",
      'a': "[A-Za-z0-9#&+_-]",
      'X': "[A-Z0-9!\"#$%&'()*+,.\\/:;<=>?@^_`{|}~-]",
      'x': "[A-Za-z0-9!\"#$%&'()*+,.\\/:;<=>?@^_`{|}~-]",
      'T': "[^~]"
    }
  };
  $.fn.extend({
    //Helper Function for Caret positioning
    caret: function (begin, end) {
      if (this.length == 0) return;
      if (typeof begin == 'number') {
        end = typeof end == 'number' ? end : begin;
        return this.each(function () {
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
        return {
          begin: begin,
          end: end
        };
      }
    },
    unmask: function () {
      return this.trigger("unmask");
    },
    mask: function (mask, settings) {
      if (!mask && this.length > 0) {
        var $input = $(this[0]);
        var tests = $input.data("tests");
        return $.map($input.data("buffer"), function (c, i) {
          return tests[i] ? c : null;
        }).join('');
      }
      settings = $.extend({
        placeholder: "",
        entirely: false,
        completed: null
      }, settings);
      var defs = $.mask.definitions;
      tests = [];
      var firstIdx = mask.indexOf("(");
      var lastIdx = mask.indexOf(")");
      if (firstIdx >= 0 && lastIdx >= 0) {
        var count = mask.substring(firstIdx + 1, lastIdx);
        var buf = mask.substring(0, firstIdx);
        var str2 = mask.substring(lastIdx + 1);
        var cntr = eval(count);
        for (var i = 0; i < cntr; i++) buf += str2.charAt(0);
        buf += str2.substring(1);
        mask = buf;
      }
      var firstNonMaskPos = null;
      var partialPosition = mask.length;
      var len = mask.length;
      $.each(mask.split(""), function (i, c) {
        if (c == '?') {
          len--;
          partialPosition = i;
        } else if (defs[c]) {
          tests.push(new RegExp(defs[c]));
          if (firstNonMaskPos == null) firstNonMaskPos = tests.length - 1;
        } else {
          tests.push(null);
        }
      });
      return this.each(function () {
        var $input = $(this);
        var buffer = $.map(mask.split(""), function (c) {
          if (c != '?') return defs[c] ? settings.placeholder : c;
        });
        var ignore = false; //Variable for ignoring control keys
        var focusText = $input.val();
        var keycode = "";
        $input.data("buffer", buffer).data("tests", tests);
        var mask_input = buffer.join('');
        function seekNext(pos) {
          while (++pos <= len && !tests[pos]);
          return pos;
        }
        function shiftL(pos) {
          if (pos > -1 && pos < len) {
            while (!tests[pos] && --pos >= 0);
            for (var i = pos; i < len; i++) {
              if (tests[i]) {
                buffer[i] = settings.placeholder;
                var j = seekNext(i);
                if (j < len && tests[i].test(buffer[j])) {
                  buffer[i] = buffer[j];
                } else break;
              }
            }
            writeBuffer();
            $input.caret(Math.max(firstNonMaskPos, pos));
          }
        }
        function shiftL2(begin) {
          if (begin > -1 && begin < len) {
            while (!tests[begin] && --begin >= 0);
            writeBuffer();
            $input.caret(Math.max(firstNonMaskPos, begin));
          }
        }
        function shiftR(pos) {
          for (var i = pos, c = settings.placeholder; i < len; i++) {
            if (tests[i]) {
              var j = seekNext(i);
              var t = buffer[i];
              buffer[i] = c;
              if (j < len && tests[j].test(t)) c = t;else break;
            }
          }
        }
        function keydownEvent(e) {
          if ($(this).is("[readonly]")) return true;
          var pos = $(this).caret();
          var k = e.charCode || e.keyCode || e.which;
          keycode = e.charCode || e.keyCode || e.which;
          ignore = k < 16 || k > 16 && k < 32 || k > 32 && k < 41;
          //delete selection before proceeding
          if (pos.begin - pos.end != 0 && (!ignore || k == 8 || k == 46)) {
            clearBuffer(pos.begin, pos.end);
          }
          //backspace, delete, and escape get special treatment
          if (k == 8 || k == 46 || iPhone && k == 127) {
            //backspace/delete
            if (pos.begin - pos.end != 0) {
              shiftL2(pos.begin, pos.end);
              if ($input.val() == mask_input) {
                $input.val("");
              }
            } else {
              shiftL(pos.begin + (k == 46 ? 0 : -1));
              if ($input.val() == mask_input) {
                $input.val("");
              }
            }
            triggerInput($input);
            return false;
          } else if (k == 27) {
            //escape
            $input.val(focusText);
            $input.caret(0, checkVal());
            return false;
          }
        }
        function checkLength() {
          if (settings.placeholder != "") {
            if ($input.val().indexOf(settings.placeholder) > -1 || $input.val().length == 0) {
              return true;
            } else {
              return false;
            }
          }
          if ($input.val().length < mask.length) {
            return true;
          }
          return false;
        }
        function keypressEvent(e) {
          if ($(this).is("[readonly]")) return true;
          if (ignore) {
            ignore = false;
            //Fixes Mac FF bug on backspace
            return e.keyCode == 8 ? false : null;
          }
          e = e || window.event;
          var k = e.charCode || e.keyCode || e.which;
          var pos = $(this).caret();
          if (checkLetter()) {
            clearBuffer2();
          }
          //alert("keycode in keypress : "+k+" character : "+String.fromCharCode(k)+" keycode in keydown: "+keycode);
          if (e.ctrlKey || e.altKey || e.metaKey) {
            //Ignore
            return true;
          } else if (keycode >= 32 && keycode <= 125 && keycode != 45 && keycode != 46 || keycode >= 186) {
            //typeable characters
            var p = seekNext(pos.begin - 1);
            if (checkLength() || pos.begin - pos.end != 0) {
              if (p < len) {
                if ($input.val().length == 0) buffer = $.map(mask.split(""), function (c) {
                  if (c != '?') return defs[c] ? settings.placeholder : c;
                });
                if (settings.placeholder != "") {
                  writeBuffer();
                }
                var c = String.fromCharCode(k);
                if (isUpper(findDefs(tests[p].source))) c = c.toUpperCase();
                if (tests[p].test(c)) {
                  shiftR(p);
                  buffer[p] = c;
                  writeBuffer();
                  var next = seekNext(p);
                  $(this).caret(next);
                  if (settings.completed && next == len) {
                    settings.completed.call($input);
                  }
                }
              }
            }
            triggerInput($input);
          }
          return false;
        }
        function clearBuffer(start, end) {
          for (let i = start; i < end && i < len; i++) {
            if (tests[i]) buffer[i] = settings.placeholder;
          }
          if (checkLetter()) {
            var j = 0;
            var temp = $.map(mask.split(""), function (c) {
              if (c != '?') return defs[c] ? settings.placeholder : c;
            });
            for (let i = 0; i < buffer.length; i++) {
              if (buffer[i] != "" && tests[i]) {
                temp[j++] = buffer[i];
              }
            }
            buffer = temp;
          }
        }
        function clearBuffer2() {
          if (!checkBuffer()) {
            var j = 0;
            var temp = $.map(mask.split(""), function (c) {
              if (c != '?') return defs[c] ? settings.placeholder : c;
            });
            for (var i = 0; i < buffer.length; i++) {
              if (buffer[i] != "" && tests[i]) {
                temp[j++] = buffer[i];
              } else {
                break;
              }
            }
            buffer = temp;
          }
        }
        function checkBuffer() {
          if ($input.val().length > -1) {
            var temp_input = "";
            for (var i = 0; i < len; i++) {
              if (buffer[i] == "") {
                break;
              }
              temp_input = temp_input + buffer[i];
            }
            if (buffer.join('') == temp_input) {
              return true;
            }
          }
          return false;
        }
        function checkLetter() {
          for (var i = 0; i < mask.length; i++) {
            if (defs[mask.charAt(i)] == null) {
              return false;
            }
          }
          return true;
        }
        function findDefs(src) {
          for (var p in defs) {
            if (defs[p] == src) return p;
          }
          return "";
        }
        function isUpper(c) {
          return c == 'E' || c == 'A' || c == 'X';
        }
        function writeBuffer() {
          let v = buffer.join('');
          $input.val(v);
          return v;
        }
        function triggerInput($input) {
          $input.get(0).dispatchEvent(new Event('input', {
            bubbles: true
          }));
        }
        function checkVal(allow) {
          //try to place characters where they belong
          var test = $input.val();
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
              if (pos > test.length) break;
            } else if (buffer[i] == test[pos] && i != partialPosition) {
              pos++;
              lastMatch = i;
            }
          }
          if (!allow && lastMatch + 1 < partialPosition) {
            if (settings.entirely) {
              $input.val("");
              clearBuffer(0, len);
            }
          } else if (allow || lastMatch + 1 >= partialPosition) {
            writeBuffer();
            if (!allow) {
              $input.val($input.val().substring(0, lastMatch + 1));
            }
          }
          return partialPosition ? i : firstNonMaskPos;
        }
        if (!$input.attr("readonly")) $input.one("unmask", function () {
          $input.unbind(".mask").removeData("buffer").removeData("tests");
        }).bind("focus.mask", function () {
          focusText = $input.val();
          let pos = checkVal();
          if (pos == mask.length) $input.caret(0, pos);else $input.caret(pos);
        }).bind("blur.mask", function () {
          checkVal();
          if ($input.val() != focusText) {
            $input.trigger("change");
          }
        }).bind("keydown.mask", keydownEvent).bind("keypress.mask", keypressEvent).bind(pasteEventName, function () {
          setTimeout(function () {
            $input.caret(checkVal(true));
          }, 0);
          return false;
        });
        checkVal(); //Perform initial check for existing values
      });
    }
  });
})((jquery__WEBPACK_IMPORTED_MODULE_1___default()));

/***/ }),

/***/ 3230:
/***/ (function(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {

"use strict";

// EXTERNAL MODULE: ./node_modules/jquery/dist/jquery.js
var jquery = __webpack_require__(6587);
var jquery_default = /*#__PURE__*/__webpack_require__.n(jquery);
// EXTERNAL MODULE: ./node_modules/jquery-ui-dist/jquery-ui.js
var jquery_ui = __webpack_require__(9827);
// EXTERNAL MODULE: ./node_modules/bootstrap/dist/js/bootstrap.js
var bootstrap = __webpack_require__(5707);
// EXTERNAL MODULE: ./node_modules/bootbox/bootbox.js
var bootbox = __webpack_require__(954);
// EXTERNAL MODULE: ./src/assets/jquery/js/jquery.maskedinput.js
var jquery_maskedinput = __webpack_require__(8435);
;// CONCATENATED MODULE: ./src/assets/jquery/js/jquery.ui.styleswitcher.js

(jquery_default()).fn.styleswitcher = function (settings) {
  var options = jquery_default().extend({
    loadStyle: null,
    initialText: 'Style Selection',
    width: 180,
    height: 200,
    $styleInput: null,
    styleURL: "/api/style/category",
    cdnURL: "https://cdn.jsdelivr.net/gh/willsofts/will-asset@1.0.0",
    closeOnSelect: true,
    buttonHeight: 33,
    onOpen: function () {},
    onClose: function () {},
    onSelect: function () {}
  }, settings);
  var button = jquery_default()('<a href="javascript:void(0)" class="jquery-ui-styleswitcher-trigger"><span class="jquery-ui-styleswitcher-icon"></span><span class="jquery-ui-styleswitcher-title">' + options.initialText + '</span></a>');
  if (options.$styleInput) {
    if (options.$styleInput.val() != "") {
      var styleName = "<i class='" + options.$styleInput.val() + "' aria-hidden='true'></i>";
      button.find('.jquery-ui-styleswitcher-title').html(styleName);
    }
  }
  var gallery = '<div class="jquery-ui-styleswitcher">' + '<div id="styleGallery">' + '<ul id="styleGalleryLists">' + '<li><a href="fa fa-tasks"><i class="fa fa-tasks" aria-hidden="true"></i></a></li>' + '<li><a href="fa fa-pencil-square-o"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a></li>' + '<li><a href="fa fa-square-o"><i class="fa fa-square-o" aria-hidden="true"></i></a></li>' + '<li><a href="fa fa-align-justify"><i class="fa fa-align-justify" aria-hidden="true"></i></a></li>' + '<li><a href="fa fa-cube"><i class="fa fa-cube" aria-hidden="true"></i></a></li>' + '<li><a href="fa fa-cubes"><i class="fa fa-cubes" aria-hidden="true"></i></a></li>' + '<li><a href="fa fa-clone"><i class="fa fa-clone" aria-hidden="true"></i></a></li>' + '<li><a href="fa fa-desktop"><i class="fa fa-desktop" aria-hidden="true"></i></a></li>' + '<li><a href="fa fa-globe"><i class="fa fa-globe" aria-hidden="true"></i></a></li>' + '<li><a href="fa fa-exchange"><i class="fa fa-exchange" aria-hidden="true"></i></a></li>' + '<li><a href="fa fa-list-alt"><i class="fa fa-list-alt" aria-hidden="true"></i></a></li>' + '</ul></div></div>';
  var switcherpane = jquery_default()(gallery).find('div').removeAttr('id');
  if (options.styleURL != null) {
    jquery_default().ajax({
      url: options.styleURL,
      type: "POST",
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      dataType: "json",
      error: function (transport, status, errorThrown) {
        console.log("error : " + errorThrown);
      },
      success: function (data) {
        if (data && data.body["stylecategory"]) var $ul = switcherpane.find("ul").empty();
        var cat = data.body["stylecategory"];
        for (var p in cat) {
          var $i = jquery_default()("<i class='" + p + "' aria-hidden='true'></i> ");
          var $a = jquery_default()("<a></a>").append($i).attr("href", p).attr("title", p);
          var $li = jquery_default()("<li></li>").append($a);
          $ul.append($li);
        }
        switcherpane.find('a').on("click", function () {
          if (options.$styleInput) {
            options.$styleInput.val(jquery_default()(this).attr('href'));
            options.$styleInput.get(0).dispatchEvent(new Event('input', {
              bubbles: true
            }));
          }
          var styleName = jquery_default()(this).html();
          button.find('.jquery-ui-styleswitcher-title').html(styleName);
          options.onSelect(jquery_default()(this));
          if (options.closeOnSelect && switcherpane.is(':visible')) {
            switcherpane.spHide(button);
          }
          return false;
        });
        switcherpane.find('li').hover(function () {
          jquery_default()(this).css({
            'borderColor': '#555',
            'background': 'url(' + options.cdnURL + '/jquery/gallery/menuhoverbg.png) 50% 50% repeat-x',
            cursor: 'pointer'
          });
        }, function () {
          jquery_default()(this).css({
            'borderColor': '#111',
            'background': '#DCDCDC',
            cursor: 'auto'
          });
        }).css({
          width: options.width - 30,
          height: '',
          padding: '2px',
          margin: '1px',
          '-moz-border-radius': '4px',
          clear: 'left',
          float: 'left'
        }).end().find('a').css({
          textDecoration: 'none',
          float: 'left',
          width: '100%',
          outline: '0'
        }).end();
      }
    });
  }
  button.on("click", function () {
    if (switcherpane.is(':visible')) {
      switcherpane.spHide(button);
    } else {
      switcherpane.spShow(button);
    }
    return false;
  });
  switcherpane.hover(function () {}, function () {
    if (switcherpane.is(':visible')) {
      jquery_default()(this).spHide(button);
    }
  });
  jquery_default()(document).on("click", function () {
    switcherpane.spHide(button);
  });

  //show/hide panel functions
  (jquery_default()).fn.spShow = function (btn) {
    var ofset = btn.offset();
    jquery_default()(this).css({
      top: ofset.top + options.buttonHeight + 1,
      left: ofset.left
    }).slideDown(50);
    button.css(button_active);
    options.onOpen();
  };
  (jquery_default()).fn.spHide = function (btn) {
    jquery_default()(this).slideUp(50, function () {
      options.onClose();
    });
    btn.css(button_default);
  };
  switcherpane.find('a').on("click", function () {
    if (options.$styleInput) {
      options.$styleInput.val(jquery_default()(this).attr('href'));
      options.$styleInput.get(0).dispatchEvent(new Event('input', {
        bubbles: true
      }));
    }
    var styleName = jquery_default()(this).html();
    button.find('.jquery-ui-styleswitcher-title').html(styleName);
    options.onSelect(jquery_default()(this));
    if (options.closeOnSelect && switcherpane.is(':visible')) {
      switcherpane.spHide(button);
    }
    return false;
  });
  var button_default = {
    fontSize: '18px',
    color: '#666',
    background: '#eee url(' + options.cdnURL + '/jquery/gallery/buttonbg.png) 50% 50% repeat-x',
    border: '1px solid #ccc',
    '-moz-border-radius': '6px',
    '-webkit-border-radius': '6px',
    textDecoration: 'none',
    padding: '3px 3px 3px 8px',
    width: options.width - 11,
    //minus must match left and right padding 
    display: 'block',
    height: options.buttonHeight,
    outline: '0'
  };
  var button_hover = {
    'borderColor': '#bbb',
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
  button.css(button_default).hover(function () {
    jquery_default()(this).css(button_hover);
  }, function () {
    if (!switcherpane.is(':animated') && switcherpane.is(':hidden')) {
      jquery_default()(this).css(button_default);
    }
  }).find('.jquery-ui-styleswitcher-icon').css({
    float: 'right',
    width: '20px',
    height: '25px',
    background: 'url(' + options.cdnURL + '/jquery/gallery/icon_color_arrow.gif) 50% 50% no-repeat'
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
    width: options.width - 11 //minus must match left and right padding
  }).find('ul').css({
    listStyle: 'none',
    margin: '0',
    padding: '0',
    overflow: 'auto',
    height: options.height
  }).end().find('li').hover(function () {
    jquery_default()(this).css({
      'borderColor': '#555',
      'background': 'url(' + options.cdnURL + '/jquery/gallery/menuhoverbg.png) 50% 50% repeat-x',
      cursor: 'pointer'
    });
  }, function () {
    jquery_default()(this).css({
      'borderColor': '#111',
      'background': '#DCDCDC',
      cursor: 'auto'
    });
  }).css({
    width: options.width - 30,
    height: '',
    padding: '2px',
    margin: '1px',
    '-moz-border-radius': '4px',
    clear: 'left',
    float: 'left'
  }).end().find('a').css({
    /*color: '#aaa',*/
    textDecoration: 'none',
    float: 'left',
    width: '100%',
    outline: '0'
  }).end();
  (jquery_default()).fn.styleupdate = function (styleText) {
    let btn = jquery_default()(this).find("a.jquery-ui-styleswitcher-trigger");
    if (styleText === undefined) {
      btn.find('.jquery-ui-styleswitcher-title').html("Style Selection");
    } else {
      if (styleText != "") {
        let styleName = "<i class='" + styleText + "' aria-hidden='true'></i>";
        btn.find('.jquery-ui-styleswitcher-title').html(styleName);
      } else {
        btn.find('.jquery-ui-styleswitcher-title').html("");
      }
    }
  };
  jquery_default()(this).append(button);
  jquery_default()('body').append(switcherpane);
  switcherpane.hide();
  return this;
};
;// CONCATENATED MODULE: ./src/assets/clockpicker/bootstrap-clockpicker.js
/*!
 * ClockPicker v0.0.7 (http://weareoutman.github.io/clockpicker/)
 * Copyright 2014 Wang Shenwei.
 * Licensed under MIT (https://github.com/weareoutman/clockpicker/blob/gh-pages/LICENSE)
 */


(function () {
  var $ = (jquery_default()),
    $win = $(window),
    $doc = $(document),
    $body;

  // Can I use inline svg ?
  var svgNS = 'http://www.w3.org/2000/svg',
    svgSupported = 'SVGAngle' in window && function () {
      var supported,
        el = document.createElement('div');
      el.innerHTML = '<svg/>';
      supported = (el.firstChild && el.firstChild.namespaceURI) == svgNS;
      el.innerHTML = '';
      return supported;
    }();

  // Can I use transition ?
  var transitionSupported = function () {
    var style = document.createElement('div').style;
    return 'transition' in style || 'WebkitTransition' in style || 'MozTransition' in style || 'msTransition' in style || 'OTransition' in style;
  }();

  // Listen touch events in touch screen device, instead of mouse events in desktop.
  var touchSupported = ('ontouchstart' in window),
    mousedownEvent = 'mousedown' + (touchSupported ? ' touchstart' : ''),
    mousemoveEvent = 'mousemove.clockpicker' + (touchSupported ? ' touchmove.clockpicker' : ''),
    mouseupEvent = 'mouseup.clockpicker' + (touchSupported ? ' touchend.clockpicker' : '');

  // Vibrate the device if supported
  var vibrate = navigator.vibrate ? 'vibrate' : navigator.webkitVibrate ? 'webkitVibrate' : null;
  function createSvgElement(name) {
    return document.createElementNS(svgNS, name);
  }
  function leadingZero(num) {
    return (num < 10 ? '0' : '') + num;
  }

  // Get a unique id
  var idCounter = 0;
  function uniqueId(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  }

  // Clock size
  var dialRadius = 100,
    outerRadius = 80,
    // innerRadius = 80 on 12 hour clock
    innerRadius = 54,
    tickRadius = 13,
    diameter = dialRadius * 2,
    duration = transitionSupported ? 350 : 1;

  // Popover template
  var tpl = ['<div class="popover clockpicker-popover">', '<div class="arrow"></div>', '<div class="popover-title">', '<span class="clockpicker-span-hours text-primary"></span>', ' : ', '<span class="clockpicker-span-minutes"></span>', '<span class="clockpicker-span-am-pm"></span>', '</div>', '<div class="popover-content">', '<div class="clockpicker-plate">', '<div class="clockpicker-canvas"></div>', '<div class="clockpicker-dial clockpicker-hours"></div>', '<div class="clockpicker-dial clockpicker-minutes clockpicker-dial-out"></div>', '</div>', '<span class="clockpicker-am-pm-block">', '</span>', '</div>', '</div>'].join('');

  // ClockPicker
  function ClockPicker(element, options) {
    var popover = $(tpl),
      plate = popover.find('.clockpicker-plate'),
      hoursView = popover.find('.clockpicker-hours'),
      minutesView = popover.find('.clockpicker-minutes'),
      amPmBlock = popover.find('.clockpicker-am-pm-block'),
      isInput = element.prop('tagName') === 'INPUT',
      input = isInput ? element : element.find('input'),
      addon = element.find('.input-group-addon'),
      self = this;
    //timer;

    this.id = uniqueId('cp');
    this.element = element;
    this.options = options;
    this.isAppended = false;
    this.isShown = false;
    this.currentView = 'hours';
    this.isInput = isInput;
    this.input = input;
    this.addon = addon;
    this.popover = popover;
    this.plate = plate;
    this.hoursView = hoursView;
    this.minutesView = minutesView;
    this.amPmBlock = amPmBlock;
    this.spanHours = popover.find('.clockpicker-span-hours');
    this.spanMinutes = popover.find('.clockpicker-span-minutes');
    this.spanAmPm = popover.find('.clockpicker-span-am-pm');
    this.amOrPm = "PM";
    //TSO: default set input to readonly
    if (options.cleartext) {
      this.element.prop("readonly", "readonly");
      if (!(this.element.attr("editable") == "false")) {
        var sty = this.element.attr("style");
        if (!sty) sty = "";
        sty = sty + " background-color: #ffffff; cursor: auto;";
        this.element.attr("style", sty);
      }
    }
    // Setup for for 12 hour clock if option is selected
    if (options.twelvehour) {
      /*
      var  amPmButtonsTemplate = ['<div class="clockpicker-am-pm-block">',
      	'<button type="button" class="btn btn-sm btn-default clockpicker-button clockpicker-am-button">',
      	'AM</button>',
      	'<button type="button" class="btn btn-sm btn-default clockpicker-button clockpicker-pm-button">',
      	'PM</button>',
      	'</div>'].join('');
      
      var amPmButtons = $(amPmButtonsTemplate);*/
      //amPmButtons.appendTo(plate);

      ////Not working b/c they are not shown when this runs
      //$('clockpicker-am-button')
      //    .on("click", function() {
      //        self.amOrPm = "AM";
      //        $('.clockpicker-span-am-pm').empty().append('AM');
      //    });
      //    
      //$('clockpicker-pm-button')
      //    .on("click", function() {
      //         self.amOrPm = "PM";
      //        $('.clockpicker-span-am-pm').empty().append('PM');
      //    });

      $('<button type="button" class="btn btn-sm btn-default clockpicker-button am-button">' + "AM" + '</button>').on("click", function () {
        self.amOrPm = "AM";
        $('.clockpicker-span-am-pm').empty().append('AM');
      }).appendTo(this.amPmBlock);
      $('<button type="button" class="btn btn-sm btn-default clockpicker-button pm-button">' + "PM" + '</button>').on("click", function () {
        self.amOrPm = 'PM';
        $('.clockpicker-span-am-pm').empty().append('PM');
      }).appendTo(this.amPmBlock);
    }
    if (!options.autoclose) {
      // If autoclose is not setted, append a button
      $('<button type="button" class="btn btn-sm btn-default btn-block clockpicker-button clock-close-button">' + options.donetext + '</button>').click($.proxy(this.done, this)).appendTo(popover);
    }
    if (options.cleartext) {
      $('<button type="button" class="btn btn-sm btn-default btn-block clockpicker-button clock-clear-button">' + options.cleartext + '</button>')
      //.click($.proxy(this.clear, this))
      .on("click", () => {
        this.clear();
        if (options.autoclose) this.hide();
      }).appendTo(popover);
    }

    // Placement and arrow align - make sure they make sense.
    if ((options.placement === 'top' || options.placement === 'bottom') && (options.align === 'top' || options.align === 'bottom')) options.align = 'left';
    if ((options.placement === 'left' || options.placement === 'right') && (options.align === 'left' || options.align === 'right')) options.align = 'top';
    popover.addClass(options.placement);
    popover.addClass('clockpicker-align-' + options.align);
    this.spanHours.click($.proxy(this.toggleView, this, 'hours'));
    this.spanMinutes.click($.proxy(this.toggleView, this, 'minutes'));

    // Show or toggle
    input.on('focus.clockpicker click.clockpicker', $.proxy(this.show, this));
    addon.on('click.clockpicker', $.proxy(this.toggle, this));

    // Build ticks
    var tickTpl = $('<div class="clockpicker-tick"></div>'),
      i,
      tick,
      radian,
      radius;

    // Hours view
    if (options.twelvehour) {
      for (i = 1; i < 13; i += 1) {
        tick = tickTpl.clone();
        radian = i / 6 * Math.PI;
        radius = outerRadius;
        tick.css('font-size', '120%');
        tick.css({
          left: dialRadius + Math.sin(radian) * radius - tickRadius,
          top: dialRadius - Math.cos(radian) * radius - tickRadius
        });
        tick.html(i === 0 ? '00' : i);
        hoursView.append(tick);
        tick.on(mousedownEvent, mousedown);
      }
    } else {
      for (i = 0; i < 24; i += 1) {
        tick = tickTpl.clone();
        radian = i / 6 * Math.PI;
        var inner = i > 0 && i < 13;
        radius = inner ? innerRadius : outerRadius;
        tick.css({
          left: dialRadius + Math.sin(radian) * radius - tickRadius,
          top: dialRadius - Math.cos(radian) * radius - tickRadius
        });
        if (inner) {
          tick.css('font-size', '120%');
        }
        tick.html(i === 0 ? '00' : i);
        hoursView.append(tick);
        tick.on(mousedownEvent, mousedown);
      }
    }

    // Minutes view
    for (i = 0; i < 60; i += 5) {
      tick = tickTpl.clone();
      radian = i / 30 * Math.PI;
      tick.css({
        left: dialRadius + Math.sin(radian) * outerRadius - tickRadius,
        top: dialRadius - Math.cos(radian) * outerRadius - tickRadius
      });
      tick.css('font-size', '120%');
      tick.html(leadingZero(i));
      minutesView.append(tick);
      tick.on(mousedownEvent, mousedown);
    }

    // Clicking on minutes view space
    plate.on(mousedownEvent, function (e) {
      if ($(e.target).closest('.clockpicker-tick').length === 0) {
        mousedown(e, true);
      }
    });

    // Mousedown or touchstart
    function mousedown(e, space) {
      var offset = plate.offset(),
        isTouch = /^touch/.test(e.type),
        x0 = offset.left + dialRadius,
        y0 = offset.top + dialRadius,
        dx = (isTouch ? e.originalEvent.touches[0] : e).pageX - x0,
        dy = (isTouch ? e.originalEvent.touches[0] : e).pageY - y0,
        z = Math.sqrt(dx * dx + dy * dy),
        moved = false;

      // When clicking on minutes view space, check the mouse position
      if (space && (z < outerRadius - tickRadius || z > outerRadius + tickRadius)) {
        return;
      }
      e.preventDefault();

      // Set cursor style of body after 200ms
      var movingTimer = setTimeout(function () {
        $body.addClass('clockpicker-moving');
      }, 200);

      // Place the canvas to top
      if (svgSupported) {
        plate.append(self.canvas);
      }

      // Clock
      self.setHand(dx, dy, !space, true);

      // Mousemove on document
      $doc.off(mousemoveEvent).on(mousemoveEvent, function (e) {
        e.preventDefault();
        var isTouch = /^touch/.test(e.type),
          x = (isTouch ? e.originalEvent.touches[0] : e).pageX - x0,
          y = (isTouch ? e.originalEvent.touches[0] : e).pageY - y0;
        if (!moved && x === dx && y === dy) {
          // Clicking in chrome on windows will trigger a mousemove event
          return;
        }
        moved = true;
        self.setHand(x, y, false, true);
      });

      // Mouseup on document
      $doc.off(mouseupEvent).on(mouseupEvent, function (e) {
        $doc.off(mouseupEvent);
        e.preventDefault();
        var isTouch = /^touch/.test(e.type),
          x = (isTouch ? e.originalEvent.changedTouches[0] : e).pageX - x0,
          y = (isTouch ? e.originalEvent.changedTouches[0] : e).pageY - y0;
        if ((space || moved) && x === dx && y === dy) {
          self.setHand(x, y);
        }
        if (self.currentView === 'hours') {
          self.toggleView('minutes', duration / 2);
        } else {
          if (options.autoclose) {
            self.minutesView.addClass('clockpicker-dial-out');
            setTimeout(function () {
              self.done();
            }, duration / 2);
          }
        }
        plate.prepend(canvas);

        // Reset cursor style of body
        clearTimeout(movingTimer);
        $body.removeClass('clockpicker-moving');

        // Unbind mousemove event
        $doc.off(mousemoveEvent);
      });
    }
    if (svgSupported) {
      // Draw clock hands and others
      var canvas = popover.find('.clockpicker-canvas'),
        svg = createSvgElement('svg');
      svg.setAttribute('class', 'clockpicker-svg');
      svg.setAttribute('width', diameter);
      svg.setAttribute('height', diameter);
      var g = createSvgElement('g');
      g.setAttribute('transform', 'translate(' + dialRadius + ',' + dialRadius + ')');
      var bearing = createSvgElement('circle');
      bearing.setAttribute('class', 'clockpicker-canvas-bearing');
      bearing.setAttribute('cx', 0);
      bearing.setAttribute('cy', 0);
      bearing.setAttribute('r', 2);
      var hand = createSvgElement('line');
      hand.setAttribute('x1', 0);
      hand.setAttribute('y1', 0);
      var bg = createSvgElement('circle');
      bg.setAttribute('class', 'clockpicker-canvas-bg');
      bg.setAttribute('r', tickRadius);
      var fg = createSvgElement('circle');
      fg.setAttribute('class', 'clockpicker-canvas-fg');
      fg.setAttribute('r', 3.5);
      g.appendChild(hand);
      g.appendChild(bg);
      g.appendChild(fg);
      g.appendChild(bearing);
      svg.appendChild(g);
      canvas.append(svg);
      this.hand = hand;
      this.bg = bg;
      this.fg = fg;
      this.bearing = bearing;
      this.g = g;
      this.canvas = canvas;
    }
    raiseCallback(this.options.init);
  }
  function raiseCallback(callbackFunction) {
    if (callbackFunction && typeof callbackFunction === "function") {
      callbackFunction();
    }
  }

  // Default options
  ClockPicker.DEFAULTS = {
    'default': '',
    // default time, 'now' or '13:14' e.g.
    fromnow: 0,
    // set default time to * milliseconds from now (using with default = 'now')
    placement: 'bottom',
    // clock popover placement
    align: 'left',
    // popover arrow align
    donetext: '完成',
    // done button text
    autoclose: false,
    // auto close when minute is selected
    twelvehour: false,
    // change to 12 hour AM/PM clock from 24 hour
    vibrate: true // vibrate the device when dragging clock hand
  };

  // Show or hide popover
  ClockPicker.prototype.toggle = function () {
    this[this.isShown ? 'hide' : 'show']();
  };

  // Set popover position
  ClockPicker.prototype.locate = function () {
    var element = this.element,
      popover = this.popover,
      offset = element.offset(),
      width = element.outerWidth(),
      height = element.outerHeight(),
      placement = this.options.placement,
      align = this.options.align,
      styles = {};
    //self = this;

    popover.show();

    // Place the popover
    switch (placement) {
      case 'bottom':
        styles.top = offset.top + height;
        break;
      case 'right':
        styles.left = offset.left + width;
        break;
      case 'top':
        styles.top = offset.top - popover.outerHeight();
        break;
      case 'left':
        styles.left = offset.left - popover.outerWidth();
        break;
    }

    // Align the popover arrow
    switch (align) {
      case 'left':
        styles.left = offset.left;
        break;
      case 'right':
        styles.left = offset.left + width - popover.outerWidth();
        break;
      case 'top':
        styles.top = offset.top;
        break;
      case 'bottom':
        styles.top = offset.top + height - popover.outerHeight();
        break;
    }
    popover.css(styles);
  };

  // Show popover
  ClockPicker.prototype.show = function () {
    // Not show again
    if (this.isShown) {
      return;
    }
    //TSO: verify disable & editable 
    if (this.element.is(":disabled")) return;
    //if(this.element.is("[readonly]")) return;
    if (this.element.attr("editable") == "false") return;
    raiseCallback(this.options.beforeShow);
    var self = this;

    // Initialize
    if (!this.isAppended) {
      // Append popover to body
      $body = $(document.body).append(this.popover);

      // Reset position when resize
      $win.on('resize.clockpicker' + this.id, function () {
        if (self.isShown) {
          self.locate();
        }
      });
      this.isAppended = true;
    }

    // Get the time
    var value = ((this.input.prop('value') || this.options['default'] || '') + '').split(':');
    if (value[0] === 'now') {
      var now = new Date(+new Date() + this.options.fromnow);
      value = [now.getHours(), now.getMinutes()];
    }
    this.hours = +value[0] || 0;
    this.minutes = +value[1] || 0;
    this.spanHours.html(leadingZero(this.hours));
    this.spanMinutes.html(leadingZero(this.minutes));

    // Toggle to hours view
    this.toggleView('hours');

    // Set position
    this.locate();
    this.isShown = true;

    // Hide when clicking or tabbing on any element except the clock, input and addon
    $doc.on('click.clockpicker.' + this.id + ' focusin.clockpicker.' + this.id, function (e) {
      var target = $(e.target);
      if (!target.hasClass("modal") && target.closest(self.popover).length === 0 && target.closest(self.addon).length === 0 && target.closest(self.input).length === 0) {
        self.hide();
      }
    });

    // Hide when ESC is pressed
    $doc.on('keyup.clockpicker.' + this.id, function (e) {
      if (e.keyCode === 27) {
        self.hide();
      }
    });
    raiseCallback(this.options.afterShow);
  };

  // Hide popover
  ClockPicker.prototype.hide = function () {
    raiseCallback(this.options.beforeHide);
    this.isShown = false;

    // Unbinding events on document
    $doc.off('click.clockpicker.' + this.id + ' focusin.clockpicker.' + this.id);
    $doc.off('keyup.clockpicker.' + this.id);
    this.popover.hide();
    raiseCallback(this.options.afterHide);
  };

  // Toggle to hours or minutes view
  ClockPicker.prototype.toggleView = function (view, delay) {
    var raiseAfterHourSelect = false;
    if (view === 'minutes' && $(this.hoursView).css("visibility") === "visible") {
      raiseCallback(this.options.beforeHourSelect);
      raiseAfterHourSelect = true;
    }
    var isHours = view === 'hours',
      nextView = isHours ? this.hoursView : this.minutesView,
      hideView = isHours ? this.minutesView : this.hoursView;
    this.currentView = view;
    this.spanHours.toggleClass('text-primary', isHours);
    this.spanMinutes.toggleClass('text-primary', !isHours);

    // Let's make transitions
    hideView.addClass('clockpicker-dial-out');
    nextView.css('visibility', 'visible').removeClass('clockpicker-dial-out');

    // Reset clock hand
    this.resetClock(delay);

    // After transitions ended
    clearTimeout(this.toggleViewTimer);
    this.toggleViewTimer = setTimeout(function () {
      hideView.css('visibility', 'hidden');
    }, duration);
    if (raiseAfterHourSelect) {
      raiseCallback(this.options.afterHourSelect);
    }
  };

  // Reset clock hand
  ClockPicker.prototype.resetClock = function (delay) {
    var view = this.currentView,
      value = this[view],
      isHours = view === 'hours',
      unit = Math.PI / (isHours ? 6 : 30),
      radian = value * unit,
      radius = isHours && value > 0 && value < 13 ? innerRadius : outerRadius,
      x = Math.sin(radian) * radius,
      y = -Math.cos(radian) * radius,
      self = this;
    if (svgSupported && delay) {
      self.canvas.addClass('clockpicker-canvas-out');
      setTimeout(function () {
        self.canvas.removeClass('clockpicker-canvas-out');
        self.setHand(x, y);
      }, delay);
    } else {
      this.setHand(x, y);
    }
  };

  // Set clock hand to (x, y)
  ClockPicker.prototype.setHand = function (x, y, roundBy5, dragging) {
    var radian = Math.atan2(x, -y),
      isHours = this.currentView === 'hours',
      unit = Math.PI / (isHours || roundBy5 ? 6 : 30),
      z = Math.sqrt(x * x + y * y),
      options = this.options,
      inner = isHours && z < (outerRadius + innerRadius) / 2,
      radius = inner ? innerRadius : outerRadius,
      value;
    if (options.twelvehour) {
      radius = outerRadius;
    }

    // Radian should in range [0, 2PI]
    if (radian < 0) {
      radian = Math.PI * 2 + radian;
    }

    // Get the round value
    value = Math.round(radian / unit);

    // Get the round radian
    radian = value * unit;

    // Correct the hours or minutes
    if (options.twelvehour) {
      if (isHours) {
        if (value === 0) {
          value = 12;
        }
      } else {
        if (roundBy5) {
          value *= 5;
        }
        if (value === 60) {
          value = 0;
        }
      }
    } else {
      if (isHours) {
        if (value === 12) {
          value = 0;
        }
        value = inner ? value === 0 ? 12 : value : value === 0 ? 0 : value + 12;
      } else {
        if (roundBy5) {
          value *= 5;
        }
        if (value === 60) {
          value = 0;
        }
      }
    }

    // Once hours or minutes changed, vibrate the device
    if (this[this.currentView] !== value) {
      if (vibrate && this.options.vibrate) {
        // Do not vibrate too frequently
        if (!this.vibrateTimer) {
          navigator[vibrate](10);
          this.vibrateTimer = setTimeout($.proxy(function () {
            this.vibrateTimer = null;
          }, this), 100);
        }
      }
    }
    this[this.currentView] = value;
    this[isHours ? 'spanHours' : 'spanMinutes'].html(leadingZero(value));

    // If svg is not supported, just add an active class to the tick
    if (!svgSupported) {
      this[isHours ? 'hoursView' : 'minutesView'].find('.clockpicker-tick').each(function () {
        var tick = $(this);
        tick.toggleClass('active', value === +tick.html());
      });
      return;
    }

    // Place clock hand at the top when dragging
    if (dragging || !isHours && value % 5) {
      this.g.insertBefore(this.hand, this.bearing);
      this.g.insertBefore(this.bg, this.fg);
      this.bg.setAttribute('class', 'clockpicker-canvas-bg clockpicker-canvas-bg-trans');
    } else {
      // Or place it at the bottom
      this.g.insertBefore(this.hand, this.bg);
      this.g.insertBefore(this.fg, this.bg);
      this.bg.setAttribute('class', 'clockpicker-canvas-bg');
    }

    // Set clock hand and others' position
    var cx = Math.sin(radian) * radius,
      cy = -Math.cos(radian) * radius;
    this.hand.setAttribute('x2', cx);
    this.hand.setAttribute('y2', cy);
    this.bg.setAttribute('cx', cx);
    this.bg.setAttribute('cy', cy);
    this.fg.setAttribute('cx', cx);
    this.fg.setAttribute('cy', cy);
  };

  //TSO: add method clear
  ClockPicker.prototype.clear = function () {
    this.input.val("");
    this.input.get(0).dispatchEvent(new Event('input'));
  };

  // Hours and minutes are selected
  ClockPicker.prototype.done = function () {
    raiseCallback(this.options.beforeDone);
    this.hide();
    var last = this.input.prop('value'),
      value = leadingZero(this.hours) + ':' + leadingZero(this.minutes);
    if (this.options.twelvehour) {
      value = value + this.amOrPm;
    }
    this.input.prop('value', value);
    if (value !== last) {
      this.input.triggerHandler('change');
      if (!this.isInput) {
        this.element.trigger('change');
      }
    }
    if (this.options.autoclose) {
      this.input.trigger('blur');
    }
    raiseCallback(this.options.afterDone);
  };

  // Remove clockpicker from input
  ClockPicker.prototype.remove = function () {
    this.element.removeData('clockpicker');
    this.input.off('focus.clockpicker click.clockpicker');
    this.addon.off('click.clockpicker');
    if (this.isShown) {
      this.hide();
    }
    if (this.isAppended) {
      $win.off('resize.clockpicker' + this.id);
      this.popover.remove();
    }
  };

  // Extends $.fn.clockpicker
  $.fn.clockpicker = function (option) {
    var args = Array.prototype.slice.call(arguments, 1);
    return this.each(function () {
      var $this = $(this),
        data = $this.data('clockpicker');
      if (!data) {
        var options = $.extend({}, ClockPicker.DEFAULTS, $this.data(), typeof option == 'object' && option);
        $this.data('clockpicker', new ClockPicker($this, options));
      } else {
        // Manual operatsions. show, hide, remove, e.g.
        if (typeof data[option] === 'function') {
          data[option].apply(data, args);
        }
      }
    });
  };
})();
;// CONCATENATED MODULE: ./src/assets/json/program_message.json
var program_message_namespaceObject = /*#__PURE__*/JSON.parse('[{"code":"QS0001","TH":"คุณต้องการลบรายการนี้ใช่หรือไม่ %s","EN":"Do you want to delete this transaction? %s"},{"code":"QS0002","TH":"คุณต้องการบันทึกรายการนี้ใช่หรือไม่","EN":"Do you want to save this transaction?"},{"code":"QS0003","TH":"คุณต้องการยกเลิกรายการนี้ใช่หรือไม่","EN":"Do you want to cancel this transaction?"},{"code":"QS0004","TH":"บันทึกรายการเรียบร้อยแล้ว %s","EN":"Process Success %s"},{"code":"QS0005","TH":"ท่านต้องการลบรายการนี้ใช่หรือไม่ %s","EN":"Do you want to delete this record? %s"},{"code":"QS0006","TH":"คุณต้องการส่งรายการนี้ใช่หรือไม่","EN":"Do you want to send this transaction?"},{"code":"QS0007","TH":"คุณต้องการปรับปรุงรายการนี้ใช่หรือไม่","EN":"Do you want to update this transaction?"},{"code":"QS0008","TH":"คุณต้องการล้างรายการนี้ใช่หรือไม่","EN":"Do you want to clear this?"},{"code":"QS0009","TH":"คุณต้องการดำเนินการ รายการนี้ใช่หรือไม่","EN":"Do you want to process this transaction?"},{"code":"QS0010","TH":"คุณต้องการบันทึกเป็นรายการนี้ใช่หรือไม่","EN":"Do you want to save as this transaction ?"},{"code":"QS0011","TH":"คุณต้องการยืนยันการรับรายการนี้ใช่หรือไม่","EN":"Do you want to receive this transaction?"},{"code":"QS0012","TH":"คุณต้องการล้างและเริ่มใหม่รายการนี้ใช่หรือไม่","EN":"Do you want to reset this transaction?"},{"code":"QS0013","TH":"คุณต้องการลบ %s รายการใช่หรือไม่","EN":"Do you want to delete %s row(s)?"},{"code":"QS0014","TH":"คุณต้องการยืนยันการอนุมัติ  %s รายการนี้ใช่หรือไม่","EN":"Are you sure to confirm approve the %s request?"},{"code":"QS0015","TH":"คุณต้องการยืนยันการปฏิเสธ  %s รายการนี้ใช่หรือไม่","EN":"Are you sure to reject %s?"},{"code":"QS0016","TH":"คุณต้องการยืนยันการสร้างใบคำร้องใช่หรือไม่","EN":"Do you want to create this request?"},{"code":"QS0017","TH":"คุณต้องการนำเข้ารายการนี้ใช่หรือไม่","EN":"Do you want to import this transaction?"},{"code":"QS0018","TH":"คุณต้องการนำออกรายการนี้ใช่หรือไม่","EN":"Do you want to export this transaction?"},{"code":"QS0019","TH":"คุณต้องการส่งรายการนี้ใหม่ใช่หรือไม่?","EN":"Do you want to resend this transaction?"},{"code":"QS0020","TH":"คุณต้องการยืนยันการแก้ไขใหม่  %s รายการนี้ใช่หรือไม่","EN":"Are you sure to revise %s?"},{"code":"fsconfirmbtn","TH":"ตกลง","EN":"OK"},{"code":"fscancelbtn","TH":"ยกเลิก","EN":"Cancel"},{"code":"fssavebtn","TH":"บันทึก","EN":"Save"},{"code":"fsclosebtn","TH":"ปิด","EN":"Close"},{"code":"fsokbtn","TH":"ตกลง","EN":"OK"},{"code":"fsmessagetitle","TH":"ข้อความ","EN":"Message"},{"code":"fsaccepttitle","TH":"ยืนยัน","EN":"Confirm"},{"code":"fssuccessmsg","TH":"การดำเนินการสำเร็จ","EN":"Process success"},{"code":"fsfailmsg","TH":"การดำเนินการไม่สำเร็จ","EN":"Process fail"},{"code":"fsalert","TH":"คำเตือน","EN":"Alert"},{"code":"fswarn","TH":"คำเตือน","EN":"Warning"},{"code":"fsconfirm","TH":"ยืนยัน","EN":"Confirmation"},{"code":"fsinfo","TH":"ข้อความ","EN":"Information"},{"code":"QS8021","TH":"ท่านไม่มีสิทธิ์ดูรายการนี้","EN":"No permission to retrieve this transaction"},{"code":"QS8022","TH":"ท่านไม่มีสิทธิ์แก้ไขรายการนี้","EN":"No permission to edit this transaction"},{"code":"QS8023","TH":"ท่านไม่มีสิทธิ์ลบรายการนี้","EN":"No permission to delete this transaction"},{"code":"QS8024","TH":"ท่านไม่มีสิทธิ์สร้างรายการนี้","EN":"No permission to add this transaction"},{"code":"QS8025","TH":"ท่านไม่มีสิทธิ์นำเข้ารายการนี้","EN":"No permission to import this transaction"},{"code":"QS8026","TH":"ท่านไม่มีสิทธิ์นำออกรายการนี้","EN":"No permission to export this transaction"},{"code":"QS0101","TH":"ไม่พบข้อมูลที่ต้องการ โปรดกรุณาระบุและค้นหาใหม่","EN":"Record not found"},{"code":"QS0102","TH":"นำเข้าข้อมูลไม่ถูกต้อง","EN":"Invalid input"},{"code":"QS0103","TH":"ข้อมูลไม่ได้ระบุ","EN":"Value is undefined"},{"code":"QS0104","TH":"ปรับปรุงข้อมูลเรียบร้อย","EN":"Update success"},{"code":"QS0105","TH":"นำเข้าข้อมูลซ้ำซ้อน","EN":"Duplicate record"},{"code":"QS0201","TH":"Reset password success, Please verify your email for new password changed","EN":"Reset password success, Please verify your email for new password changed"},{"code":"QS0202","TH":"Reset Two Factor Success","EN":"Reset Two Factor Success"}]');
;// CONCATENATED MODULE: ./src/assets/json/default_label.json
var default_label_namespaceObject = /*#__PURE__*/JSON.parse('[{"language":"TH","label":[{"name":"EN_lang","value":"อังกฤษ"},{"name":"TH_lang","value":"ไทย"},{"name":"VN_lang","value":"เวียดนาม"},{"name":"CN_lang","value":"จีน"},{"name":"LA_lang","value":"ลาว"},{"name":"KM_lang","value":"กัมพูชา"},{"name":"JP_lang","value":"ญี่ปุ่น"},{"name":"english_lang","value":"อังกฤษ"},{"name":"thai_lang","value":"ไทย"},{"name":"title_new","value":"สร้างใหม่"},{"name":"title_edit","value":"แก้ไข"},{"name":"title_view","value":"มอง"},{"name":"save_button","value":"บันทึก"},{"name":"delete_button","value":"ลบ"},{"name":"retrieve_button","value":"เรียกดู"},{"name":"search_button","value":"ค้นหา"},{"name":"saveas_button","value":"บันทึกเป็น"},{"name":"submit_button","value":"ส่งข้อมูล"},{"name":"cancel_button","value":"ยกเลิก"},{"name":"clear_button","value":"ล้าง"},{"name":"reset_button","value":"ล้าง"},{"name":"update_button","value":"ปรับปรุง"},{"name":"close_button","value":"ปิด"},{"name":"send_button","value":"ส่ง"},{"name":"complete_button","value":"สำเร็จ"},{"name":"download_button","value":"ดาวน์โหลด"},{"name":"insert_button","value":"เพิ่ม"},{"name":"executebutton","value":"ปฏิบัติการ"},{"name":"ok_button","value":"ตกลง"},{"name":"import_button","value":"นำเข้า"},{"name":"export_button","value":"นำออก"},{"name":"remove_button","value":"ลบ"},{"name":"upload_button","value":"อัพโหลด"},{"name":"consend_button","value":"ส่งแบบสอบถาม"},{"name":"version_label","value":"รุ่น"},{"name":"action_label","value":" "},{"name":"active_label","value":"ใช้งาน"},{"name":"inactive_label","value":"ไม่ใช้งาน"},{"name":"all_label","value":"ทั้งหมด"},{"name":"seqno_label","value":"ลำดับที่"},{"name":"page_notfound","value":"ไม่พบหน้าใช้งาน"},{"name":"record_notfound","value":"ไม่พบรายการ"},{"name":"trx_notfound","value":"ไม่พบรายการ"},{"name":"invalid_alert","value":"กรอกข้อมูลไม่ถูกต้อง"},{"name":"empty_alert","value":"กรุณากรอกข้อมูล"}]},{"language":"EN","label":[{"name":"EN_lang","value":"English"},{"name":"TH_lang","value":"Thai"},{"name":"VN_lang","value":"Vietnam"},{"name":"CN_lang","value":"China"},{"name":"LA_lang","value":"Laos"},{"name":"KM_lang","value":"Cambodia"},{"name":"JP_lang","value":"Japan"},{"name":"english_lang","value":"English"},{"name":"thai_lang","value":"Thai"},{"name":"title_new","value":"Add New"},{"name":"title_edit","value":"Edit"},{"name":"title_view","value":"View"},{"name":"save_button","value":"Save"},{"name":"delete_button","value":"Delete"},{"name":"retrieve_button","value":"Retrieve"},{"name":"search_button","value":"Search"},{"name":"saveas_button","value":"Save As"},{"name":"submit_button","value":"Submit Data"},{"name":"cancel_button","value":"Cancel"},{"name":"clear_button","value":"Clear"},{"name":"reset_button","value":"Clear"},{"name":"close_button","value":"Close"},{"name":"update_button","value":"Update"},{"name":"send_button","value":"Send"},{"name":"complete_button","value":"Complete"},{"name":"download_button","value":"Down Load"},{"name":"insert_button","value":"Insert"},{"name":"execute_button","value":"Execute"},{"name":"ok_button","value":"OK"},{"name":"import_button","value":"Import"},{"name":"export_button","value":"Export"},{"name":"remove_button","value":"Remove"},{"name":"upload_button","value":"Upload"},{"name":"consend_button","value":"Send"},{"name":"version_label","value":"Version"},{"name":"action_label","value":" "},{"name":"active_label","value":"Active"},{"name":"inactive_label","value":"Inactive"},{"name":"all_label","value":"All"},{"name":"seqno_label","value":"No."},{"name":"page_notfound","value":"Page not found"},{"name":"record_notfound","value":"Record not found"},{"name":"trx_notfound","value":"Transaction not found"},{"name":"invalid_alert","value":"Invalid input"},{"name":"empty_alert","value":"This cannot be empty"}]}]');
;// CONCATENATED MODULE: ./src/assets/json/program_label.json
var program_label_namespaceObject = /*#__PURE__*/JSON.parse('[{"language":"TH","label":[{"name":"caption_title","value":"ข้อมูลสิทธิการใช้งาน"},{"name":"title_new_group","value":"สร้างกลุ่มใหม่"},{"name":"title_edit_group","value":"แก้ไขกลุ่ม"},{"name":"sequenceno_headerlabel","value":"ลำดับ"},{"name":"user_seqno_headerlabel","value":"ลำดับที่"},{"name":"nameen_headerlabel","value":"ชื่อกลุ่ม (ภาษาอังกฤษ)"},{"name":"privateflag_label","value":"สำหรับใช้งานกลุ่มภายในเท่านั้น"},{"name":"permit_dialog_title","value":"สิทธิการใช้งานโปรแกรม"},{"name":"parameters_label","value":"พารามิเตอร์"},{"name":"usertrans_label","value":"ผู้ใช้ในกลุ่ม"},{"name":"user_useringroup_label","value":"ผู้ใช้"},{"name":"user_userid_headerlabel","value":"ผู้ใช้"},{"name":"iconstyle_label","value":"แบบไอคอน"},{"name":"nameth_headerlabel","value":"ชื่อกลุ่ม (ภาษาไทย)"},{"name":"nameen_label","value":"ชื่อกลุ่ม (ภาษาอังกฤษ)"},{"name":"seqno_headerlabel","value":"ลำดับที่"},{"name":"site_seqno_headerlabel","value":"ลำดับที่"},{"name":"groupnames_label","value":"ชื่อกลุ่ม"},{"name":"progtrans_label","value":"โปรแกรมในกลุ่ม"},{"name":"supergroup_label","value":"กลุ่มหัวหน้า"},{"name":"prog_progname_headerlabel","value":"ชื่อโปรแกรม"},{"name":"sequenceno_label","value":"ลำดับ"},{"name":"prog_progingroup_label","value":"โปรแกรม"},{"name":"groupname_headerlabel","value":"ชื่อกลุ่ม"},{"name":"sitename_headerlabel","value":"บริษัท"},{"name":"description_label","value":"คำอธิบาย"},{"name":"sitetrans_label","value":"บริษัทในกลุ่ม"},{"name":"usertype_label","value":"ชนิดผู้ใช้"},{"name":"supergroup_headerlabel","value":"กลุ่มหัวหน้า"},{"name":"siteingroup_label","value":"บริษัท"},{"name":"user_username_headerlabel","value":"ชื่อผู้ใช้"},{"name":"description_headerlabel","value":"คำอธิบาย"},{"name":"groupname_label","value":"ชื่อกลุ่ม"},{"name":"nameth_label","value":"ชื่อกลุ่ม (ภาษาไทย)"},{"name":"user_compname_headerlabel","value":"บริษัท"},{"name":"mobilegroup_label","value":"กลุ่มอุปกรณ์เคลื่อนที่"},{"name":"prog_progid_headerlabel","value":"โปรแกรม"},{"name":"prog_seqno_headerlabel","value":"ลำดับที่"}]},{"language":"EN","label":[{"name":"caption_title","value":"Privilege Information"},{"name":"title_new_group","value":"New Group"},{"name":"title_edit_group","value":"Edit Group"},{"name":"sequenceno_headerlabel","value":"Sequence"},{"name":"user_seqno_headerlabel","value":"No."},{"name":"nameen_headerlabel","value":"Name (English)"},{"name":"privateflag_label","value":"Reserved for Private Group"},{"name":"permit_dialog_title","value":"Program Permission"},{"name":"parameters_label","value":"Parameters"},{"name":"usertrans_label","value":"User In Group"},{"name":"user_useringroup_label","value":"User ID"},{"name":"user_userid_headerlabel","value":"User ID"},{"name":"iconstyle_label","value":"Icon Style"},{"name":"nameth_headerlabel","value":"Name (Thai)"},{"name":"nameen_label","value":"Name (English)"},{"name":"seqno_headerlabel","value":"No."},{"name":"site_seqno_headerlabel","value":"No."},{"name":"groupnames_label","value":"Group Name"},{"name":"progtrans_label","value":"Program In Group"},{"name":"supergroup_label","value":"Super Group"},{"name":"prog_progname_headerlabel","value":"Program Name"},{"name":"sequenceno_label","value":"Sequence"},{"name":"prog_progingroup_label","value":"Program ID"},{"name":"groupname_headerlabel","value":"Group Name"},{"name":"sitename_headerlabel","value":"Company Name"},{"name":"description_label","value":"Description"},{"name":"sitetrans_label","value":"Company In Group"},{"name":"usertype_label","value":"User Type"},{"name":"supergroup_headerlabel","value":"Super Group"},{"name":"siteingroup_label","value":"Company"},{"name":"user_username_headerlabel","value":"User Name"},{"name":"description_headerlabel","value":"Description"},{"name":"groupname_label","value":"Group Name"},{"name":"nameth_label","value":"Name (Thai)"},{"name":"user_compname_headerlabel","value":"Company"},{"name":"mobilegroup_label","value":"Mobile Group"},{"name":"prog_progid_headerlabel","value":"Program ID"},{"name":"prog_seqno_headerlabel","value":"No."}]}]');
// EXTERNAL MODULE: ./node_modules/@willsofts/will-app/index.js
var will_app = __webpack_require__(4122);
// EXTERNAL MODULE: ./node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
var runtime_core_esm_bundler = __webpack_require__(6768);
// EXTERNAL MODULE: ./node_modules/@vue/runtime-dom/dist/runtime-dom.esm-bundler.js
var runtime_dom_esm_bundler = __webpack_require__(5130);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/AppVfte002.vue?vue&type=template&id=8ab1ef2a

const _hoisted_1 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", {
  id: "fswaitlayer",
  class: "fa fa-spinner fa-spin"
}, null, -1);
const _hoisted_2 = {
  class: "pt-page pt-page-current pt-page-controller search-pager"
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_PageHeader = (0,runtime_core_esm_bundler/* resolveComponent */.g2)("PageHeader");
  const _component_SearchForm = (0,runtime_core_esm_bundler/* resolveComponent */.g2)("SearchForm");
  const _component_ModifyForm = (0,runtime_core_esm_bundler/* resolveComponent */.g2)("ModifyForm");
  const _component_EntryForm = (0,runtime_core_esm_bundler/* resolveComponent */.g2)("EntryForm");
  const _component_PermitForm = (0,runtime_core_esm_bundler/* resolveComponent */.g2)("PermitForm");
  return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)(runtime_core_esm_bundler/* Fragment */.FK, null, [_hoisted_1, (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_2, [(0,runtime_core_esm_bundler/* createVNode */.bF)(_component_PageHeader, {
    ref: "pageHeader",
    labels: $setup.labels,
    pid: "vfte002",
    version: "1.0.0",
    showLanguage: "true",
    onLanguageChanged: $options.changeLanguage,
    multiLanguages: $setup.multiLanguages
  }, null, 8, ["labels", "onLanguageChanged", "multiLanguages"]), (0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createVNode */.bF)(_component_SearchForm, {
    ref: "searchForm",
    labels: $setup.labels,
    dataCategory: $setup.dataCategory,
    onDataSelect: $options.dataSelected,
    onDataInsert: $options.dataInsert
  }, null, 8, ["labels", "dataCategory", "onDataSelect", "onDataInsert"]), [[runtime_dom_esm_bundler/* vShow */.aG, $setup.isShowModify == false]]), (0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createVNode */.bF)(_component_ModifyForm, {
    ref: "modifyForm",
    labels: $setup.labels,
    dataCategory: $setup.dataCategory,
    onDataUpdated: $options.modifyUpdated,
    onDataCancel: $options.modifyCancel
  }, null, 8, ["labels", "dataCategory", "onDataUpdated", "onDataCancel"]), [[runtime_dom_esm_bundler/* vShow */.aG, $setup.isShowModify == true]])]), ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createBlock */.Wv)(runtime_core_esm_bundler/* Teleport */.Im, {
    to: "#modaldialog"
  }, [(0,runtime_core_esm_bundler/* createVNode */.bF)(_component_EntryForm, {
    ref: "entryForm",
    labels: $setup.labels,
    dataCategory: $setup.dataCategory,
    onDataSaved: $options.dataSaved,
    onDataUpdated: $options.dataUpdated,
    onDataDeleted: $options.dataDeleted
  }, null, 8, ["labels", "dataCategory", "onDataSaved", "onDataUpdated", "onDataDeleted"])])), ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createBlock */.Wv)(runtime_core_esm_bundler/* Teleport */.Im, {
    to: "#permitdialog"
  }, [(0,runtime_core_esm_bundler/* createVNode */.bF)(_component_PermitForm, {
    ref: "permitForm",
    labels: $setup.labels,
    dataCategory: $setup.dataCategory,
    onDataSaved: $options.permitSaved,
    onDataUpdated: $options.permitUpdated,
    onDataDeleted: $options.permitDeleted
  }, null, 8, ["labels", "dataCategory", "onDataSaved", "onDataUpdated", "onDataDeleted"])]))], 64);
}
;// CONCATENATED MODULE: ./src/AppVfte002.vue?vue&type=template&id=8ab1ef2a

// EXTERNAL MODULE: ./node_modules/core-js/modules/web.url-search-params.delete.js
var web_url_search_params_delete = __webpack_require__(4603);
// EXTERNAL MODULE: ./node_modules/core-js/modules/web.url-search-params.has.js
var web_url_search_params_has = __webpack_require__(7566);
// EXTERNAL MODULE: ./node_modules/core-js/modules/web.url-search-params.size.js
var web_url_search_params_size = __webpack_require__(8721);
// EXTERNAL MODULE: ./node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js
var reactivity_esm_bundler = __webpack_require__(144);
// EXTERNAL MODULE: ./node_modules/@willsofts/will-control/dist/will-control.umd.js
var will_control_umd = __webpack_require__(3301);
// EXTERNAL MODULE: ./node_modules/@vue/shared/dist/shared.esm-bundler.js
var shared_esm_bundler = __webpack_require__(4232);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/SearchForm.vue?vue&type=template&id=641abc86

const SearchFormvue_type_template_id_641abc86_hoisted_1 = {
  id: "searchpanel",
  class: "panel-body search-panel"
};
const SearchFormvue_type_template_id_641abc86_hoisted_2 = {
  class: "row row-height"
};
const _hoisted_3 = {
  class: "col-height col-md-3"
};
const _hoisted_4 = {
  class: "col-height col-md"
};
const _hoisted_5 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("br", null, null, -1);
const _hoisted_6 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("i", {
  class: "fa fa-search fa-btn-icon",
  "aria-hidden": "true"
}, null, -1);
const _hoisted_7 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("i", {
  class: "fa fa-refresh fa-btn-icon",
  "aria-hidden": "true"
}, null, -1);
const _hoisted_8 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("i", {
  class: "fa fa-plus fa-btn-icon",
  "aria-hidden": "true"
}, null, -1);
const _hoisted_9 = {
  id: "listpanel",
  class: "table-responsive fa-list-panel"
};
function SearchFormvue_type_template_id_641abc86_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_DataTable = (0,runtime_core_esm_bundler/* resolveComponent */.g2)("DataTable");
  const _component_DataPaging = (0,runtime_core_esm_bundler/* resolveComponent */.g2)("DataPaging");
  return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("div", SearchFormvue_type_template_id_641abc86_hoisted_1, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", SearchFormvue_type_template_id_641abc86_hoisted_2, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_3, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", null, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.groupnames_label), 1), (0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("input", {
    type: "text",
    "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => $setup.localData.groupname = $event),
    class: "form-control input-md",
    maxlength: "50"
  }, null, 512), [[runtime_dom_esm_bundler/* vModelText */.Jo, $setup.localData.groupname]])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_4, [_hoisted_5, (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("button", {
    onClick: _cache[1] || (_cache[1] = (...args) => $options.searchClick && $options.searchClick(...args)),
    class: "btn btn-dark btn-sm btn-ctrl"
  }, [_hoisted_6, (0,runtime_core_esm_bundler/* createTextVNode */.eW)((0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.search_button), 1)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("button", {
    onClick: _cache[2] || (_cache[2] = (...args) => $options.resetClick && $options.resetClick(...args)),
    class: "btn btn-dark btn-sm btn-ctrl"
  }, [_hoisted_7, (0,runtime_core_esm_bundler/* createTextVNode */.eW)((0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.reset_button), 1)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("button", {
    onClick: _cache[3] || (_cache[3] = (...args) => $options.insertClick && $options.insertClick(...args)),
    class: "btn btn-dark btn-sm btn-ctrl pull-right"
  }, [_hoisted_8, (0,runtime_core_esm_bundler/* createTextVNode */.eW)((0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.insert_button), 1)])])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_9, [(0,runtime_core_esm_bundler/* createVNode */.bF)(_component_DataTable, {
    ref: "dataTable",
    settings: $setup.tableSettings,
    labels: $props.labels,
    dataset: $setup.dataset,
    onDataSelect: $options.dataSelected,
    onDataSort: $options.dataSorted
  }, null, 8, ["settings", "labels", "dataset", "onDataSelect", "onDataSort"]), (0,runtime_core_esm_bundler/* createVNode */.bF)(_component_DataPaging, {
    ref: "dataPaging",
    settings: $setup.pagingSettings,
    onPageSelect: $options.pageSelected
  }, null, 8, ["settings", "onPageSelect"])])]);
}
;// CONCATENATED MODULE: ./src/components/SearchForm.vue?vue&type=template&id=641abc86

;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/SearchForm.vue?vue&type=script&lang=js






const APP_URL = "/api/sfte002";
const defaultData = {
  groupname: ''
};
const tableSettings = {
  sequence: {
    label: "seqno_label"
  },
  columns: [{
    name: "groupname",
    type: "STRING",
    sorter: "groupname",
    label: "groupname_headerlabel"
  }, {
    name: "nameen",
    type: "STRING",
    sorter: "nameen",
    label: "nameen_headerlabel"
  }, {
    name: "nameth",
    type: "STRING",
    sorter: "nameth",
    label: "nameth_headerlabel"
  }, {
    name: "seqno",
    type: "INTEGER",
    sorter: "seqno",
    label: "sequenceno_headerlabel",
    css: "text-center"
  }],
  actions: [{
    type: "button",
    action: "modify",
    css: "btn-edit fa-data-modify fa-btn fa fa-edit"
  }, {
    type: "button",
    action: "edit"
  }, {
    type: "button",
    action: "delete"
  }]
};
/* harmony default export */ var SearchFormvue_type_script_lang_js = ({
  components: {
    DataTable: will_control_umd.DataTable,
    DataPaging: will_control_umd.DataPaging
  },
  props: {
    labels: Object,
    formData: Object,
    dataCategory: Object
  },
  emits: ["data-select", "data-insert"],
  setup(props) {
    const localData = (0,reactivity_esm_bundler/* ref */.KR)({
      ...defaultData,
      ...props.formData
    });
    let paging = new will_app/* Paging */.lK();
    let pagingSettings = paging.setting;
    let filters = {};
    const dataset = (0,reactivity_esm_bundler/* ref */.KR)({});
    return {
      localData,
      tableSettings,
      pagingSettings,
      paging,
      filters,
      dataset
    };
  },
  methods: {
    reset(newData) {
      if (newData) this.localData = {
        ...newData
      };
    },
    getPagingOptions(settings) {
      if (!settings) settings = this.pagingSettings;
      return {
        page: settings.page,
        limit: settings.limit,
        rowsPerPage: settings.rowsPerPage,
        orderBy: settings.orderBy ? settings.orderBy : "",
        orderDir: settings.orderDir ? settings.orderDir : ""
      };
    },
    resetClick() {
      this.localData = {
        ...defaultData
      };
      this.resetFilters();
      this.$refs.dataTable.clear();
      this.$refs.dataPaging.clear();
      this.pagingSettings.rows = 0;
    },
    insertClick() {
      this.$emit('data-insert', this.filters);
    },
    searchClick() {
      this.filters = {
        ...this.localData
      };
      this.resetFilters();
      this.search();
    },
    resetFilters() {
      this.pagingSettings.page = 1;
      this.pagingSettings.orderBy = "";
      this.pagingSettings.orderDir = "";
    },
    search(ensurePaging = false) {
      if (ensurePaging) {
        if (this.pagingSettings.rows <= 1 && this.pagingSettings.page > 1) {
          this.pagingSettings.page = this.pagingSettings.page - 1;
        }
      }
      console.log("search: pagingSettings", this.pagingSettings);
      let options = this.getPagingOptions();
      this.collecting(options, this.filters);
    },
    collecting(options, criterias) {
      console.log("collecting: options", options, ", criteria", criterias);
      let jsondata = Object.assign({
        ajax: true
      }, options);
      //Object.assign(jsondata,criterias);
      let formdata = (0,will_app/* serializeParameters */.L3)(jsondata, criterias);
      (0,will_app/* startWaiting */.eF)();
      jquery_default().ajax({
        url: (0,will_app/* getApiUrl */.e9)() + APP_URL + "/collect",
        data: formdata.jsondata,
        headers: formdata.headers,
        type: "POST",
        dataType: "json",
        contentType: will_app/* DEFAULT_CONTENT_TYPE */.Xh,
        error: function (transport, status, errorThrown) {
          console.error("error: status", status, "errorThrown", errorThrown);
          (0,will_app/* submitFailure */.pg)(transport, status, errorThrown);
        },
        success: data => {
          (0,will_app/* stopWaiting */.Sk)();
          console.log("collecting: success", data);
          if (data.body) {
            this.$refs.dataTable.reset(data.body);
            this.$refs.dataPaging.reset(data.body?.offsets);
            this.pagingSettings.rows = data.body?.rows?.length;
          }
        }
      });
    },
    pageSelected(item) {
      console.log("page selected:", item);
      this.pagingSettings.page = item.page;
      let options = this.getPagingOptions();
      this.collecting(options, this.filters);
    },
    dataSelected(item, action) {
      console.log("dataSelected", item, "action", action);
      this.$emit('data-select', item, action);
    },
    dataSorted(sorter, direction) {
      console.log("dataSorted", sorter, "direction", direction);
      this.pagingSettings.orderBy = sorter;
      this.pagingSettings.orderDir = direction;
      let options = this.getPagingOptions();
      this.collecting(options, this.filters);
    }
  }
});
;// CONCATENATED MODULE: ./src/components/SearchForm.vue?vue&type=script&lang=js
 
;// CONCATENATED MODULE: ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-12.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-12.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12.use[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/SearchForm.vue?vue&type=style&index=0&id=641abc86&lang=css
// extracted by mini-css-extract-plugin

;// CONCATENATED MODULE: ./src/components/SearchForm.vue?vue&type=style&index=0&id=641abc86&lang=css

// EXTERNAL MODULE: ./node_modules/vue-loader/dist/exportHelper.js
var exportHelper = __webpack_require__(1241);
;// CONCATENATED MODULE: ./src/components/SearchForm.vue




;


const __exports__ = /*#__PURE__*/(0,exportHelper/* default */.A)(SearchFormvue_type_script_lang_js, [['render',SearchFormvue_type_template_id_641abc86_render]])

/* harmony default export */ var SearchForm = (__exports__);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/ModifyForm.vue?vue&type=template&id=5b7d7a64

const ModifyFormvue_type_template_id_5b7d7a64_hoisted_1 = {
  id: "entrylayer",
  class: "entry-layer"
};
const ModifyFormvue_type_template_id_5b7d7a64_hoisted_2 = {
  class: "portal-area sub-entry-layer"
};
const ModifyFormvue_type_template_id_5b7d7a64_hoisted_3 = {
  class: "row row-height"
};
const ModifyFormvue_type_template_id_5b7d7a64_hoisted_4 = {
  class: "col-md-3 col-height col-label"
};
const ModifyFormvue_type_template_id_5b7d7a64_hoisted_5 = {
  class: "col-height col-md-3"
};
const ModifyFormvue_type_template_id_5b7d7a64_hoisted_6 = {
  class: "row row-height"
};
const ModifyFormvue_type_template_id_5b7d7a64_hoisted_7 = {
  class: "col-md-3 col-height col-label"
};
const ModifyFormvue_type_template_id_5b7d7a64_hoisted_8 = {
  for: "nameen"
};
const ModifyFormvue_type_template_id_5b7d7a64_hoisted_9 = {
  class: "col-height col-md-6"
};
const _hoisted_10 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", {
  class: "required"
}, "*", -1);
const _hoisted_11 = {
  key: 0,
  class: "has-error"
};
const _hoisted_12 = {
  class: "row row-height"
};
const _hoisted_13 = {
  class: "col-md-3 col-height col-label"
};
const _hoisted_14 = {
  for: "nameth"
};
const _hoisted_15 = {
  class: "col-height col-md-6"
};
const _hoisted_16 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", {
  class: "required"
}, "*", -1);
const _hoisted_17 = {
  key: 0,
  class: "has-error"
};
const _hoisted_18 = {
  class: "row row-height"
};
const _hoisted_19 = {
  class: "col-height col-md-3 col-label"
};
const _hoisted_20 = {
  for: "usertype"
};
const _hoisted_21 = {
  class: "col-height col-md-3"
};
const _hoisted_22 = {
  id: "usertypefieldset",
  disabled: ""
};
const _hoisted_23 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("legend", {
  class: "fa-hidden"
}, null, -1);
const _hoisted_24 = ["value"];
const _hoisted_25 = {
  class: "row row-height"
};
const _hoisted_26 = {
  class: "col-height col-md-3 col-label"
};
const _hoisted_27 = {
  for: "mobilegroup"
};
const _hoisted_28 = {
  class: "col-height col-md-3"
};
const _hoisted_29 = ["value"];
const _hoisted_30 = {
  class: "row row-height",
  id: "privateflaglayer"
};
const _hoisted_31 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", {
  class: "col-height col-md-3 col-label"
}, null, -1);
const _hoisted_32 = {
  class: "col-height col-md-8"
};
const _hoisted_33 = {
  class: "form-check"
};
const _hoisted_34 = {
  for: "privateflag",
  class: "form-check-label"
};
const _hoisted_35 = {
  class: "row row-height"
};
const _hoisted_36 = {
  class: "col-height col-md-3 col-label"
};
const _hoisted_37 = {
  class: "col-height col-md-3"
};
const _hoisted_38 = {
  id: "iconstylelayer"
};
const _hoisted_39 = {
  class: "btn btn-light icon-style-btn"
};
const _hoisted_40 = {
  class: "row row-height"
};
const _hoisted_41 = {
  class: "col-height col-md-3 col-label"
};
const _hoisted_42 = {
  for: "seqnodialog"
};
const _hoisted_43 = {
  class: "col-height col-md-2"
};
const _hoisted_44 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", {
  class: "required"
}, "*", -1);
const _hoisted_45 = {
  key: 0,
  class: "has-error"
};
const _hoisted_46 = {
  class: "row row-height"
};
const _hoisted_47 = {
  class: "col-md-12 pull-right text-right btn-control-layer"
};
const _hoisted_48 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("em", {
  class: "fa fa-save fa-btn-icon"
}, null, -1);
const _hoisted_49 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("em", {
  class: "fa fa-close fa-btn-icon"
}, null, -1);
const _hoisted_50 = {
  id: "programcontrollayer",
  class: "row"
};
const _hoisted_51 = {
  id: "proglayerheader",
  class: "pt-page-header pt-page-corser"
};
const _hoisted_52 = {
  id: "progtrans_label"
};
const _hoisted_53 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("em", {
  class: "fa fa-chevron-circle-up fa-toggle-collapse"
}, null, -1);
const _hoisted_54 = [_hoisted_53];
const _hoisted_55 = {
  id: "proglayer",
  class: "portal-area portal-area-layer"
};
const _hoisted_56 = {
  id: "programrowlayer",
  class: "row"
};
const _hoisted_57 = {
  class: "col-md-3 col-height col-label text-right"
};
const _hoisted_58 = {
  id: "prog_progingroup_label",
  class: "control-label"
};
const _hoisted_59 = {
  class: "col-md-3 col-height"
};
const _hoisted_60 = ["value"];
const _hoisted_61 = {
  class: "col-md-1 col-height"
};
const _hoisted_62 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("em", {
  class: "fa fa-plus",
  "aria-hidden": "true"
}, null, -1);
const _hoisted_63 = [_hoisted_62];
const _hoisted_64 = {
  id: "progtable",
  class: "table table-bordered table-hover table-striped tablesorter"
};
const _hoisted_65 = {
  id: "progtableheader"
};
const _hoisted_66 = {
  width: "10%",
  class: "text-center th-sequence"
};
const _hoisted_67 = {
  id: "prog_seqno_headerlabel"
};
const _hoisted_68 = {
  width: "30%",
  class: "text-center th-data"
};
const _hoisted_69 = {
  id: "prog_progid_headerlabel"
};
const _hoisted_70 = {
  width: "50%",
  class: "text-center th-data"
};
const _hoisted_71 = {
  id: "prog_progname_headerlabel"
};
const _hoisted_72 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("th", {
  width: "10%",
  class: "text-center th-action"
}, [/*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("em", {
  class: "fa fa-bolt",
  "aria-hidden": "true"
})], -1);
const _hoisted_73 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("tbody", {
  id: "aprogtablebody"
}, null, -1);
const _hoisted_74 = {
  id: "progtablelayer"
};
const _hoisted_75 = {
  id: "progtablebody",
  class: "ul-table-listing",
  ref: "progtablebody"
};
const _hoisted_76 = {
  class: "prog-item-table-class"
};
const _hoisted_77 = {
  class: "cclass progno-column",
  align: "center"
};
const _hoisted_78 = {
  class: "cclass progid-column",
  align: "center"
};
const _hoisted_79 = {
  class: "cclass progname-column"
};
const _hoisted_80 = {
  class: "cclass progctrl-column",
  align: "center"
};
const _hoisted_81 = ["onClick"];
const _hoisted_82 = ["onClick"];
function ModifyFormvue_type_template_id_5b7d7a64_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_InputNumber = (0,runtime_core_esm_bundler/* resolveComponent */.g2)("InputNumber");
  return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("div", ModifyFormvue_type_template_id_5b7d7a64_hoisted_1, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ModifyFormvue_type_template_id_5b7d7a64_hoisted_2, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ModifyFormvue_type_template_id_5b7d7a64_hoisted_3, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ModifyFormvue_type_template_id_5b7d7a64_hoisted_4, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", null, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.groupname_label), 1)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ModifyFormvue_type_template_id_5b7d7a64_hoisted_5, [(0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("input", {
    type: "text",
    ref: "groupname",
    "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => $setup.localData.groupname = $event),
    class: "form-control input-md",
    disabled: ""
  }, null, 512), [[runtime_dom_esm_bundler/* vModelText */.Jo, $setup.localData.groupname]])])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ModifyFormvue_type_template_id_5b7d7a64_hoisted_6, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ModifyFormvue_type_template_id_5b7d7a64_hoisted_7, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", ModifyFormvue_type_template_id_5b7d7a64_hoisted_8, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.nameen_label), 1)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ModifyFormvue_type_template_id_5b7d7a64_hoisted_9, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", {
    class: (0,shared_esm_bundler/* normalizeClass */.C4)(["input-group has-validation", {
      'has-error': $setup.v$.nameen.$error
    }])
  }, [(0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("input", {
    ref: "nameen",
    type: "text",
    "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => $setup.localData.nameen = $event),
    id: "nameen",
    class: "form-control input-md",
    maxlength: "100"
  }, null, 512), [[runtime_dom_esm_bundler/* vModelText */.Jo, $setup.localData.nameen]]), _hoisted_10], 2), $setup.v$.nameen.$error ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("span", _hoisted_11, (0,shared_esm_bundler/* toDisplayString */.v_)($setup.v$.nameen.$errors[0].$message), 1)) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true)])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_12, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_13, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", _hoisted_14, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.nameth_label), 1)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_15, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", {
    class: (0,shared_esm_bundler/* normalizeClass */.C4)(["input-group has-validation", {
      'has-error': $setup.v$.nameth.$error
    }])
  }, [(0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("input", {
    ref: "nameth",
    type: "text",
    "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => $setup.localData.nameth = $event),
    id: "nameth",
    class: "form-control input-md",
    maxlength: "100"
  }, null, 512), [[runtime_dom_esm_bundler/* vModelText */.Jo, $setup.localData.nameth]]), _hoisted_16], 2), $setup.v$.nameth.$error ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("span", _hoisted_17, (0,shared_esm_bundler/* toDisplayString */.v_)($setup.v$.nameth.$errors[0].$message), 1)) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true)])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_18, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_19, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", _hoisted_20, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.usertype_label), 1)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_21, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("fieldset", _hoisted_22, [_hoisted_23, (0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("select", {
    ref: "usertype",
    "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => $setup.localData.usertype = $event),
    class: "form-control input-md",
    id: "usertype"
  }, [((0,runtime_core_esm_bundler/* openBlock */.uX)(true), (0,runtime_core_esm_bundler/* createElementBlock */.CE)(runtime_core_esm_bundler/* Fragment */.FK, null, (0,runtime_core_esm_bundler/* renderList */.pI)($props.dataCategory.tkusertype, item => {
    return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("option", {
      key: item.id,
      value: item.id
    }, (0,shared_esm_bundler/* toDisplayString */.v_)(item.text), 9, _hoisted_24);
  }), 128))], 512), [[runtime_dom_esm_bundler/* vModelSelect */.u1, $setup.localData.usertype]])])])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_25, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_26, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", _hoisted_27, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.mobilegroup_label), 1)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_28, [(0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("select", {
    ref: "mobilegroup",
    "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => $setup.localData.mobilegroup = $event),
    class: "form-control input-md",
    id: "mobilegroup"
  }, [((0,runtime_core_esm_bundler/* openBlock */.uX)(true), (0,runtime_core_esm_bundler/* createElementBlock */.CE)(runtime_core_esm_bundler/* Fragment */.FK, null, (0,runtime_core_esm_bundler/* renderList */.pI)($props.dataCategory.tkgroupmobile, item => {
    return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("option", {
      key: item.id,
      value: item.id
    }, (0,shared_esm_bundler/* toDisplayString */.v_)(item.text), 9, _hoisted_29);
  }), 128))], 512), [[runtime_dom_esm_bundler/* vModelSelect */.u1, $setup.localData.mobilegroup]])])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_30, [_hoisted_31, (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_32, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_33, [(0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("input", {
    ref: "privateflag",
    type: "checkbox",
    id: "privateflag",
    "true-value": 1,
    "false-value": 0,
    "onUpdate:modelValue": _cache[5] || (_cache[5] = $event => $setup.localData.privateflag = $event),
    class: "form-control input-md form-check-input"
  }, null, 512), [[runtime_dom_esm_bundler/* vModelCheckbox */.lH, $setup.localData.privateflag]]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", _hoisted_34, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.privateflag_label), 1)])])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_35, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_36, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", null, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.iconstyle_label), 1)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_37, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_38, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("button", _hoisted_39, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("em", {
    class: (0,shared_esm_bundler/* normalizeClass */.C4)($setup.localData.iconstyle),
    "aria-hidden": "true"
  }, null, 2)])])])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_40, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_41, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", _hoisted_42, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.sequenceno_label), 1)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_43, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", {
    class: (0,shared_esm_bundler/* normalizeClass */.C4)(["input-group has-validation", {
      'has-error': $setup.v$.seqno.$error
    }])
  }, [(0,runtime_core_esm_bundler/* createVNode */.bF)(_component_InputNumber, {
    ref: "seqno",
    modelValue: $setup.localData.seqno,
    "onUpdate:modelValue": _cache[6] || (_cache[6] = $event => $setup.localData.seqno = $event),
    id: "seqnodialog"
  }, null, 8, ["modelValue"]), _hoisted_44], 2), $setup.v$.seqno.$error ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("span", _hoisted_45, (0,shared_esm_bundler/* toDisplayString */.v_)($setup.v$.seqno.$errors[0].$message), 1)) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true)])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_46, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_47, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("button", {
    id: "updatemodifybutton",
    class: "btn btn-dark btn-sm",
    onClick: _cache[7] || (_cache[7] = (...args) => $options.updateClick && $options.updateClick(...args))
  }, [_hoisted_48, (0,runtime_core_esm_bundler/* createTextVNode */.eW)((0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.update_button), 1)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("button", {
    class: "btn btn-dark btn-sm",
    onClick: _cache[8] || (_cache[8] = (...args) => $options.cancelClick && $options.cancelClick(...args))
  }, [_hoisted_49, (0,runtime_core_esm_bundler/* createTextVNode */.eW)((0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.cancel_button), 1)])])])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_50, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_51, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", _hoisted_52, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.progtrans_label), 1), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("a", {
    href: "javascript:void(0)",
    class: "pull-right up",
    onClick: _cache[9] || (_cache[9] = $event => $options.toggleCollapseExpand($event))
  }, _hoisted_54)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_55, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_56, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_57, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", _hoisted_58, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.prog_progingroup_label), 1)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_59, [(0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("select", {
    ref: "progingroup",
    "onUpdate:modelValue": _cache[10] || (_cache[10] = $event => $setup.localData.progingroup = $event),
    class: "form-control input-md",
    id: "progingroup"
  }, [((0,runtime_core_esm_bundler/* openBlock */.uX)(true), (0,runtime_core_esm_bundler/* createElementBlock */.CE)(runtime_core_esm_bundler/* Fragment */.FK, null, (0,runtime_core_esm_bundler/* renderList */.pI)($props.dataCategory.tprog, item => {
    return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("option", {
      key: item.id,
      value: item.id
    }, (0,shared_esm_bundler/* toDisplayString */.v_)(item.id) + " - " + (0,shared_esm_bundler/* toDisplayString */.v_)(item.text), 9, _hoisted_60);
  }), 128))], 512), [[runtime_dom_esm_bundler/* vModelSelect */.u1, $setup.localData.progingroup]])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_61, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("button", {
    id: "addprogbutton",
    onClick: _cache[11] || (_cache[11] = (...args) => $options.addProgClick && $options.addProgClick(...args)),
    class: "btn btn-dark btn-sm",
    title: "Add Program"
  }, _hoisted_63)])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("table", _hoisted_64, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("thead", _hoisted_65, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("tr", null, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("th", _hoisted_66, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", _hoisted_67, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.prog_seqno_headerlabel), 1)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("th", _hoisted_68, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", _hoisted_69, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.prog_progid_headerlabel), 1)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("th", _hoisted_70, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", _hoisted_71, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.prog_progname_headerlabel), 1)]), _hoisted_72])]), _hoisted_73]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_74, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("ul", _hoisted_75, [((0,runtime_core_esm_bundler/* openBlock */.uX)(true), (0,runtime_core_esm_bundler/* createElementBlock */.CE)(runtime_core_esm_bundler/* Fragment */.FK, null, (0,runtime_core_esm_bundler/* renderList */.pI)($setup.proglists, (item, index) => {
    return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("li", {
      class: "prog-item-class ui-state-active",
      key: item.programid
    }, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("table", _hoisted_76, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("tr", null, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("td", _hoisted_77, (0,shared_esm_bundler/* toDisplayString */.v_)(index + 1), 1), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("td", _hoisted_78, (0,shared_esm_bundler/* toDisplayString */.v_)(item.programid), 1), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("td", _hoisted_79, (0,shared_esm_bundler/* toDisplayString */.v_)(item.progname), 1), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("td", _hoisted_80, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("button", {
      class: "btn-edit fa-btn fa fa-pencil",
      onClick: $event => $options.startEditProgInGroup(item)
    }, null, 8, _hoisted_81), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("button", {
      class: "btn-delete fa-btn fa fa-trash",
      onClick: $event => $options.startRemoveProgInGroup(item)
    }, null, 8, _hoisted_82)])])])]);
  }), 128))], 512)])])])]);
}
;// CONCATENATED MODULE: ./src/components/ModifyForm.vue?vue&type=template&id=5b7d7a64

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.push.js
var es_array_push = __webpack_require__(4114);
// EXTERNAL MODULE: ./node_modules/@vuelidate/core/dist/index.mjs
var dist = __webpack_require__(7760);
// EXTERNAL MODULE: ./node_modules/@vuelidate/validators/dist/index.mjs
var validators_dist = __webpack_require__(9428);
// EXTERNAL MODULE: ./node_modules/@vueuse/integrations/useSortable.mjs + 4 modules
var useSortable = __webpack_require__(4028);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/ModifyForm.vue?vue&type=script&lang=js










const ModifyFormvue_type_script_lang_js_APP_URL = "/api/sfte002";
const ModifyFormvue_type_script_lang_js_defaultData = {
  groupname: "",
  nameen: "",
  nameth: "",
  usertype: "",
  mobilegroup: "",
  privateflag: "0",
  iconstyle: "fa fa-desktop",
  seqno: 0,
  progid: []
};
/* harmony default export */ var ModifyFormvue_type_script_lang_js = ({
  components: {
    InputNumber: will_control_umd.InputNumber
  },
  props: {
    labels: Object,
    dataCategory: Object
  },
  emits: ["data-updated", "data-cancel"],
  setup(props) {
    const proglists = (0,reactivity_esm_bundler/* ref */.KR)([]);
    (0,useSortable/* useSortable */.g)('#progtablebody', proglists);
    const localData = (0,reactivity_esm_bundler/* ref */.KR)({
      ...ModifyFormvue_type_script_lang_js_defaultData
    });
    const disabledKeyField = (0,reactivity_esm_bundler/* ref */.KR)(false);
    const reqalert = (0,reactivity_esm_bundler/* ref */.KR)(props.labels.empty_alert);
    const requiredMessage = () => {
      return validators_dist/* helpers */._$.withMessage(reqalert, validators_dist/* required */.mw);
    };
    const validateRules = (0,runtime_core_esm_bundler/* computed */.EW)(() => {
      return {
        groupname: {
          required: requiredMessage()
        },
        nameen: {
          required: requiredMessage()
        },
        nameth: {
          required: requiredMessage()
        },
        seqno: {
          required: requiredMessage()
        }
      };
    });
    const v$ = (0,dist/* useVuelidate */.fG)(validateRules, localData, {
      $lazy: true,
      $autoDirty: true
    });
    return {
      v$,
      localData,
      disabledKeyField,
      reqalert,
      proglists
    };
  },
  created() {
    (0,runtime_core_esm_bundler/* watch */.wB)(this.$props, newProps => {
      this.reqalert = newProps.labels.empty_alert;
    });
  },
  mounted() {
    this.$nextTick(function () {
      jquery_default()("#modaldialog_layer").find(".modal-dialog").draggable();
    });
  },
  methods: {
    reset(newData) {
      if (newData) this.localData = {
        ...newData
      };
    },
    submit() {
      this.$emit('update:formData', this.localData);
    },
    clearingFields() {
      this.proglists = [];
    },
    async cancelClick() {
      console.log("click: cancel");
      (0,will_app/* confirmCancel */.hE)(() => {
        this.clearingFields();
        this.$emit('data-cancel', {
          action: "cancel"
        });
      });
    },
    async updateClick() {
      console.log("click: update");
      let valid = await this.validateForm();
      if (!valid) return;
      this.startUpdateRecord();
    },
    async validateForm(focusing = true) {
      const valid = await this.v$.$validate();
      console.log("validate form: valid", valid);
      console.log("error:", this.v$.$errors);
      if (!valid) {
        if (focusing) {
          this.focusFirstError();
        }
        return false;
      }
      return true;
    },
    focusFirstError() {
      if (this.v$.$errors && this.v$.$errors.length > 0) {
        let input = this.v$.$errors[0].$property;
        let el = this.$refs[input];
        if (el) el.focus(); //if using ref
        else jquery_default()("#" + input + "dialog").trigger("focus"); //if using id
      }
    },
    resetRecord() {
      this.reset(ModifyFormvue_type_script_lang_js_defaultData);
      this.v$.$reset();
    },
    startUpdateRecord() {
      (0,will_app/* confirmUpdate */.cS)(() => {
        let progids = this.proglists.map(prg => prg.programid);
        this.localData.progid = progids;
        this.updateRecord(this.localData);
      });
    },
    updateRecord(dataRecord) {
      let jsondata = {
        ajax: true
      };
      let formdata = (0,will_app/* serializeParameters */.L3)(jsondata, dataRecord);
      (0,will_app/* startWaiting */.eF)();
      jquery_default().ajax({
        url: (0,will_app/* getApiUrl */.e9)() + ModifyFormvue_type_script_lang_js_APP_URL + "/update",
        data: formdata.jsondata,
        headers: formdata.headers,
        type: "POST",
        dataType: "json",
        contentType: will_app/* DEFAULT_CONTENT_TYPE */.Xh,
        error: function (transport, status, errorThrown) {
          console.error("error: status", status, "errorThrown", errorThrown);
          (0,will_app/* submitFailure */.pg)(transport, status, errorThrown);
        },
        success: data => {
          (0,will_app/* stopWaiting */.Sk)();
          console.log("success", data);
          if ((0,will_app/* detectErrorResponse */.DA)(data)) return;
          (0,will_app/* successbox */.hM)(() => {
            this.$emit('data-updated', dataRecord, data);
          });
        }
      });
    },
    retrieveRecord(dataKeys, callback) {
      let jsondata = {
        ajax: true
      };
      let formdata = (0,will_app/* serializeParameters */.L3)(jsondata, dataKeys);
      (0,will_app/* startWaiting */.eF)();
      jquery_default().ajax({
        url: (0,will_app/* getApiUrl */.e9)() + ModifyFormvue_type_script_lang_js_APP_URL + "/retrieve",
        data: formdata.jsondata,
        headers: formdata.headers,
        type: "POST",
        dataType: "json",
        contentType: will_app/* DEFAULT_CONTENT_TYPE */.Xh,
        error: function (transport, status, errorThrown) {
          console.error("retrieveRecord: error: status", status, "errorThrown", errorThrown);
          (0,will_app/* submitFailure */.pg)(transport, status, errorThrown);
        },
        success: data => {
          (0,will_app/* stopWaiting */.Sk)();
          console.log("retrieveRecord: success", data);
          if (data.body.dataset) {
            this.reset(data.body.dataset);
            this.v$.$reset();
            this.clearingFields();
            this.readProgramInfo({
              groupname: data.body.dataset.groupname
            });
            if (callback) callback();
          }
        }
      });
    },
    readProgramInfo(dataKeys) {
      let jsondata = {
        ajax: true
      };
      let formdata = (0,will_app/* serializeParameters */.L3)(jsondata, dataKeys);
      (0,will_app/* startWaiting */.eF)();
      jquery_default().ajax({
        url: (0,will_app/* getApiUrl */.e9)() + ModifyFormvue_type_script_lang_js_APP_URL + "/proglist",
        data: formdata.jsondata,
        headers: formdata.headers,
        type: "POST",
        dataType: "json",
        contentType: will_app/* DEFAULT_CONTENT_TYPE */.Xh,
        error: function (transport, status, errorThrown) {
          console.error("retrieveRecord: error: status", status, "errorThrown", errorThrown);
          (0,will_app/* submitFailure */.pg)(transport, status, errorThrown);
        },
        success: data => {
          (0,will_app/* stopWaiting */.Sk)();
          if (data.body.rows) {
            this.proglists = data.body.rows;
          }
        }
      });
    },
    toggleCollapseExpand(event) {
      let $src = jquery_default()(event.target).parent();
      if ($src.is(".up")) {
        $src.removeClass("up").addClass("down");
        jquery_default()("#proglayer").hide();
        $src.find(".fa").removeClass("fa-chevron-circle-up").addClass("fa-chevron-circle-down");
      } else {
        $src.removeClass("down").addClass("up");
        jquery_default()("#proglayer").show();
        $src.find(".fa").removeClass("fa-chevron-circle-down").addClass("fa-chevron-circle-up");
      }
    },
    addProgClick() {
      console.log("add new program");
      let pid = jquery_default()("#progingroup").val();
      if (jquery_default().trim(pid) == "") return;
      let prog = this.proglists.find(prg => prg.programid == pid);
      if (prog) {
        (0,will_app/* alertbox */.Cb)("Duplicate program entry");
        return;
      }
      let idx = this.proglists.length;
      let text = jquery_default()("option:selected", jquery_default()("#progingroup")).text();
      let params = {
        groupname: this.localData.groupname,
        programid: jquery_default()("#progingroup").val(),
        progname: text,
        parameters: "",
        seqno: idx + 1
      };
      this.$root.$refs.permitForm.startInsertRecord(params, () => {
        this.proglists.push(params);
      });
    },
    editProgramInGroup(pid, gid, callback) {
      this.$root.$refs.permitForm.editProgramInGroup(pid, gid, callback);
    },
    removeProgramInGroup(pid, gid, callback) {
      this.$root.$refs.permitForm.removeProgramInGroup(pid, gid, callback);
    },
    startEditProgInGroup(item) {
      console.log("startEditProgInGroup:", item);
      this.editProgramInGroup(item.programid, this.localData.groupname);
    },
    startRemoveProgInGroup(item) {
      console.log("startRemoveProgInGroup:", item);
      (0,will_app/* confirmRemove */.l1)([item.programid], () => {
        this.removeProgramInGroup(item.programid, this.localData.groupname, () => {
          let index = this.proglists.findIndex(prg => prg.programid == item.programid);
          if (index >= 0) {
            this.proglists.splice(index, 1);
          }
        });
      });
    }
  }
});
;// CONCATENATED MODULE: ./src/components/ModifyForm.vue?vue&type=script&lang=js
 
;// CONCATENATED MODULE: ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-12.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-12.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12.use[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/ModifyForm.vue?vue&type=style&index=0&id=5b7d7a64&lang=css
// extracted by mini-css-extract-plugin

;// CONCATENATED MODULE: ./src/components/ModifyForm.vue?vue&type=style&index=0&id=5b7d7a64&lang=css

;// CONCATENATED MODULE: ./src/components/ModifyForm.vue




;


const ModifyForm_exports_ = /*#__PURE__*/(0,exportHelper/* default */.A)(ModifyFormvue_type_script_lang_js, [['render',ModifyFormvue_type_template_id_5b7d7a64_render]])

/* harmony default export */ var ModifyForm = (ModifyForm_exports_);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/EntryForm.vue?vue&type=template&id=fd2b8a3e

const EntryFormvue_type_template_id_fd2b8a3e_hoisted_1 = {
  key: 0,
  class: "modal-title"
};
const EntryFormvue_type_template_id_fd2b8a3e_hoisted_2 = {
  key: 1,
  class: "modal-title"
};
const EntryFormvue_type_template_id_fd2b8a3e_hoisted_3 = {
  class: "row row-height"
};
const EntryFormvue_type_template_id_fd2b8a3e_hoisted_4 = {
  class: "col-md-3 col-height col-label"
};
const EntryFormvue_type_template_id_fd2b8a3e_hoisted_5 = {
  for: "groupnamedialog"
};
const EntryFormvue_type_template_id_fd2b8a3e_hoisted_6 = {
  class: "col-height col-md-4"
};
const EntryFormvue_type_template_id_fd2b8a3e_hoisted_7 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", {
  class: "required"
}, "*", -1);
const EntryFormvue_type_template_id_fd2b8a3e_hoisted_8 = {
  key: 0,
  class: "has-error"
};
const EntryFormvue_type_template_id_fd2b8a3e_hoisted_9 = {
  class: "row row-height"
};
const EntryFormvue_type_template_id_fd2b8a3e_hoisted_10 = {
  class: "col-md-3 col-height col-label"
};
const EntryFormvue_type_template_id_fd2b8a3e_hoisted_11 = {
  for: "nameendialog"
};
const EntryFormvue_type_template_id_fd2b8a3e_hoisted_12 = {
  class: "col-height col-md-8"
};
const EntryFormvue_type_template_id_fd2b8a3e_hoisted_13 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", {
  class: "required"
}, "*", -1);
const EntryFormvue_type_template_id_fd2b8a3e_hoisted_14 = {
  key: 0,
  class: "has-error"
};
const EntryFormvue_type_template_id_fd2b8a3e_hoisted_15 = {
  class: "row row-height"
};
const EntryFormvue_type_template_id_fd2b8a3e_hoisted_16 = {
  class: "col-md-3 col-height col-label"
};
const EntryFormvue_type_template_id_fd2b8a3e_hoisted_17 = {
  for: "namethdialog"
};
const EntryFormvue_type_template_id_fd2b8a3e_hoisted_18 = {
  class: "col-height col-md-8"
};
const EntryFormvue_type_template_id_fd2b8a3e_hoisted_19 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", {
  class: "required"
}, "*", -1);
const EntryFormvue_type_template_id_fd2b8a3e_hoisted_20 = {
  key: 0,
  class: "has-error"
};
const EntryFormvue_type_template_id_fd2b8a3e_hoisted_21 = {
  class: "row row-height"
};
const EntryFormvue_type_template_id_fd2b8a3e_hoisted_22 = {
  class: "col-height col-md-3 col-label"
};
const EntryFormvue_type_template_id_fd2b8a3e_hoisted_23 = {
  for: "usertypedialog"
};
const EntryFormvue_type_template_id_fd2b8a3e_hoisted_24 = {
  class: "col-height col-md-5"
};
const EntryFormvue_type_template_id_fd2b8a3e_hoisted_25 = ["disabled"];
const EntryFormvue_type_template_id_fd2b8a3e_hoisted_26 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("legend", {
  class: "fa-hidden"
}, null, -1);
const EntryFormvue_type_template_id_fd2b8a3e_hoisted_27 = ["value"];
const EntryFormvue_type_template_id_fd2b8a3e_hoisted_28 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", {
  class: "required"
}, "*", -1);
const EntryFormvue_type_template_id_fd2b8a3e_hoisted_29 = {
  key: 0,
  class: "has-error"
};
const EntryFormvue_type_template_id_fd2b8a3e_hoisted_30 = {
  class: "row row-height"
};
const EntryFormvue_type_template_id_fd2b8a3e_hoisted_31 = {
  class: "col-height col-md-3 col-label"
};
const EntryFormvue_type_template_id_fd2b8a3e_hoisted_32 = {
  for: "mobilegroupdialog"
};
const EntryFormvue_type_template_id_fd2b8a3e_hoisted_33 = {
  class: "col-height col-md-5"
};
const EntryFormvue_type_template_id_fd2b8a3e_hoisted_34 = ["value"];
const EntryFormvue_type_template_id_fd2b8a3e_hoisted_35 = {
  class: "row row-height",
  id: "privateflaglayer"
};
const EntryFormvue_type_template_id_fd2b8a3e_hoisted_36 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", {
  class: "col-height col-md-3 col-label"
}, null, -1);
const EntryFormvue_type_template_id_fd2b8a3e_hoisted_37 = {
  class: "col-height col-md-8"
};
const EntryFormvue_type_template_id_fd2b8a3e_hoisted_38 = {
  class: "form-check"
};
const EntryFormvue_type_template_id_fd2b8a3e_hoisted_39 = {
  for: "privateflagdialog",
  class: "form-check-label"
};
const EntryFormvue_type_template_id_fd2b8a3e_hoisted_40 = {
  class: "row row-height"
};
const EntryFormvue_type_template_id_fd2b8a3e_hoisted_41 = {
  class: "col-height col-md-3 col-label"
};
const EntryFormvue_type_template_id_fd2b8a3e_hoisted_42 = {
  class: "col-height col-md-3"
};
const EntryFormvue_type_template_id_fd2b8a3e_hoisted_43 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", {
  id: "iconstyleswitcher"
}, null, -1);
const EntryFormvue_type_template_id_fd2b8a3e_hoisted_44 = {
  class: "row row-height"
};
const EntryFormvue_type_template_id_fd2b8a3e_hoisted_45 = {
  class: "col-height col-md-3 col-label"
};
const EntryFormvue_type_template_id_fd2b8a3e_hoisted_46 = {
  for: "seqnodialog"
};
const EntryFormvue_type_template_id_fd2b8a3e_hoisted_47 = {
  class: "col-height col-md-3"
};
const EntryFormvue_type_template_id_fd2b8a3e_hoisted_48 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", {
  class: "required"
}, "*", -1);
const EntryFormvue_type_template_id_fd2b8a3e_hoisted_49 = {
  key: 0,
  class: "has-error"
};
const EntryFormvue_type_template_id_fd2b8a3e_hoisted_50 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("em", {
  class: "fa fa-save fa-btn-icon"
}, null, -1);
const EntryFormvue_type_template_id_fd2b8a3e_hoisted_51 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("em", {
  class: "fa fa-save fa-btn-icon"
}, null, -1);
const EntryFormvue_type_template_id_fd2b8a3e_hoisted_52 = {
  class: "btn btn-dark btn-sm",
  "data-dismiss": "modal"
};
const EntryFormvue_type_template_id_fd2b8a3e_hoisted_53 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("em", {
  class: "fa fa-close fa-btn-icon"
}, null, -1);
function EntryFormvue_type_template_id_fd2b8a3e_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_InputMask = (0,runtime_core_esm_bundler/* resolveComponent */.g2)("InputMask");
  const _component_InputNumber = (0,runtime_core_esm_bundler/* resolveComponent */.g2)("InputNumber");
  const _component_DialogForm = (0,runtime_core_esm_bundler/* resolveComponent */.g2)("DialogForm");
  return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createBlock */.Wv)(_component_DialogForm, {
    ref: "dialogForm"
  }, {
    header: (0,runtime_core_esm_bundler/* withCtx */.k6)(() => [$options.insertMode ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("h4", EntryFormvue_type_template_id_fd2b8a3e_hoisted_1, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.title_new_group), 1)) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true), $options.updateMode ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("h4", EntryFormvue_type_template_id_fd2b8a3e_hoisted_2, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.title_edit_group), 1)) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true)]),
    default: (0,runtime_core_esm_bundler/* withCtx */.k6)(() => [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", EntryFormvue_type_template_id_fd2b8a3e_hoisted_3, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", EntryFormvue_type_template_id_fd2b8a3e_hoisted_4, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", EntryFormvue_type_template_id_fd2b8a3e_hoisted_5, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.groupname_label), 1)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", EntryFormvue_type_template_id_fd2b8a3e_hoisted_6, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", {
      class: (0,shared_esm_bundler/* normalizeClass */.C4)(["input-group has-validation", {
        'has-error': $setup.v$.groupname.$error
      }])
    }, [(0,runtime_core_esm_bundler/* createVNode */.bF)(_component_InputMask, {
      ref: "groupname",
      modelValue: $setup.localData.groupname,
      "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => $setup.localData.groupname = $event),
      id: "groupnamedialog",
      picture: "(20)X",
      disabled: $setup.disabledKeyField
    }, null, 8, ["modelValue", "disabled"]), EntryFormvue_type_template_id_fd2b8a3e_hoisted_7], 2), $setup.v$.groupname.$error ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("span", EntryFormvue_type_template_id_fd2b8a3e_hoisted_8, (0,shared_esm_bundler/* toDisplayString */.v_)($setup.v$.groupname.$errors[0].$message), 1)) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true)])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", EntryFormvue_type_template_id_fd2b8a3e_hoisted_9, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", EntryFormvue_type_template_id_fd2b8a3e_hoisted_10, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", EntryFormvue_type_template_id_fd2b8a3e_hoisted_11, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.nameen_label), 1)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", EntryFormvue_type_template_id_fd2b8a3e_hoisted_12, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", {
      class: (0,shared_esm_bundler/* normalizeClass */.C4)(["input-group has-validation", {
        'has-error': $setup.v$.nameen.$error
      }])
    }, [(0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("input", {
      ref: "nameen",
      type: "text",
      "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => $setup.localData.nameen = $event),
      id: "nameendialog",
      class: "form-control input-md",
      maxlength: "100"
    }, null, 512), [[runtime_dom_esm_bundler/* vModelText */.Jo, $setup.localData.nameen]]), EntryFormvue_type_template_id_fd2b8a3e_hoisted_13], 2), $setup.v$.nameen.$error ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("span", EntryFormvue_type_template_id_fd2b8a3e_hoisted_14, (0,shared_esm_bundler/* toDisplayString */.v_)($setup.v$.nameen.$errors[0].$message), 1)) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true)])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", EntryFormvue_type_template_id_fd2b8a3e_hoisted_15, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", EntryFormvue_type_template_id_fd2b8a3e_hoisted_16, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", EntryFormvue_type_template_id_fd2b8a3e_hoisted_17, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.nameth_label), 1)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", EntryFormvue_type_template_id_fd2b8a3e_hoisted_18, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", {
      class: (0,shared_esm_bundler/* normalizeClass */.C4)(["input-group has-validation", {
        'has-error': $setup.v$.nameth.$error
      }])
    }, [(0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("input", {
      ref: "nameth",
      type: "text",
      "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => $setup.localData.nameth = $event),
      id: "namethdialog",
      class: "form-control input-md",
      maxlength: "100"
    }, null, 512), [[runtime_dom_esm_bundler/* vModelText */.Jo, $setup.localData.nameth]]), EntryFormvue_type_template_id_fd2b8a3e_hoisted_19], 2), $setup.v$.nameth.$error ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("span", EntryFormvue_type_template_id_fd2b8a3e_hoisted_20, (0,shared_esm_bundler/* toDisplayString */.v_)($setup.v$.nameth.$errors[0].$message), 1)) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true)])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", EntryFormvue_type_template_id_fd2b8a3e_hoisted_21, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", EntryFormvue_type_template_id_fd2b8a3e_hoisted_22, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", EntryFormvue_type_template_id_fd2b8a3e_hoisted_23, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.usertype_label), 1)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", EntryFormvue_type_template_id_fd2b8a3e_hoisted_24, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("fieldset", {
      id: "usertypedialogfieldset",
      disabled: $setup.disabledKeyField
    }, [EntryFormvue_type_template_id_fd2b8a3e_hoisted_26, (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", {
      class: (0,shared_esm_bundler/* normalizeClass */.C4)(["input-group has-validation", {
        'has-error': $setup.v$.usertype.$error
      }])
    }, [(0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("select", {
      ref: "usertype",
      "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => $setup.localData.usertype = $event),
      class: "form-control input-md",
      id: "usertypedialog"
    }, [((0,runtime_core_esm_bundler/* openBlock */.uX)(true), (0,runtime_core_esm_bundler/* createElementBlock */.CE)(runtime_core_esm_bundler/* Fragment */.FK, null, (0,runtime_core_esm_bundler/* renderList */.pI)($props.dataCategory.tkusertype, item => {
      return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("option", {
        key: item.id,
        value: item.id
      }, (0,shared_esm_bundler/* toDisplayString */.v_)(item.text), 9, EntryFormvue_type_template_id_fd2b8a3e_hoisted_27);
    }), 128))], 512), [[runtime_dom_esm_bundler/* vModelSelect */.u1, $setup.localData.usertype]]), EntryFormvue_type_template_id_fd2b8a3e_hoisted_28], 2)], 8, EntryFormvue_type_template_id_fd2b8a3e_hoisted_25), $setup.v$.usertype.$error ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("span", EntryFormvue_type_template_id_fd2b8a3e_hoisted_29, (0,shared_esm_bundler/* toDisplayString */.v_)($setup.v$.usertype.$errors[0].$message), 1)) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true)])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", EntryFormvue_type_template_id_fd2b8a3e_hoisted_30, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", EntryFormvue_type_template_id_fd2b8a3e_hoisted_31, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", EntryFormvue_type_template_id_fd2b8a3e_hoisted_32, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.mobilegroup_label), 1)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", EntryFormvue_type_template_id_fd2b8a3e_hoisted_33, [(0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("select", {
      ref: "mobilegroup",
      "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => $setup.localData.mobilegroup = $event),
      class: "form-control input-md",
      id: "mobilegroupdialog"
    }, [((0,runtime_core_esm_bundler/* openBlock */.uX)(true), (0,runtime_core_esm_bundler/* createElementBlock */.CE)(runtime_core_esm_bundler/* Fragment */.FK, null, (0,runtime_core_esm_bundler/* renderList */.pI)($props.dataCategory.tkgroupmobile, item => {
      return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("option", {
        key: item.id,
        value: item.id
      }, (0,shared_esm_bundler/* toDisplayString */.v_)(item.text), 9, EntryFormvue_type_template_id_fd2b8a3e_hoisted_34);
    }), 128))], 512), [[runtime_dom_esm_bundler/* vModelSelect */.u1, $setup.localData.mobilegroup]])])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", EntryFormvue_type_template_id_fd2b8a3e_hoisted_35, [EntryFormvue_type_template_id_fd2b8a3e_hoisted_36, (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", EntryFormvue_type_template_id_fd2b8a3e_hoisted_37, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", EntryFormvue_type_template_id_fd2b8a3e_hoisted_38, [(0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("input", {
      ref: "privateflag",
      type: "checkbox",
      id: "privateflagdialog",
      "true-value": 1,
      "false-value": 0,
      "onUpdate:modelValue": _cache[5] || (_cache[5] = $event => $setup.localData.privateflag = $event),
      class: "form-control input-md form-check-input"
    }, null, 512), [[runtime_dom_esm_bundler/* vModelCheckbox */.lH, $setup.localData.privateflag]]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", EntryFormvue_type_template_id_fd2b8a3e_hoisted_39, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.privateflag_label), 1)])])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", EntryFormvue_type_template_id_fd2b8a3e_hoisted_40, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", EntryFormvue_type_template_id_fd2b8a3e_hoisted_41, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", null, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.iconstyle_label), 1)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", EntryFormvue_type_template_id_fd2b8a3e_hoisted_42, [EntryFormvue_type_template_id_fd2b8a3e_hoisted_43, (0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("input", {
      type: "hidden",
      id: "iconstyledialog",
      "onUpdate:modelValue": _cache[6] || (_cache[6] = $event => $setup.localData.iconstyle = $event)
    }, null, 512), [[runtime_dom_esm_bundler/* vModelText */.Jo, $setup.localData.iconstyle]])])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", EntryFormvue_type_template_id_fd2b8a3e_hoisted_44, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", EntryFormvue_type_template_id_fd2b8a3e_hoisted_45, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", EntryFormvue_type_template_id_fd2b8a3e_hoisted_46, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.sequenceno_label), 1)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", EntryFormvue_type_template_id_fd2b8a3e_hoisted_47, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", {
      class: (0,shared_esm_bundler/* normalizeClass */.C4)(["input-group has-validation", {
        'has-error': $setup.v$.seqno.$error
      }])
    }, [(0,runtime_core_esm_bundler/* createVNode */.bF)(_component_InputNumber, {
      ref: "seqno",
      modelValue: $setup.localData.seqno,
      "onUpdate:modelValue": _cache[7] || (_cache[7] = $event => $setup.localData.seqno = $event),
      id: "seqnodialog"
    }, null, 8, ["modelValue"]), EntryFormvue_type_template_id_fd2b8a3e_hoisted_48], 2), $setup.v$.seqno.$error ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("span", EntryFormvue_type_template_id_fd2b8a3e_hoisted_49, (0,shared_esm_bundler/* toDisplayString */.v_)($setup.v$.seqno.$errors[0].$message), 1)) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true)])])]),
    footer: (0,runtime_core_esm_bundler/* withCtx */.k6)(() => [$options.insertMode ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("button", {
      key: 0,
      class: "btn btn-dark btn-sm",
      onClick: _cache[8] || (_cache[8] = (...args) => $options.saveClick && $options.saveClick(...args))
    }, [EntryFormvue_type_template_id_fd2b8a3e_hoisted_50, (0,runtime_core_esm_bundler/* createTextVNode */.eW)((0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.save_button), 1)])) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true), $options.updateMode ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("button", {
      key: 1,
      class: "btn btn-dark btn-sm",
      onClick: _cache[9] || (_cache[9] = (...args) => $options.updateClick && $options.updateClick(...args))
    }, [EntryFormvue_type_template_id_fd2b8a3e_hoisted_51, (0,runtime_core_esm_bundler/* createTextVNode */.eW)((0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.update_button), 1)])) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("button", EntryFormvue_type_template_id_fd2b8a3e_hoisted_52, [EntryFormvue_type_template_id_fd2b8a3e_hoisted_53, (0,runtime_core_esm_bundler/* createTextVNode */.eW)((0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.cancel_button), 1)])]),
    _: 1
  }, 512);
}
;// CONCATENATED MODULE: ./src/components/EntryForm.vue?vue&type=template&id=fd2b8a3e

;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/DialogForm.vue?vue&type=template&id=3eb72780

const DialogFormvue_type_template_id_3eb72780_hoisted_1 = ["id"];
const DialogFormvue_type_template_id_3eb72780_hoisted_2 = {
  class: "modal-dialog modal-xm"
};
const DialogFormvue_type_template_id_3eb72780_hoisted_3 = {
  class: "modal-content portal-area fa-portal-area"
};
const DialogFormvue_type_template_id_3eb72780_hoisted_4 = {
  class: "modal-header"
};
const DialogFormvue_type_template_id_3eb72780_hoisted_5 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("button", {
  type: "button",
  class: "close",
  "data-dismiss": "modal"
}, "×", -1);
const DialogFormvue_type_template_id_3eb72780_hoisted_6 = {
  class: "entry-dialog-layer"
};
const DialogFormvue_type_template_id_3eb72780_hoisted_7 = {
  class: "row-heighter modal-footer"
};
function DialogFormvue_type_template_id_3eb72780_render(_ctx, _cache, $props, $setup, $data, $options) {
  return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("div", (0,runtime_core_esm_bundler/* mergeProps */.v6)({
    id: $props.id,
    class: "modal fade pt-page pt-page-item",
    tabindex: "-1",
    role: "dialog"
  }, _ctx.$attrs), [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", DialogFormvue_type_template_id_3eb72780_hoisted_2, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", DialogFormvue_type_template_id_3eb72780_hoisted_3, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", DialogFormvue_type_template_id_3eb72780_hoisted_4, [(0,runtime_core_esm_bundler/* renderSlot */.RG)(_ctx.$slots, "header"), DialogFormvue_type_template_id_3eb72780_hoisted_5]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", DialogFormvue_type_template_id_3eb72780_hoisted_6, [(0,runtime_core_esm_bundler/* renderSlot */.RG)(_ctx.$slots, "default")]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", DialogFormvue_type_template_id_3eb72780_hoisted_7, [(0,runtime_core_esm_bundler/* renderSlot */.RG)(_ctx.$slots, "footer")])])])], 16, DialogFormvue_type_template_id_3eb72780_hoisted_1);
}
;// CONCATENATED MODULE: ./src/components/DialogForm.vue?vue&type=template&id=3eb72780

;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/DialogForm.vue?vue&type=script&lang=js
/* harmony default export */ var DialogFormvue_type_script_lang_js = ({
  props: {
    id: {
      type: String,
      default: "modaldialog_layer"
    }
  }
});
;// CONCATENATED MODULE: ./src/components/DialogForm.vue?vue&type=script&lang=js
 
;// CONCATENATED MODULE: ./src/components/DialogForm.vue




;
const DialogForm_exports_ = /*#__PURE__*/(0,exportHelper/* default */.A)(DialogFormvue_type_script_lang_js, [['render',DialogFormvue_type_template_id_3eb72780_render]])

/* harmony default export */ var DialogForm = (DialogForm_exports_);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/EntryForm.vue?vue&type=script&lang=js









const EntryFormvue_type_script_lang_js_APP_URL = "/api/sfte002";
const EntryFormvue_type_script_lang_js_defaultData = {
  groupname: "",
  nameen: "",
  nameth: "",
  usertype: "",
  mobilegroup: "",
  privateflag: "0",
  iconstyle: "fa fa-desktop",
  seqno: 0
};
/* harmony default export */ var EntryFormvue_type_script_lang_js = ({
  components: {
    DialogForm: DialogForm,
    InputNumber: will_control_umd.InputNumber,
    InputMask: will_control_umd.InputMask
  },
  props: {
    modes: Object,
    labels: Object,
    dataCategory: Object
  },
  emits: ["data-saved", "data-updated", "data-deleted"],
  setup(props) {
    const mode = (0,reactivity_esm_bundler/* ref */.KR)({
      action: "new",
      ...props.modes
    });
    const localData = (0,reactivity_esm_bundler/* ref */.KR)({
      ...EntryFormvue_type_script_lang_js_defaultData
    });
    const disabledKeyField = (0,reactivity_esm_bundler/* ref */.KR)(false);
    const reqalert = (0,reactivity_esm_bundler/* ref */.KR)(props.labels.empty_alert);
    const requiredMessage = () => {
      return validators_dist/* helpers */._$.withMessage(reqalert, validators_dist/* required */.mw);
    };
    const validateRules = (0,runtime_core_esm_bundler/* computed */.EW)(() => {
      return {
        groupname: {
          required: requiredMessage()
        },
        nameen: {
          required: requiredMessage()
        },
        nameth: {
          required: requiredMessage()
        },
        usertype: {
          required: requiredMessage()
        },
        seqno: {
          required: requiredMessage()
        }
      };
    });
    const v$ = (0,dist/* useVuelidate */.fG)(validateRules, localData, {
      $lazy: true,
      $autoDirty: true
    });
    return {
      mode,
      v$,
      localData,
      disabledKeyField,
      reqalert
    };
  },
  created() {
    (0,runtime_core_esm_bundler/* watch */.wB)(this.$props, newProps => {
      this.reqalert = newProps.labels.empty_alert;
    });
  },
  computed: {
    insertMode() {
      return this.mode.action == "insert" || this.mode.action == "new";
    },
    updateMode() {
      return this.mode.action == "update" || this.mode.action == "edit";
    }
  },
  mounted() {
    this.$nextTick(function () {
      jquery_default()("#modaldialog_layer").find(".modal-dialog").draggable();
      jquery_default()("#iconstyleswitcher").styleswitcher({
        $styleInput: jquery_default()("#iconstyledialog"),
        width: 200,
        styleURL: (0,will_app/* getApiUrl */.e9)() + "/api/style/category"
      });
    });
  },
  methods: {
    reset(newData, newMode) {
      if (newData) this.localData = {
        ...newData
      };
      if (newMode) this.mode = {
        ...newMode
      };
    },
    submit() {
      this.$emit('update:formData', this.localData);
    },
    async saveClick() {
      console.log("click: save");
      let valid = await this.validateForm();
      if (!valid) return;
      this.startSaveRecord();
    },
    async updateClick() {
      console.log("click: update");
      let valid = await this.validateForm();
      if (!valid) return;
      this.startUpdateRecord();
    },
    async validateForm(focusing = true) {
      const valid = await this.v$.$validate();
      console.log("validate form: valid", valid);
      console.log("error:", this.v$.$errors);
      if (!valid) {
        if (focusing) {
          this.focusFirstError();
        }
        return false;
      }
      return true;
    },
    focusFirstError() {
      if (this.v$.$errors && this.v$.$errors.length > 0) {
        let input = this.v$.$errors[0].$property;
        let el = this.$refs[input];
        if (el) el.focus(); //if using ref
        else jquery_default()("#" + input + "dialog").trigger("focus"); //if using id
      }
    },
    showDialog() {
      //$("#modaldialog_layer").modal("show");
      jquery_default()(this.$refs.dialogForm.$el).modal("show");
    },
    hideDialog() {
      //$("#modaldialog_layer").modal("hide");
      jquery_default()(this.$refs.dialogForm.$el).modal("hide");
    },
    resetRecord() {
      //reset to default data 
      this.reset(EntryFormvue_type_script_lang_js_defaultData, {
        action: "insert"
      });
      //reset validator
      this.v$.$reset();
      //enable key field
      this.disabledKeyField = false;
    },
    startInsertRecord() {
      this.resetRecord();
      this.showDialog();
      jquery_default()("#iconstyleswitcher").styleupdate();
    },
    startSaveRecord() {
      (0,will_app/* confirmSave */.ex)(() => {
        this.saveRecord(this.localData);
      });
    },
    startUpdateRecord() {
      (0,will_app/* confirmUpdate */.cS)(() => {
        this.updateRecord(this.localData);
      });
    },
    startDeleteRecord(dataKeys) {
      (0,will_app/* confirmDelete */.QV)(Object.values(dataKeys), () => {
        this.deleteRecord(dataKeys);
      });
    },
    saveRecord(dataRecord) {
      let jsondata = {
        ajax: true
      };
      let formdata = (0,will_app/* serializeParameters */.L3)(jsondata, dataRecord);
      (0,will_app/* startWaiting */.eF)();
      jquery_default().ajax({
        url: (0,will_app/* getApiUrl */.e9)() + EntryFormvue_type_script_lang_js_APP_URL + "/insert",
        data: formdata.jsondata,
        headers: formdata.headers,
        type: "POST",
        dataType: "json",
        contentType: will_app/* DEFAULT_CONTENT_TYPE */.Xh,
        error: function (transport, status, errorThrown) {
          console.error("error: status", status, "errorThrown", errorThrown);
          (0,will_app/* submitFailure */.pg)(transport, status, errorThrown);
        },
        success: data => {
          (0,will_app/* stopWaiting */.Sk)();
          console.log("success", data);
          if ((0,will_app/* detectErrorResponse */.DA)(data)) return;
          (0,will_app/* successbox */.hM)(() => {
            //reset data for new record insert
            this.resetRecord();
            setTimeout(() => this.$refs.groupname.focus(), 100);
            this.$emit('data-saved', dataRecord, data);
          });
        }
      });
    },
    updateRecord(dataRecord) {
      let jsondata = {
        ajax: true
      };
      let formdata = (0,will_app/* serializeParameters */.L3)(jsondata, dataRecord);
      (0,will_app/* startWaiting */.eF)();
      jquery_default().ajax({
        url: (0,will_app/* getApiUrl */.e9)() + EntryFormvue_type_script_lang_js_APP_URL + "/update",
        data: formdata.jsondata,
        headers: formdata.headers,
        type: "POST",
        dataType: "json",
        contentType: will_app/* DEFAULT_CONTENT_TYPE */.Xh,
        error: function (transport, status, errorThrown) {
          console.error("error: status", status, "errorThrown", errorThrown);
          (0,will_app/* submitFailure */.pg)(transport, status, errorThrown);
        },
        success: data => {
          (0,will_app/* stopWaiting */.Sk)();
          console.log("success", data);
          if ((0,will_app/* detectErrorResponse */.DA)(data)) return;
          (0,will_app/* successbox */.hM)(() => {
            this.hideDialog();
            this.$emit('data-updated', dataRecord, data);
          });
        }
      });
    },
    retrieveRecord(dataKeys) {
      let jsondata = {
        ajax: true
      };
      let formdata = (0,will_app/* serializeParameters */.L3)(jsondata, dataKeys);
      (0,will_app/* startWaiting */.eF)();
      jquery_default().ajax({
        url: (0,will_app/* getApiUrl */.e9)() + EntryFormvue_type_script_lang_js_APP_URL + "/retrieve",
        data: formdata.jsondata,
        headers: formdata.headers,
        type: "POST",
        dataType: "json",
        contentType: will_app/* DEFAULT_CONTENT_TYPE */.Xh,
        error: function (transport, status, errorThrown) {
          console.error("retrieveRecord: error: status", status, "errorThrown", errorThrown);
          (0,will_app/* submitFailure */.pg)(transport, status, errorThrown);
        },
        success: data => {
          (0,will_app/* stopWaiting */.Sk)();
          console.log("retrieveRecord: success", data);
          if (data.body.dataset) {
            this.reset(data.body.dataset, {
              action: "edit"
            });
            this.v$.$reset();
            this.disabledKeyField = true;
            this.showDialog();
            jquery_default()("#iconstyleswitcher").styleupdate(this.localData.iconstyle);
          }
        }
      });
    },
    deleteRecord(dataKeys) {
      let jsondata = {
        ajax: true
      };
      let formdata = (0,will_app/* serializeParameters */.L3)(jsondata, dataKeys);
      (0,will_app/* startWaiting */.eF)();
      jquery_default().ajax({
        url: (0,will_app/* getApiUrl */.e9)() + EntryFormvue_type_script_lang_js_APP_URL + "/remove",
        data: formdata.jsondata,
        headers: formdata.headers,
        type: "POST",
        dataType: "json",
        contentType: will_app/* DEFAULT_CONTENT_TYPE */.Xh,
        error: function (transport, status, errorThrown) {
          console.error("deleteRecord: error: status", status, "errorThrown", errorThrown);
          (0,will_app/* submitFailure */.pg)(transport, status, errorThrown);
        },
        success: data => {
          (0,will_app/* stopWaiting */.Sk)();
          console.log("deleteRecord: success", data);
          if ((0,will_app/* detectErrorResponse */.DA)(data)) return;
          (0,will_app/* successbox */.hM)(() => {
            this.$emit('data-deleted', dataKeys, data);
          });
        }
      });
    }
  }
});
;// CONCATENATED MODULE: ./src/components/EntryForm.vue?vue&type=script&lang=js
 
;// CONCATENATED MODULE: ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-12.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-12.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12.use[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/EntryForm.vue?vue&type=style&index=0&id=fd2b8a3e&lang=css
// extracted by mini-css-extract-plugin

;// CONCATENATED MODULE: ./src/components/EntryForm.vue?vue&type=style&index=0&id=fd2b8a3e&lang=css

;// CONCATENATED MODULE: ./src/components/EntryForm.vue




;


const EntryForm_exports_ = /*#__PURE__*/(0,exportHelper/* default */.A)(EntryFormvue_type_script_lang_js, [['render',EntryFormvue_type_template_id_fd2b8a3e_render]])

/* harmony default export */ var EntryForm = (EntryForm_exports_);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/PermitForm.vue?vue&type=template&id=a8a27a14

const PermitFormvue_type_template_id_a8a27a14_hoisted_1 = {
  class: "modal-title",
  id: "modalheader"
};
const PermitFormvue_type_template_id_a8a27a14_hoisted_2 = {
  id: "programinfolayer",
  class: "row center-block"
};
const PermitFormvue_type_template_id_a8a27a14_hoisted_3 = {
  class: "col-md-10"
};
const PermitFormvue_type_template_id_a8a27a14_hoisted_4 = {
  id: "program_info",
  class: "control-label"
};
const PermitFormvue_type_template_id_a8a27a14_hoisted_5 = {
  id: "permitinfolayer"
};
const PermitFormvue_type_template_id_a8a27a14_hoisted_6 = {
  class: "checkbox form-check"
};
const PermitFormvue_type_template_id_a8a27a14_hoisted_7 = ["id", "onUpdate:modelValue"];
const PermitFormvue_type_template_id_a8a27a14_hoisted_8 = ["for"];
const PermitFormvue_type_template_id_a8a27a14_hoisted_9 = {
  class: "row row-heighter"
};
const PermitFormvue_type_template_id_a8a27a14_hoisted_10 = {
  class: "col-height col-md-3 col-label"
};
const PermitFormvue_type_template_id_a8a27a14_hoisted_11 = {
  class: "col-height col-md-5"
};
const PermitFormvue_type_template_id_a8a27a14_hoisted_12 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("em", {
  class: "fa fa-save fa-btn-icon"
}, null, -1);
const PermitFormvue_type_template_id_a8a27a14_hoisted_13 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("em", {
  class: "fa fa-save fa-btn-icon"
}, null, -1);
const PermitFormvue_type_template_id_a8a27a14_hoisted_14 = {
  class: "btn btn-dark btn-sm",
  "data-dismiss": "modal"
};
const PermitFormvue_type_template_id_a8a27a14_hoisted_15 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("em", {
  class: "fa fa-close fa-btn-icon"
}, null, -1);
function PermitFormvue_type_template_id_a8a27a14_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_DialogForm = (0,runtime_core_esm_bundler/* resolveComponent */.g2)("DialogForm");
  return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createBlock */.Wv)(_component_DialogForm, {
    ref: "permitDialog"
  }, {
    header: (0,runtime_core_esm_bundler/* withCtx */.k6)(() => [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("h4", PermitFormvue_type_template_id_a8a27a14_hoisted_1, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.permit_dialog_title), 1)]),
    default: (0,runtime_core_esm_bundler/* withCtx */.k6)(() => [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", PermitFormvue_type_template_id_a8a27a14_hoisted_2, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", PermitFormvue_type_template_id_a8a27a14_hoisted_3, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", PermitFormvue_type_template_id_a8a27a14_hoisted_4, (0,shared_esm_bundler/* toDisplayString */.v_)($setup.localData.progname), 1)])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", PermitFormvue_type_template_id_a8a27a14_hoisted_5, [((0,runtime_core_esm_bundler/* openBlock */.uX)(true), (0,runtime_core_esm_bundler/* createElementBlock */.CE)(runtime_core_esm_bundler/* Fragment */.FK, null, (0,runtime_core_esm_bundler/* renderList */.pI)($options.permitLists(), (permit, index) => {
      return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("div", {
        key: index,
        class: "row row-heighter"
      }, [((0,runtime_core_esm_bundler/* openBlock */.uX)(true), (0,runtime_core_esm_bundler/* createElementBlock */.CE)(runtime_core_esm_bundler/* Fragment */.FK, null, (0,runtime_core_esm_bundler/* renderList */.pI)(permit, item => {
        return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("div", {
          key: item.id,
          class: "col-height col-md-4"
        }, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", PermitFormvue_type_template_id_a8a27a14_hoisted_6, [(0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("input", {
          type: "checkbox",
          id: item.id,
          "true-value": true,
          "false-value": false,
          "onUpdate:modelValue": $event => $setup.localData.permits[item.id] = $event,
          class: "form-control input-md form-check-input"
        }, null, 8, PermitFormvue_type_template_id_a8a27a14_hoisted_7), [[runtime_dom_esm_bundler/* vModelCheckbox */.lH, $setup.localData.permits[item.id]]]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", {
          for: item.id,
          class: "form-check-label"
        }, (0,shared_esm_bundler/* toDisplayString */.v_)(item.text), 9, PermitFormvue_type_template_id_a8a27a14_hoisted_8)])]);
      }), 128))]);
    }), 128))]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", PermitFormvue_type_template_id_a8a27a14_hoisted_9, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", PermitFormvue_type_template_id_a8a27a14_hoisted_10, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", null, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.parameters_label), 1)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", PermitFormvue_type_template_id_a8a27a14_hoisted_11, [(0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("input", {
      type: "text",
      "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => $setup.localData.parameters = $event),
      class: "form-control input-md",
      maxlength: "100"
    }, null, 512), [[runtime_dom_esm_bundler/* vModelText */.Jo, $setup.localData.parameters]])])])]),
    footer: (0,runtime_core_esm_bundler/* withCtx */.k6)(() => [$options.insertMode ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("button", {
      key: 0,
      class: "btn btn-dark btn-sm",
      onClick: _cache[1] || (_cache[1] = (...args) => $options.saveClick && $options.saveClick(...args))
    }, [PermitFormvue_type_template_id_a8a27a14_hoisted_12, (0,runtime_core_esm_bundler/* createTextVNode */.eW)((0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.save_button), 1)])) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true), $options.updateMode ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("button", {
      key: 1,
      class: "btn btn-dark btn-sm",
      onClick: _cache[2] || (_cache[2] = (...args) => $options.updateClick && $options.updateClick(...args))
    }, [PermitFormvue_type_template_id_a8a27a14_hoisted_13, (0,runtime_core_esm_bundler/* createTextVNode */.eW)((0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.update_button), 1)])) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("button", PermitFormvue_type_template_id_a8a27a14_hoisted_14, [PermitFormvue_type_template_id_a8a27a14_hoisted_15, (0,runtime_core_esm_bundler/* createTextVNode */.eW)((0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.cancel_button), 1)])]),
    _: 1
  }, 512);
}
;// CONCATENATED MODULE: ./src/components/PermitForm.vue?vue&type=template&id=a8a27a14

;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/PermitForm.vue?vue&type=script&lang=js







const PermitFormvue_type_script_lang_js_APP_URL = "/api/sfte002";
const PermitFormvue_type_script_lang_js_defaultData = {
  groupname: "",
  programid: "",
  progname: "",
  parameters: "",
  seqno: 0,
  permname: [],
  permvalue: [],
  permits: {}
};
/* harmony default export */ var PermitFormvue_type_script_lang_js = ({
  components: {
    DialogForm: DialogForm
  },
  props: {
    modes: Object,
    labels: Object,
    dataCategory: Object
  },
  emits: ["data-saved", "data-updated", "data-deleted"],
  setup(props) {
    const complete = (0,reactivity_esm_bundler/* ref */.KR)({
      saveCallback: undefined,
      updateCallback: undefined
    });
    const mode = (0,reactivity_esm_bundler/* ref */.KR)({
      action: "new",
      ...props.modes
    });
    const localData = (0,reactivity_esm_bundler/* ref */.KR)({
      ...PermitFormvue_type_script_lang_js_defaultData
    });
    return {
      mode,
      localData,
      complete
    };
  },
  computed: {
    insertMode() {
      return this.mode.action == "insert" || this.mode.action == "new";
    },
    updateMode() {
      return this.mode.action == "update" || this.mode.action == "edit";
    }
  },
  methods: {
    permitLists() {
      let results = [];
      let chunkSize = 3;
      let tkpermit = this.$props.dataCategory.tkpermit;
      for (let i = 0; i < tkpermit.length; i += chunkSize) {
        results.push(tkpermit.slice(i, i + chunkSize));
      }
      return results;
    },
    reset(newData, newMode) {
      if (newData) {
        let permits = {};
        this.$props.dataCategory.tkpermit.forEach(item => {
          permits[item.id] = item.text;
        });
        this.localData = {
          permits: permits,
          ...newData
        };
      }
      if (newMode) this.mode = {
        ...newMode
      };
    },
    async saveClick() {
      console.log("click: save");
      let valid = await this.validateForm();
      if (!valid) return;
      this.startSaveRecord();
    },
    async updateClick() {
      console.log("click: update");
      let valid = await this.validateForm();
      if (!valid) return;
      this.startUpdateRecord();
    },
    async validateForm() {
      return true;
    },
    showDialog() {
      jquery_default()(this.$refs.permitDialog.$el).modal("show");
    },
    hideDialog() {
      jquery_default()(this.$refs.permitDialog.$el).modal("hide");
    },
    scrapeParameters() {
      let permnames = [];
      let permvalues = [];
      for (let p in this.localData.permits) {
        let v = this.localData.permits[p];
        permnames.push(p);
        permvalues.push(String(v));
      }
      this.localData.permname = permnames;
      this.localData.permvalue = permvalues;
    },
    startInsertRecord(data, callback) {
      this.complete.saveCallback = callback;
      this.reset(data, {
        action: "insert"
      });
      this.showDialog();
    },
    startSaveRecord() {
      this.scrapeParameters();
      (0,will_app/* confirmSave */.ex)(() => {
        this.saveRecord(this.localData);
      });
    },
    startUpdateRecord() {
      this.scrapeParameters();
      (0,will_app/* confirmUpdate */.cS)(() => {
        this.updateRecord(this.localData);
      });
    },
    startDeleteRecord(dataKeys) {
      (0,will_app/* confirmDelete */.QV)(Object.values(dataKeys), () => {
        this.deleteRecord(dataKeys);
      });
    },
    saveRecord(dataRecord, callback) {
      let jsondata = {
        ajax: true
      };
      let formdata = (0,will_app/* serializeParameters */.L3)(jsondata, dataRecord);
      (0,will_app/* startWaiting */.eF)();
      jquery_default().ajax({
        url: (0,will_app/* getApiUrl */.e9)() + PermitFormvue_type_script_lang_js_APP_URL + "/proginsert",
        data: formdata.jsondata,
        headers: formdata.headers,
        type: "POST",
        dataType: "json",
        contentType: will_app/* DEFAULT_CONTENT_TYPE */.Xh,
        error: function (transport, status, errorThrown) {
          console.error("error: status", status, "errorThrown", errorThrown);
          (0,will_app/* submitFailure */.pg)(transport, status, errorThrown);
        },
        success: data => {
          (0,will_app/* stopWaiting */.Sk)();
          console.log("success", data);
          if ((0,will_app/* detectErrorResponse */.DA)(data)) return;
          this.hideDialog();
          if (callback) callback(dataRecord, data);
          this.$emit('data-saved', dataRecord, data);
          if (this.complete.saveCallback) this.complete.saveCallback(data, dataRecord);
        }
      });
    },
    updateRecord(dataRecord, callback) {
      let jsondata = {
        ajax: true
      };
      let formdata = (0,will_app/* serializeParameters */.L3)(jsondata, dataRecord);
      (0,will_app/* startWaiting */.eF)();
      jquery_default().ajax({
        url: (0,will_app/* getApiUrl */.e9)() + PermitFormvue_type_script_lang_js_APP_URL + "/progupdate",
        data: formdata.jsondata,
        headers: formdata.headers,
        type: "POST",
        dataType: "json",
        contentType: will_app/* DEFAULT_CONTENT_TYPE */.Xh,
        error: function (transport, status, errorThrown) {
          console.error("error: status", status, "errorThrown", errorThrown);
          (0,will_app/* submitFailure */.pg)(transport, status, errorThrown);
        },
        success: data => {
          (0,will_app/* stopWaiting */.Sk)();
          console.log("success", data);
          if ((0,will_app/* detectErrorResponse */.DA)(data)) return;
          this.hideDialog();
          if (callback) callback(data, dataRecord);
          this.$emit('data-updated', dataRecord, data);
          if (this.complete.updateCallback) this.complete.updateCallback(data, dataRecord);
        }
      });
    },
    deleteRecord(dataKeys, callback) {
      let jsondata = {
        ajax: true
      };
      let formdata = (0,will_app/* serializeParameters */.L3)(jsondata, dataKeys);
      (0,will_app/* startWaiting */.eF)();
      jquery_default().ajax({
        url: (0,will_app/* getApiUrl */.e9)() + PermitFormvue_type_script_lang_js_APP_URL + "/progremove",
        data: formdata.jsondata,
        headers: formdata.headers,
        type: "POST",
        dataType: "json",
        contentType: will_app/* DEFAULT_CONTENT_TYPE */.Xh,
        error: function (transport, status, errorThrown) {
          console.error("deleteRecord: error: status", status, "errorThrown", errorThrown);
          (0,will_app/* submitFailure */.pg)(transport, status, errorThrown);
        },
        success: data => {
          (0,will_app/* stopWaiting */.Sk)();
          console.log("deleteRecord: success", data);
          if ((0,will_app/* detectErrorResponse */.DA)(data)) return;
          if (callback) callback(dataKeys, data);
          this.$emit('data-deleted', dataKeys, data);
        }
      });
    },
    retrieveRecord(dataKeys, callback) {
      this.complete.updateCallback = callback;
      let jsondata = {
        ajax: true
      };
      let formdata = (0,will_app/* serializeParameters */.L3)(jsondata, dataKeys);
      (0,will_app/* startWaiting */.eF)();
      jquery_default().ajax({
        url: (0,will_app/* getApiUrl */.e9)() + PermitFormvue_type_script_lang_js_APP_URL + "/progpermit",
        data: formdata.jsondata,
        headers: formdata.headers,
        type: "POST",
        dataType: "json",
        contentType: will_app/* DEFAULT_CONTENT_TYPE */.Xh,
        error: function (transport, status, errorThrown) {
          console.error("retrieveRecord: error: status", status, "errorThrown", errorThrown);
          (0,will_app/* submitFailure */.pg)(transport, status, errorThrown);
        },
        success: data => {
          (0,will_app/* stopWaiting */.Sk)();
          console.log("retrieveRecord: success", data);
          if (data.body.dataset) {
            data.body.dataset.progname = data.body.dataset.programid + " - " + data.body.dataset.prognameen;
            this.reset(data.body.dataset, {
              action: "edit"
            });
            this.showDialog();
          }
        }
      });
    },
    removeProgramInGroup(pid, gid, callback) {
      let params = {
        programid: pid,
        groupname: gid
      };
      this.deleteRecord(params, callback);
    },
    editProgramInGroup(pid, gid, callback) {
      let params = {
        progid: pid,
        groupid: gid
      };
      this.retrieveRecord(params, callback);
    }
  }
});
;// CONCATENATED MODULE: ./src/components/PermitForm.vue?vue&type=script&lang=js
 
;// CONCATENATED MODULE: ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-12.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-12.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12.use[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/PermitForm.vue?vue&type=style&index=0&id=a8a27a14&lang=css
// extracted by mini-css-extract-plugin

;// CONCATENATED MODULE: ./src/components/PermitForm.vue?vue&type=style&index=0&id=a8a27a14&lang=css

;// CONCATENATED MODULE: ./src/components/PermitForm.vue




;


const PermitForm_exports_ = /*#__PURE__*/(0,exportHelper/* default */.A)(PermitFormvue_type_script_lang_js, [['render',PermitFormvue_type_template_id_a8a27a14_render]])

/* harmony default export */ var PermitForm = (PermitForm_exports_);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/AppVfte002.vue?vue&type=script&lang=js













/* harmony default export */ var AppVfte002vue_type_script_lang_js = ({
  components: {
    PageHeader: will_control_umd.PageHeader,
    SearchForm: SearchForm,
    EntryForm: EntryForm,
    PermitForm: PermitForm,
    ModifyForm: ModifyForm
  },
  setup() {
    const dataChunk = {};
    const dataCategory = {
      tprog: [],
      tkgroupmobile: [],
      tkusertype: [],
      tkpermit: []
    };
    let isShowModify = (0,reactivity_esm_bundler/* ref */.KR)(false);
    let labels = (0,reactivity_esm_bundler/* ref */.KR)((0,will_app/* getLabelModel */.aU)());
    let alreadyLoading = (0,reactivity_esm_bundler/* ref */.KR)(false);
    const multiLanguages = (0,reactivity_esm_bundler/* ref */.KR)((0,will_app/* getMultiLanguagesModel */.Hx)());
    return {
      multiLanguages,
      labels,
      dataCategory,
      dataChunk,
      alreadyLoading,
      isShowModify
    };
  },
  mounted() {
    console.log("App: mounted ...");
    this.$nextTick(async () => {
      //ensure ui completed then invoke startApplication 
      (0,will_app/* startApplication */.xL)("vfte002", data => {
        this.multiLanguages = (0,will_app/* getMultiLanguagesModel */.Hx)();
        this.messagingHandler(data);
        this.loadDataCategories(!this.alreadyLoading, () => {
          this.$refs.pageHeader.changeLanguage((0,will_app/* getDefaultLanguage */.i5)());
        });
      });
      //try to find out parameters from url
      const searchParams = new URLSearchParams(window.location.href);
      console.log("param: authtoken=", searchParams.get("authtoken"), ", language=", searchParams.get("language"));
    });
  },
  methods: {
    messagingHandler(data) {
      console.log("messagingHandler: data", data);
    },
    changeLanguage(lang) {
      (0,will_app/* setDefaultLanguage */.Qq)(lang);
      let labelModel = (0,will_app/* getLabelModel */.aU)(lang);
      this.labels = labelModel;
      this.resetDataCategories(lang);
    },
    loadDataCategories(loading, callback) {
      console.log("loadDataCategories: loading", loading);
      if (!loading) return;
      let jsondata = {
        names: ["tprog", "tkgroupmobile", "tkusertype", "tkpermit"]
      };
      let formdata = (0,will_app/* serializeParameters */.L3)(jsondata);
      jquery_default().ajax({
        url: (0,will_app/* getApiUrl */.e9)() + "/api/category/lists",
        data: formdata.jsondata,
        headers: formdata.headers,
        type: "POST",
        dataType: "json",
        contentType: will_app/* DEFAULT_CONTENT_TYPE */.Xh,
        error: function (transport, status, errorThrown) {
          console.error("loadDataCategories: error: status", status, "errorThrown", errorThrown);
        },
        success: data => {
          this.alreadyLoading = true;
          console.log("loadDataCategories: success", data);
          if (data.body) {
            for (let item of data.body) {
              if (item.category && item.resultset && item.resultset.rows) {
                this.dataChunk[item.category] = item.resultset.rows;
              }
            }
            console.log("data chunk", this.dataChunk);
            this.resetDataCategories();
            if (callback) callback();
          }
        }
      });
    },
    resetDataCategories(lang) {
      if (!lang) lang = (0,will_app/* getDefaultLanguage */.i5)();
      if (!lang || lang.trim().length == 0) lang = "EN";
      let tprog;
      let tkgroupmobile;
      let tkusertype;
      let tkpermit;
      let tk_categories = this.dataChunk["tprog"];
      if (tk_categories) {
        tprog = tk_categories.map(item => {
          return {
            id: item.programid,
            text: "TH" == lang ? item.prognameth : item.progname
          };
        });
      }
      tk_categories = this.dataChunk["tkgroupmobile"];
      if (tk_categories) {
        tkgroupmobile = tk_categories.map(item => {
          return {
            id: item.typeid,
            text: "TH" == lang ? item.nameth : item.nameen
          };
        });
      }
      tk_categories = this.dataChunk["tkusertype"];
      if (tk_categories) {
        tkusertype = tk_categories.map(item => {
          return {
            id: item.typeid,
            text: "TH" == lang ? item.nameth : item.nameen
          };
        });
      }
      tk_categories = this.dataChunk["tkpermit"];
      if (tk_categories) {
        tkpermit = tk_categories.map(item => {
          return {
            id: item.typeid,
            text: "TH" == lang ? item.nameth : item.nameen
          };
        });
      }
      if (tprog) this.dataCategory.tprog = tprog;
      if (tkgroupmobile) this.dataCategory.tkgroupmobile = tkgroupmobile;
      if (tkusertype) this.dataCategory.tkusertype = tkusertype;
      if (tkpermit) this.dataCategory.tkpermit = tkpermit;
    },
    dataSelected(item, action) {
      //listen action from search form
      console.log("App: dataSelected", item, "action", action);
      if ("edit" == action) {
        console.log("do edit");
        this.$refs.modifyForm.retrieveRecord({
          groupname: item.groupname
        }, () => {
          this.isShowModify = true;
        });
      } else if ("delete" == action) {
        this.$refs.entryForm.startDeleteRecord({
          groupname: item.groupname
        });
      } else if ("modify" == action) {
        this.$refs.entryForm.retrieveRecord({
          groupname: item.groupname
        });
      }
    },
    dataInsert(filters) {
      //listen action from search form
      console.log("App: record insert", filters);
      this.$refs.entryForm.startInsertRecord();
    },
    dataSaved(data, response) {
      //listen action from entry form when after saved
      console.log("App: record saved");
      console.log("data", data, "response", response);
      this.$refs.searchForm.search();
    },
    dataUpdated(data, response) {
      //listen action from entry form when after updated
      console.log("App: record updated");
      console.log("data", data, "response", response);
      this.$refs.searchForm.search();
    },
    dataDeleted(data, response) {
      //listen action from entry form when after deleted
      console.log("App: record deleted");
      console.log("data", data, "response", response);
      this.$refs.searchForm.search(true);
    },
    permitSaved(data, response) {
      console.log("App: permit saved");
      console.log("data", data, "response", response);
    },
    permitUpdated(data, response) {
      console.log("App: permit updated");
      console.log("data", data, "response", response);
    },
    permitDeleted(data, response) {
      console.log("App: permit deleted");
      console.log("data", data, "response", response);
    },
    modifyUpdated(data, response) {
      console.log("App: modify updated", data, "response", response);
      this.isShowModify = false;
    },
    modifyCancel(data) {
      console.log("App: modify cancel", data);
      this.isShowModify = false;
    }
  }
});
;// CONCATENATED MODULE: ./src/AppVfte002.vue?vue&type=script&lang=js
 
;// CONCATENATED MODULE: ./src/AppVfte002.vue




;
const AppVfte002_exports_ = /*#__PURE__*/(0,exportHelper/* default */.A)(AppVfte002vue_type_script_lang_js, [['render',render]])

/* harmony default export */ var AppVfte002 = (AppVfte002_exports_);
;// CONCATENATED MODULE: ./src/vfte002.js




















(0,will_app/* appInit */.yR)({
  program_message: program_message_namespaceObject,
  default_labels: default_label_namespaceObject,
  program_labels: program_label_namespaceObject
});


console.info("Vue version", runtime_core_esm_bundler/* version */.rE);
(0,runtime_dom_esm_bundler/* createApp */.Ef)(AppVfte002).mount('#app');

/***/ }),

/***/ 477:
/***/ (function() {

/* (ignored) */

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	!function() {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = function(result, chunkIds, fn, priority) {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var chunkIds = deferred[i][0];
/******/ 				var fn = deferred[i][1];
/******/ 				var priority = deferred[i][2];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every(function(key) { return __webpack_require__.O[key](chunkIds[j]); })) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	!function() {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	!function() {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			57: 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = function(chunkId) { return installedChunks[chunkId] === 0; };
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = function(parentChunkLoadingFunction, data) {
/******/ 			var chunkIds = data[0];
/******/ 			var moreModules = data[1];
/******/ 			var runtime = data[2];
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some(function(id) { return installedChunks[id] !== 0; })) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkvfte002"] = self["webpackChunkvfte002"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	}();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, [504], function() { return __webpack_require__(3230); })
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.aa7ecfe6.js.map