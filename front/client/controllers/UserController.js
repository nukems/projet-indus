function UserController() {

	var self = this;

	//initilisation d'un utilisateur : autoconnexion
	this.init = function() {
		var autologinKey = get(Cookie).val('autologin');
		if (autologinKey != null) { //cle d'autoconnexion trouvee
			self.autoLogInRequest(autologinKey);
		}
	}

	this.logIn = function() {
		$('#content').html(self.displayLogIn());
		self.logInEvents();
	}

	this.signIn = function() {
		$('#content').html(self.displaySignIn());
		self.signInEvents();
	}

	/**
	*	AFFICHAGE
	*/
	this.displayLogIn = function() {
		var html = '<form method="post" id="logInForm">' + 
						'<div id="logInError"></div>' +
						'<label for="logInMail">Adresse mail :</label>' + 
						'<input type="text" name="logInMail" id="logInMail"/>' +
						'<br />' + 
						'<label for="logInPassword">Mot de passe :</label>' + 
						'<input type="password" name="logInPassword" id="logInPassword"/>' +
						'<br />' + 
						'<button type="submit">Se connecter</button>' +
						'<p>' + 
							'<a href="#!/inscription" class="link">Inscription</a>' +
						'</p>' +
					'</form>';
		return html;
	}

	this.displaySignIn = function() {
		var html = '<form method="post" id="signInForm">' + 
						'<div id="signInError"></div>' +
						'<label for="signInName">Nom : </label>' + 
						'<input type="text" name="signInName" id="signInName"/>' +
						'<br />' +
						'<label for="signInName">Prénom : </label>' + 
						'<input type="text" name="signInFirstName" id="signInFirstName"/>' +
						'<br />' +
						'<label for="signInName">Adresse mail : </label>' + 
						'<input type="text" name="signInMail" id="signInMail"/>' +
						'<br />' +
						'<label for="signInName">Mot de passe : </label>' + 
						'<input type="text" name="signInPassword" id="signInPassword"/>' +
						'<br />' +
						'<label for="signInName">Confirmation : </label>' + 
						'<input type="text" name="signInConfirm" id="signInConfirm"/>' +
						'<br />' +
						'<button type="submit">S\'inscrire</button>' +
						'<p>' + 
							'<a href="#!" class="link">Se connecter</a>' +
						'</p>' +
					'</form>';
		return html;
	}

	/**
	*	EVENEMENTS
	*/
	this.logInEvents = function() {
		$('#logInForm').submit(function() {
			self.logInRequest();
			return false;
		});
	}

	this.signInEvents = function() {
		$('#signInForm').submit(function() {
			self.signInRequest();
			return false;
		})
	}

	/**
	*	REQUETES
	*/
	this.logInRequest = function() {
		var data = {
			mail: $('#logInMail').val(),
			password: $('#logInPassword').val()
		};
		get(Ajax).send('user/log-in', data, self.logInCallback);
	}
	this.logInCallback = function(data) {
		if (data.error == 1) {
			$('#logInError').html(data.data);
		} else {
			get(User).setToken(data.data.token);
			get(User).setName(data.data.name);
			get(User).setFirstName(data.data.firstName);
			if (data.data.autologin) {
				get(Cookie).create('autologin', data.data.autologin);
			}
			get(Routes).goTo('#!/dashboard');
		}
	}

	this.autoLogInRequest = function(key) {
		get(Ajax).send('user/auto-log-in', {'key': key}, self.autoLogInCallback);
	}
	this.autoLogInCallback = function(data) {
		if (data.error == 0) {
			self.logInCallback(data);
		} else {
			get(Routes).goTo('#!');
		}
	}

	this.signInRequest = function() {

	}

}