function Controllers_CompetitorsController() {

	/**
	*	Retourne la liste des concurrents pour un utilisateur
	*/
	this.getList = function() {
		InstancesController.getInstance("Entities_Competitor").getAllForUser(function(user) {
			//user.competitors = [];
			Ajax.setData({"competitors": user.competitors}).send();
		});
	}

	/**
	*	Ajout d'un concurrent pour un utilisateur
	*/
	this.add = function() {
		var companyName = POST.data.companyName;
		var websiteUrl = POST.data.websiteUrl;
		if (companyName == '') {
			Ajax.setError("Le nom du concurrent est vide").send();
		} else {
			InstancesController.getInstance("Entities_Competitor").addCompetitorForUser(companyName, websiteUrl, function() {
				Ajax.setData({}).send();
			});
		}
	}

	/**
	*	Suppression d'un concurrent pour un utilisateur
	*/
	this.delete = function() {
		var competitorId = POST.data.id;

		InstancesController.getInstance("Entities_Competitor").deleteCompetitorForUser(competitorId, function() {
			Ajax.setData({}).send();
		});
	}

}

exports.controller = Controllers_CompetitorsController;