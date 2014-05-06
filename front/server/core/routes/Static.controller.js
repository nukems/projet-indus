function Core_Routes_Static() {

	this.url = null;
	this.extensions = {
		'png': 'image/png',
		'jpeg': 'image/jpeg',
		'jpg': 'image/jpeg',
		'gif': 'image/gif',
		'css': 'text/css',
		'js': 'text/javascript'
	};

	/**
	*	Execute une requete qui n'est pas une requete ajax
	*	Image, ...
	*/
	this.exec = function(instances) {
		var RoutesController = instances.getInstance('Core_Routes_Routes');
		var uri = RoutesController.getUri();
		var uriParts = uri.split('.');
		var extension = uriParts[uriParts.length - 1];

		if (this.isStaticElement(extension)) { //on demande un element statique comme une image ou une page javascript
			this.readStaticElement(instances.getRes(), uri, extension);
		} else { //on demande la page d'accueil
			this.getIndexPage(instances.getRes());
		}
	}

	/**
	*	Regarde si la requete concerne une image ou un element statique
	*/
	this.isStaticElement = function(extension) {
		if (this.getMimeType(extension)) {
			return true;
		} else { //on ne connait pas ce type de fichier
			return false;
		}
	}

	/**
	*	Retourne le mimetype d'un fichier par rapport a son extension
	*	Retourne faux si il n'y a pas de mimetype connu pour cette extension
	*/
	this.getMimeType = function(extension) {
		if (this.extensions[extension]) {
			return this.extensions[extension];
		} else {
			return false;
		}
	}

	/**
	*	Retourne un element statique au client
	*	@uri chemin relatif vers le fichier
	*	@extension l'extension du fichier
	*/
	this.readStaticElement = function(res, uri, extension) {
		try {
			var fs = require('fs');
			var img = fs.readFileSync('./' + uri);
			res.writeHead(200, {'Content-Type': this.getMimeType(extension) });
    		res.end(img);
		} catch(e) {
    		res.writeHead(404);
    		res.end();
    	}   	
	}

	/**
	*	Retourne le code HTML de la page d'accueil
	*/
	this.getIndexPage = function(res) {
		res.writeHead(200, {"Content-Type": "text/html"});
	    res.end('<html lang="fr">' + 
    				'<head>' + 
    					'<meta charset="utf-8" />' +
    					'<title>Projet industriel</title>' +
    					'<link rel="stylesheet" type="text/css" href="' + host + 'client/design/main.css">' + 
    					'<link rel="stylesheet" type="text/css" href="' + host + 'client/design/dashboard.css">' + 
    					'<link rel="stylesheet" type="text/css" href="' + host + 'client/design/user.css">' + 
    					'<link rel="stylesheet" type="text/css" href="' + host + 'client/design/connectors.css">' + 
    					'<script type="text/javascript" src="' + host + 'client/core/libs/jquery.min.js"></script>' + 
    					'<script type="text/javascript" src="' + host + 'client/core/libs/jquery.history.min.js"></script>' + 
    					'<script type="text/javascript" src="' + host + 'client/core/libs/jquery.base64.js"></script>' + 
    					'<script type="text/javascript" src="' + host + 'client/core/libs/canvasjs.min.js"></script>' +
    					'<script type="text/javascript" src="' + host + 'client/core/libs/moment.js"></script>' +
    					'<script type="text/javascript" src="' + host + 'client/core/main.js"></script>' + 
    					'<script type="text/javascript" src="' + host + 'client/core/ajax.js"></script>' + 
    					'<script type="text/javascript" src="' + host + 'client/core/routes.js"></script>' +
    					'<script type="text/javascript" src="' + host + 'client/core/cookie.js"></script>' +
    					'<script type="text/javascript" src="' + host + 'client/core/instances.js"></script>' +
    					'<script type="text/javascript" src="' + host + 'client/core/animations.js"></script>' + 
    					'<script type="text/javascript" src="' + host + 'client/core/window.js"></script>' + 
    					'<script type="text/javascript" src="' + host + 'client/entities/user.js"></script>' + 
    					'<script type="text/javascript" src="' + host + 'client/controllers/UserController.js"></script>' +  
    					'<script type="text/javascript" src="' + host + 'client/controllers/DashboardController.js"></script>' + 
    					'<script type="text/javascript" src="' + host + 'client/controllers/CompetitorController.js"></script>' +  
    					'<script type="text/javascript" src="' + host + 'client/controllers/ConnectorController.js"></script>' +
    					'<script type="text/javascript" src="http://127.0.0.1:8080/modules/facebook/display.js"></script>' +  
    				'</head>' + 
    				'<body>' +
    					'<div id="windows"></div>' +
    					'<div id="notifications"></div>' +
    					'<div id="content"></div>' + 
    				'</body>' + 
    			'</html>');
	}
}

exports.controller = Core_Routes_Static;