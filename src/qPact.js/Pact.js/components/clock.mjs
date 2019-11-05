class Clock {
	get foo() {
		return this.foo;
	}
	set foo(v) {
		this.foo = future_bool(v);
	}
	load() {
		this.interval = setInterval(() => {
			this.render();
		}, 1000);
		this.render();
	}
	unload() {
		clearInterval(this.interval);
	}
	render() {
		this.Q(new Date());
	}
}
this.defineElement('q-clock', Clock);
