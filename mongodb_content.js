db.createCollection("Connector_facebook");
db.Connector_facebook.insert({"name" : "facebook", "folder_url" : "facebook"});

db.createCollection("Connector_website");
db.Connector_facebook.insert({"name" : "website", "folder_url" : "website"});

db.createCollection("Customer_InfoTracking");
db.Customer_InfoTracking.insert({
	"name" : "YOT", 
	"firstname" : "Kévin", 
	"mail" : "kevin.yot@gmail.com", 
	"password" : "sha1pwd", 
	"creation_date" : new Date(), 
	"last_connection_date" : new Date(),
	"competitors" : [
		{
			"_id" : new ObjectId(),
			"name" : "Smart Tram",
			"added_date" : new Date(),
			"website_url" : "http://mysmarttransport.fr/montpellier.php",
			"connectors" : [
			
			]
		},
		{
			"_id" : new ObjectId(),
			"name" : "Tramway et métro de Lyon",
			"added_date" : new Date(),
			"website_url" : "http://www.tcl.fr/",
			"connectors" : [
			]
		}
	]
});