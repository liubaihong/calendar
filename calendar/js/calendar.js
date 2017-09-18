/**
 * Created by liubh on 2017/8/14.
 */

(function(a, b) {
	if(typeof exports === "object" && exports) {
		b(exports);
	} else {
		b(a);
	}
})(this, function(a) {
	/*
	 * 日期选择  
	 */
	var weekDays = ["日", "一", "二", "三", "四", "五", "六"];
	var months = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
	var lastDay = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	/*
	 * 判断是否为闰年
	 */
	function isBissextile(year) {
		var isBis = false;
		if(0 == year % 4 && ((year % 100 != 0) || (year % 400 == 0))) {
			isBis = true;
		}
		return isBis;
	}
	/*
	 * 计算某月的总天数，闰年二月为29天 
	 */
	function getMonthCount(year, month) {
		var year = month === 0 ? --year : month === 13 ? ++year : year;
		var month = month === 0 ? 12 : month === 13 ? 1 : month;
		var Mcount = lastDay[month - 1];
		if((month == 2) && isBissextile(year)) {
			Mcount++;
		}
		return Mcount;
	}

	/*
	 * 计算今天是星期几
	 */
	function thisWeekDay(year, month, date) {
		var d = new Date(year, month - 1, date);
		return d.getDay();
	}

	function dateFormat(date) {
		var dateArray = date.split("-");
		dateArray[1] = dateArray[1] < 10 ? "0" + dateArray[1] : dateArray[1];
		dateArray[2] = dateArray[2] < 10 ? "0" + dateArray[2] : dateArray[2];
		return dateArray[0] + "-" + dateArray[1] + "-" + dateArray[2];
	}

	function hasClass(obj, cls) {
		return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
	}
	/*
	 * 返回月份节点
	 */
	function getMonthDom(dayList) {
		var ul = "";
		var count = 0;
		for(var i = 0; i < 6; i++) {
			var li = ""
			var j = 1;
			for(var k = 0; k < 7; k++) {
				li = li + dayList[count];
				count++;
			}
			li = "<li>" + li + "</li>";
			ul = ul + li;
		}
		ul = "<ul>" + ul + "</ul>"
		return ul;
	}

	function Calendar(data) {
		var that = this;
		var d = new Date();
		this.year = d.getFullYear();
		this.month = d.getMonth() + 1;
		this.day = d.getDate();
		this.nowMonth = this.year + "-" + this.month;
		this.today = that.year + "-" + that.month + "-" + that.day;
		var objList = document.getElementsByClassName(data.calendar);
		this.startAndEnd = data.startAndEnd ? true : false;
		for(var i = 0; i < objList.length; i++) {
			objList[i].parentNode.onclick = (function(a) {
				return function() {
					that.createCalendar(that, objList[a]);
				}
			})(i)
		}
	}
	/*显示日历头部部分*/
	Calendar.prototype = {
		getMonth: function(preCount, preMounthCount, mounthCount, nextCount, year, month) {
			var count = 0;
			var dayList = [];
			for(var x = 1; x <= preCount; x++) {
				dayList[count] = "<span class='pre'>" + (preMounthCount - preCount + x) + "</span>";
				count++;
			}
			for(var y = 1; y <= mounthCount; y++) {
				var date = year + "-" + month + "-" + y
				if(date === this.activeDate) {
					dayList[count] = "<span class='nowMonth active'>" + y + "</span>";
				} else {
					dayList[count] = "<span class='nowMonth'>" + y + "</span>";
				}
				count++;
			}
			for(var z = 1; z <= nextCount; z++) {
				dayList[count] = "<span class='next'>" + z + "</span>";
				count++;
			}
			var monthDom = getMonthDom(dayList);
			return monthDom;
		},
		calendarTop: function() {
			var top = "";
			var select = '<div class="select"><img id="pre" src="img/preCanClick.png" alt="pre"/>' +
				'<p><span class="year">' + this.year + '</span>年<span class="month">' + months[this.month - 1] + '</span></p>' +
				'<img id="next" src="img/nextCanClick.png" alt="next"/></div>';
			var week = "";
			for(var i = 0; i < weekDays.length; i++) {
				week = week + "<span class='pre'>" + weekDays[i] + "</span>";
			}
			week = "<ul class='week'><li>" + week + "</li></ul>";
			calendarTop = '<div id="calendarTop">' + select + week + '</div>';
			return calendarTop;
		},
		calendarFooter: function() {
			return "<button id='calendarFooter' ontouchstart='' onmouseover=''>今天</button>"
		},
		calendarMonth: function(year, month, day) {
			var year = month === 0 ? --year : month === 13 ? ++year : year;
			var month = month === 0 ? 12 : month === 13 ? 1 : month;
			var total = 42;
			var startWeekday = thisWeekDay(year, month, 1) === 0 ? 7 : thisWeekDay(year, month, 1);
			var mounthCount = getMonthCount(year, month);
			var preMounthCount = getMonthCount(year, month - 1);
			var preCount = startWeekday;
			var nextCount = total - preCount - mounthCount;
			var monthDom = this.getMonth(preCount, preMounthCount, mounthCount, nextCount, year, month);
			return monthDom;
		},
		calendarPre: function(that) {
			if(that.month > 1) {
				that.month--;
			} else {
				that.year--;
				that.month = 12;
			}
			var colendarMain = document.getElementById("colendarMain");
			colendarMain.style.left = "0";
			document.getElementsByClassName("year")[0].innerText = that.year;
			document.getElementsByClassName("month")[0].innerText = months[that.month - 1];
			setTimeout(function() {
				colendarMain.style.transitionDuration = "0ms";
				colendarMain.style.webkitTransitionDuration = "0ms";
				var nextMonth = colendarMain.lastChild;
				colendarMain.removeChild(nextMonth);
				var monthPre = that.calendarMonth(that.year, that.month - 1, that.day);
				colendarMain.innerHTML = monthPre + colendarMain.innerHTML;
				colendarMain.style.left = "-276px";
				setTimeout(function() {
					colendarMain.style.transitionDuration = "200ms";
					colendarMain.style.webkitTransitionDuration = "200ms";
				}, 10)
				that.getDayEvent();
				that.nextCanClick();
			}, 260)
		},
		calendarNext: function(that) {
			if(that.isLastMonth(that)) {
				return;
			}
			if(that.month < 12) {
				that.month++;
			} else {
				that.year++;
				that.month = 1;
			}
			var colendarMain = document.getElementById("colendarMain");
			colendarMain.style.left = "-552px";
			document.getElementsByClassName("year")[0].innerText = that.year;
			document.getElementsByClassName("month")[0].innerText = months[that.month - 1];
			setTimeout(function() {
				colendarMain.style.transitionDuration = "0ms";
				colendarMain.style.webkitTransitionDuration = "0ms";
				var preMonth = colendarMain.firstChild;
				colendarMain.removeChild(preMonth);
				var monthNext = that.calendarMonth(that.year, that.month + 1, that.day);
				colendarMain.innerHTML = colendarMain.innerHTML + monthNext;
				colendarMain.style.left = "-276px";
				that.getDayEvent();
				setTimeout(function() {
					colendarMain.style.transitionDuration = "200ms";
					colendarMain.style.webkitTransitionDuration = "200ms";
				}, 10)
				that.getDayEvent();
				that.nextCanClick();
			}, 260)
		},
		getDayEvent: function() {
			var that = this;
			var nowMonthDay = document.getElementsByClassName("nowMonth");
			for(var i = 0; i < nowMonthDay.length; i++) {
				nowMonthDay[i].onclick = function() {
					var active = document.getElementsByClassName("nowMonth active");
					try {
						active[0].className = "nowMonth";
					} catch(e) {
						console.log(e.message);
					}
					this.className = "nowMonth active";
					that.activeDate = that.year + "-" + that.month + "-" + this.innerText;
					that.obj.innerText = dateFormat(that.activeDate);
					that.closeCalendar(that);
				}
			}
		},
		addBtnEvent: function() {
			var that = this;
			var pre = document.getElementById("pre");
			var next = document.getElementById("next");
			var colendarMain = document.getElementById("colendarMain");
			var calendarFooter = document.getElementById("calendarFooter");
			var calendarWrap = document.getElementById("calendarWrap");
			var calendar = document.getElementById("calendar");
			pre.onclick = function() {
				that.calendarPre(that);
				that.nextCanClick();
			}
			this.preTouchEvent();
			next.onclick = function() {
				that.calendarNext(that);
				that.nextCanClick();
			}
			this.nextTouchEvent();
			colendarMain.addEventListener("touchstart", function(event) {
				that.handleTouchEvent(event, this);
			}, false);
			colendarMain.addEventListener("touchend", function(event) {
				that.handleTouchEvent(event, this);
			}, false);
			colendarMain.addEventListener("touchmove", function(event) {
				that.handleTouchEvent(event, this);
			}, false);
			calendarWrap.addEventListener("touchmove", function(event) {
				event.preventDefault(); //阻止滚动
			}, false);
			calendarWrap.onclick = function(){
				document.body.removeChild(calendarWrap);
			}
			calendar.onclick = function(){
				event.stopPropagation();
			}
			calendarFooter.onclick = function() {
				that.obj.innerText = dateFormat(that.today);
				that.closeCalendar(that);
			}
		},
		preTouchEvent: function() {
			var pre = document.getElementById("pre");
			pre.addEventListener("touchstart", function() {
				this.src ="img/preClick.png";
			}, false)
			pre.addEventListener("touchend", function() {
				this.src = "img/preCanClick.png";
			}, false)
		},
		nextCanClick: function() {
			var next = document.getElementById("next");
			if(this.isLastMonth(this)) {
				next.src = "img/nextCantClick.png";
			} else {
				next.src = "img/nextCanClick.png";
			}
		},
		nextTouchEvent: function() {
			var that = this;
			var next = document.getElementById("next");
			this.nextCanClick();
			next.addEventListener("touchstart", function() {
				if(that.isLastMonth(that)) {
					return false;
				}
				this.src = "img/nextClick.png";
			}, false)
			next.addEventListener("touchend", function() {
				if(that.isLastMonth(that)) {
					return false;
				}
				this.src = "img/nextCanClick.png";
			}, false)
		},
		//		toToday: function(that) {
		//			var d = new Date();
		//			this.year = d.getFullYear();
		//			this.month = d.getMonth() + 1;
		//			this.day = d.getDate();
		//			that.activeDate = this.year + "-" + this.month + "-" + this.day;
		//			var colendarMain = document.getElementById("colendarMain");
		//			colendarMain.innerHTML = null;
		//			var monthPre = this.calendarMonth(this.year, this.month - 1, this.day);
		//			var monthNow = this.calendarMonth(this.year, this.month, this.day);
		//			var monthNext = this.calendarMonth(this.year, this.month + 1, this.day);
		//			colendarMain.innerHTML = monthPre + monthNow + monthNext;
		//			that.getDayEvent();
		//		},
		handleTouchEvent: function(e, obj) {
			switch(event.type) {
				case "touchstart":
					obj.style.transitionDuration = "0ms";
					this.startX = event.touches[0].clientX;
					break;
				case "touchend":
					obj.style.transitionDuration = "200ms";
					if(this.moveX > 60) {
						this.calendarPre(this);
					} else if(this.moveX < -60) {
						this.calendarNext(this);
					} else {
						obj.style.left = "-276px";
					}
					this.moveX = 0;
					break;
				case "touchmove":
					event.preventDefault(); //阻止滚动
					this.moveX = event.changedTouches[0].clientX - this.startX;
					if(this.isLastMonth(this) && this.moveX < 0) {
						return false;
					};
					this.objX = this.moveX - 276;
					this.objX = this.objX > 0 ? 0 : this.objX < -552 ? -552 : this.objX;
					obj.style.left = this.objX + "px";
					break;
			}
		},
		isLastMonth: function(that) {
			return that.nowMonth === that.year + "-" + that.month;
		},
		createCalendar: function(that, obj) {
			that.obj = obj;
			if(obj.innerText) {
				var d = new Date(obj.innerText);
				that.year = d.getFullYear();
				that.month = d.getMonth() + 1;
				that.day = d.getDate();
				that.activeDate = that.year + "-" + that.month + "-" + that.day;
			} else {
				that.activeDate = that.today;
			}
			var calendarWrap = document.createElement("div");
			calendarWrap.id = "calendarWrap";
			var calendarWrapTop = that.calendarTop();
			var calendarFooter = that.calendarFooter();
			var monthPre = that.calendarMonth(that.year, that.month - 1, that.day);
			var monthNow = that.calendarMonth(that.year, that.month, that.day);
			var monthNext = that.calendarMonth(that.year, that.month + 1, that.day);
			var calendarMain = '<div id="colendarMainWrap"><div id="colendarMain">' + monthPre + monthNow + monthNext + '</div></div>'
			var calendar = '<div id="calendar">' + calendarWrapTop + calendarMain + calendarFooter + '</div>';
			calendarWrap.innerHTML = calendar;
			document.body.appendChild(calendarWrap);
			that.addBtnEvent();
			that.getDayEvent();
		},
		closeCalendar: function(that) {
			if(that.startAndEnd) {
				if(hasClass(that.obj, "startTime")) {
					var startTime = that.obj.innerText;
					var endTime = document.getElementsByClassName("endTime")[0].innerText;
					var startTimeInt = parseInt(startTime.replace(/\-+/g, ""));
					var endTimeInt = parseInt(endTime.replace(/\-+/g, ""));
					if(endTimeInt && startTimeInt > endTimeInt) {
						that.obj.innerText = endTime;
					}
				} else if(hasClass(that.obj, "endTime")) {
					var endTime = that.obj.innerText;
					var startTime = document.getElementsByClassName("startTime")[0].innerText;
					var startTimeInt = parseInt(startTime.replace(/\-+/g, ""));
					var endTimeInt = parseInt(endTime.replace(/\-+/g, ""));
					if(startTimeInt && startTimeInt > endTimeInt) {
						that.obj.innerText = startTime;
					}
				}
			}
			var calendarWrap = document.getElementById("calendarWrap");
			document.body.removeChild(calendarWrap);
		}
	}
	a.Calendar = Calendar;
});