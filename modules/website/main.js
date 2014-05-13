var exec = require('child_process').exec;
var ConfigChecker = require('./../../back/ConfigChecker.js');

function execute(callback)
{
	console.log("Execution du module website");

	ConfigChecker.get("website", function(linkWebsite)
	{
		for(var i = 0; i < linkWebsite.length; i++)
		{
			console.log(linkWebsite[i]);

			if(!isHttps(linkWebsite[i].fields.pageName))
			{
				linkWebsite[i].fields.pageName = setHttpIfNot(linkWebsite[i].fields.pageName);
			}

			doWebsitePullRequest(linkWebsite, i, callback);
		}

	});

}

function doWebsitePullRequest(data, index, callback)
{
	exec('curl -X GET ' + data[index].fields.pageName, function(error, stdout, stderr)
	{
		var date = new Date();

		var dataWebsitePage = {
			"connector_name": "website",
			"type"          : "content",
			"date"          : new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0),
			"competitor_id" : data[index].competitor_id,
			"connector_id"  : data[index].connector_id,
			"info"          : {"page": stdout}
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
			console.log('upsert done');
		});
	});
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

exports.execute = execute;
