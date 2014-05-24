global.env = require("./lib/config.js").getConfig();
global.ipaddress = process.env.OPENSHIFT_NODEJS_IP || "5.39.91.227";
global.port = process.env.OPENSHIFT_NODEJS_PORT || 80;

/**
*	Creation du serveur
*	Handle de nouvelles requetes
*/
http = require('http');
var server = http.createServer(function(req, res) {
	console.log("Handle request from " + req.connection.remoteAddress);
	global.host = "http://" + req.headers.host + "/front/";

	try {
		init(req, res);
	} catch(err) {
		fatalError(err);
	}
});

/**
*	Ecoute
*/
server.listen(port, ipaddress, function() {
    console.log((new Date()) + ' Server is listening on port ' + port);
});


/**
*	Recuperation des donnees POST de la requete
*/
function getPost(req, callback) {
	var qs = require('querystring');
    var body = '';
    req.on('data', function (data) {
        body += data;
    });
    req.on('end', function () {
        POST = qs.parse(body);
        if (POST.data) {
        	POST.data = JSON.parse(POST.data);
        }
        callback(POST);
    });
}

/**
*	Initialisation du serveur pour la requete
*	Execution du code 
*/
function init(req, res) {
	try {
		//initialisation de l'autoload
		var i = require('./front/server/core/Instances.controller.js').controller;
		instances = new i();
		instances.setReq(req);
		instances.setRes(res);


		//recuperation des donnees POST
		getPost(req, function(post) {
			instances.setPost(post);
			//initialisation de la gestion des routes
			instances.getInstance('Core_Routes_Routes').setUrl(instances.getReq().url);

			//initialisation ecriture de la reponse
			instances.getInstance('Core_Ajax').setInstances(instances);

			//si ajax, un Flag dans les donnees POST permet de le determiner
			if (post.isAjax) { //c'est une requete ajax
				console.log("AJAX request : " + instances.getReq().url);
				console.log("");
				ajax(instances);
			} else { //c'est une requete normale, on envoi juste le code de base de la page ou un element statique (image, ...)
				console.log("GET " + instances.getReq().url);
				console.log("");
				instances.getInstance('Core_Routes_Static').exec(instances);
			}
		});
	} catch(err) {
		fatalError(err);
	}
}

/**
*	Initialisation du serveur pour une requete ajax
*/
function ajax(instances) {
	try {
		//initialisation de la connexion avec le base de donnees
		var db = instances.getInstance('Core_Database');
		db.connect(function() {
			try {
				//autoconnexion si token indique
				instances.getInstance('Controllers_UserController').init(instances, function() {
					try {
						instances.getInstance('Core_Routes_Routes').exec(instances); //on execute le code de la route appelee
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

	var i = require('./front/server/core/Instances.controller.js').controller;
	var ajaxController = i.getInstance("Core_Ajax");
	ajaxController.write(data);
}

global.fatalError = fatalError;
