function Core_Routes() {

	var self = this;

	this.url = null;

	/**
	*	Recuperation du module et execution du script principal
	*/
	this.exec = function() {
		var moduleName = self.getUrl();

		try {
			var module = require("../../modules/" + moduleName + "/main.js");
			module.execute(function() {
				console.log('Execution du module '  + moduleName + ' avec succes');
				//fermeture connexion
			});
		} catch (e) {
			console.log("ERROR EXECUTION MODULE : " + e);
			process.exit(0);
		}
	}

	/**
	*	GETTER et SETTER url
	*/
	this.getUrl = function() {
		return this.url;
	}
	this.setUrl = function(url) {
		this.url = url;
	}

}

exports.controller = Core_Routes;