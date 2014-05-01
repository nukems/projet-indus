/**
*	Simuler l'autoload de PHP
*/
function InstancesController(req, res) {

	this.instances = {};
	
	this.req;
	this.res;
	this.post;

	/**
	*	Renvoi l'instance d'une classe a partir de son nom
	*	Charge le fichier contenant la classe en memoire
	*	Cree une nouvelle instance
	*	Uniquement des singletons
	*/
	this.getInstance = function(classPath) {
		if (!this.instances[classPath]) {
			var i = require(this.getPath(classPath)).controller;
			this.instances[classPath] = new i();
		}
		return this.instances[classPath];
	}

	/**
	*	Retourne le chemin d'une classe en fonction de son nom
	*	Le format du nom de la classe :
	*	Dossier1_Dossier2_NomDeLaClasse
	*/
	this.getPath = function(className) {
		var parts = className.split('_');
		var path = '../';
		for (var i = 0; i < parts.length - 1; i++) {
			path += parts[i].toLowerCase() + '/';
		}
		path += parts[parts.length - 1] + '.controller';
		return path;

	}

	/**
	*	GETTERS et SETTERS
	*/
	this.getReq = function() {
		return this.req;
	}
	this.setReq = function(req) {
		this.req = req;
	}

	this.getRes = function() {
		return this.res;
	}
	this.setRes = function(res) {
		this.res = res;
	}

	this.getPost = function() {
		return this.post;
	}
	this.setPost = function(post) {
		this.post = post;
	}

	
}

exports.controller = InstancesController;