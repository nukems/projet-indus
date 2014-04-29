function Controllers_UserModuleController() {

	var self = this;

	/**
	*	Ajoute d'un connecteur a un concurrent
	*/
	this.add = function() {
		var modules = require('../../../modules/modules.js').modules;
		var competitorId = POST.data.competitorId;
		var moduleName = POST.data.moduleName;
		var fields = POST.data.fields;
		try {
			if (!this.checkFields()) {
				Ajax.setError("Les champs sont incorrects").send();
			} else {
				InstancesController.getInstance("Entities_Connector").add(competitorId, moduleName, fields, function(result) {
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
	this.checkFields = function() {
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
	this.delete = function() {
		var competitorId = POST.data.competitorId;
		var moduleId = POST.data.moduleId;
		
		InstancesController.getInstance("Entities_Connector").delete(competitorId, moduleId, function(result) {
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
	this.get = function() {
		var module_name = POST.data.module_name;
		var type_name = POST.data.type_name;
		var connector_id = POST.data.connector_id;
		var where = POST.data.where;

	}

}

exports.controller = Controllers_UserModuleController;