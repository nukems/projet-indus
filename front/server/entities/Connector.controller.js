function Entities_Connector() {

	var self = this;
	this.autoIncrement = 'connector_id';

	this.instances;

	/**
	*	Ajoute un connecteur a un concurrent
	*/
	this.add = function(competitorId, moduleName, fields, callback) {
		this.getInstances().getInstance("Core_Database").getNextValue(self.autoIncrement, function(connectorId) {
			self.userCollection.update({"_id": new require('mongodb').ObjectID(self.userId),
										"competitors._id": parseInt(competitorId, 10)}, 
									   {
									   		$push: {
									   			'competitors.$.connectors': {
									   				'_id': connectorId,
									   				'module_name': moduleName,
									   				'config_fields': fields,
									   				'addedDate': Math.round(+new Date()/1000),
									   				'lastExecDate': null
									   			}
									   		}
									   }, 
			function(err, result) {
				if (err != null || result == 0) {
					callback(false);
				} else {
					callback(true);
				}
			});
		});
	}

	/**
	*	Suppression d'un connecteur pour un concurrent
	*/
	this.delete = function(competitorId, moduleId, callback) {
		self.userCollection.update({"_id": new require('mongodb').ObjectID(self.userId),
									"competitors._id": parseInt(competitorId, 10)}, 
								   {
								   		$pull: {
								   			'competitors.$.connectors': {
								   				'_id': parseInt(moduleId, 10)
								   			}
								   		}
								   }, 
		function(err, result) {
			if (err != null || result == 0) {
				callback(false);
			} else {
				callback(true);
			}
		});
	}

	/**
	*	Recupere les donnees selon des criteres 
	*	@connectorId l'id du connecteur pour lequel on veut les donnees
	*	@where autres conditions de selection
	*	@callback la fonction a executer apres la requete
	*/
	this.get = function(connectorId, where, callback) {
		//recuperation de la bonne collection
		var collection = this.getInstances().getInstance('Core_Database').getCollection("user_" + self.userId);
		if (collection == null) {
			fatalError("Aucune donnée pour cet utilisateur");
		} else {
			where.connector_id = connectorId
			collection.find(where).toArray(function(err, items) {
				callback(items);
			});
		}
	}

	/**
	*	GETTERS et SETTERS 
	*/
	this.getInstances = function() {
		return this.instances;
	}

	this.setInstances = function(instances) {
		this.instances = instances;
		this.userId = instances.getInstance('Entities_User').getId();
		this.userCollection = instances.getInstance('Core_Database').getCollection('user');
	}
}

exports.controller = Entities_Connector;