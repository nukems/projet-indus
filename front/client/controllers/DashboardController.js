function DashboardController() {

	var self = this;

	this.init = function(competitorId) {
		self.displayBase();
		self.eventsBase(competitorId);
		self.getCompetitors();
	}

	/**
	*	AFFICHAGE
	*/
	//affichage de la structure du dashboard
	this.displayBase = function() {
		var html = '<div id="dashboardMain">' + 
						'<div id="dashboardTable">' + 
							'<div id="dashboardMenu">' + 
								'<div id="dashboardMenuHeader">' +
									'<img src="front/client/design/pictures/default.jpg" id="userAvatar"/>' + 
									'<div id="dashboardMenuHeaderName">' + 
										get(User).getFirstName() + ' ' + get(User).getName() + 
										'<br />' + 
										'<a href="#!" id="logOutButton"">Déconnexion</a>' +
									'</div>' +
									'<div style="clear: left;"></div>' +
								'</div>' +
								'<div id="dashboardMenuContent">' + 
								'</div>' +
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
		html += '<button id="addCompetitor" class="green">Ajouter un concurrent</button>';
		$('#dashboardMenuContent').html(html);
	}

	this.displayAddCompetitor = function() {
		var html = '<form method="post" id="addCompetitorForm">' + 
						'<label for="addCompetitorName">Nom du concurrent :</label>' +
						'<input type="text" name="addCompetitorName" id="addCompetitorName"/><br />' + 
						'<label for="addCompetitorWebsite" style="padding-top: 3px;">Site web (optionnel) :</label>' + 
						'<input type="text" name="addCompetitorWebsite" id="addCompetitorWebsite" value="http://"/><br />' + 
						'<button id="addCompetitorButton" class="green">Ajouter</button> ' + 
						' ou <a href="#" id="cancelAddCompetitor">Annuler</a>' +
					'</form>';
		$('#addCompetitor').replaceWith(html);
	}

	/**
	*	EVENTS
	*/
	//evenements de base du dashboard
	this.eventsBase = function(competitorId) {
		$('#logOutButton').off().click(function() {
			self.logOut();
			return false;
		});
		if (competitorId != null) {
			get(Competitor).init(competitorId);
		}
	}

	//evenements du menu
	this.eventsMenu = function() {
		$('#addCompetitor').off().click(function() {
			self.displayAddCompetitor();
			self.eventsAdd();
		});
		$('.dashboardMenuItem').off().click(function() {
			var id = $(this).attr("id");
			get(Routes).goTo('#!/dashboard/' + id);
			get(Competitor).init(id);
		});
	}

	//evenements d'ajouts
	this.eventsAdd = function() {
		$('#addCompetitorButton').off().click(function() {
			self.addCompetitor();
			return false;
		});
		$('#cancelAddCompetitor').off().click(function() {
			$('#addCompetitorForm').replaceWith('<button id="addCompetitor" class="green">Ajouter un concurrent</button>');
			self.eventsMenu();
			return false;
		});
	}

	/**
	*	REQUESTS
	*/
	this.logOut = function() {
		get(Ajax).sendOne('user/log-out', null, self.logOutCallback);
	}
	this.logOutCallback = function(data) {
		get(User).setToken(null);
		get(Cookie).delete('autologin');
		get(Routes).goTo('#!');
	}

	this.getCompetitors = function() {
		get(Ajax).sendOne('user/competitors/', null, self.getCompetitorsCallback);
	}
	this.getCompetitorsCallback = function(data) {
		if (parseInt(data.error, 10) == 0) {
			self.displayCompetitorsList(data.data.competitors);
			self.eventsMenu();
		} else {
			alert(data.data);
		}
	}

	this.addCompetitor = function() {
		var data = {
			"companyName": $('#addCompetitorName').val(),
			"websiteUrl": $('#addCompetitorWebsite').val()
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