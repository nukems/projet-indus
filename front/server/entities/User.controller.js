function Entities_User() {

	var self = this;

	this.id;
	this.token = null;
	this.name;
	this.firstName;
	this.mail;

	this.userCollection = InstancesController.getInstance('Core_Database').getCollection('user');
	this.autoLogInCollection = InstancesController.getInstance('Core_Database').getCollection('auto_log_in');


	/**
	*	Peuple l'utilisateur a partir de la cle d'autologin
	*	Correspond a la connexion auto a l'arrivee sur le site
	*/
	this.getUserForAutoLogIn = function(key, callback) {
		this.autoLogInCollection.findOne({"key": key}, {"userId": 1}, function(err, user) {
			if(err == null && user != null) {
				self.setId(user.userId);
				self.updateToken(function() {
					self.getUserForId(user.userId, callback);
					callback(true);
				});
			} else {
				callback(false);
			}
		});
	}

	/**
	*	Peuple l'utilisateur en fonction du token
	*	Correspond a la reconnexion de l'utilisateur a chaque requete AJAX
	*/
	this.getUserForToken = function(token, callback) {
		this.userCollection.findOne({"token": token}, function(err, user) {
			if (err == null && user != null) {
				self.hydrate(user);
				callback(true);
			} else {
				callback(false);
			}
		});
	}

	/**
	*	Peuple un utilisateur en fonction de son id
	*/
	this.getUserForId = function(id, callback) {
		this.userCollection.findOne({"_id": new require('mongodb').ObjectID(id)}, function(err, user) {
			if (err == null && user != null) {
				self.hydrate(user);
				callback(true);
			} else {
				callback(false);
			}
		});
	}

	/**
	*	Ajoute un utilisateur a la base de donnees
	*/
	this.add = function(name, firstName, mail, password, callback) {
		this.userCollection.insert({"name": name,
									"firstName": firstName,
									"mail": mail,
									"password": InstancesController.getInstance('Core_Utils_Text').crypte(password), 
									"creationDate": Math.round(+new Date()/1000),
									"lastConnectionDate": Math.round(+new Date()/1000),
									"competitors": []}, 
		function(err, user) {
			if (err != null || user == null) {
				callback(false);
			} else {
				callback(user[0]._id);
			}
		});
	}


	/**
	*	Ajoute une collection de donnees pour l'utilisateur
	*/
	this.addDataCollection = function(userId, callback) {
		var collectionName = "user_" + userId;
		InstancesController.getInstance('Core_Database').getConnexion().createCollection(collectionName, function(err, result) {
			if (err != null) {
				callback(false);
			} else {
				callback(true);
			}
		});
	}

	/**
	*	Ajoute une cle d'autoconnexion pour l'user courant
	*/
	this.addAutoLogIn = function(callback) {
		var newKey = InstancesController.getInstance('Core_Utils_Text').generateKey(15);
		this.countAutoLogIn(newKey, function(nb, newKey) {
			if (nb > 0) {
				self.addAutoLogIn(callback);
			} else {
				self.autoLogInCollection.insert({"key": newKey, "userId": self.getId()}, function(err, item) {
					callback(newKey);
				});
			}
		});
	}

	/**
	*	Modifie un token pour l'user courant
	*/
	this.updateToken = function(callback) {
		var newToken = InstancesController.getInstance('Core_Utils_Text').generateKey(15);
		self.countToken(newToken, function(nb, newToken) {
			if (nb > 0) {
				self.addToken(callback);
			} else {
				self.userCollection.update({"_id": new require('mongodb').ObjectID(self.getId())}, {$set: {"token": newToken}}, function(err, result) {
					self.setToken(newToken);
					callback();
				});
			}
		});
	}

	/**
	*	Retourne le nombre de cles identiques dans la collection
	*/
	this.countAutoLogIn = function(key, callback) {
		this.autoLogInCollection.count({"key": key}, function(err, count) {
			callback(count, key);
		});
	}

	/**
	*	Retourne le nombre de tokens identiques dans la collection
	*/
	this.countToken = function(token, callback) {
		this.userCollection.count({"token": token}, function(err, count) {
			callback(count, token);
		});
	}

	/**
	*	Retourne le nombre de mails identiques dans la collection
	*/
	this.countMail = function(mail, callback) {
		this.userCollection.count({"mail": mail}, function(err, count) {
			callback(count);
		});
	}

	/**
	*	Supprime tous les couples autologin/userid de la collection
	*/
	this.deleteAutoLogIn = function(callback) {
		this.autoLogInCollection.remove({"userId": self.getId()}, function(err, nb) {
			callback();
		});
	}

	/**
	*	Supprime le token pour un utilisateur de la collection (mettre le token a null)
	*/
	this.deleteToken = function(token, callback) {
		this.userCollection.update({"token": token}, {$set: {"token": null}}, function(err, result) {
			callback();
		});
	}

	/**
	*	Retourne le nombre d'utilisateurs ayant l'adresse mail identique a celle passee en parametre
	*/
	this.countMail = function(mail, callback) {
		this.userCollection.count({"mail": mail}, function(err, count) {
			callback(count);
		});
	}

	/**
	* 	Retourne l'id d'un utilisateur en fonction de son mail et de son mot de passe
	*/
	this.getIdForMailAndPassword = function(mail, password, callback) {
		this.userCollection.findOne({"mail": mail, "password": InstancesController.getInstance('Core_Utils_Text').crypte(password)}, function(err, user) {
			if (err == null && user && user._id) {
				callback(user._id);
			} else {
				callback(null);
			}
		});
	}

	/**
	*	Retourne vrai si l'utilisateur est logge (token != null)  ou faux sinon
	*/
	this.isLogged = function() {
		return this.token != null;
	}

	/**
	*	GETTERS et SETTERS
	*/
	this.hydrate = function(user) {
		self.setId(user._id);
		self.setName(user.name);
		self.setFirstName(user.firstName);
		self.setMail(user.mail);
		self.setToken(user.token);
	}

	this.getId = function() {
		return this.id;
	}
	this.setId = function(id) {
		this.id = id;
	}

	this.getName = function() {
		return this.name;
	}
	this.setName = function(name) {
		this.name = name;
	}

	this.getFirstName = function() {
		return this.firstName;
	}
	this.setFirstName = function(firstName) {
		this.firstName = firstName;
	}

	this.getMail = function() {
		return this.mail;
	}
	this.setMail = function(mail) {
		this.mail = mail;
	}

	this.getToken = function() {
		return this.token;
	}
	this.setToken = function(token) {
		this.token = token;
	}

}

exports.controller = Entities_User;