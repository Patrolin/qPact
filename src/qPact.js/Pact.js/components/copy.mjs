class Copy {
	onclick() {
		this.focus();
		let prev = this.contentEditable;
		this.contentEditable = true;
		document.execCommand('selectAll');
		this.contentEditable = prev;
		try {
			document.execCommand('copy');
		} catch (e) {
			navigator.clipboard.writeText(this.innerText);
		}
	}
}
this.defineElement('q-copy', Copy);
