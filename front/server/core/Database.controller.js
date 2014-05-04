function Core_Database() {

	var self = this;

	this.client = null;
	this.connexion = null;

	this.host = env.database.host;
	this.port = env.database.port;
	this.username = env.database.username;
	this.password = env.database.password;
	this.db = env.database.basename;

	/**
	*	Connexion a la base de donnees mongodb
	*/
	this.connect = function(callback) {
		self.client = require('mongodb').MongoClient;
		self.client.connect("mongodb://" + self.username + ":" + self.password + "@" + self.host + ":" + self.port + "/" + self.db, function(err, db) {
			if (err != null) {
				fatalError("Error connecting database : " + err);
			}
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
		var collection = this.connexion.collection(collectionName);
		if(collection == null) {
			fatalError("La collection demandée n'existe pas");
		} else {
			return collection;
		}
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
        	if (err != null || result == 0) {
        		fatalError("Impossible d'incrementer le compteur " + counter);
        	} else {
        		self.getCollection("counters").findOne({ "_id": counter }, function(err, item) {
        			if (err != null || item == null) {
        				fatalError("Impossible de recuperer le compteur " + counter);
        			} else {
	        			callback(item.seq);
	        		}
	      		});
        	}
        	
		});
	}

}

exports.controller = Core_Database;