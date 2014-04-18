/**
*	Simuler l'autoload de PHP
*/
function InstancesController() {

	this.instances = {};

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

	
}

exports.controller = InstancesController;