//@todo: datetime
let WEEKDAYS = [
	'monday',
	'tuesday',
	'wednesday',
	'thursday',
	'friday',
	'saturday',
	'sunday',
];
let MONTHS = [
	'january',
	'february',
	'march',
	'april',
	'may',
	'june',
	'july',
	'august',
	'september',
	'october',
	'november',
	'december',
];
module.DateTime = class DateTime extends Date {
	constructor(str) {
		super();
		this.modify(str);
	}
	diff(datetime) {
		return {}; //
	}
	modify(str) {
		let s = 1;
		let n = 0;
		for (let [match, word, number, sign] of module.matchAll(
			/([a-z]+)|(\d+)|([+-])/g,
			str
		)) {
			if (word) {
				if (WEEKDAYS.includes(word)) {
					//
				} else if (MONTHS.includes(word)) {
					//
				} else {
					this[word] = s * n;
				}
			} else if (number) {
				n = +number;
			} else if (sign) {
				s = sign == '+' ? 1 : -1;
			}
		}
	}
	format(format) {
		return new Intl.DateTimeFormat(UNDEFINED, {
			weekday: 'long',
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric',
			timeZoneName: 'long',
			...format,
		}).format(this);
	}
};
module.TimeInterval = class {
	constructor(ms) {}
	toString() {
		let { positive, y, o, d, h, m, s } = this;
		let parts = {};
		if (y) parts['years'] = y;
		if (o) parts['months'] = o;
		if (d) parts['days'] = d;
		if (h) parts['hours'] = h;
		if (m) parts['minutes'] = m;
		if (s) parts['seconds'] = s;
		return `${positive ? '+' : '-'} ${module
			.items(parts)
			.map((k, v) => `${v}${k}`)
			.join(' ')}`;
	}
};
let UNITS = ['YEAR', 'MONTH', 'DAY', 'HOUR', 'MINUTE', 'SECOND'];
module.timeInterval = function(ms, format) {
	let unit;
	if (ms < 1000) {
		unit = 'SECOND';
	} else {
		let units = UNITS.map((unit) => {
			let x = Math.abs(ms) / module[unit];
			return x >= 1 ? Math.abs(x - Math.round(x)) : Infinity;
		});
		unit = UNITS[units.indexOf(Math.min(...units))];
	}
	return new Intl.RelativeTimeFormat(UNDEFINED, {
		numeric: 'auto',
		...format,
	}).format(Math.round(ms / module[unit]), unit.toLowerCase());
};
