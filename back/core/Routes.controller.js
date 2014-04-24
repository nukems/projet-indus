function Core_Routes() {

	this.url = null;

	/**
	*	Recuperation du module et execution du script principal
	*/
	this.exec = function() {
		if (this.getUrl() == null) {
			console.log("Requete incorrecte : il faut renseigner une url");
			res.end(-1);
		} else {
			urlParts = this.getUrl().split('/');
			if (urlParts.length == 1) {
				console.log("Requete incorrecte : il faut indiquer le module a executer");
				res.end(-1);
			} 
			var moduleName = urlParts[1];

			if (moduleName != 'favicon.ico') {
				var module = require("../../modules/" + moduleName + "/main.js");
				module.execute(function() {
					console.log('Execution du module '  + moduleName + ' avec succes');
					res.end(0);
				});
			}
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