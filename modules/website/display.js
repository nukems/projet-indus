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

		var html = '<div class="moduleHeader">' +
						'<h2>Page d\'accueil ' + fields.displayName + '</h2>' +
						'<a target="_blank" href="' + fields.pageName + '">' + fields.pageName + '</a>' +
						'<div style="clear: right;"></div>' +
					'</div>' +
					'<div class="websiteModule">' + 
						'<div class="websiteUpdate" id="websiteUpdate' + self.connectorId + '">' + '</div>' +
						'<div id="websitePage' + self.connectorId + '">' + '</div>' +
					'</div>';
		$('#connectorData' + connectorId).html(html);

		self.getWebsitePages(self.connectorId);
	}

	this.getWebsitePages = function(connectorId)
	{
		get(Ajax).send('user/competitors/modules/get', {"connector_id": self.connectorId,
														"moduleName": "website",
														"where": {
					type: {
						type     : "string",
						condition: {"$eq": "content"}
					}
				},
				"options"                                             : {"sort": {"date": -1}, "limit": 1}},
			function(data)
			{
				self.displayWebsitePages(data.data);
			});
	}

	this.displayWebsitePages = function(data)
	{
		if (data.length == 0) {
			$('#websiteUpdate' + self.connectorId).html('<div style="padding: 60px; color: #cccccc; text-align: center; font-size: 20px;">Aucune donnée disponible</div>');
		} else {
			var html = '';
			var iframe = "<iframe class='websiteIframe' src='" + data[0].info.url + "'></iframe>";

			if (data[0].notification == 1) {
				html += '<div class="websiteNotification"><img src="front/client/design/pictures/bell.png"/> Nouvelle mise à jour</div>';
				$('#goToConnector' + self.connectorId + ' .notificationItem').html(1).show();
			}
			html += "Dernier changement : <span style='font-weight: bold;'>" + data[0].info.update_type + "</span> le " + moment(data[0].date).format('DD/MM/YYYY [à] HH:mm');
		
			$('#websiteUpdate' + self.connectorId).html(html);
			$('#websitePage' + self.connectorId).html(iframe);
		}
	}

}