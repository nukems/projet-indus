function Entities_Competitor() {

	var self = this;

	this.userId = InstancesController.getInstance('Entities_User').getId();

	this.userCollection = InstancesController.getInstance('Core_Database').getCollection('user');

	/**
	*	Retourne la liste de tous les concurrents pour un utilisateur
	*/
	this.getAllForUser = function(callback) {
		self.userCollection.find({'_id': new require('mongodb').ObjectID(self.userId)}, {"competitors": 1}).toArray(function(err, user) {
			callback(user);
		});
	}

	/**
	*	Ajoute un concurrent pour un utilisateur
	*/
	this.addCompetitorForUser = function(companyName, websiteUrl, callback) {
		self.userCollection.update({'_id': new require('mongodb').ObjectID(self.userId)},
								   {$push: {"competitors": { 
								   		"company_name": companyName,
								   		"website_url": websiteUrl,
								   		"added_date": Math.round(+new Date()/1000),
								   		"connectors": [] 
								   }}}, function(err, item) {
								   		console.log(item);
								   });
	}
}

exports.controller = Entities_Competitor;