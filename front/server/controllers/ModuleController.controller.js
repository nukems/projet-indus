function Controllers_ModuleController() {

	/**
	*	Retourne la liste des modules disponibles
	*/
	this.getList = function() {
		var modules = require('../../../modules/modules.js').modules;
		Ajax.setData({"modules": modules}).send();
	}

}

exports.controller = Controllers_ModuleController;