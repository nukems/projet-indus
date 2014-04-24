function Entities_Competitor() {

	//autoincrement : competitor_id
	this.autoIncrement = "competitor_id";

	var self = this;

	this.userId = InstancesController.getInstance('Entities_User').getId();

	this.userCollection = InstancesController.getInstance('Core_Database').getCollection('user');

	/**
	*	Retourne la liste de tous les concurrents pour un utilisateur
	*/
	this.getAllForUser = function(callback) {
		self.userCollection.findOne({'_id': new require('mongodb').ObjectID(self.userId)}, {"competitors": 1}, function(err, user) {
			callback(user);
		});
	}

	/**
	*	Ajoute un concurrent pour un utilisateur
	*/
	this.addCompetitorForUser = function(companyName, websiteUrl, callback) {
		InstancesController.getInstance("Core_Database").getNextValue(self.autoIncrement, function(competitorId) {
			self.userCollection.update({'_id': new require('mongodb').ObjectID(self.userId)},
									   {$push: {"competitors": { 
									   			"_id": competitorId,
									   			"company_name": companyName,
									   			"website_url": websiteUrl,
									   			"added_date": Math.round(+new Date()/1000),
									   			"connectors": [] 
									   }}}, 
			function(err, item) {
				callback();
			});	
		});
	}

	/**
	*	Supprime un concurrent pour un utilisateur
	*/
	this.deleteCompetitorForUser = function(id, callback) {
		self.userCollection.update({'_id': new require('mongodb').ObjectID(self.userId)}, {$pull: {"competitors": {"_id": parseInt(id, 10)}}}, function(err, result) {
			callback();
		});
	}

	/**
	*	Retourne les informations pour un concurrent
	*/
	this.getDataForCompetitor = function(competitorId, callback) {
		self.getAllForUser(function(user) {
			var i = 0;
			while (i < user.competitors.length && user.competitors[i]._id != parseInt(competitorId, 10)) {
				i++;
			}
			if (i < user.competitors.length) { //on a trouve le concurrent
				callback(user.competitors[i]);
			} else {
				return null;
			}
		});
	}
}

exports.controller = Entities_Competitor;