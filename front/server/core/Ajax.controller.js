function Core_Ajax() {

	var self = this;

	this.instances;

	//defini si la requete ajax est un succes ou non
	this.error = 0;
	this.data;

	/**
	*	Terminer la requete au serveur et envoyer des donnees
	*/
	this.send = function() {
		self.getInstances().getInstance('Core_Database').close();
		var dataToSend = {
			"error": this.error,
			"data": self.data
		};
		self.getInstances().getRes().writeHead(200, {"Content-Type": "text/html"});
		self.getInstances().getRes().end(JSON.stringify(dataToSend));
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

	/**
	*	Ecriture de la reponse
	*	@data un objet JSON
	*/
	this.write = function(data) {
		self.getInstances().getRes().writeHead(200, {"Content-Type": "text/html"});
		self.getInstances().getRes().end(JSON.stringify(data));
	}

	this.getInstances = function() {
		return self.instances;
	}
	this.setInstances = function(instances) {
		self.instances = instances;
	}

}

exports.controller = Core_Ajax;