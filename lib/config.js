var getConfig = function() {

	var env = {};

	console.log("Configuring application environment variables...");
	console.log("Searching for environment...");

	var environment;
	if (process.env.OPENSHIFT_NODEJS_IP)
	{
		console.log("-> Production environment found");
		environment = "production_";
	} else {
		console.log("-> Staging environment found");
		environment = "staging_";
	}

	console.log("\nLoading database properties...");
	database = require("./" + environment + "database");
	env.database = database;
	console.log("-> Done");

	console.log("\n");
	return env;
}

exports.getConfig = getConfig;
