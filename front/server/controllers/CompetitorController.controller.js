function Controllers_CompetitorController() {

	/**
	*	Retourne le dashboard pour un concurrent
	*/
	this.getCompetitorDashboard = function() {
		var competitorId = POST.data.id;
		var competitorController = InstancesController.getInstance("Entities_Competitor");
		competitorController.getDataForCompetitor(competitorId, function(competitor) {
			if (competitor == null) {
				Ajax.setError("Le concurrent n'existe pas").send();
			} else {
				Ajax.setData({"competitor": competitor}).send();
			}
		});
	}

}

exports.controller = Controllers_CompetitorController;