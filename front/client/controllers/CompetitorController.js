function Competitor() {

	var self = this;

	this.id = null;
	this.name;
	this.website;
	this.connectors;

	this.init = function(id) {
		self.setId(id);
		self.getCompetitor();
	}

	/**
	*	DISPLAY
	*/
	this.displayCompetitor = function() {
		var html = '<div>' + 
						'<div id="competitorActions">' + 
							'<button id="addConnectorToCompetitorButton">Ajouter un connecteur</button> ' +
							'<button id="deleteCompetitorButton">Supprimer</button>' + 
						'</div>' +
						'<h1 id="competitorName">' + self.getName() + '</h1>';
		if (self.getWebsite() != null) {
			html += '<a href="' + self.getWebsite() + '">' + self.getWebsite() + '</a>';
		}
		html += '<br /><br />';
		html +=			'<div id="competitorDashboard">' + 
							self.displayConnectors() +
						'</div>' + 
					'</div>';
		$('#dashboardContent').html(html);
	}
	this.displayConnectors = function() {
		var html = '';
		var connectors = self.getConnectors();
		for (var i = 0; i < connectors.length; i++) {
			html += '<div id="' + connectors[i]._id + '" class="connectorDisplay">' + 
						'<button class="deleteConnector green" id="' + connectors[i]._id + '">Supprimer</button>' +
						'<h2>Module ' + connectors[i].module_name + '</h2>' + 
						JSON.stringify(connectors[i].config_fields) + 
					'</div>';
		}
		return html;
	}

	/**
	*	EVENTS
	*/
	this.competitorEvents = function() {
		//supprimer un concurrent
		$('#deleteCompetitorButton').click(function() {
			if (confirm('Êtes-vous sûr de vouloir supprimer ce concurrent ?')) {
				self.deleteCompetitor();
			}
			return false;
		});
		//ajouter un connecteur a un concurrent
		$('#addConnectorToCompetitorButton').click(function() {
			get(Connector).initAdd();
		});

		//supprimer un connecteur a un concurrent
		$('.deleteConnector').click(function() {
			get(Connector).delete($(this).attr('id'));
			return false;
		});
	}

	/**
	*	REQUEST
	*/
	this.getCompetitor = function() {
		get(Ajax).send('user/competitor', {"id": self.getId()}, self.getCompetitorCallback);
	}
	this.getCompetitorCallback = function(data) {
		if (parseInt(data.error, 10) == 0) {
			self.setName(data.data.competitor.company_name);
			self.setWebsite(data.data.competitor.website_url);
			self.setConnectors(data.data.competitor.connectors);
			self.displayCompetitor();
			self.competitorEvents();
		} else {
			alert(data.data);
		}
	}

	this.deleteCompetitor = function() {
		get(Ajax).send('user/competitors/delete', {"id": self.getId()}, self.deleteCompetitorCallback);
	}
	this.deleteCompetitorCallback = function(data) {
		if(parseInt(data.error, 10) == 0) {
			$('.dashboardMenuItem[id="' + self.getId()  +'"]').remove();
			self.setId(null);
			$('#dashboardContent').html("Concurrent supprimé");
		} else {
			alert(data.data);
		}
	}

	/**
	*	GETTERS et SETTERS
	*/
	this.getId = function() {
		return this.id;
	}
	this.setId = function(id) {
		this.id = id;
	}

	this.getName = function() {
		return this.name;
	}
	this.setName = function(name) {
		this.name = name;
	}

	this.getWebsite = function() {
		return this.website;
	}
	this.setWebsite = function(website) {
		this.website = website;
	}

	this.getConnectors = function() {
		return this.connectors;
	}
	this.setConnectors = function(connectors) {
		this.connectors = connectors;
	}

}