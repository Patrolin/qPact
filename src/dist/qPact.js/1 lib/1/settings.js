// note: this requires not being in strict mode ('use strict';)
LOCALE =
	navigator.userLanguage ||
	navigator.language ||
	navigator.browserLanguage ||
	navigator.systemLanguage ||
	'en-US';
UI_LOCALE = new Intl.NumberFormat().resolvedOptions().locale; // chrome is stupid
