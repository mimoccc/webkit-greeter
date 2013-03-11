// ----------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------

// helper zero align function
// max 32 chars
if (typeof(Date.to00)==='undefined') {
	Date.prototype.to00 = function(i, n) { return(('00000000000000000000000000000000'+i).substr(-n));	};
};

/*
if (typeof(Date.add)==='undefined') {
	Date.prototype.add = function (p_Interval, p_Number) {
		var thing = new String();
		//in the spirt of VB we'll make this function non-case sensitive 
		//and convert the charcters for the coder. 
		p_Interval = p_Interval.toLowerCase(); 
		if (isNaN(p_Number)) {
			//Only accpets numbers
			//throws an error so that the coder can see why he effed up
			throw "The second parameter must be a number. \n You passed: " + p_Number;
			return false; 
		}
		p_Number = new Number(p_Number);
		switch (p_Interval.toLowerCase()) {
			case "yyyy": {// year
				this.setFullYear(this.getFullYear() + p_Number);
				break;
			}
			case "q": {		// quarter
				this.setMonth(this.getMonth() + (p_Number*3));
				break;
			}
			case "m": {		// month
				this.setMonth(this.getMonth() + p_Number);
				break;
			}
			case "y":		// day of year
			case "d":		// day
			case "w": {		// weekday
				this.setDate(this.getDate() + p_Number);
				break;
			}
			case "ww": {	// week of year
				this.setDate(this.getDate() + (p_Number*7));
				break;
			}
			case "h": {		// hour
				this.setHours(this.getHours() + p_Number);
				break;
			}
			case "n": {		// minute
				this.setMinutes(this.getMinutes() + p_Number);
				break;
			}
			case "s": {		// second
				this.setSeconds(this.getSeconds() + p_Number);
				break;
			}
			case "ms": {		// second
				this.setMilliseconds(this.getMilliseconds() + p_Number);
				break;
			}
			default: {
				//throws an error so that the coder can see why he effed up and
				//a list of elegible letters.
				throw	"The first parameter must be a string from this list: \n" + 
						"yyyy, q, m, y, d, w, ww, h, n, s, or ms.  You passed: " + p_Interval;
				return false;
			}

		}
		return this;
	};
};

if (typeof(Date.fromISO)==='undefined') {
	Date.prototype.fromISO = function (datestring) {
		// 1 3 5 7 8 10 12 13 15 16 17
		// yyyy - mm - dd 'T' HH : MM : ss .ms 'Z' +/- HH : MM
		// ? ? ? ? ?
		var pattern = /^(\d{4})(-(\d{2})(-(\d{2})(T(\d{2}):(\d{2})(:(\d{2})(\.(\d+))?)?(Z|((\+|-)(\d{2}):(\d{2}))))?)?)?$/,
		match = pattern.exec(datestring),
		date = new Date(),
		hour,
		minute,
		aheadOfUtc;
		if(null === match) return false; // throw new Error("Invalid ISO String");
		// The bit-shifting is shorthand for `Number(m) || 0`
		date.setUTCFullYear(match[1] >> 0);
		date.setUTCMonth(match[3] ? (match[3] >> 0) - 1 : 0);
		date.setUTCDate(match[5] >> 0);
		date.setUTCHours(match[7] >> 0);
		date.setUTCMinutes(match[8] >> 0);
		date.setUTCSeconds(match[10] >> 0);
		date.setUTCMilliseconds(match[12] >> 0);
		// Adjust to UTC offset
		if (match[13] && match[13] !== "Z") {
			hour = match[16] >> 0;
			minute = match[17] >> 0;
			aheadOfUtc = (match[15] === "+");
			hour = hour * 60 * 60 * 1000;
			minute = minute * 60 * 1000;
			if (aheadOfUtc) {
				hour = -hour;
				minute = -minute;
			}
			// easy dateline wrapping
			date = new Date(date.valueOf() + hour + minute);
		}
		return date;
	};
};

// helper function to get first milisecond from a day
if (typeof(Date.getDayBegin)==='undefined') {
	Date.prototype.getDayBegin = function () { 
		return new Date(this.getFullYear(), this.getMonth(), this.getDate(),0,0,0,0); };
};

// helper function to get date with combination of time
if (typeof(Date.getDateCombTime)==='undefined') {
	Date.prototype.getDateCombTime = function (date, hours, minutes, seconds, milisec) {
		return new Date(date.getFullYear(), date.getMonth(), date.getDate(),hours,minutes,seconds,milisec); 
	};
};
*/