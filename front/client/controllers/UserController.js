function UserController() {

	var self = this;

	//initilisation d'un utilisateur : autoconnexion
	this.init = function(callback) {
		var autologinKey = get(Cookie).val('autologin');
		if (autologinKey != null) { //cle d'autoconnexion trouvee
			self.autoLogInRequest(autologinKey, callback);
		} else {
			callback(0);
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
		var html = '<div id="logoDiv"><img src="front/client/design/pictures/logo.png"/></div>' + 
					'<form method="post" id="logInForm">' + 
						'<h1>Se connecter</h1>' +
						'<div id="logInError" class="formError"></div>' +
						'<label for="logInMail">Adresse mail :</label>' + 
						'<input type="text" name="logInMail" id="logInMail"/>' +
						'<br />' + 
						'<label for="logInPassword">Mot de passe :</label>' + 
						'<input type="password" name="logInPassword" id="logInPassword"/>' +
						'<br />' + 
						'<button type="submit" class="green">Se connecter</button>' +
						' ou <a href="#!/inscription" class="link">s\'inscrire</a>' +
					'</form>';
		return html;
	}

	this.displaySignIn = function() {
		var html = '<div id="logoDiv"><img src="front/client/design/pictures/logo.png"/></div>' + 
					'<form method="post" id="signInForm">' + 
						'<h1>S\'inscrire</h1>' +
						'<div id="signInError" class="formError"></div>' +
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
						'<input type="password" name="signInPassword" id="signInPassword"/>' +
						'<br />' +
						'<label for="signInName">Confirmation : </label>' + 
						'<input type="password" name="signInConfirm" id="signInConfirm"/>' +
						'<br />' +
						'<button type="submit" class="green">S\'inscrire</button>' +
						' ou <a href="#!" class="link">Se connecter</a>' +
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
		$('#logInForm button').attr('disabled', 'disabled');
		var data = {
			mail: $('#logInMail').val(),
			password: $('#logInPassword').val()
		};
		get(Ajax).send('user/log-in', data, self.logInCallback);
	}
	this.logInCallback = function(data) {
		$('#logInForm button').removeAttr('disabled');
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

	this.signInRequest = function() {
		$('#signInForm button').attr('disabled', 'disabled');
		var data = {
			name: $('#signInName').val(),
			firstName: $('#signInFirstName').val(),
			mail: $('#signInMail').val(),
			password: $('#signInPassword').val(),
			passwordConfirm: $('#signInConfirm').val()
		};
		get(Ajax).send('user/sign-in', data, self.signInCallback);
	}
	this.signInCallback = function(data) {
		$('#signInForm button').removeAttr('disabled');
		if (parseInt(data.error, 10) == 1) {
			$('#signInError').html(data.data);
		} else {
			get(Animations).displayNotification('Inscription réussie, vous pouvez dès à présent vous connecter');
			get(Routes).goTo('#!/connexion');
		}
	}

	this.autoLogInRequest = function(key, callback) {
		get(Ajax).send('user/auto-log-in', {'key': key}, function(data) {
			if (data.error == 0) {
				self.logInCallback(data);
				callback(1);
			} else {
				callback(0);
			}
		});
	}
}