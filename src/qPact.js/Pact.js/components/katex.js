class Katex {
	load() {
		if (typeof katex == '' + UNDEFINED)
			throw 'katex not found (get it at https://katex.org/)';
	}
	get value() {
		return this.state.value;
	}
	set value(v) {
		katex.render((this.state.value = module.str(v)), this, {
			displayMode: TRUE,
		});
	}
}
module.defineElement('q-katex', Katex);
