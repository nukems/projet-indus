//TODO: rename 'module' to your module name
function module() {

	var self = this;

	this.connectorId = null;

	this.init = function(connectorId, fields) {
		self.connectorId = connectorId;

		var html = '<div class="moduleHeader" style="background-color: #3b5998;">' +
						'<h2>Module ' + fields.displayName + '</h2>' +
					'</div>';
		$('#connectorData' + connectorId).html(html);

	}
}