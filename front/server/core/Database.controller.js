function Core_Database() {

	var self = this;

	this.client = null;
	this.connexion = null;

	this.host = "localhost";
	this.port = "27017";
	this.db = "veille_concurentielle";

	/**
	*	Connexion a la base de donnees mongodb
	*/
	this.connect = function(callback) {
		this.client = require('mongodb').MongoClient;

		this.client.connect("mongodb://" + this.host + ":" + this.port + "/" + this.db, function(err, db) {
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

}

exports.controller = Core_Database;