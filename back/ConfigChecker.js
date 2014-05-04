/*
 *   Get all the connectors of each competitors of each users which match the module name passed in parameter
 */
function get(module_name, callback) {
	var module_info = [];

	InstancesController.getInstance('Core_Database').getCollection("user").find({"competitors.connectors.module_name" : module_name},{"_id" : 1, "competitors.connectors.config_fields" : 1, "competitors.connectors._id" : 1, "competitors._id" : 1}).toArray(function(err, module){
		if(err == null || module != null)
		{
			for(var i = 0; i < module.length; i++)
			{
				var competitors = module[i].competitors;
				for(var j = 0; j < competitors.length; j++)
				{
					var connectors = competitors[j].connectors;
					for(var k = 0; k < connectors.length; k++)
						module_info.push({"user_id" : module[i]._id, "competitor_id" : competitors[j]._id, "connector_id" : connectors[k]._id, "fields" : connectors[k].config_fields});
				}
			}
			callback(module_info);
		}
	});
};

/*
 *   Add a new data in the user data's collection
 */
function add(constraints, data, callback) {

	//Get the module config file
	var file_config = require('../modules/' + constraints.module_name + '/config_back.js');
	var config = file_config.config;

	//Check if each config's info field matches a data's info field
	var dataCheck = checkAllFields(getTypeObject(config, constraints.type_name), data);

	if(dataCheck == 1)
	{
		InstancesController.getInstance('Core_Database').getCollection("user_" + constraints.user_id).insert(data, function(err, result){
			if(err == null | result != null)
				console.log("Data has been added");
			else
				console.log("Error : Data has not been added");

			callback();
		});
	}
	else if(dataCheck == 0)
	{
		console.log("Error : All config's fields don't match");
		callback();
	}
	else if(dataCheck == -1)
	{
		console.log("Error : Type name isn't find in the config file");
		callback();
	}
	else
	{
		console.log("Error script");
		callback();
	}
};

/*
 *	 Replace a data by the new one if find or create a new data in the user data's collection
 */
function update(constraints, data, callback) {

	//Get the module config file
	var file_config = require('../modules/' + constraints.module_name + '/config_back.js');
	var config = file_config.config;

	//Check if each config's info field matches a data's info field
	var dataCheck = checkAllFields(getTypeObject(config, constraints.type_name), data);

	if(dataCheck == 1)
	{
		var key = 'info.' + constraints.field;
		var arr = {};
		arr[key] = data.info[constraints.field];
		arr["type"] = constraints.type_name;

		InstancesController.getInstance('Core_Database').getCollection("user_" + constraints.user_id).update(arr, data, {upsert: true}, function(err, result){callback();});
	}
	else if(dataCheck == 0)
	{
		console.log("Error : All config's fields don't match");
		callback();
	}
	else if(dataCheck == -1)
	{
		console.log("Error : Type name isn't find in the config file");
		callback();
	}
	else
	{
		console.log("Error script");
		callback();
	}

};

/*
 *   Compare all the config's fields with the data's info fields
 */
function checkAllFields(typeObject, data)
{
	if(typeObject != null)
	{
		//Check if each fields are present and define in the data object
		for(var i = 0; i < typeObject.fields.length; i++)
		{
			if(data.info[typeObject.fields[i]] == null)
			{	
				console.log("Problem on " + typeObject.fields[i])
				return 0;
			}
		}

		return 1;
	}
	else
		return -1;
};

/*
 *   Get the JSON Object which includes all the fields
 */
function getTypeObject(config, type_name) {
	var typeObject = null;

	for(var i = 0; i < config.type.length; i++)
	{
		if(config.type[i].name == type_name)
			typeObject = config.type[i];
	}

	return typeObject;
};

exports.get = get;
exports.add = add;
exports.update = update;