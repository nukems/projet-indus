function website()
{

	var self = this;

	this.connectorId = null;

	/**
	 * Le div qui doit contenir les donnees affichees est "connectorData{connectorId}"
	 */
	this.init = function(connectorId, fields)
	{
		self.connectorId = connectorId;

		moment.lang('fr');
		var date = moment().add('days', 0);

		var html = '<div class="moduleHeader">' +
			'<h2>Website : ' + fields.displayName + '</h2>' +
			'<a target="_blank" href="' + fields.pageName + '">' + fields.pageName + '</a>' +
			'<div style="clear: right;"></div>' +
			'</div>' +
			'<div id="target-website-update">' + '</div>' +
			'<div id="target-website-page">' + '</div>' +
			'</div>'
		$('#connectorData' + connectorId).html(html);

		self.getWebsitePages(date, self.connectorId);
	}

	this.getWebsitePages = function(date, connectorId)
	{
		console.log(date);
		get(Ajax).send('user/competitors/modules/get', {"connector_id": self.connectorId,
				"moduleName"                                          : "website",
				"where"                                               : {
					type: {
						type     : "string",
						condition: {"$eq": "content"}
					},
					date: {
						type     : "date",
						condition: {"$lt": new Date(date)}
					}
				},
				"options"                                             : {"sort": {"date": -1}, "limit": 1}},
			function(data)
			{
				console.log(data);
				self.displayWebsitePages(date, data.data);
			});
	}

	this.displayWebsitePages = function(date, data)
	{
		var iframe = "<iframe src='" + data[0].info.url + "'></iframe>"
		$('#target-website-update').html(data[0].info.update_type);
		$('#target-website-page').html(iframe);
	}

}