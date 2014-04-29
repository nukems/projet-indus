function Entities_Connector() {

	var self = this;
	this.autoIncrement = 'connector_id';

	this.userId = InstancesController.getInstance('Entities_User').getId();

	this.userCollection = InstancesController.getInstance('Core_Database').getCollection('user');

	/**
	*	Ajoute un connecteur a un concurrent
	*/
	this.add = function(competitorId, moduleName, fields, callback) {
		InstancesController.getInstance("Core_Database").getNextValue(self.autoIncrement, function(connectorId) {
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
	*	@moduleName le nom du module pour lequel on veut des donnees
	*	@typeName le type de donnees a recuperer pour le module
	*	@connectorId l'id du connecteur pour lequel on veut les donnees
	*	@where autres conditions de selection
	*	@callback la fonction a executer apres la requete
	*/
	this.get = function(moduleName, typeName, connectorId, where, callback) {
		var collection = InstancesController.getInstance('Core_Database').getCollection("user_" + self.userId());
		if (collection == null) {
			fatalError("Collection existe pas");
		} else {
			collection.find({"module"}).toArray(function(err, items) {
				callback(items);
			});
		}
	}

}

exports.controller = Entities_Connector;