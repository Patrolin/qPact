class Copy extends module.Component {
	onclick() {
		let self = this;
		self.focus();
		let prev = self.contentEditable;
		self.contentEditable = TRUE;
		document.execCommand('selectAll');
		self.contentEditable = prev;
		try {
			document.execCommand('copy');
		} catch (e) {
			navigator.clipboard.writeText(self.innerText);
		}
	}
}
module.defineElement('q-copy', Copy);
