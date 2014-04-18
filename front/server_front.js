global.http = require('http');
global.url = require('url');

var server = http.createServer(function(req, res) {
	global.req = req;
	global.res = res;
	getPostData(init);
});

server.listen(8080);

/**
*	Recuperation des donnees POST de la requete
*/
function getPostData(callback) {
	var qs = require('querystring');
    var body = '';
    req.on('data', function (data) {
        body += data;
    });
    req.on('end', function () {
        global.POST = qs.parse(body);
        if (POST.data) {
        	POST.data = JSON.parse(POST.data);
        }
        callback(req, res);
    });
}

/**
*	Initialisation du serveur pour la requete
*	Execution du code 
*/
function init() {
	//initialisation de l'autoload
	var i = require('./server/core/Instances.controller').controller;
	global.InstancesController = new i();

	//initialisation de la gestion des routes
	global.RoutesController = InstancesController.getInstance('Core_Routes_Routes');
	RoutesController.setUrl(req.url);
	//url de l'application
	global.host = "http://" + req.headers.host + "/";

	//initialisation des evenements
	global.EventEmitter = require('events').EventEmitter;

	var isAjax = POST.isAjax; //si ajax, un Flag dans les donnees POST permet de le determiner
	
	if(isAjax) { //c'est une requete ajax
		ajaxInit();
	} else { //c'est une requete normale, on envoi juste le code de base de la page ou un element statique (image, ...)
		var StaticController = InstancesController.getInstance('Core_Routes_Static');
		StaticController.exec();
	}
}

/**
*	Initialisation du serveur pour une requete ajax
*/
function ajaxInit() {
	//initialisation de la connexion avec le base de donnees
	var db = InstancesController.getInstance('Core_Database');
	db.connect(function() {
		global.Ajax = InstancesController.getInstance('Core_Ajax');
		//autoconnexion si token indique
		InstancesController.getInstance('Controllers_UserController').init(function() {
			RoutesController.exec(); //on execute le code de la route appelee
		});
	});
}