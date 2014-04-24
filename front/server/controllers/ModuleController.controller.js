function Controllers_ModuleController() {

	var self = this;

	this.modules = require('../../../modules/modules.js').modules;

	/**
	*	Retourne la liste des modules disponibles
	*/
	this.getList = function() {
		Ajax.setData({"modules": self.modules}).send();
	}

	this.getConfiguration = function() {
		var name = POST.data.name;
		var module = self.modules[name];
		if(module != null) {
			Ajax.setData({'module': module}).send();
		} else {
			Ajax.setError("Module introuvable").send();
		}
	}

}

exports.controller = Controllers_ModuleController;