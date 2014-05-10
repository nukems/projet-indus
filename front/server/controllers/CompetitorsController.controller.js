function Controllers_CompetitorsController() {

	/**
	*	Retourne la liste des concurrents pour un utilisateur
	*/
	this.getList = function(instances) {
		var Ajax = instances.getInstance('Core_Ajax');
		var competitorController = instances.getInstance("Entities_Competitor");
		competitorController.setInstances(instances);
		competitorController.getAllForUser(function(user) {
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
	this.add = function(instances) {
		var Ajax = instances.getInstance('Core_Ajax');
		var companyName = POST.data.companyName;
		var websiteUrl = POST.data.websiteUrl;
		if (companyName == '') {
			Ajax.setError("Le nom du concurrent est vide").send();
		} else if (websiteUrl != "" && websiteUrl != "http://" && !instances.getInstance("Core_Utils_Text").validateURL(websiteUrl)) {
			Ajax.setError("Le lien renseigné est incorrect").send();
		} else {
			if (websiteUrl == 'http://') {
				websiteUrl = '';
			}
			var competitorController = instances.getInstance("Entities_Competitor");
			competitorController.setInstances(instances);
			competitorController.addCompetitorForUser(companyName, websiteUrl, function(added) {
				if (added === false) {
					Ajax.setError("Impossible d'ajouter le concurrent").send();
				} else {
					Ajax.setData({"id": added}).send();
				}
			});
		}
	}

	/**
	*	Suppression d'un concurrent pour un utilisateur
	*/
	this.delete = function(instances) {
		var Ajax = instances.getInstance('Core_Ajax');
		var competitorId = POST.data.id;
		var competitorController = instances.getInstance("Entities_Competitor");
		competitorController.setInstances(instances);

		competitorController.deleteCompetitorForUser(competitorId, function(deleted) {
			if (deleted == false) {
				Ajax.setError("Impossible de supprimer le concurrent").send();
			} else {
				Ajax.setData({}).send();
			}
		});
	}

}

exports.controller = Controllers_CompetitorsController;