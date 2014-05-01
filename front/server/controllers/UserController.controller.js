function Controllers_UserController() {

	/**
	*	Initialisation de l'utilisateur quand token non null
	*/
	this.init = function(instances, callback) {
		if (instances.getPost().token) {
			var userController = instances.getInstance("Entities_User");
			userController.setInstances(instances);
			userController.getUserForToken(instances.getPost().token, function(result) {
				callback();
			});
		} else {
			callback();
		}

	}

	/**
	*	Connexion depuis le formulaire
	*/
	this.logIn = function(instances) {
		var mail = instances.getPost().data.mail;
		var password = instances.getPost().data.password;
		var userController = instances.getInstance("Entities_User");
		userController.setInstances(instances);
		var Ajax = instances.getInstance('Core_Ajax');

		function log(id) {
			userController.setId(id);
			userController.getUserForId(function(result) {
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
	this.autoLogIn = function(instances) {
		var key = instances.getPost().data.key;
		var userController = instances.getInstance("Entities_User");
		userController.setInstances(instances);
		var Ajax = instances.getInstance('Core_Ajax');

		userController.getUserForAutoLogIn(key, function(data) {
			if (userController.isLogged()) {
				Ajax.setData({
					'token': userController.getToken(),
					'name': userController.getName(),
					'firstName': userController.getFirstName(),
					'mail': userController.getMail()
				}).send();
			} else {
				Ajax.setError(1).send();
			}
		});
	}

	/**
	*	Deconnexion d'un utilisateur
	*/
	this.logOut = function(instances) {
		var token = instances.getPost().token;
		var userController = instances.getInstance("Entities_User");
		userController.setInstances(instances);
		var Ajax = instances.getInstance('Core_Ajax');

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
	this.signIn = function(instances) {
		var name = instances.getPost().data.name;
		var firstName = instances.getPost().data.firstName;
		var mail = instances.getPost().data.mail;
		var password = instances.getPost().data.password;
		var passwordConfirm = instances.getPost().data.passwordConfirm;
		var userController = instances.getInstance("Entities_User");
		userController.setInstances(instances);
		var Ajax = instances.getInstance('Core_Ajax');

		if (name == null || name == '' || firstName == null || firstName == '' || mail == null || mail == '' || password == null || password == '') {
			Ajax.setError("Il faut remplir tous les champs").send();
		} else if (password != passwordConfirm) {
			Ajax.setError("Le mot de passe et la confirmation sont différents").send();
		} else if (!instances.getInstance("Core_Utils_Text").validateMail(mail)) {
			Ajax.setError("Le format de l'adresse mail est incorrect").send();
		} else {
			userController.countMail(mail, function(count) {
				if (count === 0) {
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
					});
				} else {
					Ajax.setError("Cette adresse mail existe déjà, merci d'en choisir une autre").send();
				}
			});
		}
	}
}

exports.controller = Controllers_UserController;