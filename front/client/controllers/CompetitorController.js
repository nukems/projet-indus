function Competitor() {

	var self = this;

	this.id = null;
	this.name;
	this.website;

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
						'<h1 id="competitorName">' + self.getName() + '</h1>' + 
						'<div id="competitorDashboard">' + 
							'Affichage du dashboard...' + 
						'</div>' + 
					'</div>';
		$('#dashboardContent').html(html);
	}

	/**
	*	EVENTS
	*/
	this.competitorEvents = function() {
		$('#deleteCompetitorButton').click(function() {
			if (confirm('Êtes-vous sûr de vouloir supprimer ce concurrent ?')) {
				self.deleteCompetitor();
			}
			return false;
		})
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
			self.displayCompetitor();
			self.competitorEvents();
		} else {
			alert('error');
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

}