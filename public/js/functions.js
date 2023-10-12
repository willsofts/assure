function isEmpty(value) {
	return $.trim(value)=="";
}

function computeAge(dob,today) {
	let today = today || new Date();
	let result = { 
          years: 0, 
          months: 0, 
          days: 0, 
          toString: function() { 
            return (this.years ? this.years + ' Years ' : '') 
              + (this.months ? this.months + ' Months ' : '') 
              + (this.days ? this.days + ' Days' : '');
          }
	};
    result.months = ((today.getFullYear() * 12) + (today.getMonth() + 1))
      - ((dob.getFullYear() * 12) + (dob.getMonth() + 1));
    if (0 > (result.days = today.getDate() - dob.getDate())) {
        let y = today.getFullYear(), m = today.getMonth();
        m = (--m < 0) ? 11 : m;
        result.days += 
          [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m] 
            + (((1 == m) && ((y % 4) == 0) && (((y % 100) > 0) || ((y % 400) == 0))) 
                ? 1 : 0);
        --result.months;
    }
    result.years = (result.months - (result.months % 12)) / 12;
    result.months = (result.months % 12);
    return result;
}
function checkIDCard(id) {
	if(id.length != 13) return false;
	for(i=0, sum=0; i < 12; i++)
		sum += parseFloat(id.charAt(i))*(13-i); 
	if((11-sum%11)%10!=parseFloat(id.charAt(12)))
		return false; 
	return true;
}
function createUUID() {
    let s = [];
    let hexDigits = "0123456789abcdef";
    for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";
    let uuid = s.join("");
    return uuid;
}
function numericEntry(event) {
	let key;  
	if (window.event) key = window.event.keyCode; 
	else if (event) key = event.which; 
	else return true; 
	let keychar = String.fromCharCode(key);
	if ((key==null) || (key==0) || (key==8) || (key==9) || (key==27)) {
		return true; 
	} else if ((("-0123456789").indexOf(keychar) > -1)) {
		return true; 
	} else {
		event.stopPropagation();
		return false; 
	}
}
