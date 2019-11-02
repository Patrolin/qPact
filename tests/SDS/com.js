var URL = ['shared.txt', { method: 'GET' }]; // https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters

async function fetchTxt() {
	return await fetch(...URL);
}
async function fetchJson() {
	return await fetchTxt().then(async (response) => {
		return parseTxt(await response.text());
	});
}
function parseTxt(text) {
	var json = {};
	for (var match of text.matchAll(/([^|]+)\|([^|]+)\|/g)) {
		var [key, value] = match.slice(1);
		if (key.match(/^F|^U|^S/)) {
			value = +value;
		}
		json[key] = value;
	}
	return { ...json, et: +json.et, ut: +json.ut };
}

async function postJson(json) {
	const url = `sv?${Object.entries(json)
		.map(([key, value]) => `${key}=${value}`)
		.join('&')}`;
	return new Promise(async (resolve, reject) => {
		await fetch(url)
			.then(() => {
				resolve(); // no error -> also success?
			})
			.catch(() => {
				resolve(); // server error -> success
			});
	});
}
