function Controllers_UserModuleController() {

	var self = this;

	/**
	*	Ajoute d'un connecteur a un concurrent
	*/
	this.add = function(instances) {
		var Ajax = instances.getInstance('Core_Ajax');
		var modules = require('../../../modules/modules.js').modules;

		var connectorController = instances.getInstance("Entities_Connector");
		connectorController.setInstances(instances);

		var competitorId = instances.getPost().data.competitorId;
		var moduleName = instances.getPost().data.moduleName;
		var fields = instances.getPost().data.fields;
		try {
			if (!this.checkFields(instances.getPost())) {
				Ajax.setError("Les champs sont incorrects").send();
			} else {
				connectorController.add(competitorId, moduleName, fields, function(result) {
					if (result) {
						Ajax.setData({}).send();
					} else {
						Ajax.setError("Problème lors de l'ajout du connecteur");
					}	
				});
			}
		} catch(err) {
			fatalError(err);
		}
	}

	/**
	*	Verifie que les champs passes pour l'ajout sont les bons et le format de chaque donnee OK
	*/
	this.checkFields = function(POST) {
		var modules = require('../../../modules/modules.js').modules;
		var moduleName = POST.data.moduleName;
		var fields = modules[moduleName].fields;
		var dataFields = POST.data.fields;

		for (var key in fields) {
			if (!dataFields[key]) {
				return false;
			} else {
				return self.checkType(fields[key].type, dataFields[key]);
			}
		}
	}

	/**
	*	Verifie si la donnee @value est bien du type @type
	*	@type vaut string, int
	*	Retourne true si concordance, faux sinon
	*/
	this.checkType = function(type, value) {
		switch(type) {
			case 'string': 
				return typeof value == 'string' && value != '';
				break;
			case 'int':
				return typeof parseInt(value, 10) === 'number' && parseInt(value, 10) != 0
				break;
			default: 
				return false;
		}
	}

	/**
	*	Suppression d'un connecteur pour un concurrent
	*/
	this.delete = function(instances) {
		var Ajax = instances.getInstance('Core_Ajax');
		var competitorId = instances.getPost().data.competitorId;
		var moduleId = instances.getPost().data.moduleId;
		var connectorController = instances.getInstance("Entities_Connector");
		connectorController.setInstances(instances);
		
		connectorController.delete(competitorId, moduleId, function(result) {
			if (result) {
				Ajax.setData({}).send();
			} else {
				Ajax.setError("Problème lors de la suppression du connecteur");
			}	
		});
	}

	/**
	*	Retourne les donnees concernant un module pour un concurrent precis
	*/
	this.get = function(instances) {
		var Ajax = instances.getInstance('Core_Ajax');
		var connectorId = instances.getPost().data.connector_id;
		var where = instances.getPost().data.where;
		var connectorController = instances.getInstance("Entities_Connector");
		connectorController.setInstances(instances);

		connectorController.get(connectorId, where, function(data) {
			Ajax.setData(data).send();
		});

	}

}

exports.controller = Controllers_UserModuleController;