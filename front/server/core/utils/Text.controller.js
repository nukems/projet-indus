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

	/**
	*	Verifie le format d'une adresse mail
	*/
	this.validateMail = function(mail) { 
		var atpos = mail.indexOf("@");
		var dotpos = mail.lastIndexOf(".");
		if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= mail.length) {
  			return false;
  		} else {
  			return true;
  		}
	} 

	this.validateURL = function(textval) {
    	var urlregex = new RegExp("^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
      	return urlregex.test(textval);
    }

}

exports.controller = Core_Utils_TextController;