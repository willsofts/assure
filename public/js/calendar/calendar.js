function fs_isleapyear(y) {
	if ((y % 400) == 0) return true;
	if ((y % 100) == 0) return false;
	if ((y % 4) == 0) return true;
	return false;
}
function fs_isdate(str_date) {
	let re_date = /^(\d+)\/(\d+)\/(\d+)$/;
	let febday = 0;
	if (!re_date.exec(str_date))
		return false;
	try {
		if (fs_isleapyear(RegExp.$3)) {
			febday = 29;
		} else {
			febday = 28;
		}
		if (RegExp.$2 <= 0 || RegExp.$2 > 12) return false;
		if (RegExp.$1 <= 0) return false;
		return (RegExp.$2 == 1?RegExp.$1 <= 31:true)
		&& (RegExp.$2 == 2?RegExp.$1 <= febday:true)
		&& (RegExp.$2 == 3?RegExp.$1 <= 31:true)
		&& (RegExp.$2 == 4?RegExp.$1 <= 30:true)
		&& (RegExp.$2 == 5?RegExp.$1 <= 31:true)
		&& (RegExp.$2 == 6?RegExp.$1 <= 30:true)
		&& (RegExp.$2 == 7?RegExp.$1 <= 31:true)
		&& (RegExp.$2 == 8?RegExp.$1 <= 31:true)
		&& (RegExp.$2 == 9?RegExp.$1 <= 30:true)
		&& (RegExp.$2 == 10?RegExp.$1 <= 31:true)
		&& (RegExp.$2 == 11?RegExp.$1 <= 30:true)
		&& (RegExp.$2 == 12?RegExp.$1 <= 31:true);
		//let d = new Date (RegExp.$3, RegExp.$2-1, RegExp.$1);
	} catch (e) {
		return false;
	}
}
function str2d (str_date) {
	let re_date = /^(\d+)\/(\d+)\/(\d+)$/;
	if (!re_date.exec(str_date)) 
		return null;
	return (new Date (RegExp.$3, RegExp.$2-1, RegExp.$1));
}
function d2dstr (dt_date) {
	let dd = dt_date.getDate();
	let mm = dt_date.getMonth()+1;
	return (new String ((((dd < 10) ? "0" : "") + dd)+"/"+( ((mm < 10) ? "0" : "") + mm)+"/"+dt_date.getFullYear()));
}
function openCalendar(src) {
	//try { if(fs_default_language) $.datepicker.setDefaults($.datepicker.regional[fs_default_language.toLowerCase()]); }catch(ex) { }
	let dpkr = $(src);
	if(dpkr.is(":disabled")) return;
	if(dpkr.is("[readonly]")) {
		let edit = dpkr.attr("editable");
		if(!("true"==edit)) return;		
	}
	//dpkr.attr("size","12");
	try{ 
		dpkr.datepicker({
			showOn : "",
			dateFormat : "dd/mm/yy",
			changeMonth: true,
			changeYear: true,
			yearRange: "c-100:+100",
			//yearRange: "c-100:c+10",
			/*monthNamesShort: ['January','February','March','April','May','June','July','August','September','October','November','December'],*/
			/*beforeShow : function(input,inst) {
				let offset = $(input).offset();
				let height = $(input).height();
				window.setTimeout(function () {
					inst.dpDiv.css({ top: (offset.top + height + 4) + 'px', left: offset.left + 'px' })
				}, 1);
			},*/
			onSelect : function(input,inst) {
				src.focus();
				let fn = dpkr.data("afterSelectDatePicker");
				if(fn) fn(input,inst);
			}
		})
		dpkr.datepicker("show");
		$(document).unbind('focusin');
		return;
	}catch (ex)	{ }
}
function fs_opencalendar(src,placer) {
	openCalendar(src);
}
function fs_clearcalendar(src,placer) {
	let dpkr = $(src);
	if(dpkr.is(":disabled")) return;
	if(dpkr.is("[readonly]")) {
		let edit = dpkr.attr("editable");
		if(!("true"==edit)) return;		
	}
	dpkr.val("");
}
var fs_calendar_month_names = ['January','February','March','April','May','June','July','August','September','October','November','December'];
function openMonthCalendar(src) {
	//try { if(fs_default_language) $.datepicker.setDefaults($.datepicker.regional[fs_default_language.toLowerCase()]); }catch(ex) { }
	let dpkr = $(src);
	if(dpkr.is(":disabled")) return;
	if(dpkr.is("[readonly]")) {
		let edit = dpkr.attr("editable");
		if(!("true"==edit)) return;		
	}
	//dpkr.attr("size","12");
	try{ 
		dpkr.datepicker({
			showOn : "",
			dateFormat : "MM yy",
			changeMonth: true,
			changeYear: true,
			yearRange: "c-100:+10",
			showButtonPanel: true,
			showCalendarPanel: false,
			onSelect : function(input,inst) {
				src.focus();
				let fn = dpkr.data("afterSelectDatePicker");
				if(fn) fn(input,inst);
			},
			onClose: function(dateText, inst) { 
				$(this).datepicker('setDate', new Date(inst.selectedYear, inst.selectedMonth, 1));
			},
			beforeShow : function(input,inst) {			
				let datestr = $(this).val();
				if(datestr.length>0) {
					let texts = datestr.split(" ");
					let mstr = texts[0];
					let ystr = texts[1];
					if(mstr!="" && ystr!="") {
						let ayear = eval(ystr);
						let amonth = fs_calendar_month_names.indexOf(mstr);	
						$(this).datepicker('option', 'defaultDate', new Date(ayear, amonth, 1));
						$(this).datepicker('setDate', new Date(ayear, amonth, 1));
					}					
				}
			}
		});
		dpkr.focus(function() { 
			$(".ui-datepicker-calendar").hide();
		});
		dpkr.datepicker("show");
		$(document).unbind('focusin');
		return;
	}catch (ex)	{ }
}
function fs_openmonthcalendar(src_path,src,placer) {
	openMonthCalendar(src);
}
