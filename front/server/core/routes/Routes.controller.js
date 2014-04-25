function Core_Routes_Routes() {

	//url courante de la page
	this.url;

	//routes definies pour le front
	this.routes = {
		'user': {
			'log-in': { //connexion de l'utilisateur
				'controller': 'Controllers_UserController',
				'function': 'logIn'
			},
			'auto-log-in': { //connexion automatique au chargement de la page
				'controller': 'Controllers_UserController',
				'function' : 'autoLogIn'
			},
			'log-out': { //deconnexion d'un utilisateur
				'controller': 'Controllers_UserController',
				'function' : 'logOut'
			},
			'sign-in': { //inscription d'un utilisateur
				'controller': 'Controllers_UserController',
				'function' : 'signIn'
			},
			'competitor': { //affichage du dashboard pour un concurrent
				'controller': 'Controllers_CompetitorController',
				'function' : 'getCompetitorDashboard'
			},
			'competitors': {
				'': { //recuperation de la liste des concurrents
					'controller': 'Controllers_CompetitorsController',
					'function' : 'getList'
				},
				'add': { //ajoute d'un concurrent
					'controller': 'Controllers_CompetitorsController',
					'function' : 'add'
				},
				'update':  { //mise a jour d'un concurrent
					'controller': 'Controllers_CompetitorsController',
					'function' : 'update'
				},
				'delete': { //suppression d'un concurrent
					'controller': 'Controllers_CompetitorsController',
					'function' : 'delete'
				},
				'modules': {
					'': { //recuperation de la liste des modules actives pour un concurrent
						'controller': 'Controllers_UserModuleController',
						'function' : 'getList'
					},
					'add': { //ajout d'un module a un concurrent
						'controller': 'Controllers_UserModuleController',
						'function' : 'add'
					},
					'delete': { //suppression d'un module pour un concurrent
						'controller': 'Controllers_UserModuleController',
						'function' : 'delete'
					}
				}
			}
		},
		'modules': {
			'': { //retourne la liste des modules disponibles
				'controller': 'Controllers_ModuleController',
				'function' : 'getList'
			},
			'configuration': { //retourne les champs necessaires pour l'ajout d'un module
				'controller': 'Controllers_ModuleController',
				'function' : 'getConfiguration'
			}
		}
	}

	/**
	*	Effectue une fonction en fonction de l'url demandee
	*/
	this.exec = function() {
		var urlParts = this.url.split('?');
		var uriParts = urlParts[0].split('/'); //parties de l'url
		var error404 = false;
		var object = this.routes;
		var i = 1;

		while (!error404 && i < uriParts.length) { //pour les parametres de l'url
			if (object[uriParts[i]]) { //si parametre trouve
				object = object[uriParts[i]];
			} else if (object.controller) { //on a trouve le bon controller
				break;
			} else { //pas de controller pour cet url
				error404 = true;
			}			
			i++;
		}
		if (error404 || !object.controller) { //rien de trouve pour l'url
			fatalError("404");
		} else { //on execute la bonne fonction
			var controller = InstancesController.getInstance(object.controller);
			controller[object.function]();
		}
	}
	
	/**
	*	GETTERS et SETTERS
	*/
	this.getUrl = function() {
		return this.url;
	}
	this.setUrl = function(url) {
		this.url = url;
	}

	//retourne l'url sans les arguments GET
	this.getUri = function() {
		var parts = this.getUrl().split('?');
		return parts[0];
	}

}

exports.controller = Core_Routes_Routes;