class Clock {
	load() {
		this.q(new Date());
	}
}
define('q-clock', Clock);
