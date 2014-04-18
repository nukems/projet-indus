function Core_Utils_TextController() {

	this.caracs = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "_", "/"];

	/**
	*	Genere une cle aleatoire de longueur length contenant les caracteres de "caracs"
	*/
	this.generateKey = function(length) {
		var key = '';
		for (var i = 0; i < length; i++) {
			key += this.caracs[Math.floor(Math.random() * this.caracs.length)];
		}
		return key;
	}

	/**
	*	Crypte une chaine de caractere avec l'algo sha-256
	*/
	this.crypte = function(text) {
		var crypto = require('crypto');
		return crypto.createHash('sha256').update(text).digest('hex');
	}

}

exports.controller = Core_Utils_TextController;