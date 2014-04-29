global.http = require('http');
global.url = require('url');

envObject = require("./lib/config.js");
global.env = envObject.getConfig();

var server = http.createServer(function(req, res) {
	global.req = req;
	global.res = res;
	getPostData(init);
});

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
server.listen( port, ipaddress, function(){
    console.log((new Date()) + ' Server is listening on port ' + port);
});

/**
*	Recuperation des donnees POST de la requete
*	les donnees POST sont accessibles depuis la variable globale POST
*/
function getPostData(callback) {
	var qs = require('querystring');
    var body = '';
    req.on('data', function (data) {
        body += data;
    });
    req.on('end', function () {
        global.POST = qs.parse(body);
        callback(req, res);
    });
}

/**
*	Initialisation du serveur pour la requete
*	Execution du code 
*/
function init() {
	//initialisation de l'autoload
	var i = require('./back/core/Instances.controller.js').controller;
	global.InstancesController = new i();

	//connexion a la base de donnees
	var Database = InstancesController.getInstance('Core_Database');
	Database.connect(function() {
		//initialisation de la gestion des routes
		RoutesController = InstancesController.getInstance('Core_Routes');
		RoutesController.setUrl(req.url);

		//execution de code pour la route
		//donc du module
		RoutesController.exec();
	});
}
