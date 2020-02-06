//@todo: datetime
module.Datetime = class DateTime extends Date {
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
	constructor(string = '') {
		super();
		this.modify(string);
	}
	modify(string = '') {
		datetime_modify(this, string);
	}
	format(obj) {
		return new Intl.DateTimeFormat(UNDEFINED, {
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
};
module.TimeInterval = class {
	constructor(a) {
		let self = this;
		self.y = self.o = self.d = self.h = self.m = self.s = self.ms = 0;
		// int
		if (a) self.modify(a);
	}
	valueOf() {
		let { y, o, d, h, m, s, ms } = this;
		return (
			y * module.YEAR +
			o * module.MONTH +
			d * module.DAY +
			h * module.HOUR +
			m * module.MINUTE +
			s * module.SECOND +
			ms
		);
	}
	modify(string = '') {
		let self = this;
		datetime_modify(self, string);
		let time = +self;
		time *= self.sign = Math.sign(time);
		time -= self.ms = time % module.SECOND;
		time -= self.s = time % module.MINUTE;
		time -= self.m = time % module.HOUR;
		time -= self.h = time % module.DAY;
		time -= self.d = time % module.MONTH;
		time -= self.o = time % module.YEAR;
		self.y = time;
		self.s /= module.SECOND;
		self.m /= module.MINUTE;
		self.h /= module.HOUR;
		self.d /= module.DAY;
		self.o /= module.MONTH;
		self.y /= module.YEAR;
	}
	toString() {
		let { y, o, d, h, m, s, ms, sign } = this;
		let parts = {};
		if (y) parts['years'] = y;
		if (o) parts['months'] = o;
		if (d) parts['days'] = d;
		if (h) parts['hours'] = h;
		if (m) parts['minutes'] = m;
		if (s) parts['seconds'] = s;
		if (ms) parts['milliseconds'] = ms;
		return `${['', '-', '+'][sign + 1]}${module
			.items(parts)
			.map(([k, v]) => `${v}${v > 1 ? k : k.slice(0, -1)}`)
			.join(' ')}`;
	}
};
let WEEKDAYS = [
	'sunday',
	'monday',
	'tuesday',
	'wednesday',
	'thursday',
	'friday',
	'saturday',
];
function datetime_modify(self, string) {
	let sign = 1;
	for (let [match, r, runit, aunit, a, s] of string.matchAll(
		/(\d+)([a-z]+)|([a-z]+)(\d+)|([+-])/g
	)) {
		if (r) {
			let i = WEEKDAYS.indexOf(runit);
			if (i < 0 && runit in self) {
				self[runit] += sign * r;
			} else {
				let date = self.getDate();
				let day = self.getDay();
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
