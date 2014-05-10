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
						'<div id="competitorHeader">' +
							'<div id="competitorActions">' + 
								'<button id="addConnectorToCompetitorButton" class="transparent"><img src="front/client/design/pictures/bigAdd.png"/> Ajouter un connecteur</button> ' +
								'<button id="deleteCompetitorButton" class="transparent"><img src="front/client/design/pictures/bigDelete.png"/></button>' + 
							'</div>' +
							'<h1 id="competitorName">' + self.getName() + '</h1>';
		if (self.getWebsite() != null && self.getWebsite() != '') {
			var url = self.getWebsite();
			if (url.indexOf("http") != 0) {
				url = "http://" + url;
			}
			html += '<a target="_blank" href="' + url + '">' + self.getWebsite() + '</a>';
		}
		html +=				'<div style="clear: right;"></div>' +
						'</div>' + 
						'<div id="competitorDashboard">' + 
							self.displayConnectors() +
						'</div>' + 
					'</div>';
		$('#dashboardContent').html(html);
	}
	this.displayConnectors = function() {
		var html = '';
		if(self.getConnectors().length == 0) {
			html += '<div class="noConnector">Aucun connecteur</div>';
		} else {
			var connectors = self.getConnectors();
			for (var i = 0; i < connectors.length; i++) {
				html += '<div id="' + connectors[i]._id + '" class="connectorDisplay">' + 
							'<button class="deleteConnector transparent little" style="color: white;" id="deleteConnector' + connectors[i]._id + '" connector-id="' + connectors[i]._id + '"><img src="front/client/design/pictures/delete.png"/></button>' +
							self.displayConnector(connectors[i]._id, connectors[i].module_name, connectors[i].config_fields) +
						'</div>';
			}
		}
		return html;
	}
	this.displayConnectorMenu = function() {
		var html = '<h2>Connecteurs</h2>';
		var connectors = self.getConnectors();
		for (var i = 0; i < connectors.length; i++) {
			html += '<div connector-id="' + connectors[i]._id + '" class="goToConnector">' + 
						connectors[i].module_name.charAt(0).toUpperCase() + connectors[i].module_name.slice(1) + ' ' + connectors[i].config_fields.displayName + 
					'</div>';
		}
		$('#dashboardConnectorsList').html(html);
	}
	this.displayConnector = function(connectorId, moduleName, fields) {
		//charger le script d'affichage
		var fonction = "init";
		$.ajaxSetup({
			cache: true
		});
		$.getScript('modules/' + moduleName + '/display.js', function(data, textStatus, jqXHR) {
			var i = new window[moduleName]();
			i.init(connectorId, fields);
		});
  		return '<div id="connectorData' + connectorId + '">' + 
  					'<div class="connectorLoading">' + 
  						'Chargement des données et de l\'affichage du module...' +
  					'</div>'  +
  				'</div>';
	}

	/**
	*	EVENTS
	*/
	this.competitorEvents = function() {
		//supprimer un concurrent
		var anim = new Animations();
		anim.holdToDelete("deleteCompetitorButton", self.deleteCompetitor);
		//ajouter un connecteur a un concurrent
		$('#addConnectorToCompetitorButton').click(function() {
			get(Connector).initAdd();
		});

		//supprimer un connecteur a un concurrent
		for (var i = 0; i < self.connectors.length; i++) {
			var anim = new Animations();
			anim.holdToDelete('deleteConnector' + self.connectors[i]._id, function(id) {
				get(Connector).delete($('#' +id).attr('connector-id'));
				return false;
			});
		};
	}
	this.connectorMenuEvents = function() {
		$('.goToConnector').click(function() {
			var value = $('#' + $(this).attr('connector-id')).offset().top;
			$('html, body').animate({'scrollTop': value}, 200)
		});
	}

	/**
	*	REQUEST
	*/
	this.getCompetitor = function() {
		$('#dashboardContent').html('<div class="loadingDiv"><img src="front/client/design/pictures/loader.gif"/></div>');
		get(Ajax).send('user/competitor', {"id": self.getId()}, self.getCompetitorCallback);
	}
	this.getCompetitorCallback = function(data) {
		if (parseInt(data.error, 10) == 0) {
			self.setName(data.data.competitor.company_name);
			self.setWebsite(data.data.competitor.website_url);
			self.setConnectors(data.data.competitor.connectors);
			self.displayCompetitor();
			self.displayConnectorMenu();
			self.competitorEvents();
			self.connectorMenuEvents();
		} else {
			get(Animations).displayNotification(data.data);
		}
	}

	this.deleteCompetitor = function() {
		$('#dashboardContent').html(get(Animations).getLoaderDiv());
		get(Ajax).send('user/competitors/delete', {"id": self.getId()}, self.deleteCompetitorCallback);
	}
	this.deleteCompetitorCallback = function(data) {
		if(parseInt(data.error, 10) == 0) {
			$('.dashboardMenuItem[id="' + self.getId()  +'"]').remove();
			self.setId(null);
			get(Animations).displayNotification("Concurrent supprimé");
			get(DashboardController).displayBaseContent();
		} else {
			get(Animations).displayNotification(data.data);
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