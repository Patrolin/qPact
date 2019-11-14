class Clock extends module.Component {
	load() {
		let self = this;
		self.interval = setInterval(() => {
			self.render();
		}, 1000);
		self.render();
	}
	unload() {
		clearInterval(this.interval);
	}
	render() {
		this.Q(new Date());
	}
}
module.defineElement('q-clock', Clock);
