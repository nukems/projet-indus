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
		$('#dashboardConnectorsList').html('');
		var html ='<h1 id="addConnectorH1">Ajouter un connecteur au concurrent ' + get(Competitor).getName() + '</h1>';
		for (var key in modules) {
			html += '<div id="' + key + '" class="addConnectorChoice">' + 
						'<h2 id="' + key + '" class="addConnectorChoiceButton">' + modules[key].name + '</h2>' + 
						modules[key].description + 
						'<div id="' + key + 'AddForm" class="addConnectorForm"></div>' +
					'</div>';
		}
		$('#dashboardContent').html(html);
	}

	//affichage des champs à ajouter pour un module
	this.displayAdd = function(module) {
		var html = '<hr />' + 
				   '<form method="post" id="addConnectorForm">' +
				   '<div id="addConnectorError" class="formError"></div>';
		for(var key in module.fields) {
			html += '<div class="addConnectorInputDiv">' +
						'<label for="' + key + '">' + module.fields[key].name + ' : </label>' + 
						'<div class="inputDescription">' + module.fields[key].description + '</div>' + 
						'<input type="text" class="addConnectorInput" name="' + key + '" id="' + key + 'InputAddConnector"/>' + 
					'</div>';
		}
		html += '<button type="submit" class="green">Ajouter le connecteur</button> ou ' + 
				'<a href="#!" id="cancelAddConnector">Annuler</a>';
		$('#' + self.getConnectorName() + 'AddForm').html(html);
	}

	this.resetAdd = function() {
		$('.addConnectorForm').html('');
	}

	/**
	*	EVENTS
	*/
	this.listEvents = function() {
		$('.addConnectorChoiceButton').off().click(function() {
			self.resetAdd();
			self.setConnectorName($(this).attr('id'));
			self.getFieldsForAdd();
		})
	}

	this.addEvents = function() {
		$('#cancelAddConnector').off().click(function() {
			self.resetAdd();
			return false;
		});
		$('#addConnectorForm').submit(function() {
			self.addConnector();
			return false;
		});
	}

	/**
	*	REQUESTS
	*/
	//requete permettant de recuperer la liste des modules
	this.getList = function() {
		$('#dashboardContent').html(get(Animations).getLoaderDiv());
		get(Ajax).send('modules/', null, self.getListCallback);
	}
	this.getListCallback = function(data) {
		self.displayList(data.data.modules);
		self.listEvents();
	}

	//requete permettant de recuperer les champs pour le module a ajouter
	this.getFieldsForAdd = function() {
		$('#' + self.getConnectorName() + 'AddForm').html(get(Animations).getLoaderDiv());
		get(Ajax).send('modules/configuration', {"name": self.getConnectorName()}, self.getFieldsForAddCallback);
	}
	this.getFieldsForAddCallback = function(data) {
		if (parseInt(data.error, 10) != 0) {
			get(Animations).displayNotification(data.data);
		} else {
			self.displayAdd(data.data.module);
			self.addEvents();
		}
	}

	this.addConnector = function() {
		$('#addConnectorForm button, #cancelAddConnector').attr('disabled', 'disabled');
		var data = {
			competitorId: get(Competitor).getId(),
			moduleName: self.getConnectorName(),
			fields: self.getFields()
		}
		get(Ajax).send('user/competitors/modules/add', data, self.addConnectorCallback);
	}
	this.getFields = function() {
		var fields = {};
		$('.addConnectorInput').each(function(index) {
			fields[$(this).attr('name')] = $(this).val();
		});
		return fields;
	}
	this.addConnectorCallback = function(data) {
		$('#addConnectorForm button, #cancelAddConnector').removeAttr('disabled');
		if (parseInt(data.error, 10) == 0) {
			get(Competitor).init(get(Competitor).getId());
			get(Animations).displayNotification("Connecteur ajouté avec succès");
		} else {
			$('#addConnectorError').html(data.data);
		}
	}

	this.delete = function(id) {
		$('#dashboardContent').html(get(Animations).getLoaderDiv());
		var data = {
			competitorId: get(Competitor).getId(),
			moduleId: id
		}
		get(Ajax).send('user/competitors/modules/delete', data, self.deleteCallback);
	}
	this.deleteCallback = function(data) {
		if (parseInt(data.error, 10) == 0) {
			get(Animations).displayNotification("Connecteur supprimé avec succès");
			get(Competitor).init(get(Competitor).getId());
		} else {
			get(Animations).displayNotification(data.data);
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