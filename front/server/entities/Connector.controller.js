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

}

exports.controller = Entities_Connector;