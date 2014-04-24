var mongoDB = {
	"competitors" : [
		{
			"id" : 1,
			"company_name" : "Infotracking",
			"connectors" : [
				{
					"name" : "facebook",
					"pagelink" : "/InfoTracking"
				},
				{
					"name" : "Website",
					"pagelink" : "www.infotracking.fr"
				}
			]
		},
		{
			"id" : 2,
			"company_name" : "Spi0n",
			"connectors" : [
				{
					"name" : "facebook",
					"pagelink" : "/Spi0n"
				},
				{
					"name" : "Website",
					"pagelink" : "www.spion.fr"
				}
			]
		}
	]
};

var dataCustomer = {
	"datas" : [
		
	]
};

function get(module_name) {
	var module_info = [];
	
	for(var i = 0; i < mongoDB.competitors.length; i++)
	{
		var competitor = mongoDB.competitors[i];
		
		for(var j = 0; j < competitor.connectors.length; j++)
		{
			var connector = competitor.connectors[j];
			if(connector.name == module_name)
			{
				module_info.push(connector);
			}
		}
	}
	
	return module_info;
};

function add(module_name, type_name, data) {
	
	//Get the module config file
	var file_config = require('../modules/' + module_name + '/config_back.js');
	var config = file_config.config;
	
	var dataCheck = checkAllFields(getTypeObject(config, type_name), data);
	
	if(dataCheck == 1)
		console.log("GG"); //dataCustomer.datas.push(data);
	else if(dataCheck == 0)
		console.log("fields problem");
	else if(dataCheck == -1)
		console.log("type name problem");
	else
		console.log("ERROR SCRIPT");
};

function checkAllFields(typeObject, data)
{	
	if(typeObject != null)
	{
		var fields_count = 0;
		
		//Check if each fields are present and define in the data object
		for(var i = 0; i < typeObject.fields.length; i++)
		{
			var boolean = 0;
			
			for(var j = 0; j < data.info.length; j++)
			{
				if(data.info[j][typeObject.fields[i]])
					boolean = 1;
			}
			
			fields_count += boolean;
		}
		
		if(fields_count == typeObject.fields.length)
			return 1;
		else
			return 0;
	}
	else
		return -1;
};

function getTypeObject(config, type_name) {
	var typeObject = null;
	
	for(var i = 0; i < config.type.length; i++)
	{
		if(config.type[i].name == type_name)
			typeObject = config.type[i];
	}
	
	return typeObject;
};

function update(module_name, type_name, field, data) {
	
	//Get the module config file
	var file_config = require('./modules/' + module_name + '/config_back.js');
	var config = file_config.config_fb;
	
	var dataCheck = checkAllFields(getTypeObject(config, type_name), data);
	
	if(dataCheck == 1)
	{
		for(var i = 0; i < dataCustomer.datas.length; i++)
		{
			if(dataCustomer.datas[i].connector_name == module_name && dataCustomer.datas[i].type == type_name)
			{
				if(dataCustomer.datas[i].info[field] == data.info[field])
				{
					console.log("update");
					return true;
				}
			}
		}
		
		return false;
	}
	else if(dataCheck == 0)
		console.log("fields problem");
	else if(dataCheck == -1)
		console.log("type name problem");
	else
		console.log("ERROR SCRIPT");
	
	return false;
};

exports.get = get;
exports.add = add;
exports.update = update;