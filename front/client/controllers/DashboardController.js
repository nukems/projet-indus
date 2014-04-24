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
								get(User).getFirstName() + ' ' + get(User).getName() + 
								'<br />' + 
								'<a href="#!" id="logOutButton" style="color: #eeeeee;">Déconnexion</a>' +
							'</div>' +
						'</div>' + 
						'<div id="dashboardTable">' + 
							'<div id="dashboardMenu">' + 
							'</div>' + 
							'<div id="dashboardContent">' + 
								'Commencez par choisir un concurrent dans le menu de gauche' +
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

	this.displayAddCompetitor = function() {
		var html = '<form method="post">' + 
						'<label for="competitorName">Nom du concurrent :</label><br />' +
						'<input type="text" name="competitorName" id="competitorName"/><br />' + 
						'<label for="competitorWebsite">Site web :</label><br />' + 
						'<input type="text" name="competitorWebsite id="competitorWebsite"/><br />' + 
						'<button id="addCompetitorButton">Ajouter</button> ' + 
						'<button id="cancelAddCompetitor">Annuler</button>' +
					'</form>';
		$('#addCompetitor').replaceWith(html);
	}

	/**
	*	EVENTS
	*/
	//evenements de base du dashboard
	this.eventsBase = function() {
		$('#logOutButton').off().click(function() {
			self.logOut();
		});
	}

	//evenements du menu
	this.eventsMenu = function() {
		$('#addCompetitor').off().click(function() {
			self.displayAddCompetitor();
			self.eventsAdd();
		});
		$('.dashboardMenuItem').off().click(function() {
			var id = $(this).attr("id");
			get(Competitor).init(id);
		});
	}

	//evenements d'ajouts
	this.eventsAdd = function() {
		$('#addCompetitorButton').off().click(function() {
			self.addCompetitor();
			return false;
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
		get(Ajax).sendOne('user/competitors/', null, self.getCompetitorsCallback);
	}
	this.getCompetitorsCallback = function(data) {
		self.displayCompetitorsList(data.data.competitors);
		self.eventsMenu();
	}

	this.addCompetitor = function() {
		var data = {
			"companyName": $('#competitorName').val(),
			"websiteUrl": $('#competitorWebsite').val()
		};
		get(Ajax).sendOne('user/competitors/add', data, self.addCompetitorCallback);
	}
	this.addCompetitorCallback = function(data) {
		if(parseInt(data.error, 10) == 0) {
			self.getCompetitors();
		} else {
			alert(data.data);
		}
	}

}