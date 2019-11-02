class Clock {
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
this.define('q-clock', Clock);
