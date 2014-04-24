function Core_Database() {

	var self = this;

	this.client = null;
	this.connexion = null;

	this.host = env.database.host;
	this.port = env.database.port;
	this.username = env.database.username;
	this.password = env.database.password;
	this.db = "veille_concurentielle";

	/**
	*	Connexion a la base de donnees mongodb
	*/
	this.connect = function(callback) {
		this.client = require('mongodb').MongoClient;

		this.client.connect("mongodb://" + this.username + ":" + this.password + "@"  + this.host + ":" + this.port + "/" + this.db, function(err, db) {
			self.connexion = db;
			callback();
		});
	}

	/**
	*	Fermeture de la connexion a la base de donnees
	*/
	this.close = function() {
		if (this.connexion != null) {
			this.connexion.close();
			this.connexion = null;
		}
	}

	/**
	*	Retourne la collection demandee
	*	@collectionName nom de la collection
	*/
	this.getCollection = function(collectionName) {
		return this.connexion.collection(collectionName);
	}

	/**
	*	Retourne la connexion a la base de donnees
	*/
	this.getConnexion = function() {
		return this.connexion;
	}

	/**
	*	Incremente un compteur et retourne la nouvelle valeur
	*/
	this.getNextValue = function(counter, callback) {
		self.getCollection("counters").update({ "_id": counter }, { $inc: { seq: 1 } }, 
        function(err, result) {
        	self.getCollection("counters").findOne({ "_id": counter }, function(err, item) {
	        	callback(item.seq);
	      	});
        	
		});
	}

}

exports.controller = Core_Database;
