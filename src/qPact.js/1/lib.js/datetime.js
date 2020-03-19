//@todo: datetime
module.Datetime = class Datetime extends Date {
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
		if (module.isNumber(input)) super(input);
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
		// TODO: format Datetime
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

	modify(input) {
		if (module.isNumber(input)) input = `${input}ms`;
		if (!input) return;
		datetime_modify(this, input);
		return this;
	}
};

let stuffs = [
	1,
	'ms',
	module.SECOND,
	's',
	module.MINUTE,
	'm',
	module.HOUR,
	'h',
	module.DAY,
	'd',
	module.MONTH,
	'o',
	module.YEAR,
];
module.TimeInterval = class {
	constructor(a) {
		let self = this;
		self.sign = 1;
		self.ms = self.s = self.m = self.h = self.d = self.o = self.y = 0;
		self.modify(a);
	}
	valueOf() {
		let { y, o, d, h, m, s, ms, sign } = this;
		return (
			sign *
			(y * module.YEAR +
				o * module.MONTH +
				d * module.DAY +
				h * module.HOUR +
				m * module.MINUTE +
				s * module.SECOND +
				ms)
		);
	}
	toString() {
		// format TimeInterval
		return 'string!';
	}

	modify(input) {
		if (module.isNumber(input)) input = `${input}ms`;
		if (!input) return;
		let self = this;
		datetime_modify(self, input);
		let time = +self;
		time *= self.sign = Math.sign(time);
		for (let i = 0; i < 11; i += 2) {
			let t = time % stuffs[i + 2];
			time -= t;
			self[stuffs[i + 1]] = t / stuffs[i];
		}
		self.y = time;
		return self;
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
		/([\d.]+)([a-z]+)|([a-z]+)([\d.]+)|([+-])/g
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
