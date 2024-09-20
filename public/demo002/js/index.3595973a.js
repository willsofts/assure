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

/***/ 2785:
/***/ (function(__unused_webpack_module, exports) {

class Utilities {
  /**
   * To get date in format dd/MM/yyyy
   * @param now Date or undefind
   * @returns string
   */
  static getDateNow(now) {
    if (!now) now = new Date();
    return this.formatDate(now, false);
  }
  /**
   * To get time in format HH:mm:ss
   * @param now Date or undefined
   * @returns string
   */
  static getTimeNow(now) {
    if (!now) now = new Date();
    let hh = now.getHours();
    let mm = now.getMinutes();
    let ss = now.getSeconds();
    let result = (hh < 10 ? "0" : "") + hh;
    result += (mm < 10 ? ":0" : ":") + mm;
    result += (ss < 10 ? ":0" : ":") + ss;
    return result;
  }
  /**
   * To get datetime in format dd/MM/yyyy HH:mm:ss
   * @param now Date or undefined
   * @returns string
   */
  static getDateTimeNow(now) {
    if (!now) now = new Date();
    return this.getDateNow(now) + " " + this.getTimeNow(now);
  }
  /**
   * To get date in format yyyy-MM-dd
   * @param now Date or undefined
   * @returns string
   */
  static getYMD(now) {
    return this.formatDate(now, true);
  }
  /**
   * To get date in format dd/MM/yyyy
   * @param now Date or undefined
   * @returns string
   */
  static getDMY(now) {
    return this.formatDate(now, false);
  }
  /**
   * To format Date to dd/MM/yyyy or yyyy-MM-dd
   * @param now Date or undefined
   * @param ymd boolean default false
   * @returns string
   */
  static formatDate(now, ymd = false) {
    if (!now) return "";
    let dd = now.getDate();
    let mm = now.getMonth() + 1;
    let yy = now.getFullYear();
    let result = "";
    if (ymd) {
      result = "" + yy;
      result += (mm < 10 ? "-0" : "-") + mm;
      result += (dd < 10 ? "-0" : "-") + dd;
    } else {
      result = (dd < 10 ? "0" : "") + dd;
      result += (mm < 10 ? "/0" : "/") + mm;
      result += "/" + yy;
    }
    return result;
  }
  /**
   * To format time HH:mm:ss
   * @param now Date or undefined
   * @returns string
   */
  static formatTime(now) {
    if (!now) return "";
    return this.getTimeNow(now);
  }
  /**
   * To format date into dd/MM/yyyy HH:mm:ss or yyyy-MM-dd HH:mm:ss
   * @param now Date or undefined
   * @param ymd boolean default false
   * @returns string
   */
  static formatDateTime(now, ymd = false) {
    if (!now) return "";
    return this.formatDate(now, ymd) + " " + this.getTimeNow(now);
  }
  /**
   * To format time HH:mm:ss
   * @param now Date or undefined
   * @returns string
   */
  static getHMS(now) {
    if (!now) return "";
    return "" + now;
  }
  /**
   * To format Date to yyyy-MM-dd
   * @param now Date or undefined
   * @returns string
   */
  static currentDate(now) {
    if (!now) now = new Date();
    let dd = now.getDate();
    let mm = now.getMonth() + 1;
    let yy = now.getFullYear();
    let result = "" + yy;
    result += (mm < 10 ? "-0" : "-") + mm;
    result += (dd < 10 ? "-0" : "-") + dd;
    return result;
  }
  /**
   * To format time to HH:mm:ss
   * @param now Date or undefined
   * @returns string
   */
  static currentTime(now) {
    if (!now) now = new Date();
    let hh = now.getHours();
    let mm = now.getMinutes();
    let ss = now.getSeconds();
    let result = (hh < 10 ? "0" : "") + hh;
    result += (mm < 10 ? ":0" : ":") + mm;
    result += (ss < 10 ? ":0" : ":") + ss;
    return result;
  }
  /**
   * To format Date to yyyy-MM-dd HH:mm:ss
   * @param now Date or undefined
   * @returns string
   */
  static currentDateTime(now) {
    if (!now) now = new Date();
    return this.currentDate(now) + " " + this.currentTime(now);
  }
  /**
   * To get current time in milli seconds
   * @param now Date or undefined
   * @returns number
   */
  static currentTimeMillis(now) {
    if (!now) now = new Date();
    return now.getTime();
  }
  /**
   * To add number of days into Date
   * @param days number
   * @param date Date or undefined
   * @returns Date
   */
  static addDays(days, date) {
    if (!date) date = new Date();
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  /**
   * To compare between date
   * @param adate Date or undefined
   * @param bdate Date or undefined
   * @returns number, -1 = lesser than, 0 = equal , 1 = greater than
   */
  static compareDate(adate, bdate) {
    if (!adate && !bdate) return 0;
    let astr = this.formatDate(adate, true);
    let bstr = this.formatDate(bdate, true);
    return this.compareString(astr, bstr);
  }
  /**
   * To compare between time
   * @param adate Date or undefined
   * @param bdate Date or undefined
   * @returns number, -1 = lesser than, 0 = equal , 1 = greater than
   */
  static compareTime(adate, bdate) {
    if (!adate && !bdate) return 0;
    let astr = this.formatTime(adate);
    let bstr = this.formatTime(bdate);
    return this.compareString(astr, bstr);
  }
  /**
   * To compare between datetime
   * @param adate Date or undefined
   * @param bdate Date or undefined
   * @returns number, -1 = lesser than, 0 = equal , 1 = greater than
   */
  static compareDateTime(adate, bdate) {
    if (!adate && !bdate) return 0;
    let astr = this.formatDateTime(adate, true);
    let bstr = this.formatDateTime(bdate, true);
    return this.compareString(astr, bstr);
  }
  /**
   * To compare string value
   * @param astr string
   * @param bstr string
   * @returns number, -1 = lesser than, 0 = equal , 1 = greater than
   */
  static compareString(astr, bstr) {
    if (!astr && !bstr) return 0;
    if (!astr && bstr) return -1;
    if (astr && !bstr) return 1;
    let text = "" + astr;
    return text.localeCompare(bstr, undefined, {
      sensitivity: 'accent'
    });
  }
  /**
   * To check string equals with ignore case
   * @param astr string
   * @param bstr string
   * @returns boolean
   */
  static equalsIgnoreCase(astr, bstr) {
    return this.compareString(astr, bstr) == 0;
  }
  /**
   * To check data is string or not
   * @param value any
   * @returns boolean
   */
  static isString(value) {
    return typeof value === 'string' || value instanceof String;
  }
  /**
   * To parse integer (especially from string)
   * @param dataValue any
   * @param defaultValue number
   * @returns number
   */
  static parseInteger(dataValue, defaultValue) {
    if (dataValue) {
      if (this.isString(dataValue)) {
        return parseInt(dataValue.replaceAll(',', ''));
      } else {
        if (typeof dataValue === "number") {
          return dataValue;
        }
      }
    }
    return defaultValue;
  }
  /**
   * To parse float (especially from string)
   * @param dataValue any
   * @param defaultValue number
   * @returns number
   */
  static parseFloat(dataValue, defaultValue) {
    if (dataValue) {
      if (this.isString(dataValue)) {
        return parseFloat(dataValue.replaceAll(',', ''));
      } else {
        if (typeof dataValue === "number") {
          return dataValue;
        }
      }
    }
    return defaultValue;
  }
  /**
   * To parse boolean (especially from string)
   * @param dataValue any
   * @param defaultValue boolean
   * @returns boolean
   */
  static parseBoolean(dataValue, defaultValue) {
    if (dataValue !== undefined && dataValue !== null) {
      if (this.isString(dataValue)) {
        let pr = ("" + dataValue).toLowerCase();
        if (pr === "true") return true;
        if (pr === "false") return false;
        return Boolean(pr);
      } else {
        if (typeof dataValue === "boolean") {
          return dataValue;
        }
      }
    }
    return defaultValue;
  }
  /**
   * To parse Date with data value string in format dd/MM/yyyy, yyyy-MM-dd, dd/MM/yyyy HH:mm:ss, yyyy-MM-dd HH:mm:ss
   * @param dataValue
   * @param defaultValue
   * @returns Date
   */
  static parseDate(dataValue, defaultValue) {
    if (dataValue) {
      if (this.isString(dataValue)) {
        let datestr = ("" + dataValue).trim();
        if (datestr != "") {
          if (datestr.indexOf("T") > 0 && datestr.indexOf("Z") > 0) {
            try {
              const dateInstance = new Date(datestr);
              if (dateInstance) return dateInstance;
            } catch (ex) {
              console.error(ex);
            }
          }
          let result = undefined;
          let separator = " ";
          if (datestr.indexOf("T") > 0) separator = "T";
          let [date, time] = datestr.split(separator);
          if (date.indexOf(":") > 0) {
            time = date;
            date = "";
          }
          if (date) {
            if (date.indexOf("/") > 0) {
              let [day, month, year] = date.split('/');
              result = new Date(Number(year), Number(month) - 1, Number(day));
            } else if (date.indexOf("-") > 0) {
              let [year, month, day] = date.split('-');
              result = new Date(Number(year), Number(month) - 1, Number(day));
            }
          }
          if (time) {
            if (!result) result = new Date();
            let [hours, minutes, seconds] = time.split(':');
            if (hours !== undefined) result.setHours(Number(hours));
            if (minutes !== undefined) result.setMinutes(Number(minutes));
            if (seconds !== undefined) {
              if (seconds.indexOf(".") > 0) {
                let [sec, msec] = seconds.split(".");
                result.setSeconds(Number(sec));
                let idx = msec.indexOf("Z");
                if (idx > 0) {
                  msec = msec.substring(0, idx);
                }
                result.setMilliseconds(Number(msec));
              } else {
                result.setSeconds(Number(seconds));
              }
            } else {
              result.setSeconds(0);
            }
          }
          return result;
        }
      } else {
        if (dataValue instanceof Date) {
          return dataValue;
        }
      }
    }
    return defaultValue;
  }
  /**
   * To parse time with data value string in format HH:mm:ss
   * @param dataValue
   * @param defaultValue
   * @returns Date
   */
  static parseTime(dataValue, defaultValue) {
    if (dataValue && dataValue.trim().length > 0) {
      let [hours, minutes, seconds] = dataValue.split(":");
      let result = new Date();
      if (hours !== undefined) result.setHours(Number(hours));
      if (minutes !== undefined) result.setMinutes(Number(minutes));
      if (seconds !== undefined) result.setSeconds(Number(seconds));else result.setSeconds(0);
      return result;
    }
    return defaultValue;
  }
  /**
   * get current date/time now
   * @returns Date
   */
  static now() {
    return new Date();
  }
  /**
   * try to translate variables in template with foramt ${key} with value in variables
   * @returns string
   */
  static translateVariables(template, variables) {
    let data = variables;
    if (variables instanceof Map) {
      data = Object.fromEntries(variables);
    }
    for (let key in data) {
      template = template.replaceAll("${" + key + "}", data[key]);
    }
    return template;
  }
  /**
   * serialize timestamp into string format yyyyMMddHHmmssSSS
   * @returns string
   */
  static serializeTimestamp(now, delimiter, includeMillis = true) {
    let dd = now.getDate();
    let mo = now.getMonth() + 1;
    let year = now.getFullYear();
    let month = (mo < 10 ? "0" : "") + mo;
    let day = (dd < 10 ? "0" : "") + dd;
    let hh = now.getHours();
    let mm = now.getMinutes();
    let ss = now.getSeconds();
    let hour = (hh < 10 ? "0" : "") + hh;
    let minute = (mm < 10 ? "0" : "") + mm;
    let second = (ss < 10 ? "0" : "") + ss;
    let ml = now.getMilliseconds();
    let millis = (ml < 100 ? "0" : "") + ml;
    if (includeMillis) {
      return [year, month, day, hour, minute, second, millis].join(delimiter ? delimiter : '');
    }
    return [year, month, day, hour, minute, second].join(delimiter ? delimiter : '');
  }
  /**
   * To get date format with short or long month
   * @returns string
   */
  static getFormatDate(date = new Date(), fortype = this.SHORT, delimiter = " ", forstyle = this.NORMAL, separater = ",") {
    var dd = date.getDate();
    var mm = date.getMonth();
    var yy = date.getFullYear();
    var mstr = "";
    if (fortype == this.SHORT) {
      //short month
      mstr = this.SHORT_MONTH_ARRAY[mm];
    } else {
      //long month
      mstr = this.LONG_MONTH_ARRAY[mm];
    }
    if (forstyle == this.INTER) {
      return mstr + delimiter + dd + separater + delimiter + yy;
    }
    return dd + delimiter + mstr + delimiter + yy;
  }
  /**
   * To get date format with short month
   * @returns string
   */
  static getShortDate(date = new Date(), delimiter = " ", forstyle = this.NORMAL) {
    return this.getFormatDate(date, this.SHORT, delimiter, forstyle);
  }
  /**
   * To get date format with long month
   * @returns string
   */
  static getLongDate(date = new Date(), delimiter = " ", forstyle = this.NORMAL) {
    return this.getFormatDate(date, this.LONG, delimiter, forstyle);
  }
  /**
   * To get week day with short or long format
   * @returns string
   */
  static getWeekDay(date = new Date(), fortype = this.LONG) {
    if (fortype == this.SHORT) {
      return this.SHORT_WEEK_DAY[date.getDay()];
    }
    return this.LONG_WEEK_DAY[date.getDay()];
  }
  /**
   * To get short week day
   * @returns string
   */
  static getShortWeekDay(date = new Date()) {
    return this.getWeekDay(date, this.SHORT);
  }
  /**
   * To get long week day
   * @returns string
   */
  static getLongWeekDay(date = new Date()) {
    return this.getWeekDay(date, this.LONG);
  }
  /**
   * To get week day format
   * @returns string
   */
  static getFormatWeekDate(date = new Date(), fortype = this.LONG, delimiter = " ", forstyle = this.NORMAL, separater = ",") {
    let weekday = this.getWeekDay(date, fortype);
    let result = this.getFormatDate(date, fortype, delimiter, forstyle, separater);
    return weekday + separater + delimiter + result;
  }
}
exports.F = Utilities;
Utilities.NORMAL = 0;
Utilities.INTER = 1;
Utilities.SHORT = 0;
Utilities.LONG = 1;
Utilities.SHORT_MONTH_ARRAY = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
Utilities.LONG_MONTH_ARRAY = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
Utilities.SHORT_WEEK_DAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
Utilities.LONG_WEEK_DAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
/**
 * To check attributes is in object element
 * @param element unknown
 * @param attributes string array
 * @returns boolean
 */
Utilities.hasAttributes = (element, attributes) => {
  if (element === undefined || element === null) return false;
  return attributes.every(attribute => {
    return Object.prototype.hasOwnProperty.call(element, attribute);
  });
};

/***/ }),

/***/ 5679:
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
var bootbox_default = /*#__PURE__*/__webpack_require__.n(bootbox);
// EXTERNAL MODULE: ./src/assets/jquery/js/jquery.maskedinput.js
var jquery_maskedinput = __webpack_require__(8435);
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
var default_label_namespaceObject = /*#__PURE__*/JSON.parse('[{"language":"TH","label":[{"name":"english_lang","value":"อังกฤษ"},{"name":"thai_lang","value":"ไทย"},{"name":"title_new","value":"สร้างใหม่"},{"name":"title_edit","value":"แก้ไข"},{"name":"title_view","value":"มอง"},{"name":"save_button","value":"บันทึก"},{"name":"delete_button","value":"ลบ"},{"name":"retrieve_button","value":"เรียกดู"},{"name":"search_button","value":"ค้นหา"},{"name":"saveas_button","value":"บันทึกเป็น"},{"name":"submit_button","value":"ส่งข้อมูล"},{"name":"cancel_button","value":"ยกเลิก"},{"name":"clear_button","value":"ล้าง"},{"name":"reset_button","value":"ล้าง"},{"name":"update_button","value":"ปรับปรุง"},{"name":"close_button","value":"ปิด"},{"name":"send_button","value":"ส่ง"},{"name":"complete_button","value":"สำเร็จ"},{"name":"download_button","value":"ดาวน์โหลด"},{"name":"insert_button","value":"เพิ่ม"},{"name":"executebutton","value":"ปฏิบัติการ"},{"name":"ok_button","value":"ตกลง"},{"name":"import_button","value":"นำเข้า"},{"name":"export_button","value":"นำออก"},{"name":"remove_button","value":"ลบ"},{"name":"upload_button","value":"อัพโหลด"},{"name":"consend_button","value":"ส่งแบบสอบถาม"},{"name":"version_label","value":"รุ่น"},{"name":"action_label","value":" "},{"name":"active_label","value":"ใช้งาน"},{"name":"inactive_label","value":"ไม่ใช้งาน"},{"name":"all_label","value":"ทั้งหมด"},{"name":"seqno_label","value":"ลำดับที่"},{"name":"page_notfound","value":"ไม่พบหน้าใช้งาน"},{"name":"record_notfound","value":"ไม่พบรายการ"},{"name":"trx_notfound","value":"ไม่พบรายการ"},{"name":"invalid_alert","value":"กรอกข้อมูลไม่ถูกต้อง"},{"name":"empty_alert","value":"กรุณากรอกข้อมูล"}]},{"language":"EN","label":[{"name":"english_lang","value":"English"},{"name":"thai_lang","value":"Thai"},{"name":"title_new","value":"Add New"},{"name":"title_edit","value":"Edit"},{"name":"title_view","value":"View"},{"name":"save_button","value":"Save"},{"name":"delete_button","value":"Delete"},{"name":"retrieve_button","value":"Retrieve"},{"name":"search_button","value":"Search"},{"name":"saveas_button","value":"Save As"},{"name":"submit_button","value":"Submit Data"},{"name":"cancel_button","value":"Cancel"},{"name":"clear_button","value":"Clear"},{"name":"reset_button","value":"Clear"},{"name":"close_button","value":"Close"},{"name":"update_button","value":"Update"},{"name":"send_button","value":"Send"},{"name":"complete_button","value":"Complete"},{"name":"download_button","value":"Down Load"},{"name":"insert_button","value":"Insert"},{"name":"execute_button","value":"Execute"},{"name":"ok_button","value":"OK"},{"name":"import_button","value":"Import"},{"name":"export_button","value":"Export"},{"name":"remove_button","value":"Remove"},{"name":"upload_button","value":"Upload"},{"name":"consend_button","value":"Send"},{"name":"version_label","value":"Version"},{"name":"action_label","value":" "},{"name":"active_label","value":"Active"},{"name":"inactive_label","value":"Inactive"},{"name":"all_label","value":"All"},{"name":"seqno_label","value":"No."},{"name":"page_notfound","value":"Page not found"},{"name":"record_notfound","value":"Record not found"},{"name":"trx_notfound","value":"Transaction not found"},{"name":"invalid_alert","value":"Invalid input"},{"name":"empty_alert","value":"This cannot be empty"}]}]');
;// CONCATENATED MODULE: ./src/assets/json/program_label.json
var program_label_namespaceObject = /*#__PURE__*/JSON.parse('[{"language":"TH","label":[{"name":"caption_title","value":"ตัวอย่างข้อมูล"},{"name":"account_label","value":"บัญชี"},{"name":"amount_label","value":"ยอดเงิน"},{"name":"age_label","value":"อายุ"},{"name":"gender_label","value":"เพศ"},{"name":"male_label","value":"ชาย"},{"name":"female_label","value":"หญิง"},{"name":"domestic_label","value":"เป็นคนในประเทศ"},{"name":"effectdate_label","value":"วันที่มีผล"},{"name":"effecttime_label","value":"เวลาที่มีผล"},{"name":"pincode_label","value":"รหัสลับ"},{"name":"marrystatus_label","value":"สถานะ"},{"name":"licenses_label","value":"ใบอนุญาต"},{"name":"languages_label","value":"ภาษา"},{"name":"remark_label","value":"หมายเหตุ"},{"name":"title_label","value":"หัวข้อ"},{"name":"caption_label","value":"คำบรรยาย"},{"name":"assets_label","value":"จำนวนสินทรัพย์"},{"name":"credit_label","value":"จำนวนเครดิต"},{"name":"passcode_label","value":"รหัสผ่าน"},{"name":"createdate_label","value":"วันที่สร้าง"},{"name":"createtime_label","value":"เวลาที่สร้าง"},{"name":"editdate_label","value":"วันที่แก้ไข"},{"name":"edittime_label","value":"เวลาแก้ไข"},{"name":"account_head","value":"บัญชี"},{"name":"amount_head","value":"ยอดเงิน"},{"name":"age_head","value":"อายุ"},{"name":"gender_head","value":"เพศ"},{"name":"effectdate_head","value":"วันที่มีผล"},{"name":"effecttime_head","value":"เวลาที่มีผล"},{"name":"title_head","value":"ชื่อ"},{"name":"age_alert","value":"อายุต้องอยู่ระหว่าง %s และ %s ปี"}]},{"language":"EN","label":[{"name":"caption_title","value":"Sampling Information"},{"name":"account_label","value":"Account"},{"name":"amount_label","value":"Amount"},{"name":"age_label","value":"Age"},{"name":"gender_label","value":"Gender"},{"name":"male_label","value":"Male"},{"name":"female_label","value":"Female"},{"name":"domestic_label","value":"Domestic"},{"name":"effectdate_label","value":"Effect Date"},{"name":"effecttime_label","value":"Effect Time"},{"name":"pincode_label","value":"PIN"},{"name":"marrystatus_label","value":"Status"},{"name":"licenses_label","value":"Licenses"},{"name":"languages_label","value":"Languages"},{"name":"remark_label","value":"Remark"},{"name":"title_label","value":"Title"},{"name":"caption_label","value":"Caption"},{"name":"assets_label","value":"Number of Assets"},{"name":"credit_label","value":"Credit"},{"name":"passcode_label","value":"Pass Code"},{"name":"createdate_label","value":"Create Date"},{"name":"createtime_label","value":"Create Time"},{"name":"editdate_label","value":"Edit Date"},{"name":"edittime_label","value":"Edit Time"},{"name":"account_head","value":"Account"},{"name":"amount_head","value":"Amount"},{"name":"age_head","value":"Age"},{"name":"gender_head","value":"Gender"},{"name":"effectdate_head","value":"Effect Date"},{"name":"effecttime_head","value":"Effect Time"},{"name":"title_head","value":"Title"},{"name":"age_alert","value":"Age must be between %s and %s years"}]}]');
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.push.js
var es_array_push = __webpack_require__(4114);
;// CONCATENATED MODULE: ./src/assets/js/msg.util.js

function msg_util_getMessageCode(errcode, params, defaultMessage) {
  if (errcode && errcode.trim().length > 0) {
    let program_message = getProgramMessage();
    let lang = app_info_getDefaultLanguage();
    if (!lang || lang.trim().length == 0) lang = "EN";
    let msg = program_message.find(item => {
      return item.code == errcode;
    });
    if (msg) {
      let text = msg[lang];
      if (text && text.trim().length > 0) {
        return replaceString(text, params);
      }
    }
  }
  return defaultMessage ? defaultMessage : errcode;
}
function replaceString(str, arrStr) {
  if (arrStr) {
    let regex = /%s/;
    for (let i = 0; i < arrStr.length; i++) {
      let t_str = arrStr[i];
      str = str.replace(regex, t_str);
    }
  }
  if (str) {
    let regex = /%s/g;
    str = str.replace(regex, "");
  }
  return str;
}
;// CONCATENATED MODULE: ./src/assets/js/app.util.js






const fs_winary = new Array();
function getWindowByName(winname) {
  if (!winname) return null;
  for (let i = 0, isz = fs_winary.length; i < isz; i++) {
    try {
      if (fs_winary[i]) {
        if (fs_winary[i].name == winname) return fs_winary[i];
      }
    } catch (ex) {
      console.error(ex);
    }
  }
  return null;
}
function closeChildWindows() {
  for (let i = 0, isz = fs_winary.length; i < isz; i++) {
    try {
      if (fs_winary[i]) fs_winary[i].close();
    } catch (ex) {
      console.error(ex);
    }
  }
}
function addWindow(awindow) {
  if (!awindow) return;
  fs_winary.push(awindow);
}
function submitWindow(settings) {
  let p = settings;
  if (p.url && p.url != "" && p.params) {
    let method = p.method || "POST";
    let frm = $("<form method='" + method + "'></form>");
    frm.attr("action", p.url);
    frm.attr("target", p.windowName);
    if (typeof p.params === "string") {
      let prms = p.params.split("&");
      for (let i = 0; i < prms.length; i++) {
        let kary = prms[i].split("=");
        let inp = $('<input type="hidden" name="' + kary[0] + '"></input>');
        inp.val(kary[1]);
        frm.append(inp);
      }
    } else {
      if (Array.isArray(p.params)) {
        for (let i = 0; i < p.params.length; i++) {
          let prm = p.params[i];
          if (prm.name) {
            let inp = $('<input type="hidden" name="' + prm.name + '"></input>');
            inp.val(prm.value);
            frm.append(inp);
          }
        }
      } else {
        if (p.params) {
          for (let prm in p.params) {
            let inp = $('<input type="hidden" name="' + prm + '"></input>');
            inp.val(p.params[prm]);
            frm.append(inp);
          }
        }
      }
    }
    let layer = $("<div class='open-new-window-submit-layer'></div>");
    layer.append(frm);
    $("body").append(layer);
    frm.trigger("submit");
    setTimeout(function () {
      layer.remove();
    }, 1500);
  }
}
function openNewWindow(settings) {
  let defaultSettings = {
    newTab: true,
    method: "POST",
    url: "",
    windowName: "_blank",
    windowWidth: window.screen.availWidth,
    windowHeight: window.screen.availHeight,
    windowFeatures: "toobar=no,menubar=no,location=no,directories=no,status=no,scrollbars=yes,resizable=yes",
    fullScreen: null,
    params: null
  };
  let p = Object.assign({}, defaultSettings, settings);
  try {
    let fswin = getWindowByName(p.winName);
    if (fswin) {
      fswin.focus();
      return;
    }
  } catch (ex) {
    console.error(ex);
  }
  let fs_window = null;
  if (p.newTab) {
    if (p.params) fs_window = window.open("", p.windowName);else fs_window = window.open(p.url, p.windowName);
  } else {
    let sw = window.screen.availWidth;
    let sh = window.screen.availHeight;
    let wx = (sw - p.windowWidth) / 2;
    let wy = (sh - p.windowHeight) / 2;
    let fs_features = "top=" + wy + ",left=" + wx + ",width=" + p.windowWidth + ",height=" + p.windowHeight + "," + p.windowFeatures;
    if (p.params) fs_window = window.open("", p.windowName, fs_features);else fs_window = window.open(p.url, p.windowName, fs_features);
  }
  fs_window.opener = self;
  try {
    addWindow(fs_window);
  } catch (ex) {
    console.error(ex);
  }
  submitWindow(p);
  return fs_window;
}
function startWaiting() {
  try {
    let dc = jquery_default()(document.body);
    let sh = dc.innerHeight();
    let fslayer = jquery_default()("#fswaitlayer");
    let lh = fslayer.height();
    let fstop = mouseY;
    if (lh !== undefined && sh !== undefined) {
      if (lh > sh - fstop) fstop = mouseY - lh;
    }
    let dw = dc.innerWidth();
    fslayer.css("top", fstop);
    if (dw !== undefined) fslayer.css("left", mouseX > 0 ? mouseX : dw - 50);
    fslayer.show();
  } catch (ex) {
    console.error(ex);
  }
}
function stopWaiting() {
  jquery_default()("#fswaitlayer").hide();
}
function submitFailure(xhr, status, errorThrown, checking = true) {
  stopWaiting();
  console.log("submitFailure", xhr.responseText);
  errorThrown = parseErrorThrown(xhr, status, errorThrown);
  alertbox(errorThrown, function () {
    if (checking && xhr.status == 401) {
      try {
        window.parent.reLogin();
      } catch (ex) {
        console.error(ex);
      }
    }
  });
}
function parseErrorThrown(xhr, status, errorThrown) {
  if (!errorThrown) {
    errorThrown = xhr.responseText;
  } else {
    if (errorThrown == xhr.status) {
      errorThrown = xhr.responseText;
    }
  }
  try {
    if (xhr.status == 400 || xhr.status == 401) errorThrown = xhr.responseText; //400=Bad Request,401=Unauthen
    if (xhr.responseText) {
      let json = JSON.parse(xhr.responseText);
      if (json.message) errorThrown = json.message;
      if (json.text) errorThrown = json.text;
      if (json.head.errordesc) errorThrown = json.head.errordesc;
    }
  } catch (ex) {
    console.error(ex);
  }
  if (!errorThrown || errorThrown.trim().length == 0) errorThrown = "Unknown error or network error";
  return errorThrown;
}
function detectErrorResponse(data) {
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch (ex) {
      console.error(ex);
    }
  }
  if (data?.head?.errorflag == "Y") {
    alertmsg(data.head.errordesc);
    return true;
  }
  return false;
}
function successbox(callback, params) {
  let title = msg_util_getMessageCode("fsinfo", null, "Information");
  alertbox("QS0004", callback, null, params, null, title, "fa fa-info-circle");
}
function warningbox(errcode, callback, params) {
  let title = getMessageCode("fswarn", null, "Warning");
  alertbox(errcode, callback, null, params, null, title, "fa fa-exclamation-circle");
}
function alertbox(errcode, callback, defaultmsg, params, addonmsg, title, icon) {
  if (!title || title.trim().length == 0) title = msg_util_getMessageCode("fsalert", null, "Alert");
  let txt = msg_util_getMessageCode(errcode, params);
  if (txt != null && txt != "") {
    if (addonmsg) txt += " " + addonmsg;
    alertDialog(txt, callback, title, icon);
  } else {
    if (defaultmsg) {
      if (addonmsg) defaultmsg += " " + addonmsg;
      alertDialog(defaultmsg, callback, title, icon);
    } else {
      alertDialog(errcode, callback, title, icon);
    }
  }
}
function alertDialog(msg, callbackfn, title = "Alert", icon = "fa fa-bell-o") {
  if (!msg) {
    console.log("alertDialog: msg undefined");
    return;
  }
  try {
    let fs_okbtn = msg_util_getMessageCode("fsokbtn");
    if (!fs_okbtn || fs_okbtn == "" || fs_okbtn == "fsokbtn") fs_okbtn = "OK";
    //let fs_okbtn = "OK";
    bootbox_default().alert({
      title: "<em class='" + icon + "'></em>&nbsp;<label>" + title + "</label>",
      message: msg,
      callback: function () {
        if (callbackfn) callbackfn();
      },
      buttons: {
        ok: {
          label: fs_okbtn
        }
      }
    });
    jquery_default()(".bootbox > .modal-dialog").draggable();
    return;
  } catch (ex) {
    console.error(ex);
  }
  if (callbackfn) callbackfn();
}
function confirmbox(errcode, okFn, cancelFn, defaultmsg, params, addonmsg, title, icon) {
  if (!title || title.trim().length == 0) title = msg_util_getMessageCode("fsconfirm", null, "Confirmation");
  let txt = msg_util_getMessageCode(errcode, params);
  if (txt != null && txt != "") {
    if (addonmsg) txt += " " + addonmsg;
    return confirmDialog(txt, okFn, cancelFn, title, icon);
  } else {
    if (defaultmsg) {
      if (addonmsg) defaultmsg += " " + addonmsg;
      return confirmDialog(defaultmsg, okFn, cancelFn, title, icon);
    } else {
      return confirmDialog(errcode, okFn, cancelFn, title, icon);
    }
  }
}
function confirmDialog(msg, okCallback, cancelCallback, title = "Confirmation", icon = "fa fa-question-circle") {
  try {
    let fs_confirmbtn = msg_util_getMessageCode("fsconfirmbtn");
    if (!fs_confirmbtn || fs_confirmbtn == "" || fs_confirmbtn == "fsconfirmbtn") fs_confirmbtn = "OK";
    let fs_cancelbtn = msg_util_getMessageCode("fscancelbtn");
    if (!fs_cancelbtn || fs_cancelbtn == "" || fs_cancelbtn == "fscancelbtn") fs_cancelbtn = "Cancel";
    //let fs_confirmbtn = "OK";
    //let fs_cancelbtn = "Cancel";
    bootbox_default().confirm({
      title: "<em class='" + icon + "'></em>&nbsp;<label>" + title + "</label>",
      message: msg,
      callback: function (result) {
        if (result) {
          if (okCallback) okCallback();
        } else {
          if (cancelCallback) cancelCallback();
        }
      },
      swapButtonOrder: true,
      buttons: {
        confirm: {
          label: fs_confirmbtn
        },
        cancel: {
          label: fs_cancelbtn
        }
      }
    });
    jquery_default()(".bootbox > .modal-dialog").draggable();
    return true;
  } catch (ex) {
    console.log(ex.description);
  }
  return true;
}
function alertmsg(errcode, defaultmsg, params, callback) {
  alertbox(errcode, callback, defaultmsg, params);
}
function confirmmsg(errcode, defaultmsg, params, okFn, cancelFn) {
  confirmbox(errcode, okFn, cancelFn, defaultmsg, params);
}
function confirmDialogBox(errcode, params, defaultmsg, okFn, cancelFn, addonmsg) {
  return confirmbox(errcode, okFn, cancelFn, defaultmsg, params, addonmsg);
}
function confirmDelete(params, okFn, cancelFn, addonmsg) {
  if (!confirmDialogBox("QS0001", params, "Do you want to delete this transaction?", okFn, cancelFn, addonmsg)) return false;
  return true;
}
function confirmSave(okFn, cancelFn, addonmsg) {
  if (!confirmDialogBox("QS0002", null, "Do you want to save this transaction?", okFn, cancelFn, addonmsg)) return false;
  return true;
}
function confirmCancel(okFn, cancelFn, addonmsg) {
  if (!confirmDialogBox("QS0003", null, "Do you want to cancel this transaction?", okFn, cancelFn, addonmsg)) return false;
  return true;
}
function confirmRemove(params, okFn, cancelFn, addonmsg) {
  if (!confirmDialogBox("QS0005", params, "Do you want to delete this record?", okFn, cancelFn, addonmsg)) return false;
  return true;
}
function confirmSend(okFn, cancelFn, addonmsg) {
  if (!confirmDialogBox("QS0006", null, "Do you want to send this transaction?", okFn, cancelFn, addonmsg)) return false;
  return true;
}
function confirmUpdate(okFn, cancelFn, addonmsg) {
  if (!confirmDialogBox("QS0007", null, "Do you want to update this transaction?", okFn, cancelFn, addonmsg)) return false;
  return true;
}
function confirmClear(params, okFn, cancelFn, addonmsg) {
  if (!confirmDialogBox("QS0008", params, "Do you want to clear this?", okFn, cancelFn, addonmsg)) return false;
  return true;
}
function confirmProcess(okFn, cancelFn, addonmsg) {
  if (!confirmDialogBox("QS0009", null, "Do you want to process this transaction?", okFn, cancelFn, addonmsg)) return false;
  return true;
}
function confirmSaveAs(okFn, cancelFn, addonmsg) {
  if (!confirmDialogBox("QS0010", null, "Do you want to save as this transaction?", okFn, cancelFn, addonmsg)) return false;
  return true;
}
function confirmReceive(okFn, cancelFn, addonmsg) {
  if (!confirmDialogBox("QS0011", null, "Do you want to receive this transaction?", okFn, cancelFn, addonmsg)) return false;
  return true;
}
function confirmReset(okFn, cancelFn, addonmsg) {
  if (!confirmDialogBox("QS0012", null, "Do you want to reset this trasaction?", okFn, cancelFn, addonmsg)) return false;
  return true;
}
function confirmErase(params, okFn, cancelFn, addonmsg) {
  if (!confirmDialogBox("QS0013", params, "Do you want to delete %s row(s)?", okFn, cancelFn, addonmsg)) return false;
  return true;
}
function confirmApprove(params, okFn, cancelFn, addonmsg) {
  if (!confirmDialogBox("QS0014", params, "Do you want to confirm approve the %s request?", okFn, cancelFn, addonmsg)) return false;
  return true;
}
function confirmReject(params, okFn, cancelFn, addonmsg) {
  if (!confirmDialogBox("QS0015", params, "Do you want to reject %s?", okFn, cancelFn, addonmsg)) return false;
  return true;
}
function confirmRequest(okFn, cancelFn, addonmsg) {
  if (!confirmDialogBox("QS0016", null, "Do you want to create this request?", okFn, cancelFn, addonmsg)) return false;
  return true;
}
function confirmImport(okFn, cancelFn, addonmsg) {
  if (!confirmDialogBox("QS0017", null, "Do you want to import this transaction?", okFn, cancelFn, addonmsg)) return false;
  return true;
}
function confirmExport(okFn, cancelFn, addonmsg) {
  if (!confirmDialogBox("QS0018", null, "Do you want to export this transaction?", okFn, cancelFn, addonmsg)) return false;
  return true;
}
function confirmResend(okFn, cancelFn, addonmsg) {
  if (!confirmDialogBox("QS0019", null, "Do you want to resend this transaction?", okFn, cancelFn, addonmsg)) return false;
  return true;
}
function confirmRevise(params, okFn, cancelFn, addonmsg) {
  if (!confirmDialogBox("QS0020", params, "Do you want to revise the transaction?", okFn, cancelFn, addonmsg)) return false;
  return true;
}
var mouseX = 0;
var mouseY = 0;
function startApplication(pid, callback) {
  console.log("startApplication: pid=" + pid);
  jquery_default()(document).on("mousedown", function (e) {
    mouseX = e.pageX;
    mouseY = e.pageY;
  });
  jquery_default()(window).on("beforeunload", function (e) {
    if (fs_winary.length > 0) {
      e.preventDefault();
      e.returnValue = "";
      return "";
    }
  }).on("unload", function () {
    closeChildWindows();
  });
  //disable bootstrap modal auto close when click outside and ESC key
  try {
    //bootstrap v4
    (jquery_default()).fn.modal.Constructor.Default.backdrop = "static";
    (jquery_default()).fn.modal.Constructor.Default.keyboard = false;
  } catch (ex) {
    console.error(ex);
  }
  if (callback) setupApplication(callback);
}
function setupApplication(callback) {
  let reply = requestAccessorInfo(callback);
  console.log("request access info: ", reply);
}
function serializeParameters(parameters, addonParameters, raw) {
  if (addonParameters) {
    Object.assign(parameters, addonParameters);
  }
  let jsondata = {};
  let cipherdata = false;
  if (raw || getDefaultRawParameters()) {
    jsondata = parameters;
  } else {
    let dh = messenger_getDH();
    if (dh) {
      cipherdata = true;
      jsondata.ciphertext = dh.encrypt(JSON.stringify(parameters));
    } else {
      jsondata = parameters;
    }
  }
  console.log("serialize: parameters", JSON.stringify(parameters));
  console.log("serialize: jsondata", JSON.stringify(jsondata));
  let token = getAccessorToken();
  let headers = {
    "authtoken": token,
    "data-type": cipherdata ? "json/cipher" : "",
    language: app_info_getDefaultLanguage()
  };
  //console.log("serialize: headers",JSON.stringify(headers));
  return {
    cipherdata: cipherdata,
    jsondata: JSON.stringify(jsondata),
    jsonobject: jsondata,
    headers: headers
  };
}
function decryptCipherData(headers, data) {
  let accepttype = headers["accept-type"];
  let dh = getDH();
  if (accepttype == "json/cipher") {
    let json = JSON.parse(data);
    if (dh && json.body.data && typeof json.body.data === "string") {
      let jsondatatext = dh.decrypt(json.body.data);
      console.log("decryptCipherData: jsondatatext", jsondatatext);
      let jsondata = JSON.parse(jsondatatext);
      json.body = jsondata;
      return json;
    }
  }
  if (accepttype == "text/cipher") {
    let jsontext = dh.decrypt(data);
    console.log("decryptCipherData: jsontext", jsontext);
    if (jsontext) {
      let json = JSON.parse(jsontext);
      return json;
    }
  }
  return data;
}
function createLinkStyle(css_url) {
  if (css_url && css_url.trim().length > 0) {
    console.log("try to create link style:", css_url);
    try {
      let style = document.createElement('link');
      style.type = "text/css";
      style.rel = "stylesheet";
      style.href = css_url;
      document.head.appendChild(style);
    } catch (ex) {
      console.error(ex);
    }
  }
}
// EXTERNAL MODULE: ./node_modules/crypto-js/index.js
var crypto_js = __webpack_require__(3169);
var crypto_js_default = /*#__PURE__*/__webpack_require__.n(crypto_js);
// EXTERNAL MODULE: ./node_modules/bigi/lib/index.js
var lib = __webpack_require__(2935);
var lib_default = /*#__PURE__*/__webpack_require__.n(lib);
;// CONCATENATED MODULE: ./src/assets/js/dh.js





const getPrimes = function (min, max) {
  const result = Array(max + 1).fill(0).map((_, i) => i);
  for (let i = 2; i <= Math.sqrt(max + 1); i++) {
    for (let j = i ** 2; j < max + 1; j += i) delete result[j];
  }
  return Object.values(result.slice(min));
};
const getRandomNum = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
const getRandomPrime = function (min, max) {
  const primes = getPrimes(min, max);
  return primes[getRandomNum(0, primes.length - 1)];
};
const getPrimeNumber = function () {
  return getRandomPrime(1000, 10000);
};
function dh_DH() {
  this.prime = "" + getPrimeNumber();
  this.generator = "" + getPrimeNumber();
  this.privateKey = "" + getPrimeNumber();
  this.publicKey = "" + getPrimeNumber();
  this.sharedKey = "" + getPrimeNumber();
  this.otherPublicKey = "" + getPrimeNumber();
}
dh_DH.prototype.encryptText = function (word, keyBase64) {
  let key = crypto_js_default().enc.Base64.parse(keyBase64);
  let srcs = crypto_js_default().enc.Utf8.parse(word);
  let encrypted = crypto_js_default().AES.encrypt(srcs, key, {
    mode: (crypto_js_default()).mode.ECB,
    padding: (crypto_js_default()).pad.Pkcs7
  });
  return encrypted.toString();
};
dh_DH.prototype.decryptText = function (word, keyBase64) {
  let key = crypto_js_default().enc.Base64.parse(keyBase64);
  let decrypt = crypto_js_default().AES.decrypt(word, key, {
    mode: (crypto_js_default()).mode.ECB,
    padding: (crypto_js_default()).pad.Pkcs7
  });
  return crypto_js_default().enc.Utf8.stringify(decrypt).toString();
};
dh_DH.prototype.encrypt = function (word) {
  let hash = crypto_js_default().SHA256(this.sharedKey);
  let keyBase64 = hash.toString((crypto_js_default()).enc.Base64);
  let key = crypto_js_default().enc.Base64.parse(keyBase64);
  let srcs = crypto_js_default().enc.Utf8.parse(word);
  let encrypted = crypto_js_default().AES.encrypt(srcs, key, {
    mode: (crypto_js_default()).mode.ECB,
    padding: (crypto_js_default()).pad.Pkcs7
  });
  return encrypted.toString();
};
dh_DH.prototype.decrypt = function (word) {
  let hash = crypto_js_default().SHA256(this.sharedKey);
  let keyBase64 = hash.toString((crypto_js_default()).enc.Base64);
  let key = crypto_js_default().enc.Base64.parse(keyBase64);
  let decrypt = crypto_js_default().AES.decrypt(word, key, {
    mode: (crypto_js_default()).mode.ECB,
    padding: (crypto_js_default()).pad.Pkcs7
  });
  return crypto_js_default().enc.Utf8.stringify(decrypt).toString();
};
dh_DH.prototype.computePublicKey = function () {
  let G = new (lib_default())(this.generator);
  let P = new (lib_default())(this.prime);
  let a = new (lib_default())(this.privateKey);
  let ap = G.modPowInt(a, P);
  this.publicKey = ap.toString();
};
dh_DH.prototype.computeSharedKey = function () {
  let P = new (lib_default())(this.prime);
  let a = new (lib_default())(this.privateKey);
  let bp = new (lib_default())(this.otherPublicKey);
  let ashare = bp.modPowInt(a, P);
  this.sharedKey = ashare.toString();
};
dh_DH.prototype.compute = function () {
  this.computePublicKey();
  this.computeSharedKey();
};
dh_DH.prototype.requestGenerator = function (callback, aurl) {
  this.requestPublicKey(this, callback, aurl);
};
dh_DH.prototype.getAccessorInfo = function () {
  return getAccessorInfo();
};
dh_DH.prototype.getAccessorToken = function () {
  let json = this.getAccessorInfo();
  if (json && json.authtoken) {
    return json.authtoken;
  }
  return "";
};
dh_DH.prototype.requestPublicKey = function (dh, callback, aurl) {
  if (!aurl) aurl = getApiUrl() + "/api/crypto/dh";
  let authtoken = this.getAccessorToken();
  jquery_default().ajax({
    url: aurl,
    type: "POST",
    dataType: "json",
    headers: {
      "authtoken": authtoken
    },
    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
    error: function (transport, status, errorThrown) {
      console.log(errorThrown);
      if (callback) callback(false, errorThrown);
    },
    success: function (data, status, transport) {
      console.log(transport.responseText);
      if (dh && data.body.info) {
        let info = data.body.info;
        dh.prime = info.prime;
        dh.generator = info.generator;
        dh.otherPublicKey = info.publickey;
        dh.compute();
        dh.submitPublicKey();
      }
      if (callback) callback(true, data, transport);
    }
  });
};
dh_DH.prototype.submitPublicKey = function (callback, aurl) {
  if (!aurl) aurl = getApiUrl() + "/api/crypto/dh";
  let authtoken = this.getAccessorToken();
  jquery_default().ajax({
    url: aurl,
    type: "POST",
    data: {
      publickey: this.publicKey
    },
    dataType: "json",
    headers: {
      "authtoken": authtoken
    },
    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
    error: function (transport, status, errorThrown) {
      console.log(errorThrown);
      if (callback) callback(false, errorThrown);
    },
    success: function (data, status, transport) {
      console.log(transport.responseText);
      if (callback) callback(true, transport);
    }
  });
};
dh_DH.prototype.updatePublicKey = function (callback, aurl) {
  if (!aurl) aurl = getApiUrl() + "/api/crypto/update";
  let authtoken = this.getAccessorToken();
  jquery_default().ajax({
    url: aurl,
    type: "POST",
    data: {
      publickey: this.publicKey
    },
    dataType: "json",
    headers: {
      "authtoken": authtoken
    },
    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
    error: function (transport, status, errorThrown) {
      console.log(errorThrown);
      if (callback) callback(false, errorThrown);
    },
    success: function (data, status, transport) {
      console.log(transport.responseText);
      if (callback) callback(true, transport);
    }
  });
};
// EXTERNAL MODULE: ./node_modules/secure-ls/dist/secure-ls.js
var secure_ls = __webpack_require__(1517);
var secure_ls_default = /*#__PURE__*/__webpack_require__.n(secure_ls);
;// CONCATENATED MODULE: ./src/assets/js/messenger.js




var messagingCallback;
var currentWindow;
var secureEngine;
function getSecureEngine() {
  if (!secureEngine) {
    secureEngine = isSecureStorage() ? new (secure_ls_default())({
      storage: "local" == app_info_getBaseStorage() ? localStorage : sessionStorage
    }) : null;
  }
  return secureEngine;
}
function setMessagingCallback(callback) {
  messagingCallback = callback;
}
function setCurrentWindow(curwin) {
  currentWindow = curwin;
}
function getCurrentWindow() {
  return currentWindow;
}
function getStorage(key) {
  let secureLs = getSecureEngine();
  if (secureLs) return secureLs.get(key);
  if ("local" == app_info_getBaseStorage()) {
    return localStorage.getItem(key);
  }
  return sessionStorage.getItem(key);
}
function setStorage(key, value) {
  let secureLs = getSecureEngine();
  if (secureLs) {
    secureLs.set(key, value);
    return;
  }
  if ("local" == app_info_getBaseStorage()) {
    localStorage.setItem(key, value);
    return;
  }
  sessionStorage.setItem(key, value);
}
function removeStorage(key) {
  let secureLs = getSecureEngine();
  if (secureLs) {
    secureLs.remove(key);
    return;
  }
  if ("local" == getBaseStorage()) {
    localStorage.removeItem(key);
    return;
  }
  sessionStorage.removeItem(key);
}
function getAccessorInfo() {
  let info = getStorage("accessorinfo");
  if (info && info != "") {
    try {
      return JSON.parse(info);
    } catch (ex) {
      console.error(ex);
    }
  }
  return null;
}
function getAccessorToken() {
  let json = getAccessorInfo();
  if (json && json.authtoken) {
    return json.authtoken;
  }
  let token = getApiToken();
  if (token && token != "") return token;
  return "";
}
function saveAccessorInfo(json) {
  setStorage("accessorinfo", JSON.stringify(json));
}
function removeAccessorInfo() {
  removeStorage("accessorinfo");
}
function sendMessageInterface(win) {
  let moderator = win ? "opener" : "parent";
  let info = getAccessorInfo();
  let options = getStorage("accessoptions");
  let msg = {
    type: "storage",
    moderator: moderator,
    API_URL: getApiUrl(),
    BASE_URL: getBaseUrl(),
    CDN_URL: getCdnUrl(),
    IMG_URL: getImgUrl(),
    DEFAULT_LANGUAGE: app_info_getDefaultLanguage(),
    API_TOKEN: getApiToken(),
    BASE_STORAGE: app_info_getBaseStorage(),
    SECURE_STORAGE: isSecureStorage(),
    BASE_CSS: getBaseCss(),
    accessorinfo: info,
    accessoptions: options
  };
  return sendMessageToFrame(msg, win);
}
function sendMessageToFrame(data, win) {
  if (!data) return false;
  try {
    console.log("sendMessageToFrame:", data);
    if (!win) win = document.getElementsByTagName('iframe')[0].contentWindow;
    if (win) win.postMessage(JSON.stringify(data), "*");
    return true;
  } catch (ex) {
    console.log(ex);
  }
  return false;
}
function requestAccessorInfo(callback) {
  if (callback) setMessagingCallback(callback);
  let msg = {
    type: "accessorinfo"
  };
  console.log("requestAccessorInfo: ", msg);
  console.log("window.opener", window.opener);
  console.log("window.parent", window.parent);
  if (window.opener) {
    return sendMessageToOpener(msg);
  }
  return sendMessageToParent(msg);
}
function sendMessageToParent(data) {
  if (!data) return;
  try {
    console.log("sendMessageToParent:", data);
    window.parent.postMessage(JSON.stringify(data), "*");
    return true;
  } catch (ex) {
    console.log(ex);
  }
  return false;
}
function sendMessageToOpener(data) {
  if (!data) return;
  try {
    console.log("sendMessageToOpener:", data);
    window.opener.postMessage(JSON.stringify(data), "*");
    return true;
  } catch (ex) {
    console.log(ex);
  }
  return false;
}
function handleRequestMessage(data) {
  console.log("handleRequestMessage: data", data);
  if (data.type == "storage") {
    if (data.API_URL !== undefined) setApiUrl(data.API_URL);
    if (data.BASE_URL !== undefined) setBaseUrl(data.BASE_URL);
    if (data.CDN_URL !== undefined) setCdnUrl(data.CDN_URL);
    if (data.IMG_URL !== undefined) setImgUrl(data.IMG_URL);
    if (data.DEFAULT_LANGUAGE !== undefined) setDefaultLanguage(data.DEFAULT_LANGUAGE);
    if (data.API_TOKEN !== undefined) setApiToken(data.API_TOKEN);
    if (data.BASE_STORAGE !== undefined) setBaseStorage(data.BASE_STORAGE);
    if (data.SECURE_STORAGE !== undefined) setSecureStorage(data.SECURE_STORAGE);
    if (data.BASE_CSS !== undefined) setBaseCss(data.BASE_CSS);
    if (data.accessoptions !== undefined) setStorage("accessoptions", data.accessoptions);
    if (data.accessorinfo) {
      saveAccessorInfo(data.accessorinfo);
    }
    console.info("handleRequestMessage: accessor info", data.accessorinfo);
    console.info("handleRequestMessage: DEFAULT_LANGUAGE=" + app_info_getDefaultLanguage(), ", BASE_STORAGE=" + app_info_getBaseStorage(), ", DEFAULT_RAW_PARAMETERS=" + getDefaultRawParameters(), ", SECURE_STORAGE=" + isSecureStorage());
    console.info("handleRequestMessage: API_URL=" + getApiUrl(), ", BASE_URL=" + getBaseUrl(), ", CDN_URL=" + getCdnUrl(), ", IMG_URL=" + getImgUrl());
    console.info("handleRequestMessage: API_TOKEN=" + getApiToken());
    createLinkStyle(getBaseCss());
  }
  if (messagingCallback) messagingCallback(data);
}
function setupDiffie(json) {
  console.log("setupDiffie", getAccessorToken());
  let info = json.body.info;
  if (info) {
    const dh = new DH();
    dh.prime = info.prime;
    dh.generator = info.generator;
    dh.otherPublicKey = info.publickey;
    dh.compute();
    dh.updatePublicKey(success => {
      if (success) {
        info.handshake = "C"; //confirm
        saveAccessorInfo(json.body);
      }
    });
    info.privatekey = dh.privateKey;
    info.publickey = dh.publicKey;
    info.sharedkey = dh.sharedKey;
    info.otherpublickey = dh.otherPublicKey;
    info.handshake = "";
    saveAccessorInfo(json.body);
  }
}
function messenger_getDH() {
  let json = getAccessorInfo();
  if (json && json.info) {
    let info = json.info;
    if (!info.handshake || info.handshake == "" || info.handshake == "F") return null; //not confirm or fail
    if (info.prime && info.generator && info.publickey && info.privatekey && info.sharedkey && info.otherpublickey) {
      const dh = new dh_DH();
      dh.prime = info.prime;
      dh.generator = info.generator;
      dh.otherPublicKey = info.publickey;
      dh.privateKey = info.privatekey;
      dh.publicKey = info.publickey;
      dh.sharedKey = info.sharedkey;
      dh.otherPublicKey = info.otherpublickey;
      return dh;
    }
  }
  return null;
}
function bindingChildMessaging() {
  window.onmessage = function (e) {
    console.log("window-messenger: onmessage:", e.data);
    try {
      let payload = e.data;
      if (typeof payload === 'string') {
        payload = JSON.parse(e.data);
      }
      //in case of parent window, try to send accessor info
      /*
      if(payload.type=="accessorinfo") {					
          sendMessageInterface(getCurrentWindow());
          return;
      }*/
      //in case of child window, try to handle request message
      handleRequestMessage(payload);
    } catch (ex) {
      console.error(ex);
    }
  };
}
function bindingParentMessaging() {
  window.onmessage = function (e) {
    console.log("window-main: onmessage:", e.data);
    try {
      let payload = e.data;
      if (typeof payload === 'string') {
        payload = JSON.parse(e.data);
      }
      //in case of parent window, try to send accessor info

      if (payload.type == "accessorinfo") {
        sendMessageInterface(getCurrentWindow());
        return;
      }
      //in case of child window, try to handle request message
      //handleRequestMessage(payload);
    } catch (ex) {
      console.error(ex);
    }
  };
}
;// CONCATENATED MODULE: ./src/assets/js/app.info.js

var DEFAULT_LANGUAGE = "EN";
var API_URL = "";
var BASE_URL = "";
var CDN_URL = "";
var IMG_URL = ".";
var BASE_STORAGE = "session";
var API_TOKEN = "";
var DEFAULT_RAW_PARAMETERS = "false" == "true";
var SECURE_STORAGE = ({"NODE_ENV":"production","VUE_APP_API_TOKEN":"","VUE_APP_API_URL":"","VUE_APP_BASE_CSS":"","VUE_APP_BASE_STORAGE":"session","VUE_APP_BASE_URL":"","VUE_APP_CDN_URL":"","VUE_APP_DEFAULT_LANGUAGE":"EN","VUE_APP_DEFAULT_RAW_PARAMETERS":"false","VUE_APP_IMG_URL":".","BASE_URL":""}).VUE_APP_SECURE_STORAGE == "true";
var BASE_CSS = "";
const DEFAULT_CONTENT_TYPE = "application/json; charset=UTF-8";
console.info("DEFAULT_LANGUAGE=" + DEFAULT_LANGUAGE, ", BASE_STORAGE=" + BASE_STORAGE, ", DEFAULT_RAW_PARAMETERS=" + DEFAULT_RAW_PARAMETERS, ", SECURE_STORAGE=" + SECURE_STORAGE);
console.info("API_URL=" + API_URL, ", BASE_URL=" + BASE_URL, ", CDN_URL=" + CDN_URL, ", IMG_URL=" + IMG_URL + ", BASE_CSS=" + BASE_CSS);
console.info("API_TOKEN=" + API_TOKEN);
function app_info_getDefaultLanguage() {
  return DEFAULT_LANGUAGE;
}
function setDefaultLanguage(language) {
  console.log("set default_language=" + language);
  if (language && language.trim().length > 0) DEFAULT_LANGUAGE = language;
}
function getApiToken() {
  return API_TOKEN;
}
function getApiUrl() {
  return API_URL;
}
function getBaseUrl() {
  return BASE_URL;
}
function getCdnUrl() {
  return CDN_URL;
}
function getImgUrl() {
  return IMG_URL;
}
function app_info_getBaseStorage() {
  return BASE_STORAGE;
}
function getDefaultRawParameters() {
  return DEFAULT_RAW_PARAMETERS;
}
function setApiToken(value) {
  API_TOKEN = value;
}
function setApiUrl(value) {
  API_URL = value;
}
function setBaseUrl(value) {
  BASE_URL = value;
}
function setCdnUrl(value) {
  CDN_URL = value;
}
function setImgUrl(value) {
  IMG_URL = value;
}
function setBaseStorage(value) {
  BASE_STORAGE = value;
}
function setDefaultRawParameters(value) {
  DEFAULT_RAW_PARAMETERS = value;
}
function setSecureStorage(value) {
  SECURE_STORAGE = value;
}
function isSecureStorage() {
  return SECURE_STORAGE;
}
function getBaseCss() {
  return BASE_CSS;
}
function setBaseCss(value) {
  BASE_CSS = value;
}
var default_labels = [];
var program_labels = [];
var program_message = [];
function getProgramMessage() {
  return program_message;
}
function app_info_getDefaultLabels() {
  return default_labels;
}
function app_info_getProgramLabels() {
  return program_labels;
}
function setProgramMessage(message) {
  program_message = message;
}
function setDefaultLabels(labels) {
  default_labels = labels;
}
function setProgramLabels(labels) {
  program_labels = labels;
}
function appInit(settings = {
  program_message,
  default_labels,
  program_labels,
  listen_messaging: 'child'
}) {
  const setting = Object.assign({
    listen_messaging: 'child'
  }, settings);
  setProgramMessage(setting.program_message);
  setDefaultLabels(setting.default_labels);
  setProgramLabels(setting.program_labels);
  if (setting.listen_messaging == 'child') {
    bindingChildMessaging();
  } else if (setting.listen_messaging == 'parent') {
    bindingParentMessaging();
  }
}
// EXTERNAL MODULE: ./node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
var runtime_core_esm_bundler = __webpack_require__(6768);
// EXTERNAL MODULE: ./node_modules/@vue/runtime-dom/dist/runtime-dom.esm-bundler.js
var runtime_dom_esm_bundler = __webpack_require__(5130);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/AppDemo002.vue?vue&type=template&id=23094cd5

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
  const _component_EntryForm = (0,runtime_core_esm_bundler/* resolveComponent */.g2)("EntryForm");
  return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)(runtime_core_esm_bundler/* Fragment */.FK, null, [_hoisted_1, (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_2, [(0,runtime_core_esm_bundler/* createVNode */.bF)(_component_PageHeader, {
    ref: "pageHeader",
    labels: $setup.labels,
    pid: "demo002",
    version: "1.0.0",
    showLanguage: "true",
    onLanguageChanged: $options.changeLanguage
  }, null, 8, ["labels", "onLanguageChanged"]), (0,runtime_core_esm_bundler/* createVNode */.bF)(_component_SearchForm, {
    ref: "searchForm",
    labels: $setup.labels,
    dataCategory: $setup.dataCategory,
    onDataSelect: $options.dataSelected,
    onDataInsert: $options.dataInsert
  }, null, 8, ["labels", "dataCategory", "onDataSelect", "onDataInsert"])]), ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createBlock */.Wv)(runtime_core_esm_bundler/* Teleport */.Im, {
    to: "#modaldialog"
  }, [(0,runtime_core_esm_bundler/* createVNode */.bF)(_component_EntryForm, {
    ref: "entryForm",
    labels: $setup.labels,
    dataCategory: $setup.dataCategory,
    onDataSaved: $options.dataSaved,
    onDataUpdated: $options.dataUpdated,
    onDataDeleted: $options.dataDeleted
  }, null, 8, ["labels", "dataCategory", "onDataSaved", "onDataUpdated", "onDataDeleted"])]))], 64);
}
;// CONCATENATED MODULE: ./src/AppDemo002.vue?vue&type=template&id=23094cd5

// EXTERNAL MODULE: ./node_modules/core-js/modules/web.url-search-params.delete.js
var web_url_search_params_delete = __webpack_require__(4603);
// EXTERNAL MODULE: ./node_modules/core-js/modules/web.url-search-params.has.js
var web_url_search_params_has = __webpack_require__(7566);
// EXTERNAL MODULE: ./node_modules/core-js/modules/web.url-search-params.size.js
var web_url_search_params_size = __webpack_require__(8721);
// EXTERNAL MODULE: ./node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js
var reactivity_esm_bundler = __webpack_require__(144);
// EXTERNAL MODULE: ./node_modules/@vue/shared/dist/shared.esm-bundler.js
var shared_esm_bundler = __webpack_require__(4232);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/controls/PageHeader.vue?vue&type=template&id=dac8f0ca

const PageHeadervue_type_template_id_dac8f0ca_hoisted_1 = {
  class: "header-layer"
};
const PageHeadervue_type_template_id_dac8f0ca_hoisted_2 = {
  class: "program-controlbar navbar navbar-expand-sm navbar-top navbar-header-title"
};
const _hoisted_3 = {
  class: "page-header-title"
};
const _hoisted_4 = {
  class: "navbar-header"
};
const _hoisted_5 = {
  class: "navbar-nav navbar-right ml-auto program-control-layer"
};
const _hoisted_6 = {
  class: "dropdown user-dropdown"
};
const _hoisted_7 = {
  key: 0,
  class: "dropdown-menu dropdown-menu-right page-header-menu"
};
const _hoisted_8 = ["onClick"];
const _hoisted_9 = {
  class: "menu-separator"
};
const _hoisted_10 = {
  key: 1
};
const _hoisted_11 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("em", {
  class: "fa fa-info-circle fa-class",
  "aria-hidden": "true"
}, null, -1);
function PageHeadervue_type_template_id_dac8f0ca_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_A = (0,runtime_core_esm_bundler/* resolveComponent */.g2)("A");
  return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("div", PageHeadervue_type_template_id_dac8f0ca_hoisted_1, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("nav", PageHeadervue_type_template_id_dac8f0ca_hoisted_2, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("h1", _hoisted_3, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_4, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", null, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.caption_title), 1)])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("ul", _hoisted_5, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("li", _hoisted_6, [(0,runtime_core_esm_bundler/* createVNode */.bF)(_component_A, {
    href: "javascript:void(0)",
    class: "program-linker dropdown-toggle",
    "data-toggle": "dropdown"
  }, {
    default: (0,runtime_core_esm_bundler/* withCtx */.k6)(() => [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("span", null, (0,shared_esm_bundler/* toDisplayString */.v_)($options.pageId), 1)]),
    _: 1
  }), $options.displayMenu ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("ul", _hoisted_7, [(0,runtime_core_esm_bundler/* renderSlot */.RG)(_ctx.$slots, "default"), $options.displayLanguage ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(true), (0,runtime_core_esm_bundler/* createElementBlock */.CE)(runtime_core_esm_bundler/* Fragment */.FK, {
    key: 0
  }, (0,runtime_core_esm_bundler/* renderList */.pI)($props.multiLanguages, item => {
    return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("li", {
      key: item.lang
    }, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("a", {
      href: "javascript:void(0)",
      onClick: $event => $options.changeLanguage(item.lang),
      class: "pagemenu-linker"
    }, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("img", {
      class: (0,shared_esm_bundler/* normalizeClass */.C4)(["img-lang", 'img-lang-' + item.lang])
    }, null, 2), (0,runtime_core_esm_bundler/* createTextVNode */.eW)(" "), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("span", {
      class: (0,shared_esm_bundler/* normalizeClass */.C4)({
        'item-selected': $setup.currentLanguage == item.lang
      })
    }, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels[item.label]), 3)], 8, _hoisted_8)]);
  }), 128)) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true), (0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("hr", _hoisted_9, null, 512), [[runtime_dom_esm_bundler/* vShow */.aG, $options.displayVersion && $options.displayLanguage]]), $options.displayVersion ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("li", _hoisted_10, [(0,runtime_core_esm_bundler/* createVNode */.bF)(_component_A, {
    href: "javascript:void(0)",
    onClick: $options.showVersion,
    class: "pagemenu-linker"
  }, {
    default: (0,runtime_core_esm_bundler/* withCtx */.k6)(() => [_hoisted_11, (0,runtime_core_esm_bundler/* createTextVNode */.eW)(" "), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("span", null, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.version_label) + " " + (0,shared_esm_bundler/* toDisplayString */.v_)($props.version), 1)]),
    _: 1
  }, 8, ["onClick"])])) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true)])) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true)])])])]);
}
;// CONCATENATED MODULE: ./src/controls/PageHeader.vue?vue&type=template&id=dac8f0ca

// EXTERNAL MODULE: ./src/assets/js/Utilities.js
var Utilities = __webpack_require__(2785);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/controls/PageHeader.vue?vue&type=script&lang=js


/* harmony default export */ var PageHeadervue_type_script_lang_js = ({
  props: {
    pid: String,
    labels: Object,
    version: {
      type: String,
      default: "1.0.0"
    },
    viewVersion: {
      type: [String, Boolean],
      default: true
    },
    showLanguage: {
      type: [String, Boolean],
      default: false
    },
    multiLanguages: {
      type: Array,
      default() {
        return [{
          lang: "EN",
          label: "english_lang"
        }, {
          lang: "TH",
          label: "thai_lang"
        }];
      }
    },
    language: {
      type: String,
      default: "EN"
    }
  },
  emits: ["show-version", "language-changed"],
  setup(props) {
    const currentLanguage = (0,reactivity_esm_bundler/* ref */.KR)(props.language && props.language.trim().length > 0 ? props.language : "EN");
    return {
      currentLanguage
    };
  },
  computed: {
    pageId() {
      return this.$props.pid.toUpperCase();
    },
    displayVersion() {
      return Utilities/* Utilities */.F.parseBoolean(this.$props.viewVersion);
    },
    displayLanguage() {
      return Utilities/* Utilities */.F.parseBoolean(this.$props.showLanguage);
    },
    displayMenu() {
      return this.$slots.default || this.displayVersion || this.displayLanguage;
    }
  },
  methods: {
    showVersion() {
      console.log("show version: " + this.$props.pid);
      this.$emit('show-version', this.$props.pid);
    },
    changeLanguage(lang) {
      this.currentLanguage = lang;
      this.$emit('language-changed', lang);
    }
  }
});
;// CONCATENATED MODULE: ./src/controls/PageHeader.vue?vue&type=script&lang=js
 
;// CONCATENATED MODULE: ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-12.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-12.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12.use[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/controls/PageHeader.vue?vue&type=style&index=0&id=dac8f0ca&lang=css
// extracted by mini-css-extract-plugin

;// CONCATENATED MODULE: ./src/controls/PageHeader.vue?vue&type=style&index=0&id=dac8f0ca&lang=css

// EXTERNAL MODULE: ./node_modules/vue-loader/dist/exportHelper.js
var exportHelper = __webpack_require__(1241);
;// CONCATENATED MODULE: ./src/controls/PageHeader.vue




;


const __exports__ = /*#__PURE__*/(0,exportHelper/* default */.A)(PageHeadervue_type_script_lang_js, [['render',PageHeadervue_type_template_id_dac8f0ca_render]])

/* harmony default export */ var PageHeader = (__exports__);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/SearchForm.vue?vue&type=template&id=23581c16

const SearchFormvue_type_template_id_23581c16_hoisted_1 = {
  id: "searchpanel",
  class: "panel-body search-panel"
};
const SearchFormvue_type_template_id_23581c16_hoisted_2 = {
  class: "row row-height"
};
const SearchFormvue_type_template_id_23581c16_hoisted_3 = {
  class: "col-height col-md-2"
};
const SearchFormvue_type_template_id_23581c16_hoisted_4 = {
  for: "account"
};
const SearchFormvue_type_template_id_23581c16_hoisted_5 = {
  class: "col-height col-md-2"
};
const SearchFormvue_type_template_id_23581c16_hoisted_6 = {
  for: "effectdate"
};
const SearchFormvue_type_template_id_23581c16_hoisted_7 = {
  class: "col-height col-md-2"
};
const SearchFormvue_type_template_id_23581c16_hoisted_8 = {
  class: "col-height col-md-2"
};
const SearchFormvue_type_template_id_23581c16_hoisted_9 = {
  class: "col-height col-md"
};
const SearchFormvue_type_template_id_23581c16_hoisted_10 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("br", null, null, -1);
const SearchFormvue_type_template_id_23581c16_hoisted_11 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("i", {
  class: "fa fa-search fa-btn-icon",
  "aria-hidden": "true"
}, null, -1);
const _hoisted_12 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("i", {
  class: "fa fa-refresh fa-btn-icon",
  "aria-hidden": "true"
}, null, -1);
const _hoisted_13 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("i", {
  class: "fa fa-plus fa-btn-icon",
  "aria-hidden": "true"
}, null, -1);
const _hoisted_14 = {
  id: "listpanel",
  class: "table-responsive fa-list-panel"
};
function SearchFormvue_type_template_id_23581c16_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_InputMask = (0,runtime_core_esm_bundler/* resolveComponent */.g2)("InputMask");
  const _component_InputDate = (0,runtime_core_esm_bundler/* resolveComponent */.g2)("InputDate");
  const _component_Select2 = (0,runtime_core_esm_bundler/* resolveComponent */.g2)("Select2");
  const _component_DataTable = (0,runtime_core_esm_bundler/* resolveComponent */.g2)("DataTable");
  const _component_DataPaging = (0,runtime_core_esm_bundler/* resolveComponent */.g2)("DataPaging");
  return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("div", SearchFormvue_type_template_id_23581c16_hoisted_1, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", SearchFormvue_type_template_id_23581c16_hoisted_2, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", SearchFormvue_type_template_id_23581c16_hoisted_3, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", SearchFormvue_type_template_id_23581c16_hoisted_4, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.account_label), 1), (0,runtime_core_esm_bundler/* createVNode */.bF)(_component_InputMask, {
    modelValue: $setup.localData.account,
    "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => $setup.localData.account = $event),
    picture: "XXXXXXXXXXXX"
  }, null, 8, ["modelValue"])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", SearchFormvue_type_template_id_23581c16_hoisted_5, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", SearchFormvue_type_template_id_23581c16_hoisted_6, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.effectdate_label), 1), (0,runtime_core_esm_bundler/* createVNode */.bF)(_component_InputDate, {
    modelValue: $setup.localData.effectdate,
    "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => $setup.localData.effectdate = $event)
  }, null, 8, ["modelValue"])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", SearchFormvue_type_template_id_23581c16_hoisted_7, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", null, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.marrystatus_label), 1), (0,runtime_core_esm_bundler/* createVNode */.bF)(_component_Select2, {
    modelValue: $setup.localData.marrystatus,
    "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => $setup.localData.marrystatus = $event),
    options: $props.dataCategory.marrystatus,
    settings: {
      multiple: true
    }
  }, null, 8, ["modelValue", "options"])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", SearchFormvue_type_template_id_23581c16_hoisted_8, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", null, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.title_label), 1), (0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("input", {
    type: "text",
    "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => $setup.localData.title = $event),
    class: "form-control input-md",
    maxlength: "50"
  }, null, 512), [[runtime_dom_esm_bundler/* vModelText */.Jo, $setup.localData.title]])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", SearchFormvue_type_template_id_23581c16_hoisted_9, [SearchFormvue_type_template_id_23581c16_hoisted_10, (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("button", {
    onClick: _cache[4] || (_cache[4] = (...args) => $options.searchClick && $options.searchClick(...args)),
    class: "btn btn-dark btn-sm btn-ctrl"
  }, [SearchFormvue_type_template_id_23581c16_hoisted_11, (0,runtime_core_esm_bundler/* createTextVNode */.eW)((0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.search_button), 1)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("button", {
    onClick: _cache[5] || (_cache[5] = (...args) => $options.resetClick && $options.resetClick(...args)),
    class: "btn btn-dark btn-sm btn-ctrl"
  }, [_hoisted_12, (0,runtime_core_esm_bundler/* createTextVNode */.eW)((0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.reset_button), 1)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("button", {
    onClick: _cache[6] || (_cache[6] = (...args) => $options.insertClick && $options.insertClick(...args)),
    class: "btn btn-dark btn-sm btn-ctrl pull-right"
  }, [_hoisted_13, (0,runtime_core_esm_bundler/* createTextVNode */.eW)((0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.insert_button), 1)])])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_14, [(0,runtime_core_esm_bundler/* createVNode */.bF)(_component_DataTable, {
    ref: "dataTable",
    settings: $setup.tableSettings,
    labels: $props.labels,
    dataset: $setup.dataset,
    onDataSelect: $options.dataSelected,
    onDataSort: $options.dataSorted,
    formater: $options.formatData
  }, null, 8, ["settings", "labels", "dataset", "onDataSelect", "onDataSort", "formater"]), (0,runtime_core_esm_bundler/* createVNode */.bF)(_component_DataPaging, {
    ref: "dataPaging",
    settings: $setup.pagingSettings,
    onPageSelect: $options.pageSelected
  }, null, 8, ["settings", "onPageSelect"])])]);
}
;// CONCATENATED MODULE: ./src/components/SearchForm.vue?vue&type=template&id=23581c16

;// CONCATENATED MODULE: ./src/assets/js/Paging.js

const DEFAULT_PAGE_SETTINGS = {
  page: 1,
  rowsPerPage: 10,
  totalRows: 0,
  totalPages: 1,
  limit: 10,
  offset: 10,
  rows: 0
};
class Paging {
  constructor(setting = {}) {
    this.setting = Object.assign({}, DEFAULT_PAGE_SETTINGS, setting);
  }
  clear() {
    this.reset(DEFAULT_PAGE_SETTINGS);
  }
  reset(setting) {
    if (setting) {
      this.setting = Object.assign(this.setting, setting);
    }
  }
  hasPaging(rows) {
    if (!rows) rows = this.setting.totalRows;
    let chapter = this.setting.rowsPerPage;
    return chapter > 0 && rows > chapter;
  }
  recordsOffset() {
    let page = this.setting.page - 1;
    let chapter = this.setting.rowsPerPage;
    if (page > 0) return page * chapter;
    return 0;
  }
  recordsNumber(seqno) {
    return seqno + this.recordsOffset();
  }
  buildPagingModel(options = {
    totalRows: 0
  }) {
    let results = [];
    let fsRows = options.totalRows;
    if (!fsRows) {
      fsRows = this.setting.totalRows;
    }
    let fsPageNumber = 0;
    let fsPageNo = 0;
    let fsTotalPage = 0;
    let fsPages = this.setting.page;
    let fsChapters = this.setting.rowsPerPage;
    for (let i = 0; i < fsRows; i += fsChapters) {
      fsTotalPage++;
    }
    let fsCounter = 0;
    let fsStartIdx = fsPages;
    let fsLimit = this.setting.limit;
    if (fsLimit <= 0) {
      fsLimit = fsChapters;
    }
    while (fsStartIdx > fsLimit) {
      fsCounter++;
      fsStartIdx -= fsLimit;
    }
    let fsPreviousPage = fsCounter * fsLimit;
    if (fsLimit > 0 && fsPages > fsLimit) {
      let first = {
        page: 1,
        text: "|<",
        css: ""
      };
      let previous = {
        page: fsPreviousPage,
        text: "<<",
        css: ""
      };
      results.push(first);
      results.push(previous);
    }
    for (let i = 0; i < fsRows; i += fsChapters) {
      fsPageNumber++;
      if (fsLimit > 0) {
        if (fsPageNumber <= fsPreviousPage) {
          continue;
        }
        fsPageNo++;
        if (fsLimit < fsPageNo) {
          fsPageNumber = fsPageNumber + fsLimit - 1;
          if (fsPageNumber > fsTotalPage) {
            fsPageNumber = fsTotalPage;
          }
          let next = {
            page: fsPageNumber,
            text: ">>",
            css: ""
          };
          results.push(next);
          break;
        }
      }
      let fsSelected = "";
      if (fsPages == fsPageNumber || fsPageNumber == 1 && fsPages == 0) {
        fsSelected = "pageselectedclass active";
      }
      let current = {
        page: fsPageNumber,
        text: "" + fsPageNumber,
        css: fsSelected
      };
      results.push(current);
    }
    if (fsLimit < fsPageNo) {
      fsPageNumber = 0;
      for (let i = 0; i < fsRows; i += fsChapters) {
        fsPageNumber++;
      }
      let last = {
        page: fsPageNumber,
        text: ">|",
        css: ""
      };
      results.push(last);
    }
    return results;
  }
}
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/controls/InputDate.vue?vue&type=template&id=7e8b5fb6

const InputDatevue_type_template_id_7e8b5fb6_hoisted_1 = {
  class: "input-group-container"
};
const InputDatevue_type_template_id_7e8b5fb6_hoisted_2 = {
  class: "input-group input-group-calendar"
};
const InputDatevue_type_template_id_7e8b5fb6_hoisted_3 = ["value", "id", "name", "disabled"];
const InputDatevue_type_template_id_7e8b5fb6_hoisted_4 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("i", {
  class: "fa fa-calendar",
  "aria-hidden": "true"
}, null, -1);
const InputDatevue_type_template_id_7e8b5fb6_hoisted_5 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("i", {
  class: "fa fa-times",
  "aria-hidden": "true"
}, null, -1);
function InputDatevue_type_template_id_7e8b5fb6_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_A = (0,runtime_core_esm_bundler/* resolveComponent */.g2)("A");
  return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("div", InputDatevue_type_template_id_7e8b5fb6_hoisted_1, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", InputDatevue_type_template_id_7e8b5fb6_hoisted_2, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("input", (0,runtime_core_esm_bundler/* mergeProps */.v6)({
    ref: "input",
    type: "text",
    onInput: _cache[0] || (_cache[0] = (...args) => $setup.updateValue && $setup.updateValue(...args)),
    onSelect: _cache[1] || (_cache[1] = (...args) => $setup.updateValue && $setup.updateValue(...args)),
    value: $props.modelValue,
    id: $props.id,
    name: $props.name,
    class: $setup.inputClasses,
    maxlength: "10",
    editable: "true",
    disabled: $props.disabled,
    readonly: ""
  }, _ctx.$attrs), null, 16, InputDatevue_type_template_id_7e8b5fb6_hoisted_3), (0,runtime_core_esm_bundler/* createVNode */.bF)(_component_A, {
    href: "javascript:void(0)",
    onClick: $options.showInputCalendar,
    id: $setup.lookupButton,
    tabIndex: "-1",
    class: "input-group-addon input-group-append input-group-text input-group-lookup"
  }, {
    default: (0,runtime_core_esm_bundler/* withCtx */.k6)(() => [InputDatevue_type_template_id_7e8b5fb6_hoisted_4]),
    _: 1
  }, 8, ["onClick", "id"]), (0,runtime_core_esm_bundler/* createVNode */.bF)(_component_A, {
    href: "javascript:void(0)",
    onClick: $options.clearInputCalendar,
    id: $setup.clearButton,
    tabIndex: "-1",
    class: "input-group-addon input-group-append input-group-text input-group-clear"
  }, {
    default: (0,runtime_core_esm_bundler/* withCtx */.k6)(() => [InputDatevue_type_template_id_7e8b5fb6_hoisted_5]),
    _: 1
  }, 8, ["onClick", "id"])])]);
}
;// CONCATENATED MODULE: ./src/controls/InputDate.vue?vue&type=template&id=7e8b5fb6

;// CONCATENATED MODULE: ./src/assets/js/ctrl.util.js


function getControlClasses(attrClass, ...classes) {
  let ctrlClasses = "";
  if (!attrClass) attrClass = "";
  for (let c of classes) {
    if (attrClass.indexOf(c) < 0) ctrlClasses += " " + c;
  }
  return ctrlClasses;
}
function clearCalendar(src) {
  let dpkr = jquery_default()(src);
  if (dpkr.is(":disabled")) return;
  if (dpkr.is("[readonly]")) {
    let edit = dpkr.attr("editable");
    if (!("true" == edit)) return;
  }
  dpkr.val("");
  src.dispatchEvent(new Event('select'));
  let ifn = dpkr.data("afterSelectDatePicker");
  if (ifn) ifn("", dpkr);
}
function openCalendar(src) {
  let dpkr = jquery_default()(src);
  if (dpkr.is(":disabled")) return;
  if (dpkr.is("[readonly]")) {
    let edit = dpkr.attr("editable");
    if (!("true" == edit)) return;
  }
  try {
    dpkr.datepicker({
      showOn: "",
      dateFormat: "dd/mm/yy",
      changeMonth: true,
      changeYear: true,
      yearRange: "c-100:+100",
      onSelect: function (input, inst) {
        src.focus();
        src.dispatchEvent(new Event('select'));
        let fn = dpkr.data("afterSelectDatePicker");
        if (fn) fn(input, inst);
      }
    });
    dpkr.datepicker("show");
    jquery_default()(document).off('focusin');
    return;
  } catch (ex) {
    console.error(ex);
  }
}
function triggerInput(input) {
  input.dispatchEvent(new Event('input', {
    bubbles: true
  }));
}
function inputNumberOnly(myfield, e, decimal, isPlus) {
  let key;
  let keychar;
  if (e) key = e.which;else return true;
  keychar = String.fromCharCode(key);
  let element = myfield;
  isPlus = isPlus != null ? true : false;
  let isPoint = decimal != null && decimal != 0 ? true : false;
  if (key == 45 && element.value.indexOf('-') == -1 && !isPlus) {
    element.value = "-" + element.value;
    triggerInput(element);
  }
  if (key == 46 && element.value.indexOf('.') == -1 && isPoint) {
    if (element.value == "") element.value = '0';
    triggerInput(element);
    return true;
  }
  if (key == null || key == 0 || key == 8 || key == 9 || key == 27) return true;else if ("0123456789".indexOf(keychar) > -1) {
    triggerInput(element);
    return true;
  } else return false;
}
function checkInputNumberOnly(myfield, e, decimal, isPlus) {
  let iskeyup = myfield.getAttribute('keyup');
  if (iskeyup == false) {
    return false;
  }
  myfield.setAttribute('keyup', false);
  return inputNumberOnly(myfield, e, decimal, isPlus);
}
function checkInputKey(myfield, event, decimal, maxvalue) {
  let iNum = event.keyCode;
  if (iNum >= 48 && iNum <= 57 || iNum >= 96 && iNum <= 105 || iNum == 109 || iNum == 110 || iNum == 189 || iNum == 190) {
    myfield.setAttribute('keyup', true);
    let c_pos = getCaretPosition(myfield);
    let o_len = myfield.value.length;
    formatNumber(myfield, maxvalue, decimal);
    let n_len = myfield.value.length;
    setCaretPosition(myfield, n_len > o_len ? c_pos + 1 : c_pos);
    triggerInput(myfield);
  }
}
function formatNumber(element, maxvalue, decimal) {
  let valueBfChange = element.value;
  let data = element.value;
  let point = 0;
  if (decimal != null && decimal != "") {
    let precisions = Number(decimal);
    point = precisions >= 0 ? precisions : 2;
  }
  let fraction = null;
  if (maxvalue != null && maxvalue != "") {
    if (Number(maxvalue) >= 0) {
      fraction = maxvalue;
      if (data.indexOf("-") > -1) fraction++;
    } else {
      fraction = null;
    }
  }
  data = clearComma(data);
  try {
    let dot = '';
    let x = data.split('.');
    if (x.length == 2 && point > 0) {
      dot = x[1].length > point ? '.' + x[1].substring(0, point) : '.' + x[1];
    }
    while (x[0].length > 1 && x[0].charAt(0) == "0") {
      x[0] = x[0].substring(1);
    }
    if (fraction == 0 && Number(x[0]) > 0 || fraction > 0 && x[0].length > fraction) {
      element.value = valueBfChange;
      return true;
    }
    data = x[0] + dot;
  } catch (ex) {
    console.error(ex);
  }
  element.value = putComma(data);
}
function putComma(data) {
  if (data.indexOf(',') > -1) {
    data = clearComma(data);
  }
  let move = data.indexOf('.') > -1 ? data.indexOf('.') : data.length;
  let minus = data.indexOf('-') > -1 ? 1 : 0;
  while (move > 3) {
    if (minus && move <= 4) {
      break;
    }
    data = data.substring(0, move - 3) + "," + data.substring(move - 3);
    move -= 3;
  }
  return data;
}
function clearComma(data) {
  while (data.indexOf(',') != -1) {
    data = data.replace(',', '');
  }
  return data;
}
function getCaretPosition(ctrl) {
  let iCaretPos = 0;
  if (document.selection) {
    ctrl.focus();
    let selector = document.selection.createRange();
    selector.moveStart('character', -ctrl.value.length);
    iCaretPos = selector.text.length;
  } else if (ctrl.selectionStart || ctrl.selectionStart == '0') {
    iCaretPos = ctrl.selectionStart;
  }
  return iCaretPos;
}
function setCaretPosition(ctrl, iCaretPos) {
  if (ctrl.createTextRange) {
    let selector = ctrl.createTextRange();
    selector.collapse(true);
    selector.moveEnd('character', iCaretPos);
    selector.moveStart('character', iCaretPos);
    selector.select();
  } else if (ctrl.selectionStart || ctrl.selectionStart == '0') {
    ctrl.selectionStart = iCaretPos;
    ctrl.selectionEnd = iCaretPos;
    ctrl.focus();
  }
}
function parseNumber(avalue) {
  return Number(removeComma(avalue));
}
function removeComma(avalue) {
  let result = avalue + "";
  while (result.indexOf(",") > -1) {
    result = removeDelimiter(result, ",");
  }
  return result;
}
function removeDelimiter(avalue, delimiter) {
  return avalue.replace(delimiter, "");
}
function formatFloating(avalue, decimal) {
  avalue = avalue + "";
  avalue = removeComma(avalue);
  return formatDecimal(avalue, decimal, true);
}
function formatDecimal(avalue, decimal, verifydecimal) {
  let sign = "";
  let result = avalue + "";
  let bstr = "";
  let cstr = "";
  let i = result.indexOf("-");
  if (i >= 0) {
    sign = "-";
    result = result.substring(i + 1);
  } else {
    i = result.indexOf("+");
    if (i >= 0) {
      sign = "+";
      result = result.substring(i + 1);
    }
  }
  let astr = result;
  i = result.indexOf(".");
  if (i > 0) {
    astr = result.substring(0, i);
    bstr = result.substring(i + 1);
    cstr = result.substring(i);
  }
  let la = astr.length;
  if (la > 3) {
    let tstr = astr;
    astr = "";
    while (tstr != "") {
      la = tstr.length;
      let md = la % 3;
      if (md > 0) {
        astr += tstr.substring(0, md) + ",";
        tstr = tstr.substring(md);
      } else {
        astr += tstr.substring(0, 3);
        tstr = tstr.substring(3);
        if (tstr != "") astr += ",";
      }
    }
  }
  if (verifydecimal) {
    if (decimal > 0) {
      let l = bstr.length;
      if (decimal > l) {
        let j = 0;
        for (j = l; j < decimal; j++) {
          bstr += "0";
        }
      } else {
        bstr = bstr.substring(0, decimal);
      }
      if (astr == "") return "";
      return sign + astr + "." + bstr;
    } else {
      return sign + astr;
    }
  } else {
    return sign + astr + cstr;
  }
}
const header_action = {
  type: "button",
  action: "edit"
};
function ensureTableSetting(settings) {
  let headers = {
    autoFormat: true,
    ...settings
  };
  if (headers.actions) {
    for (let act of headers.actions) {
      let item = {
        ...header_action,
        ...act
      };
      if (!item.css && "button" == item.type) {
        if ("edit" == item.action) {
          item.css = "btn-edit fa-data-edit fa-btn fa fa-pencil";
        } else if ("delete" == item.action) {
          item.css = "btn-delete fa-data-delete fa-btn fa fa-trash";
        } else if ("view" == item.action) {
          item.css = "btn-view fa-data-view fa-btn fa fa-eye";
        }
      }
      Object.assign(act, item);
    }
  }
  return headers;
}
function formatDataTable(data, field) {
  try {
    if (field) {
      if (field.type == "DECIMAL") {
        return formatFloating(data, field.decimal !== undefined ? field.decimal : 2);
      } else if (field.type == "DATE") {
        let date = Utilities/* Utilities */.F.parseDate(data);
        if (date) return Utilities/* Utilities */.F.formatDate(date);
      } else if (field.type == "DATETIME") {
        let date = Utilities/* Utilities */.F.parseDate(data);
        if (date) return Utilities/* Utilities */.F.formatDateTime(date);
      }
    }
    return data;
  } catch (ex) {
    console.error(ex);
    return data;
  }
}
;// CONCATENATED MODULE: ./src/assets/js/random.util.js
const ALPHABETS = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789");
const NUMERICS = Array.from("0123456789");
function getRandomNumber(min = 1, max = 1000000) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function random(len = 6, alphabets = ALPHABETS) {
  let result = "";
  let max = alphabets.length - 1;
  for (let i = 0; i < len; i++) {
    let idx = getRandomNumber(1, max);
    result += alphabets[idx - 1];
  }
  return result;
}
function randomNumber(len = 6, alphabets = NUMERICS) {
  return random(len, alphabets);
}
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/controls/InputDate.vue?vue&type=script&lang=js


/* harmony default export */ var InputDatevue_type_script_lang_js = ({
  inheritAttrs: false,
  //disable all attributes from parent
  props: {
    modelValue: String,
    id: {
      type: String,
      default: "input_" + randomNumber() + "_" + new Date().getTime()
    },
    name: {
      type: String,
      required: false
    },
    disabled: {
      type: [String, Boolean],
      required: false
    }
  },
  setup(props, context) {
    let attrClass = context.attrs.class ? context.attrs.class : "";
    //let inputClasses = props.classes; 
    //error: Getting a value from the `props` in root scope of `setup()` will cause the value to lose reactivity
    let inputClasses = getControlClasses(attrClass, 'form-control', 'ivue', 'iedit', 'idate');
    const updateValue = event => {
      context.emit('update:modelValue', event.target.value);
    };
    return {
      updateValue,
      lookupButton: "LK" + props.id,
      clearButton: "CLR" + props.id,
      inputClasses
    };
  },
  methods: {
    focus() {
      this.$refs.input.focus();
    },
    showInputCalendar() {
      openCalendar(document.getElementById(this.id));
    },
    clearInputCalendar() {
      clearCalendar(document.getElementById(this.id));
    },
    updateInput(value) {
      this.$emit("update:modelValue", value);
    }
  }
});
;// CONCATENATED MODULE: ./src/controls/InputDate.vue?vue&type=script&lang=js
 
;// CONCATENATED MODULE: ./src/controls/InputDate.vue




;
const InputDate_exports_ = /*#__PURE__*/(0,exportHelper/* default */.A)(InputDatevue_type_script_lang_js, [['render',InputDatevue_type_template_id_7e8b5fb6_render]])

/* harmony default export */ var InputDate = (InputDate_exports_);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/controls/InputMask.vue?vue&type=template&id=67cb64ee

const InputMaskvue_type_template_id_67cb64ee_hoisted_1 = ["value", "id", "name", "picture", "disabled"];
function InputMaskvue_type_template_id_67cb64ee_render(_ctx, _cache, $props, $setup, $data, $options) {
  return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("input", (0,runtime_core_esm_bundler/* mergeProps */.v6)({
    ref: "input",
    type: "text",
    onInput: _cache[0] || (_cache[0] = (...args) => $setup.updateValue && $setup.updateValue(...args)),
    value: $props.modelValue,
    id: $props.id,
    name: $props.name,
    class: $setup.inputClasses,
    picture: $props.picture,
    disabled: $props.disabled
  }, _ctx.$attrs), null, 16, InputMaskvue_type_template_id_67cb64ee_hoisted_1);
}
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/controls/InputMask.vue?vue&type=script&lang=js



/* harmony default export */ var InputMaskvue_type_script_lang_js = ({
  props: {
    modelValue: String,
    id: {
      type: String,
      default: "input_" + randomNumber() + "_" + new Date().getTime()
    },
    name: {
      type: String,
      required: false
    },
    disabled: {
      type: [String, Boolean],
      required: false
    },
    picture: {
      type: String,
      required: true
    }
  },
  setup(props, context) {
    let attrClass = context.attrs.class ? context.attrs.class : "";
    let inputClasses = getControlClasses(attrClass, 'form-control', 'ivue', 'imask');
    const updateValue = event => {
      context.emit('update:modelValue', event.target.value);
    };
    return {
      updateValue,
      inputClasses
    };
  },
  mounted() {
    let element = document.getElementById(this.id);
    let $this = jquery_default()(element);
    try {
      if (this.picture) {
        $this.mask(this.picture);
      }
    } catch (ex) {
      console.error(ex);
    }
  },
  methods: {
    focus() {
      this.$refs.input.focus();
    }
  }
});
;// CONCATENATED MODULE: ./src/controls/InputMask.vue?vue&type=script&lang=js
 
;// CONCATENATED MODULE: ./src/controls/InputMask.vue




;
const InputMask_exports_ = /*#__PURE__*/(0,exportHelper/* default */.A)(InputMaskvue_type_script_lang_js, [['render',InputMaskvue_type_template_id_67cb64ee_render]])

/* harmony default export */ var InputMask = (InputMask_exports_);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/controls/DataTable.vue?vue&type=template&id=02ea0cde

const DataTablevue_type_template_id_02ea0cde_hoisted_1 = {
  class: "data-table table table-bordered table-hover table-striped tablesorter"
};
const DataTablevue_type_template_id_02ea0cde_hoisted_2 = {
  class: "data-table-header"
};
const DataTablevue_type_template_id_02ea0cde_hoisted_3 = {
  key: 0,
  class: "text-center th-sequence"
};
const DataTablevue_type_template_id_02ea0cde_hoisted_4 = {
  key: 0,
  class: "text-center th-data"
};
const DataTablevue_type_template_id_02ea0cde_hoisted_5 = ["innerHTML"];
const DataTablevue_type_template_id_02ea0cde_hoisted_6 = {
  key: 1,
  class: "text-center th-data"
};
const DataTablevue_type_template_id_02ea0cde_hoisted_7 = ["innerHTML"];
const DataTablevue_type_template_id_02ea0cde_hoisted_8 = {
  key: 1,
  class: "text-center th-action"
};
const DataTablevue_type_template_id_02ea0cde_hoisted_9 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("em", {
  class: "fa fa-bolt",
  "aria-hidden": "true"
}, null, -1);
const DataTablevue_type_template_id_02ea0cde_hoisted_10 = [DataTablevue_type_template_id_02ea0cde_hoisted_9];
const DataTablevue_type_template_id_02ea0cde_hoisted_11 = {
  class: "data-table-body"
};
const DataTablevue_type_template_id_02ea0cde_hoisted_12 = {
  key: 0,
  class: "text-center"
};
const DataTablevue_type_template_id_02ea0cde_hoisted_13 = ["onClick"];
const DataTablevue_type_template_id_02ea0cde_hoisted_14 = ["innerHTML"];
const _hoisted_15 = {
  key: 1
};
const _hoisted_16 = {
  key: 1,
  class: "text-center"
};
const _hoisted_17 = ["onClick"];
const _hoisted_18 = {
  key: 1
};
const _hoisted_19 = ["colspan"];
function DataTablevue_type_template_id_02ea0cde_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_A = (0,runtime_core_esm_bundler/* resolveComponent */.g2)("A");
  return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("table", DataTablevue_type_template_id_02ea0cde_hoisted_1, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("thead", DataTablevue_type_template_id_02ea0cde_hoisted_2, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("tr", null, [$options.hasSequence ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("th", DataTablevue_type_template_id_02ea0cde_hoisted_3, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", null, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels[$setup.headers.sequence.label]), 1)])) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true), ((0,runtime_core_esm_bundler/* openBlock */.uX)(true), (0,runtime_core_esm_bundler/* createElementBlock */.CE)(runtime_core_esm_bundler/* Fragment */.FK, null, (0,runtime_core_esm_bundler/* renderList */.pI)($setup.headers.columns, (item, index) => {
    return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)(runtime_core_esm_bundler/* Fragment */.FK, {
      key: index
    }, [item.sorter ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("th", DataTablevue_type_template_id_02ea0cde_hoisted_4, [(0,runtime_core_esm_bundler/* createVNode */.bF)(_component_A, {
      href: "javascript:void(0)",
      class: "alink-sorter fa-data-sort",
      onClick: $event => $options.dataSort(item)
    }, {
      default: (0,runtime_core_esm_bundler/* withCtx */.k6)(() => [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", {
        innerHTML: $props.labels[item.label]
      }, null, 8, DataTablevue_type_template_id_02ea0cde_hoisted_5)]),
      _: 2
    }, 1032, ["onClick"])])) : ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("th", DataTablevue_type_template_id_02ea0cde_hoisted_6, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", {
      innerHTML: $props.labels[item.label]
    }, null, 8, DataTablevue_type_template_id_02ea0cde_hoisted_7)]))], 64);
  }), 128)), $options.hasActions ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("th", DataTablevue_type_template_id_02ea0cde_hoisted_8, DataTablevue_type_template_id_02ea0cde_hoisted_10)) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true)])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("tbody", DataTablevue_type_template_id_02ea0cde_hoisted_11, [$options.hasDataSet ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(true), (0,runtime_core_esm_bundler/* createElementBlock */.CE)(runtime_core_esm_bundler/* Fragment */.FK, {
    key: 0
  }, (0,runtime_core_esm_bundler/* renderList */.pI)($setup.datas?.rows, (item, index) => {
    return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("tr", {
      key: index
    }, [$options.hasSequence ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("td", DataTablevue_type_template_id_02ea0cde_hoisted_12, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", null, (0,shared_esm_bundler/* toDisplayString */.v_)($setup.page.recordsNumber(index + 1)), 1)])) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true), ((0,runtime_core_esm_bundler/* openBlock */.uX)(true), (0,runtime_core_esm_bundler/* createElementBlock */.CE)(runtime_core_esm_bundler/* Fragment */.FK, null, (0,runtime_core_esm_bundler/* renderList */.pI)($setup.headers.columns, (column, colIndex) => {
      return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("td", {
        key: colIndex,
        class: (0,shared_esm_bundler/* normalizeClass */.C4)(column.css)
      }, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("a", {
        href: "javascript:void(0)",
        class: "alink-data fa-data-edit",
        onClick: $event => $options.dataSelect(item)
      }, [column.unescape ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("span", {
        key: 0,
        innerHTML: $options.formatData(item[column.name], column)
      }, null, 8, DataTablevue_type_template_id_02ea0cde_hoisted_14)) : ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("span", _hoisted_15, (0,shared_esm_bundler/* toDisplayString */.v_)($options.formatData(item[column.name], column)), 1))], 8, DataTablevue_type_template_id_02ea0cde_hoisted_13)], 2);
    }), 128)), $options.hasActions ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("td", _hoisted_16, [((0,runtime_core_esm_bundler/* openBlock */.uX)(true), (0,runtime_core_esm_bundler/* createElementBlock */.CE)(runtime_core_esm_bundler/* Fragment */.FK, null, (0,runtime_core_esm_bundler/* renderList */.pI)($setup.headers.actions, (action, actionIndex) => {
      return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)(runtime_core_esm_bundler/* Fragment */.FK, {
        key: actionIndex
      }, [action.type == 'button' ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("button", {
        key: 0,
        class: (0,shared_esm_bundler/* normalizeClass */.C4)(action.css),
        onClick: $event => $options.dataSelect(item, action.action)
      }, [action.icon ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("em", {
        key: 0,
        class: (0,shared_esm_bundler/* normalizeClass */.C4)(action.icon)
      }, null, 2)) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true)], 10, _hoisted_17)) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true), action.type == 'a' ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createBlock */.Wv)(_component_A, {
        key: 1,
        href: "javascript:void(0)",
        class: (0,shared_esm_bundler/* normalizeClass */.C4)(["alink-action", action.css]),
        onClick: $event => $options.dataSelect(item, action.action)
      }, {
        default: (0,runtime_core_esm_bundler/* withCtx */.k6)(() => [action.icon ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("em", {
          key: 0,
          class: (0,shared_esm_bundler/* normalizeClass */.C4)(action.icon)
        }, null, 2)) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true)]),
        _: 2
      }, 1032, ["class", "onClick"])) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true)], 64);
    }), 128))])) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true)]);
  }), 128)) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true), $options.recordNotFound ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("tr", _hoisted_18, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("td", {
    class: "text-center",
    colspan: $options.columnCount
  }, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.record_notfound), 9, _hoisted_19)])) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true)])]);
}
;// CONCATENATED MODULE: ./src/controls/DataTable.vue?vue&type=template&id=02ea0cde

;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/controls/DataTable.vue?vue&type=script&lang=js




/*
const tableSettings = {
        sequence: { label: "seqno_label" },
        columns: [
          {name: "account", type: "STRING", sorter: "account", label: "account_head" },
          {name: "amount", type: "DECIMAL", sorter: "amount", label: "amount_head" },
          {name: "age", type: "INTEGER", sorter: "age", label: "age_head" },
          {name: "effectdate", type: "DATE", sorter: "effectdate", label: "effectdate_head" },
          {name: "effecttime", type: "TIME", sorter: "effecttime", label: "effecttime_head" }
        ],
        actions: [
          {type: "button", action: "edit", css: "btn-edit fa-data-edit"},
          {type: "button", action: "delete", css: "btn-delete fa-data-delete"}
          {type: "button", action: "view", css: "btn-view fa-data-view"},
          {type: "a", action: "show", css: "fa-data-show", icon: "fa fa-eye"}
        ],
    };
*/
/* harmony default export */ var DataTablevue_type_script_lang_js = ({
  props: {
    labels: Object,
    dataset: {
      type: Object,
      default() {
        return {};
      }
    },
    settings: Object,
    formater: Function
  },
  setup(props) {
    const datas = (0,reactivity_esm_bundler/* ref */.KR)({
      ...props.dataset
    });
    const page = new Paging(props.dataset?.offsets);
    const sorting = (0,reactivity_esm_bundler/* ref */.KR)({});
    const setting = ensureTableSetting(props.settings);
    const headers = (0,reactivity_esm_bundler/* ref */.KR)(setting);
    return {
      datas,
      page,
      sorting,
      headers
    };
  },
  computed: {
    hasSequence() {
      return this.headers.sequence;
    },
    hasActions() {
      return this.headers.actions?.length > 0;
    },
    columnCount() {
      let counter = this.hasSequence ? 1 : 0;
      counter += this.hasActions ? 1 : 0;
      return counter + this.headers.columns?.length;
    },
    hasDataSet() {
      return this.datas?.rows?.length > 0;
    },
    recordNotFound() {
      return this.datas?.rows?.length == 0;
    }
  },
  emits: ["data-select", "data-sort"],
  methods: {
    clear() {
      this.reset({
        offsets: DEFAULT_PAGE_SETTINGS
      });
    },
    reset(newData) {
      if (newData) {
        this.datas = {
          ...newData
        };
        this.page.reset(newData?.offsets);
      }
    },
    dataSelect(item, action = 'edit') {
      this.$emit('data-select', item, action);
    },
    getDirection(orderDir) {
      if (orderDir) {
        return "ASC" == orderDir ? "DESC" : "ASC";
      }
      return "ASC";
    },
    dataSort(item) {
      let sorter = item.sorter;
      let direction = this.getDirection(this.sorting[sorter]);
      this.sorting[sorter] = direction;
      this.$emit('data-sort', sorter, direction);
    },
    formatData(data, field) {
      if (this.$props.formater) {
        let result = this.$props.formater.call(this, data, field);
        if (result) return result;
      }
      return this.formatField(data, field);
    },
    formatField(data, field) {
      return formatDataTable(data, field);
    }
  }
});
;// CONCATENATED MODULE: ./src/controls/DataTable.vue?vue&type=script&lang=js
 
;// CONCATENATED MODULE: ./src/controls/DataTable.vue




;
const DataTable_exports_ = /*#__PURE__*/(0,exportHelper/* default */.A)(DataTablevue_type_script_lang_js, [['render',DataTablevue_type_template_id_02ea0cde_render]])

/* harmony default export */ var DataTable = (DataTable_exports_);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/controls/DataPaging.vue?vue&type=template&id=6642cb20

const DataPagingvue_type_template_id_6642cb20_hoisted_1 = {
  class: "fschaptertablelayer"
};
const DataPagingvue_type_template_id_6642cb20_hoisted_2 = {
  class: "fschaptertable"
};
const DataPagingvue_type_template_id_6642cb20_hoisted_3 = {
  class: "fschapterrow"
};
const DataPagingvue_type_template_id_6642cb20_hoisted_4 = {
  class: "fschaptercolumn"
};
const DataPagingvue_type_template_id_6642cb20_hoisted_5 = {
  class: "fschapterlayer"
};
const DataPagingvue_type_template_id_6642cb20_hoisted_6 = {
  class: "page-table-class pagination pagination-sm"
};
function DataPagingvue_type_template_id_6642cb20_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_A = (0,runtime_core_esm_bundler/* resolveComponent */.g2)("A");
  return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("div", DataPagingvue_type_template_id_6642cb20_hoisted_1, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("table", DataPagingvue_type_template_id_6642cb20_hoisted_2, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("tr", DataPagingvue_type_template_id_6642cb20_hoisted_3, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("td", DataPagingvue_type_template_id_6642cb20_hoisted_4, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", DataPagingvue_type_template_id_6642cb20_hoisted_5, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("ul", DataPagingvue_type_template_id_6642cb20_hoisted_6, [((0,runtime_core_esm_bundler/* openBlock */.uX)(true), (0,runtime_core_esm_bundler/* createElementBlock */.CE)(runtime_core_esm_bundler/* Fragment */.FK, null, (0,runtime_core_esm_bundler/* renderList */.pI)($setup.pager, (item, index) => {
    return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("li", {
      key: index,
      class: (0,shared_esm_bundler/* normalizeClass */.C4)(["page-item page-column-class", item.css])
    }, [(0,runtime_core_esm_bundler/* createVNode */.bF)(_component_A, {
      HREF: "javascript:void(0)",
      onClick: $event => $options.pageSelect(item),
      class: (0,shared_esm_bundler/* normalizeClass */.C4)(["page-link pagenoclass fa-data-page", item.css]),
      "data-paging": item.page
    }, {
      default: (0,runtime_core_esm_bundler/* withCtx */.k6)(() => [(0,runtime_core_esm_bundler/* createTextVNode */.eW)((0,shared_esm_bundler/* toDisplayString */.v_)(item.text), 1)]),
      _: 2
    }, 1032, ["onClick", "class", "data-paging"])], 2);
  }), 128))])])])])])]);
}
;// CONCATENATED MODULE: ./src/controls/DataPaging.vue?vue&type=template&id=6642cb20

;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/controls/DataPaging.vue?vue&type=script&lang=js


/* harmony default export */ var DataPagingvue_type_script_lang_js = ({
  props: {
    settings: Object
  },
  emits: ["page-select"],
  setup(props) {
    let paging = new Paging(props.settings);
    let model = paging.buildPagingModel();
    let pager = (0,reactivity_esm_bundler/* ref */.KR)(model);
    return {
      paging,
      pager
    };
  },
  methods: {
    clear() {
      this.reset(DEFAULT_PAGE_SETTINGS);
    },
    reset(newSettings) {
      if (newSettings) {
        this.paging.reset(newSettings);
        let model = this.paging.buildPagingModel();
        this.pager = {
          ...model
        };
      }
    },
    pageSelect(item) {
      this.$emit('page-select', item);
    }
  }
});
;// CONCATENATED MODULE: ./src/controls/DataPaging.vue?vue&type=script&lang=js
 
;// CONCATENATED MODULE: ./src/controls/DataPaging.vue




;
const DataPaging_exports_ = /*#__PURE__*/(0,exportHelper/* default */.A)(DataPagingvue_type_script_lang_js, [['render',DataPagingvue_type_template_id_6642cb20_render]])

/* harmony default export */ var DataPaging = (DataPaging_exports_);
// EXTERNAL MODULE: ./node_modules/vue3-select2-component/src/Select2.vue + 3 modules
var Select2 = __webpack_require__(8704);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/SearchForm.vue?vue&type=script&lang=js










const defaultData = {
  account: '',
  effectdate: "",
  marrystatus: "",
  title: ""
};
const tableSettings = {
  sequence: {
    label: "seqno_label"
  },
  columns: [{
    name: "account",
    type: "STRING",
    sorter: "account",
    label: "account_head",
    css: "text-center"
  }, {
    name: "amount",
    type: "DECIMAL",
    sorter: "amount",
    label: "amount_head",
    css: "text-right"
  }, {
    name: "age",
    type: "INTEGER",
    sorter: "age",
    label: "age_head",
    css: "text-center"
  }, {
    name: "gender",
    type: "STRING",
    sorter: false,
    label: "gender_head",
    css: "text-center",
    unescape: true
  }, {
    name: "effectdate",
    type: "DATE",
    sorter: "effectdate",
    label: "effectdate_head",
    css: "text-center"
  }, {
    name: "effecttime",
    type: "TIME",
    sorter: "effecttime",
    label: "effecttime_head",
    css: "text-center"
  }, {
    name: "title",
    type: "STRING",
    sorter: "title",
    label: "title_head",
    css: "text-left"
  }],
  actions: [{
    type: "button",
    action: "edit"
  }, {
    type: "button",
    action: "delete"
  }]
};
/* harmony default export */ var SearchFormvue_type_script_lang_js = ({
  components: {
    InputDate: InputDate,
    InputMask: InputMask,
    DataTable: DataTable,
    DataPaging: DataPaging,
    Select2: Select2/* default */.A
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
    let paging = new Paging();
    let pagingSettings = paging.setting;
    let filters = {};
    //select2 data options must in format {id:?, text:?}
    //const statusOptions = props.dataCategory.marrystatus.map((item) => { return {id: item.key, text: item.text}});
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
      let formdata = serializeParameters(jsondata, criterias);
      startWaiting();
      jquery_default().ajax({
        url: getApiUrl() + "/api/demo002/collect",
        data: formdata.jsondata,
        headers: formdata.headers,
        type: "POST",
        dataType: "json",
        contentType: DEFAULT_CONTENT_TYPE,
        error: function (transport, status, errorThrown) {
          console.error("error: status", status, "errorThrown", errorThrown);
          submitFailure(transport, status, errorThrown);
        },
        success: data => {
          stopWaiting();
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
    },
    formatData(data, field) {
      if (field.name == "gender") {
        if ("M" == data) {
          //return this.labels.male_label; //"Male";
          return '<em class="fa fa-male"></em>';
        } else if ("F" == data) {
          //return this.labels.female_label; //"Female";
          return '<em class="fa fa-female"></em>';
        } else return data;
      }
      return this.$refs.dataTable.formatField(data, field);
    }
  }
});
;// CONCATENATED MODULE: ./src/components/SearchForm.vue?vue&type=script&lang=js
 
;// CONCATENATED MODULE: ./src/components/SearchForm.vue




;
const SearchForm_exports_ = /*#__PURE__*/(0,exportHelper/* default */.A)(SearchFormvue_type_script_lang_js, [['render',SearchFormvue_type_template_id_23581c16_render]])

/* harmony default export */ var SearchForm = (SearchForm_exports_);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/EntryForm.vue?vue&type=template&id=7cea5f9b

const EntryFormvue_type_template_id_7cea5f9b_hoisted_1 = {
  key: 0,
  class: "modal-title"
};
const EntryFormvue_type_template_id_7cea5f9b_hoisted_2 = {
  key: 1,
  class: "modal-title"
};
const EntryFormvue_type_template_id_7cea5f9b_hoisted_3 = {
  class: "row row-height"
};
const EntryFormvue_type_template_id_7cea5f9b_hoisted_4 = {
  class: "col-height col-md-4"
};
const EntryFormvue_type_template_id_7cea5f9b_hoisted_5 = {
  for: "account"
};
const EntryFormvue_type_template_id_7cea5f9b_hoisted_6 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", {
  class: "required"
}, "*", -1);
const EntryFormvue_type_template_id_7cea5f9b_hoisted_7 = {
  key: 0,
  class: "has-error"
};
const EntryFormvue_type_template_id_7cea5f9b_hoisted_8 = {
  class: "row row-height"
};
const EntryFormvue_type_template_id_7cea5f9b_hoisted_9 = {
  class: "col-height col-md-4"
};
const EntryFormvue_type_template_id_7cea5f9b_hoisted_10 = {
  for: "amount"
};
const EntryFormvue_type_template_id_7cea5f9b_hoisted_11 = {
  key: 0,
  class: "has-error"
};
const EntryFormvue_type_template_id_7cea5f9b_hoisted_12 = {
  class: "col-height col-md-3"
};
const EntryFormvue_type_template_id_7cea5f9b_hoisted_13 = {
  for: "pincode"
};
const EntryFormvue_type_template_id_7cea5f9b_hoisted_14 = {
  key: 0,
  class: "has-error"
};
const EntryFormvue_type_template_id_7cea5f9b_hoisted_15 = {
  class: "row row-height"
};
const EntryFormvue_type_template_id_7cea5f9b_hoisted_16 = {
  class: "col-height col-md-7"
};
const EntryFormvue_type_template_id_7cea5f9b_hoisted_17 = {
  for: "title"
};
const EntryFormvue_type_template_id_7cea5f9b_hoisted_18 = {
  class: "row row-height"
};
const EntryFormvue_type_template_id_7cea5f9b_hoisted_19 = {
  class: "col-height col-md-4"
};
const _hoisted_20 = {
  for: "effectdate"
};
const _hoisted_21 = {
  key: 0,
  class: "has-error"
};
const _hoisted_22 = {
  class: "col-height col-md-3"
};
const _hoisted_23 = {
  for: "edittime"
};
const _hoisted_24 = {
  key: 0,
  class: "has-error"
};
const _hoisted_25 = {
  class: "row row-height"
};
const _hoisted_26 = {
  class: "col-height col-md-1"
};
const _hoisted_27 = {
  for: "age"
};
const _hoisted_28 = {
  class: "col-height col-md-2"
};
const _hoisted_29 = {
  key: 0,
  class: "has-error"
};
const _hoisted_30 = {
  class: "col-height col-md-5"
};
const _hoisted_31 = {
  class: "form-check"
};
const _hoisted_32 = {
  for: "domestic",
  class: "form-check-label"
};
const _hoisted_33 = {
  key: 0,
  class: "has-error"
};
const _hoisted_34 = {
  class: "row row-height"
};
const _hoisted_35 = {
  class: "col-height col-md-1"
};
const _hoisted_36 = {
  class: "col-height col-md-2"
};
const _hoisted_37 = {
  class: "form-check"
};
const _hoisted_38 = {
  for: "male",
  class: "form-check-label"
};
const _hoisted_39 = {
  class: "col-height col-md-2"
};
const _hoisted_40 = {
  class: "form-check"
};
const _hoisted_41 = {
  for: "female",
  class: "form-check-label"
};
const _hoisted_42 = {
  key: 0,
  class: "has-error"
};
const _hoisted_43 = {
  class: "row row-height"
};
const _hoisted_44 = {
  class: "col-height col-md-1"
};
const _hoisted_45 = {
  class: "form-check"
};
const _hoisted_46 = ["id", "value"];
const _hoisted_47 = ["for"];
const _hoisted_48 = {
  key: 0,
  class: "has-error"
};
const _hoisted_49 = {
  class: "row row-height"
};
const _hoisted_50 = {
  class: "col-height col-md-3"
};
const _hoisted_51 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("option", {
  value: ""
}, null, -1);
const _hoisted_52 = ["value"];
const _hoisted_53 = {
  key: 0,
  class: "has-error"
};
const _hoisted_54 = {
  class: "col-height col-md-3"
};
const _hoisted_55 = ["value"];
const _hoisted_56 = {
  key: 0,
  class: "has-error"
};
const _hoisted_57 = {
  class: "row row-height"
};
const _hoisted_58 = {
  class: "col-height col-md-8"
};
const _hoisted_59 = {
  for: "remark"
};
const _hoisted_60 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("em", {
  class: "fa fa-save fa-btn-icon"
}, null, -1);
const _hoisted_61 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("em", {
  class: "fa fa-save fa-btn-icon"
}, null, -1);
const _hoisted_62 = {
  class: "btn btn-dark btn-sm",
  "data-dismiss": "modal"
};
const _hoisted_63 = /*#__PURE__*/(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("em", {
  class: "fa fa-close fa-btn-icon"
}, null, -1);
function EntryFormvue_type_template_id_7cea5f9b_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_InputMask = (0,runtime_core_esm_bundler/* resolveComponent */.g2)("InputMask");
  const _component_InputMoney = (0,runtime_core_esm_bundler/* resolveComponent */.g2)("InputMoney");
  const _component_InputDate = (0,runtime_core_esm_bundler/* resolveComponent */.g2)("InputDate");
  const _component_InputTime = (0,runtime_core_esm_bundler/* resolveComponent */.g2)("InputTime");
  const _component_InputNumber = (0,runtime_core_esm_bundler/* resolveComponent */.g2)("InputNumber");
  const _component_DialogForm = (0,runtime_core_esm_bundler/* resolveComponent */.g2)("DialogForm");
  return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createBlock */.Wv)(_component_DialogForm, {
    ref: "dialogForm"
  }, {
    header: (0,runtime_core_esm_bundler/* withCtx */.k6)(() => [$options.insertMode ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("h4", EntryFormvue_type_template_id_7cea5f9b_hoisted_1, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.title_new), 1)) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true), $options.updateMode ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("h4", EntryFormvue_type_template_id_7cea5f9b_hoisted_2, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.title_edit), 1)) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true)]),
    default: (0,runtime_core_esm_bundler/* withCtx */.k6)(() => [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", EntryFormvue_type_template_id_7cea5f9b_hoisted_3, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", EntryFormvue_type_template_id_7cea5f9b_hoisted_4, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", EntryFormvue_type_template_id_7cea5f9b_hoisted_5, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.account_label), 1), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", {
      class: (0,shared_esm_bundler/* normalizeClass */.C4)(["input-group has-validation", {
        'has-error': $setup.v$.account.$error
      }])
    }, [(0,runtime_core_esm_bundler/* createVNode */.bF)(_component_InputMask, {
      ref: "account",
      modelValue: $setup.localData.account,
      "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => $setup.localData.account = $event),
      id: "account",
      name: "account",
      picture: "XXXXXXXXXXXX",
      disabled: $setup.disabledKeyField
    }, null, 8, ["modelValue", "disabled"]), EntryFormvue_type_template_id_7cea5f9b_hoisted_6], 2), $setup.v$.account.$error ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("span", EntryFormvue_type_template_id_7cea5f9b_hoisted_7, (0,shared_esm_bundler/* toDisplayString */.v_)($setup.v$.account.$errors[0].$message), 1)) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true)])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", EntryFormvue_type_template_id_7cea5f9b_hoisted_8, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", EntryFormvue_type_template_id_7cea5f9b_hoisted_9, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", EntryFormvue_type_template_id_7cea5f9b_hoisted_10, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.amount_label), 1), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", {
      class: (0,shared_esm_bundler/* normalizeClass */.C4)(["input-group", {
        'has-error': $setup.v$.amount.$error
      }])
    }, [(0,runtime_core_esm_bundler/* createVNode */.bF)(_component_InputMoney, {
      ref: "amount",
      modelValue: $setup.localData.amount,
      "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => $setup.localData.amount = $event),
      id: "amount",
      name: "amount",
      decimal: "2"
    }, null, 8, ["modelValue"])], 2), $setup.v$.amount.$error ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("span", EntryFormvue_type_template_id_7cea5f9b_hoisted_11, (0,shared_esm_bundler/* toDisplayString */.v_)($setup.v$.amount.$errors[0].$message), 1)) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", EntryFormvue_type_template_id_7cea5f9b_hoisted_12, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", EntryFormvue_type_template_id_7cea5f9b_hoisted_13, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.pincode_label), 1), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", {
      class: (0,shared_esm_bundler/* normalizeClass */.C4)(["input-group", {
        'has-error': $setup.v$.pincode.$error
      }])
    }, [(0,runtime_core_esm_bundler/* createVNode */.bF)(_component_InputMask, {
      ref: "pincode",
      modelValue: $setup.localData.pincode,
      "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => $setup.localData.pincode = $event),
      id: "pincode",
      name: "pincode",
      picture: "XXXXXXXX"
    }, null, 8, ["modelValue"])], 2), $setup.v$.pincode.$error ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("span", EntryFormvue_type_template_id_7cea5f9b_hoisted_14, (0,shared_esm_bundler/* toDisplayString */.v_)($setup.v$.pincode.$errors[0].$message), 1)) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true)])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", EntryFormvue_type_template_id_7cea5f9b_hoisted_15, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", EntryFormvue_type_template_id_7cea5f9b_hoisted_16, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", EntryFormvue_type_template_id_7cea5f9b_hoisted_17, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.title_label), 1), (0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("input", {
      ref: "title",
      type: "text",
      "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => $setup.localData.title = $event),
      id: "title",
      class: "form-control input-md",
      maxlength: "100"
    }, null, 512), [[runtime_dom_esm_bundler/* vModelText */.Jo, $setup.localData.title]])])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", EntryFormvue_type_template_id_7cea5f9b_hoisted_18, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", EntryFormvue_type_template_id_7cea5f9b_hoisted_19, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", _hoisted_20, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.effectdate_label), 1), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", {
      class: (0,shared_esm_bundler/* normalizeClass */.C4)(["input-group", {
        'has-error': $setup.v$.effectdate.$error
      }])
    }, [(0,runtime_core_esm_bundler/* createVNode */.bF)(_component_InputDate, {
      ref: "effectdate",
      modelValue: $setup.localData.effectdate,
      "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => $setup.localData.effectdate = $event),
      id: "effectdate",
      name: "effectdate"
    }, null, 8, ["modelValue"])], 2), $setup.v$.effectdate.$error ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("span", _hoisted_21, (0,shared_esm_bundler/* toDisplayString */.v_)($setup.v$.effectdate.$errors[0].$message), 1)) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_22, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", _hoisted_23, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.effecttime_label), 1), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", {
      class: (0,shared_esm_bundler/* normalizeClass */.C4)(["input-group", {
        'has-error': $setup.v$.effecttime.$error
      }])
    }, [(0,runtime_core_esm_bundler/* createVNode */.bF)(_component_InputTime, {
      ref: "effecttime",
      modelValue: $setup.localData.effecttime,
      "onUpdate:modelValue": _cache[5] || (_cache[5] = $event => $setup.localData.effecttime = $event),
      id: "effecttime",
      name: "effecttime"
    }, null, 8, ["modelValue"])], 2), $setup.v$.effecttime.$error ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("span", _hoisted_24, (0,shared_esm_bundler/* toDisplayString */.v_)($setup.v$.effecttime.$errors[0].$message), 1)) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true)])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_25, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_26, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", _hoisted_27, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.age_label), 1)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_28, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", {
      class: (0,shared_esm_bundler/* normalizeClass */.C4)(["input-group", {
        'has-error': $setup.v$.age.$error
      }])
    }, [(0,runtime_core_esm_bundler/* createVNode */.bF)(_component_InputNumber, {
      ref: "age",
      modelValue: $setup.localData.age,
      "onUpdate:modelValue": _cache[6] || (_cache[6] = $event => $setup.localData.age = $event),
      id: "age",
      name: "age"
    }, null, 8, ["modelValue"])], 2), $setup.v$.age.$error ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("span", _hoisted_29, (0,shared_esm_bundler/* toDisplayString */.v_)($setup.v$.age.$errors[0].$message), 1)) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_30, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_31, [(0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("input", {
      ref: "domestic",
      type: "checkbox",
      id: "domestic",
      "true-value": 1,
      "false-value": 0,
      "onUpdate:modelValue": _cache[7] || (_cache[7] = $event => $setup.localData.domestic = $event),
      class: "form-control input-md form-check-input"
    }, null, 512), [[runtime_dom_esm_bundler/* vModelCheckbox */.lH, $setup.localData.domestic]]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", _hoisted_32, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.domestic_label), 1), $setup.v$.domestic.$error ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("span", _hoisted_33, (0,shared_esm_bundler/* toDisplayString */.v_)($setup.v$.domestic.$errors[0].$message), 1)) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true)])])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_34, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_35, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", null, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.gender_label), 1)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_36, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_37, [(0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("input", {
      ref: "gender",
      type: "radio",
      id: "male",
      value: "M",
      "onUpdate:modelValue": _cache[8] || (_cache[8] = $event => $setup.localData.gender = $event),
      class: "form-control input-md form-check-input"
    }, null, 512), [[runtime_dom_esm_bundler/* vModelRadio */.XL, $setup.localData.gender]]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", _hoisted_38, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.male_label), 1)])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_39, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_40, [(0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("input", {
      ref: "gender",
      type: "radio",
      id: "female",
      value: "F",
      "onUpdate:modelValue": _cache[9] || (_cache[9] = $event => $setup.localData.gender = $event),
      class: "form-control input-md form-check-input"
    }, null, 512), [[runtime_dom_esm_bundler/* vModelRadio */.XL, $setup.localData.gender]]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", _hoisted_41, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.female_label), 1)])]), $setup.v$.gender.$error ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("span", _hoisted_42, (0,shared_esm_bundler/* toDisplayString */.v_)($setup.v$.gender.$errors[0].$message), 1)) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_43, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_44, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", null, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.licenses_label), 1)]), ((0,runtime_core_esm_bundler/* openBlock */.uX)(true), (0,runtime_core_esm_bundler/* createElementBlock */.CE)(runtime_core_esm_bundler/* Fragment */.FK, null, (0,runtime_core_esm_bundler/* renderList */.pI)($props.dataCategory.licenses, item => {
      return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("div", {
        key: item.id,
        class: "col-height col-md-2"
      }, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_45, [(0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("input", {
        ref_for: true,
        ref: "licenses",
        type: "checkbox",
        id: item.id,
        value: item.id,
        "onUpdate:modelValue": _cache[10] || (_cache[10] = $event => $setup.localData.licenses = $event),
        class: "form-control input-md form-check-input"
      }, null, 8, _hoisted_46), [[runtime_dom_esm_bundler/* vModelCheckbox */.lH, $setup.localData.licenses]]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", {
        for: item.id,
        class: "form-check-label"
      }, (0,shared_esm_bundler/* toDisplayString */.v_)(item.text), 9, _hoisted_47)])]);
    }), 128)), $setup.v$.licenses.$error ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("span", _hoisted_48, (0,shared_esm_bundler/* toDisplayString */.v_)($setup.v$.licenses.$errors[0].$message), 1)) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_49, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_50, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", null, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.marrystatus_label), 1), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", {
      class: (0,shared_esm_bundler/* normalizeClass */.C4)(["input-group", {
        'has-error': $setup.v$.marrystatus.$error
      }])
    }, [(0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("select", {
      ref: "marrystatus",
      "onUpdate:modelValue": _cache[11] || (_cache[11] = $event => $setup.localData.marrystatus = $event),
      class: "form-control input-md"
    }, [_hoisted_51, ((0,runtime_core_esm_bundler/* openBlock */.uX)(true), (0,runtime_core_esm_bundler/* createElementBlock */.CE)(runtime_core_esm_bundler/* Fragment */.FK, null, (0,runtime_core_esm_bundler/* renderList */.pI)($props.dataCategory.marrystatus, item => {
      return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("option", {
        key: item.id,
        value: item.id
      }, (0,shared_esm_bundler/* toDisplayString */.v_)(item.text), 9, _hoisted_52);
    }), 128))], 512), [[runtime_dom_esm_bundler/* vModelSelect */.u1, $setup.localData.marrystatus]])], 2), $setup.v$.marrystatus.$error ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("span", _hoisted_53, (0,shared_esm_bundler/* toDisplayString */.v_)($setup.v$.marrystatus.$errors[0].$message), 1)) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_54, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", null, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.languages_label), 1), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", {
      class: (0,shared_esm_bundler/* normalizeClass */.C4)(["input-group", {
        'has-error': $setup.v$.languages.$error
      }])
    }, [(0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("select", {
      ref: "languages",
      "onUpdate:modelValue": _cache[12] || (_cache[12] = $event => $setup.localData.languages = $event),
      class: "form-control input-md",
      multiple: ""
    }, [((0,runtime_core_esm_bundler/* openBlock */.uX)(true), (0,runtime_core_esm_bundler/* createElementBlock */.CE)(runtime_core_esm_bundler/* Fragment */.FK, null, (0,runtime_core_esm_bundler/* renderList */.pI)($props.dataCategory.languages, item => {
      return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("option", {
        key: item.id,
        value: item.id
      }, (0,shared_esm_bundler/* toDisplayString */.v_)(item.text), 9, _hoisted_55);
    }), 128))], 512), [[runtime_dom_esm_bundler/* vModelSelect */.u1, $setup.localData.languages]])], 2), $setup.v$.languages.$error ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("span", _hoisted_56, (0,shared_esm_bundler/* toDisplayString */.v_)($setup.v$.languages.$errors[0].$message), 1)) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true)])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_57, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_58, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("label", _hoisted_59, (0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.remark_label), 1), (0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("input", {
      ref: "remark",
      type: "text",
      "onUpdate:modelValue": _cache[13] || (_cache[13] = $event => $setup.localData.remark = $event),
      id: "remark",
      class: "form-control input-md",
      maxlength: "100"
    }, null, 512), [[runtime_dom_esm_bundler/* vModelText */.Jo, $setup.localData.remark]])])])]),
    footer: (0,runtime_core_esm_bundler/* withCtx */.k6)(() => [$options.insertMode ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("button", {
      key: 0,
      class: "btn btn-dark btn-sm",
      onClick: _cache[14] || (_cache[14] = (...args) => $options.saveClick && $options.saveClick(...args))
    }, [_hoisted_60, (0,runtime_core_esm_bundler/* createTextVNode */.eW)((0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.save_button), 1)])) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true), $options.updateMode ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("button", {
      key: 1,
      class: "btn btn-dark btn-sm",
      onClick: _cache[15] || (_cache[15] = (...args) => $options.updateClick && $options.updateClick(...args))
    }, [_hoisted_61, (0,runtime_core_esm_bundler/* createTextVNode */.eW)((0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.update_button), 1)])) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("button", _hoisted_62, [_hoisted_63, (0,runtime_core_esm_bundler/* createTextVNode */.eW)((0,shared_esm_bundler/* toDisplayString */.v_)($props.labels.cancel_button), 1)])]),
    _: 1
  }, 512);
}
;// CONCATENATED MODULE: ./src/components/EntryForm.vue?vue&type=template&id=7cea5f9b

// EXTERNAL MODULE: ./node_modules/@vuelidate/core/dist/index.mjs
var dist = __webpack_require__(7760);
// EXTERNAL MODULE: ./node_modules/@vuelidate/validators/dist/index.mjs
var validators_dist = __webpack_require__(9428);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/controls/InputTime.vue?vue&type=template&id=59788880

const InputTimevue_type_template_id_59788880_hoisted_1 = ["value", "id", "name", "editable", "disabled"];
function InputTimevue_type_template_id_59788880_render(_ctx, _cache, $props, $setup, $data, $options) {
  return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("input", (0,runtime_core_esm_bundler/* mergeProps */.v6)({
    ref: "input",
    type: "text",
    onInput: _cache[0] || (_cache[0] = (...args) => $setup.updateValue && $setup.updateValue(...args)),
    onSelect: _cache[1] || (_cache[1] = (...args) => $setup.updateValue && $setup.updateValue(...args)),
    value: $props.modelValue,
    id: $props.id,
    name: $props.name,
    class: $setup.inputClasses,
    editable: $options.isEditable,
    disabled: $props.disabled
  }, _ctx.$attrs), null, 16, InputTimevue_type_template_id_59788880_hoisted_1);
}
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/controls/InputTime.vue?vue&type=script&lang=js



/* harmony default export */ var InputTimevue_type_script_lang_js = ({
  props: {
    modelValue: String,
    id: {
      type: String,
      default: "input_" + randomNumber() + "_" + new Date().getTime()
    },
    name: {
      type: String,
      required: false
    },
    disabled: {
      type: [String, Boolean],
      required: false
    }
  },
  setup(props, context) {
    let attrClass = context.attrs.class ? context.attrs.class : "";
    let inputClasses = getControlClasses(attrClass, 'form-control', 'ivue', 'iedit', 'itime');
    const updateValue = event => {
      context.emit('update:modelValue', event.target.value);
    };
    return {
      updateValue,
      inputClasses
    };
  },
  mounted() {
    let element = document.getElementById(this.id);
    jquery_default()(element).clockpicker({
      align: "left",
      autoclose: true,
      donetext: "Done",
      cleartext: "Clear",
      afterDone: function () {
        element.dispatchEvent(new Event('select'));
        let fn = jquery_default()(element).data("afterSelectTimePicker");
        if (fn) fn(element);
      }
    });
  },
  computed: {
    isEditable() {
      if (this.disabled === false || this.disabled === "false") return true;
      return false;
    }
  },
  methods: {
    focus() {
      this.$refs.input.focus();
    }
  }
});
;// CONCATENATED MODULE: ./src/controls/InputTime.vue?vue&type=script&lang=js
 
;// CONCATENATED MODULE: ./src/controls/InputTime.vue




;
const InputTime_exports_ = /*#__PURE__*/(0,exportHelper/* default */.A)(InputTimevue_type_script_lang_js, [['render',InputTimevue_type_template_id_59788880_render]])

/* harmony default export */ var InputTime = (InputTime_exports_);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/controls/InputNumber.vue?vue&type=template&id=72f4eab3

const InputNumbervue_type_template_id_72f4eab3_hoisted_1 = ["id", "name", "disabled"];
function InputNumbervue_type_template_id_72f4eab3_render(_ctx, _cache, $props, $setup, $data, $options) {
  return (0,runtime_core_esm_bundler/* withDirectives */.bo)(((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("input", (0,runtime_core_esm_bundler/* mergeProps */.v6)({
    ref: "input",
    type: "text",
    "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => $options.model = $event),
    id: $props.id,
    name: $props.name,
    class: $setup.inputClasses,
    disabled: $props.disabled
  }, _ctx.$attrs), null, 16, InputNumbervue_type_template_id_72f4eab3_hoisted_1)), [[runtime_dom_esm_bundler/* vModelText */.Jo, $options.model]]);
}
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/controls/InputNumber.vue?vue&type=script&lang=js



/* harmony default export */ var InputNumbervue_type_script_lang_js = ({
  props: {
    modelValue: [String, Number],
    id: {
      type: String,
      default: "input_" + randomNumber() + "_" + new Date().getTime()
    },
    name: {
      type: String,
      required: false
    },
    disabled: {
      type: [String, Boolean],
      required: false
    }
  },
  setup(props, context) {
    let attrClass = context.attrs.class ? context.attrs.class : "";
    let inputClasses = getControlClasses(attrClass, 'form-control', 'ivue', 'iint');
    let isTypeNumeric = typeof props.modelValue === 'number';
    return {
      inputClasses,
      isTypeNumeric
    };
  },
  mounted() {
    let element = document.getElementById(this.id);
    jquery_default()(element).on("keypress", function (event) {
      return inputNumberOnly(this, event);
    });
  },
  emits: ['update:modelValue'],
  computed: {
    model: {
      get() {
        return this.modelValue;
      },
      set(value) {
        if (this.isTypeNumeric) {
          if (value == "-") {
            this.$emit('update:modelValue', value);
            return;
          }
          if (!value) {
            value = "0";
          }
          this.$emit('update:modelValue', Number(value.replaceAll(',', '')));
          return;
        }
        this.$emit('update:modelValue', value);
      }
    }
  },
  methods: {
    focus() {
      this.$refs.input.focus();
    }
  }
});
;// CONCATENATED MODULE: ./src/controls/InputNumber.vue?vue&type=script&lang=js
 
;// CONCATENATED MODULE: ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-12.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-12.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12.use[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/controls/InputNumber.vue?vue&type=style&index=0&id=72f4eab3&lang=css
// extracted by mini-css-extract-plugin

;// CONCATENATED MODULE: ./src/controls/InputNumber.vue?vue&type=style&index=0&id=72f4eab3&lang=css

;// CONCATENATED MODULE: ./src/controls/InputNumber.vue




;


const InputNumber_exports_ = /*#__PURE__*/(0,exportHelper/* default */.A)(InputNumbervue_type_script_lang_js, [['render',InputNumbervue_type_template_id_72f4eab3_render]])

/* harmony default export */ var InputNumber = (InputNumber_exports_);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/controls/InputMoney.vue?vue&type=template&id=ab37802a

const InputMoneyvue_type_template_id_ab37802a_hoisted_1 = ["id", "name", "decimal", "disabled"];
function InputMoneyvue_type_template_id_ab37802a_render(_ctx, _cache, $props, $setup, $data, $options) {
  return (0,runtime_core_esm_bundler/* withDirectives */.bo)(((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("input", (0,runtime_core_esm_bundler/* mergeProps */.v6)({
    ref: "input",
    type: "text",
    "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => $options.model = $event),
    id: $props.id,
    name: $props.name,
    class: $setup.inputClasses,
    decimal: $props.decimal,
    disabled: $props.disabled
  }, _ctx.$attrs), null, 16, InputMoneyvue_type_template_id_ab37802a_hoisted_1)), [[runtime_dom_esm_bundler/* vModelText */.Jo, $options.model]]);
}
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/controls/InputMoney.vue?vue&type=script&lang=js



/* harmony default export */ var InputMoneyvue_type_script_lang_js = ({
  props: {
    modelValue: [String, Number],
    id: {
      type: String,
      default: "input_" + randomNumber() + "_" + new Date().getTime()
    },
    name: {
      type: String,
      required: false
    },
    disabled: {
      type: [String, Boolean],
      required: false
    },
    decimal: {
      type: [String, Number],
      default: "2",
      required: true
    }
  },
  setup(props, context) {
    let attrClass = context.attrs.class ? context.attrs.class : "";
    let inputClasses = getControlClasses(attrClass, 'form-control', 'ivue', 'imoney');
    return {
      inputClasses
    };
  },
  mounted() {
    let element = document.getElementById(this.id);
    let $this = jquery_default()(element);
    let decimal = this.decimal;
    $this.on("keyup", function (event) {
      return checkInputKey(this, event, decimal, null);
    });
    $this.on("keypress", function (event) {
      return checkInputNumberOnly(this, event, decimal);
    });
  },
  emits: ['update:modelValue'],
  computed: {
    model: {
      get() {
        if (typeof this.modelValue === 'number') {
          return formatFloating(this.modelValue, this.decimal);
        }
        return this.modelValue;
      },
      set(value) {
        //if(!value || value.trim().length==0) value ="0";
        //this.$emit('update:modelValue', Number(value.replaceAll(',','')));
        this.$emit('update:modelValue', value);
      }
    }
  },
  methods: {
    focus() {
      this.$refs.input.focus();
    }
  }
});
;// CONCATENATED MODULE: ./src/controls/InputMoney.vue?vue&type=script&lang=js
 
;// CONCATENATED MODULE: ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-12.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-12.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12.use[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/controls/InputMoney.vue?vue&type=style&index=0&id=ab37802a&lang=css
// extracted by mini-css-extract-plugin

;// CONCATENATED MODULE: ./src/controls/InputMoney.vue?vue&type=style&index=0&id=ab37802a&lang=css

;// CONCATENATED MODULE: ./src/controls/InputMoney.vue




;


const InputMoney_exports_ = /*#__PURE__*/(0,exportHelper/* default */.A)(InputMoneyvue_type_script_lang_js, [['render',InputMoneyvue_type_template_id_ab37802a_render]])

/* harmony default export */ var InputMoney = (InputMoney_exports_);
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














const EntryFormvue_type_script_lang_js_defaultData = {
  account: '',
  amount: 0.00,
  pincode: "",
  title: "",
  effectdate: "",
  effecttime: "",
  age: 0,
  domestic: "1",
  gender: "M",
  licenses: [],
  marrystatus: "",
  languages: [],
  remark: ""
};
/* harmony default export */ var EntryFormvue_type_script_lang_js = ({
  components: {
    DialogForm: DialogForm,
    InputDate: InputDate,
    InputTime: InputTime,
    InputNumber: InputNumber,
    InputMoney: InputMoney,
    InputMask: InputMask
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
    const agealert = (0,reactivity_esm_bundler/* ref */.KR)(props.labels.age_alert);
    const requiredMessage = () => {
      return validators_dist/* helpers */._$.withMessage(reqalert, validators_dist/* required */.mw);
    };
    const betweenMessage = () => {
      return validators_dist/* helpers */._$.withMessage(params => {
        return replaceString(agealert.value, [params.$params.min, params.$params.max]);
      }, (0,validators_dist/* between */.Tq)(1, 150));
    };
    const validateRules = (0,runtime_core_esm_bundler/* computed */.EW)(() => {
      return {
        account: {
          required: requiredMessage()
        },
        amount: {
          required: requiredMessage()
        },
        pincode: {
          required: requiredMessage()
        },
        effectdate: {
          required: requiredMessage()
        },
        effecttime: {
          required: requiredMessage()
        },
        age: {
          required: requiredMessage(),
          between: betweenMessage()
        },
        domestic: {
          required: requiredMessage()
        },
        gender: {
          required: requiredMessage()
        },
        marrystatus: {
          required: requiredMessage()
        },
        licenses: {
          required: requiredMessage()
        },
        languages: {
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
      reqalert,
      agealert
    };
  },
  created() {
    (0,runtime_core_esm_bundler/* watch */.wB)(this.$props, newProps => {
      this.reqalert = newProps.labels.empty_alert;
      this.agealert = newProps.labels.age_alert;
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
        else jquery_default()("#" + input).trigger("focus"); //if using id
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
    },
    startSaveRecord() {
      confirmSave(() => {
        this.saveRecord(this.localData);
      });
    },
    startUpdateRecord() {
      confirmUpdate(() => {
        this.updateRecord(this.localData);
      });
    },
    startDeleteRecord(dataKeys) {
      confirmDelete(Object.values(dataKeys), () => {
        this.deleteRecord(dataKeys);
      });
    },
    saveRecord(dataRecord) {
      let jsondata = {
        ajax: true
      };
      //Object.assign(jsondata,dataRecord);
      let formdata = serializeParameters(jsondata, dataRecord);
      startWaiting();
      jquery_default().ajax({
        url: getApiUrl() + "/api/demo002/insert",
        data: formdata.jsondata,
        headers: formdata.headers,
        type: "POST",
        dataType: "json",
        contentType: DEFAULT_CONTENT_TYPE,
        error: function (transport, status, errorThrown) {
          console.error("error: status", status, "errorThrown", errorThrown);
          submitFailure(transport, status, errorThrown);
        },
        success: data => {
          stopWaiting();
          console.log("success", data);
          if (detectErrorResponse(data)) return;
          successbox(() => {
            //reset data for new record insert
            this.resetRecord();
            this.$refs.account.focus();
          });
          this.$emit('data-saved', dataRecord, data);
        }
      });
    },
    updateRecord(dataRecord) {
      let jsondata = {
        ajax: true
      };
      //Object.assign(jsondata,dataRecord);
      let formdata = serializeParameters(jsondata, dataRecord);
      startWaiting();
      jquery_default().ajax({
        url: getApiUrl() + "/api/demo002/update",
        data: formdata.jsondata,
        headers: formdata.headers,
        type: "POST",
        dataType: "json",
        contentType: DEFAULT_CONTENT_TYPE,
        error: function (transport, status, errorThrown) {
          console.error("error: status", status, "errorThrown", errorThrown);
          submitFailure(transport, status, errorThrown);
        },
        success: data => {
          stopWaiting();
          console.log("success", data);
          if (detectErrorResponse(data)) return;
          successbox(() => {
            this.hideDialog();
          });
          this.$emit('data-updated', dataRecord, data);
        }
      });
    },
    retrieveRecord(dataKeys) {
      let jsondata = {
        ajax: true
      };
      //Object.assign(jsondata,dataKeys);
      let formdata = serializeParameters(jsondata, dataKeys);
      startWaiting();
      jquery_default().ajax({
        url: getApiUrl() + "/api/demo002/retrieve",
        data: formdata.jsondata,
        headers: formdata.headers,
        type: "POST",
        dataType: "json",
        contentType: DEFAULT_CONTENT_TYPE,
        error: function (transport, status, errorThrown) {
          console.error("retrieveRecord: error: status", status, "errorThrown", errorThrown);
          submitFailure(transport, status, errorThrown);
        },
        success: data => {
          stopWaiting();
          console.log("retrieveRecord: success", data);
          if (data.body.dataset) {
            this.reset(data.body.dataset, {
              action: "edit"
            });
            this.v$.$reset();
            this.disabledKeyField = true;
            this.showDialog();
          }
        }
      });
    },
    deleteRecord(dataKeys) {
      let jsondata = {
        ajax: true
      };
      //Object.assign(jsondata,dataKeys);
      let formdata = serializeParameters(jsondata, dataKeys);
      startWaiting();
      jquery_default().ajax({
        url: getApiUrl() + "/api/demo002/remove",
        data: formdata.jsondata,
        headers: formdata.headers,
        type: "POST",
        dataType: "json",
        contentType: DEFAULT_CONTENT_TYPE,
        error: function (transport, status, errorThrown) {
          console.error("deleteRecord: error: status", status, "errorThrown", errorThrown);
          submitFailure(transport, status, errorThrown);
        },
        success: data => {
          stopWaiting();
          console.log("deleteRecord: success", data);
          if (detectErrorResponse(data)) return;
          successbox();
          this.$emit('data-deleted', dataKeys, data);
        }
      });
    }
  }
});
;// CONCATENATED MODULE: ./src/components/EntryForm.vue?vue&type=script&lang=js
 
;// CONCATENATED MODULE: ./src/components/EntryForm.vue




;
const EntryForm_exports_ = /*#__PURE__*/(0,exportHelper/* default */.A)(EntryFormvue_type_script_lang_js, [['render',EntryFormvue_type_template_id_7cea5f9b_render]])

/* harmony default export */ var EntryForm = (EntryForm_exports_);
;// CONCATENATED MODULE: ./src/assets/js/label.util.js

function getLabel(name, defaultLabel, lang = getDefaultLanguage()) {
  let result = undefined;
  let default_labels = getDefaultLabels();
  let program_labels = getProgramLabels();
  if (!lang || lang.trim().length == 0) lang = "EN";
  let label_item = getLabelItem(name, lang, program_labels);
  if (label_item) {
    result = label_item.value;
  }
  if (!result) {
    label_item = getLabelItem(name, lang, default_labels);
    if (label_item) {
      result = label_item.value;
    }
  }
  return result ? result : defaultLabel;
}
function getLabelItem(name, lang, label_category) {
  if (!lang || lang.trim().length == 0) lang = "EN";
  let lang_item = label_category.find(item => {
    return item.language == lang;
  });
  if (lang_item) {
    return lang_item.label.find(item => {
      return item.name == name;
    });
  }
  return undefined;
}
function getLabelObject(lang = app_info_getDefaultLanguage(), label_category) {
  if (!lang || lang.trim().length == 0) lang = "EN";
  let lang_item = label_category.find(item => {
    return item.language == lang;
  });
  if (lang_item) {
    return lang_item.label;
  }
  return undefined;
}
function getLabelModel(lang = app_info_getDefaultLanguage()) {
  let default_labels = app_info_getDefaultLabels();
  let program_labels = app_info_getProgramLabels();
  let default_item = getLabelObject(lang, default_labels);
  let program_item = getLabelObject(lang, program_labels);
  let default_model = {};
  let program_model = {};
  if (default_item) {
    default_item.forEach(element => {
      default_model[element.name] = element.value;
    });
  }
  if (program_item) {
    program_item.forEach(element => {
      program_model[element.name] = element.value;
    });
  }
  return Object.assign(default_model, program_model);
}
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/AppDemo002.vue?vue&type=script&lang=js











/* harmony default export */ var AppDemo002vue_type_script_lang_js = ({
  components: {
    PageHeader: PageHeader,
    SearchForm: SearchForm,
    EntryForm: EntryForm
  },
  setup() {
    const dataChunk = {};
    const dataCategory = {
      marrystatus: [{
        id: "S",
        text: "Single"
      }, {
        id: "M",
        text: "Married"
      }, {
        id: "D",
        text: "Divorce"
      }, {
        id: "W",
        text: "Widow"
      }],
      licenses: [{
        id: "CAR",
        text: "Car"
      }, {
        id: "TRUCK",
        text: "Truck"
      }, {
        id: "BOAT",
        text: "Boat"
      }],
      languages: [{
        id: "TH",
        text: "Thai"
      }, {
        id: "EN",
        text: "English"
      }, {
        id: "CN",
        text: "Chinese"
      }, {
        id: "KR",
        text: "Korea"
      }, {
        id: "JP",
        text: "Japan"
      }]
    };
    let labels = (0,reactivity_esm_bundler/* ref */.KR)(getLabelModel());
    let alreadyLoading = (0,reactivity_esm_bundler/* ref */.KR)(false);
    return {
      labels,
      dataCategory,
      dataChunk,
      alreadyLoading
    };
  },
  mounted() {
    console.log("App: mounted ...");
    this.$nextTick(() => {
      //ensure ui completed then invoke startApplication 
      startApplication("demo002", data => {
        this.messagingHandler(data);
        this.loadDataCategories(!this.alreadyLoading, () => {
          this.$refs.pageHeader.changeLanguage(app_info_getDefaultLanguage());
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
      setDefaultLanguage(lang);
      let labelModel = getLabelModel(lang);
      this.labels = labelModel;
      this.resetDataCategories(lang);
    },
    loadDataCategories(loading, callback) {
      console.log("loadDataCategories: loading", loading);
      if (!loading) return;
      let jsondata = {
        tablename: ["kt_marrystatus", "kt_languages"],
        orderfield: "seqno"
      };
      let formdata = serializeParameters(jsondata);
      jquery_default().ajax({
        url: getApiUrl() + "/api/datatable/list",
        data: formdata.jsondata,
        headers: formdata.headers,
        type: "POST",
        dataType: "json",
        contentType: DEFAULT_CONTENT_TYPE,
        error: function (transport, status, errorThrown) {
          console.error("loadDataCategories: error: status", status, "errorThrown", errorThrown);
        },
        success: data => {
          this.alreadyLoading = true;
          console.log("loadDataCategories: success", data);
          if (data.body) {
            for (let item of data.body) {
              if (item.tablename && item.resultset && item.resultset.rows) {
                this.dataChunk[item.tablename] = item.resultset.rows;
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
      if (!lang) lang = app_info_getDefaultLanguage();
      if (!lang || lang.trim().length == 0) lang = "EN";
      let marrystatus;
      let languages;
      let kt_marrystatus = this.dataChunk["kt_marrystatus"];
      if (kt_marrystatus) {
        marrystatus = kt_marrystatus.map(item => {
          return {
            id: item.statusid,
            text: "EN" == lang ? item.nameen : item.nameth
          };
        });
      }
      let kt_languages = this.dataChunk["kt_languages"];
      if (kt_languages) {
        languages = kt_languages.map(item => {
          return {
            id: item.langid,
            text: "EN" == lang ? item.nameen : item.nameth
          };
        });
      }
      if (marrystatus) this.dataCategory.marrystatus = marrystatus;
      if (languages) this.dataCategory.languages = languages;
    },
    dataSelected(item, action) {
      //listen action from search form
      console.log("App: dataSelected", item, "action", action);
      if ("edit" == action) {
        this.$refs.entryForm.retrieveRecord({
          account: item.account
        });
      } else if ("delete" == action) {
        this.$refs.entryForm.startDeleteRecord({
          account: item.account
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
    }
  }
});
;// CONCATENATED MODULE: ./src/AppDemo002.vue?vue&type=script&lang=js
 
;// CONCATENATED MODULE: ./src/AppDemo002.vue




;
const AppDemo002_exports_ = /*#__PURE__*/(0,exportHelper/* default */.A)(AppDemo002vue_type_script_lang_js, [['render',render]])

/* harmony default export */ var AppDemo002 = (AppDemo002_exports_);
;// CONCATENATED MODULE: ./src/demo002.js


















appInit({
  program_message: program_message_namespaceObject,
  default_labels: default_label_namespaceObject,
  program_labels: program_label_namespaceObject
});


console.info("Vue version", runtime_core_esm_bundler/* version */.rE);
(0,runtime_dom_esm_bundler/* createApp */.Ef)(AppDemo002).mount('#app');

//cannot use Demo002 : Component name "Demo002" should always be multi-word

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
/******/ 		var chunkLoadingGlobal = self["webpackChunkvuedemo"] = self["webpackChunkvuedemo"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	}();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, [504], function() { return __webpack_require__(5679); })
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.3595973a.js.map