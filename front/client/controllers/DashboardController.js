function DashboardController() {

	var self = this;

	this.init = function() {
		self.displayBase();
		self.eventsBase();
		self.getCompetitors();
	}

	/**
	*	AFFICHAGE
	*/
	//affichage de la structure du dashboard
	this.displayBase = function() {
		var html = '<div id="dashboardMain">' + 
						'<div id="dashboardHeader">' + 
							'<div id="dashboardHeaderUser">' + 
								get(User).getName() + ' ' + get(User).getFirstName() + 
								'<br />' + 
								'<a href="#!" id="logOutButton">Déconnexion</a>' +
							'</div>' +
						'</div>' + 
						'<div id="dashboardTable">' + 
							'<div id="dashboardMenu">' + 
							'</div>' + 
							'<div id="dashboardContent">' + 
								'Chargement...' +
							'</div>' + 
						'</div>' +
					'</div>';
		$('#content').html(html);
	}

	//Affichage la liste des concurrents pour un utilisateur
	this.displayCompetitorsList = function(list) {
		var html = '';
		for(var i = 0; i < list.length; i++) {
			html += '<div class="dashboardMenuItem" id="' + list[i]._id + '">' + 
						list[i].company_name + 
					'</div>';
		}
		html += '<button id="addCompetitor">Ajouter un concurrent</button>';
		$('#dashboardMenu').html(html);
	}

	/**
	*	EVENTS
	*/
	//evenements de base du dashboard
	this.eventsBase = function() {
		$('#logOutButton').click(function() {
			self.logOut();
		});
	}

	/**
	*	REQUESTS
	*/
	this.logOut = function() {
		get(Ajax).send('user/log-out', null, self.logOutCallback);
		return false;
	}
	this.logOutCallback = function(data) {
		get(User).setToken(null);
		get(Routes).goTo('#!');
	}

	this.getCompetitors = function() {
		get(Ajax).send('user/competitors/', null, function(data) {
			self.displayCompetitorsList(data.data.competitors);
		});
	}

}