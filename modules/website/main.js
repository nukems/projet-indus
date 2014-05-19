var exec = require('child_process').exec;
var ConfigChecker = require('./../../back/ConfigChecker.js');
global.env = require("./../../lib/config.js").getConfig();

var DIFF_CSS = "Mise en page";
var DIFF_IMG = "Image";
var DIFF_TXT = "Contenu";
var DIFF_FCT = "Fonctionnalité";
var DIFF_GLB = "Contenu";

var counter = 0;

function execute(callback)
{
	console.log("Execution du module website");

	ConfigChecker.get("website", function(linkWebsite)
	{
		for(var i = 0; i < linkWebsite.length; i++)
		{
			//console.log("base");
			//console.log(linkWebsite[i]);

			if(!isHttps(linkWebsite[i].fields.pageName))
			{
				linkWebsite[i].fields.pageName = setHttpIfNot(linkWebsite[i].fields.pageName);
			}

			doWebsitePullRequest(linkWebsite, i, callback);
		}

	});

}

function checkCallback(callback)
{
	if(counter == 0)
	{
		callback();
	}
}

function doWebsitePullRequest(data, index, callback)
{
	counter++;
	exec('curl -X GET ' + data[index].fields.pageName, function(error, stdout, stderr)
	{
		var date = new Date();

		var client = require('mongodb').MongoClient;
		Database = InstancesController.getInstance('Core_Database');
		Database.connect(function()
		{
			var collection = Database.getCollection('user_' + data[index].user_id);
			collection.find({"connector_id": data[index].connector_id}, {}, {"limit": 1, "sort": [
				["date", "desc"]
			]}).toArray(function(err, items)
				{
					if(items.length == 0)
					{
						var dataWebsitePage = {
							"connector_name": "website",
							"type"          : "content",
							"date"          : new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0),
							"competitor_id" : data[index].competitor_id,
							"connector_id"  : data[index].connector_id,
							"info"          : {"page": stdout, "update_type": DIFF_GLB, "url": data[index].fields.pageName}
						};

						var constraints = {
							"user_id"    : data[index].user_id,
							"module_name": "website",
							"type_name"  : "content",
							"fields"     : {
								"date"        : new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0),
								"connector_id": data[index].connector_id
							}
						};

						ConfigChecker.update(constraints, dataWebsitePage, function()
						{
							console.log('First added data for ' + data[index].connector_id);
							counter--;
							checkCallback(callback);
						});
					}
					else
					{
						var old_content = items[0].info.page;
						var result = newPageIsDifferent(old_content, stdout);

						console.log(data[index].connector_id + " : " + result);

						if(result)
						{
							var dataWebsitePage = {
								"connector_name": "website",
								"type"          : "content",
								"date"          : new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0),
								"competitor_id" : data[index].competitor_id,
								"connector_id"  : data[index].connector_id,
								"info"          : {"page": stdout, "update_type": result, "url": data[index].fields.pageName}
							};

							var constraints = {
								"user_id"    : data[index].user_id,
								"module_name": "website",
								"type_name"  : "content",
								"fields"     : {
									"date"        : new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0),
									"connector_id": data[index].connector_id
								}
							};

							ConfigChecker.update(constraints, dataWebsitePage, function()
							{
								console.log('Updated page content');
								counter--;
								checkCallback(callback);
							});
						}

					}
				});
		});

		/*
		 get(Ajax).send('user/competitors/modules/get', {"connector_id": self.connectorId,
		 "moduleName"                                          : "website",
		 "where"                                               : {},
		 "options"                                             : {"sort": {"date": -1}, "limit": 1}},
		 function(data)
		 {
		 console.log('data : ' + data);



		 }
		 );*/
	});
}

function newPageIsDifferent(oldPage, newPage)
{
	var xmldoc = require('xmldoc');
	var oldXml = new xmldoc.XmlDocument(oldPage);
	var newXml = new xmldoc.XmlDocument(newPage);

	if(oldXml.childNamed("html") == null || newXml.childNamed("html") == null)
	{
		return DIFF_GLB;
	}

	var oldHead = oldXml.childNamed("html").childNamed("head");
	var newHead = newXml.childNamed("html").childNamed("head");

	if(oldHead == null || newHead == null)
	{
		return DIFF_GLB;
	}

	if(oldHead.childrenNamed("link").length != newHead.childrenNamed("link").length)
	{
		return DIFF_CSS;
	}
	else if(oldHead.childrenNamed("script").length != newHead.childrenNamed("script").length)
	{
		return DIFF_FCT;
	}
	else
	{
		var oldBody = oldXml.childNamed("html").childNamed("body");
		var newBody = newXml.childNamed("html").childNamed("body");

		var result = nodesAreDifferents(oldBody, newBody);
		if(result)
		{
			return result;
		}
	}
}

function nodesAreDifferents(oldNode, newNode)
{
	if(oldNode.children.length == 0 || newNode.children.length == 0)
	{
		if(oldNode.children.length == 0 && newNode.children.length == 0)
		{
			if(oldNode.name == 'src' && newNode.name == 'src')
			{
				if(oldNode.attr.src != newNode.attr.src)
				{
					return DIFF_IMG;
				}
			}
			if(oldNode.value != newNode.value)
			{
				return DIFF_TXT;
			}
		}
		else
		{
			return DIFF_GLB;
		}
	}

	if(oldNode.children.length != newNode.children.length)
	{
		return DIFF_GLB;
	}
	else
	{
		for(var i = 0; i < oldNode.children.length; i++)
		{
			var result = nodesAreDifferents(oldNode.children[i], newNode.children[i]);
			if(result)
			{
				return result;
			}
		}
	}
}

function isHttps(url)
{
	if(url.length < 8)
	{
		return false;
	}
	else if(url.substring(0, 8) == 'https://')
	{
		return true;
	}
	else
	{
		return false;
	}
}

function setHttpIfNot(url)
{
	if(url.length < 7)
	{
		return "http://" + url;
	}
	else if(url.substring(0, 7) == "http://")
	{
		return url;
	}
	else
	{
		return "http://" + url;
	}
}

function checkAdd(fields, callback)
{
	exec('curl -sL -w "%{http_code}" ' + fields.pageName + ' -o /dev/null &', function(error, stdout, stderr)
	{
		console.log(stdout);
		console.log(stderr);
		if(stdout == '200' || stdout == '302')
		{
			if(fields.displayName != '')
			{
				callback(true);
			}
			else
			{
				callback("Le nom de la page est incorrect");
			}
		}
		else
		{
			callback("La page n'existe pas.");
		}
	});
}

exports.execute = execute;
exports.checkAdd = checkAdd;