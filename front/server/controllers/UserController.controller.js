function Controllers_UserController() {

	/**
	*	Initialisation de l'utilisateur quand token non null
	*/
	this.init = function(callback) {
		if (POST.token) {
			InstancesController.getInstance("Entities_User").getUserForToken(POST.token, function() {
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
			userController.getUserForId(id, function() {
				userController.updateToken(function() {
					Ajax.setData({
						'token': userController.getToken(),
						'name': userController.getName(),
						'firstName': userController.getFirstName(),
						'mail': userController.getMail()
					}).send();
				});
			});
		}

		if (mail == null || password == null || mail == '' || password == '') {
			Ajax.setError("Il faut remplir tous les champs").send();;
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
}

exports.controller = Controllers_UserController;