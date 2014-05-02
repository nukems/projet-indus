function Core_Routes() {

	var self = this;

	this.url = null;

	/**
	*	Recuperation du module et execution du script principal
	*/
	this.exec = function() {
		var moduleName = self.getUrl();

		if (moduleName == null || moduleName == '')
		{
			console.log('Error in RouteController : no moduleName defined')
			process.exit(0);
		}

		try {
			var module = require("../../modules/" + moduleName + "/main.js");
			var date = new Date().getTime();
			console.log('Execution du module '  + moduleName + ' commencée @ ' + date);

			module.execute(function() {
				console.log('Execution du module '  + moduleName + ' avec succes');
				var date2 = new Date().getTime();
				console.log('Execution du module '  + moduleName + ' terminée @ ' + date2);
				var d = date2 - date;
				console.log('Execution du module '  + moduleName + ' terminée en ' + d);
				//fermeture connexion
				console.log('');
				console.log('Ending init.js');
				console.log('*************************');
				process.exit(0);
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