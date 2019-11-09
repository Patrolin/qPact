class Katex extends module.Component {
	// @todo: no race conditions
	init() {
		if (global.katex === UNDEFINED) {
			return new Promise(function(resolve, reject) {
				let head = module.q(/head/);
				head.q(
					`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.css" integrity="sha384-zB1R0rpPzHqg7Kpt0Aljp8JPLqbXI3bhnPWROx27a9N0Ll6ZP/+DiW/UqRcLbRjq" crossorigin="anonymous">`
				);
				let script = document.createElement('script');
				Object.assign(script, {
					src:
						'https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.js',
					integrity:
						'sha384-y23I5Q6l+B6vatafAwxRu/0oK/79VlbSz7Q9aiSZUvyWYIYsd+qj+o24G5ZU2zJz',
					crossOrigin: 'anonymous',
				});
				script.onload = resolve;
				script.onerror = reject;
				head.q(script);
			});
		}
	}
	set value(v) {
		v = module.str(v);
		this.setAttribute('value', v);
		katex.render((this.state.value = v), this, {
			displayMode: TRUE,
		});
	}
}
module.defineElement('q-katex', Katex);
