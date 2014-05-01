function Animations() {

	var self = this;
	this.i = 3;
	this.callback = null;
	this.text;
	this.id
	this.interval;

	this.holdToDelete = function(id, callback) {
		this.id = id;
		var elem = $('#' + id);
		this.text = elem.html();
		self.callback = callback;

		elem.off().mousedown(function() {
			$('#' + self.id).html("Presser " + self.i + "s.");
			self.i--;
			self.interval = setInterval(function() {
				if (self.i > 0) {
					$('#' + self.id).html("Presser " + self.i + "s.");
					self.i--;
				} else {
					clearInterval(self.interval);
					callback(self.id);
				}
			}, 1000);
		});

		elem.mouseup(function() {
			clearInterval(self.interval);
			self.i = 3;
			$('#' + self.id).html(self.text);
		});
	}

}