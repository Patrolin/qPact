class Copy {
	onclick() {
		this.focus();
		let prev = this.contentEditable;
		this.contentEditable = TRUE;
		document.execCommand('selectAll');
		this.contentEditable = prev;
		try {
			document.execCommand('copy');
		} catch (e) {
			navigator.clipboard.writeText(this.innerText);
		}
	}
}
try {
	module.defineElement('q-copy', Copy);
} finally {
}
