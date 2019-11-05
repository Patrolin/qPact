class Copy {
	onclick() {
		this.focus();
		let prev = this.contentEditable;
		this.contentEditable = true;
		document.execCommand('selectAll');
		this.contentEditable = prev;
		document.execCommand('copy');
	}
}
this.defineElement('q-copy', Copy);
