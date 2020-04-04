// @todo: datetime
export class Datetime extends Date {
	get y() {
		return this.getFullYear();
	}
	set y(n) {
		this.setFullYear(n);
	}
	get o() {
		return this.getMonth();
	}
	set o(n) {
		this.setMonth(n);
	}
	get d() {
		return this.getDate();
	}
	set d(n) {
		this.setDate(n);
	}
	get h() {
		return this.getHours();
	}
	set h(n) {
		this.setHours(n);
	}
	get m() {
		return this.getMinutes();
	}
	set m(n) {
		this.setMinutes(n);
	}
	get s() {
		return this.getSeconds();
	}
	set s(n) {
		this.setSeconds(n);
	}
	get ms() {
		return this.getMilliseconds();
	}
	set ms(n) {
		this.setMilliseconds(n);
	}

	constructor(input) {
		if (isInstance(input, Number)) super(input);
		else {
			super();
			this.modify(input);
		}
	}
	[Symbol.toPrimitive](hint) {
		if (hint === 'string') return this.toString();
		else return this.valueOf();
	}
	valueOf() {
		return this.getTime();
	}
	toString() {
		// @todo: format Datetime
		return new Intl.DateTimeFormat(LOCALE, {
			weekday: 'long',
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric',
			timeZoneName: 'long',
			...obj,
		}).format(this);
	}

	modify(input) {
		if (isInstance(input, Number)) input = `${input}ms`;
		if (!input) return;
		datetime_modify(this, input);
		return this;
	}
}
var stuffs = [1, 'ms', SECOND, 's', MINUTE, 'm', HOUR, 'h', DAY, 'd', MONTH, 'o', YEAR];
export class TimeInterval {
	constructor(a) {
		var self = this;
		self.sign = 1;
		self.ms = self.s = self.m = self.h = self.d = self.o = self.y = 0;
		self.modify(a);
	}
	valueOf() {
		var { y, o, d, h, m, s, ms, sign } = this;
		return sign * (y * YEAR + o * MONTH + d * DAY + h * HOUR + m * MINUTE + s * SECOND + ms);
	}
	toString() {
		// format TimeInterval
		return 'string!';
	}

	modify(input) {
		if (isInstance(input, Number)) input = `${input}ms`;
		if (!input) return;
		var self = this;
		datetime_modify(self, input);
		var time = +self;
		time *= self.sign = Math.sign(time);
		for (var i = 0; i < 11; i += 2) {
			var t = time % stuffs[i + 2];
			time -= t;
			self[stuffs[i + 1]] = t / stuffs[i];
		}
		self.y = time;
		return self;
	}
}
var WEEKDAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
function datetime_modify(self, string) {
	var sign = 1;
	for (var [match, r, runit, aunit, a, s] of string.matchAll(
		/([\d.]+)([a-z]+)|([a-z]+)([\d.]+)|([+-])/g
	)) {
		if (r) {
			var i = WEEKDAYS.indexOf(runit);
			if (i < 0 && runit in self) {
				self[runit] += sign * r;
			} else {
				var date = self.getDate();
				var day = self.getDay();
				if (i != day) {
					date += sign > 0 ? i - day + 7 : i + day - 8;
					r--;
				}
				self.setDate(date + sign * 7 * r);
			}
		} else if (a && aunit in self) {
			self[aunit] = +a;
		} else if (s) {
			sign = s == '+' ? 1 : -1;
		}
	}
}
