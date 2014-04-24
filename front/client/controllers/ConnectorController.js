function Connector() {

	var self = this;

	var connectorName = null;

	this.initAdd = function() {
		self.getList();
	}

	/**
	*	DISPLAY
	*/
	//affichage de la liste des modules
	this.displayList = function(modules) {
		var html = '<h2>Ajouter un module</h2>';
		for (var i = 0; i < modules.length; i++) {
			html += '<a href="#">' + modules[i].name + '</a>';
		}
		$('#dashboardContent').html(html);
	}

	//affichage des champs à ajouter pour un module
	this.displayAdd = function() {

	}

	/**
	*	EVENTS
	*/
	this.listEvents = function() {

	}

	this.addEvents = function() {

	}

	/**
	*	REQUESTS
	*/
	//requete permettant de recuperer la liste des modules
	this.getList = function() {
		get(Ajax).send('modules/', null, self.getListCallback);
	}
	this.getListCallback = function(data) {
		self.displayList(data.data.modules);
		self.listEvents();
	}

	//requete permettant de recuperer les champs pour le module a ajouter
	this.getFieldsForAdd = function() {

	}
	this.getFieldsForAddCallback = function(data) {

	}

}