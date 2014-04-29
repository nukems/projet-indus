/**
*	Execution du code pour le cron
*/
function init() {
	//initialisation de l'autoload
	var i = require('./core/Instances.controller.js').controller;
	global.InstancesController = new i();

	//connexion a la base de donnees
	Database = InstancesController.getInstance('Core_Database');
	Database.connect(function() {
		//initialisation de la gestion des routes
		RoutesController = InstancesController.getInstance('Core_Routes');
		RoutesController.setUrl(args[2]);

		//execution de code pour la route
		//donc du module
		RoutesController.exec();
	});
}

console.log('*************************');
console.log('Launching init.js');
console.log('');

global.env = require("./../lib/config.js").getConfig();
global.args = [];
process.argv.forEach(function (val, index, array) {
  args.push(val);
});
if (args.length <= 2) {
	console.log("ERROR : parameters missing in args");
	process.exit(0);
} else {
	init();
}

console.log('');
console.log('Ending init.js');
console.log('*************************');