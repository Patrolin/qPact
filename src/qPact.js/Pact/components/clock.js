class Clock extends module.Component {
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
module.defineElement('q-clock', Clock);
