global.http = require('http');
global.url = require('url');

global.env = require("./lib/config.js").getConfig();

var server = http.createServer(function(req, res) {
	try {
		global.req = req;
		global.res = res;
		getPostData(init);
	} catch(err) {
		fatalError(err);
	}
});

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
server.listen( port, ipaddress, function(){
    console.log((new Date()) + ' Server is listening on port ' + port);
});

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
	try {
		//initialisation de l'autoload
		var i = require('./front/server/core/Instances.controller.js').controller;
		global.InstancesController = new i();

		//initialisation de la gestion des routes
		global.RoutesController = InstancesController.getInstance('Core_Routes_Routes');
		RoutesController.setUrl(req.url);
		//url de l'application
		global.host = "http://" + req.headers.host + "/front/";

		//initialisation des evenements
		global.EventEmitter = require('events').EventEmitter;

		var isAjax = POST.isAjax; //si ajax, un Flag dans les donnees POST permet de le determiner
		
		if(isAjax) { //c'est une requete ajax
			ajaxInit();
		} else { //c'est une requete normale, on envoi juste le code de base de la page ou un element statique (image, ...)
			var StaticController = InstancesController.getInstance('Core_Routes_Static');
			StaticController.exec();
		}
	} catch(err) {
		fatalError(err);
	}
}

/**
*	Initialisation du serveur pour une requete ajax
*/
function ajaxInit() {
	try {
		//initialisation de la connexion avec le base de donnees
		var db = InstancesController.getInstance('Core_Database');
		db.connect(function() {
			try {
				global.Ajax = InstancesController.getInstance('Core_Ajax');
				//autoconnexion si token indique
				InstancesController.getInstance('Controllers_UserController').init(function() {
					try {
						RoutesController.exec(); //on execute le code de la route appelee
					} catch(err) {
						fatalError(err);
					}
				});
			} catch (err) {
				fatalError(err);
			}
		});
	} catch (err) {
		fatalError(err);
	}
}

/**
*	Action en cas de crash du serveur
*/
function fatalError(err) {
	console.log("Error !" + "\n" + err);
	var data = {
		'fatalError': 1,
		'error': err
	};

	res.writeHead(200, {"Content-Type": "text/html"});
	res.end(JSON.stringify(data));
}

global.fatalError = fatalError;