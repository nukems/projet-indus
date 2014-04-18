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
	this.exec = function() {
		var RoutesController = InstancesController.getInstance('Core_Routes_Routes');
		var uri = RoutesController.getUri();
		var uriParts = uri.split('.');
		var extension = uriParts[uriParts.length - 1];

		if (this.isStaticElement(extension)) { //on demande un element statique comme une image ou une page javascript
			this.readStaticElement(uri, extension);
		} else { //on demande la page d'accueil
			this.getIndexPage();
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
	this.readStaticElement = function(uri, extension) { //TODO RAJOUTER GESTION DES ERREURS
		try {
		var fs = require('fs');
		var img = fs.readFileSync('./' + uri);
    	res.writeHead(200, {'Content-Type': this.getMimeType(extension) });
    	res.end(img, 'binary');
    	} catch(e) {
    		res.writeHead(404);
    		res.end();
    	}
	}

	/**
	*	Retourne le code HTML de la page d'accueil
	*/
	this.getIndexPage = function() {
		res.writeHead(200, {"Content-Type": "text/html"});
	    res.end('<html>' + 
    				'<head>' + 
    					'<title>Projet industriel</title>' +
    					'<script type="text/javascript" src="' + host + 'client/core/libs/jquery.min.js"></script>' + 
    					'<script type="text/javascript" src="' + host + 'client/core/libs/jquery.history.min.js"></script>' + 
    					'<script type="text/javascript" src="' + host + 'client/core/libs/jquery.base64.js"></script>' + 
    					'<script type="text/javascript" src="' + host + 'client/core/main.js"></script>' + 
    					'<script type="text/javascript" src="' + host + 'client/core/ajax.js"></script>' + 
    					'<script type="text/javascript" src="' + host + 'client/core/routes.js"></script>' +
    					'<script type="text/javascript" src="' + host + 'client/core/instances.js"></script>' +
    					'<script type="text/javascript" src="' + host + 'client/entities/user.js"></script>' + 
    					'<script type="text/javascript" src="' + host + 'client/controllers/userController.js"></script>' +  
    				'</head>' + 
    				'<body>' +
    					'<div id="content"></div>' + 
    				'</body>' + 
    			'</html>');
	}
}

exports.controller = Core_Routes_Static;