function Controllers_CompetitorController() {

	/**
	*	Retourne le dashboard pour un concurrent
	*/
	this.getCompetitorDashboard = function(instances) {
		var Ajax = instances.getInstance('Core_Ajax');

		try {
			var competitorId = instances.getPost().data.id;
			var competitorController = instances.getInstance("Entities_Competitor");
			competitorController.setInstances(instances);
			
			competitorController.getDataForCompetitor(competitorId, function(competitor) {
				if (competitor == null) {
					Ajax.setError("Le concurrent n'existe pas").send();
				} else {
					Ajax.setData({"competitor": competitor}).send();
				}
			});
		} catch(err) {
			fatalError(err);
		}
	}

}

exports.controller = Controllers_CompetitorController;