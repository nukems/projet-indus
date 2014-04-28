function Controllers_UserController() {

	/**
	*	Initialisation de l'utilisateur quand token non null
	*/
	this.init = function(callback) {
		if (POST.token) {
			InstancesController.getInstance("Entities_User").getUserForToken(POST.token, function(result) {
				callback();
			});
		} else {
			callback();
		}

	}

	/**
	*	Connexion depuis le formulaire
	*/
	this.logIn = function() {
		var mail = POST.data.mail;
		var password = POST.data.password;
		var userController = InstancesController.getInstance("Entities_User");

		function log(id) {
			userController.getUserForId(id, function(result) {
				if(result) {
					userController.updateToken(function() {
						if (result) {
							userController.addAutoLogIn(function(autologinKey) {
								Ajax.setData({
									'autologin': autologinKey,
									'token': userController.getToken(),
									'name': userController.getName(),
									'firstName': userController.getFirstName(),
									'mail': userController.getMail()
								}).send();
							});
						} else {
							Ajax.setError("Probleme lors de la connexion").send();
						}
					});
				} else {
					Ajax.setError("Probleme lors de la connexion").send();
				}
			});
		}

		if (mail == null || password == null || mail == '' || password == '') {
			Ajax.setError("Il faut remplir tous les champs").send();
		} else {
			userController.getIdForMailAndPassword(mail, password, function(id) { //on recupere l'id de l'user
				if (id == null) { //identifiants incorrects
					Ajax.setError("Adresse mail ou mot de passe incorrect").send();
				} else {
					log(id);
				}
			});
		}
	}

	/**
	*	Autoconnexion au chargement de la page
	*/
	this.autoLogIn = function() {
		var key = POST.data.key;
		var userController = InstancesController.getInstance("Entities_User");

		userController.getUserForAutoLogIn(key, function(data) {
			if (userController.isLogged()) {
				userController.updateToken(function() {
					Ajax.setData({
						'token': userController.getToken(),
						'name': userController.getName(),
						'firstName': userController.getFirstName(),
						'mail': userController.getMail()
					}).send();
				});
			} else {
				Ajax.setError(1).send();
			}
		});
	}

	/**
	*	Deconnexion d'un utilisateur
	*/
	this.logOut = function() {
		var token = POST.token;
		var userController = InstancesController.getInstance("Entities_User");

		userController.deleteAutoLogIn(function() {
			userController.deleteToken(token, function() {
				userController.token = null;
				Ajax.setData({}).send();
			});
		});
	}

	/**
	*	Inscription d'un nouvel utilisateur
	*/
	this.signIn = function() {
		var name = POST.data.name;
		var firstName = POST.data.firstName;
		var mail = POST.data.mail;
		var password = POST.data.password;
		var passwordConfirm = POST.data.passwordConfirm;
		var userController = InstancesController.getInstance("Entities_User");

		if (name == null || name == '' || firstName == null || firstName == '' || mail == null || mail == '' || password == null || password == '') {
			Ajax.setError("Il faut remplir tous les champs").send();
		} else if (password != passwordConfirm) {
			Ajax.setError("Le mot de passe et la confirmation sont différents").send();
		} else {
			userController.add(name, firstName, mail, password, function(userId) {
				if (userId !== false) {
					userController.addDataCollection(userId, function(result) {
						if (result) {
							Ajax.setData({}).send();
						} else {
							Ajax.setError("Problème lors de la création du compte utilisateur").send();
						}
					});
				} else {
					Ajax.setError("Problème lors de la création du compte").send();
				}
			})
		}
	}
}

exports.controller = Controllers_UserController;