function website() {

	var self = this;

	this.connectorId = null;

	/**
	* Le div qui doit contenir les donnees affichees est "connectorData{connectorId}"
	*/
	this.init = function(connectorId, fields) {
		self.connectorId = connectorId;

		moment.lang('fr');
		var date = moment().add('days', 0);

		var html = '<div class="moduleHeader">' +
			'<h2>Website : ' + fields.pageName + '</h2>' +
			'<div style="clear: right;"></div>' +
			'</div>' +
			'<div id="target-website-new">' + '</div>'+
			'<div id="target-website-old">' + '</div>'+
			'</div>'
		$('#connectorData' + connectorId).html(html);

		self.getWebsitePages(date, self.connectorId);
	}

	this.getWebsitePages = function(date, connectorId){
		console.log(date);
		get(Ajax).send('user/competitors/modules/get', {"connector_id": self.connectorId,
				"moduleName": "website",
				"where": {
					type: {
						type: "string",
						condition: {"$eq": "content"}
					},
					date: {
						type: "date",
						condition: {"$lt": new Date(date)}
					}
				},
				"options": {"sort": {"date": 1}, "limit": 2}},
			function(data) {
				self.displayWebsitePages(date, data.data);
			});
	}

	this.displayWebsitePages = function(date, data) {
		$('#target-website-new').html(data[1].info.page);
	}

	this.getLikesAndShares = function(dateBefore, dateEnd, connectorId) {
		get(Ajax).send('user/competitors/modules/get', {"connector_id": self.connectorId,
				"moduleName": "facebook",
				"where": {
					type: {
						type: "string",
						condition: {"$eq": "info_page"}
					},
					date: {
						type: "date",
						condition: {"$gt": new Date(dateBefore), "$lt": new Date(dateEnd)}
					}
				},
				"options": {"sort": {"date": 1}}},
			function(data) {
				self.displayLikesAndShares(dateBefore, dateEnd, data.data);
			});
	}
}