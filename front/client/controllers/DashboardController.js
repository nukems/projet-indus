function DashboardController() {

	var self = this;

	this.isInitiatedValue = 0;
	this.notificationsTimeout;

	this.init = function(callback) {
		self.displayBase();
		self.displayBaseContent();
		self.eventsBase();
		self.initiate();
		callback();
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
									'<div class="loadingDiv"><img src="front/client/design/pictures/loader.gif"/></div>' +
								'</div>' +
							'</div>' + 
							'<div id="dashboardResponsive"><img src="front/client/design/pictures/responsive.png"/></div>' +
							'<div id="dashboardContent">' + 
								
							'</div>' + 
						'</div>' +
					'</div>';
		$('#content').html(html);
	}
	this.displayBaseContent = function() {
		var html = '<div id="emptyDashboard">Commencez par choisir un concurrent dans le menu de gauche</div>';
		$('#dashboardContent').html(html);
	}

	//Affichage la liste des concurrents pour un utilisateur
	this.displayCompetitorsList = function(list) {
		var html =  '<button class="transparent" id="addCompetitor"><img src="front/client/design/pictures/add.png"/></button>' + 
					'<h2>Concurrents</h2>';
		for(var i = 0; i < list.length; i++) {
			html += '<div class="dashboardMenuItem" id="' + list[i]._id + '">' + 
						'<img src="front/client/design/pictures/bell.png" title="Pas de nouvelles données" class="bell"/> ' + 
						list[i].company_name + 
					'</div>';
		}
		html += '<div id="dashboardConnectorsList"></div>';
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
	this.eventsBase = function() {
		$('#logOutButton').off().click(function() {
			self.destroy();
			self.logOut();
			return false;
		});
		$('#dashboardResponsive').off().click(function() {
			if ($('#dashboardMenu').is(':visible')) {
				$('#dashboardMenu').removeClass("responsiveMenu");
			} else {
				$('#dashboardMenu').addClass('responsiveMenu');
			}
		});
		self.getNotifications();
	}

	//evenements du menu
	this.eventsMenu = function() {
		$('#addCompetitor').off().click(function() {
			self.displayAddCompetitor();
			self.eventsAdd();
		});
		$('.dashboardMenuItem').off().click(function() {
			var id = $(this).attr("id");
			$(this).children('img').attr('src', 'front/client/design/pictures/bell.png');
			get(Routes).goTo('#!/dashboard/' + id);
		});
		$(window).scroll(function() {
			if ($('#dashboardConnectorsList').offset().top - $(window).scrollTop() < 0) {
				$('#dashboardConnectorsList').css({'position': 'fixed', 'top': 0});
			} else if ($('#dashboardMenuContent').offset().top + $('#dashboardMenuContent').outerHeight() - $(window).scrollTop() > 0) {
				$('#dashboardConnectorsList').css('position', 'static');
			}
		});
		
	}

	//evenements d'ajouts
	this.eventsAdd = function() {
		$('#addCompetitorButton').off().click(function() {
			self.addCompetitor();
			return false;
		});
		$('#cancelAddCompetitor').off().click(function() {
			$('#addCompetitorForm').replaceWith('<button class="transparent" id="addCompetitor"><img src="front/client/design/pictures/add.png"/></button>');
			self.eventsMenu();
			return false;
		});
	}

	/**
	*	REQUESTS
	*/
	this.logOut = function() {
		clearTimeout(self.notificationsTimeout);
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
			get(Animations).displayNotification(data.data);
		}
	}

	this.addCompetitor = function() {
		$('#addCompetitorButton, #cancelAddCompetitor').attr("disabled", "disabled");
		var data = {
			"companyName": $('#addCompetitorName').val(),
			"websiteUrl": $('#addCompetitorWebsite').val()
		};
		get(Ajax).sendOne('user/competitors/add', data, self.addCompetitorCallback);
	}

	this.addCompetitorCallback = function(data) {
		$('#addCompetitorButton, #cancelAddCompetitor').removeAttr('disabled');
		if(parseInt(data.error, 10) == 0) {
			get(Animations).displayNotification("Concurrent ajouté");
			self.getCompetitors();
			get(Competitor).init(data.data.id);
		} else {
			get(Animations).displayNotification(data.data);
		}
	}

	//recuperation des notifications toutes les 30 secondes
	this.getNotifications = function() {
		get(Ajax).send('user/notifications', null, self.getNotificationsCallback);
	}
	this.getNotificationsCallback = function(data) {
		$('.dashboardMenuItem > img').attr('src', "front/client/design/pictures/bell.png");
		for(var key in data.data.notifications) {
			console.log(key);
			$('.dashboardMenuItem[id="' + key + '"] > img').attr('src', 'front/client/design/pictures/activeBell.png');
		}
		self.notificationsTimeout = setTimeout(self.getNotifications, 30000);
	}

	/**
	*	GETTERS et SETTERS
	*/
	this.isInitiated = function() {
		return this.isInitiatedValue == 1;
	}
	this.initiate = function() {
		this.isInitiatedValue = 1;
	}
	this.destroy = function() {
		this.isInitiatedValue = 0;
	}

}