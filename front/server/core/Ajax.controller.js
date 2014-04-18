function Core_Ajax() {

	var self = this;

	//defini si la requete ajax est un succes ou non
	this.error = 0;
	this.data;

	/**
	*	Terminer la requete au serveur et envoyer des donnees
	*/
	this.send = function() {
		InstancesController.getInstance('Core_Database').close();
		var dataToSend = {
			"error": this.error,
			"data": self.data
		};
		res.writeHead(200, {"Content-Type": "text/html"});
		res.end(JSON.stringify(dataToSend));
	}

	/**
	*	Modifier les donnees
	*/
	this.setData = function(data) {
		this.data = data;
		this.error = 0;
		return this;
	}

	/**
	*	Erreur
	*/
	this.setError = function(data) {
		this.data = data;
		this.error = 1;
		return this;
	}

}

exports.controller = Core_Ajax;