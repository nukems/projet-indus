function Controllers_CompetitorsController() {

	/**
	*	Retourne la liste des concurrents pour un utilisateur
	*/
	this.getList = function() {
		InstancesController.getInstance("Entities_Competitor").getAllForUser(function(user) {
			user.competitors = [];
			Ajax.setData({"competitors": user.competitors}).send();
		});
	}

	/**
	*	Ajout d'un concurrent pour un utilisateur
	*/
	this.add = function() {

	}

}

exports.controller = Controllers_CompetitorsController;