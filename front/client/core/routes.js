function Routes() {

	var self = this;
	this.isNormalEvent = 0; //vaut 0 si evenement declenche depuis les fleches precedent/suivant du navigateur

	/**
	*	Initialisation de la navigation
	*/
	this.init = function() {
		self.events();
		//self.go(document.location.hash);
	}

	/**
	*	Gestion des evenements de navigation
	*/
	this.events = function() {
		//clic sur un lien normal
		$('.link').live('click', function() {
			self.goTo($(this).attr('href'));
			return false;
		});

		//boutons precedent/suivant du navigateur
		window.onpopstate = function(event) {
			self.popstate(document.location.hash);
		};

		isIE11 = !!window.MSStream;
		if(navigator.appName.indexOf("Internet Explorer") != -1 || isIE11) {
			window.onhashchange = function() {
				self.popstate(document.location.hash);
			};
		}
	}

	/**
	*	Boutons precedent/suivant
	*/
	this.popstate = function(uri) {
		if (self.isNormalEvent == 1) { //si clic normal, on ignore
			self.isNormalEvent = 0;
		} else { //sinon, on traite
			self.go(uri);
		}
	}

	/**
	*	Changer de page sans cliquer sur un lien
	*/
	this.goTo = function(uri) {
		self.isNormalEvent = 1;
		$.History.go(uri);
		self.go(uri);
	}

	/**
	*	Changer l'url de la page sans modifier la page affichee
	*/
	this.changeUrl = function(uri) {
		$.History.go(uri);
	}

	/**
	*	Modification de la page courante
	*/
	this.go = function(uri) {
		var args = uri.split('/');
		if (!get(User).isLogged()) { //pas connecte
			if(args.length > 1 && args[1] == 'inscription') {
				get(UserController).signIn();
			} else {
				get(UserController).logIn();
			}
		} else { //connecte
			if (args.length == 1 || args[1] == 'dashboard') { //dashboard
				if(get(DashboardController).isInitiated()) { //dashboard deja affiche
					self.goToCompetitor(args);
				} else { //sinon, on affiche le dashboard avant tout
					get(DashboardController).init(function() {
						self.goToCompetitor(args);
					});
				}
			}
		}
	}

	this.goToCompetitor = function(args) {
		if (args[2]) {
			competitorId = parseInt(args[2], 10);
			get(Competitor).init(competitorId);
		}
		
	}
}