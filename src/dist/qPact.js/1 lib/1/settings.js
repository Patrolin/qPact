G.LOCALE =
	navigator.userLanguage ||
	navigator.language ||
	navigator.browserLanguage ||
	navigator.systemLanguage ||
	'en-US';
G.UI_LOCALE = new Intl.NumberFormat().resolvedOptions().locale; // chromium is stupid
