function Controllers_CompetitorsController() {

	/**
	*	Retourne la liste des concurrents pour un utilisateur
	*/
	this.getList = function() {
		InstancesController.getInstance("Entities_Competitor").getAllForUser(function(user) {
			if (user == null) {
				Ajax.setError("Impossible de récuperer les concurrents").send();
			} else {
				Ajax.setData({"competitors": user.competitors}).send();
			}
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
			InstancesController.getInstance("Entities_Competitor").addCompetitorForUser(companyName, websiteUrl, function(added) {
				if (added == false) {
					Ajax.setError("Impossible d'ajouter le concurrent").send();
				} else {
					Ajax.setData({}).send();
				}
			});
		}
	}

	/**
	*	Suppression d'un concurrent pour un utilisateur
	*/
	this.delete = function() {
		var competitorId = POST.data.id;

		InstancesController.getInstance("Entities_Competitor").deleteCompetitorForUser(competitorId, function(deleted) {
			if (deleted == false) {
				Ajax.setError("Impossible de supprimer le concurrent").send();
			} else {
				Ajax.setData({}).send();
			}
		});
	}

}

exports.controller = Controllers_CompetitorsController;