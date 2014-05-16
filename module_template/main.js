var ConfigChecker = require('./../../back/ConfigChecker.js');

function execute(callback) {
	console.log("Execution du module");

	ConfigChecker.get("module", function(link){

		for(var i = 0; i < link.length; i++)
		{

		}
	});

}

function checkAdd(fields, callback) {
	callback(true);
}

exports.execute = execute;
exports.checkAdd = checkAdd;