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
		for (var key in modules) {
			html += '<button id="' + key + '" class="addConnectorChoiceButton">' + modules[key].name + '</button><br />' + 
					modules[key].description + '<br /><br />';
		}
		$('#dashboardContent').html(html);
	}

	//affichage des champs à ajouter pour un module
	this.displayAdd = function(module) {
		var html = '<h2>Ajout du module ' + module.name + '</h2>';
		for(var key in module.fields) {
			html += '<div>' +
						'Champ ' + module.fields[key].name + ' : <br />' + 
						module.fields[key].description + '<br />' + 
						'<input type="text" id="' + key + '"/>' + 
					'</div>';
		}
		html += '<button class="green">Ajouter</button>';
		$('#dashboardContent').html(html);
	}

	/**
	*	EVENTS
	*/
	this.listEvents = function() {
		$('.addConnectorChoiceButton').click(function() {
			self.setConnectorName($(this).attr('id'));
			self.getFieldsForAdd();
		})
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
		get(Ajax).send('modules/configuration', {"name": self.getConnectorName()}, self.getFieldsForAddCallback);
	}
	this.getFieldsForAddCallback = function(data) {
		if (parseInt(data.error, 10) != 0) {
			$('#dashboardContent').html(data.data);
		} else {
			self.displayAdd(data.data.module);
			self.addEvents();
		}
	}

	/**
	*	GETTERS et SETTERS
	*/
	this.getConnectorName = function() {
		return self.connectorName;
	}
	this.setConnectorName = function(name) {
		self.connectorName = name;
	}

}